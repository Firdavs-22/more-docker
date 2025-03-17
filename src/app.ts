import express from 'express';
import ApiRoutes from './routes';
import path from 'path';

const app = express();
app.use(express.json());

app.use('/api', ApiRoutes);
app.use(express.static(path.join(__dirname, 'public')));

export default app;