import { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "./showToast";
import { Tooltip } from 'react-tooltip';
import { FaInfoCircle } from "react-icons/fa";

const StartNewSurvey = () => {
  const [formLink, setFormLink] = useState(null);
  const [loading, setLoading] = useState(false);

  const country = sessionStorage.getItem("country");
  const region = sessionStorage.getItem("region");
  console.log("the regions is", region);
  const the_region = region;
  console.log("aaaaaaaaa", the_region);
  let form_link;

  // if (the_region.includes("all")) {
  //   console.log("eeeeeeeeeeeeeeeeeeeeeeee");
  //   form_link = "https://dowelllabs.github.io/DoWell-Survey/survey-iframe-all";
  // } else {
  //   form_link = "https://dowelllabs.github.io/DoWell-Survey/survey-iframe";
  // }
  form_link = "https://dowelllabs.github.io/DoWell-Survey/survey-iframe";

  const numOfParticipants = sessionStorage.getItem("numOfParticipants");
  const coords = sessionStorage.getItem("coords") || "0.00,0.00";
  const user_info_json = sessionStorage.getItem("user_info") || "[]";
  const user_info = JSON.parse(user_info_json);
  let Uname, email;
  if (user_info) {
    // Access the profile_img property from the user_info object
    Uname = user_info.username ? user_info.username : null;
    email = user_info.email ? user_info.email : null;
  }

  // useEffect(() => {
  //   const firstStep = sessionStorage.getItem("step1");
  //   const secondStep = sessionStorage.getItem("step2");

  //   if (!firstStep) {
  //     toast.error("Please fill Step 1 Before Finalizing Survey Sample", {
  //       onClose: () => {},
  //     });
  //     navigate("/");
  //   }
  //   if (!secondStep) {
  //     toast.error("Please fill Step 2 Before Finalizing Survey Sample", {
  //       onClose: () => {},
  //     });
  //     navigate("/finalize-Sample");
  //   }
  // }, []);
  useEffect(() => {
    const firstStep = sessionStorage.getItem("step1");
    const secondStep = sessionStorage.getItem("step2");

    // Flag to track if toast has been shown already
    let toastShown = false;
    if (!firstStep && !secondStep) {
      showToast("Please fill Step 1 & 2 Before Linking Survey");
      navigate("/finalize-Sample");
      toastShown = true;
    }

    if (!firstStep && !toastShown) {
      showToast("Please fill Step 1  Before Linking Survey");
      navigate("/");
    }

    if (!secondStep && !toastShown) {
      showToast("Please fill Step 2 Before Linking Survey");
      navigate("/finalize-Sample");
    }
  }, []); // Empty dependency array ensures useEffect runs only once

  // const [startDate, setStartDate] = useState(getCurrentDate());
  // const [endDate, setEndDate] = useState(getCurrentDate());
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [filename, setFilename] = useState("");

  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");

  const saveToLocalStorage = () => {
    const surveyData = {
      name,
      product,
      description,
      // startDate,
      // endDate,
    };

    sessionStorage.setItem("surveyData", JSON.stringify(surveyData));
  };

  // function getCurrentDate() {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = String(today.getMonth() + 1).padStart(2, "0");
  //   const day = String(today.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // }
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // const reader = new FileReader();

    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeInBytes) {
      setErrorMessage(
        "File size exceeds the limit (5 MB). Please choose a smaller file."
      );
      // Clear the input field to prevent submission
      event.target.value = null;
    }
    console.log("File type:", file.type);
    setImage(file);
    setFilename(event.target.files[0]?.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form fields

    if (!name || !product || !description || !formLink || !image) {
      toast.error("Please fill all fields", {
        onClose: () => { },
      });
      return;
    }
    setLoading(true);
    // const [syear, smonth, sday] = startDate.split("-");
    // const [eyear, emonth, eday] = endDate.split("-");
    // const sformattedDate = `${sday}-${smonth}-${syear}`;
    // const eformattedDate = `${eday}-${emonth}-${eyear}`;
    //e.preventDefault();

    const formData = {
      qrcode_type: "Link",
      quantity: "1",
      logo: image,
      link: form_link,
      company_id: Uname,
      created_by: name,
      description: description,
      // start_date: sformattedDate,
      // end_date: eformattedDate,
      brand_name: coords,
      promotional_sentence: description,
      username: Uname,
      name: name,
      email: email,
      service: product,
      country: "All",
      region: region,
      search_result_id: 32,
      participantsLimit: numOfParticipants,
      url: formLink,
      category: "school",
      longitude: 43.44,
      latitude: 43.33,
    };

    try {
      const response = await axios.post(
        `https://100025.pythonanywhere.com/create-surveyv2?api_key=1b834e07-c68b-4bf6-96dd-ab7cdc62f07f`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      console.log("success and response data is", response.data);
      sessionStorage.setItem("id", response.data.qrcodes[0].id);
      console.log("nawaaaaaaaaaaaaa but jere", response.data.qrcodes[0].link);
      sessionStorage.setItem("surveyLink", response.data.qrcodes[0].link);
      sessionStorage.setItem("qrcode_id", response.data.qrcodes[0].qrcode_id);
      sessionStorage.setItem("surveyName", response.data.qrcodes[0].name);
      sessionStorage.setItem(
        "Qrcode",
        response.data.qrcodes[0].qrcode_image_url
      );
      sessionStorage.setItem("start_end", "");
      // navigate("/email-sms");
      sessionStorage.setItem("step3", "completed");

      toast.success(response.data.response, {
        onClose: () => {
          navigate("/email-sms");
        },
      });
    } catch (error) {
      setLoading(false);
      console.log("error is this", error);
      toast.error("Qr code Creation Failed", {
        autoClose: false,
        closeOnClick: true,
      });
    }
  };

  return (
    <Layout>
      <main className="w-full">
        <div className="flex flex-col px-4 md:px-10 mt-[40px] md:pl-[310px] md:mt-0 h-screen pt-4 pb-1">
          <div className="px-2 items-center flex justify-between bg-[#005734]">
            <h1 className=" text-white text-2xl font-bold pt-1 pb-3 no-underline">
              Link Survey Form
            </h1>

          </div>

          <div className="flex justify-center items-center h-full bg-[#EFF3F6]">
            <form
              action=""
              encType="multipart/form-data"
              className="border-2 border-[#BFBFBF] p-10 bg-white"
              onSubmit={handleSubmit}
            >
              <div className="h-full w-full md:flex">
                <div className="grid grid-cols-2 gap-x-20 gap-y-4">
                  
                  <div className="">
                  <div className="flex space-x-2 items-center">
                    <h2 className="font-medium text-left">
                    Upload an Image of your Product/Service *
                    </h2>
                    <FaInfoCircle data-tooltip-id="my-tooltip" data-tooltip-content="This would appear at the center of the created qr codes that users would scan" className="text-[#606060]"/>
                    </div>

                   
                    <div className="relative h-[32px] w-[100%] bg-[#D9D9D9] border p-1 border-[#BFBFBF] outline-none">
                      <input
                        type="file"
                        name=""
                        id="file"
                        // value={image}
                        className="opacity-80 absolute left-0 top-0 w-full h-full cursor-pointer"
                        onChange={handleImageChange}
                        required

                        accept=".jpg, .jpeg, .png"
                      />
                      

                    </div>
                    {errorMessage && (
                    <small>
                      <p style={{ color: "red" }}>{errorMessage}</p>
                    </small>
                  )}
                  </div>


                  <div className="">
                    <div className="flex space-x-2 items-center">
                    <h2 className="font-medium text-left">
                      Enter Survey Name *
                    </h2>
                    <FaInfoCircle data-tooltip-id="my-tooltip" data-tooltip-content="This is the name of the survey being conducted" className="text-[#606060]"/>
                    </div>
                     
                    <Tooltip id="my-tooltip" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g Food Menu Reviews"
                      className="w-[100%] bg-[#D9D9D9] border p-1 border-[#BFBFBF] outline-none"
                      required
                    />
                  </div>

                  <div className="">
                    <div className="flex space-x-2 items-center">
                    <h2 className="font-medium text-left">
                    Add your Survey Form link *
                    </h2>
                    <FaInfoCircle data-tooltip-id="my-tooltip" data-tooltip-content="Link to the form users would fill. You can insert any form link e.g google forms, jot forms " className="text-[#606060]"/>
                    </div>

                   
                  
                   
                    <Tooltip id="my-tooltip" />
                    <input
                      type="text"
                      id="formLink"
                      
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      placeholder="e.g docs.google.com/forms/d/e/1HPFDa6t3I"
                      className="w-[100%] bg-[#D9D9D9] border p-1 border-[#BFBFBF] outline-none"
                      required
                    />
                  </div>

                  <div className="">
                    <div className="flex space-x-2 items-center">
                    <h2 className="font-medium text-left">
                    Enter Your Product/Service Name *
                    </h2>
                    <FaInfoCircle data-tooltip-id="my-tooltip" data-tooltip-content="This is the name of the product or service you are conducting the survey on" className="text-[#606060]"/>
                    </div>

                   
                  
                   
                    <Tooltip id="my-tooltip" />
                    <input
                      type="text"
                      id="formLink"
                      
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="e.g Altsid Insecticides"
                      className="w-[100%] bg-[#D9D9D9] border p-1 border-[#BFBFBF] outline-none"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex space-x-2 items-center">
                    <h2 className="font-medium text-left">
                    Enter Promotional Message*
                    </h2>
                    <FaInfoCircle data-tooltip-id="my-tooltip" data-tooltip-content="Add a clear Informative/Promotional Message to Introduce your Survey. This would be displayed to users upon succesfully scanning the Qr code" className="text-[#606060]"/>
                    </div>

                   
                  
                   
                    <Tooltip id="my-tooltip" />
                    <textarea
                    id="description"
                    name="description"
                    value={description}
                    required
                    maxlength="100"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="should be Less than 100 characters"
                    className="w-[100%] bg-[#D9D9D9] border w-full p-1 border-[#BFBFBF] outline-none h-24"
                  />
                 
                  </div>

                  <div className="col-span-2">
                  {loading ? (
                    <button
                      className="w-[100%] h-[32px] font-serif font-bold text-center bg-[#005734] opacity-50 text-[16px] text-white cursor-not-allowed"
                      disabled
                    >
                      Processing...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      // onClick={handleSubmit}
                      className="w-[100%] h-[32px] font-serif font-bold text-center bg-[#005734] opacity-80 hover:opacity-100 text-[16px] text-white cursor-pointer"
                    >
                      Create Survey
                    </button>
                  )}

                  </div>

                </div>
              </div>



            </form>

            </div>



        </div>
      </main>




    </Layout>
  );
};

export default StartNewSurvey;
