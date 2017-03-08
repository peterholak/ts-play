import * as React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { RouteComponentProps, browserHistory } from 'react-router'
import { Row, Col, Grid, Navbar } from 'react-bootstrap'
import Output from './Output'
import Menu from './Menu'
import * as ts from 'typescript'
import * as api from './api'

type Props = RouteComponentProps<{ snippetId: string }, {}>

const EditorHeight = 600

class App extends React.Component<Props, { loading: boolean }> {

    state = { loading: true }
    
    editor: monaco.editor.ICodeEditor|undefined
    waitingRun: ((value: string) => any)|undefined
    typescript: ts.LanguageService|undefined
    defaultSnippetCode = "const x: string = null\n\ninterface X {\n    name: string\n}\nconst y: Partial<X> = {}\n\nconsole.log('hello')\nthis is error"
    snippetLoadPromise: Promise<string>

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
            <Menu onShareClicked={this.onShareClicked} snippetId={this.props.params.snippetId} />
            {this.state.loading ?
            <Row style={style.loadingRow}>
                <Col xs={12} style={style.loadingColumn}>Loading...</Col>
            </Row>
            :''}
            <Row style={({ display: 'flex' })}>
                <Col sm={6}>
                    <MonacoEditor
                        height={EditorHeight}
                        language="typescript"
                        editorDidMount={this.editorDidMount.bind(this)}
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
        this.snippetLoadPromise.then(code => editor.setValue(code))
        this.requestTypescript(editor)
            .then(typescript => {
                this.setState({ loading: false })
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

    onShareClicked = async () => {
        if (!this.editor) { return }
        const id = await api.share(this.editor.getModel().getValue())
        browserHistory.push("/" + id)
    }

    componentWillMount() {
        if (this.props.params.snippetId) {
            this.snippetLoadPromise = api.load(this.props.params.snippetId)
        }else{
            this.snippetLoadPromise = Promise.resolve(this.defaultSnippetCode)
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.params.snippetId !== this.props.params.snippetId) {
            this.loadSnippet(nextProps.params.snippetId)
        }
    }

    private async loadSnippet(id: string) {
        if (this.editor === undefined) { return }
        const code = await api.load(id)
        this.editor.setValue(code)
    }
}

const style: {[name: string]: React.CSSProperties} = {
    loadingRow: {
        position: 'relative',
    },

    loadingColumn: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        background: '#000',
        color: '#fff',
        opacity: 0.5,
        height: EditorHeight,
        fontFamily: 'sans-serif',
        fontSize: '16pt'
    }
}

export default App
