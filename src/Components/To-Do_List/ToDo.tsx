"use client";

import React, { useEffect, useState } from "react";
import SingleTodo from "./SingleTodo";
import MyForm from "./MyForm";
import { TodoItem, TodoProgress } from "@/types";

const progressType: TodoProgress[] = [
  "UPCOMING",
  "INPROGRESS",
  "COMPLETED",
  "DELETED",
];

export const ToDo: React.FC = () => {
  const [allToDos, setAllToDos] = useState<TodoItem[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const changeType = (id: string, newType: TodoProgress) => {
    setAllToDos((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, progress: newType } : task
      )
    );
  };

  // Load tasks from local storage on component mount
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        setAllToDos(JSON.parse(storedTodos));
      }
    } catch {
      setAllToDos([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save tasks to local storage whenever allToDos changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("todos", JSON.stringify(allToDos));
    }
  }, [allToDos, isInitialized]);

  // Clear all tasks from local storage and reset state
  const clearAllTasks = () => {
    const isConfirm = window.confirm("Are you sure you want to delete all todos?");
    if (isConfirm) {
      localStorage.removeItem("todos");
      setAllToDos([]);
    }
  };

  return (
    <div className="relative mt-10 lg:w-[80%] m-auto">
      <h1 className="lg:text-3xl text-xl text-center font-bold">To Do List</h1>
      <MyForm setAllToDos={setAllToDos} />
      <button
        className="p-2 lg:w-[150px] text-sm border my-2 absolute right-1 rounded-xl bg-red-200 text-black font-bold hover:bg-red-300 transition-colors"
        onClick={clearAllTasks}
      >
        Clear ALL
      </button>
      <div className="mt-8 w-full">
        {progressType.map((type) => {
          const filtered = allToDos.filter((task) => task.progress === type);
          return (
            <div className="mb-8 p-3 border rounded-xl bg-gray-900 bg-opacity-30" key={type}>
              <h2 className="m-2 lg:text-2xl text-xl font-bold flex items-center justify-between border-b pb-2">
                <span>{type}</span>
                <span className="text-sm font-normal bg-yellow-400 text-black px-2 py-1 rounded-lg">
                  {filtered.length}
                </span>
              </h2>
              {filtered.length === 0 ? (
                <p className="text-gray-500 italic p-3 text-sm">No tasks in this category.</p>
              ) : (
                filtered.map((task) => (
                  <SingleTodo
                    task={task}
                    changeType={changeType}
                    key={task.id}
                  />
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToDo;
