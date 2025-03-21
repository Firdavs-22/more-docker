import {Pool, PoolClient} from "pg";
import logger from "@logger";

class Database {
    private client!: PoolClient;
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432,
        })
    }

    private async connect(): Promise<void> {
        try {
            this.client = await this.pool.connect();
            logger.info("Connected to database");
        } catch (e) {
            logger.error("Error connecting to database", e);
            throw e;
        }
    }

    public async query<T>(text: string, params: any[] = []): Promise<T[]> {
        if (!this.client) {
            logger.info("Connecting to client");
            await this.connect();
        }
        try {
            logger.debug("SQL Query", {text, params});
            const result = await this.client.query(text, params);
            return result.rows as T[];
        } catch (e) {
            logger.error("Error executing query", e);
            throw e;
        }
    }

    public async createTable(query: string): Promise<void> {
        try {
            await this.query(query);
        } catch (e) {
            logger.error("Error creating table", e);
            throw e;
        }
    }
}

const DB = new Database();

(async () => {
    const userQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            token TEXT DEFAULT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            last_login_at TIMESTAMP DEFAULT NULL
        );
    `;

    const todoQuery = `
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT DEFAULT '',
            completed BOOLEAN DEFAULT FALSE NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            completed_at TIMESTAMP DEFAULT NULL
        );
    `;

    const chatQuery = `
        CREATE TABLE IF NOT EXISTS chats (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `;

    try {
        await DB.createTable(userQuery);
        await DB.createTable(todoQuery);
        await DB.createTable(chatQuery);
        logger.info("Tables Created if it didn't exist");
    } catch (e) {
        logger.error("Error creating todos table", e);
    }
})()

export default DB;