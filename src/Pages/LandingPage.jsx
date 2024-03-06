import React, { Fragment, useEffect, useRef, useState } from "react";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, } from "react-leaflet";
import { Dialog, Transition } from "@headlessui/react";
import { MapPinIcon, PencilSquareIcon, QrCodeIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
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



import CountryDropdown from "../components/Dropdown/CountryDropdown";
import LocationDropdown from "../components/Dropdown/LocationDropdown";
import Category from "../components/Categories";

import axios from "axios";
import errorImage from "../assets/error.png";




const LandingPage = () => {
    const [searchRegion, setSearchRegion] = useState(null);

    //parameters for the search by area
    const [caliberation, setCaliberation] = useState("area");
    const [scale, setScale] = useState(null);
    const [area, setArea] = useState({});
    const [iteration, setIteration] = useState({ current_iteration: 1, total_iterations: 16 });
    const [searchData, setSearchData] = useState({});





    const navigate = useNavigate();
    //const stored_locations = sessionStorage.getItem("newSurvey") || "[]";
    const [surveys, setSurveys] = useState([]);

    const [pageload, setPageLoad] = useState(true);
    const [pageError, setPageError] = useState(null);



    const context = useGlobalContext();
    console.log("context Value: ", context);
    const { inputData, setInputData, setAPIKey, api_key, setCenterCoords, centerCoords, placeAPIKey } = context;
    const [loading, setLoading] = useState(false);
    const [receivedKey, setRecievedKey] = useState("EhdQUTM2K0hNLCBOYWlyb2JpLCBLZW55YSImOiQKCg2PPDr");
    const [placeDetails, setPlaceDetails] = useState([]);
    const [nearbyResults, setNearbyResults] = useState([]);

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

    useEffect(() => {
        // Define the function to fetch data
        const fetchData = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const session_id = queryParams.get('session_id');
            let user_info;

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
                        user_info = response?.data?.userinfo;
                        if (user_info) {
                            sessionStorage.setItem("user_info", JSON.stringify(user_info));
                            break;
                        }
                    }
                    catch (error) {
                        console.log("error is", error);
                    }
                }
                if (!user_info) {
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



    const handleSearch = async () => {
        if (!isValidInput(inputData)) {
            alert("please fill all the fields");
            return;
        }
        if (Number(inputData.radius1) > Number(inputData.radius2)) {
            alert("'From' has to be larger than 'To'");
            return;
        }

        if (scale < 500 || scale > 2000) {
            alert("'Scale should be between 500 and 2000");
            return;
        }

        const area_inner = 3.14 * (Number(inputData.radius1) * Number(inputData.radius1));
        const area_outer = 3.14 * (Number(inputData.radius2) * Number(inputData.radius2));
        const survey_area = area_outer - area_inner;
        const area_of_one = 3.14 * (scale * scale);
        const no_iterations = survey_area / area_of_one;

        let maps_places = [];



        setLoading(true);

        for (let i = 1; i < no_iterations + 1; i++) {
            const start_radius = Math.sqrt((area_inner + (area_of_one * (i - 1))) / 3.14);
            

            if (i >= no_iterations) { //this means that it is the last iteration and you shouldnt make the radius higher than the end distance (because of the way we obtain the radiuses, this happens if the no_iterations is a fraction)
                const end_radius = input.radius2;
            }
            else {
                const end_radius = Math.sqrt((area_inner + (area_of_one * i)) / 3.14);
            }

            try {
                //setSurveys([]);
                //sessionStorage.setItem("newSurvey", "[]");



                //setLoading(true);

                //Try commenting this so that only one 'search option' is defined. 
                const searchOptions = {
                    radius1: start_radius,
                    radius2: end_radius,
                    center_lat: centerCoords.lat,
                    center_lon: centerCoords.lon,
                    query_string: inputData.query_string,
                    limit: "60",
                    api_key: placeAPIKey,
                };
                console.log("no issues here", searchOptions)
                const response = await FetchNearby(searchOptions)
                //console.log("response_data", response.data.place_id_list)
                //setNearbyResults(response.data.place_id_list)
                //console.log("coordinates used for the search are", centerCoords.lat, centerCoords.lon)
                //console.log("nearby", nearbyResults);
                if (response.data.place_id_list?.length > 0) {
                    // setPlaceIds(nearbyResults.data.place_id_list);
                    const placeDetailOptions = {
                        place_id_list: response.data.place_id_list,
                        center_loc: "",
                        api_key: placeAPIKey,
                    };
                    console.log("none here too")
                    const placeDetail = await FetchPlaceDetail(placeDetailOptions);
                    //setPlaceDetails(placeDetail.data.succesful_results);
                    maps_places = [...maps_places, ...placeDetail.data.succesful_results];



                }
            } catch (error) {
                // Handle errors
                console.error("Error:", error);
            } finally {
                //console.log("finally block executed")
                //setLoading(false);

            }

            if (maps_places.length >= 60) {
                setIteration({ current_iteration: i + 1, total_iterations: no_iterations });
                break;
            }

        }
        setArea({ area_of_one: area_of_one, area_inner: area_inner });
        setSearchData({
            center_lat: centerCoords.lat,
            center_lon: centerCoords.lon,
            query_string: inputData.query_string,
        })

        setPlaceDetails(maps_places);
        setSearchRegion(inputData.city);
        setLoading(false);



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
        sessionStorage.setItem("newSurvey", JSON.stringify(surveys));
        navigate("/finalize-Sample");
    };

    const loadMore = async () => {
        const start_radius = Math.sqrt((785000 * (iteration.current_iteration - 1)) / 3.14);
        const end_radius = Math.sqrt((785000 * iteration.current_iteration) / 3.14);

        for (let i = iteration.current_iteration; i < iteration.total_iterations + 1; i++) {


            try {

                setLoading(true);
                const searchOptions = {
                    radius1: inputData.start_radius,
                    radius2: inputData.end_radius,
                    center_lat: centerCoords.lat,  //needs to change
                    center_lon: centerCoords.lon,   //needs to change
                    query_string: inputData.query_string,  //needs to change
                    limit: "60",
                    api_key: placeAPIKey,
                };

            }

            catch (error) {
                console.log("error");

            }

            finally {
                console.log("new radiuses are ", start_radius, end_radius);
                console.log("the iteration", iteration);
                setIteration({ ...iteration, current_iteration: iteration.current_iteration + 1 })
                setLoading(false);

            }
            break;



        }
    }

    if (pageload) {
        console.log("i,m executing fine");
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
        )


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

    return (
        (receivedKey != "ENTER API KEY") ?
            <Layout>
                <main className="w-full h-full overflow-x-hidden">
                    {/* <MainMap/> */}
                    <div className="px-8 md:pl-[310px] mt-[60px] md:mt-0">

                        <div className="px-2 items-center flex justify-between bg-[#005734]">
                            <h1 className=" text-white text-2xl font-semibold pt-1 pb-3 no-underline">
                                DoWell Surveys
                            </h1>



                            <h6 className=" text-white text-sm font-bold pb-0 no-underline">
                                Samanta will do surveys in 150000 locations worldwide
                            </h6>

                        </div>
                        <div className="w-full h-96">
                            {placeDetails.length > 0 ? <MainMap centerCords={{
                                lat: centerCoords.lat,
                                lng: centerCoords.lon
                            }} pins={placeDetails} /> : <MainMap pins={null} />}

                        </div>
                        <div className="bg-[#282B32] my-4 py-2 flex flex-col justify-center items-center space-y-2">
                            <div className="flex flex-wrap justify-center space-x-2">
                                <div>
                                    <h2 className="font-semibold text-white">Select Country</h2>
                                    <CountryDropdown loading={loading} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-white">Select Region</h2>
                                    <LocationDropdown loading={loading} country={inputData.country} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-white">Set Distance(m) from Location's Center</h2>
                                    <div className="flex justify-center space-x-1">
                                        <input
                                            type="text"
                                            className="w-[60px] bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
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
                                            className="w-[60px] bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
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

                                <div>
                                    <h2 className="font-semibold text-white">Caliberation</h2>
                                    <select
                                        disabled={loading}
                                        id="caliberation"
                                        name="caliberation"
                                        value={caliberation}
                                        //autoComplete="country-name"
                                        onChange={(e) => {
                                            setCaliberation(e.target.value);

                                        }}
                                        className="select w-[100px] h-[33px] bg-[#D9D9D9]"
                                    >
                                       
                                        <option value="area">area</option>
                                    </select>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-white">Set Scale</h2>
                                    <input
                                        type="number"
                                        className="w-[100px] bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
                                        placeholder="min. 500"
                                        value={scale}
                                        onChange={(e) => setScale(e.target.value)}
                                        disabled={loading} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-white">Enter a Category</h2>
                                    <Category loading={loading} />
                                </div>




                            </div>
                            <button className="text-white font-semibold bg-[#3B82F6] h-[33px] w-[100px] rounded-md"
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Search"}
                            </button>
                        </div>

                        <div className="flex justify-between space-x-4">
                            <div className="w-9/12 h-screen bg-[#EFF3F6] px-2 overflow-y-auto border border-[#B3B4BB]">
                                <div className="flex justify-between">
                                    <p className="text-[18px] font-bold pt-[10px]"> {placeDetails.length} search results </p>
                                    <button
                                        type="button"
                                        className={`mb-2 w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]`}
                                        //disabled={surveys.findIndex((obj) => obj.id === id) !== -1}
                                        onClick={loadMore}
                                        disabled={loading}
                                    //disabled={surveys.length < 1 ? true : false}
                                    >
                                        {loading ? "Loading..." : "Load More"}
                                    </button>


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
                                                    (surveys.findIndex((obj) => obj.placeId === placeId) === -1
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
                                                            disabled={surveys.findIndex((obj) => obj.placeId === placeId) !== -1}
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
                                                                        searchRegion: searchRegion
                                                                    });

                                                                } else {
                                                                    // Value present, remove it
                                                                    updatedList.splice(valueIndex, 1);
                                                                }

                                                                // Update the state with the new list
                                                                setSurveys(updatedList);
                                                            }}
                                                        >
                                                            {surveys.findIndex((obj) => obj.placeId === placeId) === -1
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
                                <div className="top-0 left-0 w-full bg-[#399544] w-full flex justify-center items-center">

                                    <p className="text-[18px] text-white font-bold py-[10px]"> Your Selections </p>
                                </div>

                                <div className="m-2">

                                    {
                                        surveys.map((survey) => (
                                            <div className="p-2 flex justify-between items-center bg-[#DEDEDE] my-4">
                                                <div>
                                                    <p className="text-sm">{survey.place_name}</p>
                                                    <hr class="h-px my-1 bg-black border-0"></hr>
                                                    <p className="text-xs">Region: <span className="font-bold">{survey.searchRegion}</span></p>
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
                                                    }}>
                                                    <XMarkIcon className="h-6 w-6" /></button>


                                            </div>

                                        ))
                                    }

                                    <div className="flex justify-center items-center p-2">
                                        {surveys.length < 1 ?
                                            (
                                                <div className="flex flex-col items-center justify-center">
                                                    <button
                                                        type="button"
                                                        className={`mb-2 w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]`}
                                                        //disabled={surveys.findIndex((obj) => obj.id === id) !== -1}
                                                        onClick={handleConfirmSelection}
                                                    //disabled={surveys.length < 1 ? true : false}
                                                    >
                                                        Skip & Proceed
                                                    </button>
                                                    <p className="text-sm font-semibold font-serif text-center">(Skipping will set the survey type to global)</p>
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
                                            )

                                        }


                                    </div>



                                </div>


                            </div>

                        </div>

                    </div>
                </main>
            </Layout> :
            <div class="flex justify-center mt-60 items-center bg-white ">
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 grid-cols-12">
                    <h3>Enter your API Key</h3>
                </div>
            </div>
    );
};

export default LandingPage;
