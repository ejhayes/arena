import {Router} from 'express';
import queueList from './queueList';
import queueDetails from './queueDetails';
import queueJobsByState from './queueJobsByState';
import jobDetails from './jobDetails';

const router = Router();

router.get('/', queueList);
router.get('/:queueHost/:queueName', queueDetails);
router.get(
  '/:queueHost/:queueName/:state(waiting|active|completed|succeeded|failed|delayed|waiting-children).:ext?',
  queueJobsByState
);
router.get('/:queueHost/:queueName/:id', jobDetails);

export default router;
