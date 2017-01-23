/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />
import * as React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { Row, Col, Grid } from 'react-bootstrap'
import Output from './Output'
import * as ts from 'typescript'

interface State {
    js: string
}

class App extends React.Component<{}, State> {
    state: State = { js: '' }
    editor: monaco.editor.ICodeEditor

    render() {
        return <Grid width={800}>
            <h1>ts-play.com</h1>
            <p>Powered by Monaco Editor, React, TypeScript, ...</p>
            <p><a href="https://www.twitch.tv/realharo">https://www.twitch.tv/realharo</a></p>
            <Row style={({ display: 'flex' })}>
                <Col sm={6}>
                    <MonacoEditor
                        height={800}
                        language="typescript"
                        editorDidMount={this.editorDidMount.bind(this)}
                        defaultValue="const x: string = null\n\ninterface X {\n    name: string\n}\nconst y: Partial<X> = {}\n"
                        onChange={this.onChange.bind(this)}
                        />
                </Col>
                <Col sm={6}><Output js={this.state.js} /></Col>
            </Row>
        </Grid>
    }

    editorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        this.editor = editor
        this.getJs(editor).then(js => this.setState({ js }))
    }

    onChange(newValue: string, event: monaco.editor.IModelContentChangedEvent2) {
        this.getJs(this.editor).then(js => this.setState({ js }))
    }

    getJs(editor: monaco.editor.ICodeEditor): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            monaco.languages.typescript.getTypeScriptWorker().then((worker: (...args: any[]) => monaco.Promise<any>) => {
                worker(editor.getModel().uri).then((client: ts.LanguageService) => {
                    const uri = editor.getModel().uri.toString()
                    const outputPromise = client.getEmitOutput(uri) as any as Promise<ts.EmitOutput>
                    outputPromise.then(output => { resolve(output.outputFiles[0].text) })
                })
            })
        })
    }
}

export default App
