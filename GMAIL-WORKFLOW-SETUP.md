# 📧 Gmail Workflow Setup Guide

This guide will help you set up professional Gmail workflows for your Flossy chatbot system.

## 🚀 **What This Setup Provides**

### **For Brochure Requests:**
- ✅ **Professional email templates** with company branding
- ✅ **Automatic brochure delivery** when URL is provided
- ✅ **Follow-up emails** when no brochure URL is available
- ✅ **Company owner notifications** for all requests
- ✅ **Rich email formatting** with contact information

### **For Callback Requests:**
- ✅ **Customer confirmation emails** with callback details
- ✅ **Company owner notifications** with customer information
- ✅ **Professional email templates** for both parties
- ✅ **Complete callback tracking** and scheduling

## 🔧 **Setup Instructions**

### **Step 1: Gmail API Setup**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Gmail API**
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

3. **Create OAuth2 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://your-n8n-domain.com/oauth2/callback`
   - Note down your `client_id` and `client_secret`

### **Step 2: n8n Workflow Import**

1. **Import Brochure Workflow**
   ```bash
   # Import the Gmail brochure workflow
   n8n import:workflow n8n-gmail-brochure-workflow.json
   ```

2. **Import Callback Workflow**
   ```bash
   # Import the Gmail callback workflow
   n8n import:workflow n8n-gmail-callback-workflow.json
   ```

3. **Configure Gmail Credentials in n8n**
   - Go to n8n Settings > Credentials
   - Add new Gmail OAuth2 credential
   - Enter your `client_id` and `client_secret`
   - Complete OAuth flow

### **Step 3: Webhook Configuration**

1. **Update BotBuilder Webhooks**
   - Brochure requests: `http://your-n8n-domain.com/webhook/gmail-brochure`
   - Callback requests: `http://your-n8n-domain.com/webhook/gmail-callback`

2. **Test Webhook Endpoints**
   ```bash
   # Test brochure webhook
   curl -X POST http://your-n8n-domain.com/webhook/gmail-brochure \
     -H "Content-Type: application/json" \
     -d '{"type":"brochure_request","userEmail":"test@example.com","treatment":{"name":"Teeth Whitening","brochureUrl":"https://example.com/brochure.pdf"},"companyName":"Test Company","companyOwnerEmail":"owner@test.com"}'
   ```

## 📧 **Email Templates**

### **Brochure Email Template**
```
Subject: [Treatment Name] Information - [Company Name]

Dear Valued Customer,

Thank you for your interest in our [Treatment Name] services at [Company Name].

We're excited to share detailed information about [Treatment Name] with you. Please find attached our comprehensive brochure that covers:

• Treatment overview and benefits
• What to expect during your visit
• Pricing and package options
• Before and after care instructions
• Frequently asked questions

[Treatment Description]

Next Steps:
1. Review the attached brochure
2. Contact us to schedule your free consultation
3. Ask any questions you may have

Contact Information:
📞 Phone: [Company Phone]
📧 Email: [Company Owner Email]
🌐 Website: [Company Website]

We look forward to helping you achieve your dental goals!

Best regards,
The [Company Name] Team
```

### **Callback Confirmation Template**
```
Subject: Callback Confirmation - [Company Name]

Dear [Customer Name],

Thank you for requesting a callback from [Company Name]!

Your Callback Details:
• Name: [Customer Name]
• Phone: [Customer Phone]
• Reason: [Callback Reason]
• Preferred Time: [Preferred Time]
• Request Date: [Current Date]

What happens next:
1. Our team will review your callback request
2. We'll call you at your preferred time: [Preferred Time]
3. We'll discuss your specific needs: [Callback Reason]
4. We'll answer any questions you may have

Contact Information:
📞 Phone: [Company Phone]
📧 Email: [Company Owner Email]
🌐 Website: [Company Website]

We look forward to speaking with you soon!

Best regards,
The [Company Name] Team
```

## 🔄 **How It Works**

### **Brochure Request Flow:**
1. **Customer** requests brochure through chatbot
2. **Bot** collects customer email address
3. **n8n** receives webhook with treatment and customer info
4. **Gmail API** sends professional brochure email
5. **Company owner** receives notification email
6. **Customer** receives brochure with company branding

### **Callback Request Flow:**
1. **Customer** requests callback through chatbot
2. **Bot** collects name, phone, reason, timing
3. **n8n** receives webhook with callback details
4. **Gmail API** sends confirmation to customer
5. **Gmail API** sends notification to company owner
6. **Company owner** calls customer at scheduled time

## 📊 **Data Flow**

### **Webhook Payload for Brochure:**
```json
{
  "botId": "bot-123",
  "type": "brochure_request",
  "treatment": {
    "name": "Teeth Whitening",
    "description": "Professional teeth whitening treatments",
    "brochureUrl": "https://example.com/brochure.pdf"
  },
  "userEmail": "customer@example.com",
  "companyOwnerEmail": "owner@company.com",
  "companyName": "Dental Clinic",
  "companyPhone": "+1 (555) 123-4567",
  "companyWebsite": "https://dentalclinic.com",
  "customerName": "John Doe",
  "customerPhone": "+1 (555) 987-6543",
  "customerMessage": "Requested brochure for Teeth Whitening",
  "hasBrochureUrl": true
}
```

### **Webhook Payload for Callback:**
```json
{
  "botId": "bot-123",
  "type": "callback_request",
  "customerName": "John Doe",
  "customerPhone": "+1 (555) 987-6543",
  "customerEmail": "customer@example.com",
  "callbackReason": "Interested in dental implants",
  "preferredTime": "Morning",
  "companyOwnerEmail": "owner@company.com",
  "companyName": "Dental Clinic",
  "companyPhone": "+1 (555) 123-4567",
  "companyWebsite": "https://dentalclinic.com",
  "customerMessage": "Callback requested for: Interested in dental implants",
  "urgency": "Normal"
}
```

## 🛠️ **Customization Options**

### **Email Template Customization:**
- **Company branding** in email headers
- **Custom email signatures**
- **Treatment-specific content**
- **Contact information formatting**
- **Call-to-action buttons**

### **Workflow Customization:**
- **Additional email triggers**
- **Follow-up sequences**
- **Email analytics tracking**
- **CRM integration**
- **Calendar scheduling**

## 🧪 **Testing**

### **Test Brochure Workflow:**
1. Configure a bot with treatment options
2. Add brochure URLs to treatments
3. Test brochure request through chatbot
4. Verify email delivery to customer
5. Check company owner notification

### **Test Callback Workflow:**
1. Configure callback workflow in bot
2. Test callback request through chatbot
3. Verify customer confirmation email
4. Check company owner notification
5. Test callback scheduling

## 📈 **Monitoring & Analytics**

### **Email Delivery Tracking:**
- **Delivery status** for each email
- **Open rates** and engagement metrics
- **Bounce handling** and error management
- **Performance monitoring**

### **Business Metrics:**
- **Brochure request volume**
- **Callback conversion rates**
- **Customer engagement levels**
- **Response time tracking**

## 🔒 **Security & Compliance**

### **Data Protection:**
- **Email encryption** in transit
- **Secure webhook endpoints**
- **GDPR compliance** for EU customers
- **Data retention policies**

### **Authentication:**
- **OAuth2 security** for Gmail API
- **Webhook authentication** tokens
- **Rate limiting** and abuse prevention
- **Access control** and permissions

## 🚀 **Production Deployment**

### **Environment Setup:**
```bash
# Set production environment variables
export N8N_WEBHOOK_URL="https://your-domain.com"
export GMAIL_CLIENT_ID="your-client-id"
export GMAIL_CLIENT_SECRET="your-client-secret"
export GMAIL_REDIRECT_URI="https://your-domain.com/oauth2/callback"
```

### **Monitoring Setup:**
- **Health checks** for webhook endpoints
- **Error logging** and alerting
- **Performance monitoring**
- **Backup and recovery** procedures

## 📞 **Support & Troubleshooting**

### **Common Issues:**
1. **Gmail API quota exceeded** - Check usage limits
2. **OAuth token expired** - Re-authenticate credentials
3. **Webhook timeouts** - Check n8n server performance
4. **Email delivery failures** - Verify recipient addresses

### **Debug Steps:**
1. Check n8n workflow execution logs
2. Verify Gmail API credentials
3. Test webhook endpoints manually
4. Review email delivery status
5. Check spam folders for test emails

---

**🎉 Congratulations!** You now have a complete Gmail workflow system that will send professional, branded emails to your customers and keep your business owners informed of all requests.

