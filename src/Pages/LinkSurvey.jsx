import { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LinkSurvey = () => {
  const [formLink, setFormLink] = useState(null);
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
  };

  const savedSurv = sessionStorage.getItem("surveyData") || "[]";
  const savedSurveyData = JSON.parse(savedSurv);

  // Access individual properties
  const name = savedSurveyData ? savedSurveyData.name : "";
  const product = savedSurveyData ? savedSurveyData.product : "";
  const description = savedSurveyData ? savedSurveyData.description : "";
  const startDate = savedSurveyData ? savedSurveyData.startDate : "";
  const endDate = savedSurveyData ? savedSurveyData.endDate : "";
  const [syear, smonth, sday] = startDate.split("-");
  const [eyear, emonth, eday] = endDate.split("-");

  // Create a new Date object using the extracted year, month, and day
  const dateObject = new Date(syear, smonth - 1, sday);
  const edateObject = new Date(eyear, emonth - 1, eday);

  // Format the date as DD-MM-YYYY
  const sformattedDate = `${sday}-${smonth}-${syear}`;
  const eformattedDate = `${eday}-${emonth}-${eyear}`;
  console.log("start", sformattedDate);
  console.log("end", eformattedDate);

  // // Retrieve the array from sessionStorage
  // const savedSurveyArray = JSON.parse(sessionStorage.getItem("finalizeSurvey"));

  // // Retrieve properties of the first object
  // const firstObject =
  //   savedSurveyArray && savedSurveyArray.length > 0
  //     ? savedSurveyArray[0]
  //     : null;

  // Access individual properties
  const country = sessionStorage.getItem("country");
  const region = sessionStorage.getItem("region");
  const the_region = JSON.parse(region);
  console.log("aaaaaaaaa", the_region);
  let form_link;

  // if (the_region.includes("all")) {
  //   console.log("eeeeeeeeeeeeeeeeeeeeeeee");
  //    form_link = "https://dowelllabs.github.io/DoWell-Survey/survey-iframe-all";
  // } else {
  //    form_link = "https://dowelllabs.github.io/DoWell-Survey/survey-iframe";
  // }
  form_link = "https://dowelllabs.github.io/DoWell-Survey/survey-iframe";





  const numOfParticipants = sessionStorage.getItem("numOfParticipants");
  // let strippedValue = region.substring(1, region.length - 1);

  const [userName, setUserName] = useState(null);


  //stay safe, dont try this at home
  const coords = sessionStorage.getItem("coords") || "0.00,0.00";
  const [email, setEmail] = useState(null);


  // const [country, setCountry] = useState(null);
  // const [description, setDescription] = useState(null);

  // Retrieve user_info object from sessionStorage
  useEffect(() => {
    console.log("before");

    const user_info_json = sessionStorage.getItem("user_info") || "[]";

    const user_info = JSON.parse(user_info_json);

    //const user_info = JSON.parse(sessionStorage.getItem("user_info"));
    console.log("after");
    if (user_info) {
      // Access the profile_img property from the user_info object
      const Uname = user_info.username ? user_info.username : null;
      const email = user_info.email ? user_info.email : null;

      setEmail(email);
      setUserName(Uname);
    }
  }, []);

  sessionStorage.setItem("formLink", formLink);
  // const formData = {
  //   qrcode_type: "Link",
  //   quantity: "1",
  //   logo: image,
  //   link: "https://dowelllabs.github.io/DoWell-Survey/survey-iframe",
  //   company_id: userName,
  //   created_by: name,
  //   description: description,
  //   start_date: sformattedDate,
  //   end_date: eformattedDate,
  //   brand_name: coords,
  //   promotional_sentence: description,
  //   username: userName,
  //   name: name,
  //   email: email,
  //   service: product,
  //   country: country,
  //   region: region,
  //   participantsLimit: numOfParticipants,
  //   url: formLink,
  // };

  // const formData = new FormData();

  // formData.append("qrcode_type", "link");
  // formData.append("quantity", "1");
  // formData.append("logo", image);
  // formData.append("link", "https://dowelllabs.github.io/DoWell-Survey/survey-iframe");
  // formData.append("company_id", userName);
  // formData.append("created_by", name);
  // formData.append("description", description);
  // formData.append("start_date", sformattedDate);
  // formData.append("end_date", eformattedDate);
  // formData.append("brand_name", coords);
  // formData.append("promotional_sentence", description);
  // formData.append("username", userName);
  // formData.append("name", name);
  // formData.append("email", email);
  // formData.append("service", product);
  // formData.append("country", "nigeria");
  // formData.append("region", "nairobi");
  // formData.append("participantsLimit", numOfParticipants);
  // formData.append("url", formLink);
  // formData.append("category", "school");
  // formData.append("longitude", 32.322);
  // formData.append("latitude", 54.43);






  const formData = {
    qrcode_type: "Link",
    quantity: "1",
    logo: image,
    link: form_link,
    company_id: userName,
    created_by: name,
    description: description,
    start_date: sformattedDate,
    end_date: eformattedDate,
    brand_name: coords,
    promotional_sentence: description,
    username: userName,
    name: name,
    email: email,
    service: product,
    country: "nigeria",
    region: the_region,
    participantsLimit: numOfParticipants,
    url: formLink,
    category: "school",
    longitude: 43.44,
    latitude: 43.33
  };


  

  console.log("the forrm data is", formData);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
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
      console.log("survey details are", response.data);

      sessionStorage.setItem(
        "Qrcode",
        response.data.qrcodes[0].qrcode_image_url
      );

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
      <main className="w-full h-full">
        <div className="px-4 md:px-10 mt-[40px] md:pl-[310px]">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div>
              <h1>
                Input your form link and promotional image to create your survey
              </h1>
            </div>
            <div className=" flex flex-col mt-[50px]">
              <h1>Add Survey promotional image</h1>

              <form
                action=""
                encType="multipart/form-data"
                className=" flex flex-col"
              >
                <input
                  type="file"
                  name=""
                  id="file"
                  // value={image}
                  onChange={handleImageChange}
                />
                <small>
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                </small>

                <h2 className="mt-6">Form Link</h2>
                <input
                  type="text"
                  id="formLink"
                  placeholder="add your form link here"
                  className="w-full md:w-[400px] mt-[10px] h-[50px] border-2 border-[#B3B4BB] rounded-[5px] outline-none pl-[20px]"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                />
                {/* {formLink ? (
                  <button
                    type="submit"
                    className="w-full md:w-[400px] font-bold font-serif mt-[30px] h-[50px] bg-[#005734] text-[20px] text-white hover:opacity-100 opacity-80 rounded-[5px]"
                    onClick={handleSubmit}
                  >
                    Create Survey
                  </button>
                ) : (
                  <button
                    className="w-full md:w-[400px] font-bold font-serif mt-[30px] h-[50px] bg-[#005734] text-[20px] text-white opacity-50 rounded-[5px]"
                    disabled
                  >
                    Create Survey
                  </button>
                )} */}

                {loading ? (
                  <button
                    className="w-full md:w-[400px] font-bold font-serif mt-[30px] h-[50px] bg-[#005734] text-[20px] text-white rounded-[5px] opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Processing...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full md:w-[400px] font-bold font-serif mt-[30px] h-[50px] bg-[#005734] text-[20px] text-white hover:opacity-100 opacity-80 rounded-[5px]"
                    onClick={handleSubmit}
                    disabled={!formLink || !image}
                  >
                    Create Survey
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default LinkSurvey;
