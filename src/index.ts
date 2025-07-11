import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pretty from 'pino-pretty';

import { CompletionRouter } from './routers/CompletionRouter';
import { ProviderManager } from './providers/ProviderManager';
import swaggerDocument from './swagger/swagger';
import { ExternalService } from './services/ExternalService';
import { providersRouter } from './routers/providers';

const app = express();

const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;
app.use(bodyParser.json());
app.use(cors());

// Parse command-line arguments
const argv = yargs(hideBin(process.argv))
	.option('providers', {
		type: 'string',
		demandOption: true,
		describe: 'Path to the providers.json file',
	})
	.help()
	.parseSync();

// Initialize pino logger with pino-pretty for formatted logs
const logger = pino(pretty({
	colorize: true, // Enable colorized output
	translateTime: 'SYS:standard', // Human-readable timestamps
}));

// Integrate pino-http with Express
app.use(pinoHttp({
	logger,
}));

// Adding default providers
const providerManager = new ProviderManager(argv.providers, logger);
const completionRouter = new CompletionRouter(providerManager, logger);
app.use(`${API_PREFIX}/chat/completions`, completionRouter.getRouter());
app.use(`/providers`, providersRouter);

// grab all swagger path files
const swaggerDir = path.join(__dirname, './swagger');
const swaggerFiles = fs
	.readdirSync(swaggerDir)
	.filter((file) => (path.extname(file) === '.ts' || path.extname(file) === '.js') && !file.endsWith('.d.ts'));

let result = {};

const loadSwaggerFiles = async () => {
	logger.debug('function loadSwaggerFiles entered');
	for (const file of swaggerFiles) {
		const filePath = path.join(__dirname, './swagger', file);
		const fileData = await import(filePath);
		result = { ...result, ...fileData.default };
	}

	(swaggerDocument as any).paths = result;

	app.use(
		`${API_PREFIX}/docs`,
		(req: any, res: any, next: any) => {
			req.swaggerDoc = swaggerDocument;
			next();
		},
		swaggerUi.serveFiles(swaggerDocument, {
			swaggerOptions: { defaultModelsExpandDepth: -1 },
		}),
		swaggerUi.setup()
	);

	logger.info(`Swagger docs loaded.`);
	logger.debug('function loadSwaggerFiles ended');
};

loadSwaggerFiles();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	logger.info(`LLM proxy service listening on port: ${PORT}`);
});

export { providerManager };
