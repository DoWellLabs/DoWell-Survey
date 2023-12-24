import { Link } from "react-router-dom";
import dowelllogo from "../assets/dowell.jpeg";
// import { FaTimes } from "react-icons/fa";
// import { useState } from "react";
import "./Sidebar.css";
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

  return (
    <main className="w-full h-full">
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-black flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/"
          >
            <img
              className="w-full h-auto rounded"
              style={{ maxHeight: "150px" }}
              src={dowelllogo}
              alt="Default avatar"
            ></img>
          </Link>
          <div className="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1">
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {/* <li className="items-center py-1.5">
                <Link
                  onClick={NewSurveyModal}
                  className="bg-red-500 text-center text-md font-serif py-1 font-bold block text-white hover:text-black"
                >
                  New Survey
                </Link>
              </li> */}

              <li className="items-center py-1.5">
                <Link
                  to="/newsurvey"
                  className="bg-red-500 text-center text-md font-serif py-1 font-bold block text-white hover:text-black"
                >
                  New Survey
                </Link>
              </li>

              <li className="items-center py-1.5">
                <Link className="bg-green-500 text-center text-md font-serif py-1 font-bold block text-white hover:text-black"
                 to="/finalize-Sample"
                
                >
                  1. Finalize Sample Size
                </Link>
              </li>

              <li className="items-center py-1.5">
                <Link
                  // onClick={toggleModal}
                   to="/link-form"
                 
                  className="bg-gray-400 text-center text-md font-serif py-1 font-bold block text-white hover:text-black"
                >
                  2. Link Survey Form
                </Link>
              </li>

              <li className="flex items-center py-1.5">
                <Link 
                to="/email-sms"
                className="bg-green-800 text-center font-serif font-bold block text-white hover:text-black flex-1">
                  <ul className="md:min-w-full flex flex-col items-start px-1 list-none">
                    <li className="text-[10px] font-bold text-white hover:text-black">
                      A. Sms
                    </li>
                    <li className="text-[10px] font-bold text-white hover:text-black">
                      B. Email
                    </li>
                    <li className="text-[10px] font-bold text-white hover:text-black">
                      C. Sms and email
                    </li>
                  </ul>
                </Link>

                <Link
                  className="bg-gray-400 text-center text-xs py-1 font-serif font-bold block text-white hover:text-black ml-2 flex-1" // Add ml-2 for spacing between links
                >
                  3. Start Survey
                </Link>
              </li>

              <li className="items-center py-1.5">
                <Link className="bg-gray-400 text-center text-md font-serif py-1 font-bold block text-white hover:text-black">
                  4. Stop Survey
                </Link>
              </li>
              <li className="items-center py-1.5">
                <Link className="bg-gray-400 text-center text-md font-serif py-1 font-bold block text-white hover:text-black">
                  5. Repeat
                </Link>
              </li>
            </ul>

            <ul className="md:flex-col md:min-w-full mt-8 flex flex-col list-none">
              <li className="items-center">
                <Link to="/list-surveys" className="bg-red-500 text-center text-md font-serif py-1 font-bold block text-white hover:text-black">
                  My Surveys
                </Link>
              </li>

              <li className="items-center py-1.5">
                <Link to="/settings" className="bg-gray-400 text-center text-md font-serif py-1 font-bold block text-white hover:text-black">
                  Settings/Privacy
                </Link>
              </li>

              <li className="items-center py-1.5">
                <Link className="bg-gray-400 text-center text-md font-serif py-1 font-bold block text-white hover:text-red-500">
                  Log Out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* <div
        className={`${
          modalOpen ? "modal-overlay show-modal" : "modal-overlay"
        } `}
      >
        <form className="modal-container pt-[2rem]">
          <input
            type="text"
            id="firstName"
            name="firstName"
            // {...register("firstName")}
            placeholder="Link survey form"
            className="w-4/5 md:w-[25rem] h-[3rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
            style={{ paddingLeft: "1rem" }}
          />

          <button className="w-4/5 md:w-[25rem] mt-[10px] h-[50px] font-serif font-bold text-black text-center bg-[#005734] opacity-80 hover:opacity-100 text-[16px] md:text-[20px] rounded-[12px] hover:text-white cursor-pointer ">
            Submit
          </button>

          <button
            className="close-modal-btn rounded-md hover:bg-[#005734] text-xl p-1"
            // onClick={toggleModal}
            type="button"
          >
            <FaTimes></FaTimes>
          </button>
        </form>
      </div> */}

      {/* <div
        className={`${
          NewSurveyModalOpen ? "modal-overlay show-modal" : "modal-overlay"
        }`}
      >
        <NewSurvey closeModal={closeNewSurveyModal} />
      </div> */}
    </main>
  );
}
