# Login Error Handling System

This document describes the comprehensive error handling system implemented for the login functionality.

## Overview

The error handling system provides user-friendly error messages based on API error responses, with support for different error types, retry mechanisms, and visual feedback.

## Components

### 1. ErrorMessageService (`/core/services/error-message.service.ts`)

Central service that handles error message translation and categorization.

**Features:**
- Maps API error codes to user-friendly messages in Portuguese
- Categorizes errors by severity (error, warning, info)
- Determines if retry should be available
- Calculates retry delays

**Supported Error Codes:**
- `INVALID_CREDENTIALS` - Invalid email/password
- `ACCOUNT_LOCKED` - Account is locked
- `ACCOUNT_DISABLED` - Account is disabled
- `ACCOUNT_EXPIRED` - Account has expired
- `TOO_MANY_ATTEMPTS` - Rate limiting
- `INVALID_EMAIL_FORMAT` - Invalid email format
- `MISSING_CREDENTIALS` - Required fields missing
- `NETWORK_ERROR` - Connection issues
- `SERVER_ERROR` - Server-side errors
- `MAINTENANCE_MODE` - System maintenance
- `SESSION_EXPIRED` - Session expired
- `UNAUTHORIZED` - Unauthorized access
- `FORBIDDEN` - Access denied
- `VALIDATION_ERROR` - Data validation errors
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded
- `SERVICE_UNAVAILABLE` - Service unavailable

### 2. Enhanced Auth Effects (`/core/store/auth/auth.effects.ts`)

Updated to capture detailed error information from API responses.

**Changes:**
- Extracts structured error data from HTTP error responses
- Creates `ApiError` objects with timestamp, status, message, errorCode, and path
- Handles both structured API errors and generic HTTP errors

### 3. Updated Auth State (`/core/store/auth/auth.state.ts`)

Modified to store detailed error information using the `ApiError` interface.

### 4. Enhanced Login Component (`/features/auth/pages/login/login.component.ts`)

**New Features:**
- Displays contextual error messages based on error codes
- Shows different alert types (error, warning, info) with appropriate styling
- Implements retry functionality with countdown timer
- Auto-dismisses non-retryable errors after 7 seconds
- Provides manual dismiss option

**Properties:**
- `errorMessage`: User-friendly error message
- `errorSeverity`: Visual severity level (error/warning/info)
- `shouldShowRetry`: Whether retry button should be shown
- `retryDelay`: Countdown timer for retry availability

### 5. Enhanced Login Template (`/features/auth/pages/login/login.component.html`)

**New Elements:**
- Error alert component with icon, message, and actions
- Retry section with countdown timer and retry button
- Close button for manual dismissal
- Responsive design with proper styling

### 6. Error Alert Styling (`/features/auth/pages/login/login.component.scss`)

**Features:**
- Three severity levels with distinct colors:
  - Error: Red theme
  - Warning: Orange theme  
  - Info: Blue theme
- Smooth slide-down animation
- Responsive retry section
- Hover effects and transitions
- Accessible design

## Usage Examples

### API Error Response Format
```json
{
    "timestamp": "2025-09-15T00:17:43.774061",
    "status": 401,
    "error": "Unauthorized",
    "message": "Invalid credentials",
    "errorCode": "INVALID_CREDENTIALS",
    "path": "/api/v1/auth/login"
}
```

### Error Handling Flow
1. User submits login form
2. Auth service makes API call
3. If error occurs, auth effects capture error details
4. Error is stored in auth state
5. Login component subscribes to error state
6. Error message service translates error to user-friendly message
7. Alert is displayed with appropriate styling and actions
8. User can dismiss or retry (if applicable)

## Customization

### Adding New Error Codes
1. Add error code and message to `errorMessages` in `ErrorMessageService`
2. Update severity logic in `getErrorSeverity()` if needed
3. Update retry logic in `shouldShowRetry()` if needed

### Modifying Error Messages
Update the `errorMessages` object in `ErrorMessageService` with new Portuguese translations.

### Styling Changes
Modify the CSS classes in `login.component.scss` to change visual appearance.

## Testing

The system handles various error scenarios:
- Network errors (500, 502, 503, 504)
- Authentication errors (401, 403)
- Rate limiting (429)
- Validation errors (400)
- Custom API error codes

Each error type displays appropriate messaging and behavior based on the error context.
