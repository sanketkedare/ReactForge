"use client";

import React, { useState } from "react";

export const Calculator: React.FC = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const Operators = ["-", "+", "*", "/", "%"];
  const [inputValue, setInputValue] = useState<string>("");
  const [answer, setAnswer] = useState<string>("0");

  const inputHandler = (value: string | number) => {
    if (value === "=") {
      answerHandler();
    } else {
      const str = inputValue + value;
      setInputValue(str);
    }
  };

  const answerHandler = () => {
    try {
      // Safe evaluation for basic math expression
      // Allow only numbers, operators, and decimal
      const sanitized = inputValue.replace(/[^0-9+\-*/.%]/g, "");
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${sanitized})`)();
      setAnswer(result.toString());
      setInputValue(result.toString());
    } catch {
      setAnswer("Error");
    }
  };

  const clearHandler = () => {
    setInputValue("");
    setAnswer("0");
  };

  return (
    <>
      <h1 className="text-center text-3xl font-bold mt-8">Calculator</h1>
      <div className="flex items-center justify-center mt-6">
        <div className="bg-yellow-400 bg-opacity-30 shadow-lg rounded-xl p-6 w-[400px]">
          <h1 className="text-center text-2xl font-semibold mb-4 text-white">
            Calculator
          </h1>

          {/* Display */}
          <div className="bg-gray-200 p-4 rounded-lg mb-4 shadow-inner">
            <input
              className="w-full h-12 text-right text-2xl font-semibold bg-transparent outline-none text-gray-700 mb-2"
              readOnly
              type="text"
              value={inputValue}
              placeholder="0"
            />
            <div className="text-right text-lg text-gray-500">= {answer}</div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-5 gap-1">
            {/* Number Buttons */}
            <div className="col-span-3 flex w-full flex-wrap gap-2 justify-between">
              {numbers.map((num) => (
                <button
                  key={num}
                  onClick={() => inputHandler(num)}
                  className="lg:w-[62px] w-[50px] bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg font-bold py-3 shadow-md transition duration-150"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => inputHandler("0")}
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg font-bold py-3 shadow-md transition duration-150"
              >
                0
              </button>
            </div>

            {/* Operator Buttons */}
            <div className="col-span-1 flex flex-col gap-2">
              {Operators.map((o) => (
                <button
                  key={o}
                  onClick={() => inputHandler(o)}
                  className="lg:w-[60px] w-[50px] m-auto bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded-lg font-bold py-3 shadow-md transition duration-150"
                >
                  {o}
                </button>
              ))}
            </div>

            {/* Clear & Evaluation */}
            <div className="col-span-1 flex flex-col gap-2">
              <button
                onClick={clearHandler}
                className="col-span-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold py-3 shadow-md transition duration-150"
              >
                Clear
              </button>

              <button
                onClick={() => inputHandler("=")}
                className="h-4/5 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded-lg font-bold py-3 shadow-md transition duration-150"
              >
                =
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculator;
