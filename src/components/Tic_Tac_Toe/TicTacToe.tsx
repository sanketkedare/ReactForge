"use client";

import React, { useContext } from "react";
import SingleBox from "./SingleBox";
import HeadingComponent from "./HeadingComponent";
import ResultComponent from "./ResultComponent";
import Button from "./Button";
import TicTacContextComponent, { TicTacContext } from "./TicTacContextComponent";

const TicTacToeContent: React.FC = () => {
  const { endGame, start, restart } = useContext(TicTacContext);
  const arr = Array(9).fill(0);

  return (
    <div className="lg:w-[80%] m-auto mt-10 relative">
      {endGame && <ResultComponent />}

      <h1 className="font-bold lg:text-3xl text-xl text-center">
        Tic Tac Toe Game
      </h1>

      {/* Button to start/exit the game */}
      <Button />

      {/* Game Board */}
      {start && (
        <>
          <HeadingComponent />

          {restart && (
            <div className="border lg:w-[450px] lg:h-[450px] my-6 m-auto rounded-xl text-white grid grid-cols-3 p-4 gap-3 bg-gray-900 bg-opacity-60 shadow-xl">
              {arr.map((_, index) => (
                <SingleBox i={index} key={index} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const TicTacToe: React.FC = () => {
  return (
    <TicTacContextComponent>
      <TicTacToeContent />
    </TicTacContextComponent>
  );
};

export default TicTacToe;
