import { Router } from 'express';

import { handleOpenAI } from '../controllers/openai';

const openaiRouter = Router();

// openai proxy endpoint
openaiRouter.post('/openai/chat/completions', handleOpenAI);

export { openaiRouter };
