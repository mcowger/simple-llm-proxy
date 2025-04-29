import { Router } from 'express';

import { handleCustom } from '../controllers/custom';

const customRouter = Router();

// custom proxy endpoint
customRouter.post('/custom', handleCustom);

export { customRouter };
