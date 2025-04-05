
import React from 'react';
import '../styles/loader.css';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader">
      <div className="loader-content">
        <img 
          src="src/assets/images/authmatech-logo.png" 
          alt="AuthmaTech Logo" 
          className="loader-logo" 
        />
        <div className="spinner"></div>
        <div className="loader-text">{message}</div>
      </div>
    </div>
  );
};

export default Loader;
