# Token Refresh Implementation

This document describes the token refresh implementation in the application, which handles expired tokens and forbidden access.

## Overview

The application uses JWT tokens for authentication. Two types of tokens are used:
- **Access Token**: Short-lived token used for API requests
- **Refresh Token**: Long-lived token used to obtain a new access token when it expires

## Implementation Details

### Token Storage

Tokens are stored in:
- `localStorage.getItem('accessToken')` - The access token
- `localStorage.getItem('refreshToken')` - The refresh token

### Token Expiration Detection

The `JwtTokenService` provides a method to check if the token is expired:

```typescript
// JwtTokenService method
static isTokenExpired(): boolean {
  if (!this.decodedToken || !this.decodedToken.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime > this.decodedToken.exp;
}
```

### Token Refresh Flow

The token refresh flow is implemented in two interceptors:

1. **Token Expired Interceptor**: Checks if the token is expired before making a request
   - If the token is expired and a refresh token exists, it dispatches the refresh token action
   - If no refresh token exists, it redirects to login

2. **Token Interceptor**: Adds the token to requests and handles 401/403 responses
   - Adds the Authorization header with the token
   - If a 401/403 response is received, it attempts to refresh the token
   - If the refresh token request fails, it redirects to login

### NgRx Implementation

The token refresh is implemented using NgRx:

1. **Actions**:
   - `refreshToken`: Initiates the token refresh process
   - `refreshTokenSuccess`: Handles successful token refresh
   - `refreshTokenFailure`: Handles failed token refresh

2. **Effects**:
   - `refreshToken$`: Makes the API call to refresh the token
   - `refreshTokenSuccess$`: Decodes the new token

3. **Reducers**:
   - Updates the state with the new tokens
   - Stores the new tokens in localStorage

## Error Handling

- If the refresh token is invalid or expired, the user is redirected to the login page
- If the API returns a 401/403 error, the application attempts to refresh the token
- If the token refresh fails, the user is redirected to the login page with an error message

## Testing

A test script is provided in `src/app/core/test-token-refresh.ts` to manually verify the token refresh implementation.

## Sequence Diagram

```
┌─────────┐          ┌─────────────┐          ┌─────────┐          ┌─────────┐
│  Client │          │  Interceptor │          │  NgRx   │          │  API    │
└────┬────┘          └──────┬──────┘          └────┬────┘          └────┬────┘
     │  1. API Request      │                      │                    │
     │─────────────────────>│                      │                    │
     │                      │                      │                    │
     │                      │  2. Check Token      │                    │
     │                      │──────────────────────│                    │
     │                      │                      │                    │
     │                      │  3. Token Expired    │                    │
     │                      │<─────────────────────│                    │
     │                      │                      │                    │
     │                      │  4. Dispatch Refresh │                    │
     │                      │──────────────────────>                    │
     │                      │                      │                    │
     │                      │                      │  5. Refresh Request│
     │                      │                      │───────────────────>│
     │                      │                      │                    │
     │                      │                      │  6. New Tokens     │
     │                      │                      │<───────────────────│
     │                      │                      │                    │
     │                      │  7. Update Store     │                    │
     │                      │<─────────────────────│                    │
     │                      │                      │                    │
     │                      │  8. Retry Request    │                    │
     │                      │────────────────────────────────────────────>
     │                      │                      │                    │
     │  9. API Response     │                      │                    │
     │<─────────────────────────────────────────────────────────────────│
     │                      │                      │                    │
```

## Conclusion

This implementation ensures that:
1. Expired tokens are automatically refreshed
2. Unauthorized/forbidden responses trigger a token refresh
3. Failed token refreshes redirect to login
4. The user experience is seamless with minimal disruption
