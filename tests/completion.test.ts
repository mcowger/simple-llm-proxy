import axios from 'axios';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';

describe('Completion Endpoint', () => {
    const baseURL = 'http://localhost:8000/api/v1';
    const testPayload = {
        model: "openrouter/cypher-alpha:free",
        messages: [
            {
                role: "user",
                content: "Hello, world!"
            }
        ]
    };

    let serverProcess: any;

    beforeAll(async () => {
        // Start the server before running tests
        serverProcess = require('child_process').spawn('nodemon', [], {
            stdio: 'inherit',
        });

        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for the server to start
    });

    afterAll(() => {
        // Stop the server after tests are done
        if (serverProcess) {
            serverProcess.kill();
        }
    });

    it('should return a valid response for the completion endpoint', async () => {
        try {
            const response = await axios.post(`${baseURL}/chat/completions`, testPayload);
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('choices');
            expect(response.data.choices.length).toBeGreaterThan(0);
        } catch (error) {
            const errorMessage = (error as any).response?.data || (error as any).message;
            throw new Error(`Test failed with error: ${errorMessage}`);
        }
    });
});
