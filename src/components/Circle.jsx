import React from "react";

const Circle = ({ width = "50px", height = "50px", center }) => {
  return (
    <div
      className="bg-blue-500/50  transition"
      style={{
        transition: "all 0.2s",
        position: "absolute", 
        left: "50%",
        top: "50%",
        width,
        height,
        borderRadius: "50%",
        transform: "translate(-50%, -50%)", 
        transformOrigin: "center",
      }}
    ></div>
  );
};

export default Circle;
