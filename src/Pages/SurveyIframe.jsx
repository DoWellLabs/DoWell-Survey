import React, { Fragment, useRef, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import dowelllogo from "../assets/dowell.jpeg";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import allow from "../assets/allow.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [region_list, setRegion_list] = useState(null);


  // Accessing individual query parameters
  const survey_id = queryParams.get("survey_id");
  const [iframe, setIframe] = useState(null);
  const iframe_param = queryParams.get("iframe");
  const [promotional, setPromotional] = useState("")

  const [errMsg, setErrMsg] = useState(null);



  const handleDone = async () => {
    try {
      const count_response = await axios.post(
        `https://100025.pythonanywhere.com/survey-count/`,
        {
          link: window.location.href,
          region: region_list,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setStatus("done");

      toast.success("Thanks for your response", {
        onClose: () => {},
      });
    } catch (error) {
      toast.error("An error has occured", {
        onClose: () => {},
      });
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

                  const formData = {
                    link: window.location.href,
                    region: the_region,
                  };

                  console.log("the form data is", formData);

                  try {
                    const response = await axios.post(
                      `https://100025.pythonanywhere.com/get-dowell-survey-status/?api_key=1b834e07-c68b-4bf6-96dd-ab7cdc62f07f`,
                      formData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    console.log("respsonse is", response?.data);

                    if (response?.data?.isSuccess === true) {
                      const partLimit_array = Object.values(response?.data?.survey_data?.participantsLimit);
                      console.log("partLimit_array", partLimit_array); 

                      if (partLimit_array < 1) {
                        setStatus("error");
                        setErrMsg("Participant Limit Reached");
                      }
                      else {
                        const queryParams = new URLSearchParams(
                          window.location.search
                        );
                        const survey_id = queryParams.get("survey_id");
  
                        try {
                          const id_response = await axios.post(
                            `https://100025.pythonanywhere.com/my-survey/?api_key=1b834e07-c68b-4bf6-96dd-ab7cdc62f07f`,
                            {
                              survey_id: survey_id,
                            },
                            {
                              headers: {
                                "Content-Type": "multipart/form-data",
                              },
                            }
                          );
                          setStatus("success");
                          console.log(
                            "completed get survey and response is,",
                            id_response?.data[1].region
                          );
                          setRegion_list(id_response?.data[1].region);
  
                          setIframe(id_response?.data[1].url);
                          setPromotional(id_response?.data[1].promotional_sentence)
                          
                        } catch (error) {
                          
                          setStatus("error");
                          setErrMsg("Error in fetching Survey Form");
                        }

                      }



                    } else {
                      console.log("error and response is", response);
                      setStatus("error");
                      setErrMsg(response?.data.message);
                    }
                  } catch (error) {
                    console.log("Error in checking survey status");
                    setStatus("error");
                    setErrMsg("Error in checking survey status");
                  }


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
      <div className="bg-gradient-to-r from-green-500 to-green-200 min-h-screen">
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={headingRef}
            onClose={() => setOpen(true)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md">
                    <div className="flex flex-col items-center justify-center w-full">
                      <div className="flex justify-end w-full text-black text-xl">
                        <button
                          className="font-serif font-bold text-center m-4"
                          onClick={() => setOpen(false)}
                          //ref={headingRef}
                        >
                          <XMarkIcon className="h-6 w-6 m-1" />
                        </button>
                      </div>

                      <div className="flex flex-col space-y-2 mt-4 my-8 w-full justify-center">
                        <div className="flex justify-center">
                          <img
                            className="w-32 h-48    "
                            style={{ maxHeight: "150px" }}
                            src={allow}
                            alt="Default avatar"
                          ></img>
                        </div>
                        <p
                          className="font-semibold m-4 text-center text-2xl"
                          ref={headingRef}
                        >
                          Permission Needed
                        </p>

                        <p className="text-center text-md font-normal my-1 px-12">
                          If not previously enabled, pls click 'Allow' to grant
                          Dowell Surveys permission to access your location
                        </p>

                        <div className="flex flex-col space-y-2 justify-center items-center">
                          <button
                            className="inline-flex my-1 rounded-full w-4/6 justify-center bg-blue-700 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-[#3B82F6]"
                            onClick={() => setOpen(false)}
                          >
                            Okay, got it!
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>


        {status === "loading" ? (
          <div className="flex items-center justify-center font-bold text-2xl">
            Checking for Status
            <div
              class="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : status === "error" ? (
          <div>
            <p className="text-center text-5xl py-8 font-bold text-red-500 font-serif">
              Oops!
            </p>
            <p className="text-center font-bold text-2xl my-8">
              Sorry, {errMsg}
            </p>
          </div>
        ) : status === "done" ? (

          <>
          <div className="text-2xl text-center font-bold font-serif w-full h-full flex items-center justify-center py-8">
            Thanks for taking out time to fill our survey form
          </div>

        </>
        ) : (
          <>
            <div className="text-2xl text-center font-bold font-serif py-4">
            {promotional}

              <div className="flex items-center justify-center py-4">
              <div className="bg-[#7ED957] flex items-center justify-center p-2 border-2 border-black">
                <div className="p-1 border-2 border-black">
                  <QRCode
                    size={40}
                    bgColor="white"
                    fgColor="black"
                    value="https://uxlivinglab.com/"
                  />
                </div>

                <div className="text-center text-sm mx-1 font-semibold">
                  Please Click done after submitting this form{" "}
                </div>
                <button
                  onClick={handleDone}
                  className="text-sm p-2 font-serif font-semibold bg-[#005734] opacity-80 hover:opacity-100 text-[white] rounded-md"
                >
                  Done
                </button>
              </div>
            </div>
            
              <div className="flex items-center justify-center p-2">
                <iframe
                  className="border-2 border-green-500 h-screen"
                  src={iframe}
                  width="640"
                  frameborder="0"
                  marginheight="0"
                  marginwidth="0"
                >
                  Loading…
                </iframe>
              </div>
            </div>
          
          </>
        )}
      </div>
    </>
  );
};

export default SurveyIframe;