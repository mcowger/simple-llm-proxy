import pino from 'pino';
import { ProviderInterface } from '../providers/types';

export type CompletionRequest = {
	model: string;
	messages: Message[];
	stream?: boolean; // Optional property to indicate streaming
};

export type Message = {
	role: string;
	content: string;
};

class ExternalService {
	private logger: pino.Logger;

	constructor(private provider: ProviderInterface, logger: pino.Logger) {
		this.logger = logger;
	}

	public async processRequest(
		request: CompletionRequest,
		onChunk?: (line: string) => void,
	): Promise<any> {
		if (!this.provider.apiKey) {
			throw new Error('API key is not provided.');
		}

		const headers: Record<string, string> = {
			Authorization: `Bearer ${this.provider.apiKey}`,
			'Content-Type': 'application/json',
		};

		const url = `${this.provider.url}/chat/completions`;

		const response = await fetch(url, {
			body: JSON.stringify(request),
			headers,
			method: 'POST',
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`API error ${response.status}: ${errorText}`);
		}
		if (request.stream) {
			const reader = response.body!.getReader();
			const decoder = new TextDecoder('utf-8');
			let buffer = '';

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop()!;

				for (const line of lines) {
					const trimmed = line.trim();
					if (trimmed.startsWith('data: ') && onChunk) {
						onChunk(trimmed);
					}
				}
			}
			return;
		} else {
			const json = await response.json();
			return json;
		}
	}
}


export { ExternalService };
