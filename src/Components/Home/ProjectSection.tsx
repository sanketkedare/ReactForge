"use client";

import React, { useContext } from "react";
import ProjectList from "@/data/Projects.json";
import ProjectCart from "./ProjectCart";
import { motion } from "framer-motion";
import { BiSolidCollection } from "react-icons/bi";
import { TheamContext } from "@/context/TheamContextComponent";
import { ProjectItem } from "@/types";

export const ProjectSection: React.FC = () => {
  const { theme } = useContext(TheamContext);
  const projects = ProjectList as ProjectItem[];

  return (
    <div
      className="relative border-b-2 rounded-b-xl"
      style={{ background: theme.background, borderColor: theme.text }}
    >
      {/* Project List Section */}
      <h2
        style={{ background: theme.background, borderColor: theme.text }}
        className="sticky lg:text-2xl top-0 text-xl flex justify-center items-center gap-4 text-center py-6 lg:h-[70px] h-[70px] font-bold border-b-2 rounded-t-xl hover:text-yellow-400 z-30 rounded-b-3xl"
      >
        <BiSolidCollection />
        Task Collection
      </h2>
      <div className="p-4 grid lg:grid-cols-4 grid-cols-2 gap-2">
        {projects.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProjectCart item={item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSection;
