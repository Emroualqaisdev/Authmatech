
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerificationFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [maskedNumber, setMaskedNumber] = useState<string | null>(null);
  
  useEffect(() => {
    // Get masked number from localStorage if available
    const storedNumber = localStorage.getItem("maskedNumber");
    if (storedNumber) {
      setMaskedNumber(storedNumber);
    }
  }, []);
  
  return (
    <div className="container">
      <div className="card">
        <img 
          src="/authmatech/src/assets/images/authmatech-logo.png" 
          alt="AuthmaTech Logo" 
          className="logo" 
        />
        
        <div className="error-icon icon-circle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" fill="currentColor"/>
            <path d="M13.5 16.5C13.5 17.3284 12.8284 18 12 18C11.1716 18 10.5 17.3284 10.5 16.5C10.5 15.6716 11.1716 15 12 15C12.8284 15 13.5 15.6716 13.5 16.5Z" fill="currentColor"/>
            <path d="M12 6C12.4142 6 12.75 6.33579 12.75 6.75V12.75C12.75 13.1642 12.4142 13.5 12 13.5C11.5858 13.5 11.25 13.1642 11.25 12.75V6.75C11.25 6.33579 11.5858 6 12 6Z" fill="currentColor"/>
          </svg>
        </div>
        
        <h2 className="text-center text-lg mb-2">Verification Failed</h2>
        
        <p className="text-center mb-4 text-sm text-secondary">
          Please enter a valid mobile number.
          {maskedNumber && maskedNumber !== "**********" && (
            <span className="block mt-2">Your last attempt was number ending with {maskedNumber.slice(-2)}</span>
          )}
        </p>
        
        <button 
          onClick={() => navigate('/verify')} 
          className="btn btn-primary mb-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default VerificationFailed;
