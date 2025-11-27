/**
 * dbService.ts
 * Cung cấp các hàm wrapper cấp thấp để tương tác với SQLiteDatabase (Expo)
 */

import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from './database';

// Biến toàn cục để lưu trữ kết nối DB
let db: any = null;

/**
 * Lấy kết nối DB đã khởi tạo, hoặc khởi tạo nếu chưa có.
 * @returns SQLiteDatabase
 */
export const getDB = async (): Promise<any> => {
    if (!db) {
        db = await initializeDatabase();
    }
    if (!db) {
        throw new Error('Không thể khởi tạo hoặc kết nối DB.');
    }
    return db;
};

/**
 * Thực thi một câu lệnh SQL trong một giao dịch.
 * @param sql Câu lệnh SQL (INSERT, UPDATE, DELETE, SELECT)
 * @param params Các tham số cho câu lệnh SQL
 * @returns Promise<any>
 */
export const executeSql = async (
    sql: string,
    params: any[] = []
): Promise<any> => {
    const database = await getDB();

    return new Promise((resolve, reject) => {
        database.transaction(
            (tx: any) => {
                tx.executeSql(
                    sql,
                    params,
                    (_: any, result: any) => resolve(result),
                    (_: any, error: any) => {
                        console.error(`❌ Lỗi thực thi SQL: ${sql}`, error);
                        reject(error);
                        return false;
                    }
                );
            },
            (error: any) => {
                console.error('❌ Lỗi transaction:', error);
                reject(error);
            }
        );
    });
};
