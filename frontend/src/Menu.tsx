import * as React from 'react'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'

export interface Props {
    snippetId: string|undefined
    onShareClicked?: () => void,
    onTsconfigClicked?: () => void
}

export class Menu extends React.Component<Props, {}> {

    render() {
        return <div>
            <Button
                bsStyle="link"
                id="dropdown-share"
                onClick={this.props.onShareClicked}
            >
                Share
            </Button>

            <DropdownButton bsStyle="link" id="dropdown-options" title="Options">
                <MenuItem onClick={this.props.onTsconfigClicked}>Edit tsconfig.json</MenuItem>
            </DropdownButton>

            <DropdownButton bsStyle="link" id="dropdown-coming-soon" title="Coming soon">
                <MenuItem><strong>Options</strong></MenuItem>
                <MenuItem>TypeScript version</MenuItem>
                <MenuItem>Open in new tab</MenuItem>
                <MenuItem divider />
                <MenuItem><strong>Show</strong></MenuItem>
                <MenuItem>Console</MenuItem>
                <MenuItem>Output</MenuItem>
                <MenuItem>Compiled JS</MenuItem>
                <MenuItem divider />
                <MenuItem><strong>Other features</strong></MenuItem>
                <MenuItem>Multiple files</MenuItem>
                <MenuItem>Improved look</MenuItem>
                <MenuItem>Better browser/mobile support</MenuItem>
                <MenuItem divider />
                <MenuItem><strong>Demos</strong></MenuItem>
                <MenuItem>React + TypeScript</MenuItem>
                <MenuItem>Download as zipped project</MenuItem>
            </DropdownButton>

            {this.props.snippetId ? <span>Snippet: <code>{this.props.snippetId}</code></span> : ''}
        </div>
    }

}

export default Menu
