import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";




//views
import Search from "../components/Sidebar/Search.jsx";

// components

import Sidebar from "../components/Sidebar/Sidebar.jsx";


export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64">
        <div className="px-4 md:px-10 mx-auto w-full">
          <Outlet/>
        </div>
      </div>
    </>
  );
}
