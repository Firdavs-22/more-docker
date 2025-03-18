import express, {NextFunction,Request,Response} from 'express';
import ApiRoutes from '@routes';
import path from 'path';
import logger from "@logger";

const app = express();
app.use(express.json());

app.use('/api', ApiRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.use((err: any, _req:Request, res:Response, _next:NextFunction) => {
    logger.error("Error handler", err);
    res.status(500).json({
        message: "Internal server error",
    }).end()
    return
});

// ⭕️added the logger it s winston with daily rotation
// ⭕️add the error handler
// ⭕️add alias for folders in tsconfig
// change code to service pattern
// add jwt authorization
// create new table for users
// add the user service
// add the user controller
// add the user routes
// add the user model
// change code to use socket.io
// add the socket service
// add the chat for users
// create new table for messages
// add the message service
// add the message controller
// add the message routes


export default app;