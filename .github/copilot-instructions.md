# Copilot Instructions for Simple LLM Proxy

## Overview
The **Simple LLM Proxy** is a Node.js and TypeScript-based project that acts as a proxy for the OpenAI API. It also provides custom endpoints for testing purposes. The project is designed to be simple, extensible, and easy to understand. Swagger documentation is available at `/api/v1/docs` for testing and exploration.

## Architecture
The project is structured into the following key components:

- **Controllers**: Handle HTTP requests and responses. Examples include `src/controllers/openai.ts` and `src/controllers/custom.ts`.
- **Routers**: Define API routes and map them to controllers. Examples include `src/routers/openai.ts` and `src/routers/custom.ts`.
- **Services**: Contain business logic and interact with external APIs. Examples include `src/services/openai.ts`.
- **Providers**: Manage multiple LLM providers dynamically. The `ProviderManager` class in `src/providers/ProviderManager.ts` is central to this functionality.
- **Swagger**: Provides API documentation. See `src/swagger` for configuration.
- **Utilities**: Helper functions, such as `src/utils/loadProviders.ts` for loading provider configurations.

## Key Features
- Proxy for OpenAI API's chat completions endpoint (`/api/v1/openai/chat/completions`).
- Custom endpoint (`/api/v1/custom`) that returns a static "Hello World!" response.
- Dynamic provider management via `providers.json` and API endpoints.
- Swagger documentation available at `/api/v1/docs`.

## Developer Workflows

### Building and Running
- Install dependencies: `npm install`
- Start the development server: `npm run dev`
- Build the project: `npm run build`
- Start the production server: `npm start`

### Testing
- Run the test server: `node scripts/testServer.js`

### Debugging
- Use `nodemon` for live-reloading during development. Configuration is in `nodemon.json`.
- Logs are printed to the console for easy debugging.

## Project-Specific Conventions
- **Provider Configuration**: Providers are defined in `providers.json`. Each provider has an `id`, `name`, `url`, and `apiKey`.
- **Dynamic Providers**: Use the `ProviderManager` class to manage and switch between providers at runtime.
- **Swagger Integration**: All endpoints are documented using Swagger. Update Swagger files in `src/swagger` when adding new endpoints.

## External Dependencies
- **OpenAI API**: The primary external dependency for the `/api/v1/chat/completions` endpoint.
- **Swagger**: Used for API documentation.

## Examples

### Adding a New Provider
1. Update `providers.json` with the new provider's details:
   ```json
   {
     "id": "new-provider",
     "name": "NewProvider",
     "url": "https://newprovider.com/api/v1",
     "apiKey": "sk-new-..."
   }
   ```
2. Use the API to select the new provider at runtime.

### Adding a New Endpoint
1. Create a new controller in `src/controllers`.
2. Define the route in `src/routers`.
3. Update Swagger documentation in `src/swagger`.

## Key Files and Directories
- `src/controllers`: Contains request handlers.
- `src/routers`: Defines API routes.
- `src/services`: Contains business logic.
- `src/providers`: Manages LLM providers.
- `src/swagger`: Configures Swagger documentation.
- `src/utils`: Contains utility functions.
- `providers.json`: Configures LLM providers.

For more details, refer to the [README.md](../README.md).
