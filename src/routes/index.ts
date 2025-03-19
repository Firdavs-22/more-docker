import todo from './todo';
import auth from './auth';
import user from './user';
import {Router} from 'express';

const router = Router();

router.use('/todos', todo);
router.use('/auth', auth);
router.use('/user', user);

export default router;