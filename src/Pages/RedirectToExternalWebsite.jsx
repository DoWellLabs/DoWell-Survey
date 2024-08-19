import React, { useEffect } from "react";

const RedirectToExternalWebsite = () => {
  useEffect(() => {
    // Redirect to the external website
    // window.location.href =
    //   "https://100014.pythonanywhere.com/?redirect_url=https://dowelllabs.github.io/DoWell-Survey/"; // or use window.location.replace
    window.location.href =
      "https://100014.pythonanywhere.com/?redirect_url=http://localhost:5173/DoWell-Survey/";
    // window.location.href =
    // "http://localhost:5173/DoWell-Survey/";
    // window.location.href =
    // "https://dowelllabs.github.io/DoWell-Survey/";
    // for a similar effect
  }, []);

  // This component might not render anything, or you can render a loading message or redirect message
  return <div>Loading</div>;
};

export default RedirectToExternalWebsite;
