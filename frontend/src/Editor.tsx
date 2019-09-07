import * as React from 'react'

interface EditorProps {
    height?: number
    editorDidMount: (editor: monaco.editor.IStandaloneCodeEditor) => void
}

export default class Editor extends React.Component<EditorProps, {}> {

    container: HTMLDivElement|null = null

    render() {
        return <div style={{ flex: 1 }} ref={e => this.container = e}></div>
    }

    async componentDidMount() {
        await loadMonaco()
        const editor = monaco.editor.create(this.container!, {
            language: 'typescript',
            minimap: { enabled: false },
            automaticLayout: true
        })
        this.props.editorDidMount(editor)
    }

}