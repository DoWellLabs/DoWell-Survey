import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import EmailSmsModal from "./EmailSmsModal";

// Define the options for countries and regions
const options = {
  countries: {
    option1: "Country 1",
    option2: "Country 2",
    option3: "Country 3",
    // Add more countries here
  },
  regions: {
    option1: "Region 1",
    option2: "Region 2",
    option3: "Region 3",
    // Add more regions here
  },
};

// eslint-disable-next-line react/prop-types
const NewSurvey = ({ closeModal }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // Store selected countries and regions

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleCreateSurvey = () => {
    setModalOpen(true);
  };
  const closeBothModals = () => {
    closeModal();
    setModalOpen(false);
  };

  const addCountryAndRegion = () => {
    if (selectedCountry && selectedRegion) {
      // Add the selected country and region to the list
      setSelectedItems([
        ...selectedItems,
        {
          country: options.countries[selectedCountry],
          region: options.regions[selectedRegion],
        },
      ]);

      // Clear the selectedCountry and selectedRegion
      setSelectedCountry("");
      setSelectedRegion("");
    }
  };

  return (
    <div className="">
      {isModalOpen ? (
        <div className="New-Survey-modal-container h-[95vh] w-[90vw] md:w-[40vw]  pt-[2rem]">
          <EmailSmsModal closeBothModals={closeBothModals} />
        </div>
      ) : (
        <form className="New-Survey-modal-container h-[95vh] w-[90vw] md:w-[40vw] pt-[2rem]">
          <input
            type="file"
            id="firstName"
            name="firstName"
            placeholder=""
            className="w-[15rem] h-[2rem]"
          />

          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="enter your name"
            className="w-4/5 md:w-[25rem] h-[2rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
            style={{ paddingLeft: "1rem" }}
          />

          <select
            className="w-4/5 md:w-[25rem] h-[2rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
            style={{ paddingLeft: "1rem" }}
          >
            <option value="">Select products/services</option>
            <option value="option1">Product 1</option>
            <option value="option2">Product 2</option>
            <option value="option3">Product 3</option>
          </select>

          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="https//:your link.com"
            className="w-4/5 md:w-[25rem] h-[2rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
            style={{ paddingLeft: "1rem" }}
          />

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-4/5 md:w-[25rem] h-[2rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
            style={{ paddingLeft: "1rem" }}
          >
            <option value="">Select country/countries</option>
            <option value="option1">Country 1</option>
            <option value="option2">Country 2</option>
            <option value="option3">Country 3</option>
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-4/5 md:w-[25rem] h-[2rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
            style={{ paddingLeft: "1rem" }}
          >
            <option value="">Select region/regions</option>
            <option value="option1">Region 1</option>
            <option value="option2">Region 2</option>
            <option value="option3">Region 3</option>
          </select>

          <input
            type="number"
            id="participants"
            name="participants"
            placeholder="Number of Participants"
            className="w-4/5 md:w-[25rem] h-[2rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
            style={{ paddingLeft: "1rem" }}
          />

          <div className=" bg-[#556155] rounded-md w-4/5 md:w-[25rem] p-1 flex justify-center items-center gap-2 ">
            <button
              onClick={addCountryAndRegion}
              type="button"
              className="border border-black rounded-md p-2 text-center w-1/2 sm:w-1/3 text-[12px] font-serif font-bold hover:bg-[#005734] opacity-80 hover:opacity-100 hover:text-white"
            >
              Add More
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2 w-full max-h-14 overflow-y-auto">
              {selectedItems.map((item, index) => (
                <div
                  key={index}
                  className="text-xs bg-slate-200 rounded-md p-1 font-serif"
                >
                  {item.country} , {item.region}
                </div>
              ))}
            </div>
          </div>

          <textarea
            id="description"
            name="promotional sentence"
            placeholder="Enter a promotional sentence to attract participants in (15 words)"
            className="w-4/5 md:w-[25rem] h-24 resize-none border-2 border-[#B3B4BB] rounded-[5px] outline-none"
            style={{ paddingLeft: "1rem" }}
          />

          <div className="flex justify-center">
            <div className="">
              <p className="text-[#005734]  font-serif text-sm font-bold">
                Start Date
              </p>
              <input
                type="date"
                className="bg-[#C4C4C4] rounded-md py-2 px-2 text-center w-[90%] text-xs font-medium"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="">
              <p className="text-[#005734]  font-serif text-sm font-bold">
                End Date
              </p>
              <input
                type="date"
                className="bg-[#C4C4C4] rounded-md  py-2 px-2 text-center w-[90%] text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateSurvey}
            className="w-4/5 md:w-[25rem] mt-[10px] h-[50px] font-serif font-semibold text-black text-center bg-[#005734] opacity-80 hover:opacity-100 text-[16px] md:text-[20px] rounded-[12px] hover:text-white cursor-pointer"
          >
            Create Survey Campaign
          </button>

          <button
            className="close-modal-btn rounded-md hover:bg-[#005734] text-xl p-1"
            onClick={closeModal}
            type="button"
          >
            <FaTimes />
          </button>
        </form>
      )}
    </div>
  );
};

export default NewSurvey;
