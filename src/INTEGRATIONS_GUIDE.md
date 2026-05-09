# External Integrations System - Complete Guide

## Overview

The edXponential platform includes a comprehensive External Integrations System that allows users to securely connect third-party applications, sync data, and automate workflows.

## Architecture

### Core Components

1. **Integration Hub** (`pages/Integrations.jsx`)
   - Main dashboard for managing integrations
   - Tabs: Connected, Browse All, Activity Logs, API & Webhooks
   - Beautiful, clean interface following design standards

2. **Integration Catalog** (`components/integrations/IntegrationCatalog.jsx`)
   - Browse all available integrations
   - Filter by category
   - Search integrations
   - Labels (Recommended, Popular, Enterprise, etc.)

3. **Setup Wizard** (`components/integrations/IntegrationSetupWizard.jsx`)
   - Step-by-step guided setup flow
   - Permission review
   - Authentication
   - Sync settings configuration
   - Confirmation

4. **Connected Integration Cards** (`components/integrations/ConnectedIntegrationCard.jsx`)
   - Display connected integrations
   - Status indicators
   - Quick actions (Sync Now, Settings, Disconnect)
   - Last sync timestamp
   - Error messages and retry options

5. **API Key Manager** (`components/integrations/APIKeyManager.jsx`)
   - Generate and manage API keys
   - Scope management
   - Key revocation
   - Rate limiting configuration

### Backend Services

1. **Secure Integration Manager** (`functions/secureIntegrationManager.js`)
   - OAuth token management
   - API key encryption
   - Connection validation
   - Manual sync triggers
   - Admin-only operations

2. **Webhook Handler** (`functions/integrationWebhookHandler.js`)
   - Receives webhooks from external services
   - Validates signatures
   - Logs webhook events
   - Routes events to appropriate handlers

### Data Models

1. **Integration Entity**
   - Stores integration configuration
   - OAuth tokens (encrypted)
   - Sync settings
   - Field mappings
   - Connection metadata

2. **IntegrationLog Entity**
   - Audit trail of all integration activity
   - Sync logs
   - Error tracking
   - User actions

3. **IntegrationFieldMapping Entity**
   - Field mapping between platforms
   - Data type conversions
   - Transformation formulas

4. **APIKey Entity**
   - Stores hashed API keys
   - Scope management
   - Rate limits
   - IP whitelisting

## Supported Integrations

### Productivity
- Google Workspace (Gmail, Drive, Docs, Sheets, Calendar)
- Microsoft 365 (Outlook, OneDrive, Teams, Excel)
- Zoom

### Communication
- Slack
- Mailchimp
- Zoom

### Payment Processing
- Stripe
- Square
- PayPal

### Finance & Accounting
- QuickBooks

### HR & Payroll
- Gusto
- ADP

### Student Information Systems (SIS) & Learning Management Systems (LMS)
- Canvas
- Schoology
- Clever
- ClassLink
- PowerSchool
- Infinite Campus

### CRM
- Salesforce
- HubSpot

### Automation
- Zapier
- Webhooks (Custom)

## Security Features

### Credential Management
- OAuth 2.0 support for secure authorization
- API keys encrypted before storage
- Tokens refreshed automatically
- Credentials never exposed in frontend code
- Secure backend-only credential handling

### Access Control
- Admin-only integration connection
- Role-based permissions
- Organization isolation
- User action auditing

### Webhook Security
- HMAC signature verification
- IP whitelisting options
- Rate limiting
- Request logging

## Usage

### For End Users

1. **Connect an Integration**
   - Navigate to `/integrations`
   - Click "Browse All" or search for desired app
   - Click "Connect" on integration card
   - Follow setup wizard
   - Configure sync settings
   - Authorize with external service

2. **Manage Connected Integrations**
   - View connected apps in "Connected" tab
   - Trigger manual sync with "Sync Now"
   - Access settings for configuration
   - Disconnect when no longer needed

3. **Monitor Activity**
   - View sync logs in "Activity Logs" tab
   - Track import/export history
   - Review error messages
   - Retry failed syncs

### For Developers

1. **Generate API Keys**
   - Go to Integrations > API & Webhooks
   - Click "New API Key"
   - Set key name and scopes
   - Save key securely (shown only once)

2. **Configure Webhooks**
   - Set webhook URL in integration settings
   - Register webhook events
   - Verify webhook signature in requests
   - Handle webhook payloads

3. **Field Mapping**
   - Map fields between platforms
   - Set transformation rules
   - Configure sync direction
   - Define sync frequency

## API Reference

### Integration Manager Endpoint

```javascript
POST /functions/secureIntegrationManager
```

**Actions:**

1. **Connect Integration**
   ```javascript
   {
     action: "connect",
     data: {
       integration_type: "stripe",
       auth_data: { oauth_token: "..." },
       permissions: ["charge:read", "customer:read"],
       organization_id: "org_123"
     }
   }
   ```

2. **Disconnect Integration**
   ```javascript
   {
     action: "disconnect",
     data: {
       integration_id: "int_123",
       organization_id: "org_123"
     }
   }
   ```

3. **Trigger Sync**
   ```javascript
   {
     action: "sync",
     data: {
       integration_id: "int_123",
       organization_id: "org_123"
     }
   }
   ```

### Webhook Endpoint

```javascript
POST /functions/integrationWebhookHandler
```

**Headers:**
- `x-webhook-signature`: HMAC signature
- `x-integration-id`: Integration ID

**Payload:**
```javascript
{
  type: "payment.completed",
  source: "stripe",
  organization_id: "org_123",
  data: { ... }
}
```

## Field Mapping Examples

### Student Data
```
External → Platform
first_name → student_first_name
last_name → student_last_name
email → contact_email
student_id → student_id_number
grade_level → grade
```

### Staff Data
```
External → Platform
givenName → first_name
familyName → last_name
primaryEmail → email
jobTitle → role_title
employeeNumber → employee_id
```

### Payment Data
```
External → Platform
amount → payment_amount
currency → payment_currency
status → payment_status
created → payment_date
metadata.student_id → student_id
```

## Sync Frequencies

- **Hourly**: Real-time data sync (every hour)
- **Daily**: Once per day (configurable time)
- **Weekly**: Once per week (configurable day/time)
- **Monthly**: Once per month (configurable day/time)
- **Manual**: Only when user triggers
- **Real-time**: Immediate webhook-based sync

## Troubleshooting

### Connection Failed
- Check API credentials
- Verify OAuth token is valid
- Check IP whitelisting
- Review error logs in Activity section

### Sync Failed
- Verify field mappings are correct
- Check that required fields are populated
- Review error message for specific issue
- Retry sync or contact support

### Token Expired
- Log out and reconnect integration
- Click "Reconnect" on integration card
- Re-authorize with external service

### Data Not Syncing
- Check sync is enabled
- Verify sync frequency setting
- Check last sync timestamp
- Review field mappings
- Check for permission issues

## Compliance & Privacy

- **FERPA Compliance**: Student data handling
- **GDPR Compliance**: User consent management
- **PCI Compliance**: Payment data security
- **Audit Logs**: All integration activity logged
- **Data Isolation**: Organization-level data separation

## Future Enhancements

- Scheduled sync automation rules
- Advanced field transformation rules
- Data transformation templates
- Integration marketplace ratings
- Custom integration builder
- Webhook-triggered automation
- Data conflict resolution
- Two-way sync management
- Bulk field mapping
- Integration analytics dashboard