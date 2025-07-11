import fs from 'fs';
import pino from 'pino';
import { ProviderInterface } from './types';
import { Provider } from './Provider';

export class ProviderManager {
    private providers: Map<string, ProviderInterface> = new Map();
    private defaultProviderId: string | null = null;
    private filePath: string;
    private logger: pino.Logger;

    constructor(filePath: string, logger: pino.Logger) {
        this.filePath = filePath;
        this.logger = logger;
        this.loadProvidersFromFile();
        const providersArray = Array.from(this.providers.values());
        if (providersArray.length > 0) {
            this.defaultProviderId = providersArray[0].id;
            this.logger.debug(`Default provider ID initialized to: ${this.defaultProviderId}`);
        }
    }

    private loadProvidersFromFile(): void {
        this.logger.debug('function loadProvidersFromFile entered');

        this.logger.info(`Loading providers from file: ${this.filePath}`);
        if (!fs.existsSync(this.filePath)) {
            this.logger.error(`Error: providers.json file not found at ${this.filePath}`);
            process.exit(1);
        }

        let data: string;
        try {
            data = fs.readFileSync(this.filePath, 'utf-8');
        } catch (err) {
            this.logger.error(`Error reading providers.json file: ${(err as Error).message}`);
            process.exit(1);
        }

        let providers: ProviderInterface[];
        try {
            providers = JSON.parse(data);
        } catch (err) {
            this.logger.error(`Error parsing providers.json file: ${(err as Error).message}`);
            process.exit(1);
        }

        providers.forEach((provider) => {
            if (!provider.id || !provider.name || !provider.url || !provider.apiKey) {
                this.logger.error(`Invalid provider configuration: ${JSON.stringify(provider)}`);
                return;
            }
            try {
                this.addProvider(new Provider(provider.id, provider.name, provider.url, provider.apiKey));
            } catch (err) {
                this.logger.error(`Error adding provider: ${(err as Error).message}`);
            }
        });

        this.logger.debug('function loadProvidersFromFile ended');
    }

    addProvider(provider: Provider): void {
        this.logger.debug('function addProvider entered');
        if (this.providers.has(provider.id)) {
            throw new Error(`Provider with id ${provider.id} already exists.`);
        }
        this.providers.set(provider.id, provider);
        this.logger.info(`Provider with id ${provider.id} added successfully.`);
        this.logger.debug('function addProvider ended');
    }

    getProvider(id: string): ProviderInterface | undefined {
        this.logger.debug('function getProvider entered');
        this.logger.debug(`Fetching provider with id: ${id}`);
        const provider = this.providers.get(id);
        this.logger.debug('function getProvider ended');
        return provider;
    }

    removeProvider(id: string): void {
        this.logger.debug('function removeProvider entered');
        if (!this.providers.has(id)) {
            throw new Error(`Provider with id ${id} does not exist.`);
        }
        this.logger.info(`Removing provider with id: ${id}`);
        this.providers.delete(id);
        this.logger.debug('function removeProvider ended');
    }

    listProviders(): ProviderInterface[] {
        this.logger.debug('function listProviders entered');
        const providers = Array.from(this.providers.values());
        this.logger.debug('function listProviders ended');
        return providers;
    }

    setDefaultProvider(id: string): void {
        this.logger.debug('function setDefaultProvider entered');
        if (!this.providers.has(id)) {
            throw new Error(`Provider with id ${id} does not exist.`);
        }
        this.defaultProviderId = id;
        this.logger.debug(`Default provider set to: ${id}`);
        this.logger.debug(`Default provider ID set to: ${this.defaultProviderId}`);
        this.logger.debug('function setDefaultProvider ended');
    }

    getDefaultProvider(): ProviderInterface | null {
        this.logger.debug('function getDefaultProvider entered');
        this.logger.debug(`Current defaultProviderId: ${this.defaultProviderId}`);

        if (!this.defaultProviderId) {
            this.logger.error('Error: Default provider ID is not set.');
        }
        const defaultProvider = this.defaultProviderId ? this.providers.get(this.defaultProviderId) || null : null;
        this.logger.debug(`Returning default provider: ${defaultProvider?.id || 'None'}`);
        this.logger.debug('function getDefaultProvider ended');
        return defaultProvider;
    }
}
