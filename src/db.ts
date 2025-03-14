import {Pool, PoolClient} from "pg";

class Database {
    private client!: PoolClient;
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432,
        })
    }

    private async connect(): Promise<void> {
        try {
            this.client = await this.pool.connect();
            console.log("Connected to database");
        } catch (e) {
            console.error("Error connecting to database", e);
            throw e;
        }
    }

    public async query<T>(text: string, params?: any[]): Promise<T[]> {
        if (!this.client) {
            console.log("Connecting to database...");
            await this.connect();
        }
        try {
            console.log(text, params);
            const result = await this.client.query(text, params);
            return result.rows as T[];
        } catch (e) {
            console.error("Error executing query", e);
            throw e;
        }
    }

    public async createTable(query: string): Promise<void> {
        try {
            await this.query(query);
        } catch (e) {
            console.error("Error creating table", e);
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
        console.log("Todos table created or already exists");
    } catch (e) {
        console.error("Error creating todos table", e);
    }
})()

export default DB;