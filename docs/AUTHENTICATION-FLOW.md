# Bot Builder Authentication Flow

## Overview
The Bot Builder now implements a secure authentication flow that requires users to come from your CRM with a valid short token.

## How It Works

### 1. User Flow
1. User clicks "Connect to Bot" button in CRM
2. CRM redirects to: `https://your-domain.com/botbuilder/auth?token=SHORT_TOKEN`
3. Bot Builder exchanges short token for access token
4. Fetches user profile and organization data
5. Pre-populates Bot Builder with user's organization information
6. User can now build their bot with pre-filled data

### 2. Authentication Process
- **Short Token Exchange**: `POST https://dev.flossly.ai/api/auth/exchangeShortToken`
- **Profile Fetch**: `GET https://dev.flossly.ai/api/auth/profile`
- **Token Storage**: Access token stored in localStorage for session persistence

### 3. Data Pre-population
The following fields are automatically filled from the user's organization data:
- **Company Name**: From `userOrganisations[].organisation.name` (current org)
- **Company Phone**: From `userOrganisations[].organisation.contact`
- **Company Owner Email**: From user's `email`
- **Opening Messages**: Company name replaces `[Company Name]` placeholder

### 4. Security Features
- **Route Protection**: Only `/botbuilder/auth` route is accessible
- **Token Validation**: Invalid/expired tokens show unauthorized page
- **Automatic Redirect**: Unauthorized users redirected to `https://dev.flossly.ai`
- **Session Management**: Access tokens persist across browser sessions

### 5. Error Handling
- **No Token**: Shows unauthorized page
- **Invalid Token**: Shows unauthorized page
- **Network Errors**: Shows unauthorized page
- **Missing Profile**: Uses defaults with warning

## Testing the Flow

### Valid Authentication
```
https://your-domain.com/botbuilder/auth?token=VALID_SHORT_TOKEN
```

### Invalid Authentication
```
https://your-domain.com/botbuilder/auth?token=INVALID_TOKEN
https://your-domain.com/botbuilder/auth (no token)
https://your-domain.com/ (any other route)
```

All invalid cases will redirect to the unauthorized page with a "Return to Flossly" button.

## File Structure
```
src/
├── services/
│   └── authService.js          # Authentication API calls
├── components/
│   ├── AuthWrapper.jsx        # Route protection wrapper
│   └── Unauthorized.jsx       # Unauthorized access page
├── BotBuilder.jsx             # Updated to accept userProfile prop
└── App.jsx                    # Updated with routing
```

## API Integration
The system integrates with your existing Flossly API:
- **Base URL**: `https://dev.flossly.ai/api`
- **Authentication**: Bearer token in Authorization header
- **Error Handling**: Graceful fallbacks for all API failures

## Next Steps
1. Deploy the updated Bot Builder
2. Update your CRM to redirect to the new URL format
3. Test with real short tokens from your system
4. Monitor authentication success/failure rates

