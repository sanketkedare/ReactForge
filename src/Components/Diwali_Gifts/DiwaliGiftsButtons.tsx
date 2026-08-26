"use client";

import React, { useState, useEffect } from "react";
import { useAssignGift } from "./myHooks";
import { GiftPerson } from "@/types";

interface DiwaliGiftsButtonsProps {
  names: GiftPerson[];
  setNames: React.Dispatch<React.SetStateAction<GiftPerson[]>>;
}

export const DiwaliGiftsButtons: React.FC<DiwaliGiftsButtonsProps> = ({
  names,
  setNames,
}) => {
  const [assigned, setAssigned] = useState<boolean>(false);

  const assignGifts = () => {
    if (names.length === 0) {
      alert("Please add at least one person first!");
      return;
    }

    const checkGift = (i: GiftPerson): GiftPerson => {
      if (i.gifts === "No Gifts Assigned") {
        return {
          ...i,
          gifts: useAssignGift(),
        };
      }
      return i;
    };

    if (assigned) {
      alert("You have already assigned Gifts");
    } else {
      setAssigned(true);
      setNames(names.map((i) => checkGift(i)));
    }
  };

  const resetGifts = () => {
    setNames(
      names.map((i) => ({
        ...i,
        gifts: "No Gifts Assigned",
      }))
    );
    setAssigned(false);
  };

  const shuffleGifts = () => {
    if (!assigned) {
      alert("Please Assign Gifts first");
      return;
    }
    setNames(
      names.map((i) => ({
        ...i,
        gifts: useAssignGift(),
      }))
    );
    setAssigned(true);
  };

  useEffect(() => {
    setAssigned(false);
  }, [names.length]);

  return (
    <div className="my-2 p-2 flex flex-wrap justify-evenly gap-2">
      <button
        className="p-2 m-2 w-[250px] bg-sky-500 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors"
        onClick={assignGifts}
      >
        Assign Gifts
      </button>
      <button
        className="p-2 m-2 w-[250px] bg-red-400 hover:bg-red-800 hover:text-white text-black font-bold rounded-xl transition-colors"
        onClick={shuffleGifts}
      >
        Shuffle Gifts
      </button>
      <button
        className="p-2 m-2 w-[250px] bg-gray-400 hover:bg-white text-black font-bold rounded-xl transition-colors"
        onClick={resetGifts}
      >
        Reset
      </button>
    </div>
  );
};

export default DiwaliGiftsButtons;
