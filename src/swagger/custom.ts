const customPaths = {
	'/api/v1/custom': {
		post: {
			summary: 'Custom Hello World Endpoint',
			description:
				'A simple endpoint that responds with a Hello World message. Used for testing or demonstration purposes.',
			tags: ['Custom Proxy Module'],
			requestBody: {
				required: false,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							description: 'No request body required for this endpoint.',
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Returns a simple Hello World message.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: {
										type: 'string',
										example: 'Hello World!',
									},
								},
							},
						},
					},
				},
			},
		},
	},
};

export default customPaths;
