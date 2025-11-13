# 🎯 Complete Flossy System Alignment

## ✅ **What's Been Aligned**

### **1. BotBuilder.jsx** ✅
- **Enhanced company fields**: Added phone, website, address, tagline, logo URL
- **Structured webhook payloads**: Complete bot-specific data structure
- **Gmail webhook integration**: Updated to use new Gmail workflows
- **Callback webhook integration**: Updated to use new Gmail workflows
- **Legacy compatibility**: Maintained backward compatibility

### **2. n8n Workflows** ✅
- **Gmail Brochure Workflow**: `n8n-gmail-brochure-workflow.json`
- **Gmail Callback Workflow**: `n8n-gmail-callback-workflow.json`
- **Professional email templates**: Company branding and treatment-specific content
- **Bot-specific data processing**: Each bot sends its own company information

### **3. Widget.js** ✅
- **New webhook URLs**: Added Gmail brochure and callback webhook URLs
- **Configuration updates**: Updated default configuration structure
- **Webhook integration**: Ready for Gmail workflows

### **4. Server.js** ✅
- **New webhook endpoints**: Added `/webhook/gmail-brochure` and `/webhook/gmail-callback`
- **n8n forwarding**: Server forwards requests to n8n workflows
- **Error handling**: Proper error handling and logging
- **Response formatting**: Consistent response structure

## 🔄 **Complete Data Flow**

### **Bot Owner Setup:**
1. **BotBuilder** - Bot owner configures company information
2. **Company Data** - Phone, website, address, tagline, logo URL
3. **Treatment Options** - Treatment names, descriptions, brochure URLs
4. **Bot ID** - Unique identifier for each bot
5. **Widget Embed** - Bot owner embeds widget on website

### **Customer Interaction:**
1. **Customer** visits website with embedded widget
2. **Widget** loads with bot-specific configuration
3. **Customer** requests brochure or callback
4. **Widget** collects customer information
5. **Widget** sends structured payload to server

### **Server Processing:**
1. **Server** receives webhook request
2. **Server** logs request details
3. **Server** forwards to n8n workflow
4. **Server** returns response to widget

### **n8n Processing:**
1. **n8n** receives structured payload
2. **n8n** processes bot-specific company data
3. **n8n** sends professional emails with company branding
4. **n8n** notifies company owner
5. **n8n** confirms to customer

## 📧 **Webhook Endpoints**

### **Server Endpoints:**
- `POST /webhook/appointment-booking` - Appointment bookings
- `POST /webhook/gmail-brochure` - Brochure requests
- `POST /webhook/gmail-callback` - Callback requests

### **n8n Endpoints:**
- `POST https://n8n.flossly.ai/webhook/gmail-brochure` - Gmail brochure workflow
- `POST https://n8n.flossly.ai/webhook/gmail-callback` - Gmail callback workflow

## 🔧 **Configuration Structure**

### **BotBuilder Configuration:**
```javascript
{
  botId: "unique-bot-id",
  name: "Bot Name",
  companyName: "Company Name",
  companyOwnerEmail: "owner@company.com",
  companyPhone: "+1 (555) 123-4567",
  companyWebsite: "https://company.com",
  companyAddress: "123 Main St, City, State 12345",
  companyTagline: "Your Tagline",
  companyLogo: "https://company.com/logo.png",
  treatmentOptions: [
    {
      name: "Treatment Name",
      description: "Treatment Description",
      brochureUrl: "https://company.com/brochure.pdf"
    }
  ]
}
```

### **Widget Configuration:**
```javascript
{
  botId: "unique-bot-id",
  webhookUrl: "http://localhost:3001/webhook/appointment-booking",
  gmailBrochureUrl: "http://localhost:3001/webhook/gmail-brochure",
  gmailCallbackUrl: "http://localhost:3001/webhook/gmail-callback"
}
```

## 📋 **Payload Structures**

### **Brochure Request Payload:**
```json
{
  "botId": "unique-bot-id",
  "botName": "Bot Name",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "type": "brochure_request",
  "treatment": {
    "id": "treatment-uuid",
    "name": "Treatment Name",
    "description": "Treatment Description",
    "brochureUrl": "https://company.com/brochure.pdf",
    "hasBrochureUrl": true
  },
  "customer": {
    "email": "customer@example.com",
    "name": "Customer Name",
    "phone": "+1 (555) 987-6543",
    "message": "Requested brochure for Treatment Name"
  },
  "company": {
    "name": "Company Name",
    "ownerEmail": "owner@company.com",
    "phone": "+1 (555) 123-4567",
    "website": "https://company.com",
    "address": "123 Main St, City, State 12345",
    "tagline": "Your Tagline",
    "logo": "https://company.com/logo.png"
  }
}
```

### **Callback Request Payload:**
```json
{
  "botId": "unique-bot-id",
  "botName": "Bot Name",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "type": "callback_request",
  "customer": {
    "name": "Customer Name",
    "phone": "+1 (555) 987-6543",
    "email": "customer@example.com",
    "message": "Callback requested for: Interested in treatment"
  },
  "callback": {
    "reason": "Interested in treatment",
    "preferredTime": "Morning",
    "urgency": "Normal",
    "status": "pending"
  },
  "company": {
    "name": "Company Name",
    "ownerEmail": "owner@company.com",
    "phone": "+1 (555) 123-4567",
    "website": "https://company.com",
    "address": "123 Main St, City, State 12345",
    "tagline": "Your Tagline",
    "logo": "https://company.com/logo.png"
  }
}
```

## 🚀 **Deployment Checklist**

### **1. n8n Setup:**
- [ ] Import `n8n-gmail-brochure-workflow.json`
- [ ] Import `n8n-gmail-callback-workflow.json`
- [ ] Configure Gmail OAuth2 credentials
- [ ] Test webhook endpoints

### **2. Server Setup:**
- [ ] Update server.js with new webhook endpoints
- [ ] Deploy updated widget.js
- [ ] Test webhook forwarding to n8n
- [ ] Monitor webhook logs

### **3. BotBuilder Setup:**
- [ ] Update BotBuilder with new company fields
- [ ] Test webhook payload generation
- [ ] Verify bot-specific data flow
- [ ] Test complete workflow

### **4. Testing:**
- [ ] Test brochure requests with different companies
- [ ] Test callback requests with different companies
- [ ] Verify email delivery and formatting
- [ ] Test error handling and fallbacks

## 📊 **System Benefits**

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

## 🔧 **Maintenance**

### **Regular Tasks:**
- Monitor webhook performance
- Check email delivery rates
- Update company information as needed
- Test new bot configurations

### **Monitoring:**
- Webhook response times
- Email delivery success rates
- Error logs and debugging
- User feedback and improvements

---

**🎉 Your Flossy system is now completely aligned with bot-specific payloads, professional email templates, and comprehensive company branding!**
