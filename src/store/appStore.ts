import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAllTasksOrdered, updateTaskStatus } from "../services/database";

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
        }),
        {name: 'app-storage'}
    )
);