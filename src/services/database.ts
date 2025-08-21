import { openDatabaseAsync } from "expo-sqlite";
let db: any;

export async function initDb() {
    db = await openDatabaseAsync('app.db');
    return db;
}

export async function executeSql(sql:string, params: any[] = []) {
    return await db.executeSql([{sql, args: params}]);
}

export async function runMigrations() {
    const {migrateAddStatus} = await import('../database/0.sql');
    await migrateAddStatus();
}

export async function getAllTasksOrdered() {
    const res = await executeSql(`
        SELECT * FROM tasks
        ORDER BY CASE status WHEN 'todo' THEN 1 WHEN 'doing' THEN 2 WHEN 'done' THEN 3 ELSE 4 END, created_at DESC;
        `);
    return res.rows._array;
}

export async function updateTaskStatus(id:number, status: string) {
    await executeSql(`UPDATE tasks SET status = ? WHERE id = ?`, [status, id]);
}