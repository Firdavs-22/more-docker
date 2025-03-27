import express, {NextFunction,Request,Response} from 'express';
import path from 'path';
import cors from 'cors';
import ApiRoutes from '@routes';
import logger from "@logger";
import cache from '@cache';

const app = express();


app.use(express.json());
app.use(cors());
app.use('/api', ApiRoutes);

app.use(express.static(path.join(__dirname, 'public')));

cache.set('testKey', 'testValue').then(() => {
    cache.get('testKey').then(value => {
        logger.info(`Value for 'testKey': ${value}`);
    });
});

app.use<any>((err: unknown, _req:Request, res:Response, _next:NextFunction) => {
    logger.error("Error handler", err);
    return res.status(500).json({
        message: "Internal server error"
    }).end()
});

// ⭕️rewrite frontend code to Vue
// ⭕Change place frontend code in other port or other container
// ⭕change code to use socket.io
// ⭕add the socket service
// ⭕change chat message to be paginated
// ⭕fix chat controller
// ⭕remove the chat router
// ⭕️add the delete message
// add on todoApi the search
// add the userApi the search

// rewrite a readme
// add the saving response in cache
// add the validate request service
// add the response service
// integrate the frontend with the backend
// fix the structure of the project

// add the camera support service
export default app;