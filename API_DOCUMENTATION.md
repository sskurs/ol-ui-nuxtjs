# LoyaltyPro API Documentation

## Overview

This document provides comprehensive API documentation for the LoyaltyPro loyalty management system. The API is built with Next.js and provides endpoints for authentication, member management, analytics, and loyalty operations.

## Quick Start

### 1. Access API Documentation

- **Interactive Documentation**: Visit `/docs` for an interactive API testing interface
- **Swagger UI**: Visit `/api-docs` for full Swagger documentation
- **JSON Schema**: Access `/swagger.json` for the OpenAPI specification

### 2. Authentication

Most endpoints require authentication using JWT tokens:

```bash
# Login to get a token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### 3. Using the Token

Include the token in subsequent requests:

```bash
curl -X GET http://localhost:3000/api/admin/analytics/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| POST | `/api/auth/profile` | Update user profile | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/analytics` | Get system analytics | Yes |
| GET | `/api/admin/analytics/customers` | Get customer statistics | Yes |
| GET | `/api/admin/members` | Get members list | Yes |
| POST | `/api/admin/members` | Create new member | Yes |
| GET | `/api/admin/members/{id}` | Get member by ID | Yes |
| POST | `/api/admin/members/{id}` | Update member | Yes |

### Loyalty Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/loyalty/user` | Get user loyalty data | Yes |
| GET | `/api/loyalty/transactions` | Get user transactions | Yes |

### Partner Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/partner/customers` | Get partner customers | Yes |
| GET | `/api/partner/analytics` | Get partner analytics | Yes |

## Data Models

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "consumer|partner|admin",
  "permissions": ["string"],
  "lastLogin": "date-time"
}
```

### Member
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "points": "number",
  "tier": "Bronze|Silver|Gold|Platinum",
  "status": "active|inactive|suspended",
  "memberSince": "date-time",
  "lastActivity": "date-time",
  "totalSpent": "number",
  "transactions": "number"
}
```

### Analytics
```json
{
  "totalMembers": "number",
  "activePartners": "number",
  "pointsCirculating": "number",
  "systemRevenue": "number",
  "monthlyGrowth": [
    {
      "month": "string",
      "members": "number",
      "revenue": "number"
    }
  ]
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "details": "Detailed error information (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Testing the API

### Using the Interactive Documentation

1. Navigate to `/docs`
2. Select an endpoint from the list
3. Fill in any required parameters
4. Click "Test Endpoint"
5. View the response

### Using curl

```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'

# Test analytics (with token)
curl -X GET http://localhost:3000/api/admin/analytics/customers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  })
})

const { token } = await loginResponse.json()

// Use token for authenticated requests
const analyticsResponse = await fetch('/api/admin/analytics/customers', {
  headers: { 'Authorization': `Bearer ${token}` }
})

const analytics = await analyticsResponse.json()
```

## Development

### Running the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

### API Structure

```
app/api/
├── auth/
│   ├── login/
│   └── profile/
├── admin/
│   ├── analytics/
│   │   └── customers/
│   └── members/
├── loyalty/
│   └── user/
└── partner/
    └── customers/
```

### Adding New Endpoints

1. Create a new route file in the appropriate directory
2. Export HTTP method functions (GET, POST, etc.)
3. Add authentication middleware if needed
4. Update the Swagger documentation
5. Test the endpoint

### Authentication Middleware

For protected endpoints, check for the JWT token:

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  
  // Validate token and proceed with request
  // ...
}
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Ensure you're logged in and the token is valid
2. **404 Not Found**: Check the endpoint URL and ensure the route exists
3. **500 Internal Server Error**: Check server logs for detailed error information

### Debug Mode

Enable detailed error messages by setting `NODE_ENV=development`:

```bash
NODE_ENV=development npm run dev
```

### Logs

Check the console output for detailed request/response logs and error information.

## Support

For API support and questions:
- Check the interactive documentation at `/docs`
- Review the Swagger UI at `/api-docs`
- Check the server logs for detailed error information 