import {Router} from 'express';
import dashboardRoutes from './dashboard';
import apiRoutes from './api';

const router = Router();

router.use('/api', apiRoutes);
router.use('/', dashboardRoutes);

export default router;
