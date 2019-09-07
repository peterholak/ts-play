import * as express from 'express'
import { Share } from '../../api/schema'
import { SnippetStorage, makeSnippet } from './snippets'

const maxSize = 1e6
const app = express()

const storagePath = process.env['TSPLAY_STORAGE'] ? process.env['TSPLAY_STORAGE']! : './snippets.db'
const frontendPath = process.env['FRONTEND_PATH'] ? process.env['FRONTEND_PATH'] : './frontend'
const storage = SnippetStorage.withFile(storagePath)

app.get("/api", (request, response) => {
    response.send("Hello world")
})

app.get("/api/load/:snippetId", async (request, response) => {

    const id = request.params['snippetId']
    const data = await storage.get(id)
    if (data === undefined) {
        return response.status(404).send({ error: `Snippet not found` })
    }

    response.send({ code: data.code })

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
       const snippetId = await storage.save(makeSnippet(buffer))
       response.send({ snippetId })
    })
    
})

app.use("/", express.static(frontendPath))
app.use('*', express.static(`${frontendPath}/index.html`))

const server = app.listen(2080, () => console.log("Server running..."))

process.on('SIGTERM', () => process.exit())
