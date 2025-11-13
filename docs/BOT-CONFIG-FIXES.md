# Bot Config API Fixes

## ✅ Fixed

### 1. Bot Builder Service (`src/services/botConfigService.js`)
- **Updated Save Endpoint**: Changed from `/api/crm/saveBotConfig` → `/api/chatbot/save`
- **Updated Get Endpoint**: Changed from `/api/crm/getBotConfig` → `/api/chatbot/get`
- **Updated Response Format**: Changed from `{ Success, Code, Data }` → `{ code, data }` (lowercase, code: 1 for success)
- **Removed userId/organizationId from payload**: These are now automatically set from logged-in user

### 2. Response Handling
- Save: Now expects `{ code: 1, data: {...} }` format
- Get: Now handles `{ code: 1, data: null }` when no config exists
- Get: Gets config by organizationId (from logged-in user), not by botId

## ⚠️ Still Needed

### 1. Public Endpoint for Widget
**Problem**: The widget needs to get config by `botId`, but the main API only has:
- `GET /api/chatbot/get` - Gets by organizationId (requires auth)

**Solution Needed**: Add a public endpoint to the main API:
```
GET /api/chatbot/public/:botId
```

This endpoint should:
- Be public (no authentication required)
- Get bot config by botId
- Return: `{ code: 1, data: {...} }` or `{ code: 1, data: null }`

**Current Widget Server Code** (`vps-deployment/server.js`):
- Currently tries to call `/api/chatbot/public/:botId`
- Will fail until this endpoint is added to main API

### 2. Bot Builder - Load Config on Mount
**Current**: BotBuilder might be trying to load config by botId
**Should**: Load config by organizationId (no botId parameter needed)

Check `BotBuilder.jsx` useEffect that loads config - should call:
```javascript
const result = await botConfigService.getBotConfig(); // No botId parameter
```

## Summary

| Component | Endpoint | Status |
|-----------|----------|--------|
| Bot Builder Save | `POST /api/chatbot/save` | ✅ Fixed |
| Bot Builder Get | `GET /api/chatbot/get` | ✅ Fixed |
| Widget Server | `GET /api/chatbot/public/:botId` | ⚠️ Needs to be added to main API |

## Next Steps

1. **Add public endpoint to main API**: `GET /api/chatbot/public/:botId`
2. **Test Bot Builder**: Save and load config
3. **Test Widget**: Verify it can load config by botId

