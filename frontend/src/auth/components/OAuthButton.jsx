import React from 'react';
import { handleOAuthLogin } from '../services/authService';

const providerLabels = {
  google: 'Sign in with Google',
  apple: 'Sign in with Apple',
};

export default function OAuthButton({ provider, role }) {
  const handleClick = async (e) => {
    e.preventDefault();
    await handleOAuthLogin(provider, role);
    // Add redirect logic if needed
  };
  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-2 px-4 bg-white hover:bg-gray-100`}
      type="button"
    >
      {providerLabels[provider]}
    </button>
  );
}
