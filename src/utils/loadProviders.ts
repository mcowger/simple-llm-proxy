import fs from 'fs';
import path from 'path';
import { ProviderInterface } from '../providers/types';
import { ProviderManager } from '../providers/ProviderManager';
import { Provider } from '../providers/Provider';

export const loadProvidersFromFile = (providerManager: ProviderManager, filePath: string) => {
    console.debug('function loadProvidersFromFile entered');

    console.debug(`Loading providers from file: ${filePath}`);
    if (!fs.existsSync(filePath)) {
        console.error(`Error: providers.json file not found at ${filePath}`);
        process.exit(1);
    }

    let data: string;
    try {
        data = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
        console.error(`Error reading providers.json file: ${(err as Error).message}`);
        process.exit(1);
    }

    let providers: ProviderInterface[];
    try {
        providers = JSON.parse(data);
    } catch (err) {
        console.error(`Error parsing providers.json file: ${(err as Error).message}`);
        process.exit(1);
    }

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
