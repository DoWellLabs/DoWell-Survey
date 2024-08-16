import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import dowelllogo from "../assets/logonew.png";
// import { FaTimes } from "react-icons/fa";
// import { useState } from "react";
//import "./Sidebar.css";
// import NewSurvey from "./NewSurvey";

export default function Sidebar() {
  // const [modalOpen, setIsModalOpen] = useState(false);
  // const [NewSurveyModalOpen, setIsNewSurveyModalOpen] = useState(false);

  // const toggleModal = () => {
  //   setIsModalOpen((prevState) => !prevState);
  // };

  // const NewSurveyModal = () => {
  //   setIsNewSurveyModalOpen((prevState) => !prevState);
  // };

  // const closeNewSurveyModal = () => {
  //   setIsNewSurveyModalOpen(false);
  // };

  const [navbar, setNavbar] = useState(false);
  const location = useLocation();

  return (
    <main className="w-full h-full">
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-black mt-4 ml-2 mb-1 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6 hidden md:visible">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          <div class="flex items-center justify-center h-full">
            <Link
              className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
              to="/"
            >
              <img
                className="md:min-w-[208px] h-32"
                style={{ maxHeight: "150px" }}
                src={dowelllogo}
                alt="Default avatar"
              ></img>
            </Link>
          </div>

          <div className="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center justify-between flex-1">
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <Link to="/">
                <li
                  className={`flex items-center justify-start font-bold my-1 border bg-[#FF3131] border-white text-center text-md h-8 pl-3 ${
                    location.pathname === "/"
                      ? "text-black bg-white"
                      : "text-white hover:text-gray-600"
                  }`}
                >
                  New Survey
                </li>
              </Link>

              <Link to="/finalize-Sample">
                <li
                  className={`flex items-center justify-start pl-3 font-bold bg-[#7ED957] my-1 border border-white text-md h-8 ${
                    location.pathname === "/finalize-Sample"
                      ? "text-black bg-white"
                      : "text-white"
                  }`}
                >
                  1. Finalise Sample Size
                </li>
              </Link>
              <Link to="/newsurvey">
                <li
                  className={`flex items-center justify-start pl-3 font-bold bg-[#A6A6A6] my-1 border border-white text-md h-8 ${
                    location.pathname === "/newsurvey"
                      ? "text-black bg-white"
                      : "text-white"
                  }`}
                >
                  2. Link Survey Form
                </li>
              </Link>
              <Link to="/email-sms">
                <li
                  className={`font-bold  my-1 text-md flex h-16 ${
                    location.pathname === "/email-sms"
                      ? "text-black"
                      : "text-white"
                  }`}
                >
                  <p className={`w-[100px] text-[10px] pl-3 py-2 ${location.pathname === "/email-sms" ? "bg-white" : "bg-[#396E2E]"}`}>
                    A. SMS <br />
                    B. Email <br />
                    C. SMS & EMAIL
                  </p>
                  <p className={`ml-2 w-[120px] flex justify-center items-center ${location.pathname === "/email-sms" ? "bg-white" : "bg-[#A6A6A6]"}`}>
                    3.Start Survey
                  </p>
                </li>
              </Link>

              <Link to="/stop-survey">
                <li
                  className={`flex items-center justify-start pl-3 font-bold bg-[#A6A6A6] border border-white my-1 text-md h-8 ${
                    location.pathname === "/stop-survey"
                      ? "text-black bg-white"
                      : "text-white"
                  }`}
                >
                  4. Stop Survey
                </li>
              </Link>
            </ul>

            <ul className="md:flex-col md:min-w-full mt-8 flex flex-col list-none">
              <Link to="/list-surveys">
                <li
                  className={`flex items-center justify-start pl-3 font-bold bg-[#FF3131] my-1 text-md border border-white h-8 ${
                    location.pathname === "/list-surveys"
                      ? "text-black bg-white"
                      : "text-white hover:text-gray-600"
                  }`}
                >
                  My Surveys
                </li>
              </Link>
              <Link to="/settings">
                <li
                  className={`flex items-center justify-start pl-3 font-bold bg-[#A6A6A6] my-1 text-md border border-white h-8 ${
                    location.pathname === "/settings"
                      ? "text-black bg-white"
                      : "text-white hover:text-gray-600"
                  }`}
                >
                  Settings/Privacy
                </li>
              </Link>

              <Link to="/terms-conditions">
                <li
                  className={`flex items-center justify-start pl-3 font-bold bg-[#A6A6A6] my-1 border border-white text-md h-8 ${
                    location.pathname === "/terms-conditions"
                      ? "text-black bg-white"
                      : "text-white hover:text-gray-600"
                  }`}
                >
                  Terms and Conditions
                </li>
              </Link>

              <Link to="/">
                <li
                  className={`flex items-center justify-start pl-3 font-bold bg-[#A6A6A6] my-1 border border-white text-md h-8 ${
                    location.pathname === "/log-out"
                      ? "text-black bg-white"
                      : "text-white hover:text-gray-600"
                  }`}
                >
                  Log Out
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>

      <nav className="w-full shadow md:hidden bg-black">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
              <Link to="/">
                <img
                  className="w-16 h-16 rounded-full border-2 border-gray-600"
                  style={{ maxHeight: "150px" }}
                  src={dowelllogo}
                  alt="Default avatar"
                ></img>
              </Link>
              <div className="md:hidden">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                navbar ? "block" : "hidden"
              }`}
            >
              <ul className="items-center justify-center space-y-2 md:flex md:space-x-6 md:space-y-0">
                <li
                  className={`font-bold text-lg h-8 ${
                    location.pathname === "/newSurvey"
                      ? "text-black bg-white rounded-md px-1"
                      : "text-white hover:text-gray-600"
                  }`}
                >
                  <Link to="/">New Survey</Link>
                </li>
                <Link to="/finalize-Sample">
                  <li
                    className={`font-bold my-2 bg-[#7ED957] text-md h-8 ${
                      location.pathname === "/finalize-Sample"
                        ? "text-black bg-white rounded-md px-1"
                        : "text-white"
                    }`}
                  >
                    1. Finalise Sample Size
                  </li>
                </Link>
                <Link to="/newsurvey">
                  <li
                    className={`font-bold my-2 bg-[#A6A6A6]  text-md h-8 ${
                      location.pathname === "/newsurvey"
                        ? "text-black bg-white rounded-md px-1"
                        : "text-white"
                    }`}
                  >
                    2. Link Survey Form
                  </li>
                </Link>
                <Link to="/email-sms">
                  <li
                    className={`font-bold my-2 text-md w-full flex h-16 ${
                      location.pathname === "/email-sms"
                        ? "text-black bg-white rounded-md px-1"
                        : "text-white"
                    }`}
                  >
                    <p className="w-[100px] text-sm bg-[#396E2E]">
                      A. SMS <br />
                      B. Email <br />
                      C. SMS & EMAIL
                    </p>
                    <p className="bg-[#A6A6A6] ml-2 w-[120px] flex justify-center items-center">
                      3.Start Survey
                    </p>
                  </li>
                </Link>
                <li
                  className={`font-bold my-2 bg-[#A6A6A6] text-md h-8 ${
                    location.pathname === "/start-survey"
                      ? "text-black bg-white rounded-md px-1"
                      : "text-white"
                  }`}
                >
                  <Link to="/stop-survey">Stop Survey </Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                navbar ? "block" : "hidden"
              }`}
            >
              <ul className="items-center justify-center space-y-2 md:flex md:space-x-6 md:space-y-0">
                <li
                  className={`font-bold bg-[#FF3131] text-lg h-8 ${
                    location.pathname === "/list-surveys"
                      ? "text-black bg-[white] rounded-md px-1"
                      : "text-white hover:text-gray-600"
                  }`}
                >
                  <Link to="/list-surveys">My Surveys</Link>
                </li>
                <li
                  className={`font-bold bg-[#A6A6A6] text-lg h-8 ${
                    location.pathname === "/settings"
                      ? "text-black bg-white rounded-md px-1"
                      : "text-white hover:text-gray-600"
                  }`}
                >
                  <Link to="/settings">Settings/Privacy</Link>
                </li>

                <li
                  className={`font-bold bg-[#A6A6A6] text-lg h-8 ${
                    location.pathname === "/terms-conditions"
                      ? "text-black bg-white rounded-md px-1"
                      : "text-white hover:text-gray-600"
                  }`}
                >
                  <Link to="/terms-conditions">Terms and Conditions</Link>
                </li>

                <li
                  className={`font-bold bg-[#A6A6A6] text-lg h-8 ${
                    location.pathname === "/log-out"
                      ? "text-black bg-white rounded-md px-1"
                      : "text-white hover:text-gray-600"
                  }`}
                >
                  <Link to="/log-out">Log Out</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </main>
  );
}
