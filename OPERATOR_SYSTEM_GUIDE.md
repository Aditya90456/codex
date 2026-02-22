# Operator System Guide

## Overview

The Operator System provides comprehensive admin and moderation capabilities for managing users, content, problems, and system settings.

## Features

### 1. Role-Based Access Control (RBAC)

#### Operator Roles

- **Super Admin**: Full system access
- **Admin**: Manage users, content, problems, and settings
- **Moderator**: Content moderation and user management
- **Support**: Handle support tickets and view users
- **Analyst**: View analytics and system logs

#### Permissions

```javascript
// User Management
VIEW_USERS, EDIT_USERS, DELETE_USERS, BAN_USERS

// Content Management
VIEW_CONTENT, EDIT_CONTENT, DELETE_CONTENT, MODERATE_CONTENT

// System Management
VIEW_ANALYTICS, MANAGE_SETTINGS, VIEW_LOGS, MANAGE_OPERATORS

// Problem Management
CREATE_PROBLEMS, EDIT_PROBLEMS, DELETE_PROBLEMS

// Support
VIEW_TICKETS, RESPOND_TICKETS, CLOSE_TICKETS
```

### 2. Dashboard Modules

#### User Management
- View all users with search and filter
- Edit user details
- Ban/unban users
- Delete user accounts
- View user statistics

#### Content Moderation
- Review flagged content
- Approve/reject content
- Delete inappropriate content
- Track moderation history

#### Problem Management
- Create new problems
- Edit existing problems
- Delete problems
- View problem statistics

#### Analytics
- User growth metrics
- Problem solving statistics
- Session analytics
- Engagement metrics

#### Support Tickets
- View all support tickets
- Respond to tickets
- Close resolved tickets
- Priority management

#### System Settings
- General configuration
- Notification settings
- Rate limits
- Database management

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Operator Roles in Clerk

Add operator role to user metadata in Clerk Dashboard:

```json
{
  "operatorRole": "admin"
}
```

### 3. Wrap App with OperatorProvider

```jsx
import { OperatorProvider } from './contexts/OperatorContext';

function App() {
  return (
    <OperatorProvider>
      {/* Your app components */}
    </OperatorProvider>
  );
}
```

### 4. Add Operator Route

```jsx
import OperatorPage from './pages/OperatorPage';

// In your router
<Route path="/operator" element={<OperatorPage />} />
```

## Usage

### Check if User is Operator

```jsx
import { useOperator } from './contexts/OperatorContext';

function MyComponent() {
  const { isOperator, operatorRole } = useOperator();
  
  if (!isOperator) {
    return <div>Access Denied</div>;
  }
  
  return <div>Welcome, {operatorRole}</div>;
}
```

### Check Permissions

```jsx
import { useOperator, PERMISSIONS } from './contexts/OperatorContext';

function UserActions() {
  const { hasPermission } = useOperator();
  
  return (
    <div>
      {hasPermission(PERMISSIONS.EDIT_USERS) && (
        <button>Edit User</button>
      )}
      {hasPermission(PERMISSIONS.DELETE_USERS) && (
        <button>Delete User</button>
      )}
    </div>
  );
}
```

### Check Multiple Permissions

```jsx
const { hasAnyPermission, hasAllPermissions } = useOperator();

// Check if user has ANY of these permissions
if (hasAnyPermission([PERMISSIONS.EDIT_USERS, PERMISSIONS.VIEW_USERS])) {
  // Show user management
}

// Check if user has ALL of these permissions
if (hasAllPermissions([PERMISSIONS.EDIT_USERS, PERMISSIONS.DELETE_USERS])) {
  // Show advanced user management
}
```

## Security Best Practices

1. **Always verify permissions** before performing sensitive operations
2. **Use Clerk's metadata** to store operator roles securely
3. **Implement backend validation** for all operator actions
4. **Log all operator activities** for audit trails
5. **Use HTTPS** for all operator dashboard access
6. **Implement rate limiting** on operator actions
7. **Regular security audits** of operator permissions

## API Integration

### Backend Endpoints (Example)

```javascript
// User Management
POST /api/operator/users/:id/ban
POST /api/operator/users/:id/edit
DELETE /api/operator/users/:id

// Content Moderation
POST /api/operator/content/:id/approve
POST /api/operator/content/:id/reject
DELETE /api/operator/content/:id

// Problem Management
POST /api/operator/problems
PUT /api/operator/problems/:id
DELETE /api/operator/problems/:id

// Settings
PUT /api/operator/settings
GET /api/operator/analytics
```

### Backend Permission Check

```javascript
// Express.js middleware example
const checkOperatorPermission = (permission) => {
  return async (req, res, next) => {
    const user = req.user;
    const role = user.operatorRole;
    
    if (!role || !ROLE_PERMISSIONS[role].includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage
app.post('/api/operator/users/:id/ban', 
  checkOperatorPermission(PERMISSIONS.BAN_USERS),
  banUserHandler
);
```

## Customization

### Adding New Roles

```javascript
// In OperatorContext.jsx
export const OPERATOR_ROLES = {
  // ... existing roles
  CUSTOM_ROLE: 'custom_role',
};

const ROLE_PERMISSIONS = {
  // ... existing mappings
  [OPERATOR_ROLES.CUSTOM_ROLE]: [
    PERMISSIONS.VIEW_USERS,
    // Add custom permissions
  ],
};
```

### Adding New Permissions

```javascript
export const PERMISSIONS = {
  // ... existing permissions
  CUSTOM_PERMISSION: 'custom_permission',
};
```

### Adding New Dashboard Modules

1. Create component in `src/components/Operator/`
2. Import in `OperatorDashboard.jsx`
3. Add tab configuration
4. Add permission check

## Troubleshooting

### User Can't Access Operator Dashboard

1. Check if `operatorRole` is set in Clerk metadata
2. Verify role is valid (matches OPERATOR_ROLES)
3. Check if OperatorProvider wraps the app
4. Verify route is configured correctly

### Permission Denied Errors

1. Check if user's role has the required permission
2. Verify ROLE_PERMISSIONS mapping
3. Check if permission constant is correct
4. Ensure backend validates permissions

### Dashboard Not Loading

1. Check console for errors
2. Verify all imports are correct
3. Ensure Clerk is properly configured
4. Check if user is authenticated

## Future Enhancements

- [ ] Activity logs and audit trails
- [ ] Advanced analytics with charts
- [ ] Bulk operations for users/content
- [ ] Email notification system
- [ ] Scheduled tasks management
- [ ] API rate limiting dashboard
- [ ] Real-time monitoring
- [ ] Export data functionality
- [ ] Custom report generation
- [ ] Two-factor authentication for operators

## Support

For issues or questions:
1. Check this documentation
2. Review console errors
3. Check Clerk configuration
4. Verify backend API responses
5. Contact system administrator

## License

This operator system is part of the main application and follows the same license.
