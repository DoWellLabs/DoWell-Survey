import React from "react";
import { Link } from "react-router-dom"
import dowelllogo from "../../assets/img/dowell.jpg"

export default function LandingPage() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-black flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">


          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/"
          >
            <img class="w-full h-auto rounded" style={{ maxHeight: "150px" }} src={dowelllogo} alt="Default avatar"></img>
          </Link>
          <div
            className=
            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1"
          >


            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center my-1">
                <Link
                  className="bg-green-500 text-center text-lg py-1 font-bold block text-white hover:text-red-500"
                  to="/admin/create"
                >
                  Create Survey
                </Link>
              </li>
            </ul>

            <ul className="md:flex-col md:min-w-full mt-56 flex flex-col list-none">
              <li className="items-center my-1">
                <Link
                  className="bg-red-500 text-center text-lg py-1 font-bold block text-white hover:text-red-500"
                  to="/admin/search"
                >
                  My Surveys
                </Link>
              </li>
              <li className="items-center my-1">
                <Link
                  className="bg-gray-400 text-center text-lg py-1 font-bold block text-white hover:text-red-500"
                  to="/admin/dashboard"
                >
                  Settings/Privacy
                </Link>
              </li>
              <li className="items-center my-1">
                <Link
                  className="bg-gray-400 text-center text-lg py-1 font-bold block text-white hover:text-red-500"
                  to="/admin/dashboard"
                >
                  Log Out
                </Link>
              </li>
            </ul>

          </div >
        </div >
      </nav >
    </>
  );
}