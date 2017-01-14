import * as React from 'react'
import Console from './Console'
import { Button } from 'react-bootstrap'

interface Props {
    js?: string
}

class Output extends React.Component<Props, {}> {
    render() {
        return <div style={wrapperStyle}>
            <div style={topPartStyle}>
                <Button onClick={this.getJs}>Get the JS</Button>
                <div>{this.props.js}</div>
            </div>
            <div style={bottomPartStyle}><Console /></div>
        </div>
    }

    getJs() {

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
