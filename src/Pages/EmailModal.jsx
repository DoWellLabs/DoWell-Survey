import axios from "axios";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmailModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState([]);
  const surveyData = sessionStorage.getItem("surveyData") || "[]";
  const surveyData1 = JSON.parse(surveyData);
  const numOfParticipant = sessionStorage.getItem("numOfParticipants");
  const [regionValue, setRegionValue] = useState("");
  const getQrcode = sessionStorage.getItem("Qrcode");
  const [loading, setLoading] = useState(false);
  const [surveyList, setSurveyList] = useState(
    JSON.parse(sessionStorage.getItem("surveyArray")) || []
  );

  useEffect(() => {
    // Retrieve email list from session storage
    const storedEmailList = JSON.parse(sessionStorage.getItem("emailList"));
    if (storedEmailList) {
      setEmailList(storedEmailList);
    }
  }, []);

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

  const userInfo = JSON.parse(sessionStorage.getItem("user_info"));
  const userEmail = userInfo.email;
  const userName = userInfo.first_name;
  function handleAddEmail() {
    if (email.trim() !== "") {
      setSurveyList([...surveyList, { email: email.trim(), name: userName }]);
      setEmail("");
    }
  }
  const handleSendSurvey = async () => {
    setLoading(true);
    console.log("this is survey email", surveyList);
    if (surveyList.length === 0) {
      console.error("Survey list is empty");
      return; // Optionally, you can provide a response or perform additional actions
    }

    const regionArray = JSON.parse(sessionStorage.getItem("region")) || []; // Retrieve region array from sessionStorage

    // Join the array elements with a comma to form a single string
    const regionValue = regionArray.join(", ");

    // If the regionArray is empty, you can set a default value
    const defaultRegionValue = "all";
    const name = sessionStorage.getItem("surveyName");

    const formData = {
      to_email_list: surveyList,
      fromname: userName,
      fromemail: userEmail,
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
      This is to confirm that your survey, <strong>${name ? name : ""}</strong>,
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
          <strong>${
            regionArray.length > 0 ? regionValue : defaultRegionValue
          } Region's</strong>
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
      const response = await axios.post(
        `https://100085.pythonanywhere.com/api/dowell_bulk_email/?api_key=4f0bd662-8456-4b2e-afa6-293d4135facf`,
        JSON.stringify(formData), // Convert formData to JSON string
        {
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );
      setLoading(false);
      // setSurveyList("");
      toast.success("Email Sent Successfully", {
        onClose: () => {},
      });
    } catch (error) {
      setLoading(false);
      toast.success("Email was not sent", {
        onClose: () => {},
      });
      console.log(error);
    }
    console.log("Sending survey to:", emailList);
    setEmailList([]);
    // Optionally, you can store emailList in session storage again
    sessionStorage.setItem("emailList", JSON.stringify(emailList));
    onCloseModal();
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)} className="bg-black">
        Send Survey To Email
      </Button>
      <Modal
        show={openModal}
        size="md"
        onClose={onCloseModal}
        className="z-50"
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              List Of Emails To Send Survey to
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <input
                id="email"
                placeholder="name@company.com"
                value={email}
                className="h-12 px-4 w-full rounded-md mt-3 outline-none"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Button onClick={handleAddEmail} className="mt-8">
                Add Email
              </Button>
            </div>
            <ul>
              {surveyList.map((item, index) => (
                <li key={index} className="text-white">
                  {item.email}
                </li>
              ))}
            </ul>
            {loading ? (
              <div className="w-full mt-8 flex justify-between">
                <Button onClick={handleSendSurvey} disabled>
                  Processing
                </Button>
                <Button onClick={onCloseModal} disabled>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="w-full mt-8 flex justify-between">
                <Button onClick={handleSendSurvey}>Send Survey</Button>
                <Button onClick={onCloseModal}>Cancel</Button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EmailModal;
