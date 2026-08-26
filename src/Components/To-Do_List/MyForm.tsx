"use client";

import React, { useState } from "react";
import useGenrateId from "./useGenrateId";
import { TodoItem } from "@/types";

interface MyFormProps {
  setAllToDos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}

export const MyForm: React.FC<MyFormProps> = ({ setAllToDos }) => {
  const [toDo, setToDo] = useState<string>("");

  const createToDo = () => {
    if (!toDo.trim()) return;

    const obj: TodoItem = {
      id: useGenrateId(),
      createdAt: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      name: toDo.trim(),
      progress: "UPCOMING",
    };

    setAllToDos((prev) => [...prev, obj]);
    setToDo("");
  };

  const resetTodo = () => setToDo("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createToDo();
      }}
      className="w-full border p-5 lg:mt-5 mt-10 rounded-xl"
    >
      <input
        onChange={(e) => setToDo(e.target.value)}
        value={toDo}
        type="text"
        className="w-full px-5 p-2 text-black font-semibold h-[50px] rounded-xl outline-none"
        placeholder="Create Your Task!"
      />
      <div className="flex justify-between gap-4 mt-3">
        <button
          disabled={!toDo.trim()}
          type="submit"
          className="p-3 w-1/2 bg-yellow-400 disabled:opacity-50 rounded-xl text-black font-bold hover:bg-sky-500 transition-colors"
          onClick={createToDo}
        >
          Create To-Do
        </button>
        <button
          disabled={!toDo.trim()}
          type="button"
          className="p-3 w-1/2 bg-red-600 disabled:opacity-50 rounded-xl text-white hover:text-black font-bold hover:bg-sky-500 transition-colors"
          onClick={resetTodo}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default MyForm;
