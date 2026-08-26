import type { Metadata } from "next";
import TicTacToe from "@/components/Tic_Tac_Toe/TicTacToe";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Tic Tac Toe Game | React Tasks",
  description: "Two-player grid game (Tiger vs Eagle) with win detection and restart logic.",
};

export default function TicTacToePage() {
  return (
    <div className="w-full space-y-6">
      <ProjectHeader
        title="Tic Tac Toe Game (Tiger vs Eagle)"
        description="Classic two-player grid game calculating win conditions across rows, columns, and diagonals with turn history and restart logic."
        level="beginner"
        category="Game Logic"
        concepts={["2D Grid State", "Win Matrix Calculation", "Turn Switching", "Reset Logic"]}
        estimatedMinutes={25}
      />
      <div className="w-full flex justify-center py-4">
        <TicTacToe />
      </div>
    </div>
  );
}
