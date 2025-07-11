import { ProviderInterface } from './types';

export class Provider implements ProviderInterface {
    id: string;
    name: string;
    url: string;
    apiKey: string;

    constructor(id: string, name: string, url: string, apiKey: string) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.apiKey = apiKey;
    }
}
