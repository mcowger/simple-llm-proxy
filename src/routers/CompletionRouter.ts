import { Router, Request, Response } from 'express';
import pino from 'pino';
import { ExternalService, CompletionRequest } from '../services/ExternalService';
import { ProviderManager } from '../providers/ProviderManager';

class CompletionRouter {
  private router: Router;
  private logger: pino.Logger;
  private service: ExternalService;

  constructor(private providerManager: ProviderManager, logger: pino.Logger) {
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

      if (!model || !Array.isArray(messages)) {
        this.logger.error('Invalid request format.');
        res.status(400).json({ error: 'Invalid request format.' });
        return;
      }

      const completionRequest: CompletionRequest = { model, messages, stream: req.body.stream === true };

      const stream = req.body.stream === true;
      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        await this.service.processRequest(completionRequest, (rawDataLine) => {
          res.write(rawDataLine + '\n\n');
        });

        res.end();
      } else {
        const response = await this.service.processRequest(completionRequest);
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
