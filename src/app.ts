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


// ⭕️add the test for chat
// ⭕add the checking from database in auth middleware
// add the cache service
// save user auth in cache
// rewrite a readme

// rewrite frontend code to Vue
// Change place frontend code in other port or other container
// change code to use socket.io
// add the socket service

// add the validate request service
// add the response service
// fix the structure of the project

// add the camera support service
export default app;