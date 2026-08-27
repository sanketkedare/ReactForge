"use client";

import React from "react";
import { GiftPerson } from "@/types";

interface DiwaliGiftsTableProps {
  names: GiftPerson[];
  setNames: React.Dispatch<React.SetStateAction<GiftPerson[]>>;
}

export const DiwaliGiftsTable: React.FC<DiwaliGiftsTableProps> = ({
  names,
  setNames,
}) => {
  const removePerson = (name: string) =>
    setNames(names.filter((i) => i.name !== name));

  return (
    <table className="my-5 border w-full rounded-xl overflow-hidden">
      <thead className="p-2 border bg-sky-200 text-black">
        <tr>
          <th className="p-2 text-start w-1/3">Name</th>
          <th className="p-2 w-1/3">Gift</th>
          <th className="p-2">Remove</th>
        </tr>
      </thead>
      <tbody>
        {names && names.length > 0 ? (
          names.map((person) => (
            <tr key={person.name} className="border-b border-gray-700">
              <td className="p-2">{person.name}</td>
              <td className="p-2 text-center">{person.gifts}</td>
              <td className="p-2 text-center">
                <button
                  className="hover:bg-red-600 hover:text-white p-2 m-auto bg-red-200 rounded-xl text-black font-bold lg:w-[150px] transition-colors"
                  onClick={() => removePerson(person.name)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="p-4 text-center text-gray-400 italic">
              No persons added yet. Add someone above!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DiwaliGiftsTable;
