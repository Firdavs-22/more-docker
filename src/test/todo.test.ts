import dotenv from 'dotenv';
import request from "supertest";
import {describe, it, expect} from "@jest/globals";

dotenv.config({path: './.env.test'});

import app from "@app";
import {HttpStatus} from "@enums/httpStatus";

describe("Todo API", () => {
    let user = {
        id: 0,
        username: "test",
        email: "test-todo@gmail.com",
        password: "test-todo",
        token: ""
    }
    let todo = {
        id: 0,
        title: "test title",
        description: "test description"
    };
    it('should return 401 Unauthorized when getting all todos', async () => {
        const response = await request(app).get("/api/todos");
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should register a new user', async () => {
        const response = await request(app).post("/api/auth/register").send({
            username: user.username,
            email: user.email,
            password: user.password
        });
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toHaveProperty("token");
        expect(response.body.user).toHaveProperty("username", user.username);
        expect(response.body.user).toHaveProperty("email", user.email);
        user.id = response.body.user.id;
        user.token = response.body.token;
    });

    it("should return 200 and an array when getting all todos", async () => {
        const response = await request(app).get("/api/todos").set("Authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(Array.isArray(response.body.todos)).toBe(true);
    });

    it("should return 201 and the created todo when creating a todo", async () => {
        const response = await request(app).post("/api/todos").set("Authorization", `Bearer ${user.token}`).send({
            title: todo.title,
            description: todo.description
        });
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body.todo).toHaveProperty("id");
        expect(response.body.todo).toHaveProperty("title", todo.title);
        expect(response.body.todo).toHaveProperty("description", todo.description);
        expect(response.body.todo).toHaveProperty("user_id", user.id);
        expect(response.body.todo).toHaveProperty("completed", false);
        todo.id = response.body.todo.id;
    });

    it("should return 200 and a todo object when getting a todo by id", async () => {
        const response = await request(app).get(`/api/todos/${todo.id}`).set("Authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.todo).toHaveProperty("id", todo.id);
        expect(response.body.todo).toHaveProperty("title", todo.title);
        expect(response.body.todo).toHaveProperty("description", todo.description);
        expect(response.body.todo).toHaveProperty("user_id", user.id);
        expect(response.body.todo).toHaveProperty("completed", false);
    });

    it('should return 200 and a todo complete', async () => {
        const response = await request(app).patch(`/api/todos/${todo.id}/complete`).set("Authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.todo).toHaveProperty("id", todo.id);
        expect(response.body.todo).toHaveProperty("title", todo.title);
        expect(response.body.todo).toHaveProperty("description", todo.description);
        expect(response.body.todo).toHaveProperty("user_id", user.id);
        expect(response.body.todo).toHaveProperty("completed", true);
    });

    it("should return 404 when getting a non-existent todo by id", async () => {
        const response = await request(app).get("/api/todos/0").set("Authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 200 and the updated todo when updating a todo", async () => {
        const updatedTodo = {title: "updated test", description: "updated test", completed: true};
        const response = await request(app).put(`/api/todos/${todo.id}`).set("Authorization", `Bearer ${user.token}`).send(updatedTodo);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.todo).toHaveProperty("id", todo.id);
        expect(response.body.todo).toHaveProperty("title", updatedTodo.title);
        expect(response.body.todo).toHaveProperty("description", updatedTodo.description);
        expect(response.body.todo).toHaveProperty("completed", updatedTodo.completed);
        expect(response.body.todo).toHaveProperty("user_id", user.id);

        todo.title = updatedTodo.title;
        todo.description = updatedTodo.description;
    });

    it("should return 204 when deleting a todo", async () => {
        const response = await request(app).delete(`/api/todos/${todo.id}`).set("Authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it("should return 400 when creating a todo with invalid data", async () => {
        const invalidTodo = {title: ""};
        const response = await request(app).post("/api/todos").send(invalidTodo).set("Authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 404 when getting a non-existent todo', async () => {
        const response = await request(app).get(`/api/todos/${todo.id}`).set("Authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 404 when updating a non-existent todo", async () => {
        const updatedTodo = {title: "updated test", description: "updated test", completed: true};
        const response = await request(app).put(`/api/todos/${todo.id}`).set("Authorization", `Bearer ${user.token}`).send(updatedTodo);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 404 when deleting a non-existent todo", async () => {
        const response = await request(app).delete(`/api/todos/${todo.id}`).set("Authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should delete user', async () => {
        const response = await request(app).delete(`/api/user/`).set("Authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
});