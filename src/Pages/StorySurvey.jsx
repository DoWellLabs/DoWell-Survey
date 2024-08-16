import React, { useEffect, useState, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Layout from "../Layout/Layout";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MapPinIcon,
  PencilSquareIcon,
  QrCodeIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

Modal.setAppElement("#root");

const StopSurvey = () => {
  const [survey, setSurvey] = useState({});




  const [surveyDatas, setSurveyDatas] = useState([]);
  const [surveyId, setSurveyId] = useState(null);
  const [qrcodeId, setQrcodeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const cancelButtonRef = useRef(null);

  const getSurvey = async () => {
    setLoading(true);
    try {
      const user_info = sessionStorage.getItem("user_info");
      const userInfo = JSON.parse(user_info);
      const response = await axios.post(
        `https://100025.pythonanywhere.com/my-survey/`,
        {
          username: userInfo.username,
        }
      );

      const currentDate = new Date().setHours(0, 0, 0, 0);

      // Filter objects where end_date is after or equal to the current date
      const filteredSurveys = response.data.slice(1).filter((survey) => {
        const endDate = new Date(survey.end_date);
        return endDate >= currentDate;
      });
      setLoading(false);
      setSurveyDatas(filteredSurveys);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getOneSurveyStatus = async (survey) => {
    setStatusLoading(true);
    try {
      const id_response = await axios.post(
        `https://100025.pythonanywhere.com/get-dowell-survey-status/?api_key=1b834e07-c68b-4bf6-96dd-ab7cdc62f07f`,
        {
          link: `http://dontcare/DoWell-Survey/survey-iframe?survey_id=${survey.id}`,
          region: 'any',
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const no_participants = id_response?.data?.survey_data?.participantsLimit

      const participants = typeof no_participants === 'object' && no_participants !== null && !Array.isArray(no_participants)
        ? Object.values(no_participants)[0]
        : no_participants;

      console.log(
        "completed get survey and response is,",
        no_participants
      );


    } catch (error) {
      toast.error("Error fetching Status", {
        onClose: () => { },
      });


    }
    finally {
      setStatusLoading(false);
    }

  }

  useEffect(() => {
    getSurvey();
  }, []);

  const stopSurvey = async () => {
    try {
      closeModal();
      setLoading(true);
      const currentDate = new Date();

      // Subtract one day from the current date to get the new end date
      currentDate.setDate(currentDate.getDate() - 1);
      const day = currentDate.getDate().toString().padStart(2, "0"); // Get the day and pad with leading zero if needed
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Get the month (months are zero-based) and pad with leading zero if needed
      const year = currentDate.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      // Make an API call to stop the survey using the selectedSurveyId
      await axios.put(
        `https://100025.pythonanywhere.com/update-qr-codev2?api_key=dd7010c6-17b7-4cd4-ac70-f20492efa73e`,
        {
          id: surveyId,
          stop_survey: true,
          // end_date: currentDate.toISOString().split("T")[0],
          end_date: formattedDate,
        }
      );
      setLoading(false);
      setSurveyDatas((prevState) =>
        prevState.filter((survey) => survey.id !== surveyId)
      );
      toast.success("Survey Successfully Stopped", {
        onClose: () => { },
      });
    } catch (error) {
      setLoading(false);
      console.error("Error stopping survey:", error);
      toast.success("Survey Can't be stopped", {
        onClose: () => { },
      });
    }

  };

  const openModal = (surveyId, qrcodeId) => {
    setSurveyId(surveyId);
    setQrcodeId(qrcodeId);
    setModalType("delete");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSurveyId(null);
    setQrcodeId(null);
    setModalType(null);
    setIsModalOpen(false);
  };

  const openStatusModal = () => {
    setModalType("status");
    setIsModalOpen(true);

  }


  const closeStatusModal = () => {
    setSurvey({});
    setModalType(null);
    setIsModalOpen(false);
  }

  // if (loading) {
  //   return (
  //     <Layout>
  //       <div className="flex items-center justify-center h-full">
  //         <div
  //           className="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
  //           role="status"
  //         >
  //           <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
  //             Loading...
  //           </span>
  //         </div>
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      <main className="w-full">
        <div className="flex flex-col px-4 md:px-10 mt-[40px] md:pl-[310px] md:mt-0 h-screen pt-4 pb-1">
          <div className="px-2 items-center flex justify-Start bg-[#005734]">
            <h1 className=" text-white text-2xl font-bold pt-1 pb-3 no-underline">
              Stop Survey
            </h1>

          </div>
          <div className="flex h-full bg-[#EFF3F6]">
          <div className="inline-block py-6 w-full bg-[#EFF3F6]">
                  <div className="w-10/12 mx-auto overflow-x-auto flex flex-col space-y-8">
                    <div className="overflow-auto max-h-[85vh]">
                      {
                        loading ? (
                          <div className="flex items-center justify-center">
                            <div
                              className="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                              role="status"
                            >
                              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                Loading...
                              </span>
                            </div>
                          </div>

                        ) : (
                          <table className="max-w-full text-center text-sm font-light w-full bg-white">
                            <thead className="dark:border-neutral-500 text-white">
                              <tr>
                                <th
                                  scope="col"
                                  className="bg-[#005734] sticky top-0 whitespace-nowrap px-6 py-2"
                                >
                                  Survey Name
                                </th>
                                <th
                                  scope="col"
                                  className="bg-[#005734] sticky top-0 whitespace-nowrap px-6 py-2"
                                >
                                  Survey Link
                                </th>
                                <th
                                  scope="col"
                                  className="bg-[#005734] sticky top-0 whitespace-nowrap px-6 py-2"
                                >
                                  End Date
                                </th>
                                <th
                                  scope="col"
                                  className="bg-[#005734] sticky top-0 whitespace-nowrap px-6 py-2"
                                >
                                  Actions
                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {surveyDatas.map((survey, index) => (
                                <tr
                                  key={index}
                                  className="border-black border-b">
                                  <td className="px-6 py-4 font-medium">
                                    {survey.name}
                                  </td>
                                  <td className="break-all px-6 py-4">
                                    {survey.link}
                                  </td>
                                  <td className="px-6 py-4">
                                    {survey.end_date}
                                  </td>
                                  <td
                                    className="px-6 py-4"
                                  // onClick={() => openModal(survey.id, survey.qrcode_id)}
                                  >
                                    <div className="flex justify-between space-x-2">
                                      <button className="w-[120px] h-[30px] font-serif font-bold opacity-100 rounded-m hover:opacity-60 text-center text-sm md:text-md text-white bg-[#DC2626]"
                                        onClick={() => openModal(survey.id, survey.qrcode_id)}>
                                        Stop Survey
                                      </button>
                                      {/* <button className="w-[120px] h-[30px] font-serif font-bold opacity-100 rounded-m hover:opacity-60 text-center text-sm md:text-md text-white bg-[#005734]"
                                        onClick={() => {

                                          openStatusModal();
                                          getOneSurveyStatus(survey);
                                        }}>
                                        View Status
                                      </button> */}

                                    </div>


                                  </td>
                                </tr>
                              ))}

                            </tbody>
                          </table>

                        )
                      }

                    </div>
                  </div>
                </div>
          </div>
        </div>
      </main>

      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={closeModal}
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

                  {/* {modalType == "delete" ? (
                    <div className="flex flex-col items-center justify-center w-full">
                      <div
                        className="flex items-center justify-between w-full text-white bg-[#EF4444] text-xl">
                        <p className="font-bold m-4">STOP SURVEY</p>
                        <button
                          className="font-serif font-bold text-center m-4"
                          onClick={closeModal}
                        >
                          <XMarkIcon className="h-6 w-6 m-1" />
                        </button>
                      </div>

                      <div className="flex flex-col space-y-2 my-4 w-full">
                        <div className="w-full">
                          <p className="text-md font-semibold text-center">
                            Are you sure you want to stop this survey?
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-full my-4">
                        <div className="w-3/12"></div>
                        <div className="w-7/12 flex justify-center space-x-2">
                          <button
                            type="submit"
                            onClick={stopSurvey}

                            className="inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-[#EF4444]"
                          //onClick={() => setOpen(false)}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-[#EF4444] shadow-sm hover:bg-gray-50 border-2 border-[#EF4444]"
                            onClick={closeModal}
                            ref={cancelButtonRef}
                          >
                            No
                          </button>

                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full">
                      <div
                        className="flex items-center justify-between w-full text-white bg-[#005734] text-xl">
                        <p className="font-bold m-4">SURVEY STATUS</p>
                        <button
                          className="font-serif font-bold text-center m-4"
                          onClick={closeStatusModal}
                        >
                          <XMarkIcon className="h-6 w-6 m-1" />
                        </button>
                      </div>

                      {
                        statusLoading ? (
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

                        ) : (
                          <div>
                            now loaded
                          </div>

                        )
                      }
                    </div>
                  )} */}

                  <div className="flex flex-col items-center justify-center w-full">
                    <div
                      className="flex items-center justify-between w-full text-white bg-[#EF4444] text-xl">
                      <p className="font-bold m-4">STOP SURVEY</p>
                      <button
                        className="font-serif font-bold text-center m-4"
                        onClick={closeModal}
                      >
                        <XMarkIcon className="h-6 w-6 m-1" />
                      </button>
                    </div>

                    <div className="flex flex-col space-y-2 my-4 w-full">
                      <div className="w-full">
                        <p className="text-md font-semibold text-center">
                          Are you sure you want to stop this survey?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-full my-4">
                      <div className="w-3/12"></div>
                      <div className="w-7/12 flex justify-center space-x-2">
                        <button
                          type="submit"
                          onClick={stopSurvey}

                          className="inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-[#EF4444]"
                        //onClick={() => setOpen(false)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-[#EF4444] shadow-sm hover:bg-gray-50 border-2 border-[#EF4444]"
                          onClick={closeModal}
                          ref={cancelButtonRef}
                        >
                          No
                        </button>

                      </div>
                    </div>
                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>


    </Layout>
  );
};

export default StopSurvey;
