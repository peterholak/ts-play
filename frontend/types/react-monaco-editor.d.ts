/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />

declare module 'react-monaco-editor' {
    interface Props {
        width?: number|string
        height?: number|string
        value?: string|null
        defaultValue?: string
        language?: string
        theme?: string
        options?: monaco.editor.IEditorConstructionOptions
        editorDidMount?: (editor: monaco.editor.IStandaloneCodeEditor, monaco: {}) => void
        editorWillMount?: (monaco: any) => void
        onChange?: (newValue: string, event: monaco.editor.IModelContentChangedEvent2) => void
        requireConfig?: {}
    }
    class MonacoEditor extends React.Component<Props, {}> {}
    export default MonacoEditor
}
