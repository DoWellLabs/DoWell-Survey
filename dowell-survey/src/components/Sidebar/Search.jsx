import React from "react";


export default function Search() {
  return (
    <>
      <div className="relative md:pt-32 pb-32 pt-12 ">
        <div className="mx-4 items-center flex justify-between">
          <h1 className=" text-[#737373] text-3xl font-bold pt-1 pb-3 no-underline">
            DoWell Surveys
          </h1>
          <h6 className=" text-[#288437] text-sm font-bold pb-0 no-underline">
            Samantha will do surveys in 150000 locations worldwide
          </h6>

        </div>

        <div className="h-1 bg-[#A6A6A6]"></div>

        <div className="mt-4 flex justify-between">
          <div className="w-full">
            <div class="">

              <div className="mt-2">
                <select id="country" name="country" autocomplete="country-name" className="block font-bold text-white w-full border-0 outline-none py-1.5 shadow-sm sm:text-sm sm:leading-6 bg-[#FF3131]">
                  <option>Select country</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>
            <div class="">

              <div class="mt-2">
                <select id="country" name="country" autocomplete="country-name" className="block font-bold text-white w-full border-0 outline-none py-1.5 shadow-sm sm:text-sm sm:leading-6 bg-[#FF3131]">
                  <option>Select location</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>
          </div>
          <div className="w-full mx-4 sm:mx-none">

              <div className="mt-2 h-8 bg-[#FF3131] flex flex-col justify-center items-center">
                <h6 className="text-center font-bold text-white text-sm">
                  Select distance from center of location
                </h6>

              </div>
              <div class="mt-2 items-center flex justify-between flex-wrap">
                <div className="relative mb-4 flex flex-wrap items-stretch">
                  <span
                    className="flex items-center px-1 py-[0.25rem] font-bold text-center text-white text-sm bg-[#FF3131]"
                  >From</span>
                  <input
                    type="text"
                    className="relative m-0 block w-24 flex-auto bg-[#D9D9D9] px-3 py-[0.25rem]"
                    placeholder="Meters" />
                </div>
                <div className="relative mb-4 flex flex-wrap items-stretch">
                  <span
                    className="flex items-center px-1 py-[0.25rem] font-bold text-center text-white text-sm bg-[#FF3131]"
                  >From</span>
                  <input
                    type="text"
                    className="relative m-0 block w-24 flex-auto bg-[#D9D9D9] px-3 py-[0.25rem]"
                    placeholder="Meters" />
                </div>

              </div>
          </div>
          <div className="w-full">
            <div className="mt-2">
              <select id="country" name="country" autocomplete="country-name" className="h-12 block font-bold text-white w-full border-0 outline-none py-1.5 shadow-sm sm:text-sm sm:leading-6 bg-[#FF3131]">
                <option>Select category</option>
                <option>Workflow Ai</option>
                <option>Living labs Maps</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
