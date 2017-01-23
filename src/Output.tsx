import * as React from 'react'
import Console from './Console'
import { Button } from 'react-bootstrap'

interface Props {
    js?: string
}

interface State {
    js: string
    counter: number
}

class Output extends React.Component<Props, State> {

    state: State = { js: '', counter: 0 }
    jsFrame: HTMLIFrameElement
    myConsole: Console

    render() {
        return <div style={wrapperStyle}>
            <div style={topPartStyle}>
                <Button onClick={this.runJs.bind(this)}>Run</Button>
                <div>
                    <iframe
                        srcDoc={this.frameContents()}
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
                window.addEventListener('message', function(event) {
                    eval(event.data)
                })
                </script>
            </body>
            </html>
        `
    }

    runJs() {
        this.setState({
            js: this.props.js,
            counter: this.state.counter + 1
        })
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.state.js !== prevState.js || this.state.counter !== prevState.counter) {
            this.myConsole.connectConsole(this.jsFrame.contentWindow)
            this.jsFrame.contentWindow.postMessage(this.state.js, '*')
        }
    }
}

type CSS = React.CSSProperties

const wrapperStyle: CSS = {
    height: '100%'
}

const topPartStyle: CSS = {
    height: '60%'
}

const bottomPartStyle: CSS = {
    height: '40%',
    overflow: 'auto',
    borderTop: '1px solid #000'
}

export default Output
