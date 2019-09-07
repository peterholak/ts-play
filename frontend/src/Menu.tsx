import * as React from 'react'
import { Button, DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap'

export interface Props {
    snippetId: string|undefined
    onShareClicked?: () => void
    onTsconfigClicked?: () => void
    onApplyTsconfigClicked?: () => void
}

export class Menu extends React.Component<Props, {}> {

    render() {
        return <ButtonGroup>
            <Button
                variant="link"
                id="dropdown-share"
                onClick={this.props.onShareClicked}
            >
                Share
            </Button>

            <DropdownButton variant="link" id="dropdown-options" title="Options">
                <Dropdown.Item onClick={this.props.onTsconfigClicked}>Edit tsconfig.json</Dropdown.Item>
                <Dropdown.Item onClick={this.props.onApplyTsconfigClicked}>Apply tsconfig.json</Dropdown.Item>
            </DropdownButton>

            <DropdownButton variant="link" id="dropdown-coming-soon" title="Coming soon">
                <Dropdown.Item><strong>Options</strong></Dropdown.Item>
                <Dropdown.Item>TypeScript version</Dropdown.Item>
                <Dropdown.Item>Open in new tab</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item><strong>Show</strong></Dropdown.Item>
                <Dropdown.Item>Console</Dropdown.Item>
                <Dropdown.Item>Output</Dropdown.Item>
                <Dropdown.Item>Compiled JS</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item><strong>Other features</strong></Dropdown.Item>
                <Dropdown.Item>Multiple files</Dropdown.Item>
                <Dropdown.Item>Improved look</Dropdown.Item>
                <Dropdown.Item>Better browser/mobile support</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item><strong>Demos</strong></Dropdown.Item>
                <Dropdown.Item>React + TypeScript</Dropdown.Item>
                <Dropdown.Item>Download as zipped project</Dropdown.Item>
            </DropdownButton>

            {this.props.snippetId ? <span>Snippet: <code>{this.props.snippetId}</code></span> : ''}
        </ButtonGroup>
    }

}

export default Menu
