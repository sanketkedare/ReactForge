"use client";

import React, { useEffect, useState } from "react";
import SinglePost from "./SinglePost";
import { PostItem } from "@/types";

export const FetchPosts: React.FC = () => {
  const [showData, setShowData] = useState<boolean>(false);
  const [data, setData] = useState<PostItem[]>([]);
  const [openPost, setOpenPost] = useState<number | "ALL" | null>(null);
  const [current, setCurrent] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const API = "https://jsonplaceholder.typicode.com/posts";

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const json: PostItem[] = await res.json();
      setData(json);
      setShowData(true);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const removePosts = () => {
    setShowData(false);
    setOpenPost(null);
  };

  const handlerOpenPost = (id: number | "ALL") => {
    if (id === openPost) {
      setOpenPost(null);
    } else {
      setOpenPost(id === "ALL" ? "ALL" : id);
    }
  };

  useEffect(() => {
    if (typeof openPost === "number" && openPost > 0) {
      setCurrent(data.find((item) => item.id === openPost) || null);
    } else {
      setCurrent(null);
    }
  }, [openPost, data]);

  return (
    <div className="lg:mt-10 mt-16 w-[80%] m-auto text-center">
      <h1 className="text-center lg:text-3xl font-bold">Fetch Posts</h1>
      {!showData ? (
        <button
          className="lg:text-xl bg-yellow-400 text-black p-2 my-4 rounded-xl hover:bg-sky-300 font-bold w-[200px] m-auto transition-colors"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Data"}
        </button>
      ) : (
        <div className="flex justify-between my-4 gap-2 flex-wrap">
          <button
            className="lg:text-xl bg-red-600 text-white p-2 rounded-xl hover:bg-white hover:text-black font-bold lg:w-[200px] transition-colors"
            onClick={removePosts}
          >
            Close All
          </button>

          <button
            className={`lg:text-xl ${
              openPost === "ALL" ? "bg-gray-700" : "bg-sky-600"
            } text-white p-2 rounded-xl hover:bg-white hover:text-black font-bold lg:w-[200px] transition-colors`}
            onClick={() => handlerOpenPost("ALL")}
          >
            {openPost === "ALL" ? "Hide ALL" : "Show All"}
          </button>
        </div>
      )}

      {showData && (
        <div className="grid lg:grid-cols-3 grid-cols-1 min-h-[60vh] gap-4">
          {typeof openPost === "number" && openPost > 0 && current && (
            <div className="col-span-1 border lg:h-[60vh] h-[40vh] w-full p-4 rounded-xl bg-white text-gray-700 overflow-y-auto shadow-lg text-left">
              <h1 className="lg:text-2xl text-lg uppercase font-bold text-sky-700 border-b pb-2">
                {current.id} ] {current.title}
              </h1>
              <p className="mt-4 lg:text-lg text-sm text-gray-800 leading-relaxed">
                {current.body}
              </p>
            </div>
          )}

          <div
            className={`flex flex-wrap justify-evenly ${
              typeof openPost === "number" && openPost > 0
                ? "col-span-2"
                : "col-span-3"
            } max-h-[80vh] overflow-y-auto gap-2`}
          >
            {data.length <= 0
              ? "Please Wait..."
              : data.map((item) => (
                  <SinglePost
                    item={item}
                    key={item.id}
                    handlerOpenPost={handlerOpenPost}
                    openPost={openPost}
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchPosts;
