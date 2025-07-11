const providerSwagger = {
    summary: "APIs to manage and query provider resources.",
    tags: ['Providers'],
    '/api/v1/providers': {
        get: {
            summary: 'List all providers',
            description: 'Retrieve a list of all registered providers.',
            tags: ['Providers'],
            responses: {
                '200': {
                    description: 'A list of providers.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        name: { type: 'string' },
                                        url: { type: 'string' },
                                        apiKey: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        post: {
            summary: 'Add a new provider',
            description: 'Create a new provider with the given details.',
            tags: ['Providers'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                url: { type: 'string' },
                                apiKey: { type: 'string' },
                            },
                            required: ['id', 'name', 'url', 'apiKey'],
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Provider added successfully.',
                },
                '400': {
                    description: 'Invalid input or provider already exists.',
                },
            },
        },
    },
    '/api/v1/providers/{id}': {
        get: {
            summary: 'Get provider by ID',
            description: 'Retrieve details of a specific provider by its ID.',
            tags: ['Providers'],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'The ID of the provider.',
                },
            ],
            responses: {
                '200': {
                    description: 'Provider details.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    url: { type: 'string' },
                                    apiKey: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                '404': {
                    description: 'Provider not found.',
                },
            },
        },
        delete: {
            summary: 'Delete a provider by ID',
            description: 'Remove a provider from the system using its ID.',
            tags: ['Providers'],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'The ID of the provider to delete.',
                },
            ],
            responses: {
                '200': {
                    description: 'Provider deleted successfully.',
                },
                '404': {
                    description: 'Provider not found.',
                },
            },
        },
    },
};

export default providerSwagger;
