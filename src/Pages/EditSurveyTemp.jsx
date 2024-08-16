import React, { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from '@headlessui/react'
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { TrashIcon, PencilSquareIcon, QrCodeIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook, FaLinkedinIn, FaInstagram, FaWhatsapp } from "react-icons/fa";
//import { FaTimes } from "react-icons/fa";
import QRCode from "react-qr-code";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import "./EditSurveyModal.css";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import surveys from "../data/surveys";


import axios from "axios";


export default function Edit() {
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [survey_results, setSurvey_results] = useState([]);
    const [survey, setSurvey] = useState({});
    const brandNameRef = useRef(null);
    const promotionalRef = useRef(null);
    const limitRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const [image, setImage] = useState(null);




    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(null);
    const [startDate, setStartDate] = useState(getCurrentDate());

    const currentDate = new Date();

    //sample size parameters and states
    const [sampleData, setSampleData] = useState([]);
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const [numOfParticipants, setNumOfParticipants] = useState("");
    const [editingNo, setEditingNo] = useState(null);

    const position = [51.505, -0.09];
    const center = [9.055625, 7.480715];

    //for the maps rendering 
    const [mapBounds, setMapBounds] = useState([[10.74343, 21.4], [36.74343, 52.4]]);
    //setMapBounds([[32.6455, 56.55], [11.23, 53.442]])
    const [locations, setLocations] = useState(surveys[0].places);
    const [locationsSurveyName, setLocationsSurveyName] = useState(surveys[0].brand_name)
    const [map, setMap] = useState(null)

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

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

    const cancelButtonRef = useRef(null)

    const onDeleteClick = () => {
        setOpen(true);
        setMode("delete");
    }

    const onPreviewClick = () => {
        setOpen(true);
        setMode("preview");
    }

    const onLocateClick = (survey) => {
        const { brand_name, places } = survey
        if (places.length > 0) {
            //console.log(places[0].coordinates)
            const bounds = places.reduce(
                (acc, place) => [
                    [Math.min(acc[0][0], place.coordinates[0]), Math.min(acc[0][1], place.coordinates[1])],
                    [Math.max(acc[1][0], place.coordinates[0]), Math.max(acc[1][1], place.coordinates[1])],
                ],
                [places[0].coordinates, places[0].coordinates]
            );
            console.log(bounds)


            setLocationsSurveyName(brand_name);
            setMapBounds(bounds);
            setLocations(places);
            map.fitBounds(bounds);
            //window.scroll(0, 0);


        }

    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        // const reader = new FileReader();

        const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxSizeInBytes) {
            setErrorMessage(
                "File size exceeds the limit (5 MB). Please choose a smaller file."
            );
            console.log('bigerrrrrrrrr')
            // Clear the input field to prevent submission
            event.target.value = null;
            return;
        }
        console.log("File type:", file.type);
        setImage(file);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        const formData = {
            start_date: startDateRef,
            end_date: endDateRef,
            brand_name: brandNameRef,
            promotional_sentence: promotionalRef,
            participantsLimit: limitRef,

        }
        console.log("tryuuuuuuuuuuuuuug")
        try {
            const response = await axios.post(
                `https://100025.pythonanywhere.com/update-qr-codev2/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return;
        }
        catch (error) {
            console.log("error");
        }




        console.log('Form submitted');
        return;

    }



    useEffect(() => {
        // Define the function to fetch data
        const fetchData = async () => {
            try {
                // Set loading to true while fetching data
                console.log('tryingggggg')
                setLoading(true);

                // const response = await axios({
                //     method: 'get',
                //     url: 'https://100025.pythonanywhere.com/my-survey/',
                //     data: data,
                //     headers: {
                //         "Content-Type": "multipart/form-data",
                //     },
                // });
                const formData = { username: "Ijerrycloudo" }

                const response = await axios.post(
                    `https://100025.pythonanywhere.com/my-survey/`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },

                    }
                );
                const data = response?.data
                setSurvey_results(data);
                console.log(response?.data)
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
        fetchData();
    }, []);




    return (
        <Layout>
            <main className="w-full h-full">
                <div className="px-4 md:px-10 md:pl-[310px]">
                    <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setOpen(false)}>

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
                                            {mode == "link" ?
                                                <form
                                                    action=""
                                                    encType="multipart/form-data"
                                                    onSubmit={handleEditSubmit}>
                                                    <div className="flex flex-col items-center justify-center w-full">
                                                        <div className="flex items-center justify-between w-full text-xl text-white bg-[#005734]">
                                                            <p className="font-bold m-4">EDIT SURVEY</p>
                                                            <button className="font-serif font-bold text-center m-4" onClick={() => setOpen(false)}><XMarkIcon className="h-6 w-6 m-1" /></button>
                                                        </div>



                                                        <div className="flex flex-col space-y-2 my-8 w-full">
                                                            <div className="flex items-center justify-center w-full">
                                                                <div className="w-3/12">
                                                                    <h2 className="font-medium text-left">Logo Image:</h2>
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
                                                                            <p style={{ color: "red" }}>{errorMessage}</p>
                                                                        )}
                                                                    </small>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-center w-full">
                                                                <div className="w-3/12">
                                                                    <h2 className="font-medium text-left">Brand Name:</h2>
                                                                </div>
                                                                <div className="w-7/12">
                                                                    <input
                                                                        type="text"
                                                                        ref={brandNameRef}
                                                                        defaultValue={survey?.brand_name || ''}
                                                                        required
                                                                        placeholder=""
                                                                        className="border w-full p-1 border-[#B3B4BB] outline-none"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-center w-full">
                                                                <div className="w-3/12">
                                                                    <h2 className="font-medium text-left">Participant Limit:</h2>
                                                                </div>
                                                                <div className="w-7/12">
                                                                    <input
                                                                        type="number"
                                                                        defaultValue={survey?.participantsLimit || ''}
                                                                        ref={limitRef}
                                                                        required
                                                                        placeholder=""
                                                                        className="border w-full p-1 border-[#B3B4BB] outline-none"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-center w-full">
                                                                <div className="w-3/12">
                                                                    <h2 className="font-medium text-left">Promotional Message:</h2>
                                                                </div>
                                                                <div className="w-7/12">
                                                                    <textarea
                                                                        defaultValue={survey?.promotional_sentence || ''}
                                                                        maxLength="15"
                                                                        id="description"
                                                                        name="promotional sentence"
                                                                        ref={promotionalRef}
                                                                        required
                                                                        placeholder="Enter a promotional sentence to attract participants in (15 words)"
                                                                        className="h-24 resize-none border w-full p-1 border-[#B3B4BB] outline-none"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-center w-full">
                                                                <div className="w-3/12">
                                                                    <h2 className="font-medium text-left">Set Duration:</h2>
                                                                </div>
                                                                <div className="w-7/12 flex items-center justify-between">
                                                                    <input
                                                                        type="date"
                                                                        defaultValue={survey?.start_date}
                                                                        className="border p-1 border-[#B3B4BB] outline-none"
                                                                        //value={startDate}
                                                                        ref={startDateRef}
                                                                        onChange={(e) => setStartDate(e.target.value)}
                                                                        required
                                                                    />
                                                                    <p className="mx-1 font-medium">to</p>
                                                                    <input
                                                                        type="date"
                                                                        defaultValue={survey?.end_date}
                                                                        className="border p-1 border-[#B3B4BB] outline-none"
                                                                        ref={endDateRef}
                                                                        //entevalue={startDate}
                                                                        onChange={(e) => setStartDate(e.target.value)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>


                                                        </div>
                                                        <div className="flex items-center justify-center w-full my-4">
                                                            <div className="w-3/12">

                                                            </div>
                                                            <div className="w-7/12 flex justify-center space-x-2">
                                                                <button
                                                                    //type="button"
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


                                                : mode == "delete" ?
                                                    <div className="flex flex-col items-center justify-center w-full">
                                                        <div className="flex items-center justify-between w-full text-white bg-[#EF4444] text-xl">
                                                            <p className="font-bold m-4">DELETE SURVEY</p>
                                                            <button className="font-serif font-bold text-center m-4" onClick={() => setOpen(false)}><XMarkIcon className="h-6 w-6 m-1" /></button>
                                                        </div>



                                                        <div className="flex flex-col space-y-2 my-4 w-full">
                                                            <div className="w-full">
                                                                <p className="text-md font-semibold text-center">Are you sure you want to delete this survey?</p>
                                                            </div>


                                                        </div>
                                                        <div className="flex items-center justify-center w-full my-4">
                                                            <div className="w-3/12">

                                                            </div>
                                                            <div className="w-7/12 flex justify-center space-x-2">
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-[#EF4444] shadow-sm hover:bg-gray-50 border-2 border-[#EF4444]"
                                                                    onClick={() => setOpen(false)}
                                                                    ref={cancelButtonRef}
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-[#EF4444]"
                                                                //onClick={() => setOpen(false)}
                                                                >
                                                                    Save
                                                                </button>


                                                            </div>

                                                        </div>



                                                    </div> :

                                                    <div className="flex flex-col items-center justify-center w-full">
                                                        <div className="flex items-center justify-between w-full text-white bg-[#3B82F6] text-xl">
                                                            <p className="font-bold m-4">PREVIEW QR CODE</p>
                                                            <button className="font-serif font-bold text-center m-4" onClick={() => setOpen(false)}><XMarkIcon className="h-6 w-6 m-1" /></button>
                                                        </div>



                                                        <div className="flex flex-col space-y-2 mt-4 my-8 w-full">
                                                            <div className="flex items-center justify-center w-full">
                                                                <div className="w-5/12">
                                                                    <QRCode
                                                                        size={190}
                                                                        bgColor="white"
                                                                        value={"https://uxlivinglab.com/"}
                                                                        style={{ borderColor: "black", padding: "4px", borderWidth: "2px" }}
                                                                    />
                                                                </div>
                                                                <div className="w-5/12">
                                                                    <p className="text-center text-md font-semibold my-1">Print or share Qr codes on your media platforms</p>
                                                                    <button
                                                                        type="submit"
                                                                        className="inline-flex my-1 w-full justify-center bg-blue-700 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-[#3B82F6]"
                                                                    //onClick={() => setOpen(false)}
                                                                    >
                                                                        Print
                                                                    </button>
                                                                    <div class="flex items-center justify-center space-x-0.5 my-1">
                                                                        <a href="#" className="flex p-1 items-center justify-center bg-[#0866FF] rounded-full"
                                                                        //onClick={onLinkClick}
                                                                        >
                                                                            <FaFacebook className="h-6 w-6 m-1 text-white" />
                                                                        </a>
                                                                        <a href="#" className="flex p-1 items-center justify-center bg-black rounded-full"
                                                                        //onClick={onLinkClick}
                                                                        >
                                                                            <FaXTwitter className="h-6 w-6 text-white m-1" />
                                                                        </a>
                                                                        <a href="#" className="flex items-center justify-center bg-[#00E676] p-1 rounded-full"
                                                                        //onClick={onLinkClick}
                                                                        >
                                                                            <FaWhatsapp className="h-6 w-6 text-white m-1" />
                                                                        </a>
                                                                        <a href="#" className="flex items-center justify-center bg-[#0A66C2] p-1 rounded-full"
                                                                        //onClick={onLinkClick}
                                                                        >
                                                                            <FaLinkedinIn className="h-6 w-6 text-white m-1" />
                                                                        </a>
                                                                        <a href="#" className="flex items-center justify-center bg-[#FF00FF] p-1 rounded-full"
                                                                        //onClick={onLinkClick}
                                                                        >
                                                                            <FaInstagram className="h-6 w-6 text-white m-1" />
                                                                        </a>

                                                                    </div>
                                                                </div>
                                                            </div>


                                                        </div>



                                                    </div>}


                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                    <div className="relative pb-2">
                        <div className="px-2 items-center flex justify-between bg-[#005734] mb-2">
                            <h1 className=" text-white text-2xl font-semibold pt-1 pb-3 no-underline">
                                My Surveys
                            </h1>
                            <h6 className=" text-white text-sm font-bold pb-0 no-underline">
                                Preview Qrcodes, View Survey Locations, edit Surveys
                            </h6>

                        </div>




                        <div className="flex flex-wrap items-center space-x-2">
                            <div className="flex-1 h-96 overflow-y-auto">
                                {loading ?
                                    <div className="flex items-center justify-center h-full">
                                        <div
                                            class="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                            role="status">
                                            <span
                                                class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                            >Loading...</span>

                                        </div>

                                    </div>
                                    :

                                    <div className="bg-[#282B32] text-white p-4">
                                        <h6 className="font-bold mb-2">Selection: {locationsSurveyName}</h6>
                                        {
                                            locations.map((location, index) => (
                                                <div key={index}>
                                                    <h6 className="font-bold text-sm text-[#F0C40D]">{location.name}</h6>
                                                    <p className="text-sm">{location.category}</p>
                                                    <p className="text-sm">{`[${location.coordinates[0]}, ${location.coordinates[1]}]`}</p>
                                                    <p className="text-sm">{`${location.radius}(m) radius`}</p>

                                                </div>
                                            ))
                                        }

                                    </div>


                                }




                            </div>
                            <div className="flex items-center justify-center w-7/12 h-96">
                                {loading ? <div
                                    class="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status">
                                    <span
                                        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                    >Loading...</span>

                                </div> :
                                    <MapContainer ref={setMap} scrollWheelZoom={false} bounds={mapBounds} style={{ height: '100%', width: '100%', zIndex: '1' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {
                                            locations.map((location, index) => (
                                                <>
                                                    <CircleMarker key={index} center={location.coordinates} radius={location.radius}>
                                                        <Marker position={location.coordinates}>
                                                            <Popup>
                                                                {location.name}
                                                            </Popup>
                                                        </Marker>

                                                    </CircleMarker>

                                                </>


                                            ))
                                        }

                                    </MapContainer>}

                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col min-w-full">
                        <div class="overflow-x-auto min-w-full">
                            <div class="inline-block py-2 min-w-full">
                                <div class="overflow-hidden">
                                    {loading ?
                                        <div className="flex items-center justify-center">
                                            <div
                                                class="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                role="status">
                                                <span
                                                    class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                                >Loading...</span>

                                            </div>
                                        </div>
                                        :
                                        <table class="min-w-full text-center text-sm font-light">
                                            <thead
                                                class="border-b bg-[#005734] font-medium text-white dark:border-neutral-500">
                                                <tr>
                                                    <th scope="col" class="whitespace-nowrap px-6 py-4">BRAND NAME</th>
                                                    <th scope="col" class="break-words px-6 py-4">SURVEY LINK</th>
                                                    <th scope="col" class=" px-6 py-4">DURATION</th>

                                                    <th scope="col" class=" px-6 py-4">REGION</th>
                                                    <th scope="col" class=" px-6 py-4">STATUS</th>
                                                    <th scope="col" class=" px-6 py-4">ACTIONS</th>




                                                </tr>
                                            </thead>
                                            <tbody>
                                                {surveys.map((survey, index) => (
                                                    <tr key={index} class="border-b dark:border-neutral-500">
                                                        <td class="px-6 py-4 font-medium bg-[#F3F6FF]">{survey.brand_name}</td>
                                                        <td class="break-all px-6 py-4">{survey.link}</td>
                                                        <td class="px-6 py-4 bg-[#F3F6FF]">{`${survey.start_date} to ${survey.end_date}. Limit ${survey.participantsLimit} person(s)`}</td>


                                                        <td class="px-6 py-4">3 places(Click marker to view)</td>
                                                        <td class="whitespace-nowrap bg-[#F3F6FF] font-medium">
                                                            {new Date(survey.start_date) > currentDate ? (<div className="mx-4 my-2 bg-[#399544] text-white"> CREATED </div>) :
                                                                new Date(survey.end_date) < currentDate ? (<div className="mx-4 my-2 bg-[#EF4444] text-white"> ENDED </div>) :
                                                                    (<div className="mx-4 my-2 bg-[#3B82F6] text-white"> ONGOING </div>)}
                                                        </td>
                                                        <td class="whitespace-nowrap  px-6 py-4">
                                                            <div class="flex items-center justify-center space-x-0.5">
                                                                <button className="flex items-center justify-center rounded-lg bg-[#005734]"
                                                                    onClick={() => {
                                                                        setSurvey(survey)
                                                                        setOpen(true);
                                                                        setMode("link");
                                                                    }}>
                                                                    <PencilSquareIcon className="h-6 w-6 text-white m-1" />
                                                                </button>
                                                                <button className="flex items-center justify-center rounded-lg bg-[#EF4444]"
                                                                    onClick={onDeleteClick}>
                                                                    <TrashIcon className="h-6 w-6 text-white m-1" />
                                                                </button>
                                                                <button className="flex items-center justify-center rounded-lg bg-blue-500"
                                                                    onClick={onPreviewClick}>
                                                                    <QrCodeIcon className="h-6 w-6 text-white m-1" />
                                                                </button>
                                                                <button className="flex items-center justify-center rounded-lg bg-orange-500"
                                                                    onClick={() => { onLocateClick(survey) }}>
                                                                    <MapPinIcon className="h-6 w-6 text-white m-1" />
                                                                </button>
                                                            </div>


                                                        </td>





                                                    </tr>

                                                ))}


                                            </tbody>
                                        </table>}

                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </main>



        </Layout>

    );
}
