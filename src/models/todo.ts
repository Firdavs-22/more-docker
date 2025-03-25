import db from '@db';

export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    user_id: number;
    created_at: Date;
    updated_at: Date;
    completed_at: Date | null;
}
export interface TodoInput {
    title: string;
    description: string;
    user_id: number;
}
export interface TodoUpdate {
    title: string;
    description: string;
    completed: boolean;
    user_id: number;
}

class TodoModel {
    public async getAll(user_id: number): Promise<Todo[]>{
        const query = 'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC;';
        return await db.query<Todo>(query, [user_id]);
    }

    public async getById(id: number, user_id:number): Promise<Todo|null> {
        const query = 'SELECT * FROM todos WHERE id = $1 AND user_id = $2;';
        const result = await db.query<Todo>(query, [id, user_id]);
        return result.length ? result[0] : null;
    }

    public async create(todo: TodoInput): Promise<Todo|null> {
        const query = 'INSERT INTO todos (user_id ,title, description) VALUES ($1, $2, $3) RETURNING *;';
        const result = await db.query<Todo>(query, [todo.user_id,todo.title, todo.description]);
        return result.length ? result[0] : null;
    }

    public async update(id: number, todo: TodoUpdate): Promise<Todo|null> {
        const query = 'UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = NOW(), completed_at = NULL WHERE id = $4 AND user_id = $5 RETURNING *;';
        const result = await db.query<Todo>(query, [todo.title, todo.description, todo.completed, id, todo.user_id]);
        return result.length ? result[0] : null;
    }

    public async complete(id: number, user_id :number): Promise<Todo|null> {
        const query = 'UPDATE todos SET completed = true, completed_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *;';
        const result = await db.query<Todo>(query, [id, user_id]);
        return result.length ? result[0] : null;
    }

    public async delete(id: number, user_id: number): Promise<void> {
        const query = 'DELETE FROM todos WHERE id = $1 AND user_id = $2;';
        await db.query(query, [id, user_id]);
    }
}

const todoModel = new TodoModel();

export default todoModel;