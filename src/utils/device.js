/**
 * Check if the current device is a mobile device
 * @returns {boolean} True if the device is mobile, false otherwise
 */
export const isMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Check if device is iOS or Android
  if (/android/i.test(userAgent) || 
      /iPad|iPhone|iPod/.test(userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return true;
  }

  // Check screen size as fallback
  return window.innerWidth <= 768;
};

/**
 * Check if the device is using a cellular connection
 * Note: This is not 100% reliable and requires navigator.connection
 */
export const isCellularConnection = () => {
  const connection = navigator.connection || 
                    navigator.mozConnection || 
                    navigator.webkitConnection;

  if (connection) {
    return connection.type === 'cellular';
  }

  // If connection API is not available, assume true for mobile devices
  return isMobile();
};