import { useGlobalContext } from "../Context/PreviewContext";
const RadiusSlider = ({ radius, onRadiusChange, disabled }) => {
  const { sliderValue, handleRadiusChange, inputData } = useGlobalContext();
  return (
    <div className="grid">
      <div style={{ position: "relative", width: "100%" }}>
        {/* Slider Label */}
        <div
          style={{
            position: "absolute",
            left: `calc(${(radius / 15000) * 100}% - 25px)`,
            transform: "translateX(-50%)",
            top: "40px",
            background: "#fff",
            padding: "2px 5px",
            borderRadius: "3px",
            border: "1px solid #ccc",
            fontSize: "12px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {inputData.radius2} m
        </div>
        <h2 className="font-semibold text-white text-center mb-4">
          Set Distance (m) from Location's Center:
        </h2>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={sliderValue}
          disabled={disabled}
          onChange={(e) => handleRadiusChange(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default RadiusSlider;

{
  /* <h2 className="font-semibold text-white text-center">
                  Set Distance (m) from Location's Center
                </h2>
                <div className="flex flex-col items-center space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="15000"
                    value={inputData.radius1}
                    className="w-[80%] bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
                    onChange={(e) =>
                      setInputData((prevData) => ({
                        ...prevData,
                        radius1: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                  <div className="flex justify-between w-[80%]">
                    <span className="text-white">
                      {inputData.radius1} meters
                    </span>
                  </div>
                </div> */
}

{
  /* <div>
                <h2 className="font-semibold text-white text-center">
                  Set Distance(m) from Location's Center
                </h2>
                <div className="flex justify-center space-x-1">
                  <input
                    type="text"
                    className="w-[21vh] bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
                    placeholder="From"
                    value={inputData.radius1}
                    onChange={(e) =>
                      setInputData((prevData) => ({
                        ...prevData,
                        radius1: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                  <input
                    type="text"
                    className="w-[21vh] bg-[#D9D9D9] px-3 py-[0.25rem] outline-none"
                    placeholder="To"
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
              </div> */
}
