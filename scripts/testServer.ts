import axios from 'axios';

const testPayload = {
    model: "openrouter/cypher-alpha:free",
    messages: [
        {
            role: "user",
            content: "Hello, world!"
        }
    ]
};

const testServer = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/chat/completions', testPayload);
        console.log('Response from server:', response.data);
    } catch (error) {
        console.error('Error during test:', (error as any).response?.data || (error as any).message);
    }
};

testServer();
