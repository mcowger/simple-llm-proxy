const openaiPaths = {
	'/api/v1/openai/chat/completions': {
		post: {
			description:
				"Forwards the provided payload to OpenAI's `v1/chat/completions` endpoint. " +
				'If `stream: true` is set in the request body, the response is streamed back as Server-Sent Events (SSE), ' +
				"with each event matching OpenAI's `chat.completion.chunk` format. " +
				'If `stream` is omitted or false, a full JSON response is returned.',
			requestBody: {
				content: {
					'application/json': {
						example: {
							messages: [{ content: 'Tell me a story about dragons.', role: 'user' }],
							model: 'gpt-4.1-nano',
							stream: true,
							temperature: 0.7,
						},
						schema: {
							properties: {
								messages: {
									description: 'Chat history as an array of message objects.',
									items: {
										properties: {
											content: { type: 'string' },
											role: { enum: ['system', 'user', 'assistant'], type: 'string' },
										},
										required: ['role', 'content'],
										type: 'object',
									},
									type: 'array',
								},
								model: {
									description: 'The OpenAI model to use (e.g., `gpt-4.1-nano`, `gpt-3.5-turbo`).',
									type: 'string',
								},
								stream: {
									default: true,
									description: 'Whether to stream the response (must be `true` for streaming).',
									type: 'boolean',
								},
								temperature: {
									description: 'Sampling temperature to use (optional).',
									type: 'number',
								},
								top_p: {
									description: 'Nucleus sampling parameter (optional).',
									type: 'number',
								},
							},
							required: ['model', 'messages'],
							type: 'object',
						},
					},
				},
				required: true,
			},
			responses: {
				'200': {
					content: {
						'text/event-stream': {
							schema: {
								description:
									'Stream of server-sent events, each prefixed with `data:` containing a chat completion chunk.',
								example: `data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1697401819,"model":"gpt-4.1-nano","choices":[{"delta":{"content":"Hello"},"index":0,"finish_reason":null}]}\n\n`,
								type: 'string',
							},
						},
					},
					description:
						"Streams the OpenAI API response via Server-Sent Events (SSE). Each event is a `data:` line containing a JSON chunk following OpenAI's streaming format.",
				},
				'403': {
					content: {
						'application/json': {
							example: 'OpenAI API key not configured.',
							schema: { type: 'string' },
						},
					},
					description: 'OpenAI API key not configured.',
				},
				'500': {
					content: {
						'application/json': {
							example: {
								error: 'Some internal error message.',
							},
							schema: {
								properties: {
									error: { type: 'string' },
								},
								type: 'object',
							},
						},
					},
					description: 'Internal server error during request forwarding.',
				},
			},
			summary: "Proxy to OpenAI's chat completion API",
			tags: ['OpenAI Proxy Module'],
		},
	},
};

export default openaiPaths;
