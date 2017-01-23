import * as React from 'react'
import { List } from 'immutable'
import { Alert, Button } from 'react-bootstrap'

interface State {
    items: List<LoggedItem>
    idCounter: number
}

interface LoggedItem {
    message: string
    id: number,
    type: ItemType
}

enum ItemType {
    Log, Error
}

class Console extends React.Component<{}, State> {

    state: State = {
        items: List<LoggedItem>(),
        idCounter: 0
    }
    origConsoleLog: any

    render() {
        return <div>
            <h3>Console</h3>
            {this.state.items.map(
                (item: LoggedItem) => this.renderItem(item)
            )}
        </div>
    }

    renderItem(item: LoggedItem) {
        return <Alert key={item.id} bsStyle={item.type === ItemType.Log ? "info" : "danger"}>
            {item.type === ItemType.Error ? "\u26A0" : ''} {item.message}
        </Alert>
    }

    connectConsole(w: Window = window) {
        w.addEventListener('error', this.onError)
        this.origConsoleLog = w.console.log
        w.console.log = function(this: Console, message?: any, ...optionalParams: any[]) {
            this.setState({
                idCounter: this.state.idCounter + 1,
                items: this.state.items.push({
                    id: this.state.idCounter,
                    message: message.toString(),
                    type: ItemType.Log
                })
            })
            this.origConsoleLog.apply(w, arguments)
        }.bind(this)
    }

    disconnectConsole(w: Window = window) {
        w.removeEventListener('error', this.onError)
        w.console.log = this.origConsoleLog
    }

    onError = (e: ErrorEvent) => {
        this.setState({
            idCounter: this.state.idCounter + 1,
            items: this.state.items.push({
                id: this.state.idCounter,
                message: e.message,
                type: ItemType.Error
            })
        })
    }
}

export default Console
