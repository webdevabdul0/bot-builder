import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BotBuilder from '../BotBuilder';
import Unauthorized from './Unauthorized';
import authService from '../services/authService';
import { Loader2 } from 'lucide-react';

const AuthWrapper = () => {
  const [searchParams] = useSearchParams();
  const [authState, setAuthState] = useState('loading'); // 'loading', 'authenticated', 'unauthorized'
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        // Get token from URL query params
        const shortToken = searchParams.get('token');
        
        if (!shortToken) {
          setError('No authentication token provided');
          setAuthState('unauthorized');
          return;
        }

        // Exchange short token for access token
        const tokenResult = await authService.exchangeShortToken(shortToken);
        
        if (!tokenResult.success) {
          setError(tokenResult.error || 'Token exchange failed');
          setAuthState('unauthorized');
          return;
        }

        // Fetch user profile
        const profileResult = await authService.getUserProfile();
        
        if (!profileResult.success) {
          setError(profileResult.error || 'Failed to fetch user profile');
          setAuthState('unauthorized');
          return;
        }

        // Store profile data
        setUserProfile(profileResult.profile);
        setAuthState('authenticated');
        
      } catch (error) {
        console.error('Authentication error:', error);
        setError('An unexpected error occurred during authentication');
        setAuthState('unauthorized');
      }
    };

    authenticateUser();
  }, [searchParams]);

  // Loading state
  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authenticating...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your access.
          </p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (authState === 'unauthorized') {
    return <Unauthorized />;
  }

  // Authenticated state - render BotBuilder with user profile
  if (authState === 'authenticated' && userProfile) {
    return <BotBuilder userProfile={userProfile} />;
  }

  // Fallback
  return <Unauthorized />;
};

export default AuthWrapper;

