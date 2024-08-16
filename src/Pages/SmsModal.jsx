// import axios from "axios";
// import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
// import { useState, useEffect } from "react";

// const SmsModal = () => {
//   return  <>
//       <Button onClick={() => setOpenModal(true)} className="bg-black">
//         Send Survey To Email
//       </Button>
//       <Modal
//         show={openModal}
//         size="md"
//         onClose={onCloseModal}
//         className="z-50"
//         popup
//       >
//         <Modal.Header />
//         <Modal.Body>
//           <div className="space-y-6">
//             <h3 className="text-xl font-medium text-gray-900 dark:text-white">
//               List Of SMS To Send Survey to
//             </h3>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="email" value="Your email" />
//               </div>
//               <input
//                 id="email"
//                 placeholder="name@company.com"
//                 value={email}
//                 className="h-12 px-4 w-full rounded-md mt-3 outline-none"
//                 onChange={(event) => setEmail(event.target.value)}
//                 required
//               />
//               <Button onClick={handleAddEmail} className="mt-8">
//                 Add Email
//               </Button>
//             </div>

//             {/* <ul>
//               {emailList.map((email, index) => (
//                 <li key={index} className="text-white">
//                   {email}
//                 </li>
//               ))}
//             </ul> */}
//             <ul>
//               {surveyList.map((item, index) => (
//                 <li key={index} className="text-white">
//                   {item.email}
//                 </li>
//               ))}
//             </ul>
//             {loading ? (
//               <div className="w-full mt-8 flex justify-between">
//                 <Button onClick={handleSendSurvey} disabled>
//                   Processing
//                 </Button>
//                 <Button onClick={onCloseModal} disabled>
//                   Cancel
//                 </Button>
//               </div>
//             ) : (
//               <div className="w-full mt-8 flex justify-between">
//                 <Button onClick={handleSendSurvey}>Send Survey</Button>
//                 <Button onClick={onCloseModal}>Cancel</Button>
//               </div>
//             )}
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>

// };

// export default SmsModal;

import axios from "axios";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";

const SmsModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const [sms, setSms] = useState("");
  const [smsList, setSmsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Retrieve sms list from session storage
    const storedSmsList = JSON.parse(sessionStorage.getItem("smsList"));
    if (storedSmsList) {
      setSmsList(storedSmsList);
    }
  }, []);

  function onCloseModal() {
    setOpenModal(false);
    setSms("");
  }

  function handleAddSms() {
    if (sms.trim() !== "") {
      setSmsList([...smsList, sms.trim()]);
      setSms("");
    }
  }

  const handleSendSms = async () => {
    setLoading(true);
    const formData = {
      sms_list: smsList,
    };
    try {
      // Your API endpoint for sending SMS
      const response = await axios.post(
        `https://your-api-endpoint.com/send-sms`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("SMS response:", response);
    } catch (error) {
      console.log("Error:", error);
    }
    setLoading(false);
    // Clear smsList after sending
    setSmsList([]);
    onCloseModal();
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)} className="bg-black">
        Send SMS
      </Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              List Of SMS To Send
            </h3>
            <div>
              <Label htmlFor="sms" value="Your SMS" />
              <input
                id="sms"
                placeholder="Enter SMS message"
                value={sms}
                className="h-12 px-4 w-full rounded-md mt-3 outline-none"
                onChange={(event) => setSms(event.target.value)}
                required
              />
              <Button onClick={handleAddSms} className="mt-8">
                Add SMS
              </Button>
            </div>

            <ul>
              {smsList.map((sms, index) => (
                <li key={index} className="text-white">
                  {sms}
                </li>
              ))}
            </ul>

            {loading ? (
              <div className="w-full mt-8 flex justify-between">
                <Button onClick={handleSendSms} disabled>
                  Processing
                </Button>
                <Button onClick={onCloseModal} disabled>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="w-full mt-8 flex justify-between">
                <Button onClick={handleSendSms}>Send SMS</Button>
                <Button onClick={onCloseModal}>Cancel</Button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SmsModal;
