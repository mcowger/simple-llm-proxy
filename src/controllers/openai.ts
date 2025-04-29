import { Request, Response } from 'express';

import { config } from '../config';
import { fetchOpenaiResponse } from '../services/openai';

/**
 * Handles incoming requests to the /openai endpoint.
 * Forwards the chat payload to the OpenAI API, returns response back to the client.
 *
 * @param req request object.
 * @param res response object.
 */
const handleOpenAI = async (req: Request, res: Response) => {
	console.info('Request received to OpenAI endpoint.');

	if (!config.openaiApiKey) {
		return res.status(403).json('OpenAI API key not configured.');
	}

	try {
		const stream = req.body.stream === true;

		if (stream) {
			res.setHeader('Content-Type', 'text/event-stream');
			res.setHeader('Cache-Control', 'no-cache');
			res.setHeader('Connection', 'keep-alive');

			await fetchOpenaiResponse(req.body, (rawDataLine) => {
				res.write(rawDataLine + '\n\n');
			});

			res.end();
		} else {
			const json = await fetchOpenaiResponse(req.body);
			res.json(json);
		}
	} catch (err: any) {
		console.error('OpenAI proxy error:', err);
		res.status(500).json({ error: err.message || 'Internal server error' });
	}
};

export { handleOpenAI };
