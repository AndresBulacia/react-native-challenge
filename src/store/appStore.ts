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