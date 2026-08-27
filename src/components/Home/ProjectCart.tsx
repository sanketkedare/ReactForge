"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { TheamContext } from "@/context/TheamContextComponent";
import { ProjectItem } from "@/types";

interface ProjectCartProps {
  item: ProjectItem;
}

export const ProjectCart: React.FC<ProjectCartProps> = ({ item }) => {
  const { theme } = useContext(TheamContext);

  return (
    <div
      style={{ borderColor: theme.text }}
      className="relative lg:w-[300px] lg:h-[550px] h-[55vh] my-4 m-auto bg-yellow-200 rounded-xl bg-opacity-20 hover:bg-opacity-25 border flex flex-col justify-between"
    >
      {/* Project Title and Description */}
      <div className="p-4 overflow-y-auto">
        <h1
          style={{ borderColor: theme.text }}
          className="font-bold lg:text-[27px] text-[13px] border-b lg:py-4 py-2 text-center"
        >
          {item.name}
        </h1>
        <p className="lg:mt-5 mt-2 lg:text-lg text-[12px]">{item.des}</p>
      </div>

      {/* Navigation Button */}
      <div className="p-4">
        <Link href={`/${item.path}`}>
          <button className="lg:text-xl text-[12px] lg:p-4 p-2 w-full bg-yellow-400 text-black font-bold rounded-xl hover:bg-sky-500 transition-colors">
            Go to Project
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCart;
