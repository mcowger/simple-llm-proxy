import { Router } from 'express';

import { handleOpenAI } from '../controllers/openai';

const openaiRouter = Router();

// openai proxy endpoint
openaiRouter.post('/chat/completions', handleOpenAI);

export { openaiRouter };
