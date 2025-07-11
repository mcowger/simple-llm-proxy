import fs from 'fs';
import path from 'path';
import { ProviderInterface } from './providers/types';
import { ProviderManager } from './providers/ProviderManager';
import { Provider } from './providers/Provider';

export const loadProvidersFromFile = (providerManager: ProviderManager) => {
    console.debug('function loadProvidersFromFile entered');

    const filePath = path.join(__dirname, '../providers.json');
    if (!fs.existsSync(filePath)) {
        console.warn('providers.json not found.');
        return;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    const providers: ProviderInterface[] = JSON.parse(data);

    providers.forEach((provider) => {
        if (!provider.id || !provider.name || !provider.url || !provider.apiKey) {
            console.error(`Invalid provider configuration: ${JSON.stringify(provider)}`);
            return;
        }
        try {
            providerManager.addProvider(new Provider(provider.id, provider.name, provider.url, provider.apiKey));
        } catch (err) {
            console.error(`Error adding provider: ${(err as Error).message}`);
        }
    });

    console.debug('function loadProvidersFromFile ended');
};
