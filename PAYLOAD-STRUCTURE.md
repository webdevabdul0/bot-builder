# 📋 Flossy Webhook Payload Structure

This document defines the complete payload structure for all Flossy chatbot webhooks, ensuring proper alignment between the widget, bot builder, and n8n workflows.

## 🔑 **Bot Identification (All Payloads)**

Every payload includes these core identification fields:

```json
{
  "botId": "unique-bot-identifier",
  "botName": "Bot Display Name",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📧 **Brochure Request Payload**

### **Webhook URL:** `https://n8n.flipthatpdf.site/webhook/gmail-brochure`

### **Complete Payload Structure:**

```json
{
  // Bot identification
  "botId": "bot-12345",
  "botName": "Dental Clinic Bot",
  "timestamp": "2024-01-15T10:30:00.000Z",
  
  // Request type
  "type": "brochure_request",
  
  // Treatment information
  "treatment": {
    "id": "treatment-uuid",
    "name": "Teeth Whitening",
    "description": "Professional teeth whitening treatments for a brighter smile",
    "brochureUrl": "https://example.com/teeth-whitening-brochure.pdf",
    "hasBrochureUrl": true
  },
  
  // Customer information
  "customer": {
    "email": "customer@example.com",
    "name": "John Doe",
    "phone": "+1 (555) 987-6543",
    "message": "Requested brochure for Teeth Whitening"
  },
  
  // Company information
  "company": {
    "name": "Bright Smile Dental Clinic",
    "ownerEmail": "owner@brightsmile.com",
    "phone": "+1 (555) 123-4567",
    "website": "https://brightsmiledental.com",
    "address": "123 Main St, City, State 12345",
    "tagline": "Your Smile, Our Priority",
    "logo": "https://brightsmiledental.com/logo.png"
  },
  
  // Legacy fields for compatibility
  "userEmail": "customer@example.com",
  "companyOwnerEmail": "owner@brightsmile.com",
  "companyName": "Bright Smile Dental Clinic",
  "companyPhone": "+1 (555) 123-4567",
  "companyWebsite": "https://brightsmiledental.com",
  "customerName": "John Doe",
  "customerPhone": "+1 (555) 987-6543",
  "customerMessage": "Requested brochure for Teeth Whitening",
  "hasBrochureUrl": true
}
```

## 📞 **Callback Request Payload**

### **Webhook URL:** `https://n8n.flipthatpdf.site/webhook/gmail-callback`

### **Complete Payload Structure:**

```json
{
  // Bot identification
  "botId": "bot-12345",
  "botName": "Dental Clinic Bot",
  "timestamp": "2024-01-15T10:30:00.000Z",
  
  // Request type
  "type": "callback_request",
  
  // Customer information
  "customer": {
    "name": "Jane Smith",
    "phone": "+1 (555) 987-6543",
    "email": "jane@example.com",
    "message": "Callback requested for: Interested in dental implants"
  },
  
  // Callback details
  "callback": {
    "reason": "Interested in dental implants",
    "preferredTime": "Morning",
    "urgency": "Normal",
    "status": "pending"
  },
  
  // Company information
  "company": {
    "name": "Bright Smile Dental Clinic",
    "ownerEmail": "owner@brightsmile.com",
    "phone": "+1 (555) 123-4567",
    "website": "https://brightsmiledental.com",
    "address": "123 Main St, City, State 12345",
    "tagline": "Your Smile, Our Priority",
    "logo": "https://brightsmiledental.com/logo.png"
  },
  
  // Legacy fields for compatibility
  "customerName": "Jane Smith",
  "customerPhone": "+1 (555) 987-6543",
  "customerEmail": "jane@example.com",
  "callbackReason": "Interested in dental implants",
  "preferredTime": "Morning",
  "companyOwnerEmail": "owner@brightsmile.com",
  "companyName": "Bright Smile Dental Clinic",
  "companyPhone": "+1 (555) 123-4567",
  "companyWebsite": "https://brightsmiledental.com",
  "customerMessage": "Callback requested for: Interested in dental implants",
  "urgency": "Normal"
}
```

## 🏗️ **Bot Builder Configuration**

### **Required Fields for Bot Owners:**

1. **Basic Information:**
   - Bot Name
   - Company Name
   - Company Owner Email

2. **Contact Information:**
   - Company Phone (Optional)
   - Company Website (Optional)
   - Company Address (Optional)

3. **Branding:**
   - Company Tagline (Optional)
   - Company Logo URL (Optional)
   - Bot Theme Color

4. **Treatment Options:**
   - Treatment Name
   - Treatment Description
   - Brochure URL (Optional)

### **Bot Configuration Structure:**

```json
{
  "botId": "unique-bot-id",
  "name": "Bot Name",
  "companyName": "Company Name",
  "companyOwnerEmail": "owner@company.com",
  "companyPhone": "+1 (555) 123-4567",
  "companyWebsite": "https://company.com",
  "companyAddress": "123 Main St, City, State 12345",
  "companyTagline": "Your Tagline",
  "companyLogo": "https://company.com/logo.png",
  "themeColor": "#3B82F6",
  "treatmentOptions": [
    {
      "id": "treatment-uuid",
      "name": "Treatment Name",
      "description": "Treatment Description",
      "brochureUrl": "https://company.com/brochure.pdf"
    }
  ]
}
```

## 🔄 **Data Flow Process**

### **1. Bot Owner Setup:**
1. Bot owner configures all company information in BotBuilder
2. Bot owner adds treatment options with brochure URLs
3. Bot owner saves configuration and gets Bot ID
4. Bot owner embeds widget on their website

### **2. Customer Interaction:**
1. Customer visits website with embedded widget
2. Customer interacts with chatbot
3. Customer requests brochure or callback
4. Bot collects customer information

### **3. Webhook Processing:**
1. Bot sends structured payload to n8n webhook
2. n8n processes payload with bot-specific data
3. n8n sends professional emails using company branding
4. Both customer and company owner receive appropriate emails

## 📊 **Payload Validation**

### **Required Fields:**
- `botId` - Must be unique identifier
- `type` - Must be "brochure_request" or "callback_request"
- `customer.email` - Customer email address
- `company.name` - Company name
- `company.ownerEmail` - Company owner email

### **Optional Fields:**
- All company branding fields
- Customer phone number
- Treatment brochure URL
- Company contact information

## 🧪 **Testing Payloads**

### **Test Brochure Request:**
```bash
curl -X POST https://n8n.flipthatpdf.site/webhook/gmail-brochure \
  -H "Content-Type: application/json" \
  -d '{
    "botId": "test-bot-123",
    "botName": "Test Bot",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "type": "brochure_request",
    "treatment": {
      "id": "treatment-123",
      "name": "Teeth Whitening",
      "description": "Professional teeth whitening",
      "brochureUrl": "https://example.com/brochure.pdf",
      "hasBrochureUrl": true
    },
    "customer": {
      "email": "test@example.com",
      "name": "Test Customer",
      "phone": "+1 (555) 123-4567",
      "message": "Test brochure request"
    },
    "company": {
      "name": "Test Dental Clinic",
      "ownerEmail": "owner@test.com",
      "phone": "+1 (555) 987-6543",
      "website": "https://testdental.com",
      "address": "123 Test St, Test City, TC 12345",
      "tagline": "Test Tagline",
      "logo": "https://testdental.com/logo.png"
    }
  }'
```

### **Test Callback Request:**
```bash
curl -X POST https://n8n.flipthatpdf.site/webhook/gmail-callback \
  -H "Content-Type: application/json" \
  -d '{
    "botId": "test-bot-456",
    "botName": "Test Bot",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "type": "callback_request",
    "customer": {
      "name": "Test Customer",
      "phone": "+1 (555) 123-4567",
      "email": "test@example.com",
      "message": "Test callback request"
    },
    "callback": {
      "reason": "Interested in treatment",
      "preferredTime": "Morning",
      "urgency": "Normal",
      "status": "pending"
    },
    "company": {
      "name": "Test Dental Clinic",
      "ownerEmail": "owner@test.com",
      "phone": "+1 (555) 987-6543",
      "website": "https://testdental.com",
      "address": "123 Test St, Test City, TC 12345",
      "tagline": "Test Tagline",
      "logo": "https://testdental.com/logo.png"
    }
  }'
```

## 🔧 **n8n Workflow Configuration**

### **Gmail Node Configuration:**
- **Authentication:** OAuth2 with your Gmail credentials
- **From Name:** `{{ $json.company.name }}`
- **To:** `{{ $json.customer.email }}`
- **Subject:** `{{ $json.treatment.name }} Information - {{ $json.company.name }}`
- **Body:** Use company branding and treatment information
- **Attachments:** `{{ $json.treatment.brochureUrl }}` (if available)

### **Email Template Variables:**
- `{{ $json.company.name }}` - Company name
- `{{ $json.company.phone }}` - Company phone
- `{{ $json.company.website }}` - Company website
- `{{ $json.company.address }}` - Company address
- `{{ $json.company.tagline }}` - Company tagline
- `{{ $json.company.logo }}` - Company logo
- `{{ $json.customer.name }}` - Customer name
- `{{ $json.customer.email }}` - Customer email
- `{{ $json.treatment.name }}` - Treatment name
- `{{ $json.treatment.description }}` - Treatment description

## 📈 **Benefits of This Structure**

### **For Bot Owners:**
- ✅ **Complete branding control** - All company information included
- ✅ **Professional emails** - Rich formatting with company details
- ✅ **Treatment-specific content** - Personalized for each service
- ✅ **Easy configuration** - Simple form fields in BotBuilder

### **For Customers:**
- ✅ **Professional communication** - Branded emails from the business
- ✅ **Complete information** - All contact details included
- ✅ **Treatment-specific content** - Relevant brochure information
- ✅ **Clear next steps** - What to expect and how to proceed

### **For System:**
- ✅ **Bot-specific data** - Each bot sends its own company information
- ✅ **Structured payloads** - Easy to process and validate
- ✅ **Backward compatibility** - Legacy fields maintained
- ✅ **Scalable architecture** - Supports multiple bots and companies

---

**🎉 This payload structure ensures that every email sent through your system is properly branded and contains all the necessary information for both customers and business owners!**
