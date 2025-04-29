import { config } from '../config';

const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Sends a streaming chat completion request to the Gemini API via raw fetch
 * and processes the Server-Sent Events (SSE) stream manually.
 *
 * @param payload request payload containing the `model` name and `contents`.
 * @param onChunk callback function called for each raw SSE data chunk received from Gemini.
 *
 * @throws throw an error if the Gemini API response is not successful or if the response stream is missing.
 */
const streamGemini = async (
	payload: { model: string; contents: any[] },
	onChunk: (line: string) => void
): Promise<void> => {
	const { model, contents } = payload;

	if (!config.geminiApiKey) {
		throw new Error('Gemini API key is not configured.');
	}

	const url =
		`${GEMINI_API_BASE_URL}/models/${encodeURIComponent(model)}:streamGenerateContent` +
		`?alt=sse&key=${config.geminiApiKey}`;

	const response = await fetch(url, {
		body: JSON.stringify({ contents }),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});

	if (!response.ok || !response.body) {
		const errorText = await response.text();
		throw new Error(`Gemini API error ${response.status}: ${errorText}`);
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder('utf-8');
	let buffer = '';

	while (true) {
		const { value, done } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split('\n');
		buffer = lines.pop()!;

		for (const line of lines) {
			const trimmedLine = line.trim();
			if (trimmedLine.startsWith('data: ')) {
				onChunk(trimmedLine);
			}
		}
	}
};

/**
 * Sends a batch chat completion request to the Gemini API.
 *
 * @param payload request payload containing the `model` and `contents`.
 *
 * @throws throw an error if the Gemini API response is not successful.
 */
const batchGemini = async (payload: { model: string; contents: any[] }): Promise<any> => {
	const { model, contents } = payload;

	if (!config.geminiApiKey) {
		throw new Error('Gemini API key is not configured.');
	}

	const url = `${GEMINI_API_BASE_URL}/models/${encodeURIComponent(model)}:generateContent?key=${config.geminiApiKey}`;

	const response = await fetch(url, {
		body: JSON.stringify({ contents }),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Gemini API error ${response.status}: ${errorText}`);
	}

	return await response.json();
};

export { batchGemini, streamGemini };
