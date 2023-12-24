import "./comp.css";

import { useState, useEffect } from "react";

const CheckSurvey = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showError, setShowError] = useState(false);

  // Simulate a delay of 5 seconds before showing the form
  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      setShowLoader(false);
      setShowForm(true);
    }, 5000);

    return () => clearTimeout(loaderTimeout);
  }, []);

  // Function to show the error message
  const handleError = () => {
    setShowForm(false);
    setShowError(true);
  };

  return (
    <div>
      {showLoader && (
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      )}

      {showForm && (
        <div>
          <iframe
            title="Google Forms"
            src="https://docs.google.com/forms/d/e/1FAIpQLScw8yXs1RpNDHxRSp5OUmW1W8lVdBsgGpLLT_EBXUW-DnalaQ/viewform?usp=sf_link"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            style={{ display: "block", width: "100%", height: "100vh" }}
          >
            Loading...
          </iframe>
          <button type="button" onClick={handleError}>
            Show Error
          </button>
        </div>
      )}

      {showError && (
        <div id="error-message">
          <p>Sorry, an error occurred while submitting the form.</p>
        </div>
      )}
    </div>
  );
};

export default CheckSurvey;
