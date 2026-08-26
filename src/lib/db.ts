import Dexie, { type Table } from "dexie";
import { KanbanTask } from "@/types/studio";

export class StudioDatabase extends Dexie {
  kanbanTasks!: Table<KanbanTask, string>;

  constructor() {
    super("ReactStudioDB");
    this.version(1).stores({
      kanbanTasks: "id, status, priority, assignee, createdAt",
    });
  }
}

export const db = new StudioDatabase();
