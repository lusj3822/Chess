import mysql from 'mysql2';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();

(async () => {
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to MySQL database');
      connection.release();
    } catch (err) {
      console.error('Database connection failed:', err);
      process.exit(1);
    }
})();

export async function getUser(username: string, password: string) {
    try {
        const [users]: any = await pool.query(
            "SELECT * FROM users WHERE username = ? AND user_password = ?",
            [username, password]
        );

        return users[0];

    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
}

export async function createUser(username: string, password: string) {
    const [result] = await pool.query(`
        INSERT INTO users (username, user_password)
        VALUES (?, ?)
    `, [username, password]);

    return result;
}