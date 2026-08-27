"use client";

import React from "react";
import { BsDatabaseDash } from "react-icons/bs";
import { TodoItem, TodoProgress } from "@/types";

interface SingleTodoProps {
  task: TodoItem;
  changeType: (id: string, newType: TodoProgress) => void;
}

const progressType: TodoProgress[] = [
  "UPCOMING",
  "INPROGRESS",
  "COMPLETED",
  "DELETED",
];

export const SingleTodo: React.FC<SingleTodoProps> = ({ task, changeType }) => {
  return (
    <div
      className="lg:flex justify-between items-center grid grid-cols-5 lg:p-5 p-3 border rounded-xl my-2 gap-2"
      key={task.id}
    >
      <h1 className="lg:w-1/2 lg:text-xl text-sm text-wrap text-justify overflow-auto col-span-2 font-medium">
        {task.name}
      </h1>
      <span className="lg:text-sm text-[10px] text-gray-400">
        {task.createdAt}
      </span>
      <select
        value={task.progress}
        className="text-black p-2 rounded-xl lg:text-sm text-[10px] lg:w-[150px] w-full m-auto font-semibold"
        onChange={(e) => changeType(task.id, e.target.value as TodoProgress)}
      >
        {progressType.map((j) => (
          <option value={j} key={j} className="p-1 my-1">
            {j}
          </option>
        ))}
      </select>
      {task.progress !== "DELETED" && (
        <BsDatabaseDash
          className="lg:text-4xl text-xl m-auto text-red-500 hover:text-red-700 cursor-pointer transition-colors"
          onClick={() => changeType(task.id, "DELETED")}
          aria-label="Delete Task"
        />
      )}
    </div>
  );
};

export default SingleTodo;
