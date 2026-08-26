"use client";

import React, { useContext } from "react";
import { TheamContext } from "./TheamContextComponent";
import { MdWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";
import { motion } from "framer-motion";
import { themeMotion } from "@/components/Home/utils";

export const Theam: React.FC = () => {
  const { theme, changeTheme } = useContext(TheamContext);

  return (
    <motion.div
      style={{ borderColor: theme.text }}
      className="absolute z-10 lg:top-28 top-28 right-10 lg:w-[50px] lg:h-[50px] w-[30px] h-[30px] rounded-xl border lg:p-2 p-1 flex justify-center items-center cursor-pointer select-none"
      onClick={changeTheme}
      {...themeMotion}
    >
      {theme.name === "Dark" ? (
        <MdWbSunny className="text-3xl text-yellow-400" />
      ) : (
        <FaMoon className="text-3xl text-gray-800" />
      )}
    </motion.div>
  );
};

export default Theam;
