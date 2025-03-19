import todo from './todo';
import auth from './auth';
import user from './user';
import chat from './chat';
import {Router} from 'express';

const router = Router();

router.use('/todos', todo);
router.use('/auth', auth);
router.use('/user', user);
router.use('/chat', chat);

export default router;