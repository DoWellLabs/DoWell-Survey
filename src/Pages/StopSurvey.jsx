import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const Stop = () => {
  const [surveyDatas, setSurveyDatas] = useState([]);
  const [surveyId, setSurveyId] = useState(null);
  const [qrcodeId, setQrcodeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getSurvey = async () => {
    setLoading(true);
    try {
      const user_info = sessionStorage.getItem("user_info");
      const userInfo = JSON.parse(user_info);
      const response = await axios.post(
        `https://100025.pythonanywhere.com/my-survey/`,
        {
          username: userInfo.email,
        }
      );

      const currentDate = new Date().setHours(0, 0, 0, 0);

      // Filter objects where end_date is after or equal to the current date
      const filteredSurveys = response.data.slice(1).filter((survey) => {
        const endDate = new Date(survey.end_date);
        console.log("the end date is", endDate);
        console.log("current date is", currentDate);
        return endDate >= currentDate;
      });
      setLoading(false);
      setSurveyDatas(filteredSurveys);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getSurvey();
  }, []);

  const stopSurvey = async () => {
    try {
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
        onClose: () => {},
      });
    } catch (error) {
      setLoading(false);
      console.error("Error stopping survey:", error);
      toast.success("Survey Can't be stopped", {
        onClose: () => {},
      });
    }
    closeModal();
  };

  const openModal = (surveyId, qrcodeId) => {
    setSurveyId(surveyId);
    setQrcodeId(qrcodeId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSurveyId(null);
    setQrcodeId(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div
            className="m-12 inline-block h-16 w-16 animate-spin text-green-800 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main>
        <div className="px-4 md:px-10 md:pl-[310px]">
          <div className="">
            <div className="min-w-full max-h-[calc(100vh-64px)] overflow-y-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="h-20 bg-[#005734]">
                    <th className="px-2 py-3  text-left text-xs leading-4 font-medium text-white text-bold uppercase tracking-wider">
                      Survey Name
                    </th>
                    <th className="px-3 py-3  text-left text-xs leading-4 font-medium text-white text-bold uppercase tracking-wider">
                      Survey Link
                    </th>
                    <th className="px-3 py-3  text-left text-xs leading-4 font-medium text-white text-bold uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-3 py-3  text-left text-xs leading-4 font-medium text-white text-bold uppercase tracking-wider">
                      Stop Survey
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {surveyDatas.map((survey, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-gray-100" : "bg-blue-100"
                      }
                    >
                      <td className="px-2 py-4 whitespace-no-wrap">
                        {survey.name}
                      </td>
                      <td className="px-4 py-4 whitespace-no-wrap">
                        {survey.link}
                      </td>
                      <td className="px-2 py-4 whitespace-no-wrap">
                        {survey.end_date}
                      </td>
                      <td
                        className="px-2  py-4 whitespace-no-wrap text-sm bg-red-600 h-[40px] flex justify-center text-white rounded-md items-center cursor-pointer mt-2"
                        onClick={() => openModal(survey.id, survey.qrcode_id)}
                      >
                        Stop Survey
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Stop Survey"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "300px", // Adjust the width as needed
          },
        }}
      >
        <div>
          <p>Are you sure you want to stop this survey?</p>
          <div className="w-full h-full flex justify-between mt-5">
            <button
              onClick={stopSurvey}
              className="w-20 h-10 bg-red-800 text-white flex justify-center items-center"
            >
              Yes
            </button>
            <button
              onClick={closeModal}
              className="w-20 h-10 bg-green-800 text-white flex justify-center items-center"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Stop;
