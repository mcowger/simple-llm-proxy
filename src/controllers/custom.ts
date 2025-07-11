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
	console.debug('function handleCustom entered');
	res.json({ data: 'Hello World!' });
	console.debug('function handleCustom ended');
};

export { handleCustom };
