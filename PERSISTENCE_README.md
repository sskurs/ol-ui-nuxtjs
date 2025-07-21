# Member Persistence System

## Overview

The member management system now includes real persistence using JSON file storage. This allows member data to persist between page reloads and server restarts, providing a more realistic development experience.

## Features

### ✅ Persistent Storage
- **JSON File Storage**: Member data is stored in `data/members.json`
- **Automatic Directory Creation**: The `data/` directory is created automatically if it doesn't exist
- **Default Data**: Initial members are created when the storage file doesn't exist

### ✅ Full CRUD Operations
- **Create**: Add new members with validation
- **Read**: Get all members with pagination and search, or get individual members
- **Update**: Modify existing member data
- **Delete**: Remove members from the system

### ✅ Data Validation
- Required field validation (first name, last name, email)
- Email format validation
- Proper error handling and responses

### ✅ Search and Pagination
- Search members by name, email, first name, or last name
- Pagination support with configurable page size
- Total count and page information

## File Structure

```
ol-ui-nuxt/
├── lib/
│   └── member-storage.ts          # Core persistence logic
├── app/api/admin/members/
│   ├── route.ts                   # GET (list), POST (create)
│   └── [id]/route.ts              # GET, PUT, DELETE (individual)
├── data/
│   └── members.json               # Persistent storage file
└── PERSISTENCE_README.md          # This documentation
```

## API Endpoints

### List Members
```
GET /api/admin/members?page=1&perPage=10&search=john
```

### Create Member
```
POST /api/admin/members
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1-555-0124",
    "relationship": "Spouse"
  },
  "preferences": {
    "marketingEmails": true,
    "smsNotifications": true,
    "newsletter": false
  }
}
```

### Get Member
```
GET /api/admin/members/{id}
```

### Update Member
```
PUT /api/admin/members/{id}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  // ... other fields
}
```

### Delete Member
```
DELETE /api/admin/members/{id}
```

## Data Model

Each member includes:

```typescript
interface Member {
  id: string                    // Auto-generated unique ID
  name: string                  // Full name (firstName + lastName)
  email: string                 // Email address
  phone: string                 // Phone number
  points: number                // Loyalty points
  tier: string                  // Membership tier (Bronze, Silver, Gold, Platinum)
  status: "active" | "inactive" | "suspended"
  memberSince: string           // ISO date string
  lastActivity: string          // ISO date string
  totalSpent: number            // Total amount spent
  transactions: number          // Number of transactions
  firstName: string
  lastName: string
  dateOfBirth: string | null
  gender: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  preferences: {
    marketingEmails: boolean
    smsNotifications: boolean
    newsletter: boolean
  }
}
```

## Usage

### Frontend Integration
The frontend components automatically use the persistent storage through the existing API client. No changes are needed to the UI components.

### Development
1. Start the development server: `npm run dev`
2. Navigate to the admin members page
3. Add, edit, or delete members
4. Data will persist in `data/members.json`
5. Restart the server to verify persistence

### Production Considerations
- **File Permissions**: Ensure the `data/` directory is writable
- **Backup**: Regularly backup the `members.json` file
- **Migration**: When moving to a real database, export data from JSON
- **Concurrency**: JSON storage doesn't handle concurrent writes well

## Benefits

1. **Realistic Development**: Data persists between sessions
2. **No Database Setup**: Simple file-based storage for development
3. **Easy Testing**: Can manually edit JSON file for testing
4. **Version Control**: Can track data changes in git (if desired)
5. **Portable**: Easy to move between environments

## Future Enhancements

- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] Data migration tools
- [ ] Backup and restore functionality
- [ ] Data validation schemas
- [ ] Audit logging
- [ ] Soft delete (mark as deleted instead of removing) 