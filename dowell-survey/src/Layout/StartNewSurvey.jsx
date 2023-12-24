import { useState } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";

const StartNewSurvey = () => {
  const [startDate, setStartDate] = useState(getCurrentDate());

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return (
    <Layout>
      <div className="min-h-screen flex justify-end">
        <div className="flex flex-col items-center justify-center gap-6 w-full px-4 sm:px-0 md:w-[80%] ">
          <input
            type="file"
            id="firstName"
            name="firstName"
            placeholder=""
            className="w-full sm:w-[40%]"
          />

          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="enter your name"
            className="border-2 w-full sm:w-[40%] p-1 border-[#B3B4BB] rounded-[5px] outline-none"
          />

          <select className="border-2 w-full sm:w-[40%] p-1 border-[#B3B4BB] rounded-[5px] outline-none">
            <option value="">Select products/services</option>
            <option value="option1">Product 1</option>
            <option value="option2">Product 2</option>
            <option value="option3">Product 3</option>
          </select>

          <textarea
            id="description"
            name="promotional sentence"
            placeholder="Enter a promotional sentence to attract participants in (15 words)"
            className="h-24 resize-none border-2 w-full sm:w-[40%] p-1 border-[#B3B4BB] rounded-[5px] outline-none"
          />

          <div className="flex justify-center gap-3">
            <div className="flex flex-col justify-center items-center">
              <p className="text-[#005734] text-center font-serif text-sm font-bold">
                Start Date
              </p>
              <input
                type="date"
                className="bg-[#C4C4C4] rounded-md py-2 px-2 text-center text-xs font-medium"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="text-[#005734] text-center font-serif text-sm font-bold">
                End Date
              </p>
              <input
                type="date"
                className="bg-[#C4C4C4] rounded-md  py-2 px-2 text-center text-xs font-medium"
              />
            </div>
          </div>

          <Link to="/finalize-Sample">
            <button
              type="button"
              className="w-[400px] h-[50px] font-serif p-2 font-bold text-center bg-[#005734] opacity-80 hover:opacity-100 text-[16px] md:text-[20px] rounded-md text-white cursor-pointer"
            >
              Create Survey Campaign
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default StartNewSurvey;
