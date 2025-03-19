import dotenv from 'dotenv';
import request from "supertest";
import { describe, it, expect } from "@jest/globals";

dotenv.config({ path: './.env.test' });

import app from "@app";
import { HttpStatus } from "@enums/httpStatus";

describe("User API", () => {
    let user = {
        id: 0,
        email: 'johndoe@gmail.com',
        username: "JohnDoe",
        password: 'password',
        token: "",
    }
    it('should register a new user', async () => {
        const response = await request(app).post('/api/auth/register').send({
            email: user.email,
            username: user.username,
            password: user.password
        });
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body.user).toHaveProperty("id");
        expect(response.body.user).toHaveProperty("email", user.email);
        expect(response.body.user).toHaveProperty("username", user.username);
        expect(response.body).toHaveProperty("token");
        user.id = response.body.user.id;
        user.token = response.body.token;
    });

    it('should return validate error in register',async () => {
        const response = await request(app).post('/api/auth/register').send({});
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return conflict in register ',async () => {
        const response = await request(app).post('/api/auth/register').send({
            email: user.email,
            username: user.username,
            password: user.password
        });
        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    it('should return 200 and a token when login',async () => {
        const response = await request(app).post('/api/auth/login').send({
            email: user.email,
            password: user.password
        });
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.user).toHaveProperty("id", user.id);
        expect(response.body.user).toHaveProperty("email", user.email);
        expect(response.body.user).toHaveProperty("username", user.username);
        expect(response.body).toHaveProperty("token");
        user.token = response.body.token
    });

    it('should return 400 when login',async () => {
        const response = await request(app).post('/api/auth/login').send({});
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return user not found when login', async () => {
        const response = await request(app).post('/api/auth/login').send({
            email: 'wrongemail@gmail.com',
            password: user.password
        })
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return bad credentials when login', async () => {
        const response = await request(app).post('/api/auth/login').send({
            email: user.email,
            password: 'wrongpassword'
        });
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should invalid token when get info',async () => {
        const response = await request(app).get('/api/user/').set('Authorization', `Bearer invalidtoken`);
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return user info', async () => {
        const response = await request(app).get('/api/user/').set('Authorization', `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.user).toHaveProperty("id", user.id);
        expect(response.body.user).toHaveProperty("email", user.email);
        expect(response.body.user).toHaveProperty("username", user.username);
    });

    it('should return unauthorized', async () => {
        const response = await request(app).get('/api/user/');
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return failed update user',async () => {
        const response = await request(app).put('/api/user/').set('Authorization', `Bearer ${user.token}`).send({});
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should update the user', async () => {
        const response = await request(app).put('/api/user/').set('Authorization', `Bearer ${user.token}`).send({
            username: "John Doe"
        });
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.user).toHaveProperty("id", user.id);
        expect(response.body.user).toHaveProperty("email", user.email);
        expect(response.body.user).toHaveProperty("username", "John Doe");
        user.username = "John Doe";
    });

    it('should return user not content when delete user', async () => {
        const response = await request(app).delete('/api/user/').set('Authorization', `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it('should return user not found when delete user', async () => {
        const response = await request(app).delete('/api/user/').set('Authorization', `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
});