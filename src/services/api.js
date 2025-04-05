
const LOCAL_API_URL = 'http://localhost:8080/v1/api';
const DOT_API_URL = 'http://www.dot-jo.biz/appgw';

export const getMSISDN = async () => {
  try {
    const response = await fetch(
      `${DOT_API_URL}/GetPartnerHEMSISDN?partnerId=partner-a5601b8b&serviceId=test_service_partner`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('MSISDN fetch error:', errorText);
      throw new Error(`MSISDN request failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching MSISDN:', error);
    throw error;
  }
};

export const verifyNumber = async (verificationData) => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/verify?maskMobile=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Verification failed with status: ${response.status}`);
    }
    
    // If there's a masked mobile number in the response, store it
    if (data.data?.mobileNumber) {
      localStorage.setItem('maskedNumber', data.data.mobileNumber);
    }
    
    return data;
  } catch (error) {
    console.error('Error verifying number:', error);
    throw error;
  }
};

// Format phone display for better UI presentation
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // If phone is longer than 10 digits, format as international
  if (phone.length > 10) {
    return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
  }
  
  // Format as local number
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
};

export const getFriendlyErrorMessage = (code) => {
  const errorMessages = {
    '-1': "We couldn't detect your mobile number. Please ensure you're using mobile data.",
    '-4': "Please disable WiFi/VPN and use mobile data to continue.",
    '-2': 'Service is currently unavailable. Please try again later.',
    '-3': 'Authentication failed. Please contact support.',
    'INVALID_PHONE': 'The phone number provided is invalid.',
    'VERIFICATION_FAILED': 'We couldn\'t verify your phone number. Please try again.'
  };
  
  return errorMessages[code] || 'An unknown error occurred. Please try again.';
};
