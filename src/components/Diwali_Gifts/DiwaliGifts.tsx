"use client";

import React, { useState } from "react";
import DiwaliGiftsTable from "./DiwaliGiftsTable";
import DiwaliGiftsButtons from "./DiwaliGiftsButtons";
import DiwaliGiftsAddPerson from "./DiwaliGiftsAddPerson";
import { GiftPerson } from "@/types";

export const DiwaliGifts: React.FC = () => {
  const [names, setNames] = useState<GiftPerson[]>([]);

  return (
    <div className="lg:w-[80%] m-auto mt-10">
      <h1 className="lg:text-3xl text-xl text-center font-bold">Diwali Gifts</h1>

      {/* Component to add a new person */}
      <DiwaliGiftsAddPerson names={names} setNames={setNames} />

      {/* Table displaying added persons and their gifts */}
      <DiwaliGiftsTable names={names} setNames={setNames} />

      {/* Buttons for assigning, shuffling, and resetting gifts */}
      <DiwaliGiftsButtons names={names} setNames={setNames} />
    </div>
  );
};

export default DiwaliGifts;
