# SiegeTD API

## Table of contents
- [General info](#general-info)
- [Main API file structure](#main-api-file-structure)
- [API technologies](#api-technologies)
- [Start development](#start-development)

## General info
This project aims to solve the server-side of the SiegeTD game, a multiplayer tower defense game. In SiegeTD a player must defend their base from scorpions, ogres and ghosts. A player can play with their friends in multiplayer sessions where live data from all players in the session is displayed in real time.

## Main API file structure
    .
    ├── src                    # Source files                    
        ├── api                     # Files related to routing of incomming requests
        └── loaders                 # Files related to loading parts of API
            ├── express.ts              # Loads express HTTP server
            ├── index.ts                # Entrypoint for loading all loaders
            └── websocket.ts            # Loads socket.io server
        └── index.ts                # Entrypoint for starting application
    ├── docker-compose.yml          # Configuration for the docker orchastration
    ├── Dockerfile                  # Docker config for running API
    ├── package.json                # Config for the node application
    └── tsconfig.json               # Language config for TypeScript

## API technologies
-   [TypeScript](https://www.typescriptlang.org/)
-   [Node](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com/)
-   [Express](https://expressjs.com/)
-   [Socket.io](https://socket.io/)
-   [Docker/Docker compose](https://www.docker.com/)

## Start development

### Requirements
- Node
- Yarn
- Docker
- Docker compose

### Start
1. (Optional) Run `yarn install`
    1. This is only required for getting types in your editior, but not required for running as the docker container has its own node_modules folder.
2. Run `docker-compose up --build`