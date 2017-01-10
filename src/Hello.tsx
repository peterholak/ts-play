import * as React from 'react'
import MonacoEditor from 'react-monaco-editor'

interface Props {
    compiler: string
    framework: string
}

export const Hello = (props: Props) => 
    <div>
        <h1>Hello from {props.compiler} and {props.framework}!</h1>
        <MonacoEditor
            width={800}
            height={800}
            language="typescript"
            value="const x: string = null\n\ninterface X {\n    name: string\n}\nconst y: Partial<X> = {}\n"
            />
    </div>

export default Hello
