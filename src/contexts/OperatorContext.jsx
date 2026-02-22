import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const OperatorContext = createContext();

export const useOperator = () => {
  const context = useContext(OperatorContext);
  if (!context) {
    throw new Error('useOperator must be used within OperatorProvider');
  }
  return context;
};

// Operator roles and permissions
export const OPERATOR_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  SUPPORT: 'support',
  ANALYST: 'analyst',
};

export const PERMISSIONS = {
  // User Management
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  BAN_USERS: 'ban_users',
  
  // Content Management
  VIEW_CONTENT: 'view_content',
  EDIT_CONTENT: 'edit_content',
  DELETE_CONTENT: 'delete_content',
  MODERATE_CONTENT: 'moderate_content',
  
  // System Management
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_LOGS: 'view_logs',
  MANAGE_OPERATORS: 'manage_operators',
  
  // Problem Management
  CREATE_PROBLEMS: 'create_problems',
  EDIT_PROBLEMS: 'edit_problems',
  DELETE_PROBLEMS: 'delete_problems',
  
  // Support
  VIEW_TICKETS: 'view_tickets',
  RESPOND_TICKETS: 'respond_tickets',
  CLOSE_TICKETS: 'close_tickets',
};

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  [OPERATOR_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [OPERATOR_ROLES.ADMIN]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.BAN_USERS,
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.CREATE_PROBLEMS,
    PERMISSIONS.EDIT_PROBLEMS,
    PERMISSIONS.DELETE_PROBLEMS,
    PERMISSIONS.VIEW_TICKETS,
    PERMISSIONS.RESPOND_TICKETS,
    PERMISSIONS.CLOSE_TICKETS,
  ],
  [OPERATOR_ROLES.MODERATOR]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.BAN_USERS,
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.VIEW_TICKETS,
    PERMISSIONS.RESPOND_TICKETS,
  ],
  [OPERATOR_ROLES.SUPPORT]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.VIEW_TICKETS,
    PERMISSIONS.RESPOND_TICKETS,
    PERMISSIONS.CLOSE_TICKETS,
  ],
  [OPERATOR_ROLES.ANALYST]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_LOGS,
  ],
};

export const OperatorProvider = ({ children }) => {
  const { user } = useUser();
  const [operatorRole, setOperatorRole] = useState(null);
  const [isOperator, setIsOperator] = useState(false);
  const [permissions, setPermissions] = useState([]);

  // Check if user is an operator
  useEffect(() => {
    if (user) {
      // Check user metadata for operator role
      const role = user.publicMetadata?.operatorRole || user.unsafeMetadata?.operatorRole;
      
      if (role && Object.values(OPERATOR_ROLES).includes(role)) {
        setOperatorRole(role);
        setIsOperator(true);
        setPermissions(ROLE_PERMISSIONS[role] || []);
      } else {
        setOperatorRole(null);
        setIsOperator(false);
        setPermissions([]);
      }
    }
  }, [user]);

  // Check if operator has specific permission
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  // Check if operator has any of the specified permissions
  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  // Check if operator has all specified permissions
  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => permissions.includes(permission));
  };

  const value = {
    isOperator,
    operatorRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };

  return (
    <OperatorContext.Provider value={value}>
      {children}
    </OperatorContext.Provider>
  );
};
