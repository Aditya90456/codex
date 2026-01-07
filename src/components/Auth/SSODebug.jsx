import { useEffect, useState } from 'react';

const SSODebug = () => {
  const [ssoStatus, setSsoStatus] = useState({
    googleEnabled: false,
    githubEnabled: false,
    linkedinEnabled: false,
    clerkLoaded: false,
    errors: []
  });

  useEffect(() => {
    // Check if Clerk is loaded and SSO providers are available
    const checkSSOStatus = () => {
      try {
        // Check if Clerk is available
        const clerkLoaded = window.Clerk !== undefined;
        
        // Check for social provider buttons in the DOM
        const googleButton = document.querySelector('[data-clerk-oauth="oauth_google"]');
        const githubButton = d