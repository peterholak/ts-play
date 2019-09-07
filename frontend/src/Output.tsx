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
                        style={{ width: '100%' }}
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
            <html data-counter=${this.state.counter}>
            <body>
                <script>
                window.addEventListener('DOMContentLoaded', function() {
                    window.setTimeout(function() {
                        try {
                            ${this.state.js}
                        }catch(e) {
                            window.parent.postMessage(e.toString(), '*')
                        }
                    }, 1)
                })
                </script>
            </body>
            </html>
        `
    }

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
    borderTop: '1px solid #000',
    display: 'flex'
}

export default Output
