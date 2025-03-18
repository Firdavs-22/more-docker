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

    public async query<T>(text: string, params?: any[]): Promise<T[]> {
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
    const query = `
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT DEFAULT '',
            completed BOOLEAN DEFAULT FALSE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            completed_at TIMESTAMP DEFAULT NULL
        );
    `;

    try {
        await DB.createTable(query);
        logger.info("Todos table created if it didn't exist");
    } catch (e) {
        logger.error("Error creating todos table", e);
    }
})()

export default DB;