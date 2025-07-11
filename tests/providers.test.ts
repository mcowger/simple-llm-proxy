import axios from 'axios';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';

describe('Providers Endpoint', () => {
    const baseURL = 'http://localhost:8000/providers';

    let serverProcess: any;

    beforeAll(async () => {
        // Start the server before running tests
        serverProcess = require('child_process').spawn('nodemon', [], {
            stdio: 'inherit',
        });

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for the server to start
    });

    afterAll(() => {
        // Stop the server after tests are done
        if (serverProcess) {
            serverProcess.kill();
        }
    });

    it('should add a provider successfully', async () => {
        const newProvider = {
            id: 'test-provider',
            name: 'Test Provider',
            apiKey: 'test-api-key',
            url: 'https://test-provider.com/api',
        };

        const response = await axios.post(`${baseURL}/entry`, newProvider);
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id', 'test-provider');
    });

    it('should delete a provider successfully', async () => {
        const providerId = 'test-provider';

        const response = await axios.delete(`${baseURL}/entry/${providerId}`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('message', 'Provider deleted successfully');
    });

    it('should set a default provider successfully', async () => {
        const providerId = 'test-provider';

        // Ensure the provider exists before setting it as default
        await axios.post(`${baseURL}/entry`, {
            id: providerId,
            name: 'Test Provider',
            apiKey: 'test-api-key',
            url: 'https://test-provider.com/api',
        });

        const response = await axios.post(`${baseURL}/default`, { id: providerId });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('defaultProvider', providerId);
    });

    it('should get the default provider successfully', async () => {
        const response = await axios.get(`${baseURL}/default`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id');
    });

    it('should list all providers successfully', async () => {
        const response = await axios.get(`${baseURL}/list`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });
});
