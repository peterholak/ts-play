import * as React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { Row, Col, Grid, Navbar } from 'react-bootstrap'
import Output from './Output'
import Menu from './Menu'
import * as ts from 'typescript'
import * as api from './api'

class App extends React.Component<{}, {}> {
    
    editor: monaco.editor.ICodeEditor|undefined
    waitingRun: ((value: string) => any)|undefined
    typescript: ts.LanguageService|undefined

    render() {
        return <Grid width={800}>
            <Navbar inverse>
                <Navbar.Header>
                <Navbar.Brand>ts-play.com</Navbar.Brand>
                </Navbar.Header>
            </Navbar>
            <p>
                Powered by Monaco Editor, React, TypeScript, ..., {' '}
                <a href="https://www.twitch.tv/realharo">https://www.twitch.tv/realharo</a>,{' '}
                <a href="https://github.com/peterholak/ts-play">https://github.com/peterholak/ts-play</a>
            </p>
            <Menu onShareClicked={this.onShareClicked} />
            <Row style={({ display: 'flex' })}>
                <Col sm={6}>
                    <MonacoEditor
                        height={600}
                        language="typescript"
                        editorDidMount={this.editorDidMount.bind(this)}
                        defaultValue="const x: string = null\n\ninterface X {\n    name: string\n}\nconst y: Partial<X> = {}\n\nconsole.log('hello')\nthis is error"
                        options={({
                            automaticLayout: true
                        })}
                        />
                </Col>
                <Col sm={6}><Output getJs={this.getJs.bind(this)} /></Col>
            </Row>
        </Grid>
    }

    editorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        this.editor = editor
        this.requestTypescript(editor)
            .then(typescript => {
                this.typescript = typescript
                if (this.waitingRun) {
                    this.getJsInternal(editor, this.typescript).then(this.waitingRun)
                }
            })
    }

    getJs() {
        return new Promise<string>(resolve => {
            if (this.typescript === undefined || this.editor === undefined) {
                this.waitingRun = resolve
            }else{
                this.getJsInternal(this.editor, this.typescript).then(resolve)
            }
        })
    }

    private requestTypescript(editor: monaco.editor.ICodeEditor): monaco.Promise<ts.LanguageService> {
        return monaco.languages.typescript.getTypeScriptWorker().then((worker: (uri: monaco.Uri) => monaco.Promise<ts.LanguageService>) => {
            return worker(editor.getModel().uri)
        })
    }

    private getJsInternal(editor: monaco.editor.ICodeEditor, typescript: ts.LanguageService): Promise<string> {
        const uri = editor.getModel().uri.toString()
        const outputPromise = typescript.getEmitOutput(uri) as any as Promise<ts.EmitOutput>
        return outputPromise.then(output => output.outputFiles[0].text)
    }

    onShareClicked = () => {
        if (!this.editor) { return }
        api.share(this.editor.getModel().getValue())
    }
}

export default App
