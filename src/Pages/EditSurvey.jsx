import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Layout from "../Layout/Layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MapPinIcon,
  PencilSquareIcon,
  QrCodeIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FaXTwitter } from "react-icons/fa6";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegram,
  FaDownload,
} from "react-icons/fa";
//import { FaTimes } from "react-icons/fa";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import "./EditSurveyModal.css";
import surveys from "../data/surveys";
import QRCode from "react-qr-code";

import axios from "axios";

export default function Edit() {
  const user_info_json = sessionStorage.getItem("user_info") || "[]";
  const user_info = JSON.parse(user_info_json);
  let survey_user, survey_email;
  if (user_info) {
    // Access the profile_img property from the user_info object
    survey_user = user_info.username ? user_info.username : null;
    survey_email = user_info.email ? user_info.email : null;
  }




  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [survey_results, setSurvey_results] = useState([]);
  const [survey, setSurvey] = useState({});
  const surveyNameRef = useRef(null);
  const linkRef = useRef(null);
  const promotionalRef = useRef(null);
  const limitRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({});

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [startDate, setStartDate] = useState(getCurrentDate());

  const currentDate = new Date().setHours(0, 0, 0, 0);

  console.log("today is", currentDate);

  //sample size parameters and states
  const [sampleData, setSampleData] = useState([]);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [numOfParticipants, setNumOfParticipants] = useState("");
  const [editingNo, setEditingNo] = useState(null);

  const [circleMarker, setCircleMarker] = useState([0.0, 0.0]);

  const position = [51.505, -0.09];
  const center = [9.055625, 7.480715];

  //for the maps rendering
  const [mapBounds, setMapBounds] = useState([
    [10.74343, 21.4],
    [36.74343, 52.4],
  ]);
  //setMapBounds([[32.6455, 56.55], [11.23, 53.442]])
  const [locations, setLocations] = useState(surveys[0].places);
  const [locationsSurveyName, setLocationsSurveyName] = useState(
    surveys[0].brand_name
  );
  const [map, setMap] = useState(null);

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const baseUrl = "https://100025.pythonanywhere.com";

  const onQRCodePrintClick = () => {
    console.log(survey.url);
    console.log(survey.id);
    console.log(`${baseUrl}${survey.logo}`);
    window.print();
  };

  const onQRCodeDownloadClick = () => {
    const link = document.createElement("a");
    const imageUrl = `${baseUrl}${survey.qr_code}`;
    link.download = "dowell_qr_code";
    link.click();
  };

  const backendUrl =
    "https://100025.pythonanywhere.com/my-survey/?api_key=1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";

  const handleAdd = () => {
    if (country && region && numOfParticipants) {
      if (editingNo !== null) {
        // If editing, update the existing row
        const updatedData = sampleData.map((data) =>
          data.no === editingNo
            ? { no: editingNo, country, region, numOfParticipants }
            : data
        );
        setSampleData(updatedData);
        setEditingNo(null); // Reset editing state
      } else {
        // If adding, create a new row
        const newData = {
          no: sampleData.length + 1,
          country,
          region,
          numOfParticipants,
        };
        setSampleData([...sampleData, newData]);
      }

      // Clear the input fields
      setCountry("");
      setRegion("");
      setNumOfParticipants("");
    }
  };

  const handleDelete = (no) => {
    const updatedData = sampleData.filter((data) => data.no !== no);

    // Renumber the remaining rows after deletion
    const renumberedData = updatedData.map((data, index) => ({
      ...data,
      no: index + 1,
    }));

    setSampleData(renumberedData);
  };

  const handleEdit = (data) => {
    // Set the editing state and populate input fields with the data
    setEditingNo(data.no);
    setCountry(data.country);
    setRegion(data.region);
    setNumOfParticipants(data.numOfParticipants);
  };

  const cancelButtonRef = useRef(null);

  const onDeleteClick = () => {
    setOpen(true);
    setMode("delete");
  };

  const onPreviewClick = () => {
    setOpen(true);
    setMode("preview");
  };

  const onLocateClick = (survey) => {
    const isAllIncluded = survey.region.includes("all");

    // Set region_for_survey based on whether "all" is included or not
    const regionForSurvey = isAllIncluded ? "Global" : JSON.parse(survey.region.replace(/'/g, '"')).join(", ");
    setFormData({
      //brand_name: survey.brand_name,
      survey_name: survey.name,
      //country: survey.country,
      region_for_survey: regionForSurvey,
      promotional_message: survey.promotional_sentence,
      

      //email: survey.email,
      maximum_no_of_participants: survey.participantsLimit,
      form_link: survey.url,
      Start_date: survey.start_date,
      End_date: survey.end_date
    });

    var coordinatesString = survey.brand_name;
    var coordinatesArray = coordinatesString.split(",");

    // Convert the substrings to numbers
    var latitude = parseFloat(coordinatesArray[0]);
    var longitude = parseFloat(coordinatesArray[1]);

    if (
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      coordinatesArray.length === 2
    ) {
      // Array has two valid numbers
      var coordinatesArrayWithNumbers = [latitude, longitude];
      console.log(coordinatesArrayWithNumbers);
      window.scrollTo(0, 0);
      setCircleMarker(coordinatesArrayWithNumbers);
      map.flyTo(coordinatesArrayWithNumbers, 13);
    } else {
      // Array does not have two valid numbers
      console.error("Invalid coordinates format");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // const reader = new FileReader();

    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeInBytes) {
      setErrorMessage(
        "File size exceeds the limit (5 MB). Please choose a smaller file."
      );
      console.log("bigerrrrrrrrr");
      // Clear the input field to prevent submission
      event.target.value = null;
      return;
    }
    console.log("File type:", file.type);
    setImage(file);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    setLoading(true);
    // Handle form submission logic here
    
    const [syear, smonth, sday] = survey.start_date.split("-");
    const [eyear, emonth, eday] = survey.end_date.split("-");
    const sformattedDate = `${sday}-${smonth}-${syear}`;
    const eformattedDate = `${eday}-${emonth}-${eyear}`;

    const formData = {
      start_date: sformattedDate,
      end_date: eformattedDate,

      name: surveyNameRef.current.value,
      promotional_sentence: promotionalRef.current.value,
      // participantsLimit: limitRef.current.value,
      // link: linkRef.current.value,
      qrcode_id: survey.qr_code_id,
      id: survey.id

    };
    console.log("tryuuuuuuuuuuuuuug");
    try {
      const response = await axios.put(
        `https://100025.pythonanywhere.com/update-qr-codev2?api_key=1b834e07-c68b-4bf6-96dd-ab7cdc62f07f`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const user_info_session = sessionStorage.getItem("user_info") || "[]";
      const user_info = JSON.parse(user_info_session);
      const userName = user_info?.username;

      const surveys_response = await axios.post(
        `https://100025.pythonanywhere.com/my-survey/`,
        {username: userName},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = surveys_response?.data;
      setSurvey_results(data);

      console.log("success");

    } catch (error) {
      console.log("error");
    }

    setLoading(false);
    toast.success("Survey Successfully Edited", {
      onClose: () => { },
    });
    return;
  };

  useEffect(() => {
    // Define the function to fetch data
    const fetchData = async (username) => {
      try {
        // Set loading to true while fetching data
        console.log("tryingggggg");
        setLoading(true);

        // const response = await axios({
        //     method: 'get',
        //     url: 'https://100025.pythonanywhere.com/my-survey/',
        //     data: data,
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     },
        // });
        const formData = { username: username };

        const response = await axios.post(
          `https://100025.pythonanywhere.com/my-survey/`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response?.data;
        setSurvey_results(data);
        console.log(response?.data);
        //console.log("successsssss", response);
      } catch (error) {
        // If there's an error, update the error state
        console.log("error is", error);
      } finally {
        // Set loading to false when data fetching is complete, regardless of success or failure
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    const user_info_session = sessionStorage.getItem("user_info") || "[]";
    console.log(user_info_session);
    const user_info = JSON.parse(user_info_session);
    const userName = user_info?.username;
    fetchData(userName);
  }, []);

  return (
    <Layout>
      <main className="w-full h-full">
        <div className="px-4 md:px-10 md:pl-[310px] pt-4">
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              initialFocus={cancelButtonRef}
              onClose={() => setOpen(false)}
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
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-xl">
                      {mode == "link" ? (
                        <form
                          action=""
                          encType="multipart/form-data"
                          onSubmit={handleEditSubmit}
                        >
                          <div className="flex flex-col items-center justify-center w-full">
                            <div className="flex items-center justify-between w-full text-xl text-white bg-[#005734]">
                              <p className="font-bold m-4">EDIT SURVEY</p>
                              <button
                                type="button"
                                className="font-serif font-bold text-center m-4"
                                onClick={() => setOpen(false)}
                              >
                                <XMarkIcon className="h-6 w-6 m-1" />
                              </button>
                            </div>

                            <div className="flex flex-col space-y-2 my-8 w-full">
                              {/* <div className="flex items-center justify-center w-full">
                                <div className="w-3/12">
                                  <h2 className="font-medium text-left">
                                    Logo Image:
                                  </h2>
                                </div>
                                <div className="w-7/12">
                                  <input
                                    type="file"
                                    name=""
                                    id="file"
                                    placeholder="add your form link here"
                                    className="border w-full p-1 border-[#B3B4BB] outline-none"
                                    // value={image}
                                    onChange={handleImageChange}
                                  />
                                  <small>
                                    {errorMessage && (
                                      <p style={{ color: "red" }}>
                                        {errorMessage}
                                      </p>
                                    )}
                                  </small>
                                </div>
                              </div> */}

                              <div className="flex items-center justify-center w-full">
                                <div className="w-3/12">
                                  <h2 className="font-medium text-left">
                                    Survey Name:
                                  </h2>
                                </div>
                                <div className="w-7/12">
                                  <input
                                    type="text"
                                    ref={surveyNameRef}
                                    defaultValue={survey?.name || ""}
                                    required
                                    placeholder=""
                                    className="border w-full p-1 border-[#B3B4BB] outline-none"
                                  />
                                </div>
                              </div>

                              {/* <div className="flex items-center justify-center w-full">
                                <div className="w-3/12">
                                  <h2 className="font-medium text-left">
                                    Form Link:
                                  </h2>
                                </div>
                                <div className="w-7/12">
                                  <input
                                    type="text"
                                    ref={linkRef}
                                    defaultValue={survey?.url || ""}
                                    required
                                    placeholder=""
                                    className="border w-full p-1 border-[#B3B4BB] outline-none"
                                  />
                                </div>
                              </div> */}
                              

                              {/* <div className="flex items-center justify-center w-full">
                                <div className="w-3/12">
                                  <h2 className="font-medium text-left">
                                    Participant Limit:
                                  </h2>
                                </div>
                                <div className="w-7/12">
                                  <input
                                    type="number"
                                    defaultValue={
                                      survey?.participantsLimit || ""
                                    }
                                    ref={limitRef}
                                    required
                                    placeholder=""
                                    className="border w-full p-1 border-[#B3B4BB] outline-none"
                                  />
                                </div>
                              </div> */}

                              <div className="flex items-center justify-center w-full">
                                <div className="w-3/12">
                                  <h2 className="font-medium text-left">
                                    Promotional Message:
                                  </h2>
                                </div>
                                <div className="w-7/12">
                                  <textarea
                                    defaultValue={
                                      survey?.promotional_sentence || ""
                                    }
                                    maxLength="100"
                                    id="description"
                                    name="promotional sentence"
                                    ref={promotionalRef}
                                    required
                                    placeholder="Enter a promotional sentence to attract participants in (less than 100 characters)"
                                    className="h-24 resize-none border w-full p-1 border-[#B3B4BB] outline-none"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-center w-full">
                                <div className="w-3/12">
                                  <h2 className="font-medium text-left">
                                    Set Duration:
                                  </h2>
                                </div>
                                <div className="w-7/12 flex items-center justify-between">
                                  <input
                                    type="date"
                                    value={survey?.start_date}
                                    className="border p-1 border-[#B3B4BB] outline-none"
                                    //value={startDate}
                                    // ref={startDateRef}
                                    onChange={(e) => {

                                      setSurvey((survey) => 
                                      ({
                                        ...survey, start_date: e.target.value
                                      }))
                                      const startDateConverted = new Date(e.target.value);
                                      const endDateConverted = new Date(survey.end_date)
                                      if (startDateConverted >= endDateConverted) {
                                        setSurvey((survey) => 
                                      ({
                                        ...survey, end_date: e.target.value
                                      }))
                                      }
                                    
                      
                                    }}
                                    required
                                  />
                                  <p className="mx-1 font-medium">to</p>
                                  <input
                                    type="date"
                                    value={survey?.end_date}
                                    className="border p-1 border-[#B3B4BB] outline-none"
                                    // ref={endDateRef}
                                    //entevalue={startDate}
                                    onChange={(e) => {
                                      setSurvey((survey) => 
                                      ({
                                        ...survey, end_date: e.target.value
                                      }))
                                      const startDateConverted = new Date(survey.start_date);
                                      const endDateConverted = new Date(e.target.value)
                                      if (startDateConverted >= endDateConverted) {
                                        setSurvey((survey) => 
                                      ({
                                        ...survey, start_date: e.target.value
                                      }))
                                      }
                                    }}
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center w-full my-4">
                              <div className="w-3/12"></div>
                              <div className="w-7/12 flex justify-center space-x-2">
                                <button
                                  type="button"
                                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-[#005734] shadow-sm hover:bg-gray-50 border-2 border-[#005734]"
                                  onClick={() => setOpen(false)}
                                  ref={cancelButtonRef}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="inline-flex w-full justify-center rounded-md bg-[#005734] px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-green-500"
                                  //onClick={() => setOpen(false)}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      ) : (
                        // mode == "delete" ? (
                        //     <div className="flex flex-col items-center justify-center w-full">
                        //         <div
                        //             className="flex items-center justify-between w-full text-white bg-[#EF4444] text-xl">
                        //             <p className="font-bold m-4">DELETE SURVEY</p>
                        //             <button
                        //                 className="font-serif font-bold text-center m-4"
                        //                 onClick={() => setOpen(false)}
                        //             >
                        //                 <XMarkIcon className="h-6 w-6 m-1"/>
                        //             </button>
                        //         </div>

                        //         <div className="flex flex-col space-y-2 my-4 w-full">
                        //             <div className="w-full">
                        //                 <p className="text-md font-semibold text-center">
                        //                     Are you sure you want to delete this survey?
                        //                 </p>
                        //             </div>
                        //         </div>
                        //         <div className="flex items-center justify-center w-full my-4">
                        //             <div className="w-3/12"></div>
                        //             <div className="w-7/12 flex justify-center space-x-2">
                        //                 <button
                        //                     type="button"
                        //                     className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-[#EF4444] shadow-sm hover:bg-gray-50 border-2 border-[#EF4444]"
                        //                     onClick={() => setOpen(false)}
                        //                     ref={cancelButtonRef}
                        //                 >
                        //                     Cancel
                        //                 </button>
                        //                 <button
                        //                     type="submit"
                        //                     className="inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-[#EF4444]"
                        //                     //onClick={() => setOpen(false)}
                        //                 >
                        //                     Save
                        //                 </button>
                        //             </div>
                        //         </div>
                        //     </div>
                        // ) :
                        <div className="flex flex-col items-center justify-center w-full">
                          <div className="flex items-center justify-between w-full text-white bg-[#3B82F6] text-xl">
                            <p className="font-bold m-4">PREVIEW QR CODE</p>
                            <button
                              className="font-serif font-bold text-center m-4"
                              onClick={() => setOpen(false)}
                            >
                              <XMarkIcon className="h-6 w-6 m-1" />
                            </button>
                          </div>

                          <div className="flex flex-col space-y-2 mt-4 my-8 w-full">
                            <div className="flex items-center justify-center w-full space-x-1">
                              <div className="w-5/12" id="qr-code">
                                {/* <QRCode
                                                                        size={190}
                                                                        bgColor="white"
                                                                        value={`https://dowelllabs.github.io/DoWell-Survey/survey-iframe?survey_id=${survey.id}`}
                                                                        style={{
                                                                            borderColor: "black",
                                                                            padding: "4px",
                                                                            borderWidth: "2px",
                                                                        }}

                                                                    /> */}
                                <img
                                  src={`${baseUrl}${survey.qr_code}`}
                                  style={{
                                    borderColor: "black",
                                    //padding: "0.2px",
                                    borderWidth: "2px",
                                  }}
                                  alt="qr_code"
                                />
                              </div>
                              <div className="w-5/12">
                                <p className="text-center text-md font-semibold my-1">
                                  Print or share Qr codes on your media
                                  platforms
                                </p>
                                <div className="flex justify-center items-center space-x-1">
                                  <button
                                    type="submit"
                                    className="inline-flex my-1 w-full justify-center bg-blue-700 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-[#3B82F6]"
                                    onClick={onQRCodePrintClick}
                                  >
                                    Print
                                  </button>
                                  <a
                                    href={`${baseUrl}${survey.qr_code}`}
                                    className="flex p-1 items-center justify-center bg-[#CE6868] rounded-md"
                                    download
                                    target="_blank"
                                  >
                                    <FaDownload className="h-6 w-6 m-1 text-white" />
                                  </a>
                                </div>

                                {/* <button onClick={onQRCodeDownloadClick}>
                                                                        <FaDownload />
                                                                    </button> */}
                                <div className="flex items-center justify-center space-x-0.5 my-1">
                                  <a
                                    href={`http://www.facebook.com/share.php?u=${baseUrl}${survey.qr_code}`}
                                    className="flex p-1 items-center justify-center bg-[#0866FF] rounded-full"
                                    target="_blank"
                                    //onClick={onLinkClick}
                                  >
                                    <FaFacebook className="h-6 w-6 m-1 text-white" />
                                  </a>
                                  <a
                                    href={`http://x.com/share?url=${baseUrl}${survey.qr_code}&text=Please follow this link to scan my qr code on ${survey.name}`}
                                    className="flex p-1 items-center justify-center bg-black rounded-full"
                                    target="_blank"
                                    //onClick={onLinkClick}
                                  >
                                    <FaXTwitter className="h-6 w-6 text-white m-1" />
                                  </a>
                                  <a
                                    href={`whatsapp://send?text=${baseUrl}${survey.qr_code} Please follow this link to scan my qr code on ${survey.name}`}
                                    className="flex items-center justify-center bg-[#00E676] p-1 rounded-full"
                                    target="_blank"
                                    //onClick={onLinkClick}
                                  >
                                    <FaWhatsapp className="h-6 w-6 text-white m-1" />
                                  </a>
                                  <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${baseUrl}${survey.qr_code}`}
                                    className="flex items-center justify-center bg-[#0A66C2] p-1 rounded-full"
                                    target="_blank"
                                    //onClick={onLinkClick}
                                  >
                                    <FaLinkedinIn className="h-6 w-6 text-white m-1" />
                                  </a>
                                  <a
                                    href={`https://telegram.me/share/url?url=${baseUrl}${survey.qr_code}`}
                                    className="flex items-center justify-center bg-[#30A4DC] p-1 rounded-full"
                                    target="_blank"
                                    //onClick={onLinkClick}
                                  >
                                    <FaTelegram className="h-6 w-6 text-white m-1" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
          <div className="relative pb-2">
            <div className="px-2 items-center flex justify-between bg-[#005734] mb-2">
              <h1 className=" text-white text-2xl font-bold pt-1 pb-3 no-underline">
                My Surveys
              </h1>
              {/* <h6 className=" text-white text-sm font-bold pb-0 no-underline">
                {`Total Surveys ${survey_results[0]?.total_survey || ""}  Active Surveys${survey_results[0]?.active_survey || ""} Closed Surveys ${survey_results[0]?.closed_survey || ""}`}
              </h6> */}
              <h6 className=" text-white text-sm font-bold pb-0 no-underline">
              Download, Preview, and Share QR Codes. View Your Survey Location.
              </h6>
            </div>

            <div className="flex flex-wrap items-center space-x-2">
              <div className="flex-1 h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div
                      className="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#282B32",
                      color: "#F0C40D",
                      padding: "20px",
                      border: "1px solid #F0C40D",
                      borderRadius: "10px",
                      margin: "20px",
                      textAlign: "center",
                    }}
                  >
                    <h6
                      style={{
                        fontWeight: "bold",
                        marginBottom: "10px",
                        fontSize: "20px",
                      }}
                    >
                      Survey Information
                    </h6>
                    {Object.keys(formData).map((key, index) => (
                      <div key={index} style={{ marginBottom: "10px" }}>
                        <h6
                          style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#F0C40D",
                            textAlign: "left",
                          }}
                        >
                          {`${key
                            .replace(/_/g, " ")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}:`} <span className="text-white">{`${formData[key]}`}</span>
                        </h6>
                      </div>
                    ))}
                    <div style={{ marginBottom: "10px" }}>
                        <h6
                          style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#F0C40D",
                            textAlign: "left",
                          }}
                        >
                          
                         
                        </h6>
                      </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center w-7/12 h-96">
                {loading ? (
                  <div
                    className="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                ) : (
                  <MapContainer
                    ref={setMap}
                    scrollWheelZoom={false}
                    center={circleMarker}
                    zoom={13}
                    style={{ height: "100%", width: "100%", zIndex: "1" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <>
                      <CircleMarker
                        //key={index}
                        center={circleMarker}
                        radius={30}
                      >
                        <Marker position={circleMarker}>
                          <Popup>{formData.survey_name}</Popup>
                        </Marker>
                      </CircleMarker>
                    </>
                  </MapContainer>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col min-w-full">
            <div className="overflow-x-auto min-w-full">
              <div className="inline-block py-2 min-w-full">
                <div className="overflow-auto">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div
                        className="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      >
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                          Loading...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <table className="min-w-full text-center text-sm font-light">
                      <thead className="border-b bg-[#005734] font-medium text-white dark:border-neutral-500">
                        <tr>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-6 py-4"
                          >
                            SURVEY NAME
                          </th>
                          <th scope="col" className="break-words px-6 py-4">
                            SURVEY LINK
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            DURATION
                          </th>

                          <th scope="col" className=" px-6 py-4">
                            PARTICIPANTS
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            STATUS
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const components = [];
                          for (let i = 1; i < survey_results.length; i++) {
                            components.push(
                              <tr
                                key={i}
                                className="border-b dark:border-neutral-500"
                              >
                                <td className="px-6 py-4 font-medium bg-[#F3F6FF]">
                                  {survey_results[i].name}
                                </td>
                                <td className="break-all px-6 py-4">
                                  {survey_results[i].url}
                                </td>
                                <td className="px-6 py-4 bg-[#F3F6FF]">{`${survey_results[i].start_date} to ${survey_results[i].end_date}.`}</td>

                                <td className="px-6 py-4">
                                  {`Limit ${survey_results[i].participantsLimit} person(s)`}
                                </td>
                                <td className="whitespace-nowrap bg-[#F3F6FF] font-medium">
                                  {new Date(
                                    survey_results[i].start_date
                                  ).setHours(0, 0, 0, 0) > currentDate ? (
                                    <div className="mx-4 my-2 bg-[#399544] text-white">
                                      {" "}
                                      CREATED{" "}
                                    </div>
                                  ) : new Date(
                                      survey_results[i].end_date
                                    ).setHours(0, 0, 0, 0) < currentDate ? (
                                    <div className="mx-4 my-2 bg-[#EF4444] text-white">
                                      {" "}
                                      ENDED{" "}
                                    </div>
                                  ) : (
                                    <div className="mx-4 my-2 bg-[#3B82F6] text-white">
                                      {" "}
                                      ONGOING{" "}
                                    </div>
                                  )}
                                </td>
                                <td className="whitespace-nowrap  px-6 py-4">
                                  <div className="flex items-center justify-center space-x-0.5">
                                    <button
                                                                            className="flex items-center justify-center rounded-lg bg-[#005734]"
                                                                            onClick={() => {
                                                                                setSurvey(survey_results[i]);
                                                                                setOpen(true);
                                                                                setMode("link");
                                                                            }}
                                                                        >
                                                                            <PencilSquareIcon className="h-6 w-6 text-white m-1" />
                                                                        </button>
                                    {/* <button
                                                                    className="flex items-center justify-center rounded-lg bg-[#EF4444]"
                                                                    onClick={onDeleteClick}
                                                                >
                                                                    <TrashIcon className="h-6 w-6 text-white m-1"/>
                                                                </button> */}
                                    <button
                                      className="flex items-center justify-center rounded-lg bg-blue-500"
                                      onClick={() => {
                                        setSurvey(survey_results[i]);
                                        setOpen(true);
                                        setMode("preview");
                                      }}
                                    >
                                      <QrCodeIcon className="h-6 w-6 text-white m-1" />
                                    </button>
                                    <button
                                      className="flex items-center justify-center rounded-lg bg-orange-500"
                                      onClick={() => {
                                        onLocateClick(survey_results[i]);
                                      }}
                                    >
                                      <MapPinIcon className="h-6 w-6 text-white m-1" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                          return components;
                        })()}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
