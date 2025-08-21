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