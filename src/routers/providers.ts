import { Router } from 'express';
import { providerManager } from '../index';
import { Provider } from '../providers/Provider';

const providersRouter = Router();

providersRouter.get('/', (req, res) => {
    res.json(providerManager.listProviders());
});

providersRouter.get('/:id', (req, res) => {
    const provider = providerManager.getProvider(req.params.id);
    if (!provider) {
        return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(provider);
});

providersRouter.post('/', (req, res) => {
    const { id, name, url, apiKey } = req.body;
    if (!id || !name || !url || !apiKey) {
        return res.status(400).json({ error: 'All fields (id, name, url, apiKey) are required.' });
    }
    try {
        providerManager.addProvider(new Provider(id, name, url, apiKey));
        res.status(201).json({ message: 'Provider added successfully.' });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

providersRouter.delete('/:id', (req, res) => {
    try {
        providerManager.removeProvider(req.params.id);
        res.json({ message: 'Provider deleted successfully.' });
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});

export { providersRouter };
