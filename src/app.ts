import express,{Request,Response} from 'express';
import TodoRoute from './routes/todo';

const app = express();
app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
    res.status(200).json({
        message: 'Main route',
    });
    return;
});
app.use('/todos', TodoRoute);

export default app;