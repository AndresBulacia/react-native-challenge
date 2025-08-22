import * as SQLite from 'expo-sqlite';

let db: any = null; // <-- no uses WebSQLDatabase, solo any o ReturnType<typeof SQLite.openDatabaseSync>

export function initDb() {
  if (!db) {
    db = SQLite.openDatabaseSync('app.db'); // funciona en móvil
  }
  return db;
}

export function executeSql(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('Database not initialized. Call initDb() first.'));
    try {
      db.transaction((tx: any) => {
        tx.executeSql(
          sql,
          params,
          (_: any, result: any) => resolve(result),
          (_: any, error: any) => reject(error)
        );
      });
    } catch (err) {
      reject(err);
    }
  });
}

export async function runMigrations() {
  const { migrateAddStatus } = await import('../database/0.sql');
  await migrateAddStatus();
}

export async function getAllTasksOrdered() {
  const res = await executeSql(`
    SELECT * FROM tasks
    ORDER BY CASE status WHEN 'todo' THEN 1 WHEN 'doing' THEN 2 WHEN 'done' THEN 3 ELSE 4 END, created_at DESC;
  `);
  return res.rows._array;
}

export async function updateTaskStatus(id: number, status: string) {
  await executeSql(`UPDATE tasks SET status = ? WHERE id = ?`, [status, id]);
}
