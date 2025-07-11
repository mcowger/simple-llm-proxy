import { Request, Response } from 'express';
import pino from 'pino';

import { fetchOpenaiResponse } from '../services/ExternalService';
import { providerManager } from '../index';

const logger = pino();

/**
 * Handles incoming requests to the /openai endpoint.
 * Forwards the chat payload to the OpenAI API, returns response back to the client.
 *
 * @param req request object.
 * @param res response object.
 */
const handleOpenAI = async (req: Request, res: Response) => {
	logger.debug('function handleOpenAI entered');

	const provider = providerManager.getDefaultProvider();

	if (!provider) {
		return res.status(404).json({ error: `Provider not found.` });
	}

	try {
		const stream = req.body.stream === true;

		if (stream) {
			res.setHeader('Content-Type', 'text/event-stream');
			res.setHeader('Cache-Control', 'no-cache');
			res.setHeader('Connection', 'keep-alive');

			await fetchOpenaiResponse(req.body, provider.url, provider.apiKey, (rawDataLine) => {
				res.write(rawDataLine + '\n\n');
				logger.debug(`Response body: ${rawDataLine}`);
			});

			res.end();
		} else {
			const json = await fetchOpenaiResponse(req.body, provider.url, provider.apiKey);
			res.json(json);

			logger.debug(`Response headers: ${JSON.stringify(res.getHeaders(), null, 2)}`);
			logger.debug(`Response body: ${JSON.stringify(json, null, 2)}`);
		}
	} catch (err: any) {
		logger.error('OpenAI proxy error:', err);
		res.status(500).json({ error: err.message || 'Internal server error' });
	}

	logger.debug('function handleOpenAI ended');
};

export { handleOpenAI };
