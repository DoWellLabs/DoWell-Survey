import React, { Fragment, useRef, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import dowelllogo from "../assets/dowell.jpeg";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import allow from "../assets/allow.png";
import mapicon from "../assets/mapicon.png";

import {
  TrashIcon,
  PencilSquareIcon,
  QrCodeIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const SurveyIframe = () => {
  //const [location, setLocation] = useState(null);

  const [open, setOpen] = useState(true);

  const headingRef = useRef(null);

  const [status, setStatus] = useState("loading");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [place_region, setPlace_region] = useState(null);

  // Accessing individual query parameters
  const survey_id = queryParams.get("survey_id");
  const [iframe, setIframe] = useState(null);
  const iframe_param = queryParams.get("iframe");

  const [errMsg, setErrMsg] = useState(null);

  const handleDone = async () => {
    try {
      const count_response = await axios.post(
        `https://100025.pythonanywhere.com/survey-count/`,
        {
          link: window.location.href,
          region: place_region,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      window.location.href = "https://dowelllabs.github.io/DoWell-Survey/";
    } catch (error) {
      window.location.href = "https://dowelllabs.github.io/DoWell-Survey/";
    }
  };

  useEffect(() => {
    const getCurrentAddress = () => {
      console.log("starting get current address function");
      // Check if geolocation is supported
      if (navigator.geolocation) {
        // Get current position
        navigator.geolocation.getCurrentPosition(function (position) {
          // Get latitude and longitude
          var latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Initialize geocoder
          var geocoder = new google.maps.Geocoder();

          // Geocode coordinates to get address
          geocoder.geocode(
            { location: latlng },
            async function (results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  let the_region;
                  if (results[0]) {
                    // Parse address components to find city
                    var addressComponents = results[0].address_components;
                    for (var i = 0; i < addressComponents.length; i++) {
                      var types = addressComponents[i].types;
                      if (types.includes("locality")) {
                        the_region =
                          addressComponents[i].long_name.toLowerCase();
                        break;
                      }
                    }
                  }

                  //const the_region_hyphen = Array.from(the_region).join('-');

                  setPlace_region(the_region);




                } else {
                  alert("No results found");
                }
              } else {
                alert("Geocoder failed due to: " + status);
              }
            }
          );
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    function findRegion(addressComponents) {
      for (var i = 0; i < addressComponents.length; i++) {
        var component = addressComponents[i];
        if (component.types.includes("administrative_area_level_1")) {
          return component.long_name;
        }
      }
      return "Region not found";
    }

    getCurrentAddress();
    // Call the function to get current address
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center">
                <div>
                    <img src={mapicon} alt="error-image" className="h-48 w-32" />
                </div>
                <h1 className="text-center text-2xl md:text-[34px] font-medium text-[#7F7F7F]">
                    This is a Test
                </h1>
                <h1 className="text-[18px] md:text-[20px] text-[#7F7F7F]">
                    Your region is {place_region}
                </h1>

            </div>
    </>
  );
};

export default SurveyIframe;