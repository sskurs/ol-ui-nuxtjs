# Admin Login Integration with Symfony Backend

This document describes the integration of the Next.js frontend admin login with the Symfony backend API.

## Overview

The admin login functionality has been updated to integrate with the Symfony backend instead of using mock data. The integration handles:

- Real authentication against the Symfony backend
- JWT token management
- Role-based access control
- Error handling and user feedback
- **Dark theme support** with theme toggle functionality

## Features

### 🎨 **Dark Theme Support**
- **Default Dark Mode**: The application now uses dark theme by default
- **Theme Toggle**: Users can switch between Light, Dark, and System themes
- **Login Page**: Theme toggle available on the login page
- **Dashboard**: Theme toggle in the header for authenticated users
- **Responsive Design**: All components adapt to the selected theme

### 🔐 **Authentication Features**
- **Real Backend Integration**: Admin login connects to Symfony backend
- **JWT Token Management**: Secure token-based authentication
- **Role-based Access**: Different interfaces for Consumer, Partner, and Admin
- **Error Handling**: Comprehensive error messages and validation

## Architecture

### Frontend (Next.js)
- **API Route**: `/api/auth/login` - Handles login requests and forwards admin requests to backend
- **Auth Context**: Manages authentication state and token storage
- **Types**: TypeScript interfaces for type safety

### Backend (Symfony)
- **Endpoint**: `/api/admin/login_check` - Symfony's admin authentication endpoint
- **JWT**: Generates JWT tokens for authenticated users
- **Security**: Role-based access control with admin-specific permissions

## Implementation Details

### 1. API Route (`/api/auth/login`)

The login API route now:
- Detects admin login requests (`role === "admin"`)
- Forwards credentials to Symfony backend
- Transforms backend response to match frontend expectations
- Handles errors gracefully

```typescript
// Admin login flow
if (role === "admin") {
  const response = await fetch(`${backendUrl}/api/admin/login_check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: email,  // Symfony expects 'username'
      password: password,
    }),
  })
}
```

### 2. Backend Integration

**Request Format**:
```json
{
  "username": "admin@example.com",
  "password": "adminpassword"
}
```

**Response Format**:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "admin@example.com",
    "roles": ["ROLE_ADMIN"]
  }
}
```

### 3. Frontend Response Transformation

The backend response is transformed to match frontend expectations:

```typescript
const user = {
  id: backendData.user.id,
  name: backendData.user.username,
  email: email,
  role: "admin" as const,
  permissions: backendData.user.roles,
  lastLogin: new Date().toISOString(),
}
```

## Configuration

### Environment Variables

Create a `.env.local` file in the frontend root:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Development settings
NODE_ENV=development
```

### Backend Requirements

Ensure the Symfony backend:
1. Is running on the configured URL
2. Has CORS properly configured for frontend domain
3. Has admin users in the database
4. JWT configuration is properly set up

## Testing

### Manual Testing

1. Start the Symfony backend:
   ```bash
   cd backend
   php bin/console server:start
   ```

2. Start the Next.js frontend:
   ```bash
   cd ol-ui-nuxt
   npm run dev
   ```

3. Navigate to the login page and select "Admin" tab
4. Enter admin credentials
5. Verify successful login and redirection to admin dashboard

### Automated Testing

Run the test script:
```bash
cd ol-ui-nuxt
node test-admin-login.js
```

## Error Handling

The integration handles various error scenarios:

- **Invalid Credentials**: Returns 401 with user-friendly message
- **Backend Unavailable**: Returns 500 with connection error message
- **Invalid Access Code**: Returns 401 for admin access code validation
- **Network Errors**: Graceful fallback with error messages

## Security Considerations

1. **Access Code**: Admin login requires an access code (currently hardcoded as "admin123")
2. **JWT Tokens**: Tokens are stored in localStorage (consider httpOnly cookies for production)
3. **CORS**: Backend must be configured to allow frontend domain
4. **HTTPS**: Use HTTPS in production for secure communication

## Future Enhancements

1. **Refresh Tokens**: Implement JWT refresh token functionality
2. **Session Management**: Add session timeout and auto-logout
3. **Multi-factor Authentication**: Add 2FA for admin accounts
4. **Audit Logging**: Log admin login attempts and actions
5. **Rate Limiting**: Implement rate limiting for login attempts

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS configuration includes frontend domain
2. **Connection Refused**: Verify backend is running and accessible
3. **Invalid Token**: Check JWT configuration in backend
4. **401 Errors**: Verify admin credentials exist in database

### Debug Steps

1. Check browser network tab for API requests
2. Verify environment variables are loaded correctly
3. Test backend endpoint directly with curl or Postman
4. Check backend logs for authentication errors

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Frontend login endpoint (handles admin routing) |
| POST | `/api/admin/login_check` | Backend admin authentication |
| GET | `/api/security/me` | Get current user profile |

## Dependencies

- **Frontend**: Next.js, TypeScript, React Query
- **Backend**: Symfony, JWT Bundle, Security Bundle
- **Communication**: Fetch API, JSON 