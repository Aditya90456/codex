import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { getClerkKeyInfo } from '../../utils/clerk-validator';

const ClerkValidator = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);
  const [keyInfo, setKeyInfo] = useState(null);
  const clerk = useClerk();

  useEffect(() => {
    const validateClerk = async () => {
      try {
        const info = getClerkKeyInfo();
        setKeyInfo(info);
        
        console.log('🔍 Validating Clerk setup...');
        console.log('Key Info:', info);
        
        if (!info.validation.valid) {
          setError(`Invalid Clerk key: ${info.validation.error}`);
          setStatus('error');
          return;
        }

        if (clerk) {
          console.log('✅ Clerk instance available');
          console.log('Clerk loaded:', clerk.loaded);
          setStatus('success');
        } else {
          setError('Clerk instance not available');
          setStatus('error');
        }
      } catch (err) {
        console.error('Clerk validation error:', err);
        setError(err.message);
        setStatus('error');
      }
    };

    validateClerk();
  }, [clerk]);

  if (status === 'checking') {
    return (
      <div className="fixed top-4 left-4 p-3 bg-blue-100 text-blue-800 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-sm">Validating Clerk...</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed top-4 left-4 p-3 bg-red-100 text-red-800 rounded-lg shadow-lg max-w-sm">
        <div className="font-bold text-sm mb-1">❌ Clerk Error</div>
        <div className="text-xs mb-2">{error}</div>
        {keyInfo && (
          <div className="text-xs">
            <div>Key: {keyInfo.key}</div>
            <div>Env: {keyInfo.environment}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 p-3 bg-green-100 text-green-800 rounded-lg shadow-lg">
      <div className="font-bold text-sm">✅ Clerk Ready</div>
      <div className="text-xs">
        <div>Environment: {keyInfo?.environment}</div>
        <div>Key: {keyInfo?.key}</div>
      </div>
    </div>
  );
};

export default ClerkValidator;