import * as express from 'express'
import { Share, Load } from '../../api/schema'
import { envEnum, exit, envsOrExit } from './env'
import { LevelDBStorage } from './storage-leveldb'
import { SnippetStorage } from './schema'
import { PostgresStorage } from './storage-postgres'
import { delay } from './delay'
import { RequestHandler } from 'express-serve-static-core'

async function main() {
    const storageTypes = ['postgres', 'leveldb'] as const
    const storageType = envEnum('STORAGE_TYPE', ['postgres', 'leveldb'] as const, 'leveldb') ||
        exit(`Invalid STORAGE_TYPE, must be one of ${storageTypes}`)

    // TODO: test connection, reconnect in intervals, etc.
    let storage: SnippetStorage = (() => {
        switch (storageType) {
            case 'leveldb':
                const storagePath = process.env['TSPLAY_STORAGE'] !== undefined ?
                    process.env['TSPLAY_STORAGE']! : './snippets.db'
                return LevelDBStorage.withFile(storagePath)

            case 'postgres':
                const [host, user, password] = envsOrExit('POSTGRES_HOST', 'POSTGRES_USER', 'POSTGRES_PASSWORD')
                const port = parseInt(process.env['POSTGRES_PORT'] || "5432") || 5432
                const database = process.env['POSTGRES_DATABASE'] || 'tsplay'
                return new PostgresStorage(host, port, user, password, database)
        }
    })()

    const frontendPath = process.env['FRONTEND_PATH'] ? process.env['FRONTEND_PATH'] : './frontend'

    let storageConnected = false
    setupHttpApi(storage, frontendPath, (_, res, next) => {
        if (storageConnected) {
            return next()
        }
        res.status(503).type('text/plain').send('not ready yet')
    })

    while (!storageConnected) {
        try {
            await storage.waitUntilReady()
            storageConnected = true
        } catch(e) {
            console.log("Failed to connect to storage, retrying in 10 seconds...")
            console.error(e)
            await delay(10_000)
            // TODO: max tries, configurable, etc., what is best practice here? just let orchestrator handle it?
        }
    }
}

function setupHttpApi(storage: SnippetStorage, frontendPath: string, storageReadyMiddleware: RequestHandler<any>) {
    const maxSize = 1e6
    const app = express()

    app.use('*', storageReadyMiddleware)

    app.get("/api", (_, response) => {
        response.send("Hello world")
    })

    app.get("/api/load/:snippetId", async (request, response) => {

        const id = request.params['snippetId']
        const data = await storage.get(id)
        if (data === undefined) {
            return response.status(404).send({ error: `Snippet not found` })
        }

        response.send({ code: data.code } as Load)

    })

    app.post("/api/share", (request, response) => {

        let buffer = ""
        request.on("data", chunk => {
            if (buffer.length + chunk.length > maxSize) {
                return response.status(500).send({ error: `Code longer than ${maxSize} bytes` })
            }
            buffer += chunk
        })

        request.on("end", async () => {
            const snippetId = await storage.save({ version: 1, code: buffer })
            response.send({ snippetId } as Share)
        })

    })

    // TODO: caching, health checks, auto reload during dev
    app.use("/", express.static(frontendPath))
    app.use('*', express.static(`${frontendPath}/index.html`))

    app.listen(2080, () => console.log("Server running..."))
}

process.on('SIGTERM', () => process.exit()) // TODO: clean exit
main()
