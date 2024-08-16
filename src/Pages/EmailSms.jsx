import QRCode from "react-qr-code";
import Layout from "../Layout/Layout";
import { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./pages.css";
import { showToast } from "./showToast";
import {
  MapPinIcon,
  PencilSquareIcon,
  QrCodeIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import CSVReader from "react-csv-reader";
import { MdEmail, MdOutlineEmail } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { FaSquarePhone } from "react-icons/fa6";
import { FaGlobe } from "react-icons/fa";
import { IoAddOutline, IoPerson } from "react-icons/io5";

const extractPhoneNumbersFromSessionStorage = () => {
  const surveyData = JSON.parse(sessionStorage.getItem("newSurvey"));
  if (!surveyData) return [];
  const numbers = surveyData
    .filter((entry) => entry.phone && entry.phone !== "None")
    .map((entry) => ({ phone: entry.phone, address: entry.place_name }));
  console.log("hers the", numbers);
  return numbers;
};

const extractWebsitesFromSessionStorage = () => {
  const surveyData = JSON.parse(sessionStorage.getItem("newSurvey"));
  console.log("survey data),", surveyData);
  if (!surveyData) return [];
  const websites = surveyData
    .filter((entry) => entry.website && entry.website !== "None")
    .map((entry) => ({ website: entry.website, address: entry.place_name }));
  console.log("heres the websites", websites);
  return websites;
};

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const EmailModal = ({
  emailOpen,
  setEmailOpen,
  websites,
  getQrcode,
  Uname,
  sformattedDate,
  eformattedDate,
  numOfParticipant,
  startToEnd,
  formTemplate,
}) => {
  const [emailLoading, setEmailLoading] = useState(false);
  const [fetchedEmails, setFetchedEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailSendLoading, setEmailSendLoading] = useState(false);
  const [webLinks, setWebLinks] = useState(
    websites.map((websites) => websites.website)
  );

  const [perPercentage, setPerPercentage] = useState(0);

  const NameRef = useRef(null);
  const emailRef = useRef(null);

  const cancelButtonRef = useRef(null);

  const handleCSVLinksRead = (data, fileInfo) => {
    const extractedLinks = data.map((row, index) => row[0]);

    //console.log("start", extractedMails[0]);
    setWebLinks((weblinks) => [...weblinks, ...extractedLinks]);
  };

  const GetOneEmail = async (formdata, percent) => {
    try {
      const response = await axios.post(
        `https://uxlivinglab100106.pythonanywhere.com/api/website-info-extractor/`,
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPerPercentage((perPercentage) => perPercentage + percent);
      return response;
    } catch (error) {
      console.log("an error", error);
      setPerPercentage(
        (perPercentage) => parseInt(perPercentage) + parseInt(percent)
      );
    }
  };

  const handleGetEmails = async (weblinks) => {
    setEmailLoading(true);

    const percent = 100 / weblinks.length;

    const formDatas = weblinks.map((website) => ({
      web_url: `${website}`,
      info_request: {
        emails: true,
      },
    }));

    try {
      const responses = await Promise.allSettled(
        formDatas.map((formData) => GetOneEmail(formData, percent))
      );
      // const data = responses.flatMap(response => response.data?.emails_found);

      const failedPromises = responses.filter(
        (response) => response.status === "rejected"
      );
      if (failedPromises.length === responses.length) {
        // All promises failed
        throw new Error("All requests failed");
      }

      setEmailLoading(false);
      setPerPercentage(0);
      const successfulResponsesEmails = responses
        .filter(
          (response) =>
            response.status === "fulfilled" &&
            response.value?.data?.emails_found?.length >= 1
        )
        .flatMap((response) => response.value?.data?.emails_found);

      const namesEmails = successfulResponsesEmails.map((email) => ({
        name: email,
        email: email,
      }));
      setSelectedEmails(namesEmails);

      return;
    } catch (error) {
      setEmailLoading(false);
      setPerPercentage(0);
      toast.error("Error fetching emails", {
        onClose: () => { },
      });
    }
  };

  const handleSubmit = async () => {
    //const emails = csvEmails.map((email) => `dsdsdsds`)
    setEmailSendLoading(true);

    const formData = {
      fromname: "Dowell Surveys",
      fromemail: "user@username.com",
      to_email_list: selectedEmails,
      subject: "Survey Creation Confirmation",
      email_content: formTemplate,
    };

    try {
      const response = await axios.post(
        `https://100085.pythonanywhere.com/api/dowell_bulk_email/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setEmailSendLoading(false);
      toast.success("Email(s) sent successfully", {
        onClose: () => { },
      });
    } catch (error) {
      setEmailSendLoading(false);
      toast.error("Error in sending mail(s)", {
        onClose: () => { },
      });
    }
  };

  const handleEmailModalClose = () => {
    setEmailLoading(false);
    setEmailSendLoading(false);
    setWebLinks(websites.map((websites) => websites.website));
    setSelectedEmails([]);
    setEmailOpen(false);
  };

  return (
    <Transition.Root show={emailOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={handleEmailModalClose}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-4xl max-h-4xl">
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex items-center justify-between w-full text-white bg-[#005734] text-lg">
                    <p className="font-bold mx-4 my-2 ">
                      Send Notifications via Emails
                    </p>
                    <button
                      className="font-serif font-bold text-center m-4"
                      onClick={handleEmailModalClose}
                    >
                      <XMarkIcon className="h-4 w-4 m-1" />
                    </button>
                  </div>

                  <div className="flex w-full flex-col h-96 bg-[#EFF3F6] px-4 m-2">
                    <div className="flex justify-between space-x-1">
                      <div className="w-3/12 h-full flex items-center justify-center">
                        <div className="full flex flex-col justify-center items-center border-dashed border-2 border-[#B1B0B0] m-2 h-64 relative w-full">
                          <FiUpload className="h-12 w-12 m-1 text-black" />
                          <p className="font-semibold">Upload csv file</p>

                          <CSVReader
                            onFileLoaded={handleCSVLinksRead}
                            // onError={() => alert("file format supported")}
                            accept=".csv"
                            inputStyle={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              height: "100%",
                              width: "100%",
                              cursor: "pointer",
                              opacity: 0,
                            }}
                            parserOptions={{
                              header: false,
                              skipEmptyLines: true,
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-4/12 flex flex-col justify-between">
                        <div className="my-3 flex flex-col justify-between">
                          <div className="flex items-center justify-center w-full text-white font-semibold bg-[#4F6D75] text-md">
                            Web Links
                          </div>
                          <div className="h-72 border border-gray-200 my-2 overflow-y-auto">
                            {webLinks.map((website, index) => (
                              <div
                                key={index}
                                className="flex w-auto text-sm bg-white mt-1 rounded-lg"
                              >
                                <div className="w-2/12 flex justify-center items-center">
                                  <FaGlobe className="h-4 w-4 m-1" />
                                </div>
                                <div className="w-7/12 text-black">
                                  <p className="font-semibold break-all">
                                    {website}
                                  </p>
                                </div>
                                <div className="w-3/12 text-black"></div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-center">
                            {emailLoading ? (
                              <button
                                className="w-full h-[30px] font-serif font-bold text-center text-sm md:text-md text-white bg-[#5DA868] cursor-not-allowed"
                                disabled
                              >
                                {`fetching ${perPercentage.toFixed(1)}%`}
                              </button>
                            ) : (
                              <button
                                className={`${webLinks.length < 1
                                  ? "opacity-60 cursor-not-allowed"
                                  : "hover:opacity-100 opacity-80"
                                  } w-full h-[30px] font-serif font-bold text-center text-sm md:text-md text-white bg-[#5DA868]`}
                                onClick={() => handleGetEmails(webLinks)}
                                disabled={webLinks.length < 1}
                              >
                                Get Emails
                              </button>
                            )}
                          </div>
                        </div>

                        <div></div>
                      </div>

                      <div className="w-4/12">
                        <div className="my-3 bg-[#EFF3F6] ">
                          <div className="flex items-center justify-center w-full text-white font-semibold bg-[#4F6D75] text-md">
                            Email Listings
                          </div>
                          <div className="overflow-y-auto h-72 my-2 border border-gray-200">
                            {selectedEmails.length < 1 ? (
                              <div className="flex justify-center items-center h-full">
                                <p className="text-gray-500 text-center text-lg font-semibold">
                                  No results found
                                </p>
                              </div>
                            ) : (
                              selectedEmails.map((email, index) => (
                                <div
                                  key={index}
                                  className="flex text-sm bg-white my-1"
                                >
                                  <div className="w-2/12 flex justify-center items-center">
                                    <MdOutlineEmail className="h-4 w-4 m-1" />
                                  </div>
                                  <div className="w-9/12">
                                    <p className="font-semibold break-all">
                                      {email.email}
                                    </p>
                                  </div>
                                  <button
                                    className="text-red-500"
                                    onClick={() => {
                                      const updatedList = [...selectedEmails];
                                      //const valueIndex = updatedList.indexOf(id);
                                      const valueIndex = updatedList.findIndex(
                                        (obj) => obj.email === email.email
                                      );

                                      if (valueIndex !== -1) {
                                        // Value is present, remove it
                                        updatedList.splice(valueIndex, 1);
                                        setSelectedEmails(updatedList);
                                      }
                                    }}
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="flex justify-center">
                            {emailSendLoading ? (
                              <button
                                className="w-full h-[30px] font-serif font-bold text-center text-sm md:text-md text-white bg-[#5DA868] cursor-not-allowed"
                                disabled
                              >
                                sending
                              </button>
                            ) : (
                              <button
                                className={`${selectedEmails.length < 1
                                  ? "opacity-60 cursor-not-allowed"
                                  : "hover:opacity-100 opacity-80"
                                  } w-full h-[30px] font-serif font-bold text-center text-sm md:text-md text-white bg-[#5DA868]`}
                                onClick={handleSubmit}
                                disabled={selectedEmails.length < 1}
                              >
                                Send Emails
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div></div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const EmailCsvModal = ({
  open,
  setOpen,
  getQrcode,
  Uname,
  sformattedDate,
  eformattedDate,
  numOfParticipant,
  startToEnd,
  formTemplate,
}) => {
  const [csvEmails, setCsvEmails] = useState([]);
  const [csvSendLoading, setCsvSendLoading] = useState(false);
  const NameRef = useRef(null);
  const emailRef = useRef(null);

  const handleCSVRead = (data, fileInfo) => {
    // Assuming the first column in the CSV file contains the list of numbers

    const numbersColumnIndex = 0;

    const extractedMails = data.map((row, index) => ({
      email: row[0],
      name: row[0],
    }));

    setCsvEmails((emails) => [...emails, ...extractedMails]);
  };

  const handleSubmit = async () => {
    //const emails = csvEmails.map((email) => `dsdsdsds`)
    setCsvSendLoading(true);

    const formData = {
      fromname: "Dowell Surveys",
      fromemail: "user@username.com",
      to_email_list: csvEmails,
      subject: "Survey Creation Confirmation",
      email_content: formTemplate,
    };

    try {
      const response = await axios.post(
        `https://100085.pythonanywhere.com/api/dowell_bulk_email/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setCsvSendLoading(false);
      toast.success("Email(s) sent successfully", {
        onClose: () => { },
      });
    } catch (error) {
      setCsvSendLoading(false);
      toast.error("Error in sending mail(s)", {
        onClose: () => { },
      });
    }
  };

  const cancelButtonRef = useRef(null);

  const handleEmailCsvModalClose = () => {
    setCsvSendLoading(false);
    setCsvEmails([]);
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={handleEmailCsvModalClose}
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
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex items-center justify-between w-full text-white bg-[#005734] text-lg">
                    <p className="font-bold mx-4 my-2 ">
                      Send Email Via CSV upload
                    </p>
                    <button
                      className="font-serif font-bold text-center m-4"
                      onClick={handleEmailCsvModalClose}
                    >
                      <XMarkIcon className="h-4 w-4 m-1" />
                    </button>
                  </div>

                  <div className="w-full h-full flex justify-between">
                    <div className="w-6/12 flex flex-col justify-center items-center">
                      <div className="w-full flex flex-col justify-center items-center border-dashed border-2 border-[#B1B0B0] m-2 relative h-52">
                        <FiUpload className="h-12 w-12 m-1 text-black" />
                        <p className="font-semibold">
                          {" "}
                          click to upload csv file
                        </p>

                        <CSVReader
                          onFileLoaded={handleCSVRead}
                          onError={() => alert("file format supported")}
                          accept=".csv"
                          inputStyle={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: "100%",
                            cursor: "pointer",
                            opacity: 0,
                          }}
                          parserOptions={{
                            header: false,
                            skipEmptyLines: true,
                          }}
                        />
                      </div>
                      <div>
                        <div class="flex items-center justify-center w-full my-2">
                          <hr class="flex-grow border-t border-[#005734]" />
                          <span class="px-3 font-serif text-sm font-semibold text-gray-500">
                            Add Emails
                          </span>
                          <hr class="flex-grow border-t border-[#005734]" />
                        </div>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const details = {
                              name: NameRef.current.value,
                              email: emailRef.current.value,
                            };
                            setCsvEmails((emails) => [...emails, details]);
                            NameRef.current.value = "";
                            emailRef.current.value = "";
                          }}
                          className="flex items-center justify-center w-full space-x-2"
                        >
                          <div class="relative w-4/12">
                            <input
                              type="text"
                              className="py-1 border w-full rounded-md pl-8"
                              ref={NameRef}
                              required
                              placeholder="Name"
                            />
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IoPerson className="text-gray-400" />
                            </div>
                          </div>

                          <div class="relative w-6/12">
                            <input
                              type="email"
                              className="py-1 border w-full rounded-md pl-8"
                              ref={emailRef}
                              required
                              placeholder="Email"
                            />
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MdEmail className="text-gray-400" />
                            </div>
                          </div>

                          <button className="w-[70px] py-2 font-serif opacity-80 hover:opacity-100 text-center text-xs rounded-md text-white bg-[#399544]">
                            Add
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="w-6/12 h-full m-2">
                      <div className="flex items-center justify-center w-full text-white font-semibold bg-[#4F6D75] text-md">
                        Email Listings
                      </div>
                      <div className="my-2 h-56 bg-[#EFF3F6] border border-gray-200 overflow-y-auto">
                        {csvEmails.map((email, index) => (
                          <div
                            key={index}
                            className="flex text-sm bg-white my-1"
                          >
                            <div className="w-2/12 flex justify-center items-center">
                              <MdOutlineEmail className="h-4 w-4 m-1" />
                            </div>
                            <div className="w-9/12">
                              <p className="font-semibold break-all">
                                {email.email}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center">
                        {csvSendLoading ? (
                          <button
                            className="w-full h-[30px] font-serif font-bold text-center text-sm md:text-md text-white bg-[#005734] cursor-not-allowed"
                            disabled
                          >
                            Processing
                          </button>
                        ) : (
                          <button
                            className={`${csvEmails.length < 1
                              ? "opacity-60 cursor-not-allowed"
                              : "hover:opacity-100 opacity-80"
                              } w-full h-[30px] font-serif font-bold text-center text-sm md:text-md text-white bg-[#005734]`}
                            onClick={handleSubmit}
                            disabled={csvEmails.length < 1}
                          >
                            Send Emails
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const SmsModal = ({ smsOpen, setSmsOpen, phoneNumbers }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={smsOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setSmsOpen(false)}
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
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex items-center justify-between w-full text-white bg-[#005734] text-lg">
                    <p className="font-bold mx-4 my-2 ">
                      Send Notifications via SMS
                    </p>
                    <button
                      className="font-serif font-bold text-center m-4"
                      onClick={() => setSmsOpen(false)}
                    >
                      <XMarkIcon className="h-4 w-4 m-1" />
                    </button>
                  </div>

                  <div className="flex w-full flex-col h-64 overflow-y-auto bg-[#EFF3F6] px-4 m-2">
                    {phoneNumbers.length < 1 ? (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500 text-center text-lg font-semibold">
                          You did not Select any Location with Mobile Nos.
                        </p>
                      </div>
                    ) : (
                      phoneNumbers.map((phoneNumber, index) => (
                        <div
                          key={index}
                          className="flex w-full text-sm bg-white mt-3 rounded-lg"
                        >
                          <div className="w-2/12 flex justify-center items-center">
                            <MdOutlineEmail className="h-4 w-4 m-1" />
                          </div>
                          <div className="w-10/12 text-black">
                            <p>{phoneNumber.address}</p>
                            <p className="font-semibold">{phoneNumber.phone}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button className="w-[150px] m-2 h-[30px] font-serif font-bold text-center text-sm md:text-md text-white bg-[#005734] opacity-60 cursor-not-allowed">
                    Send SMS
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const SmsCsvModal = ({ smsCsvOpen, setSmsCsvOpen }) => {
  const [csvNumbers, setCsvNumbers] = useState([]);

  const handleCSVNumbersRead = (data, fileInfo) => {
    // Assuming the first column in the CSV file contains the list of numbers
    const numbersColumnIndex = 0;
    const extractedNumbers = data.map((row, index) => ({
      number: row[1],
      name: row[0],
    }));

    setCsvNumbers(extractedNumbers);
  };

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={smsCsvOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setSmsCsvOpen(false)}
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
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex items-center justify-between w-full text-white bg-[#005734] text-lg">
                    <p className="font-bold mx-4 my-2 ">
                      Send Notifications via SMS(CSV upload)
                    </p>
                    <button
                      className="font-serif font-bold text-center m-4"
                      onClick={() => setSmsCsvOpen(false)}
                    >
                      <XMarkIcon className="h-4 w-4 m-1" />
                    </button>
                  </div>

                  <div className="w-full h-full flex justify-between">
                    <div className="w-6/12 flex flex-col justify-center items-center border-dashed border-2 border-[#B1B0B0] m-2 h-64 relative">
                      <FiUpload className="h-12 w-12 m-1 text-black" />
                      <p className="font-semibold"> click to upload csv file</p>

                      <CSVReader
                        onFileLoaded={handleCSVNumbersRead}
                        inputStyle={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: "100%",
                          cursor: "pointer",
                          opacity: 0,
                        }}
                        parserOptions={{ header: false, skipEmptyLines: true }}
                      />
                    </div>

                    <div className="w-6/12 h-full m-2">
                      <div className="flex items-center justify-center w-full text-white font-semibold bg-[#4F6D75] text-md">
                        SMS Listings
                      </div>
                      <div className="my-2 h-44 bg-[#EFF3F6] border border-gray-200 overflow-y-auto">
                        {csvNumbers.map((number, index) => (
                          <div
                            key={index}
                            className="flex text-sm bg-white my-1"
                          >
                            <div className="w-2/12 flex justify-center items-center">
                              <FaSquarePhone className="h-4 w-4 m-1" />
                            </div>
                            <div className="w-9/12">
                              <p>{number.name}</p>
                              <p className="font-semibold">{number.number}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center">
                        <button className="w-full m-2 h-[30px] font-serif font-bold text-center text-sm md:text-md text-white bg-[#005734] opacity-60 cursor-not-allowed">
                          Send SMS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const StartSurveyModal = ({ startOpen, setStartOpen, startToEnd, setStartToEnd, surveyStarted, setSurveyStarted }) => {
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [startLoading, setStartLoading] = useState(false);

  const [syear, smonth, sday] = startDate.split("-");
  const [eyear, emonth, eday] = endDate.split("-");
  const sformattedDate = `${sday}-${smonth}-${syear}`;
  const eformattedDate = `${eday}-${emonth}-${eyear}`;



  const cancelButtonRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStartLoading(true);

    try {
      const updatedSurveyData = {
        id: sessionStorage.getItem("id"),
        qrcode_id: sessionStorage.getItem("qrcode_id"),
        start_date: sformattedDate,
        end_date: eformattedDate,
      };

      const updateSurvey = await axios.put(
        `https://100025.pythonanywhere.com/update-qr-codev2?api_key=1b834e07-c68b-4bf6-96dd-ab7cdc62f07f`,
        updatedSurveyData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      sessionStorage.removeItem("step1");
      sessionStorage.removeItem("step2");
      sessionStorage.removeItem("step3");
      const time_period = `<li>Start Date: <strong>${updatedSurveyData.start_date}</strong></li><li>End Date: <strong>${updatedSurveyData.end_date}</strong></li>`;
      setStartToEnd(time_period);
      sessionStorage.setItem("start_end", time_period);
      setStartLoading(false);
      setStartOpen(false);

      toast.success("Your survey has started", {
        onClose: () => {
          // navigate("/list-surveys");
        },
      });
      //sessionStorage.setItem("surveyStarted", true);
      setSurveyStarted(true);


    } catch (error) {
      setStartLoading(false);
      toast.error("Error updating survey: ", {
        onClose: () => {
          //  navigate("/list-surveys");
        },
      });
    }
  };

  if (surveyStarted) {
    return (
      <div className="flex flex-col space-y-2 w-full">
        <p className="text-center text-md font-semibold"> {`Survey has Started and will run from ${startDate} to ${endDate}`}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 w-full">
      <h1 className="text-center font-serif text-md font-semibold">Set the Duration for the Survey</h1>
      <div className="flex items-center justify-center w-full space-x-8">
        <div className="flex items-center justify-center space-x-1">
          <h2 className="font-medium w-5/12 text-left">Start Date:</h2>
          <div className="w-7/12">
            <input
              type="date"
              className="p-1 bg-[#D9D9D9] border border-[#BFBFBF]"
              value={startDate}

              onChange={(e) => {

                setStartDate(e.target.value)
                const startDateConverted = new Date(e.target.value);
                const endDateConverted = new Date(endDate)
                if (startDateConverted >= endDateConverted) {
                  setEndDate(e.target.value)
                }

              }}
            />

          </div>


        </div>
        <div className="flex items-center justify-center space-x-1">
          <h2 className="font-medium w-5/12 text-left">End Date:</h2>
          <div className="w-7/12">
            <input
              type="date"
              className="p-1 bg-[#D9D9D9] border border-[#BFBFBF]"
              value={endDate}

              onChange={(e) => {
                setEndDate(e.target.value)
                const startDateConverted = new Date(startDate);
                const endDateConverted = new Date(e.target.value)
                if (startDateConverted >= endDateConverted) {
                  setStartDate(e.target.value)
                }
              }}
            />

          </div>


        </div>

      </div>
      <div className="flex justify-center items-center">
        <button
          className={`${startLoading
            ? "opacity-60 cursor-not-allowed"
            : "hover:opacity-100 opacity-80"
            } w-[150px] h-[30px] font-serif font-bold text-center text-sm md:text-md text-white bg-[#005734]`}
          onClick={handleSubmit}
          disabled={startLoading}
        >
          {startLoading ? "Starting" : "Start Survey"}

        </button>
      </div>
    </div>
  );
};

export const EmailSms = () => {


  const [surveyStarted, setSurveyStarted] = useState(false);

  const [open, setOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [smsCsvOpen, setSmsCsvOpen] = useState(false);
  const [startToEnd, setStartToEnd] = useState(
    sessionStorage.getItem("start_end") || ""
  );
  const surveyLink = sessionStorage.getItem("surveyLink");

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

  const [phoneNumbers, setPhoneNumbers] = useState(
    extractPhoneNumbersFromSessionStorage()
  );

  useEffect(() => {
    const firstStep = sessionStorage.getItem("step1");
    const secondStep = sessionStorage.getItem("step2");
    const thirdStep = sessionStorage.getItem("step3");
    let toastShown = false;
    if (!firstStep) {
      showToast("Please fill Step 1 ");
      navigate("/");
      toastShown = true;
    }
    if (!secondStep && !toastShown) {
      showToast("Please fill Step 2 ");
      navigate("/finalize-Sample");
      toastShown = true;
    }
    if (!thirdStep && !toastShown) {
      showToast("Please fill Step 3 ");
      navigate("/newsurvey");
      toastShown = true;
    }
  }, []);

  const [sms, setSms] = useState(null);
  const [websites, setWebsites] = useState(extractWebsitesFromSessionStorage);
  const surveyData = sessionStorage.getItem("surveyData") || "[]";
  const surveyData1 = JSON.parse(surveyData);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [showNumbersFromMap, setShowNumbersFromMap] = useState(false);
  const [regionValue, setRegionValue] = useState("");
  const [updatedInfo, setUpdatedInfo] = useState(
    sessionStorage.getItem("surveyName")
  );

  useEffect(() => {
    // Retrieve the stringified array from session storage
    const regionString = sessionStorage.getItem("region");

    let regionArray;

    try {
      regionArray = JSON.parse(regionString);

    } catch (e) {
      regionArray = [];
    }

    // const regionArray = JSON.parse(regionString);

    if (Array.isArray(regionArray) && regionArray.length > 0) {
      const regionText = regionArray
        .map((region) => region.toUpperCase())
        .join(", ");

      setRegionValue(`${regionText}`);
    } else {
      setRegionValue("Unknown Region");
    }
  }, []); // Run this effect only once after the component is mounted

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

  const formTemplate = `<!DOCTYPE html>
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
        This is to confirm that a survey, <strong>${updatedInfo}</strong>,
        has been successfully created on our platform. Below, you'll find the
        details of the created survey. You can share the QR Code/Link with intended
        participants or on your platforms.
      </p>
      <div class="details">
        <ul>
          ${startToEnd}
          <li>
            Maximum Number of Participants/Responses:
            <strong>${numOfParticipant}</strong>
          </li>
          <li>
            Target Location/Audience:
            <strong>${regionValue} Region's</strong>
          </li>
          <li>QR Code Link: <strong>${getQrcode}</strong></li>
          <li>Click <a href="${surveyLink}">HERE</a> to take the survey</li>
          
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
  `;

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
      <main className="w-full">
        <div className="flex flex-col px-4 md:px-10 mt-[40px] md:pl-[310px] md:mt-0 h-screen pt-4 pb-1">
          <SmsModal
            smsOpen={smsOpen}
            setSmsOpen={setSmsOpen}
            phoneNumbers={phoneNumbers}
          />
          <SmsCsvModal smsCsvOpen={smsCsvOpen} setSmsCsvOpen={setSmsCsvOpen} />
          <EmailModal
            emailOpen={emailOpen}
            setEmailOpen={setEmailOpen}
            websites={websites}
            getQrcode={getQrcode}
            Uname={Uname}
            sformattedDate={sformattedDate}
            eformattedDate={eformattedDate}
            numOfParticipant={numOfParticipant}
            startToEnd={startToEnd}
            formTemplate={formTemplate}
          />
          <EmailCsvModal
            open={open}
            setOpen={setOpen}
            getQrcode={getQrcode}
            Uname={Uname}
            sformattedDate={sformattedDate}
            eformattedDate={eformattedDate}
            numOfParticipant={numOfParticipant}
            startToEnd={startToEnd}
            formTemplate={formTemplate}
          />
          <div className="px-2 items-center flex justify-between bg-[#005734]">
            <h1 className=" text-white text-2xl font-bold pt-1 pb-3 no-underline">
              Start Survey
            </h1>
            <h6 className=" text-white text-sm font-bold pb-0 no-underline">
              Send Survey via Mails and SMS
            </h6>
          </div>
          <div className="flex flex-col space-y-3 justify-center items-center h-full bg-[#EFF3F6]">
            <div className="flex justify-center items-center">
              <img
                src={getQrcode}
                className="w-4/6 mt-2"
                alt=""
              />
            </div>

            <StartSurveyModal
              startOpen={true}
              setStartOpen={setStartOpen}
              startToEnd={startToEnd}
              setStartToEnd={setStartToEnd}
              surveyStarted={surveyStarted}
              setSurveyStarted={setSurveyStarted}
            />

            <div class="flex items-center w-4/6">
              <hr class="flex-grow border-t border-[#005734]" />
              <span class="px-3 font-serif text-md font-semibold">
                Send Survey Notification
              </span>
              <hr class="flex-grow border-t border-[#005734]" />
            </div>

            <div className="flex justify-center items-center w-4/6 space-x-2 mb-8">
              <button
                className="w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]"
                onClick={() => {
                  if (!startToEnd) {
                    toast.error("Start the Survey first", {
                      onClose: () => {
                        //  navigate("/list-surveys");
                      },
                    });
                    return;
                  }
                  setEmailOpen(true);
                }}
              >
                Via Weblinks
              </button>
              <button
                className="w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]"
                onClick={() => {
                  if (!startToEnd) {
                    toast.error("Start the Survey first", {
                      onClose: () => {
                        //  navigate("/list-surveys");
                      },
                    });
                    return;
                  }
                  setOpen(true);
                }}
              >
                Via Email
              </button>
              <button
                className="w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]"
                onClick={() => {
                  if (!startToEnd) {
                    toast.error("Start the Survey first", {
                      onClose: () => {
                        //  navigate("/list-surveys");
                      },
                    });
                    return;
                  }
                  setSmsOpen(true);
                }}
              >
                Via SMS
              </button>

              <button
                className="w-[150px] h-[30px] font-serif font-bold opacity-80 hover:opacity-100 text-center text-sm md:text-md text-white bg-[#005734]"
                onClick={() => {
                  if (!startToEnd) {
                    toast.error("Start the Survey first", {
                      onClose: () => {
                        //  navigate("/list-surveys");
                      },
                    });
                    return;
                  }
                  setSmsCsvOpen(true);
                }}
              >
                Via SMS(csv)
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};
