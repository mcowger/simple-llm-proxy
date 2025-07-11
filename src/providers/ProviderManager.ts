import fs from 'fs';
import { ProviderInterface } from './types';
import { Provider } from './Provider';

export class ProviderManager {
    private providers: Map<string, ProviderInterface> = new Map();
    private defaultProviderId: string | null = null;
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.loadProvidersFromFile();
        const providersArray = Array.from(this.providers.values());
        if (providersArray.length > 0) {
            this.defaultProviderId = providersArray[0].id;
            console.debug(`Default provider ID initialized to: ${this.defaultProviderId}`);
        }
    }

    private loadProvidersFromFile(): void {
        console.debug('function loadProvidersFromFile entered');

        console.info(`Loading providers from file: ${this.filePath}`);
        if (!fs.existsSync(this.filePath)) {
            console.error(`Error: providers.json file not found at ${this.filePath}`);
            process.exit(1);
        }

        let data: string;
        try {
            data = fs.readFileSync(this.filePath, 'utf-8');
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
                this.addProvider(new Provider(provider.id, provider.name, provider.url, provider.apiKey));
            } catch (err) {
                console.error(`Error adding provider: ${(err as Error).message}`);
            }
        });

        console.debug('function loadProvidersFromFile ended');
    }

    addProvider(provider: Provider): void {
        console.debug('function addProvider entered');
        if (this.providers.has(provider.id)) {
            throw new Error(`Provider with id ${provider.id} already exists.`);
        }
        this.providers.set(provider.id, provider);
        console.info(`Provider with id ${provider.id} added successfully.`);
        console.debug('function addProvider ended');
    }

    getProvider(id: string): ProviderInterface | undefined {
        console.debug('function getProvider entered');
        console.debug(`Fetching provider with id: ${id}`);
        const provider = this.providers.get(id);
        console.debug('function getProvider ended');
        return provider;
    }

    removeProvider(id: string): void {
        console.debug('function removeProvider entered');
        if (!this.providers.has(id)) {
            throw new Error(`Provider with id ${id} does not exist.`);
        }
        console.log(`Removing provider with id: ${id}`);
        this.providers.delete(id);
        console.debug('function removeProvider ended');
    }

    listProviders(): ProviderInterface[] {
        console.debug('function listProviders entered');
        const providers = Array.from(this.providers.values());
        console.debug('function listProviders ended');
        return providers;
    }

    setDefaultProvider(id: string): void {
        console.debug('function setDefaultProvider entered');
        if (!this.providers.has(id)) {
            throw new Error(`Provider with id ${id} does not exist.`);
        }
        this.defaultProviderId = id;
        console.debug(`Default provider set to: ${id}`);
        console.debug(`Default provider ID set to: ${this.defaultProviderId}`);
        console.debug('function setDefaultProvider ended');
    }

    getDefaultProvider(): ProviderInterface | null {
        console.debug('function getDefaultProvider entered');
        console.debug(`Current defaultProviderId: ${this.defaultProviderId}`);

        if (!this.defaultProviderId) {
            console.error('Error: Default provider ID is not set.');
        }
        const defaultProvider = this.defaultProviderId ? this.providers.get(this.defaultProviderId) || null : null;
        console.debug(`Returning default provider: ${defaultProvider?.id || 'None'}`);
        console.debug('function getDefaultProvider ended');
        return defaultProvider;
    }
}
