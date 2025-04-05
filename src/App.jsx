
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { isMobile } from './utils/device';
import VerifyNumber from './pages/VerifyNumber';
import VerificationSuccess from './pages/VerificationSuccess';
import VerificationFailed from './pages/VerificationFailed';
import Loader from './components/Loader';
import './styles/global.css';

// QR Code page for desktop users
const QRPage = () => {
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If on mobile, redirect to verification page
    if (isMobile()) {
      navigate('/verify');
      return;
    }
    
    // Set the QR code value to the verification URL
    const baseUrl = window.location.origin;
    setQrValue(`${baseUrl}/verify`);
    setLoading(false);
  }, [navigate]);

  if (loading) return <Loader message="Preparing verification..." />;

  return (
    <div className="container qr-page">
      <div className="card max-w-md md:max-w-xl lg:max-w-2xl">
        <img 
          src="src/assets/images/authmatech-logo.png" 
          className="logo" 
        />
        <h1 className="text-xl md:text-2xl font-semibold mb-1">Mobile Verification</h1>
        <p className="text-sm text-secondary mb-4">
          Please scan this QR code on your phone
        </p>
        
        <div className="qr-container mb-4">
          <QRCode 
            value={qrValue} 
            size={220}
            level="H"
            fgColor="#000000"
            bgColor="#FFFFFF"
          />
        </div>
        
        <div className="text-sm text-secondary">
          <p className="text-sm md:text-base text-gray-400 mb-4 text-center"
          >Ensure you're using your mobile data connection when scanning</p>
          
          <div className="info-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className='mr-200'  >For mobile verification only</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App component
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<QRPage />} />
        <Route path="/verify" element={<VerifyNumber />} />
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/verification-failed" element={<VerificationFailed />} />
      </Routes>
    </>
  );
}

export default App;
