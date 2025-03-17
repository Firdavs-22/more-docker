import request from "supertest";
import app from "../src/app";
import { HttpStatus } from "../src/enums/httpStatus";
import { describe, it, expect } from "@jest/globals";

describe("Todo API", () => {
    let todoId: number = 0;
    it("should return 200 and an array when getting all todos", async () => {
        const response = await request(app).get("/api/todos");
        expect(response.status).toBe(HttpStatus.OK);
        expect(Array.isArray(response.body.todos)).toBe(true);
    });

    it("should return 201 and the created todo when creating a todo", async () => {
        const newTodo = { title: "test title", description: "test description" };
        const response = await request(app).post("/api/todos").send(newTodo);
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body.todo).toHaveProperty("id");
        expect(response.body.todo).toHaveProperty("title", newTodo.title);
        expect(response.body.todo).toHaveProperty("description", newTodo.description);
        expect(response.body.todo).toHaveProperty("completed", false);
        todoId = response.body.todo.id;
    });

    it("should return 200 and a todo object when getting a todo by id", async () => {
        const response = await request(app).get(`/api/todos/${todoId}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.todo).toHaveProperty("id", todoId);
        expect(response.body.todo).toHaveProperty("title");
        expect(response.body.todo).toHaveProperty("description");
        expect(response.body.todo).toHaveProperty("completed", false);
    });

    it('should return 200 and a todo complete',async () => {
        const response = await request(app).patch(`/api/todos/${todoId}/complete`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.todo).toHaveProperty("id", todoId);
        expect(response.body.todo).toHaveProperty("title");
        expect(response.body.todo).toHaveProperty("description");
        expect(response.body.todo).toHaveProperty("completed", true);
    });

    it("should return 404 when getting a non-existent todo by id", async () => {
        const response = await request(app).get("/api/todos/0");
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 200 and the updated todo when updating a todo", async () => {
        const updatedTodo = { title: "updated test", description: "updated test", completed: true };
        const response = await request(app).put(`/api/todos/${todoId}`).send(updatedTodo);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.todo).toHaveProperty("id", todoId);
        expect(response.body.todo).toHaveProperty("title", updatedTodo.title);
        expect(response.body.todo).toHaveProperty("description", updatedTodo.description);
        expect(response.body.todo).toHaveProperty("completed", updatedTodo.completed);
    });

    it("should return 204 when deleting a todo", async () => {
        const response = await request(app).delete(`/api/todos/${todoId}`);
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it("should return 400 when creating a todo with invalid data", async () => {
        const invalidTodo = { title: "" };
        const response = await request(app).post("/api/todos").send(invalidTodo);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 404 when getting a non-existent todo',async () => {
        const response = await request(app).get(`/api/todos/${todoId}`);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 404 when updating a non-existent todo", async () => {
        const updatedTodo = { title: "updated test", description: "updated test", completed: true };
        const response = await request(app).put(`/api/todos/${todoId}`).send(updatedTodo);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 404 when deleting a non-existent todo", async () => {
        const response = await request(app).delete(`/api/todos/${todoId}`);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
});