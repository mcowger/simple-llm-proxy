<p align="center">
  <img width="200px" src="https://raw.githubusercontent.com/tjtanjin/llm-proxy/main/assets/logo.png" />
  <h1 align="center">LLM Proxy</h1>
</p>

<p align="center">
  <a href="https://github.com/tjtanjin/llm-proxy/actions/workflows/ci-cd-pipeline.yml"> <img src="https://github.com/tjtanjin/llm-proxy/actions/workflows/ci-cd-pipeline.yml/badge.svg" /> </a>
</p>

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
**LLM Proxy** is a simple demo project that serves as a proxy for [**OpenAI API**](https://platform.openai.com/) and [**Google Gemini API**](https://ai.google.dev/gemini-api/docs). It also provides an additional custom endpoint for testing purposes, all of which are exposed via [**swagger docs**](https://swagger.io/docs/) under the `/api/v1/docs` endpoint. This demo project was created in private during the development of [**LLM Connector**](https://github.com/React-ChatBotify-Plugins/llm-connector) - an official [**React ChatBotify**](https://react-chatbotify.com) plugin. It has since been made public to serve as a simple demo project (not just for plugin users, but also anyone interested in a simple LLM proxy).

Note that this LLM Proxy **is not an official project of React ChatBotify**. With that said, while issues/pull requests are welcome, support for this demo project is **not guaranteed**.

### Features
This demo project exposes a total of 5 endpoints which are listed below:

- `/api/v1/openai/chat/completions`
- `/api/v1/gemini/models/:model:generateContent`
- `/api/v1/gemini/models/:model:streamGenerateContent`
- `/api/v1/custom`
- `/api/v1/docs`

The first 3 endpoints match those provided by OpenAI and Google Gemini. The 4th custom endpoint **always** returns "Hello World!" in a JSON response for testing. The 5th endpoint exposes the swagger docs page for easy testing.

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
- https://github.com/tjtanjin/llm-proxy

### Docker Deployment
Deploying the project is simple with Docker.

1) First, if you have not done so, create a *.env* file from the provided [*.env.template*](https://github.com/tjtanjin/llm-proxy/blob/master/.env.template) and update the variables. 
2) If you are using the project as it is (**i.e. no intended code changes**), then simply run `./deploy.sh llm-proxy` within the scripts folder and your deployment will be automatically done! Otherwise, if you wish to make code changes to the project, please read on.
3) Once you are done with your code changes, you would have to build your own docker image with the following command (take note to replace the tag `-t` with that of your own):
    ```
    docker build -t tjtanjin/llm-proxy .
    ```
4) Upon creating your image, you may then start your container with the following command (remember to replace image name below if you built your own image):
    ```
    docker run -d -p 8000:8000 --name llm-proxy --env-file .env tjtanjin/llm-proxy:main
    ```
    Note: Notice that the *.env* file we configured in **step 1** is being passed via the `--env-file` argument. This is true for the automated/scripted deployment in **step 2** as well. Hence, ensure that you have setup your configuration properly before passing in the file.
5) Visit `http://localhost:8000/api/v1/docs` for the swagger docs page!
6) Finally, you may wish to **update the deployment script** to reference your own image/container if you would like to have an easier deployment workflow.

### Development Setup
The following section will guide you through setting up your own LLM Proxy.
1) First, `cd` to the directory of where you wish to store the project and clone this repository. An example is provided below:
    ```
    cd /home/user/exampleuser/projects/
    git clone https://github.com/tjtanjin/llm-proxy.git
    ```
2) Once the project has been cloned, `cd` into it and install required dependencies with the following command:
    ```
    npm install
    ```
3) Following which, create (or copy) a *.env* file at the root of the project using the provided [*.env.template*](https://github.com/tjtanjin/llm-proxy/blob/master/.env.template) and update the relevant variables (e.g. API Keys).
4) You can also feel free to modify the other variables as you deem fit. Clear descriptions for the variables have been included in the [*.env.template*](https://github.com/tjtanjin/llm-proxy/blob/master/.env.template) file.
5) When ready, launch away with the following command:
    ```
    npm run dev
    ```
6) Visit `http://localhost:8000/api/v1/docs` for the swagger docs page!

### Team
* [Tan Jin](https://github.com/tjtanjin)

### Contributing
Given the simplicity and narrowly scoped purpose of this project, there is **no developer guide**. Feel free to submit pull requests if you wish to make improvements or fixes.

Alternatively, you may contact me via [**discord**](https://discord.gg/X8VSdZvBQY) or simply raise bugs or suggestions by opening an [**issue**](https://github.com/tjtanjin/llm-proxy/issues).

### Others
For any questions regarding the implementation of the project, you may reach out on [**discord**](https://discord.gg/X8VSdZvBQY) or drop an email to: cjtanjin@gmail.com.
