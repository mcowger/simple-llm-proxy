import { Request, Response } from 'express';

import { config } from '../config';
import { batchGemini, streamGemini } from '../services/gemini';

/**
 * Validates incoming Gemini requests and extracts model + contents.
 */
const validateGeminiPayload = (req: Request) => {
	if (!config.geminiApiKey) {
		throw { message: 'Gemini API key not configured.', status: 403 };
	}

	const model = req.params.model;
	const { contents } = req.body;

	if (!Array.isArray(contents)) {
		throw { message: '`contents` array is required.', status: 400 };
	}

	return { contents, model };
};

/**
 * Handles incoming requests to the /gemini endpoint.
 * Forwards the Gemini payload to the Gemini API, streams the raw SSE response back to the client.
 *
 * @param req request object.
 * @param res response object.
 */
const handleGeminiStream = async (req: Request, res: Response) => {
	console.info('Request received to Gemini stream endpoint.');
	try {
		const { model, contents } = validateGeminiPayload(req);

		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');

		await streamGemini({ contents, model }, (rawDataLine: string) => {
			res.write(rawDataLine + '\n\n');
		});

		res.end();
	} catch (err: any) {
		console.error('Gemini stream error:', err);
		res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
	}
};

/**
 * Handles incoming requests to the /gemini batch endpoint.
 * Forwards the Gemini payload to the Gemini API, batches response back to the client.
 *
 * @param req request object.
 * @param res response object.
 */
const handleGeminiBatch = async (req: Request, res: Response) => {
	console.info('Request received to Gemini batch endpoint.');

	try {
		const { model, contents } = validateGeminiPayload(req);
		const data = await batchGemini({ contents, model });
		res.json(data);
	} catch (err: any) {
		console.error('Gemini batch error:', err);
		res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
	}
};

export { handleGeminiBatch, handleGeminiStream };
