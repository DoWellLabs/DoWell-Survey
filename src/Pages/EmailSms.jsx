import QRCode from "react-qr-code";
import Layout from "../Layout/Layout";
import { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./pages.css";
import EmailModal from "./EmailModal";
import SmsModal from "./SmsModal";

export const EmailSms = () => {
  const [open, setOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [smsCsvOpen, setSmsCsvOpen] = useState(false);

  const getQrcode = sessionStorage.getItem("Qrcode");
  const numOfParticipant = sessionStorage.getItem("numOfParticipants");
  const user_info_json = sessionStorage.getItem("user_info") || "[]";
  const user_info = JSON.parse(user_info_json);
  let Uname;
  if (user_info) {
    Uname = user_info.username ? user_info.username : null;
  }
  const [email, setEmail] = useState(null);
  // const [emails, setEmails] = useState([]);



  const [phoneNumbers, setPhoneNumbers] = useState(extractPhoneNumbersFromSessionStorage());

  const [sms, setSms] = useState(null);
  const surveyData = sessionStorage.getItem("surveyData") || "[]";
  const surveyData1 = JSON.parse(surveyData);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [showNumbersFromMap, setShowNumbersFromMap] = useState(false);
  const [regionValue, setRegionValue] = useState("");
  const [updatedInfo, setUpdatedInfo] = useState(null);

  // useEffect(() => {
  //   // Retrieve the stringified array from session storage
  //   const regionString = sessionStorage.getItem("region");

  //   const regionArray = JSON.parse(regionString);

  //   if (Array.isArray(regionArray) && regionArray.length > 0) {
  //     const regionText = regionArray
  //       .map((region) => region.toUpperCase())
  //       .join(", ");

  //     setRegionValue(${regionText});
  //   } else {
  //     setRegionValue("Unknown Region");
  //   }
  // }, []); // Run this effect only once after the component is mounted

  const handleOpenPhoneNumbersModal = () => {
    setShowNumbersFromMap(true);
  };

  const handleClosePhoneNumbersModal = () => {
    setShowNumbersFromMap(false);
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [syear, smonth, sday] = startDate.split("-");
  const [eyear, emonth, eday] = endDate.split("-");
  const sformattedDate = `${sday}-${smonth}-${syear}`;
  const eformattedDate = `${eday}-${emonth}-${eyear}`;

  const renderedEmail = email && email.split("@")[0];

  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      toname: renderedEmail,
      toemail: email,
      subject: "Survey Creation Confirmation",
      email_content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Survey Confirmation</title>
    <style>
      body {
        font-family: "Arial", sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      }
      p {
        margin-top: 30px;
      }
      .details {
        font-size: 16px;
        line-height: 1.5;
        color: #333;
        margin-top: 50px;
      }
      .qr-code {
        max-width: 100%;
        height: auto;
      }
    </style>
  </head>
  <body>
    <p>Dear User,</p>
    <p>
      This is to confirm that your survey, <strong>${
        updatedInfo ? updatedInfo.name : ""
      }</strong>,
      has been successfully created on our platform. Below, you'll find the
      details of your survey. You can share the QR Code/Link with your intended
      participants or platform to start gathering responses.
    </p>
    <div class="details">
      <ul>
        <li>Start Date: <strong>${surveyData1.startDate}</strong></li>
        <li>End Date: <strong>${surveyData1.endDate}</strong></li>
        <li>
          Maximum Number of Participants/Responses:
          <strong>${numOfParticipant}</strong>
        </li>
        <li>
          Target Location/Audience:
          <strong>${regionValue} Region's</strong>
        </li>
        <li>QR Code Link: <strong>${getQrcode}</strong></li>
      </ul>
    </div>
    <h2>QR Code:</h2>
    <img
      src="${getQrcode}"
      alt="QR Code"
      style="max-width: 200px; height: 200px"
    />
  </body>
</html>
`,
    };
    try {
      const updatedSurveyData = {
        id: sessionStorage.getItem("id"),
        qrcode_id: sessionStorage.getItem("qrcode_id"),
        start_date: sformattedDate,
        end_date: eformattedDate,
      };

      const updateSurvey = await axios.put(
        `https://100025.pythonanywhere.com/update-qr-codev2?api_key=a0955eef-146b-4efd-a14a-85727d5b6014`,
        updatedSurveyData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUpdatedInfo(updateSurvey.data);
      console.log("this is survey response", updatedInfo);

      const response = await axios.post(
        `https://100085.pythonanywhere.com/api/email/?api_key=4f0bd662-8456-4b2e-afa6-293d4135facf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("this is email endpoints", response);
      setLoading(false);
      toast.success("Your survey has started", {
        onClose: () => {
          navigate("/list-surveys");
        },
      });
    } catch (error) {
      setLoading(false);
      if (error.updateSurvey && error.updateSurvey.status === 400) {
        toast.error("Error updating survey: ", {
          onClose: () => {
            //  navigate("/list-surveys");
          },
        });
      } else {
        // For other errors, such as email sending failure
        setLoading(false);
        toast.error("Error sending survey: " + error.message, {
          onClose: () => {
            navigate("/list-surveys");
          },
        });
      }
    }
  };

  const handleNumberToggle = (number) => {
    setSelectedNumbers((prevNumbers) => {
      if (prevNumbers.includes(number)) {
        return prevNumbers.filter((n) => n !== number);
      } else {
        return [...prevNumbers, number];
      }
    });
  };

  return (
    <Layout>
      <main className="w-full h-screen mb-10">
        <div className="px-4 md:px-10 mt-[40px] md:pl-[310px] md:mt-0">
          <SmsModal smsOpen={smsOpen} setSmsOpen={setSmsOpen} phoneNumbers={phoneNumbers} />
          <SmsCsvModal smsCsvOpen={smsCsvOpen} setSmsCsvOpen={setSmsCsvOpen} />
          <StartSurveyModal startOpen={startOpen} setStartOpen={setStartOpen} />
          <EmailCsvModal open={open} setOpen={setOpen} getQrcode={getQrcode} Uname={Uname} sformattedDate={sformattedDate}
            eformattedDate={eformattedDate} numOfParticipant={numOfParticipant} />
          <div className="px-2 items-center flex justify-between bg-[#005734]">
            <h1 className=" text-white text-2xl font-semibold pt-1 pb-3 no-underline">
              Start Survey
            </h1>
            <h6 className=" text-white text-sm font-bold pb-0 no-underline">
              Send Survey via Mails and SMS
            </h6>
          </div>
          <form
            action=""
            encType="multipart/form-data"
            className=" flex flex-col"
          >
            <div className="w-full md:w-[400px] flex flex-col gap-3 py-">
              {/* <div className="w-full md:w-[400px] flex flex-col gap-2 text-left  ">
                <h3 className="font-serif font-bold text-md">Email </h3>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  className="w-full h-[4rem] border-2 border-[#B3B4BB] rounded-[5px] outline-none"
                  style={{ paddingLeft: "1rem" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div> */}
              <EmailModal />
              <SmsModal />

              {/* <div className="w-full md:w-[400px] flex flex-col gap-2 text-left  mt-4">
                <h3 className="font-serif font-bold text-md">SMS</h3>

                <input
                  type="number"
                  id="sms"
                  name="sms"
                  placeholder="Enter phone number"
                  className="w-full  h-[4rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
                  style={{ paddingLeft: "1rem" }}
                  value={sms}
                  onChange={(e) => setSms(e.target.value)}
                />
              </div> */}
              <div className="w-full md:w-[400px] flex  gap-2 text-left  mt-4">
                {/* <input type="checkbox" name="map" id="" />{" "} */}
                <span>Select numbers and emails from map search</span>
              </div>
              {/* Checkbox to send to map numbers */}
              <div className="flex flex-col gap-3 py-">
                {/* Display phone numbers */}
                {phoneNumbers.map((number) => (
                  <div key={number} className="flex items-center">
                    <input
                      type="checkbox"
                      id={number}
                      name={number}
                      checked={selectedNumbers.includes(number)}
                      onChange={() => handleNumberToggle(number)}
                    />
                    <label htmlFor={number}>{number}</label>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <div className="flex flex-col justify-center items-center">
                  <p className="text-[#005734] text-center font-serif text-sm font-bold">
                    Start Date
                  </p>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="bg-[#C4C4C4] rounded-md py-2 px-2 text-center text-xs font-medium"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="flex flex-col justify-center items-center">
                  <p className="text-[#005734] text-center font-serif text-sm font-bold">
                    End Date
                  </p>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="bg-[#C4C4C4] rounded-md  py-2 px-2 text-center text-xs font-medium"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center w-4/6">
              <hr class="flex-grow border-t border-[#005734]" />
              <span class="px-3 font-serif text-xl font-semibold text-gray-500">
                Send Survey Notification
              </span>
              <hr class="flex-grow border-t border-[#005734]" />
            </div>

            <div className="flex justify-center items-center w-4/6 space-x-2">
              <button
                className="w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#399544]"
              // onClick={() => {
              //   setOpen(true)
              // }}
              >
                Via Email
              </button>
              <button
                className="w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#3B82F6]"
                onClick={() => {
                  setOpen(true)
                }}>
                Via Email (csv)
              </button>
              <button
                className="w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-orange-500"
                onClick={() => {
                  setSmsOpen(true)
                }}
              >
                Via SMS
              </button>

              <button
                className="w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-orange-600"
                onClick={() => {
                  setSmsCsvOpen(true)
                }}
              >
                Via SMS(csv)
              </button>

            </div>

            <div className="flex justify-center items-center w-4/6">
              <button
                className="mb-2 w-[466px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]"
                onClick={() => {
                  setStartOpen(true)
                }}
              >
                Start the Survey
              </button>

            </div>



          </div>
        </div>
      </main>
    </Layout>


  );
};
