import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Layout from "../Layout/Layout";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  TrashIcon,
  PencilSquareIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
//import { FaTimes } from "react-icons/fa";
import QRCode from "react-qr-code";
import "./EditSurveyModal.css";

export default function Edit() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);

  const cancelButtonRef = useRef(null);

  const onLinkClick = () => {
    setOpen(true);
    setMode("link");
  };

  const onDeleteClick = () => {
    setOpen(true);
    setMode("delete");
  };

  const onPreviewClick = () => {
    setOpen(true);
    setMode("preview");
  };

  return (
    <Layout>
      <div className="px-4 md:px-10 mt-[26px] md:pl-[270px] flex flex-col gap-5">
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    {mode == "link" ? (
                      <div>
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
                            //value={selectedCountry}
                            //onChange={(e) => setSelectedCountry(e.target.value)}
                            className="w-4/5 md:w-[25rem] h-[2rem] border-2  border-[#B3B4BB] rounded-[5px] outline-none"
                            style={{ paddingLeft: "1rem" }}
                          >
                            <option value="">Select country/countries</option>
                            <option value="option1">Country 1</option>
                            <option value="option2">Country 2</option>
                            <option value="option3">Country 3</option>
                          </select>

                          <select
                            //value={selectedRegion}
                            //onChange={(e) => setSelectedRegion(e.target.value)}
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

                          <div className=" bg-[#7ED957] rounded-md w-4/5 md:w-[25rem] p-1 flex justify-center items-center gap-2 ">
                            <button
                              //onClick={addCountryAndRegion}
                              type="button"
                              className="border border-black rounded-md p-2 text-center w-1/2 sm:w-1/3 text-[12px] font-serif font-bold hover:bg-[#005734] hover:border-[#005734] hover:text-white"
                            >
                              Add More
                            </button>

                            {/* <div className="flex flex-wrap items-center justify-center gap-2 w-full max-h-14 overflow-y-auto">
                              {selectedItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="text-xs bg-slate-200 rounded-md p-1 font-serif"
                                >
                                  {item.country} , {item.region}
                                </div>
                              ))}
                            </div> */}
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
                                //value={startDate}
                                //onChange={(e) => setStartDate(e.target.value)}
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
                            //onClick={handleCreateSurvey}
                            className="w-4/5 md:w-[25rem] mt-[10px] h-[50px] font-serif font-bold text-black text-center bg-[#005734] opacity-80 hover:opacity-100 text-[16px] md:text-[20px] rounded-[12px] hover:text-white cursor-pointer"
                          >
                            Create Survey Campaign
                          </button>

                          <button
                            className="close-modal-btn rounded-md hover:bg-[#005734] text-xl p-1"
                            //onClick={closeModal}
                            type="button"
                          >
                            X
                          </button>
                        </form>
                      </div>
                    ) : mode == "delete" ? (
                      <div>
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                              <ExclamationTriangleIcon
                                className="h-6 w-6 text-red-600"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                              <Dialog.Title
                                as="h3"
                                className="text-base font-semibold leading-6 text-gray-900"
                              >
                                DELETE SURVEY
                              </Dialog.Title>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Are you sure you delete this survey?
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            onClick={() => setOpen(false)}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setOpen(false)}
                            ref={cancelButtonRef}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mx-auto my-8">
                          <div className="flex justify-center items-center">
                            <QRCode
                              size={170}
                              bgColor="white"
                              fgColor="black"
                              value="https://uxlivinglab.com/"
                            />
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setOpen(false)}
                            ref={cancelButtonRef}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="relative pb-32 pt-2 ">
          <div className="mx-4 items-center flex justify-between">
            <h1 className=" text-[#737373] text-3xl font-bold pt-1 pb-3 no-underline">
              My Surveys
            </h1>
            <h6 className=" text-[#288437] text-sm font-bold pb-0 no-underline">
              preview, edit and delete surveys
            </h6>
          </div>

          <div className="h-1 bg-[#A6A6A6]"></div>

          <div
            className={
              "relative flex flex-col min-w-0 break-words w-full mb-6 rounded bg-white my-4"
            }
          >
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <section className="bg-white">
                  <div className="container">
                    <div className="flex flex-wrap -mx-4">
                      <div className="w-full">
                        <div className="max-w-full overflow-x-auto">
                          <table className="table-auto w-full ">
                            <thead>
                              <tr className="bg-[#005734] text-center">
                                <th className=" w-1/6 font-serif min-w-[160px] font-semibold text-white py-4 lg:py-7 px-3 lg:px-4 border-l border-transparent ">
                                  BRAND NAME
                                </th>
                                <th className=" w-1/6 font-serif min-w-[160px] font-semibold text-white py-4 lg:py-7 px-3 lg:px-4 ">
                                  SURVEY LINK
                                </th>
                                <th className=" w-1/6 font-serif min-w-[160px] font-semibold text-white py-4 lg:py-7 px-3 lg:px-4 ">
                                  DURATION
                                </th>
                                <th className=" w-1/6 font-serif min-w-[160px] font-semibold text-white py-4 lg:py-7 px-3 lg:px-4 ">
                                  REGION
                                </th>
                                <th className=" w-1/6 font-serif min-w-[160px] font-semibold text-white py-4 lg:py-7 px-3 lg:px-4 ">
                                  STATUS
                                </th>
                                <th className=" w-1/6 font-serif min-w-[160px] font-semibold text-white py-4 lg:py-7 px-3 lg:px-4 border-r border-transparent ">
                                  ACTIONS
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                  WORKFLOW AI
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-[#E8E8E8]">
                                  https://docs.go....
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-[#E8E8E8] ">
                                  30/05/23-12/12/23(144 days)
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-[#E8E8E8] ">
                                  Canada, London
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-[#E8E8E8] ">
                                  <div className="mx-4 my-2 p-0.5 rounded-sm font-serif text-sm bg-[#22C55E] text-white">
                                    ONGOING
                                  </div>
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-r border-[#E8E8E8] mx-auto ">
                                  <div className="flex items-center justify-center">
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-[#005734] p-3"
                                      data-ripple-light="true"
                                      onClick={onLinkClick}
                                    >
                                      <PencilSquareIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-[#EF4444] p-3"
                                      data-ripple-light="true"
                                      onClick={onDeleteClick}
                                    >
                                      <TrashIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-blue-500 p-3"
                                      data-ripple-light="true"
                                      onClick={onPreviewClick}
                                    >
                                      <QrCodeIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                  SMANANTHA
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-[#E8E8E8]">
                                  https://docs.go....
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-[#E8E8E8] ">
                                  22/11/23-12/12/23(32 days)
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-[#E8E8E8] ">
                                  Singapore, Nigeria
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-[#E8E8E8] ">
                                  <div className="mx-4 my-2 p-0.5 rounded-sm font-serif text-sm bg-orange-500 text-white">
                                    PENDING
                                  </div>
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-r border-[#E8E8E8] mx-auto ">
                                  <div className="flex items-center justify-center">
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-[#005734] p-3"
                                      data-ripple-light="true"
                                      onClick={onLinkClick}
                                    >
                                      <PencilSquareIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-[#EF4444] p-3"
                                      data-ripple-light="true"
                                      onClick={onDeleteClick}
                                    >
                                      <TrashIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-blue-500 p-3"
                                      data-ripple-light="true"
                                      onClick={onPreviewClick}
                                    >
                                      <QrCodeIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                  BAKERY AND FOODS
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-[#E8E8E8]">
                                  https://docs.go....
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-[#E8E8E8] ">
                                  05/02/22-02/12/23(311 days)
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-[#E8E8E8] ">
                                  Pakistan, Sweden
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-[#E8E8E8] ">
                                  <div className="mx-4 my-2 p-0.5 rounded-sm font-serif text-sm bg-[#EF4444] text-white">
                                    ENDED
                                  </div>
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-r border-[#E8E8E8] mx-auto ">
                                  <div className="flex items-center justify-center">
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-[#005734] p-3"
                                      data-ripple-light="true"
                                      onClick={onLinkClick}
                                    >
                                      <PencilSquareIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-[#EF4444] p-3"
                                      data-ripple-light="true"
                                      onClick={onDeleteClick}
                                    >
                                      <TrashIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-blue-500 p-3"
                                      data-ripple-light="true"
                                      onClick={onPreviewClick}
                                    >
                                      <QrCodeIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                  WORKFLOW AI
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-[#E8E8E8]">
                                  https://docs.go....
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-[#E8E8E8] ">
                                  30/05/23-12/12/23(144 days)
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-[#E8E8E8] ">
                                  Canada, London
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-[#E8E8E8] ">
                                  <div className="mx-4 my-2 p-0.5 rounded-sm font-serif text-sm bg-[#22C55E] text-white">
                                    ONGOING
                                  </div>
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-r border-[#E8E8E8] mx-auto ">
                                  <div className="flex items-center justify-center">
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-[#005734] p-3"
                                      data-ripple-light="true"
                                      onClick={onLinkClick}
                                    >
                                      <PencilSquareIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-[#EF4444] p-3"
                                      data-ripple-light="true"
                                      onClick={onDeleteClick}
                                    >
                                      <TrashIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-blue-500 p-3"
                                      data-ripple-light="true"
                                      onClick={onPreviewClick}
                                    >
                                      <QrCodeIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                  WORKFLOW AI
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-[#E8E8E8]">
                                  https://docs.go....
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-[#E8E8E8] ">
                                  30/05/23-12/12/23(144 days)
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-[#E8E8E8] ">
                                  Canada, London
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-[#E8E8E8] ">
                                  <div className="mx-4 my-2 p-0.5 rounded-sm font-serif text-sm bg-[#22C55E] text-white">
                                    ONGOING
                                  </div>
                                </td>
                                <td className=" text-center text-dark font-medium text-base py-5 px-2 bg-white border-b border-r border-[#E8E8E8] mx-auto ">
                                  <div className="flex items-center justify-center">
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-[#005734] p-3"
                                      data-ripple-light="true"
                                      onClick={onLinkClick}
                                    >
                                      <PencilSquareIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-[#EF4444] p-3"
                                      data-ripple-light="true"
                                      onClick={onDeleteClick}
                                    >
                                      <TrashIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button
                                      className="mr-2 flex items-center justify-center rounded-lg bg-blue-500 p-3"
                                      data-ripple-light="true"
                                      onClick={onPreviewClick}
                                    >
                                      <QrCodeIcon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
