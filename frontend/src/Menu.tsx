import * as React from 'react'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'

export interface Props {
    snippetId: string|undefined
    onShareClicked?: () => void
}

export class Menu extends React.Component<Props, {}> {

    render() {
        return <div>
            <DropdownButton bsStyle="link" id="dropdown-options" title="Options">
                <MenuItem>strictNullChecks</MenuItem>
                <MenuItem>noImplicitAny</MenuItem>
                <MenuItem>Version</MenuItem>
                <MenuItem>Open in new tab</MenuItem>
            </DropdownButton>

            <Button
                bsStyle="link"
                id="dropdown-share"
                onClick={this.props.onShareClicked}
            >
                Share
            </Button>

            <DropdownButton bsStyle="link" id="dropdown-show" title="Show">
                <MenuItem>Console</MenuItem>
                <MenuItem>Output</MenuItem>
                <MenuItem>Compiled JS</MenuItem>
            </DropdownButton>

            <DropdownButton bsStyle="link" id="dropdown-demo" title="Load demo">
                <MenuItem>React</MenuItem>
            </DropdownButton>

            {this.props.snippetId ? <span>Snippet: <code>{this.props.snippetId}</code></span> : ''}
        </div>
    }

}

export default Menu
