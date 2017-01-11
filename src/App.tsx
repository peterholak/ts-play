import * as React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { Row, Col, Grid } from 'react-bootstrap'
import Output from './Output'

const App = () =>
    <Grid width={800}>
        <h1>ts-play.com</h1>
        <p>Powered by Monaco Editor, React, TypeScript, ...</p>
        <Row>
            <Col sm={6}>
                <MonacoEditor
                    height={800}
                    language="typescript"
                    value="const x: string = null\n\ninterface X {\n    name: string\n}\nconst y: Partial<X> = {}\n"
                    />
            </Col>
            <Col sm={6}><Output /></Col>
        </Row>
    </Grid>

export default App
