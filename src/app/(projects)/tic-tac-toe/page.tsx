import type { Metadata } from "next";
import TicTacToe from "@/components/Tic_Tac_Toe/TicTacToe";
import ProjectHeader from "@/components/common/ProjectHeader";

export const metadata: Metadata = {
  title: "Tic Tac Toe (Tiger vs Eagle) — Junior SDE-1 React Challenge",
  description: "Interactive 3x3 game board calculating win conditions across rows, columns, and diagonals in React 19.",
  alternates: {
    canonical: "https://reactforge.sanketkedare.com/tic-tac-toe",
  },
  openGraph: {
    title: "Tic Tac Toe (Tiger vs Eagle) — Junior SDE-1 React Challenge | ReactForge",
    description: "Interactive 3x3 game board calculating win conditions across rows, columns, and diagonals in React 19.",
    images: [{ url: "/ReactForge.png", width: 1200, height: 630, alt: "Tic Tac Toe — ReactForge" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ReactForge.png"],
  },
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
