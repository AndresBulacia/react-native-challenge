import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../store/appStore";

const TASKS_KEY = '@tasks';

export async function getAllTasks(): Promise<Task[]> {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
}

export async function saveAllTasks(tasks: Task[]): Promise<void> {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function insertTask(task: Task): Promise<void> {
    const tasks = await getAllTasks();
    tasks.push(task);
    await saveAllTasks(tasks);
}

export async function updateTask(task: Task): Promise<void> {
    const tasks = await getAllTasks();
    const idx = tasks.findIndex(t => t.id === task.id);
    if (idx >= 0) tasks[idx] = task
    await saveAllTasks(tasks);
}

export async function deleteTaskById(id: number): Promise<void> {
    let tasks = await getAllTasks();
    tasks = tasks.filter(t => t.id !== id);
    await saveAllTasks(tasks);
}

export async function clearAllTasks(): Promise<void> {
    await AsyncStorage.removeItem(TASKS_KEY);
}