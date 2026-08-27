"use client";

import React, { useEffect, useState } from "react";
import { PostItem } from "@/types";

interface SinglePostProps {
  item: PostItem;
  handlerOpenPost: (id: number | "ALL") => void;
  openPost: number | "ALL" | null;
}

export const SinglePost: React.FC<SinglePostProps> = ({
  item,
  handlerOpenPost,
  openPost,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(openPost === "ALL");
  }, [openPost]);

  return (
    <div
      className={`${
        openPost === item.id ? "bg-sky-300 text-black" : ""
      } my-3 border p-3 rounded-xl lg:px-6 cursor-pointer w-[380px] ${
        isOpen ? "min-h-[160px]" : "h-[70px] overflow-hidden"
      } text-left transition-all duration-200`}
      onClick={() => handlerOpenPost(item.id)}
    >
      <h1
        className={`text-sm font-bold capitalize ${
          openPost === item.id ? "text-black" : "text-yellow-300"
        } text-wrap`}
      >
        {item.id} ] {item.title}
      </h1>
      {isOpen && (
        <p className={`my-2 text-sm ${openPost === item.id ? "text-gray-900" : "text-gray-300"}`}>
          {item.body}
        </p>
      )}
    </div>
  );
};

export default SinglePost;
