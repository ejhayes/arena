import {Router} from 'express';
import jobAdd from './jobAdd';
import jobPromote from './jobPromote';
import jobRetry from './jobRetry';
import jobRemove from './jobRemove';
import bulkJobsPromote from './bulkJobsPromote';
import bulkJobsRemove from './bulkJobsRemove';
import bulkJobsRetry from './bulkJobsRetry';

const router = Router();

router.post('/queue/:queueHost/:queueName/job', jobAdd);
router.post('/queue/:queueHost/:queueName/job/bulk', bulkJobsRemove);
router.patch('/queue/:queueHost/:queueName/job/bulk', bulkJobsRetry);
router.patch('/queue/:queueHost/:queueName/delayed/job/bulk', bulkJobsPromote);
router.patch('/queue/:queueHost/:queueName/delayed/job/:id', jobPromote);
router.patch('/queue/:queueHost/:queueName/job/:id', jobRetry);
router.delete('/queue/:queueHost/:queueName/job/:id', jobRemove);

export default router;
