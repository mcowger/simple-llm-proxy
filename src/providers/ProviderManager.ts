import { ProviderInterface } from './types';
import { Provider } from './Provider';

export class ProviderManager {
    private providers: Map<string, ProviderInterface> = new Map();
    private defaultProviderId: string | null = null;

    addProvider(provider: Provider): void {
        if (this.providers.has(provider.id)) {
            throw new Error(`Provider with id ${provider.id} already exists.`);
        }
        this.providers.set(provider.id, provider);
    }

    getProvider(id: string): ProviderInterface | undefined {
        return this.providers.get(id);
    }

    removeProvider(id: string): void {
        this.providers.delete(id);
    }

    listProviders(): ProviderInterface[] {
        return Array.from(this.providers.values());
    }

    deleteProvider(id: string): void {
        if (!this.providers.has(id)) {
            throw new Error(`Provider with id ${id} does not exist.`);
        }
        this.providers.delete(id);
    }

    setDefaultProvider(id: string): void {
        if (!this.providers.has(id)) {
            throw new Error(`Provider with id ${id} does not exist.`);
        }
        this.defaultProviderId = id;
    }

    getDefaultProvider(): ProviderInterface | null {
        if (this.defaultProviderId === null) {
            const sortedProviders = Array.from(this.providers.values()).sort((a, b) => a.id.localeCompare(b.id));
            if (sortedProviders.length > 0) {
                this.defaultProviderId = sortedProviders[0].id;
            }
        }
        return this.defaultProviderId ? this.providers.get(this.defaultProviderId) || null : null;
    }
}
