import { ProviderInterface } from './types';
import { Provider } from './Provider';

export class ProviderManager {
    private providers: Map<string, ProviderInterface> = new Map();
    private defaultProviderId: string | null = null;

    addProvider(provider: Provider): void {
        console.debug('function addProvider entered');
        if (this.providers.has(provider.id)) {
            throw new Error(`Provider with id ${provider.id} already exists.`);
        }
        this.providers.set(provider.id, provider);
        console.debug(`Provider with id ${provider.id} added successfully.`);
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
        console.debug('function setDefaultProvider ended');
    }

    getDefaultProvider(): ProviderInterface | null {
        console.debug('function getDefaultProvider entered');
        if (this.defaultProviderId === null) {
            const sortedProviders = Array.from(this.providers.values()).sort((a, b) => a.id.localeCompare(b.id));
            if (sortedProviders.length > 0) {
                this.defaultProviderId = sortedProviders[0].id;
            }
        }
        const defaultProvider = this.defaultProviderId ? this.providers.get(this.defaultProviderId) || null : null;
        console.debug('function getDefaultProvider ended');
        return defaultProvider;
    }
}
