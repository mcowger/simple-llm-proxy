## Table of Contents
* [Introduction](#introduction)
* [Features](#features)
* [Technologies](#technologies)
* [Docker Deployment](#docker-deployment)
* [Development Setup](#development-setup)
* [Team](#team)
* [Contributing](#contributing)
* [Others](#others)

### Introduction
**Simple LLM Proxy** is a simple proxy project that serves as a proxy for [**OpenAI API**](https://platform.openai.com/)  It also provides an additional custom endpoint for testing purposes, all of which are exposed via [**swagger docs**](https://swagger.io/docs/) under the `/api/v1/docs` endpoint. This demo project was forked from https://github.com/tjtanjin/llm-proxy with the expectation that major changes would be made that did not fit the original intent of that project.  But it was a great base, with simple and easy to understand code.


### Features
This demo project exposes a total of 5 endpoints which are listed below:

- `/api/v1/openai/chat/completions`
- `/api/v1/custom`
- `/api/v1/docs`

The first endpoint matches the OpenAI API's chat completions endpoint, both streaming and not. The second custom endpoint **always** returns "Hello World!" in a JSON response for testing. The third endpoint exposes the Swagger documentation page for easy testing.

### Provider Management

LLM Proxy supports dynamic management of multiple providers through its API and the `providerManager` class. You can switch between providers at runtime, allowing flexible routing of requests to different LLM backends. Providers are configured in a `provider.json` file, which uses a simple JSON object format. Each key is the provider's name, and its value contains the provider's type and required credentials or settings. For example:

```json
[
  {
    "id": "openrouter-a",
    "name": "OpenRouterA",
    "url": "https://openrouter.ai/api/v1",
    "apiKey": "sk-or-v1-..."
  },
  {
    "id": "openrouter-b",
    "name": "OpenRouterB",
    "url": "https://openrouter.ai/api/v1",
    "apiKey": "sk-or-v1-..."
  }
]

```

The API exposes endpoints to list, select, and update providers, making it easy to adapt to different environments or requirements without restarting the service.

### Technologies
Technologies used by LLM Proxy are as below:

#### Done with:

<p align="center">
  <img height="150" width="150" src="https://static-00.iconduck.com/assets.00/node-js-icon-454x512-nztofx17.png" />
</p>
<p align="center">
NodeJS
</p>
<p align="center">
  <img height="150" width="150" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" />
</p>
<p align="center">
Typescript
</p>

#### Project Repository
- https://github.com/mcowger/simple-llm-proxy

