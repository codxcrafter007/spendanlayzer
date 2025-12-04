import { openDB } from 'idb';

const DB_NAME = 'SpendAnalyzerDB';
const DB_VERSION = 1;

let db;

export async function initDB() {
    db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Create expenses store
            if (!db.objectStoreNames.contains('expenses')) {
                const expenseStore = db.createObjectStore('expenses', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                expenseStore.createIndex('date', 'date');
                expenseStore.createIndex('category', 'category');
                expenseStore.createIndex('amount', 'amount');
            }

            // Create settings store
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
        }
    });

    return db;
}

export function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call initDB() first.');
    }
    return db;
}
