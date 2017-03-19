# ts-play

A better "fiddle" for TypeScript. Work in progress.

## Building and running

### Front-end

- `npm install`
- `./setup-monaco.sh`
- `webpack -p`

### Server

- `npm install`
- `npm run build`

### Running (for development)

- in a container: `docker-compose up` (you might run into platform incompatibilities, will be resolved later)
- locally: run  `node server` in the `dist` directory

Go to `http://localhost:2080/`


### Running in production

- `sudo mkdir -p /var/lib/tsplay`
- `docker build -t tsplay .`
- `docker run -d --name=tsplay -p 2080:2080 -v /var/lib/tsplay:/storage tsplay`
