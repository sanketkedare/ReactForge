"use client";

import React, { useContext } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import { introMotion } from "./utils";
import { TheamContext } from "@/context/TheamContextComponent";

export const LINKEDIN_URL = "https://www.linkedin.com/in/sanket-kedare-5820401bb/";
export const GITHUB_URL = "https://github.com/sanketkedare/React-Tasks";

export const Introduction: React.FC = () => {
  const { theme } = useContext(TheamContext);

  return (
    <motion.div className="h-screen flex items-start mx-10" {...introMotion}>
      <div className="lg:w-[70%] w-full lg:mt-4 mt-14">
        <motion.p
          className={`lg:text-[20px] italic ${
            theme.name === "Dark" ? "text-yellow-500" : "text-yellow-900"
          } my-10 font-bold`}
        >
          Hey, Confused Fresher!
        </motion.p>
        <p className="text-[30px] my-10">
          Learning Completed, But What&apos;s Next?
        </p>
        <h1 className="lg:text-[90px] text-[40px] italic my-10">
          Here is a
          <span className="text-red-500 font-semibold not-italic">
            {" "}One-Stop{" "}
          </span>
          solution for Beginners!
        </h1>
        <div className="flex lg:gap-10 gap-3 z-20 mt-10">
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:text-sm text-[12px] h-[50px] flex items-center justify-center shadow-inner border rounded-xl gap-3 p-3 bg-gray-900 hover:bg-gray-800 lg:w-[200px] w-[350px] font-bold text-white transition-colors"
          >
            <FaGithub />
            GitHub Code
          </Link>

          <Link
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shadow-sm lg:text-sm text-[12px] h-[50px] flex items-center justify-center border rounded-xl gap-3 p-3 bg-gray-900 hover:bg-gray-800 lg:w-[200px] w-[350px] font-bold text-white transition-colors"
          >
            <FaLinkedin className="text-sky-300 bg-black rounded-sm" />
            <span>Sanket Kedare</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Introduction;
