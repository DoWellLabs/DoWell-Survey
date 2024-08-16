import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const ModalPopUp = () => {
  const [openModal, setOpenModal] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    // Save the email to sessionStorage
    sessionStorage.setItem("email", email);
    navigate("/"); // Navigate to the desired page after submitting the email
  };

  return (
    <>
      <Modal show={openModal} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 bg-black p-6 text-white rounded-sm">
            {/* <div className="space-y-6 bg-blue-900 p-6 text-white rounded-sm"> */}
            <h3 className="text-xl font-medium">Sign in to our platform</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEmailSubmit();
              }}
            >
              <div>
                <label htmlFor="email">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="h-12 px-4 w-full rounded-md mt-3 outline-none"
                  placeholder="user@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="text-red-500">{error}</p>}
              </div>
              <div className="w-full mt-4">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalPopUp;
