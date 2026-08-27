"use client";

import React, { useState } from "react";
import DiwaliLightsComponent from "./DiwaliLightsComponent";

export const DiwaliLights: React.FC = () => {
  const [startShow, setStartShow] = useState<boolean>(false);
  const [pauseShow, setPauseShow] = useState<boolean>(false);

  return (
    <div className="w-[80%] px-1 mt-10 m-auto">
      <h1 className="font-bold lg:text-3xl text-center mt-10 lg:w-full w-[80%] m-auto text-wrap">
        Diwali Lights Management System
      </h1>

      <div className="lg:w-2/3 m-auto border lg:mt-20 mt-10 p-4 rounded-xl">
        {/* Display two DiwaliLightsComponent instances for different light patterns */}
        {Array.from({ length: 2 }, (_, index) => (
          <DiwaliLightsComponent
            key={index}
            startShow={startShow}
            pauseShow={pauseShow}
          />
        ))}

        {/* Buttons to control the show */}
        <div className="flex justify-center gap-3 my-3 flex-wrap">
          {startShow && (
            <button
              className="p-2 m-2 w-[150px] bg-orange-500 hover:bg-orange-600 rounded-xl text-black font-bold transition-colors"
              onClick={() => setPauseShow((prev) => !prev)}
            >
              {pauseShow ? "Resume" : "Pause"} Show
            </button>
          )}

          <button
            className="p-2 m-2 w-[150px] bg-orange-500 hover:bg-orange-600 rounded-xl text-black font-bold transition-colors"
            onClick={() => setStartShow((prev) => !prev)}
          >
            {startShow ? "End" : "Start"} Show
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiwaliLights;
