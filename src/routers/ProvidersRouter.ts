import { Router } from 'express';
import { providerManager } from '../index';
import { Provider } from '../providers/Provider';
import pino from 'pino';

const logger = pino();
const ProvidersRouter = Router();

ProvidersRouter.get('/list', (req, res) => {
    logger.debug('GET /list route called');
    res.json(providerManager.listProviders());
});

ProvidersRouter.get('/entry/:id', (req, res) => {
    const provider = providerManager.getProvider(req.params.id);
    if (!provider) {
        return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(provider);
});

ProvidersRouter.post('/entry', (req, res) => {
    const { id, name, url, apiKey } = req.body;
    if (!id || !name || !url || !apiKey) {
        return res.status(400).json({ error: 'All fields (id, name, url, apiKey) are required.' });
    }
    try {
        providerManager.addProvider(new Provider(id, name, url, apiKey));
        res.status(201).json({ message: 'Provider added successfully.', id });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

ProvidersRouter.delete('/entry/:id', (req, res) => {
    try {
        providerManager.removeProvider(req.params.id);
        res.json({ message: 'Provider deleted successfully' });
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});

ProvidersRouter.post('/default', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Provider ID is required.' });
    }
    try {
        providerManager.setDefaultProvider(id);
        res.json({ message: 'Default provider set successfully.', defaultProvider: id });
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});

ProvidersRouter.get('/default', (req, res) => {
    logger.debug('GET /default route called');
    const defaultProvider = providerManager.getDefaultProvider();
    if (!defaultProvider) {
        return res.status(404).json({ error: 'No default provider set.' });
    }
    res.json(defaultProvider);
});

export { ProvidersRouter };
