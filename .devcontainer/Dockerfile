# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.166.1/containers/typescript-node/.devcontainer/base.Dockerfile

ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

RUN su node -c "npm i -g @nestjs/cli"