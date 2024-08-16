import { useGlobalContext } from "../Context/PreviewContext";
import CountryDropdown from "../components/Dropdown/CountryDropdownTemp";
import LocationDropdown from "../components/Dropdown/LocationDropdownTemp";
import Category from "../components/CategoriesTemp";
import PropTypes from "prop-types";

export default function MySurveys({ loading }) {
  const { setInputData, inputData } = useGlobalContext();
  return (
    <>
      <div className="px-8 md:pl-[310px] w-full">
      <div className="items-center flex justify-between flex-wrap">
              <h1 className=" text-[#737373] text-3xl font-bold pt-1 pb-3 no-underline">
                DoWell Surveys
              </h1>
               <h6 className=" text-[#288437] text-sm font-bold pb-0 no-underline">
                Samantha will do surveys in 150000 locations worldwide
              </h6> 
            </div>
            <div className="h-1 bg-[#A6A6A6]"></div>

      </div>
      <div className="px-8 mt-[40px] md:pl-[310px] flex flex-col space-y-4 xl:space-y-0 xl:flex-row xl:justify-between w-full xl:space-x-8">

        <div className="xl:w-8/12 flex flex-col space-y-4 xl:space-y-0 xl:flex-row xl:justify-between w-full xl:space-x-4">
          <div className="xl:w-6/12 flex flex-col space-y-2">
          <CountryDropdown loading={loading} />
         
            <LocationDropdown loading={loading} country={inputData.country} />
           

          </div>

          <div className="xl:w-6/12 flex flex-col space-y-2">
            <div className="w-full h-[33px] bg-[#FF3131] flex items-center justify-center">
              <p className="text-center w-full font-semibold text-white">Select distance from center of location</p>
            </div>
            <div className="w-full flex justify-between space-x-2">
            <div className="relative mb-4 flex flex-wrap items-stretch">
                      <span className="flex items-center px-1 py-[0.25rem] font-bold text-center text-white text-sm bg-[#FF3131]">
                        From
                      </span>
                      <input
                        type="text"
                        className="relative m-0 block w-24 flex-auto bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
                        placeholder="Meters"
                        value={inputData.radius1}
                        onChange={(e) =>
                          setInputData((prevData) => ({
                            ...prevData,
                            radius1: e.target.value,
                          }))
                        }
                        disabled={loading}
                      />
                    </div>
                    <div className="relative mb-4 flex flex-wrap items-stretch">
                      <span className="flex items-center px-1 py-[0.25rem] font-bold text-center text-white text-sm bg-[#FF3131]">
                        To
                      </span>
                      <input
                        type="text"
                        className="relative m-0 block w-24 flex-auto bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
                        placeholder="Meters"
                        value={inputData.radius2}
                        onChange={(e) =>
                          setInputData((prevData) => ({
                            ...prevData,
                            radius2: e.target.value,
                          }))
                        }
                        disabled={loading}
                      />
                    </div>


            </div>
          </div>

        </div>
        <div className="xl:w-4/12 h-[74px] bg-black">
        <Category loading={loading} />
        </div>

      </div>

    </>
  );
}

MySurveys.propTypes = {
  loading: PropTypes.bool.isRequired,
};
