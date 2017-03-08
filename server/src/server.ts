import * as express from 'express'
import { Share } from '../../api/schema'
import { SnippetStorage, makeSnippet } from './snippets'

const maxSize = 1e6
const app = express()

const storagePath = process.env['TSPLAY_STORAGE'] ? process.env['TSPLAY_STORAGE'] : './snippets.db'
const storage = SnippetStorage.withFile(storagePath)

app.get("/api", (request, response) => {
    response.send("Hello world")
})

app.get("/api/load/:snippetId", async (request, response) => {

    const id = request.params['snippetId']
    const data = await storage.get(id)
    if (data === undefined) {
        return response.send(404, { error: `Snippet not found` })
    }

    response.send({ code: data.code })

})

app.post("/api/share", (request, response) => {

    let buffer = ""
    request.on("data", chunk => {
        if (buffer.length + chunk.length > maxSize) {
            return response.send(500, { error: `Code longer than ${maxSize} bytes` })
        }
        buffer += chunk
    })

    request.on("end", async () => {
       const snippetId = await storage.save(makeSnippet(buffer))
       response.send({ snippetId })
    })
    
})

app.use("/", express.static("./frontend"))
app.use('*', express.static("./frontend/index.html"))

const server = app.listen(2080, () => console.log("Server running..."))

process.on('SIGTERM', () => process.exit())
