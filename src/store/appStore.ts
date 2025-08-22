import { create } from "zustand";
import { persist } from "zustand/middleware";
import { executeSql, getAllTasksOrdered, updateTaskStatus } from "../services/database";

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    status: TaskStatus;
    user_id?: number;
    created_at?: number;
}

type State = {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    loadTasks: () => Promise<void>;
    setStatus: (id:number, status:TaskStatus) => Promise<void>;
    addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
};

export const useAppStore = create(
    persist<State>(
        (set) => ({
            tasks: [],
            setTasks: (tasks) => set ({tasks}),
            loadTasks: async () => {
                const tasks = await getAllTasksOrdered();
                set({tasks});
            },
            setStatus: async (id, status) => {
                await updateTaskStatus(id, status);

                const tasks = await getAllTasksOrdered();
                set({tasks});
            },
            addTask: async (task) => {
                const res: any = await executeSql(`
                        INSERT INTO task (title, description, completed, status, created_at) VALUES (?, ?, ?, ?, strftime('%s', 'now'))`, [task.title, task.description ?? "", task.completed ? 1 : 0, task.status]);
                const tasks = await getAllTasksOrdered();
                set({tasks});
            },
            deleteTask: async (id) => {
                await executeSql(`DELETE FROM task WHERE id = ?`, [id]);
                const tasks = await getAllTasksOrdered();
                set({tasks});
            }
        }),
        {name: 'app-storage'}
    )
);