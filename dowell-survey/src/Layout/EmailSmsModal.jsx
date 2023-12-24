import { FaTimes } from "react-icons/fa";
import QRCode from "react-qr-code";

// eslint-disable-next-line react/prop-types
const EmailSmsModal = ({ closeBothModals }) => {
  return (
    <div className="">
      <div className="flex flex-col gap-5">
        <div className="flex justify-center items-center">
          <QRCode
            size={150}
            bgColor="white"
            fgColor="black"
            value="https://uxlivinglab.com/"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 text-left rounded-lg px-2 pb-1 border shadow-xl ">
            <h3 className="font-serif font-bold text-md">Email </h3>

            <div className="flex gap-4">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                className="w-4/5 md:w-[20rem] h-[2.5rem] border-2 border-[#B3B4BB] rounded-[5px] outline-none"
                style={{ paddingLeft: "1rem" }}
              />
              <div className="flex justify-center items-center">
                <button className="w-16 h-7 font-serif font-semibold text-black hover:text-white opacity-80 hover:opacity-100 hover:scale-105 text-center bg-[#176847] text-md rounded-md cursor-pointer">
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-left rounded-lg px-2 pb-1 border shadow-xl">
            <h3 className="font-serif font-bold text-md">SMS</h3>

            <div className="flex gap-4">
              <input
                type="number"
                id="sms"
                name="sms"
                placeholder="Enter phone number"
                className="w-4/5 md:w-[20rem] h-[2.5rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
                style={{ paddingLeft: "1rem" }}
              />
              <div className="flex justify-center items-center">
                <button className="w-16 h-7 font-serif font-semibold text-black hover:text-white opacity-80 hover:opacity-100 hover:scale-105 text-center bg-[#176847] text-md rounded-md cursor-pointer">
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-left rounded-lg px-2 pb-1 border shadow-xl">
            <h3 className=" font-serif font-bold text-md">Email & SMS</h3>

            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  className="w-4/5 md:w-[20rem] h-[2.5rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
                  style={{ paddingLeft: "1rem" }}
                />
                <input
                  type="number"
                  id="sms"
                  name="sms"
                  placeholder="Enter phone number"
                  className="w-4/5 md:w-[20rem] h-[2.5rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
                  style={{ paddingLeft: "1rem" }}
                />
              </div>

              <div className="flex justify-center w-1/3 items-center">
                <button className="w-16 h-7 font-serif font-semibold text-black hover:text-white opacity-80 hover:opacity-100 hover:scale-105 text-center bg-[#176847] text-md rounded-md cursor-pointer">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="close-modal-btn rounded-md hover:bg-[#005734] text-xl p-1"
        onClick={closeBothModals}
        type="button"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default EmailSmsModal;
