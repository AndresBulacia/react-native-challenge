import {executeSql} from '../services/database';

export async function migrateAddStatus() {
    const info = await executeSql("PRAGMA table_info(tasks);");
    const columns = info.rows._array;
    const hasStatus = columns.some((c: any) => c.name === 'status');

    if(hasStatus) return;

    await executeSql('BEGIN TRANSACTION;');

    try {
        await executeSql(`
            CREATE TABLE IF NOT EXISTS task_new(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                completed INTEGER DEFAULT 0,
                status TEXT DEFAULT 'todo',
                user_id INTEGER,
                created_at INTEGER
            );
            `);

        await executeSql(`
            INSERT INTO task_new (id, title, description, completed, status, user_id, created_at)
            SELECT id, title, description, completed,
                CASE WHEN completed = 1 THEN 'done' ELSE 'todo' END as status, user_id, created_at
            FROM tasks;
            `);
        
        await executeSql(`DROP TABLE tasks;`);
        await executeSql(`ALTER TABLE task_new RENAME TO tasks;`);

        await executeSql('COMMIT;');
    } catch (error) {
        await executeSql('ROLLBACK;');
        throw error;
    }
}