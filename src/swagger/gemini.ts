const geminiPaths = {
	'/api/v1/gemini/models/{model}:generateContent': {
		post: {
			description:
				"Sends the provided contents to Gemini's `generateContent` endpoint and returns a full JSON response.",
			parameters: [
				{
					description: 'Gemini model name (e.g., `gemini-1.5-flash`).',
					example: 'gemini-1.5-flash',
					in: 'path',
					name: 'model',
					required: true,
					schema: { type: 'string' },
				},
			],
			requestBody: {
				content: {
					'application/json': {
						example: {
							contents: [
								{
									parts: [{ text: 'Hello Gemini!' }],
									role: 'user',
								},
							],
						},
						schema: {
							properties: {
								contents: {
									description: 'Conversation messages to send to Gemini.',
									items: {
										properties: {
											parts: {
												items: {
													properties: {
														text: { type: 'string' },
													},
													required: ['text'],
													type: 'object',
												},
												type: 'array',
											},
											role: {
												enum: ['user', 'model'],
												type: 'string',
											},
										},
										required: ['role', 'parts'],
										type: 'object',
									},
									type: 'array',
								},
							},
							required: ['contents'],
							type: 'object',
						},
					},
				},
				required: true,
			},
			responses: {
				'200': {
					content: {
						'application/json': {
							schema: {
								description: 'Full Gemini response.',
								type: 'object',
							},
						},
					},
					description: 'Successful JSON response from Gemini.',
				},
				'400': {
					content: {
						'application/json': {
							example: { error: '`contents` array is required.' },
							schema: {
								properties: { error: { type: 'string' } },
								type: 'object',
							},
						},
					},
					description: 'Bad request — missing or invalid `contents`.',
				},
				'403': {
					content: {
						'application/json': {
							example: 'Gemini API key not configured.',
							schema: { type: 'string' },
						},
					},
					description: 'Gemini API key not configured.',
				},
				'500': {
					content: {
						'application/json': {
							example: { error: 'Internal server error.' },
							schema: {
								properties: { error: { type: 'string' } },
								type: 'object',
							},
						},
					},
					description: 'Internal server error proxying to Gemini.',
				},
			},
			summary: 'Proxy to Gemini’s batch API',
			tags: ['Gemini Proxy Module'],
		},
	},
	'/api/v1/gemini/models/{model}:streamGenerateContent': {
		post: {
			description:
				"Forwards the provided contents to Gemini's `streamGenerateContent` endpoint and streams back the SSE response.",
			parameters: [
				{
					description: 'Gemini model name (e.g., `gemini-1.5-flash`).',
					example: 'gemini-1.5-flash',
					in: 'path',
					name: 'model',
					required: true,
					schema: { type: 'string' },
				},
			],
			requestBody: {
				content: {
					'application/json': {
						example: {
							contents: [
								{
									parts: [{ text: 'Hello Gemini!' }],
									role: 'user',
								},
							],
						},
						schema: {
							properties: {
								contents: {
									description: 'Conversation messages to send to Gemini.',
									items: {
										properties: {
											parts: {
												items: {
													properties: {
														text: { type: 'string' },
													},
													required: ['text'],
													type: 'object',
												},
												type: 'array',
											},
											role: {
												enum: ['user', 'model'],
												type: 'string',
											},
										},
										required: ['role', 'parts'],
										type: 'object',
									},
									type: 'array',
								},
							},
							required: ['contents'],
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
								description: 'Stream of server-sent events prefixed with `data:`.',
								example: `data: {"candidates":[{"content":{"parts":[{"text":"Hello"}]}}]}\n\n`,
								type: 'string',
							},
						},
					},
					description: "SSE stream from Gemini's `streamGenerateContent` API.",
				},
				'400': {
					content: {
						'application/json': {
							example: { error: '`contents` array is required.' },
							schema: {
								properties: { error: { type: 'string' } },
								type: 'object',
							},
						},
					},
					description: 'Bad request — missing or invalid `contents`.',
				},
				'403': {
					content: {
						'application/json': {
							example: 'Gemini API key not configured.',
							schema: { type: 'string' },
						},
					},
					description: 'Gemini API key not configured.',
				},
				'500': {
					content: {
						'application/json': {
							example: { error: 'Internal server error.' },
							schema: {
								properties: { error: { type: 'string' } },
								type: 'object',
							},
						},
					},
					description: 'Internal server error proxying to Gemini.',
				},
			},
			summary: 'Proxy to Gemini’s streaming API',
			tags: ['Gemini Proxy Module'],
		},
	},
};

export default geminiPaths;
