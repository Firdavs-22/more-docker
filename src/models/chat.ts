import db from '@db';

export interface Chat {
    id: number;
    message: string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}
export interface ChatInput {
    message: string;
    user_id: number;
}
export interface ChatUpdate {
    message: string;
    user_id: number;
}

export interface ChatUsername extends Chat {
    username: string;
}

class ChatModel {
    public async getAll(): Promise<Chat[]>{
        const query = 'SELECT * FROM chats ORDER BY created_at DESC;';
        return await db.query<Chat>(query);
    }

    public async getAllWithUsername(): Promise<ChatUsername[]> {
        const query = `SELECT ch.id,ch.message,ch.user_id,ch.created_at,ch.updated_at,us.username 
            FROM chats AS ch 
            JOIN users AS us ON ch.user_id = us.id 
        ORDER BY ch.id DESC LIMIT 20;`;
        return await db.query<ChatUsername>(query);
    }

    getAllWithUsernamePaginated = async (last_id: number): Promise<ChatUsername[]> => {
        const query = `SELECT ch.id,ch.message,ch.user_id,ch.created_at,ch.updated_at,us.username 
            FROM chats AS ch 
            JOIN users AS us ON ch.user_id = us.id
        WHERE ch.id < $1
        ORDER BY ch.created_at DESC LIMIT 20;`;
        return await db.query<ChatUsername>(query, [last_id]);
    }

    public async getById(id: number, user_id:number): Promise<Chat|null> {
        const query = 'SELECT * FROM chats WHERE id = $1 AND user_id = $2;';
        const result = await db.query<Chat>(query, [id, user_id]);
        return result.length ? result[0] : null;
    }

    public async create(chat: ChatInput): Promise<Chat|null> {
        const query = 'INSERT INTO chats (user_id ,message) VALUES ($1, $2) RETURNING *;';
        const result = await db.query<Chat>(query, [chat.user_id, chat.message]);
        return result.length ? result[0] : null;
    }

    public async update(id: number, chat: ChatUpdate): Promise<Chat|null> {
        const query = 'UPDATE chats SET message = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *;';
        const result = await db.query<Chat>(query, [chat.message, id, chat.user_id]);
        return result.length ? result[0] : null;
    }

    public async delete(id: number, user_id: number): Promise<void> {
        const query = 'DELETE FROM chats WHERE id = $1 AND user_id = $2;';
        await db.query(query, [id, user_id]);
    }
}

const chatModel = new ChatModel();

export default chatModel;