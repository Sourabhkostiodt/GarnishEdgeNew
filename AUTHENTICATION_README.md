# Authentication System with Auto Token Refresh

## Overview

This application implements a comprehensive authentication system with automatic token refresh functionality. The system handles JWT tokens with a 5-minute expiration time and automatically refreshes them 30 seconds before expiration.

## Key Features

### 🔐 Authentication Features
- **JWT Token Management**: Secure token-based authentication
- **Automatic Token Refresh**: Tokens refresh 30 seconds before expiration (every 4.5 minutes)
- **Persistent Sessions**: Tokens stored in localStorage for session persistence
- **Secure Logout**: Complete token cleanup on logout
- **Protected Routes**: Route-level authentication protection

### 🚀 Auto Refresh Functionality
- **Background Refresh**: Automatic token refresh without user intervention
- **Manual Refresh**: Optional manual token refresh for testing
- **Error Handling**: Graceful handling of refresh failures
- **Session Continuity**: Seamless user experience during token refresh

## Architecture

### Components

#### 1. AuthContext (`src/contexts/AuthContext.tsx`)
The central authentication context that manages:
- User authentication state
- Token storage and management
- Automatic token refresh scheduling
- Login/logout functionality

#### 2. ApiService (`src/contexts/ApiService.ts`)
Enhanced API service with:
- Token refresh integration
- Automatic token validation
- Error handling for expired tokens
- Base URL management

#### 3. ProtectedRoute (`src/components/ProtectedRoute.tsx`)
Route protection component that:
- Checks authentication status
- Redirects unauthenticated users
- Shows loading states during validation

#### 4. TokenStatus (`src/components/TokenStatus.tsx`)
UI component for:
- Displaying authentication status
- Manual token refresh testing
- User information display

#### 5. LogoutButton (`src/components/LogoutButton.tsx`)
Simple logout component for:
- User logout functionality
- Clean session termination

## API Endpoints

### Authentication Endpoints
```
POST /auth/login/           - User login (returns nested tokens structure)
POST /auth/token/verify/    - Token verification (body: { token: accessToken })
POST /auth/token/refresh/   - Token refresh (body: { token: refreshToken })
POST /auth/register         - User registration
POST /auth/forgot-password  - Password reset request
POST /auth/reset-password   - Password reset
```

### Token Refresh Flow
1. **Login**: User logs in and receives nested tokens structure from login API
2. **Storage**: Tokens extracted and stored in localStorage (`authToken` for access, `refreshToken` for refresh)
3. **Token Verification**: Access token sent to `/auth/token/verify/` with format `{ token: accessToken }`
4. **Auto Refresh**: System schedules refresh 30 seconds before expiration
5. **Background Refresh**: Refresh token sent to `/auth/token/refresh/` with format `{ token: refreshToken }`
6. **Error Handling**: If refresh fails, user is logged out

## Usage

### Setting up Authentication

1. **Wrap your app with AuthProvider**:
```tsx
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </Provider>
    </React.StrictMode>
);
```

2. **Use the useAuth hook in components**:
```tsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
    const { user, isAuthenticated, login, logout, refreshToken } = useAuth();
    
    // Your component logic
};
```

### Login Implementation

```tsx
const LoginComponent = () => {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            // Navigate to dashboard
            navigate('/analytics');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
};
```

### Protecting Routes

```tsx
import ProtectedRoute from '../components/ProtectedRoute';

const routes = [
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
];

## 📝 **API Request Formats**

### **Login Response Structure**
```json
{
  "success": true,
  "message": "Login successful",
  "status_code": 200,
  "tokens": {
    "access": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_at": "2025-08-14T12:27:17.555852"
    },
    "refresh": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_at": "2025-08-21T11:57:17.555854"
    }
  },
  "user_data": {
    "id": 22222,
    "username": "Garnish@123",
    "name": "ABS",
    "email": "demo@dbfy.in"
  }
}
```

### **Token Verification**
```json
POST /auth/token/verify/
{
  "token": "your_access_token_here"
}
```

### **Token Refresh**
```json
POST /auth/token/refresh/
{
  "token": "your_refresh_token_here"
}
```

### Manual Token Refresh

```tsx
const { refreshToken } = useAuth();

const handleManualRefresh = async () => {
    try {
        await refreshToken();
        console.log('Token refreshed successfully');
    } catch (error) {
        console.error('Token refresh failed:', error);
    }
};
```

## Configuration

### Token Expiration Settings
```typescript
// In AuthContext.tsx
const TOKEN_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
const REFRESH_BEFORE_EXPIRY = 30 * 1000; // 30 seconds
```

### API Base URLs
```typescript
// In ApiService.ts
const API_BASE_URL = 'https://garnishment-backend-6lzi.onrender.com';
const ProdAPI_BASE_URL = 'https://garnishedge-be.onrender.com';
```

## Token Storage

### Local Storage Keys
- `authToken`: Access token
- `refreshToken`: Refresh token
- `userData`: User information

### Security Considerations
- Tokens stored in localStorage for persistence
- Automatic cleanup on logout
- Secure token refresh without exposing refresh token in requests

## Error Handling

### Token Refresh Failures
- Automatic logout on refresh failure
- User notification of session expiration
- Redirect to login page

### Network Errors
- Retry logic for failed requests
- Graceful degradation
- User-friendly error messages

## Testing

### Manual Testing
1. **Login**: Test user login functionality
2. **Token Refresh**: Wait for auto-refresh or use manual refresh button
3. **Session Persistence**: Refresh page and verify session continues
4. **Logout**: Test complete session cleanup

### Token Status Component
The `TokenStatus` component on the Analytics page provides:
- Real-time authentication status
- Manual refresh button for testing
- User information display
- Token refresh timing information

## Troubleshooting

### Common Issues

1. **Token not refreshing automatically**:
   - Check browser console for errors
   - Verify refresh token is stored correctly
   - Ensure API endpoint is accessible

2. **Session lost on page refresh**:
   - Verify tokens are stored in localStorage
   - Check AuthContext initialization
   - Ensure ProtectedRoute is working correctly

3. **Login not working**:
   - Check API endpoint configuration
   - Verify login response format
   - Check network connectivity

### Debug Information
- Console logs for token operations
- Network tab for API requests
- Application tab for localStorage inspection

## Security Best Practices

1. **Token Security**:
   - Short expiration times (5 minutes)
   - Secure refresh token handling
   - Automatic cleanup on logout

2. **API Security**:
   - HTTPS endpoints
   - Proper CORS configuration
   - Input validation

3. **Client Security**:
   - Secure token storage
   - XSS protection
   - CSRF protection

## Future Enhancements

1. **Refresh Token Rotation**: Implement refresh token rotation for enhanced security
2. **Remember Me**: Add "remember me" functionality for longer sessions
3. **Multi-factor Authentication**: Add MFA support
4. **Session Management**: Add session management dashboard
5. **Audit Logging**: Add authentication event logging

## Support

For issues or questions about the authentication system:
1. Check the browser console for error messages
2. Review the network tab for failed requests
3. Verify API endpoint configuration
4. Test with the manual refresh button
5. Check localStorage for token storage issues 
