# Chat History Saving for Leads + Switch to Claude — Implementation Plan

## Overview

Every time a lead is created (appointment booking, treatment enquiry, or callback request), we want to:
1. Capture the **complete chat history** between the user and the bot.
2. Pass it as-is in the lead payload to the VPS server.
3. The VPS server forwards `chatHistory` directly to the main Flossly API (`/api/chatbot/createLead`) — the backend **already supports** this field and will display the transcript as a note on the lead detail with `channel: 'chatbot'`.

> **Confirmed with backend team:** `POST /api/chatbot/createLead` accepts `chatHistory: [{ role, message }]` — no backend changes needed. No AI summary required — just pass the raw history.

---

## Current Flow (How Lead Is Created Today)

Three places in `widget.js` call `sendToFlosslyLeadAPI(data, callback)`:

| Flow | Line (approx) | Trigger |
|---|---|---|
| Appointment booking | ~893 | After form is completed |
| Treatment enquiry | ~1040 | After brochure form is filled |
| Callback request | ~1573 | After callback form is filled |

The AI agent (`ai-agent.js`) also calls `executeCreateLead()` internally (for AI mode conversations), which hits `POST https://widget.flossly.ai/api/flossly/lead` directly.

The VPS server endpoint `POST /api/flossly/lead` (in `vps-deployment/server.js`) receives the payload and forwards it to `${apiBase}/api/chatbot/createLead`.

---

## What Needs to Change

### 1. `widget.js` — Track Chat History

Add a `chatHistory` array at the top of the widget (alongside `aiConversationHistory`):

```js
let chatHistory = []; // { role: 'user'|'bot', message: string }
```

The backend expects `{ role, message }` — use `message` (not `content`) as the key.

Populate it inside `addUserMessage()` and `addBotMessage()`:

```js
function addUserMessage(text) {
    chatHistory.push({ role: 'user', message: text });
    // ... existing DOM code ...
}

function addBotMessage(text) {
    chatHistory.push({ role: 'bot', message: text });
    // ... existing DOM code ...
}
```

> The widget already has these functions — we just add the push inside them. This captures both traditional (scripted) flow and AI mode messages uniformly.

### 2. `widget.js` — Pass `chatHistory` in Lead Payload

In all three `sendToFlosslyLeadAPI(data, callback)` call sites, attach `chatHistory` to the data object before calling:

```js
const leadData = {
    botId: ...,
    customer: { ... },
    // ... existing fields ...
    chatHistory: chatHistory,  // [{ role, message }]
};
sendToFlosslyLeadAPI(leadData, (leadResponse) => { ... });
```

### 3. `vps-deployment/server.js` — Pass `chatHistory` Through to Flossly API

In the `POST /api/flossly/lead` handler, accept and forward `chatHistory` unchanged:

```js
const { botId, customer, treatment, company, chatHistory, comments } = req.body;

const leadPayload = {
    botId,
    name: customer.name,
    email: customer.email,
    telephone: customer.phone || '',
    leadSource: 'Chatbot',
    leadStatus: 'New',
    comments: req.body.comments || '',
    chatHistory: chatHistory || [],  // passed straight through — no transformation
    // ... existing fields (treatment, etc.) ...
};
```

No summary generation, no extra processing — just pass it through as received.

### 4. `vps-deployment/ai-agent.js` — Pass Conversation History to Lead Creation

In `executeCreateLead(botConfig, leadData)`, add `conversationHistory` as a third parameter and map it to the `{ role, message }` format the backend expects:

```js
async function executeCreateLead(botConfig, leadData, conversationHistory = []) {
    // ... existing code ...
    const payload = {
        // ... existing fields ...
        chatHistory: conversationHistory
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(m => ({
                role: m.role === 'assistant' ? 'bot' : 'user',
                message: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
            }))
    };
    // POST to flosslyLeadApiUrl with payload
}
```

Pass `conversationHistory` when calling `executeCreateLead` in the tool dispatch loop:

```js
case 'create_lead':
    toolResult = await executeCreateLead(botConfig, functionArgs, conversationHistory);
    break;
```

(`conversationHistory` is already in scope — it's the parameter passed into `chatWithAgent()`.)

---

## Data Shape — What Gets Sent to Flossly API

```json
{
  "botId": "abc123",
  "name": "John Smith",
  "email": "john@example.com",
  "telephone": "+44 7911 123456",
  "leadSource": "Chatbot",
  "leadStatus": "New",
  "treatment": "Teeth Whitening",
  "comments": "Treatment enquiry: Teeth Whitening",
  "chatHistory": [
    { "role": "bot",  "message": "Hi! I'm Flossy. How can I help you today?" },
    { "role": "user", "message": "Hi, I want to know about teeth whitening" },
    { "role": "bot",  "message": "Great choice! Here's what we offer..." }
  ]
}
```

The backend renders `chatHistory` as a note on the lead detail with `channel: 'chatbot'`.

---

## File Changes Summary

| File | Changes |
|---|---|
| `vps-deployment/widget.js` | Add `chatHistory` array; push `{ role, message }` inside `addUserMessage` / `addBotMessage`; attach to all 3 `sendToFlosslyLeadAPI` call sites |
| `vps-deployment/server.js` | Accept `chatHistory` in `/api/flossly/lead`; pass it unchanged in the Flossly API payload |
| `vps-deployment/ai-agent.js` | Thread `conversationHistory` into `executeCreateLead`; map to `{ role, message }` format |

---

## Implementation Order

1. **`widget.js`** — Add `chatHistory` tracking + attach to all 3 lead call sites.
2. **`server.js`** — Accept and forward `chatHistory` in the Flossly API payload.
3. **`ai-agent.js`** — Thread `conversationHistory` into `executeCreateLead`.
4. Test each flow: appointment booking, treatment enquiry, callback, AI mode.

---

---

# Part 2 — Switch AI Model from OpenAI to Claude Everywhere

## Current State

The entire AI layer uses OpenAI:

| File | Usage |
|---|---|
| `vps-deployment/ai-agent.js` | Main chat agent — `gpt-4o-mini` via `openai` npm package |
| `vps-deployment/ai-agent.js` | Streaming endpoint — same model |

## Target State

Replace **all** OpenAI calls with Anthropic Claude:

| Role | Old Model | New Model |
|---|---|---|
| Main chat agent (non-streaming) | `gpt-4o-mini` | `claude-haiku-4-5-20251001` (fast, cheap, tool-use capable) |
| Main chat agent (streaming) | `gpt-4o-mini` | `claude-haiku-4-5-20251001` |

> Use `claude-haiku-4-5-20251001` as the default — it matches GPT-4o-mini on speed and cost. If higher reasoning is needed, swap to `claude-sonnet-4-6`.

---

## Changes Required in `vps-deployment/ai-agent.js`

### Step 1 — Replace dependency

Remove:
```js
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

Add:
```js
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

### Step 2 — Replace `chatWithAgent()` API call

The current non-streaming call pattern:
```js
// OLD — OpenAI
let response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [...systemMessage, ...conversationHistory, userMessage],
    tools: tools,
    tool_choice: 'auto',
    temperature: 0.7,
    max_tokens: 1000
});
const assistantMessage = response.choices[0].message;
const toolCalls = assistantMessage.tool_calls || [];
```

Replace with:
```js
// NEW — Claude
let response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,          // extracted from the messages array
    messages: conversationHistory, // user/assistant turns only (no system role)
    tools: claudeTools,            // converted format (see Step 3)
});
const assistantMessage = response.content;
const toolCalls = assistantMessage.filter(block => block.type === 'tool_use');
```

Claude's stop reason for tool calls is `response.stop_reason === 'tool_use'` (vs OpenAI's `finish_reason === 'tool_calls'`).

### Step 3 — Convert tool definitions from OpenAI format to Claude format

OpenAI format:
```js
{
  type: 'function',
  function: {
    name: 'create_lead',
    description: '...',
    parameters: { type: 'object', properties: { ... }, required: [...] }
  }
}
```

Claude format:
```js
{
  name: 'create_lead',
  description: '...',
  input_schema: { type: 'object', properties: { ... }, required: [...] }
}
```

Write a one-time conversion in `ai-agent.js`:
```js
function toClaudeTools(openAiTools) {
    return openAiTools.map(t => ({
        name: t.function.name,
        description: t.function.description,
        input_schema: t.function.parameters
    }));
}
const claudeTools = toClaudeTools(tools);
```

### Step 4 — Update tool call dispatch loop

OpenAI gives:
```js
const functionName = toolCall.function.name;
const functionArgs = JSON.parse(toolCall.function.arguments);
const toolCallId = toolCall.id;
```

Claude gives:
```js
const functionName = toolCall.name;   // toolCall.type === 'tool_use'
const functionArgs = toolCall.input;  // already an object, no JSON.parse needed
const toolCallId = toolCall.id;
```

Tool result message format also changes:

OpenAI:
```js
{ role: 'tool', tool_call_id: toolCallId, content: JSON.stringify(toolResult) }
```

Claude:
```js
{
  role: 'user',
  content: [{
    type: 'tool_result',
    tool_use_id: toolCallId,
    content: JSON.stringify(toolResult)
  }]
}
```

### Step 5 — Extract final text response

OpenAI:
```js
const finalContent = response.choices[0].message.content;
```

Claude:
```js
const finalContent = response.content.find(b => b.type === 'text')?.text || '';
```

### Step 6 — Update streaming endpoint (`chatWithAgentStream`)

The existing streaming generator uses `openai.chat.completions.create({ stream: true })`.

Replace with Claude's streaming API:
```js
const stream = await anthropic.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages: conversationHistory,
    tools: claudeTools
});

for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
    }
}
```

---

## Dependency Changes (`vps-deployment/package.json`)

Remove:
```json
"openai": "^4.x.x"
```

Add:
```json
"@anthropic-ai/sdk": "^0.39.0"
```

Run on VPS:
```bash
npm install @anthropic-ai/sdk
npm uninstall openai
```

---

## Environment Variable Changes (VPS `.env`)

Add:
```
ANTHROPIC_API_KEY=sk-ant-...
```

`OPENAI_API_KEY` can be removed once migration is confirmed working.

---

## Implementation Order (Part 2)

1. Install `@anthropic-ai/sdk` on VPS, add `ANTHROPIC_API_KEY` to `.env`.
2. Convert tool definitions to Claude format in `ai-agent.js`.
3. Rewrite `chatWithAgent()` — replace OpenAI client with Anthropic, update message format, tool dispatch loop, and response extraction.
4. Rewrite `chatWithAgentStream()` — replace OpenAI stream with Anthropic stream.
5. Smoke-test all tool flows: appointment booking, lead creation, callback scheduling, web browsing.
6. Remove `openai` package and `OPENAI_API_KEY` from `.env`.

---

## Full Implementation Order (Both Parts Combined)

1. `widget.js` — chat history tracking + attach to lead payloads.
2. `server.js` — accept and forward `chatHistory` unchanged in Flossly API payload.
3. `ai-agent.js` — thread `conversationHistory` into `executeCreateLead` with `{ role, message }` mapping.
4. `ai-agent.js` — full OpenAI → Claude migration (Steps 1–6 above).
5. Install `@anthropic-ai/sdk`, add env var, remove `openai`.
6. End-to-end test all flows.
