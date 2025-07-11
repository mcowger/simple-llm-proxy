import { Request, Response } from 'express';

import { fetchOpenaiResponse } from '../services/openai';
import { providerManager } from '../index';

/**
 * Handles incoming requests to the /openai endpoint.
 * Forwards the chat payload to the OpenAI API, returns response back to the client.
 *
 * @param req request object.
 * @param res response object.
 */
const handleOpenAI = async (req: Request, res: Response) => {
	console.debug('function handleOpenAI entered');

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
				console.debug(`Response body: ${rawDataLine}`);
			});

			res.end();
		} else {
			const json = await fetchOpenaiResponse(req.body, provider.url, provider.apiKey);
			res.json(json);

			console.debug(`Response headers: ${JSON.stringify(res.getHeaders(), null, 2)}`);
			console.debug(`Response body: ${JSON.stringify(json, null, 2)}`);
		}
	} catch (err: any) {
		console.error('OpenAI proxy error:', err);
		res.status(500).json({ error: err.message || 'Internal server error' });
	}

	console.debug('function handleOpenAI ended');
};

export { handleOpenAI };
