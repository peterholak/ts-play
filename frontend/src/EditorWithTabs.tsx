import * as React from 'react'
import { Nav, NavItem } from 'react-bootstrap'
import MonacoEditor from 'react-monaco-editor'

interface Props {
    height: number
    files: monaco.editor.IModel[]
    editorDidMount: (editor: monaco.editor.IStandaloneCodeEditor) => void
    onFileChanged: (file: monaco.editor.IModel) => void
    activeFile: monaco.editor.IModel|undefined
}

class EditorWithTabs extends React.Component<Props, {}> {

    editor: monaco.editor.IStandaloneCodeEditor|undefined

    render() {
        return <div>
            {this.props.files.length > 1 ? this.renderTabs() : ''}
            <MonacoEditor
                height={this.props.height}
                language="typescript"
                editorDidMount={this.editorDidMount.bind(this)}
                options={({
                    automaticLayout: true
                })}
                />
        </div>
    }

    renderTabs() {
        let activeKey = this.props.activeFile ? this.props.files.indexOf(this.props.activeFile) + 1 : 0
        if (activeKey === 0) { activeKey = 1 }

        return <Nav bsStyle="tabs" activeKey={activeKey}>
            {
                this.props.files.map((file, index) => {
                    const fileName = file.uri.path.substr(1)
                    return <NavItem key={fileName} eventKey={index + 1} onClick={() => this.onTabClicked(file)}>{fileName}</NavItem>
                })
            }
        </Nav>
    }

    editorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        this.editor = editor
        this.props.editorDidMount(editor)
    }

    onTabClicked(file: monaco.editor.IModel) {
        if (this.props.onFileChanged) {
            this.props.onFileChanged(file)
        }
        
        if (this.editor) {
            this.editor.focus()
        }
    }
}

export default EditorWithTabs
