import * as express from 'express'
import * as childProcess from 'child_process'

const command = `node ${process.argv[2]}`

console.log(`Will reload '${command}' when triggered.`)

let tsplay: childProcess.ChildProcess
function startTsPlay() {
    tsplay = childProcess.exec(command)
    tsplay.stdout!.on('data', (chunk: any) => process.stdout!.write(`> ${chunk}`))
    tsplay.stderr!.on('data', (chunk: any) => process.stdout!.write(`> ${chunk}`))
}
startTsPlay()

const app = express()
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                html, body { width: 100%; height: 100%; }
                body { display: flex; flex-direction: column; }
                iframe { border: 0; flex: 1; }
            </style>
        </head>
        <body>
            <div><button id="reload">Reload</button></div>
            <iframe src="http://localhost:2080"></iframe>
            <script>
            document.getElementById('reload').addEventListener('click', () => {
                fetch('/restart', { method: 'post' });
            });
            </script>
        </body>
    </html>
    `)
})

app.post("/restart", (req, res) => {
    console.log("Restarting...")
    tsplay.kill("SIGTERM")
    tsplay.addListener('exit', () => {
        tsplay.removeAllListeners()
        startTsPlay()
    })
})
app.listen(2090)
