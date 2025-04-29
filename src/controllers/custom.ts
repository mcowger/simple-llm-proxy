import { Request, Response } from 'express';

/**
 * Handles incoming requests to the /custom endpoint.
 * Returns "Hello World!" in JSON response.
 *
 * @param req request object.
 * @param res response object.
 */
const handleCustom = async (req: Request, res: Response) => {
	console.info('Request received to Custom endpoint.');
	res.json({ data: 'Hello World!' });
};

export { handleCustom };
