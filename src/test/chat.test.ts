import dotenv from 'dotenv';
import request from "supertest";
import {describe, it, expect} from "@jest/globals";

dotenv.config({path: './.env.test'});

import app from "@app";
import {HttpStatus} from "@enums/httpStatus";

describe("Chat API", () => {
    let user1  = {
        id: 0,
        username: "John Doe",
        password: "password",
        email: "john@gmail.com",
        token: "",
        chat: {
            id: 0,
            message: "Hello Jane"
        }
    }
    let user2  = {
        id: 0,
        username: "Jane Doe",
        password: "password",
        email: "jane@gmail.com",
        token: "",
        chat: {
            id: 0,
            message: "Hello John"
        }

    }

    it("should fail on getting all chat", async () => {
        const response = await request(app).get("/api/chat");
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("should register user 1", async () => {
        const response = await request(app).post("/api/auth/register").send(user1);
        expect(response.status).toBe(HttpStatus.CREATED);
        user1.id = response.body.user.id;
        user1.token = response.body.token;
    });

    it("should register user 2", async () => {
        const response = await request(app).post("/api/auth/register").send(user2);
        expect(response.status).toBe(HttpStatus.CREATED);
        user2.id = response.body.user.id;
        user2.token = response.body.token;
    });

    it("should get all chat", async () => {
        const response = await request(app).get("/api/chat").set('Authorization', 'Bearer ' + user1.token);
        expect(response.status).toBe(HttpStatus.OK);
        expect(Array.isArray(response.body.chats)).toBe(true);
    });

    it("should create chat", async () => {
        const response = await request(app).post("/api/chat").send({
            message: user1.chat.message
        }).set('Authorization', 'Bearer ' + user1.token);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.chat.message).toBe(user1.chat.message);
        expect(response.body.chat.user_id).toBe(user1.id);
        user1.chat.id = response.body.chat.id;
    });

    it('should get chat for Jane',async () => {
        const response = await request(app).get("/api/chat").set('Authorization', 'Bearer ' + user2.token);
        expect(response.status).toBe(HttpStatus.OK);
        let chat = response.body.chats.find((chat: any) => chat.id === user1.chat.id);
        expect(response.status).toBe(HttpStatus.OK);
        expect(chat.id).toBe(user1.chat.id);
        expect(chat.message).toBe(user1.chat.message);
        expect(chat.user_id).toBe(user1.id);
        expect(chat.username).toBe(user1.username);
    });

    it("should update chat", async () => {
        let updatedMessage = "Hello Jane, How are you?";
        const response = await request(app).put(`/api/chat/${user1.chat.id}`).send({
            message: updatedMessage
        }).set('Authorization', 'Bearer ' + user1.token);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.chat.id).toBe(user1.chat.id);
        expect(response.body.chat.message).toBe(updatedMessage);
        user1.chat.message = updatedMessage;
    });

    it('should get updated chat for Jane',async () => {
        const response = await request(app).get("/api/chat").set('Authorization', 'Bearer ' + user1.token);
        expect(response.status).toBe(HttpStatus.OK);
        let chat = response.body.chats.find((chat: any) => chat.id === user1.chat.id);
        expect(response.status).toBe(HttpStatus.OK);
        expect(chat.id).toBe(user1.chat.id);
        expect(chat.message).toBe(user1.chat.message);
        expect(chat.user_id).toBe(user1.id);
        expect(chat.username).toBe(user1.username);
    });

    it("should Jane create chat", async () => {
        const response = await request(app).post("/api/chat").set('Authorization', 'Bearer ' + user2.token).send({
            message: user2.chat.message
        });
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.chat.message).toBe(user2.chat.message);
        expect(response.body.chat.user_id).toBe(user2.id);
        user2.chat.id = response.body.chat.id;
    });

    it('should get chat for John',async () => {
        const response = await request(app).get("/api/chat").set('Authorization', 'Bearer ' + user1.token);
        expect(response.status).toBe(HttpStatus.OK);
        let chat = response.body.chats.find((chat: any) => chat.id === user2.chat.id);
        expect(response.status).toBe(HttpStatus.OK);
        expect(chat.id).toBe(user2.chat.id);
        expect(chat.message).toBe(user2.chat.message);
        expect(chat.user_id).toBe(user2.id);
        expect(chat.username).toBe(user2.username);
    });

    it("should fail to delete other people chat", async () => {
        const response = await request(app).delete(`/api/chat/${user2.chat.id}`).set('Authorization', 'Bearer ' + user1.token);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    })

    it("should delete chat", async () => {
        const response = await request(app).delete(`/api/chat/${user1.chat.id}`).set('Authorization', 'Bearer ' + user1.token);
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it('should cant find deleted chat', async () => {
        const response = await request(app).get("/api/chat").set('Authorization', 'Bearer ' + user2.token);
        expect(response.status).toBe(HttpStatus.OK);
        let chat = response.body.chats.find((chat: any) => chat.id === user1.chat.id);
        expect(chat).toBeUndefined();
    });

    it("should delete chat", async () => {
        const response = await request(app).delete(`/api/chat/${user2.chat.id}`).set('Authorization', 'Bearer ' + user2.token);
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it('should delete user1',async () => {
        const response = await request(app).delete("/api/user/").set('Authorization', 'Bearer ' + user1.token);
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it('should delete user2',async () => {
        const response = await request(app).delete("/api/user/").set('Authorization', 'Bearer ' + user2.token);
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
});