import todo from './todo';
import {Router} from 'express';

const router = Router();

router.use('/todos', todo);

export default router;