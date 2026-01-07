// Clerk configuration utilities to handle bot protection and Turnstile issues

export const getClerkAppearanceConfig = (theme = 'dark') => {
  return {
    baseTheme: theme,
    elements: {
      formButtonPrimary: {
        backgroundColor: '#6366f1',
        '&:hover': {
          backgroundColor: '#4f46e5'
        }
      },
      card: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      },
      headerTitle: {
        color: theme === 'dark' ? '#ffffff' : '#111827'
      },
      headerSubtitle: {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
      },
      formFieldInput: {
        backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
        border: theme === 'dark' ? '1px solid #4b5563' : '1px solid #d1d5db',
        color: theme === 'dark' ? '#ffffff' : '#111827',
        '&:focus': {
          borderColor: '#6366f1',
          boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
        }
      },
      formFieldLabel: {
        color: theme === 'dark' ? '#e5e7eb' : '#374151'
      },
      // Hide or style captcha container to prevent Turnstile errors
      captcha: {
        display: 'none !important', // Hide captcha completely
        visibility: 'hidden',
        height: '0px',
        overflow: 'hidden'
      },
      // Alternative: Style captcha if it appears
      captchaContainer: {
        display: 'none !important'
      }
    },
    layout: {
      socialButtonsPlacement: 'bottom',
      socialButtonsVariant: 'blockButton'
    },
    variables: {
      colorPrimary: '#6366f1',
      colorText: theme === 'dark' ? '#ffffff' : '#111827',
      colorTextSecondary: theme === 'dark' ? '#9ca3af' : '#6b7280',
      colorBackground: theme === 'dark' ? '#1f2937' : '#ffffff',
      colorInputBackground: theme === 'dark' ? '#374151' : '#f9fafb',
      colorInputText: theme === 'dark' ? '#ffffff' : '#111827'
    }
  };
};

export const getClerkProviderConfig = () => {
  return {
    // Disable bot protection to prevent Turnstile loading
    experimental: {
      captchaPublicKey: null, // Disable captcha
      captchaSecretKey: null
    },
    // Additional options to prevent Turnstile
    options: {
      skipBotProtection: true,
      disableCaptcha: true
    }
  };
};