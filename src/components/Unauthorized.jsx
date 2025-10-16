import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const handleReturnToFlossly = () => {
    window.location.href = 'https://dev.flossly.ai';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unauthorized Access
          </h1>
          <p className="text-gray-600">
            The Bot Builder can only be accessed through your CRM system with a valid authentication token. 
            Please return to Flossly and use the "Connect to Bot" button to access this page.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleReturnToFlossly}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Return to Flossly
          </button>
          
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

