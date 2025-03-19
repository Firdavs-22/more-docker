import express, {NextFunction,Request,Response} from 'express';
import ApiRoutes from '@routes';
import path from 'path';
import logger from "@logger";

const app = express();
app.use(express.json());

app.use('/api', ApiRoutes);

app.use(express.static(path.join(__dirname, 'public')));


app.use<any>((err: unknown, _req:Request, res:Response, _next:NextFunction) => {
    logger.error("Error handler", err);
    return res.status(500).json({
        message: "Internal server error"
    }).end()
});

// ⭕️add jwt authorization
// ⭕create new table for users
// ⭕add the auth controller
// ⭕add the auth routes
// ⭕add the user model
// ⭕️add the auth middleware
// ⭕add the user controller
// ⭕add the user routes
// ⭕change to todo_use the user
// ⭕fix the test code of todo_
// ⭕create new table for messages
// ⭕add the chat model
// ⭕️add the message controller
// ⭕add the message routes

// add the test for chat
// add the checking from database in auth middleware

// change code to use socket.io
// add the socket service

// add the cache service
// save user auth in cache

// rewrite frontend code to Vue
// Change place frontend code in other port or other container

// add the validate request service
// add the response service
// fix the structure of the project

// add the camera support service
export default app;