import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { browserHistory } from './index'
import { Row, Col, Container, Navbar } from 'react-bootstrap'
import Output from './Output'
import Menu from './Menu'
import EditorWithTabs from './EditorWithTabs'
import * as tsconfigSchema from '../schema/tsconfig.schema.json'
import * as ts from 'typescript'
import * as api from './api'
import InBrowserHost from './typescript/InBrowserHost'
import * as stripJsonComments from 'strip-json-comments'

type Props = RouteComponentProps<{ snippetId: string }, {}>

interface State {
    loading: boolean,
    files: monaco.editor.IModel[],
    activeFile?: monaco.editor.IModel
}

/** Parts of TypeScriptWorker from monaco's internals which implements ts.LanguageServiceHost, and has some extra methods. */
type TypeScriptWorker = (ts.LanguageServiceHost & { getEmitOutput: (file: string) => Promise<ts.EmitOutput> })

class App extends React.Component<Props, State> {

    state: State = { loading: true, files: [] }

    editor: monaco.editor.ICodeEditor | undefined
    waitingRun: ((value: string) => any) | undefined

    typescript: TypeScriptWorker | undefined | any
    inBrowserHost = new InBrowserHost()
    defaultSnippetCode = "const x: string = null\n\ninterface X {\n    name: string\n}\nconst y: Partial<X> = {}\n\nconsole.log('hello')\nthis is error"
    snippetLoadPromise: Promise<string> | undefined

    render() {
        return <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {this.state.loading ?
                <div style={style.loading}>Loading...</div>
                : ''}
            <Navbar bg="dark" variant="dark" expand="sm">
                <Container>
                    <Navbar.Brand>
                        <img src="/favicon.svg" style={{ height: '30px', verticalAlign: 'bottom' }} />
                        {' '}
                        TS-PLAY.COM
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-menu" />
                    <Navbar.Collapse id="navbar-menu">
                        <Menu
                            onShareClicked={this.onShareClicked}
                            onTsconfigClicked={this.onTsconfigClicked}
                            onApplyTsconfigClicked={this.onApplyTsconfigClicked}
                            snippetId={this.props.match.params.snippetId}
                        />
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div style={{ height: '3px', background: '#ddd', marginBottom: '0.5rem' }}></div>
            <Container style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Row style={({ flex: 1, display: 'flex' })}>
                    <Col sm={8} style={{ flex: 1, display: 'flex' }}>
                        <EditorWithTabs
                            editorDidMount={this.editorDidMount.bind(this)}
                            files={this.state.files}
                            activeFile={this.state.activeFile}
                            onFileChanged={this.onFileChanged}
                        />
                    </Col>
                    <Col sm={4} style={{ display: 'flex' }}>
                        <Output getJs={this.getJs.bind(this)} />
                    </Col>
                </Row>
            </Container>
            <p style={{ textAlign: 'center', fontSize: '85%', marginTop: '20px' }}>
                Powered by Monaco Editor, React, TypeScript, ..., {' '}
                <a href="https://github.com/peterholak/ts-play">https://github.com/peterholak/ts-play</a>
            </p>
        </div>
    }

    editorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        this.editor = editor

        const indexModel = monaco.editor.createModel('// index.ts', 'typescript', monaco.Uri.parse('inmemory://model/index.ts'))
        this.snippetLoadPromise!.then(code => indexModel.setValue(code))
        this.editor.setModel(indexModel)
        this.updateFilesState()

        this.requestTypescript(editor)
            .then((typescript: any) => {
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
            } else {
                this.getJsInternal(this.editor, this.typescript).then(resolve)
            }
        })
    }

    private requestTypescript(editor: monaco.editor.ICodeEditor): Promise<TypeScriptWorker> {
        return monaco.languages.typescript.getTypeScriptWorker().then((worker: (uri: monaco.Uri) => Promise<TypeScriptWorker>) => {
            return worker(editor.getModel()!.uri)
        })
    }

    private getJsInternal(editor: monaco.editor.ICodeEditor, typescript: TypeScriptWorker): Promise<string> {
        const uri = editor.getModel()!.uri.toString()
        const outputPromise = typescript.getEmitOutput(uri) as any as Promise<ts.EmitOutput>
        return outputPromise.then(output => output.outputFiles[0].text)
    }

    /** Brings the `files` property in state into sync with the state inside monaco. */
    private updateFilesState() {
        this.setState({ files: monaco.editor.getModels() })
    }

    onShareClicked = async () => {
        if (!this.editor) { return }
        const id = await api.share(this.editor.getModel()!.getValue())
        browserHistory.push("/" + id)
    }

    onTsconfigClicked = async () => {
        if (!this.editor || !this.typescript) { return }

        const existingFile = this.findFile('tsconfig.json')
        if (existingFile !== undefined) {
            this.setActiveFile(existingFile)
            return
        }

        const tsconfigModel = monaco.editor.createModel('{}', 'json', monaco.Uri.parse('inmemory://model/tsconfig.json'))

        // const config = { compilerOptions: await this.typescript.getCompilationSettings() }
        const config = (ts as any).generateTSConfig({}, [], "\n")

        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            schemas: [{ fileMatch: ['*'], uri: 'http://json.schemastore.org/tsconfig', schema: tsconfigSchema }],
            validate: true,
            allowComments: true
        })

        tsconfigModel.setValue(config)
        this.setActiveFile(tsconfigModel)
        this.updateFilesState()
    }

    onApplyTsconfigClicked = async () => {
        const tsconfig = this.findFile('tsconfig.json')
        if (tsconfig === undefined) { return alert('not found') }

        try {
            const options = ts.parseJsonConfigFileContent(
                JSON.parse(stripJsonComments(tsconfig.getValue())),
                this.inBrowserHost,
                '/'
            ).options as monaco.languages.typescript.CompilerOptions
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions(options)
        } catch (e) {
            alert(e)
        }
    }

    onFileChanged = (file: monaco.editor.IModel) => {
        this.setActiveFile(file)
    }

    private setActiveFile(file: monaco.editor.IModel) {
        if (!this.editor) { return }
        this.setState({ activeFile: file })
        this.editor.setModel(file)
    }

    componentDidMount() {
        if (this.props.match.params.snippetId) {
            this.snippetLoadPromise = api.load(this.props.match.params.snippetId)
        } else {
            this.snippetLoadPromise = Promise.resolve(this.defaultSnippetCode)
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.match.params.snippetId !== prevProps.match.params.snippetId) {
            this.loadSnippet(this.props.match.params.snippetId)
        }
    }

    private async loadSnippet(id: string) {
        if (this.editor === undefined) { return }
        const code = await api.load(id)
        this.editor.setValue(code)
    }

    private findFile(name: string): monaco.editor.IModel | undefined {
        const index = monaco.editor.getModels().map(m => m.uri.path).indexOf('/' + name)
        if (index === -1) { return undefined }
        return monaco.editor.getModels()[index]
    }
}

const style: { [name: string]: React.CSSProperties } = {
    loading: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        background: '#000',
        color: '#fff',
        opacity: 0.5,
        fontFamily: 'sans-serif',
        fontSize: '16pt'
    }
}

export default App
