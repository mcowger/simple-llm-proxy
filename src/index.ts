import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { customRouter } from './routers/custom';
import { openaiRouter } from './routers/openai';
import { providersRouter } from './routers/providers';
import swaggerDocument from './swagger';
import { ProviderManager } from './providers/ProviderManager';
import { loadProvidersFromFile } from './loadProviders';

const app = express();

const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;
app.use(bodyParser.json());
app.use(cors());
app.use(`${API_PREFIX}/`, openaiRouter);
app.use(`${API_PREFIX}/`, customRouter);
app.use(`${API_PREFIX}/providers`, providersRouter);

// Adding default providers
const providerManager = new ProviderManager();
loadProvidersFromFile(providerManager);

// grab all swagger path files
const swaggerDir = path.join(__dirname, './swagger');
const swaggerFiles = fs
	.readdirSync(swaggerDir)
	.filter((file) => (path.extname(file) === '.ts' || path.extname(file) === '.js') && !file.endsWith('.d.ts'));

let result = {};

const loadSwaggerFiles = async () => {
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

	console.info(`Swagger docs loaded.`);
};

loadSwaggerFiles();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.info(`LLM proxy service listening on port: ${PORT}`);
});

export { providerManager };
