"use client";

import React from "react";
import { GiM3GreaseGun } from "react-icons/gi";

interface SingleGunProps {
  type: string;
  shots: number;
  message: string;
}

export const SingleGun: React.FC<SingleGunProps> = ({ type, shots, message }) => {
  return (
    <div className="min-h-[150px] my-6">
      <h2 className="font-bold bg-yellow-400 text-black lg:w-[200px] w-[150px] p-2 my-2 text-center rounded-xl">
        {type}
      </h2>
      <p className="text-sm text-gray-400">{message}</p>
      <div className="flex items-center lg:gap-10 my-2 flex-wrap">
        <GiM3GreaseGun className="lg:text-[100px] text-[70px] mx-5 text-center text-yellow-400" />
        <span className="font-bold bg-sky-300 text-black p-4 text-sm rounded-xl lg:w-[300px] text-center shadow">
          Bullets shot: {shots}
        </span>
      </div>
    </div>
  );
};

export default SingleGun;
