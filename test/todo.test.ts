import request from "supertest";
import app from "../src/app";
import { HttpStatus } from "../src/enums/httpStatus";
import { describe, it, expect } from "@jest/globals";

describe("Todo API", () => {
    it("should return 200 and an array when getting all todos", async () => {
        const response = await request(app).get("/todos");
        console.log(response.status);
        console.log(response.body);
        console.log(Array.isArray(response.body));
        expect(response.status).toBe(HttpStatus.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return 200 and a todo object when getting a todo by id", async () => {
        const response = await request(app).get("/todos/1");
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toHaveProperty("id", 1);
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("description");
    });

    it("should return 404 when getting a non-existent todo by id", async () => {
        const response = await request(app).get("/todos/999");
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 201 and the created todo when creating a todo", async () => {
        const newTodo = { title: "test", description: "test" };
        const response = await request(app).post("/todos").send(newTodo);
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("title", newTodo.title);
        expect(response.body).toHaveProperty("description", newTodo.description);
    });

    it("should return 400 when creating a todo with invalid data", async () => {
        const invalidTodo = { title: "" };
        const response = await request(app).post("/todos").send(invalidTodo);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it("should return 200 and the updated todo when updating a todo", async () => {
        const updatedTodo = { title: "updated test", description: "updated test", completed: true };
        const response = await request(app).put("/todos/1").send(updatedTodo);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toHaveProperty("title", updatedTodo.title);
        expect(response.body).toHaveProperty("description", updatedTodo.description);
        expect(response.body).toHaveProperty("completed", updatedTodo.completed);
    });

    it("should return 404 when updating a non-existent todo", async () => {
        const updatedTodo = { title: "updated test", description: "updated test", completed: true };
        const response = await request(app).put("/todos/999").send(updatedTodo);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 200 when deleting a todo", async () => {
        const response = await request(app).delete("/todos/1");
        expect(response.status).toBe(HttpStatus.OK);
    });

    it("should return 404 when deleting a non-existent todo", async () => {
        const response = await request(app).delete("/todos/999");
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
});