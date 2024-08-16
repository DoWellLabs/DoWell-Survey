import React, { Fragment, useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { Dialog, Transition } from "@headlessui/react";
import {
  MapPinIcon,
  PencilSquareIcon,
  QrCodeIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import QRCode from "react-qr-code";

import Layout from "../Layout/Layout";
import MySurveysProposed from "./MySurveysProposed";
import MainMap from "../components/Map";
import { useGlobalContext } from "../Context/PreviewContext";
import FetchNearby from "../data/fetchNearby";
import FetchPlaceDetail from "../data/fetchPlaceDetail";

import { products1 } from "../data/Product";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaPhoneAlt } from "react-icons/fa";
import { IoMdCompass } from "react-icons/io";
import { TiLocation } from "react-icons/ti";

import payload, { payload2 } from "./payload";

import CountryDropdown from "../components/Dropdown/CountryDropdown";
import LocationDropdown from "../components/Dropdown/LocationDropdown";
import Category from "../components/Categories";

import axios from "axios";
import errorImage from "../assets/error.png";

const LandingPage = () => {
  const [searchRegion, setSearchRegion] = useState(null);
  const [searchCords, setSearchCords] = useState("");

  //parameters for the search by area
  const [caliberation, setCaliberation] = useState("area");
  const [scale, setScale] = useState(null);
  const [area, setArea] = useState({});
  const [iteration, setIteration] = useState({
    current_iteration: 0,
    total_iterations: 0,
    no_iterations_rounded: 0,
  });
  const [searchData, setSearchData] = useState({});
  const [searchNumbers, setSearchNumbers] = useState({ start: 0, end: 0 });

  const navigate = useNavigate();
  //const stored_locations = sessionStorage.getItem("newSurvey") || "[]";
  const [surveys, setSurveys] = useState([]);

  const [pageload, setPageLoad] = useState(true);
  const [pageError, setPageError] = useState(null);

  const context = useGlobalContext();
  // console.log("context Value: ", context);
  const {
    inputData,
    setInputData,
    setAPIKey,
    api_key,
    setCenterCoords,
    centerCoords,
    placeAPIKey,
  } = context;
  const [loading, setLoading] = useState(false);
  const [receivedKey, setRecievedKey] = useState(
    "EhdQUTM2K0hNLCBOYWlyb2JpLCBLZW55YSImOiQKCg2PPDr"
  );
  const [placeDetails, setPlaceDetails] = useState([]);
  const [nearbyResults, setNearbyResults] = useState([]);

  const my_user = sessionStorage.getItem("user_info") || "[]";
  // console.log("info u are searching for is", JSON.parse(my_user));

  //   const { data } = useQuery({
  //     queryFn: async () => FetchCountries(),
  //     queryKey: 'countries'
  // })
  //   console.log(data)

  // const validateKey = (api_key) =>{
  //   return (api_key === "");
  // }
  // const saveAPIkey = async () => {
  //   if (validateKey(api_key)){
  //     alert("Please provide an API key")
  //   } else if (api_key.length<36){
  //     alert("Please input a valid API_key")
  //   }
  //   else {
  //   // alert(api_key)
  //   setRecievedKey(true);
  //   }
  // }

  const centerParams = {
    center_lat: centerCoords.lat,
    center_lon: centerCoords.lon,
  };

  const isItemInStorage = sessionStorage.getItem("user_info") === null;
  const [requestEmail, setRequestEmail] = useState(isItemInStorage);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // Define the function to fetch data
    const fetchData = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const session_id = queryParams.get('session_id');
      let user_details;

      if (session_id) {
        const formData = {
          "session_id": session_id
        }

        for (let i = 0; i <= 3; i++) {

          console.log("the number of trys is-", i);
          try {
            const response = await axios.post(
              `https://100014.pythonanywhere.com/api/userinfo/`,
              formData,
              {
                headers: {
                  "Content-Type": "application/json",
                },

              }
            );
            user_details = response?.data?.userinfo;
            if (user_details) {

              sessionStorage.setItem("user_info", JSON.stringify(user_details));
              console.log("the user_details", user_details);
              break;
            }
          }
          catch (error) {
            console.log("error is", error);
          }
        }
        if (!user_details) {
          setPageError("Error fetching User Data, click to reload")
        }
        setPageLoad(false);
      }
      else {
        setPageLoad(false);
      }
    };

    fetchData();

  }, []);

  const handleEmailConfirm = () => {
    const user_info = {
      username: email,
      city: "Nil",
      country: "Nil",
      email: email,
      first_name: email,
      last_name: email,
      phone: "xxx-xxx-xxxx",
      profile_img:
        "https://100093.pythonanywhere.com/static/clientadmin/img/logomissing.png",
      timezone: "Continent/City",
      user_country: "",
    };
    sessionStorage.setItem("user_info", JSON.stringify(user_info));
    setRequestEmail(false);
  };

  const handleSearch = async () => {
    if (!isValidInput(inputData)) {
      alert("please fill all the fields");
      return;
    }
    if (Number(inputData.radius1) > Number(inputData.radius2)) {
      alert("'From' has to be larger than 'To'");
      return;
    }

    // if (scale < 500 || scale > 2000) {
    //   alert("'Scale should be between 500 and 2000");
    //   return;
    // }

    const radius_margin = (inputData.radius2 - inputData.radius1) / 4;
    console.log("radius margin is", radius_margin);

    const area_inner =
      3.14 * (Number(inputData.radius1) * Number(inputData.radius1));
    const area_outer =
      3.14 * (Number(inputData.radius2) * Number(inputData.radius2));
    const survey_area = area_outer - area_inner;

    // const area_of_one = 3.14 * (scale * scale);

    const area_of_one = survey_area / 4;


    // const no_iterations = survey_area / area_of_one;
    // const no_iterations_rounded = Math.ceil(no_iterations);

    const no_iterations = 4
    const no_iterations_rounded = Math.ceil(no_iterations);

    let maps_places = [];
    console.log("the maps places before search", maps_places.length);
    console.log("the maps places are", maps_places);
    // console.log("checks", area_inner);
    // console.log("checks", area_outer);
    // console.log("checks", survey_area);
    // console.log("checks", no_iterations);

    setLoading(true);
    let i;

    for (i = 1; i < no_iterations + 1; i++) {
      let end_radius;
      let start_radius

      if (caliberation == "area") {
        start_radius = Math.sqrt(
          (area_inner + area_of_one * (i - 1)) / 3.14
        );


        if (i >= no_iterations) {
          //this means that it is the last iteration and you shouldnt make the radius higher than the end distance (because of the way we obtain the radiuses, this happens if the no_iterations is a fraction)
          end_radius = inputData.radius2;
        } else {
          end_radius = Math.sqrt((area_inner + area_of_one * i) / 3.14);
        }
      }
      else {
        start_radius = (Number(inputData.radius1) + Number(radius_margin * (i - 1)));

        if (i >= no_iterations) {
          //this means that it is the last iteration and you shouldnt make the radius higher than the end distance (because of the way we obtain the radiuses, this happens if the no_iterations is a fraction)
          end_radius = inputData.radius2;
        } else {
          end_radius = (Number(inputData.radius1) + Number(radius_margin * i));
        }

      }
      // console.log("iter_data", end_radius, start_radius, i);
      console.log("start and end radius are", start_radius, end_radius, i);

      try {
        const searchOptions = {
          radius1: start_radius,
          radius2: end_radius,
          center_lat: centerCoords.lat,
          center_lon: centerCoords.lon,
          query_string: inputData.query_string,
          limit: "60",
          api_key: placeAPIKey,
        };
        console.log("the search options are", searchOptions);
        const response = await FetchNearby(searchOptions);

        if (response.data.place_id_list?.length > 0) {
          const placeDetailOptions = {
            place_id_list: response.data.place_id_list,
            center_loc: "",
            api_key: placeAPIKey,
          };
          // console.log("none here too")
          const placeDetail = await FetchPlaceDetail(placeDetailOptions);

          maps_places = [...maps_places, ...placeDetail.data.succesful_results];
          // console.log(maps_places.length);
        }

        // maps_places = [...maps_places, ...payload];
        // console.log("wahaaaaaaaaaaaaaaaa", maps_places.length);
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }

      if (maps_places.length >= 240) {
        break;
      }
    }
    setLoading(false);

    if (i > no_iterations) {
      //set to current iteration, no need to go further
      setIteration({
        current_iteration: no_iterations_rounded,
        total_iterations: no_iterations,
        no_iterations_rounded: no_iterations_rounded,
      });
    } else {
      setIteration({
        current_iteration: i,
        total_iterations: no_iterations,
        no_iterations_rounded: no_iterations_rounded,
      });
    }

    if (maps_places.length < 1) {
      //search reached the last sector with no result
      setSearchNumbers({ start: 0, end: 0 });
    } else {
      setSearchNumbers((searchNumbers) => ({
        start: 0,
        end: 0 + maps_places.length,
      }));
    }

    setArea({ area_of_one: area_of_one, area_inner: area_inner });
    setSearchData({
      center_lat: centerCoords.lat,
      center_lon: centerCoords.lon,
      query_string: inputData.query_string,
      radius2: inputData.radius2,
    });

    const search_cords = centerCoords.lat + "," + centerCoords.lon;
    setSearchCords(search_cords);

    setSearchRegion(inputData.city);

    console.log("the maps places after search", maps_places.length);
    console.log("the maps places", maps_places);
    setPlaceDetails(maps_places);

  };

  const isValidInput = (inputData) => {
    // Implement your input validation logic here
    return (
      inputData.country !== "" &&
      inputData.city !== "" &&
      inputData.radius1 !== "" &&
      inputData.radius2 !== "" &&
      inputData.query_string !== ""
    );
  };

  const handleConfirmSelection = () => {
    sessionStorage.setItem("step1", "completed");
    sessionStorage.setItem("newSurvey", JSON.stringify(surveys));
    navigate("/finalize-Sample");
  };

  const loadMore = async () => {
    setLoading(true);
    let maps_places = [];
    let i;

    for (
      i = iteration.current_iteration + 1;
      i < iteration.total_iterations + 1;
      i++
    ) {
      const start_radius = Math.sqrt(
        (area.area_inner + area.area_of_one * (i - 1)) / 3.14
      );
      let end_radius;

      if (i >= iteration.total_iterations) {
        //this means that it is the last iteration and you shouldnt make the radius higher than the end distance (because of the way we obtain the radiuses, this happens if the no_iterations is a fraction)
        end_radius = searchData.radius2;
      } else {
        end_radius = Math.sqrt((area.area_inner + area.area_of_one * i) / 3.14);
      }
      // console.log("iter_data", end_radius, start_radius, i);

      console.log("start and end radius are", start_radius, end_radius, i);

      try {
        const searchOptions = {
          radius1: start_radius,
          radius2: end_radius,
          center_lat: searchData.center_lat,
          center_lon: searchData.center_lon,
          query_string: searchData.query_string,
          limit: "60",
          api_key: placeAPIKey,
        };

        // console.log("no issues here", searchOptions)
        const response = await FetchNearby(searchOptions);

        if (response.data.place_id_list?.length > 0) {
          // setPlaceIds(nearbyResults.data.place_id_list);
          const placeDetailOptions = {
            place_id_list: response.data.place_id_list,
            center_loc: "",
            api_key: placeAPIKey,
          };
          // console.log("none here too")
          const placeDetail = await FetchPlaceDetail(placeDetailOptions);
          //setPlaceDetails(placeDetail.data.succesful_results);
          maps_places = [...maps_places, ...placeDetail.data.succesful_results];
        }
        // maps_places = [...maps_places, ...payload2];
        // console.log("wahaaaaaaaaaaaaaaaa", maps_places.length);
      } catch (error) {
        // console.log("error");
      } finally {
      }
      if (maps_places.length >= 60) {
        break;
      }
    }

    if (i > iteration.total_iterations) {
      //set to current iteration, no need to go further
      setIteration({
        ...iteration,
        current_iteration: iteration.no_iterations_rounded,
      });
    } else {
      setIteration({ ...iteration, current_iteration: i });
    }

    if (maps_places.length < 1) {
      //search reached the last sector with no result
      setSearchNumbers({ start: 0, end: 0 });
    } else {
      setSearchNumbers((searchNumbers) => ({
        start: searchNumbers.end + 1,
        end: searchNumbers.end + maps_places.length,
      }));
    }

    setPlaceDetails(maps_places);
    setLoading(false);
  };

  const handleRemove = () => {
    const survey_list = [...surveys];
    const placeDetails_list = [...placeDetails];
    const placesToRemove = placeDetails.map((place) => place.placeId);
    const updatedList = survey_list.filter(
      (survey) => !placesToRemove.includes(survey.placeId)
    );
    setSurveys(updatedList);
  };

  const handleAddAll = () => {
    const survey_list = [...surveys];
    const placeDetails_list = [...placeDetails];

    const survey_list_ids = surveys.map((survey) => survey.placeId);
    const updated = placeDetails.filter(
      (place) => !survey_list_ids.includes(place.placeId)
    );
    const updatedList = updated.map((place) => ({
      placeId: place.placeId,
      place_name: place.place_name,
      phone: place.phone,
      address: place.address,
      website: place.website,
      numOfParticipants: 1,
      searchRegion: searchRegion,
      search_cords: searchCords,
    }));
    setSurveys((surveys) => [...surveys, ...updatedList]);
  };

  if (pageload) {
    // console.log("i,m executing fine");
    return (
      <div className="flex items-center justify-center">
        <div
          class="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div>
          <img src={errorImage} alt="error-image" />
        </div>
        <h1 className="text-center text-2xl md:text-[34px] font-medium text-[#7F7F7F]">
          Oops, Something went wrong
        </h1>
        <h1 className="text-[18px] md:text-[20px] text-[#7F7F7F]">
          Error fetching user info
        </h1>
        <button
          className="bg-[#015734] font-medium text-[17px] my-8 px-5 py-2 text-white rounded-[5px]"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  return receivedKey != "ENTER API KEY" ? (
    <Layout>
      <main className="w-full h-full overflow-x-hidden">
        {/* <MainMap/> */}
        <div className="px-8 md:pl-[310px] mt-[60px] md:mt-0 pt-4 pb-1">
          <div className="px-2 items-center flex justify-between bg-[#005734]">
            <h1 className=" text-white text-2xl font-bold pt-1 pb-3 no-underline">
              DoWell Surveys
            </h1>

            <h6 className=" text-white text-sm font-bold pb-0 no-underline">
              Samanta will do surveys in 150000 locations worldwide
            </h6>
          </div>
          <div className="w-full h-96">
            {placeDetails.length > 0 ? (
              <MainMap
                centerCords={{
                  lat: centerCoords.lat,
                  lng: centerCoords.lon,
                }}
                pins={placeDetails}
              />
            ) : (
              <MainMap pins={null} />
            )}
          </div>
          <div className="bg-[#282B32] my-4 pt-2 pb-4 space-y-2">
            <div className="grid grid-cols-3 gap-x-6 gap-y-2">
              <div className="flex justify-center">
                <div>
                <h2 className="font-semibold text-white">Country</h2>
                <CountryDropdown loading={loading} />

                </div>

              </div>

              
              <div>
                <h2 className="font-semibold text-white text-center">
                  Set Distance(m) from Location's Center
                </h2>
                <div className="flex justify-center space-x-1">
                  <input
                    type="text"
                    className="w-[21vh] bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
                    placeholder="From"
                    value={inputData.radius1}
                    onChange={(e) =>
                      setInputData((prevData) => ({
                        ...prevData,
                        radius1: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                  <input
                    type="text"
                    className="w-[21vh] bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
                    placeholder="To"
                    value={inputData.radius2}
                    onChange={(e) =>
                      setInputData((prevData) => ({
                        ...prevData,
                        radius2: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex justify-center">
              <div>
                <h2 className="font-semibold text-white">Calibration</h2>
                <select
                  disabled={loading}
                  id="caliberation"
                  name="caliberation"
                  value={caliberation}
                  //autoComplete="country-name"
                  onChange={(e) => {
                    setCaliberation(e.target.value);
                  }}
                  className="select w-[15vw] h-[33px] bg-[#D9D9D9]"
                >
                  <option value="area">area</option>
                  <option value="radius">radius</option>
                </select>
              </div>

              </div>

              <div className="flex justify-center">
                <div>
                <h2 className="font-semibold text-white">Region</h2>
                <LocationDropdown
                  loading={loading}
                  country={inputData.country}
                />

                </div>

              </div>


            
          

              {/* <div>
                <h2 className="font-semibold text-white">Set Scale</h2>
                <input
                  type="number"
                  className="w-[100px] bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
                  placeholder="min. 500"
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  disabled={loading}
                />
              </div> */}

              <div className="flex items-end justify-center">
              <button
                className="text-white font-semibold bg-[#3B82F6] h-[33px] w-[100px] rounded-sm"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Loading..." : "Search"}
              </button>

              </div>


              <div className="flex justify-center">
              <div>
                <h2 className="font-semibold text-white">Category</h2>
                <Category loading={loading} />
              </div>

              </div>

            
            </div>

          </div>

          <div className="flex justify-between space-x-4">
            <div className="w-9/12 h-screen bg-[#EFF3F6] px-2 overflow-y-auto border border-[#B3B4BB]">
              <div className="flex justify-between">
                <div className="flex space-x-2 items-center mt-2">
                  <p className="text-[28px] font-bold">
                    {" "}
                    {`${searchNumbers.start} - ${searchNumbers.end}`}{" "}
                    <span className="font-normal text-xs">{`(${iteration.current_iteration} of ${iteration.no_iterations_rounded} sectors searched)`}</span>{" "}
                  </p>
                  {iteration.current_iteration < iteration.total_iterations && (
                    <button
                      type="button"
                      className={`px-2 rounded-md h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]`}
                      //disabled={surveys.findIndex((obj) => obj.id === id) !== -1}
                      onClick={loadMore}
                      disabled={loading}
                    //disabled={surveys.length < 1 ? true : false}
                    >
                      {loading ? "Loading..." : "Load More"}
                    </button>
                  )}
                </div>
                {placeDetails.length >= 1 && (
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      type="button"
                      className={`px-2 rounded-l-md h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]`}
                      onClick={handleRemove}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      className={`px-2 rounded-r-md h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]`}
                      onClick={handleAddAll}
                    >
                      Add All
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center">
                {placeDetails.map((product) => {
                  const {
                    placeId,
                    phone,
                    photo_reference,
                    address,
                    website,
                    place_name,
                  } = product;
                  return (
                    <div
                      key={placeId}
                      className={
                        "mx-1 w-[270px] md:w-[180px] lg:w-[200px] mt-[30px] h-auto border border-[#B3B4BB]" +
                        (surveys.findIndex((obj) => obj.placeId === placeId) ===
                          -1
                          ? " bg-white text-black"
                          : " bg-[#005734] text-white")
                      }
                    >
                      <div className="flex justify-center items-center p-2">
                        <img
                          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=358&photo_reference=${photo_reference}&key=AIzaSyAsH8omDk8y0lSGLTW9YtZiiQ2MkmsF-uQ`}
                          alt="image"
                          className="w-[162px] h-[108px]"
                        />
                      </div>

                      <div className="px-2">
                        <div className="flex items-center space-x-1">
                          <TiLocation />
                          <p className="text-xs"> {address}</p>
                        </div>

                        <p className="font-semibold text-sm">{place_name}</p>

                        <div className="flex items-center space-x-1">
                          <FaPhoneAlt />
                          <p className="text-xs"> {phone}</p>
                        </div>

                        <div className="flex justify-center items-center p-2">
                          <button
                            type="button"
                            className={
                              "mb-2 w-[150px] h-[30px] font-serif font-bold text-center opacity-80 hover:opacity-100 text-sm md:text-md text-white cursor-pointer bg-[#005734]"
                            }
                            disabled={
                              surveys.findIndex(
                                (obj) => obj.placeId === placeId
                              ) !== -1
                            }
                            onClick={() => {
                              const updatedList = [...surveys];
                              //const valueIndex = updatedList.indexOf(id);
                              const valueIndex = updatedList.findIndex(
                                (obj) => obj.placeId === placeId
                              );

                              if (valueIndex === -1) {
                                // Value not present, append it
                                updatedList.push({
                                  placeId,
                                  place_name,
                                  phone,
                                  address,
                                  website,
                                  numOfParticipants: 1,
                                  searchRegion: searchRegion,
                                  search_cords: searchCords,
                                });
                              } else {
                                // Value present, remove it
                                updatedList.splice(valueIndex, 1);
                              }

                              // Update the state with the new list
                              setSurveys(updatedList);
                            }}
                          >
                            {surveys.findIndex(
                              (obj) => obj.placeId === placeId
                            ) === -1
                              ? "Add Location"
                              : " Added"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative w-3/12 h-screen bg-[#EFF3F6] border border-[#B3B4BB] overflow-y-auto">
              {/* <div className="top-0 left-0 w-full bg-[#399544] w-full flex justify-center items-center">
                <p className="text-[18px] text-white font-bold py-[10px]">
                  {" "}
                  Your Selections{" "}
                </p>
              </div> */}

              <div className="m-2">
                {surveys.map((survey) => (
                  <div
                    key={survey.place_name}
                    className="p-2 flex justify-between items-center bg-[#DEDEDE] my-4"
                  >
                    <div>
                      <p className="text-sm">{survey.place_name}</p>
                      <hr class="h-px my-1 bg-black border-0"></hr>
                      <p className="text-xs">
                        Region:{" "}
                        <span className="font-bold">{survey.searchRegion}</span>
                      </p>
                      {/* <p className="text-xs">{survey.searchRegion}</p> */}
                    </div>

                    <button
                      className="text-red-500"
                      onClick={() => {
                        const updatedList = [...surveys];
                        //const valueIndex = updatedList.indexOf(id);
                        const valueIndex = updatedList.findIndex(
                          (obj) => obj.placeId === survey.placeId
                        );

                        if (valueIndex !== -1) {
                          // Value is present, remove it
                          updatedList.splice(valueIndex, 1);
                          setSurveys(updatedList);
                        }
                      }}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                ))}

                <div className="flex justify-center items-center p-2">
                  {surveys.length < 1 ? (
                    <div className="flex flex-col items-center justify-center">
                      <button
                        type="button"
                        className={`rounded-md mb-2 w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]`}
                        //disabled={surveys.findIndex((obj) => obj.id === id) !== -1}
                        onClick={handleConfirmSelection}
                      //disabled={surveys.length < 1 ? true : false}
                      >
                        Skip & Proceed
                      </button>
                      <p className="text-sm font-semibold font-serif text-center">
                        (Skipping will set the survey type to global)
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={`mb-2 w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]`}
                      //disabled={surveys.findIndex((obj) => obj.id === id) !== -1}
                      onClick={handleConfirmSelection}
                    //disabled={surveys.length < 1 ? true : false}
                    >
                      Confirm Selection
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  ) : (
    <div class="flex justify-center mt-60 items-center bg-white ">
      <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 grid-cols-12">
        <h3>Enter your API Key</h3>
      </div>
    </div>
  );
};

export default LandingPage;
