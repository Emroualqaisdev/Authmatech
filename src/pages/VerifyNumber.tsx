
import React, { useState, useEffect, useRef, Fragment, FormEvent } from "react";
import { getMSISDN, verifyNumber } from '../services/api';
import { useNavigate, useLocation } from "react-router-dom";
import { Combobox, Transition } from "@headlessui/react";
import { isMobile } from "../utils/device";
import Loader from "../components/Loader";

interface Country {
  name: string;
  countryCode: string;
  code: string;
}

interface MSISDNResponse {
  encMSISDN: string;
  opId: string;
  errorCode: string;
  heId: string;
  errorDesc: string;
}

const countries: Country[] = [
  { name: "Jordan", countryCode: "JO", code: "+962" },
  { name: "United Arab Emirates ", countryCode: "UAE", code: "+971" },
  { name: "Saudi Arabia", countryCode: "KSA", code: "+966" },
];

const getFriendlyErrorMessage = (errorCode: string): string => {
  switch (errorCode) {  
  case "-1":
    return "We couldn't detect your mobile number. Please make sure you're connected to mobile data and try again.";
  case "-4":
    return "To continue, please turn off WiFi or VPN and switch to mobile data.";
  case "-2":
    return "Mobile verification isn’t available in your region yet. Thank you for your interest!";
  default:
    return "Something went wrong during verification. Please try again or contact support.";
  }
};

const VerifyNumber: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [msisdnData, setMsisdnData] = useState<MSISDNResponse | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [query, setQuery] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [processingReturn, setProcessingReturn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maskedNumber, setMaskedNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!isMobile()) {
      navigate('/');
      return;
    }

    const fetchMSISDN = async () => {
      try {
        const data = await getMSISDN();
        setMsisdnData(data);

        if (data.errorCode !== "0") {
          setError(getFriendlyErrorMessage(data.errorCode));
        }
      } catch (error) {
        setError("Connection error. Please check your network and try again.");
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    };

    fetchMSISDN();
  }, [navigate]);

  const filteredCountries =
    query === ""
      ? countries
      : countries.filter((country) => {
          const searchLower = query.toLowerCase();
          return (
            country.name.toLowerCase().includes(searchLower) ||
            country.countryCode.toLowerCase().includes(searchLower) ||
            country.code.toLowerCase().includes(searchLower) ||
            country.code.replace("+", "").includes(searchLower)
          );
        });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encryptedValue = params.get("e");
    const errorCode = params.get("ec");

    if (encryptedValue && errorCode === "0") {
      setProcessingReturn(true);

      const verifyWithEncryptedValue = async () => {
        try {
          setLoading(true);
          const fullPhoneNumber = localStorage.getItem("pendingPhoneNumber");

          if (!fullPhoneNumber) {
            throw new Error("No pending phone number found");
          }

          const verificationPayload = {
            clientId: "6bd57c0a-6e4b-4fae-88cf-f22ab89c8d5d",
            mobileNumber: fullPhoneNumber,
            encryptedMobileNumber: "u9qnp16CTgKCoqRTK4OjSBa9RCKeJUiCv8PTb1Kytto\u003d"
            
            // encryptedValue,
          };

          const verifyResult = await verifyNumber(verificationPayload);

          if (!verifyResult) {
            throw new Error("Verification failed");
          }

          localStorage.removeItem("pendingPhoneNumber");

          if (verifyResult.success && verifyResult.data?.validNumber) {
            // Store masked number for success page
            if (verifyResult.data?.mobileNumber) {
              localStorage.setItem("maskedNumber", verifyResult.data.mobileNumber);
            }
            navigate("/verification-success");
          } else {
            if (verifyResult.data?.mobileNumber) {
              localStorage.setItem("maskedNumber", verifyResult.data.mobileNumber);
            }
            navigate("/verification-failed");
          }
        } catch (error) {
          console.error("Verification error:", error);
          setError("Failed to verify your number. Please try again.");
          setTimeout(() => {
            navigate("/verify");
          }, 3000);
        } finally {
          setLoading(false);
          setProcessingReturn(false);
        }
      };

      verifyWithEncryptedValue();
    } else if (errorCode) {
      setError("Verification failed. Please ensure you're using mobile data.");
    }
  }, [location.search, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate phone number
    if (!phoneInput || phoneInput.length < 6) {
      setError("Please enter a valid phone number");
      return;
    }

    // if (!msisdnData?.encMSISDN) {
    //   setError("Please ensure you're using mobile data to continue.");
    //   return;
    // }

    setLoading(true);
    setError(null);

    // Clean and format the phone number
    const cleanCountryCode = selectedCountry.code.replace("+", "");
    const cleanPhone = phoneInput.startsWith("0")
      ? phoneInput.substring(1)
      : phoneInput;
    const fullPhoneNumber = cleanCountryCode + cleanPhone;

    // Store the phone number in localStorage for verification after redirect
    localStorage.setItem("pendingPhoneNumber", fullPhoneNumber);

    try {
      const verifyPayload = {
        clientId: "6bd57c0a-6e4b-4fae-88cf-f22ab89c8d5d",
        mobileNumber: fullPhoneNumber,
        encryptedMobileNumber: "u9qnp16CTgKCoqRTK4OjSBa9RCKeJUiCv8PTb1Kytto\u003d"
        
        // msisdnData.encMSISDN,
      };

      const response = await fetch(
        "https://be-authmatech-production.up.railway.app/v1/api/verify?maskMobile=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verifyPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification request failed");
      }

      // Redirect to the partner URL for DOT verification
      const redirectUrl = `http://www.dot-jo.biz/appgw/PartnerHERedirect?partnerId=partner-a5601b8b&rurl=${encodeURIComponent(
        window.location.origin + "/verify"
      )}`;

      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Verification error:", error);
      setError(error instanceof Error ? error.message : "Failed to verify your number. Please try again.");
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Loader message="Preparing verification..." />;
  }

  if (processingReturn) {
    return <Loader message="Verifying your number..." />;
  }

  return (
    <div className="container">
      <div className="card">
        <img 
          src="src/assets/images/authmatech-logo.png" 
          alt="AuthmaTech Logo" 
          className="logo" 
        />
        
        <h1 className="text-center text-lg mb-4">Verify Your Phone Number</h1>

        {error && (
          <div className="alert alert-error mb-4">
            <div className="alert-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
            </div>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Country Code</label>
            <Combobox value={selectedCountry} onChange={setSelectedCountry}>
              <div className="relative">
                <Combobox.Button className="w-full">
                  <div className="form-control flex items-center justify-between country-selector">
                    <span className="selected-country">
                      {selectedCountry.name} ({selectedCountry.code})
                    </span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Combobox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery("")}
                >
                  <Combobox.Options className="dropdown-menu">
                    <Combobox.Input
                      className="form-control"
                      placeholder="Search country..."
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    {filteredCountries.length === 0 ? (
                      <div className="dropdown-item">
                        No countries found
                      </div>
                    ) : (
                      filteredCountries.map((country) => (
                        <Combobox.Option 
                          key={country.countryCode}
                          value={country}
                          className={({ active, selected }) =>
                            `dropdown-item ${active || selected ? 'active' : ''}`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex items-center justify-between">
                              <span>{country.name} ({country.code})</span>
                              {selected && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13.3332 4.66675L6.6665 11.3334L2.6665 7.33341" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="phone-input-wrapper">
              <span className="country-code">{selectedCountry.code}</span>
              <input
                type="tel"
                className="form-control phone-input"
                placeholder={maskedNumber ? `Enter number ending with ${maskedNumber.slice(-2)}` : "Enter your phone number"}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            // disabled={loading || !phoneInput.trim()}
            className="btn btn-primary"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="spinner-small"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Verify Number"
            )
            
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyNumber;
