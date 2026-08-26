"use client";

import React, { createContext, useEffect, useState, ReactNode, useCallback } from "react";
import { winningCombinations } from "./utils";
import { TicTacContextType } from "@/types";

export const TicTacContext = createContext<TicTacContextType>({
  start: false,
  setStart: () => {},
  endGame: false,
  setEndGame: () => {},
  turn: false,
  setTurn: () => {},
  restart: true,
  restartGame: () => {},
  handelerChoices: () => {},
});

interface TicTacContextComponentProps {
  children: ReactNode;
}

export const TicTacContextComponent: React.FC<TicTacContextComponentProps> = ({
  children,
}) => {
  const [start, setStart] = useState<boolean>(false);
  const [turn, setTurn] = useState<boolean>(false); // false = tiger, true = eagle
  const [restart, setRestart] = useState<boolean>(true);
  const [endGame, setEndGame] = useState<string | boolean>(false);

  const [tiger, setTiger] = useState<number[]>([]);
  const [eagle, setEagle] = useState<number[]>([]);

  const restartGame = useCallback(() => {
    setTurn(false);
    setRestart(false);
    setEndGame(false);
    setTimeout(() => {
      setRestart(true);
      setTiger([]);
      setEagle([]);
    }, 500);
  }, []);

  const handelerChoices = (player: "tiger" | "eagle", box: number) => {
    if (player === "eagle") {
      setEagle((prev) => [...prev, box]);
    } else {
      setTiger((prev) => [...prev, box]);
    }
  };

  const checkWinner = useCallback(() => {
    for (const combination of winningCombinations) {
      if (combination.every((index) => tiger.includes(index))) {
        setEndGame("Tiger Won !!");
        setTimeout(restartGame, 2000);
        return;
      }
      if (combination.every((index) => eagle.includes(index))) {
        setEndGame("Eagle Won !!");
        setTimeout(restartGame, 2000);
        return;
      }
    }

    if (tiger.length + eagle.length === 9) {
      setEndGame("It's a Draw!");
      setTimeout(restartGame, 2000);
    }
  }, [tiger, eagle, restartGame]);

  useEffect(() => {
    if (tiger.length > 0 || eagle.length > 0) {
      checkWinner();
    }
  }, [tiger, eagle, checkWinner]);

  return (
    <TicTacContext.Provider
      value={{
        start,
        setStart,
        endGame,
        setEndGame,
        turn,
        setTurn,
        restart,
        restartGame,
        handelerChoices,
      }}
    >
      {children}
    </TicTacContext.Provider>
  );
};

export default TicTacContextComponent;
