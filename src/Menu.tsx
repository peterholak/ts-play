import * as React from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

class Menu extends React.Component<{}, {}> {

    render() {
        return <div>
            <DropdownButton bsStyle="link" id="dropdown-options" title="Options">
                <MenuItem>strictNullChecks</MenuItem>
                <MenuItem>noImplicitAny</MenuItem>
                <MenuItem>Version</MenuItem>
                <MenuItem>Open in new tab</MenuItem>
            </DropdownButton>

            <DropdownButton bsStyle="link" id="dropdown-share" title="Share">
                <MenuItem>Get link</MenuItem>
            </DropdownButton>

            <DropdownButton bsStyle="link" id="dropdown-show" title="Show">
                <MenuItem>Console</MenuItem>
                <MenuItem>Output</MenuItem>
                <MenuItem>Compiled JS</MenuItem>
            </DropdownButton>

            <DropdownButton bsStyle="link" id="dropdown-demo" title="Load demo">
                <MenuItem>React</MenuItem>
            </DropdownButton>
        </div>
    }

}

export default Menu
