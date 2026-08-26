"use client";

import React, { useState } from "react";
import PeopleData from "./People.json";
import Artical from "./Artical";
import { Person } from "@/types";

const people = PeopleData as Person[];

export const Comment: React.FC = () => {
  const [currentPerson, setCurrentPerson] = useState<Person>(
    people[0] || { id: 1, name: "Aarav Mehta", occupation: "Software Engineer" }
  );

  return (
    <div className="lg:w-[80%] lg:mt-5 mt-14 m-auto">
      <h1 className="lg:text-3xl text-xl font-semibold text-center">
        Comments Section
      </h1>
      <hr className="mt-4" />
      <div className="mt-5 w-full min-h-[80vh] flex">
        {/* Render the article for the currently selected user */}
        <Artical currentPerson={currentPerson} />

        <div className="p-5 w-1/4 border rounded-xl flex gap-1 flex-wrap justify-evenly overflow-auto">
          <h3 className="w-full lg:text-xl text-center lg:h-10 font-bold">Users</h3>

          {/* Map through the list of users to create user selection buttons */}
          {people.map((person) => (
            <div
              className={`cursor-pointer hover:bg-white hover:text-black lg:w-[100px] border m-1 rounded-xl flex items-center justify-center transition-colors ${
                currentPerson.id === person.id ? "bg-yellow-500 text-black" : ""
              }`}
              key={person.id}
              onClick={() => setCurrentPerson(person)}
              aria-label={`Select ${person.name}`}
            >
              <p className="text-center font-semibold lg:w-[100px] w-[80px] p-2 text-sm">
                {person.name.split(" ")[0]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;
