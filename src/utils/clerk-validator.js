export const validateClerkKey = (key) => {
  if (!key) {
    return { valid: false, error: 'No key provided' };
  }

  // Check if it starts with the correct prefix
  if (!key.startsWith('pk_test_') && !key.startsWith('pk_live_')) {
    return { valid: false, error: 'Key must start with pk_test_ or pk_live_' };
  }

  // Check length (Clerk keys are typically longer)
  if (key.length < 50) {
    return { valid: false, error: 'Key appears too short' };
  }

  // Check if it ends with a domain-like structure
  const parts = key.split('.');
  if (parts.length < 3) {
    return { valid: false, error: 'Key should contain domain structure' };
  }

  // Check for suspicious characters
  if (key.includes('$')) {
    return { valid: false, error: 'Key contains suspicious characters ($)' };
  }

  return { valid: true, error: null };
};

export const getClerkKeyInfo = () => {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const validation = validateClerkKey(key);
  
  return {
    key: key ? `${key.substring(0, 20)}...` : 'Not found',
    fullKey: key,
    validation,
    environment: key?.startsWith('pk_test_') ? 'test' : key?.startsWith('pk_live_') ? 'live' : 'unknown'
  };
};