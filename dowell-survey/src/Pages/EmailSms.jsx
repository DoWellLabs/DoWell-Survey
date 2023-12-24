import QRCode from "react-qr-code";
import Layout from "../Layout/Layout";
export const EmailSms = () => {
  return (
    <Layout>
      <div className="px-4 md:px-10 mt-[26px] md:pl-80 flex flex-col gap-5">
        <div className="flex flex-col justify-center items-center gap-5">
          <div className="flex justify-center items-center">
            <QRCode
              size={170}
              bgColor="white"
              fgColor="black"
              value="https://uxlivinglab.com/"
            />
          </div>

          <div className="flex flex-col gap-3 py-">
            <div className="flex flex-col gap-2 text-left rounded-lg p-2 border shadow-xl ">
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

            <div className="flex flex-col gap-2 text-left rounded-lg p-2 border shadow-xl">
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

            <div className="flex flex-col gap-2 text-left rounded-lg p-2 border shadow-xl">
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
        <div className="flex justify-center items-center">
          <button className="p-2 w-1/3 font-serif font-semibold text-white opacity-80 hover:opacity-100 bg-[#176847] text-md rounded-md cursor-pointer">
            Add Survey
          </button>
        </div>
      </div>
    </Layout>
  );
};
