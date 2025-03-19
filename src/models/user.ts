import db from '@db';

export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}
export interface Register {
    email: string;
    username: string;
    password: string;
}
export interface Update {
    username: string;
}
export interface Login {
    email: string;
    password: string;
}
export interface UserResponse {}

class UserModel {
    public async getById(id: number): Promise<User|null> {
        const query = 'SELECT * FROM users WHERE id = $1;';
        const result = await db.query<User>(query, [id]);
        return result.length ? result[0] : null;
    }

    public async getByEmail(email: string): Promise<User|null> {
        const query = 'SELECT * FROM users WHERE email = $1;';
        const result = await db.query<User>(query, [email]);
        return result.length ? result[0] : null;
    }

    public async getLogin(login: Login): Promise<User|null> {
        const query = 'SELECT * FROM users WHERE email = $1 AND password = $2;';
        const result = await db.query<User>(query, [login.email, login.password]);
        return result.length ? result[0] : null;
    }

    public async create(user: Register): Promise<User|null> {
        const query = 'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *;';
        const result = await db.query<User>(query, [user.email, user.username, user.password]);
        return result.length ? result[0] : null;
    }

    public async update(id:number,user: Update): Promise<User|null> {
        const query = 'UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2 RETURNING *;';
        const result = await db.query<User>(query, [user.username, id]);
        return result.length ? result[0] : null;
    }

    public async delete(id: number): Promise<void> {
        const query = 'DELETE FROM users WHERE id = $1;';
        await db.query(query, [id]);
    }
}

const userModel = new UserModel();

export default userModel;