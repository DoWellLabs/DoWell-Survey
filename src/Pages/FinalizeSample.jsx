import { useState, useRef, useEffect } from "react";
import Layout from "../Layout/Layout";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "./showToast";

const FinalizeSample = () => {
  const navigate = useNavigate();
  const selectedOptionRef = useRef(null);

  const [surveyType, setSurveyType] = useState("global");

  const [sampleData, setSampleData] = useState([]);

  const stored_locations = sessionStorage.getItem("newSurvey") || "[]";
  const [surveys, setSurveys] = useState(JSON.parse(stored_locations));

  //extract the regions
  const uniqueRegions = [
    ...new Set(surveys.map((obj) => obj.searchRegion.toLowerCase())),
  ];
  const uniqueCords = [...new Set(surveys.map((obj) => obj.search_cords))];

  // const participants_no = sessionStorage.getItem("numOfParticipants") || 0;
  const [numOfParticipants, setNumOfParticipants] = useState("");
  const firstStep = sessionStorage.getItem("step1");

  // useEffect(() => {
  //   if (!firstStep) {
  //     toast.error("Please fill Step 1 Before Finalizing Survey Sample", {
  //       onClose: () => {},
  //     });
  //     console.log("this is coming twice");
  //     navigate("/");
  //   }
  // }, [firstStep, navigate]);

  useEffect(() => {
    if (!firstStep) {
      showToast("Please fill Step 1 Before Finalizing Survey Sample");
      console.log("this is coming twice");
      navigate("/");
    }
  }, [firstStep, navigate]);

  const handleRadioChange = (e) => {
    const selectedValue = e.target.value;
    setSurveyType(selectedValue);
    console.log(`Selected option: ${selectedValue}`);
  };

  const handleDelete = (placeId) => {
    const updatedData = surveys.filter((data) => data.placeId !== placeId);

    setSurveys(updatedData);
  };

  const handleDone = () => {
    sessionStorage.setItem("step2", "completed");
    sessionStorage.setItem("newSurvey", JSON.stringify(surveys));
    sessionStorage.setItem("numOfParticipants", numOfParticipants);

    console.log("surveyType", surveyType);

    if (surveyType === "global") {
      sessionStorage.setItem("region", JSON.stringify(['all']).replace(/"/g, "'"));
      sessionStorage.setItem("country", "all");
      sessionStorage.setItem("coords", "0.0,0.0");
    } //surveyType === regional
    else {
      sessionStorage.setItem("region", JSON.stringify(uniqueRegions).replace(/"/g, "'"));
      sessionStorage.setItem("coords", uniqueCords[0]);
    }

    // sessionStorage.setItem("userRegion", region);

    navigate("/newsurvey");
  };

  return (
    <Layout>
      <main className="w-full">
        <div className="flex flex-col px-4 md:px-10 mt-[40px] md:pl-[310px] md:mt-0 h-screen pt-4 pb-1">
          <div className="px-2 items-center flex justify-between bg-[#005734]">
            <h1 className=" text-white text-2xl font-bold pt-1 pb-3 no-underline">
              Finalize Sample Size
            </h1>
            <h6 className=" text-white text-sm font-bold pb-0 no-underline">
              Set the total number of persons allowed to fill this survey
            </h6>
          </div>

          <div className="flex items-center h-full bg-[#EFF3F6]">
          <div className="inline-block w-full">
                    <div className="w-10/12 mx-auto flex flex-col space-y-8">
                      <div className="overflow-auto max-h-[45vh]">
                        <table className="relative max-w-full text-center text-md font-light w-full bg-white">
                          <thead className="dark:border-neutral-500 text-white z-40">
                            <tr>
                              <th
                                
                                className="bg-[#005734] sticky top-0 whitespace-nowrap px-6 py-2"
                              >
                                #
                              </th>
                              <th
                                
                                className="bg-[#005734] sticky top-0 whitespace-nowrap px-6 py-2"
                              >
                                Place Name
                              </th>
                              <th
                                
                                className="bg-[#005734] sticky top-0 whitespace-nowrap px-6 py-2"
                              >
                                Address
                              </th>
                              <th
                                
                                className="bg-[#005734] sticky top-0 whitespace-nowrap px-6 py-2"
                              >
                                Mobile Number
                              </th>
                              <th
                                
                                className="bg-[#005734] sticky top-0 whitespace-nowrap px-6 py-2"
                              >
                                Region
                              </th>
                            </tr>
                          </thead>
                          <tbody className="-z-50">
                            {surveys.length >= 1 ? (
                              surveys.map((data, index) => (
                                <tr
                                  key={data.index}
                                  className="border-black border-b"
                                >
                                  <td className="px-6 py-4 font-medium">
                                    {index + 1}
                                  </td>
                                  <td className="px-6 py-4">{data.place_name}</td>
                                  <td className="px-6 py-4">{data.address}</td>

                                  <td className="px-6 py-4">{data.phone}</td>

                                  <td className="font-bold px-6 py-4">
                                    {data.searchRegion}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <>
                                <tr
                                  //key={data.index}
                                  className="border-black border-b"
                                >
                                  <td className="whitespace-nowrap  px-6 py-4 font-medium"></td>
                                  <td className="whitespace-nowrap  px-6 py-4"></td>
                                  <td className="px-6 py-4 font-semibold text-md">
                                    You did not add any location.
                                  </td>

                                  <td className="whitespace-nowrap  px-6 py-4"></td>

                                  <td className="whitespace-nowrap  px-6 py-4"></td>
                                </tr>




                                
                              </>






                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-between h-full">
                        <div className="flex flex-col items-center justify-center w-6/12 bg-white border-black border-b h-full">
                          <div className="flex items-center justify-center w-full text-white bg-[#005734] py-2">
                            <h2 className="font-bold">Set Survey Type</h2>
                          </div>

                          <div className="flex flex-col space-y-2 mt-4 my-8 w-full">
                            {surveys.length >= 1 ? (
                              <div className="flex items-center justify-between w-full space-x-1 ">
                                <div className="w-5/12">
                                  <div class="flex items-center">
                                    <input
                                      id="default-radio-2"
                                      type="radio"
                                      value="regional"
                                      checked={surveyType === "regional"}
                                      onChange={handleRadioChange}
                                      name="default-radio"
                                      class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 focus:ring-2"
                                    />
                                    <label
                                      for="default-radio-2"
                                      class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      <span className="font-bold">Region:</span>{" "}
                                      Only People in regions of the selected
                                      locations can take the Survey :{" "}
                                      {uniqueRegions.map((item, index) => (
                                        <span key={index} className="font-bold">
                                          {item},
                                        </span>
                                      ))}
                                    </label>
                                  </div>
                                </div>
                                <div className="w-5/12">
                                  <div class="flex items-center">
                                    <input
                                      id="default-radio-1"
                                      type="radio"
                                      value="global"
                                      checked={surveyType === "global"}
                                      onChange={handleRadioChange}
                                      name="default-radio"
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                      for="default-radio-1"
                                      class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      <span className="font-bold">Global:</span>{" "}
                                      Anyone can take the survey
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-center items-center">
                                <p className="font-semibold text-md text-center">
                                  Survey is automatically set to{" "}
                                  <span className="font-bold ">Global</span>{" "}
                                  (anyone can take the survey)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col w-5/12 bg-white border-black border-b h-stretch">
                          <div className="flex items-center justify-center w-full text-white bg-[#005734] py-2">
                            <h2 className="font-bold text-center ">
                              Enter Participant Limit for the Survey
                            </h2>

                          </div>
                          <div className="flex items-center justify-center w-full h-full">
                            <input
                              type="number"
                              name="numofParticipants"
                              value={numOfParticipants}
                              onChange={(e) =>
                                setNumOfParticipants(e.target.value)
                              }
                              placeholder=""
                              className="w-[100px] h-4/6 bg-[#D9D9D9] text-xl outline-none pl-[20px]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full">
                        <button
                          onClick={handleDone}
                          // className="w-[100px] mx-1 h-[40px] font-serif font-semibold bg-[#005734] opacity-80 hover:opacity-100 text-[white] rounded-md"
                          className={`w-full h-[32px] font-serif font-semibold bg-[#005734] ${!numOfParticipants.trim()
                              ? "opacity-60 cursor-not-allowed"
                              : "opacity-80 hover:opacity-100"
                            } text-[white]`}
                          disabled={!numOfParticipants.trim()}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>

          </div>


        </div>
      </main>
    </Layout>
  );
};

export default FinalizeSample;
