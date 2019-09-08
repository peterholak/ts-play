import * as React from 'react'
import { Button, DropdownButton, Dropdown, ButtonGroup, Nav, NavDropdown } from 'react-bootstrap'

export interface Props {
    snippetId: string | undefined
    onShareClicked?: () => void
    onTsconfigClicked?: () => void
    onApplyTsconfigClicked?: () => void
}

export class Menu extends React.Component<Props, {}> {

    render() {
        return <Nav>
            <Nav.Link
                id="dropdown-share"
                onClick={this.props.onShareClicked}
            >
                Share
            </Nav.Link>

            <NavDropdown id="dropdown-options" title="Options">
                <NavDropdown.Item onClick={this.props.onTsconfigClicked}>Edit tsconfig.json</NavDropdown.Item>
                <NavDropdown.Item onClick={this.props.onApplyTsconfigClicked}>Apply tsconfig.json</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown variant="link" id="dropdown-coming-soon" title="Coming soon">
                <NavDropdown.Item><strong>Options</strong></NavDropdown.Item>
                <NavDropdown.Item>TypeScript versions</NavDropdown.Item>
                <NavDropdown.Item>Open in new tab</NavDropdown.Item>
                <NavDropdown.Item>Embedding</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item><strong>Show</strong></NavDropdown.Item>
                <NavDropdown.Item>Console</NavDropdown.Item>
                <NavDropdown.Item>Output</NavDropdown.Item>
                <NavDropdown.Item>Compiled JS</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item><strong>Other features</strong></NavDropdown.Item>
                <NavDropdown.Item>Multiple files</NavDropdown.Item>
                <NavDropdown.Item>Improved look</NavDropdown.Item>
                <NavDropdown.Item>Better browser/mobile support</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item><strong>Demos</strong></NavDropdown.Item>
                <NavDropdown.Item>React + TypeScript</NavDropdown.Item>
                <NavDropdown.Item>Download as zipped project</NavDropdown.Item>
            </NavDropdown>

            {this.props.snippetId ? <Nav.Link>Snippet: <code>{this.props.snippetId}</code></Nav.Link> : ''}
        </Nav>
    }

}

export default Menu
