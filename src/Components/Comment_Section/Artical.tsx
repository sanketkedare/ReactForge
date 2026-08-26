"use client";

import React, { useEffect, useRef, useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";
import { FaRegCommentAlt } from "react-icons/fa";
import { artical } from "./utils";
import { FcDislike, FcLike } from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import useGenrateId from "../To-Do_List/useGenrateId";
import { Person, CommentItem } from "@/types";

interface ArticalProps {
  currentPerson: Person;
}

export const Artical: React.FC<ArticalProps> = ({ currentPerson }) => {
  const [likes, setLikes] = useState<number[]>([]);
  const [disLikes, setDisLikes] = useState<number[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const liked = () => {
    const isLiked = likes.includes(currentPerson.id);
    const isDisliked = disLikes.includes(currentPerson.id);

    setLikes(
      isLiked
        ? likes.filter((id) => id !== currentPerson.id)
        : [...likes, currentPerson.id]
    );

    if (isDisliked) {
      setDisLikes(disLikes.filter((id) => id !== currentPerson.id));
    }
  };

  const disLiked = () => {
    const isDisliked = disLikes.includes(currentPerson.id);
    const isLiked = likes.includes(currentPerson.id);

    setDisLikes(
      isDisliked
        ? disLikes.filter((id) => id !== currentPerson.id)
        : [...disLikes, currentPerson.id]
    );

    if (isLiked) {
      setLikes(likes.filter((id) => id !== currentPerson.id));
    }
  };

  const addComment = () => {
    if (commentRef.current && commentRef.current.value.trim()) {
      const obj: CommentItem = {
        id: useGenrateId(),
        person: currentPerson,
        text: commentRef.current.value.trim(),
      };

      setComments((prevComments) => [...prevComments, obj]);
      commentRef.current.value = "";
    }
  };

  const deleteComment = (id: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
  };

  useEffect(() => {
    setCommentOpen(false);
  }, [currentPerson]);

  return (
    <div className="w-3/4 lg:px-5 px-2">
      <div className="border p-4 my-3 rounded-xl bg-white text-black">
        <p className="text-right italic lg:text-sm text-[10px]">
          {artical.date}
        </p>
        <h1 className="lg:text-2xl font-bold">{artical.title}</h1>
        <p className="italic text-sm text-yellow-600 mt-2">
          Tags: {artical.tags.join(", ")}
        </p>
        <p className="my-2 text-wrap">{artical.content}</p>
        <h2 className="text-right">~ {artical.author}</h2>

        <div className="w-full p-3 flex items-center lg:gap-10 select-none">
          {/* Like button */}
          <div
            className="flex gap-2 items-center px-3 cursor-pointer"
            onClick={liked}
          >
            {likes.includes(currentPerson.id) ? (
              <FcLike className="text-xl" />
            ) : (
              <BiLike className="hover:text-red-700 text-xl" />
            )}
            {likes.length}
          </div>

          {/* Dislike button */}
          <div
            className="flex gap-2 items-center px-3 cursor-pointer"
            onClick={disLiked}
          >
            {disLikes.includes(currentPerson.id) ? (
              <FcDislike className="text-xl" />
            ) : (
              <BiDislike className="hover:text-sky-700 text-xl" />
            )}
            {disLikes.length}
          </div>

          {/* Comments toggle button */}
          <div
            className="flex gap-2 items-center px-3 cursor-pointer"
            onClick={() => setCommentOpen((prev) => !prev)}
            aria-label="Toggle comments"
          >
            <FaRegCommentAlt className="hover:text-yellow-700 text-lg" />
            {comments.length}
          </div>
        </div>

        {/* Comment section */}
        {commentOpen && (
          <div className="mt-2 border border-black rounded-xl p-2">
            <h1 className="font-bold">Comments</h1>
            <div className="p-2 my-2">
              <textarea
                className="w-full border border-black p-2 rounded-xl text-black"
                placeholder="Enter your comment..."
                ref={commentRef}
              />
              <button
                onClick={addComment}
                className="bg-sky-500 hover:bg-sky-600 text-black p-2 rounded-xl border border-black font-bold w-full transition-colors"
                aria-label="Submit comment"
              >
                Submit
              </button>
            </div>

            {/* Display comments */}
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {comments.map((comment) => (
                <div
                  className="border p-3 relative rounded-lg bg-gray-50"
                  key={comment.id}
                >
                  <span className="font-bold py-2 lg:text-xl">
                    {comment.person.name}
                  </span>
                  <br />
                  <span className="text-right italic text-sm text-gray-600">
                    ~ {comment.person.occupation}
                  </span>
                  <p className="text-lg text-wrap text-justify mt-1">
                    {comment.text}
                  </p>

                  {/* Delete comment button */}
                  {currentPerson.id === comment.person.id && (
                    <MdDelete
                      className="absolute top-5 right-5 cursor-pointer text-red-500 hover:text-red-700 text-2xl"
                      onClick={() => deleteComment(comment.id)}
                      aria-label="Delete comment"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Artical;
