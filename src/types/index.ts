// Global TypeScript definitions for React Tasks Next.js Application

export interface Theme {
  name: "Dark" | "Light";
  background: string;
  text: string;
}

export interface ThemeContextType {
  theme: Theme;
  changeTheme: () => void;
}

export interface ProjectItem {
  name: string;
  path: string;
  des: string;
}

export interface Person {
  id: number;
  name: string;
  occupation: string;
}

export interface CommentItem {
  id: string;
  person: Person;
  text: string;
}

export interface ArticleData {
  title: string;
  author: string;
  date: string;
  content: string;
  tags: string[];
}

export interface GiftPerson {
  name: string;
  gifts: string;
}

export type TodoProgress = "UPCOMING" | "INPROGRESS" | "COMPLETED" | "DELETED";

export interface TodoItem {
  id: string;
  createdAt: string;
  name: string;
  progress: TodoProgress;
}

export interface PostItem {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface RatingColor {
  hex: string;
  name: string;
  text: string;
}

export interface TicTacContextType {
  start: boolean;
  setStart: (value: boolean | ((prev: boolean) => boolean)) => void;
  endGame: string | boolean;
  setEndGame: (value: string | boolean | ((prev: string | boolean) => string | boolean)) => void;
  turn: boolean;
  setTurn: (value: boolean | ((prev: boolean) => boolean)) => void;
  restart: boolean;
  restartGame: () => void;
  handelerChoices: (player: "tiger" | "eagle", box: number) => void;
}
