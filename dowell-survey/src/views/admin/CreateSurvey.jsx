import React from "react";
import dowelllogo from "../../assets/img/qr.png"

// components

export default function CreateSurvey() {

  const [second, setSecond] = React.useState(false);


  return (
    <>
      {second ?
        <div className="relative flex flex-col min-w-0 break-words w-2/3 my-6 shadow-xl shadow-zinc-400 rounded-lg bg-white border-0 mx-auto" >
          <div className="rounded-t mb-0 px-6 py-6">
            <div className="text-center">
              <h6 className="text-blueGray-700 text-xl font-bold">Qr code created Successfully</h6>
            </div>
            <div>
            <img class="w-1/3 h-auto mx-auto my-4 rounded" style={{ maxHeight: "150px" }} src={dowelllogo} alt="Default avatar"></img>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form>

              <div className=" mt-3 flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                <div className="relative mb-3 flex flex-wrap justify-between">
                <input
                    type="text"
                    className="relative m-0 block w-1/2 flex-auto bg-[#D9D9D9] px-3 py-[0.25rem]"
                    placeholder="Enter Email..." />

                   <button
                    className="bg-[#FF3131] ml-3 w-1/3 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                  >
                    Send Email
                  </button>

                </div>
                </div>
                <div className="w-full lg:w-12/12 px-4">
                <div className="relative mb-3 flex flex-wrap justify-between">
                <input
                    type="text"
                    className="relative m-0 block w-1/2 flex-auto bg-[#D9D9D9] px-3 py-[0.25rem]"
                    placeholder="Enter Number..." />

                   <button
                    className="bg-[#FF3131] ml-3 w-1/3 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                  >
                    Send Sms
                  </button>

                </div>
                </div>

                <div className="w-full lg:w-12/12 px-4">
                  <button
                    className="bg-[#FF3131] text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {setSecond(true);} }
                  >
                    Send Sms and Email
                  </button>
                </div>


              </div>
            </form>
          </div>
        </div>
        :
        <div className="relative flex flex-col min-w-0 break-words w-2/3 my-6 shadow-xl shadow-zinc-400 rounded-lg bg-white border-0 mx-auto" >
          <div className="rounded-t mb-0 px-6 py-6">
            <div className="text-center">
              <h6 className="text-blueGray-700 text-xl font-bold">Create New Survey</h6>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form>

              <div className=" mt-3 flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      BRAND NAME
                    </label>
                    <input
                      type="text"
                      className="border-2 border-zinc-300 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full"
                      defaultValue="Enter the name of your brand"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Survey Link
                    </label>
                    <input
                      type="uel"
                      className="border-2 border-zinc-300 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full"
                      defaultValue="link to survey form"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Country
                    </label>
                    <select id="country" name="country" autocomplete="country-name" className="block w-full border-2 border-zinc-300 py-1.5 shadow-sm">
                      <option>Select country</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                </div>
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Region
                    </label>
                    <select id="country" name="country" autocomplete="country-name" className="block w-full border-2 border-zinc-300 py-1.5 shadow-sm">
                      <option>Select Region</option>
                      <option>Toronto</option>
                      <option>New Haven</option>
                    </select>
                  </div>
                </div>
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Product
                    </label>
                    <select id="country" name="country" autocomplete="country-name" className="block w-full border-2 border-zinc-300 py-1.5 shadow-sm">
                      <option>Select Product</option>
                      <option>Workflow Ai</option>
                      <option>Team Management</option>
                    </select>
                  </div>

                </div>
                <div className="w-full lg:w-12/12 px-4">
                <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Start and end date
                    </label>
                <div className="relative mb-3 flex flex-wrap justify-between">
                  
                <input
                    type="date"
                    className="relative m-0 block w-1/3 mr-2 flex-auto bg-[#D9D9D9] px-3 py-[0.25rem]"
                    placeholder="Enter Number..." />
                    <input
                    type="date"
                    className="relative m-0 block w-1/3 ml-2 flex-auto bg-[#D9D9D9] px-3 py-[0.25rem]"
                    placeholder="Enter Number..." />



                </div>
                </div>
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      PROMOTIONAL MESSAGE
                    </label>
                    <textarea
                      type="text"
                      className="border-2 border-zinc-300 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full"
                      defaultValue="Enter a promotional message for the product"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full lg:w-12/12 px-4">
                  <button
                    className="bg-[#FF3131] text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {setSecond(true);} }
                  >
                    Create Survey
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>}

    </>
  );
}
