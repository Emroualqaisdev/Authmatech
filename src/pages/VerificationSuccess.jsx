
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const [maskedNumber, setMaskedNumber] = useState(null);
  
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
          src="src/assets/images/authmatech-logo.png" 
          alt="AuthmaTech Logo" 
          className="logo" 
        />
        
        <div className="success-icon icon-circle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        
        <h2 className="text-center text-lg mb-2">Verification Successful!</h2>
        
        <p className="text-center mb-4 text-sm text-secondary">
          You're successfully verified and logged in 
          {maskedNumber && (
            <span className="block mt-2">with mobile ending in {maskedNumber.slice(-2)}</span>
          )}
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default VerificationSuccess;
