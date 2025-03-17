import db from '../db';

export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: Date;
    updated_at: Date;
    completed_at: Date | null;
}
export interface TodoInput {
    title: string;
    description: string;
}
export interface TodoUpdate {
    title: string;
    description: string;
    completed: boolean;
}

class TodoModel {
    public async getAll(): Promise<Todo[]>{
        const query = 'SELECT * FROM todos ORDER BY created_at DESC;';
        return await db.query<Todo>(query);
    }

    public async getById(id: number): Promise<Todo|null> {
        const query = 'SELECT * FROM todos WHERE id = $1;';
        const result = await db.query<Todo>(query, [id]);
        return result.length ? result[0] : null;
    }

    public async create(todo: TodoInput): Promise<Todo|null> {
        const query = 'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *;';
        const result = await db.query<Todo>(query, [todo.title, todo.description]);
        return result.length ? result[0] : null;
    }

    public async update(id: number, todo: TodoUpdate): Promise<Todo|null> {
        const query = 'UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = NOW() WHERE id = $4 RETURNING *;';
        const result = await db.query<Todo>(query, [todo.title, todo.description, todo.completed, id]);
        return result.length ? result[0] : null;
    }

    public async complete(id: number): Promise<Todo|null> {
        const query = 'UPDATE todos SET completed = true, completed_at = NOW() WHERE id = $1 RETURNING *;';
        const result = await db.query<Todo>(query, [id]);
        return result.length ? result[0] : null;
    }

    public async delete(id: number): Promise<void> {
        const query = 'DELETE FROM todos WHERE id = $1;';
        await db.query(query, [id]);
    }
}

const todoModel = new TodoModel();

export default todoModel;