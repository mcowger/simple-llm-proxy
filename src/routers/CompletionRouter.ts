import { Router, Request, Response } from 'express';
import pino from 'pino';
import { ExternalService, CompletionRequest } from '../services/ExternalService';
import { ProviderManager } from '../providers/ProviderManager';

class CompletionRouter {
    private router: Router;
    private logger: pino.Logger;
    private service: ExternalService;

    constructor(
        private providerManager: ProviderManager,
        logger: pino.Logger
    ) {
        this.router = Router();
        this.logger = logger;

        const provider = this.providerManager.getDefaultProvider();
        if (!provider) {
            throw new Error('No default provider configured.');
        }

        this.service = new ExternalService(provider, this.logger);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', this.handleRequest.bind(this));
    }

    private async handleRequest(req: Request, res: Response): Promise<void> {
        try {
            const { model, messages } = req.body;

            // Always update the service with the latest default provider before processing the request
            const provider = this.providerManager.getDefaultProvider();
            if (!provider) {
                this.logger.error('No default provider configured.');
                res.status(500).json({ error: 'No default provider configured.' });
                return;
            }
            this.service = new ExternalService(provider, this.logger);

            if (!model || !Array.isArray(messages)) {
                this.logger.error('Invalid request format.');
                res.status(400).json({ error: 'Invalid request format.' });
                return;
            }

            const completionRequest: CompletionRequest = { model, messages, stream: req.body.stream === true };
            this.logger.debug(`Sending: \n${JSON.stringify(completionRequest, null, 4)}`);
            const stream = req.body.stream === true;
            if (stream) {
                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');

                await this.service.processRequest(completionRequest, (rawDataLine) => {
                    res.write(rawDataLine + '\n\n', () => {
                        if (rawDataLine.trim() === 'data: [DONE]') {
                            this.logger.debug('Stream ended.');
                        } else {
                            const rawData = rawDataLine.replace('data: ', '');
                            this.logger.debug(`Received Stream Chunk: \n${JSON.stringify(JSON.parse(rawData), null, 4)}`);
                        }
                    });
                });

                res.end();
            } else {
                const response = await this.service.processRequest(completionRequest);
                this.logger.debug(`Received: \n${JSON.stringify(response, null, 4)}`);
                this.logger.debug(`Complete`);
                res.json(response);
            }
        } catch (err: any) {
            this.logger.error(`Error processing request: ${err.message}`);
            res.status(500).json({ error: err.message || 'Internal server error' });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}

export { CompletionRouter };
