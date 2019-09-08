import * as React from 'react'
import Console from './Console'
import { Button } from 'react-bootstrap'

interface Props {
    getJs: () => Promise<string>
}

interface State {
    js: string
    counter: number
}

class Output extends React.Component<Props, State> {

    state: State = { js: '', counter: 0 }
    jsFrame: HTMLIFrameElement|null = null
    myConsole: Console|null = null

    render() {
        return <div style={wrapperStyle}>
            <div style={topPartStyle}>
                <Button onClick={this.runJs.bind(this)}>Run</Button>
                <div style={{ width: '100%' }}>
                    <iframe
                        style={{ width: '100%', border: '1px dashed #ccc' }}
                        srcDoc={this.frameContents()}
                        onLoad={() => this.myConsole!.connectConsole(this.jsFrame!.contentWindow)}
                        ref={frame => this.jsFrame = frame}
                        />
                </div>
            </div>
            <div style={bottomPartStyle}>
                <Console
                    ref={c => this.myConsole = c}
                    />
            </div>
        </div>
    }

    frameContents() {
        return `
            <!DOCTYPE html>
            <html data-counter=${this.state.counter}>
            <head>
                <meta charset="UTF-8">
            </head>
            <body>
                <script>
                window.addEventListener('DOMContentLoaded', function() {
                    window.setTimeout(function() {
                        ${Output.consoleOverrides}
                        try {
                            ${this.state.js}
                        }catch(e) {
                            window.parent.postMessage(JSON.stringify({ type: 'error', message: e.toString() }), '*')
                        }
                    }, 1)
                })
                </script>
            </body>
            </html>
        `
    }

    static consoleOverrides = `
        function registerConsoleFunction(f) {
            const original = console[f]
            console[f] = function(message) {
                window.parent.postMessage(JSON.stringify({ type: f, message }), '*')
                original.apply(arguments)
            }
        }
        registerConsoleFunction('log')
        registerConsoleFunction('warn')
    `

    async runJs() {
        const js = await this.props.getJs()
        this.setState({
            js,
            counter: this.state.counter + 1
        })
    }
}

type CSS = React.CSSProperties

const wrapperStyle: CSS = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
}

const topPartStyle: CSS = {
    flex: 0.4
}

const bottomPartStyle: CSS = {
    flex: 0.6,
    display: 'flex'
}

export default Output
