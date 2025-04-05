
import React, { useState } from 'react';

const PhoneConfirm = ({ data, onVerify }) => {
  const [mobile, setMobile] = useState(data?.mobile || '');
  const [countryCode, setCountryCode] = useState(data?.countryCode || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://be-authmatech-production.up.railway.app/v1/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobileNumber: `${countryCode}${mobile}`,
          clientId: "6bd57c0a-6e4b-4fae-88cf-f22ab89c8d5d"
        }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        onVerify();
      } else {
        setError(result.message || 'Mobile verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Is this your mobile?</h2>
      <p className="text-lg text-gray-700 mb-6">
        {countryCode} {mobile}
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <button 
        onClick={handleVerify} 
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </div>
        ) : (
          "Yes, Continue"
        )}
      </button>
    </div>
  );
};

export default PhoneConfirm;
