"use client";

import React, { useState } from "react";
import { GiftPerson } from "@/types";

interface DiwaliGiftsAddPersonProps {
  names: GiftPerson[];
  setNames: React.Dispatch<React.SetStateAction<GiftPerson[]>>;
}

export const DiwaliGiftsAddPerson: React.FC<DiwaliGiftsAddPersonProps> = ({
  names,
  setNames,
}) => {
  const [name, setName] = useState<string>("");

  const addPerson = () => {
    if (!name.trim()) return;
    const obj: GiftPerson = {
      name: name.trim(),
      gifts: "No Gifts Assigned",
    };
    setNames([...names, obj]);
    setName("");
  };

  return (
    <div className="my-5 p-2">
      <h2 className="my-2 font-bold lg:text-xl">Add person here</h2>
      <input
        type="text"
        className="p-3 my-2 lg:w-[500px] w-full rounded-xl text-black"
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        onKeyDown={(e) => {
          if (e.key === "Enter") addPerson();
        }}
      />
      <button
        className="lg:p-3 p-2 lg:m-2 bg-yellow-400 font-semibold rounded-xl text-black lg:w-[200px] w-full h-auto hover:bg-yellow-500 transition-colors"
        onClick={addPerson}
      >
        Add
      </button>
    </div>
  );
};

export default DiwaliGiftsAddPerson;
