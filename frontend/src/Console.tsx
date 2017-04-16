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
    originalConsoleLog: any
    container: HTMLDivElement

    render() {
        return <div>
            <h3 style={({ display: 'inline-block' })}>Console</h3>{' '}
            <Button onClick={e => this.setState({ items: List<LoggedItem>() })}>Clear</Button>
            <div style={itemListStyle} ref={c => { this.container = c}}>
                {this.state.items.map(
                    (item: LoggedItem) => this.renderItem(item)
                )}
            </div>
        </div>
    }

    renderItem(item: LoggedItem) {
        return <div key={item.id} style={item.type === ItemType.Log ? logStyle : errorStyle}>
            {item.type === ItemType.Error ? "\u26A0" : ''} {item.message}
        </div>
    }

    connectConsole(w: Window = window) {
        window.addEventListener('message', this.onError)
        this.originalConsoleLog = w.console.log
        w.console.log = function(this: Console, message?: any, ...optionalParams: any[]) {
            this.setState({
                idCounter: this.state.idCounter + 1,
                items: this.state.items.push({
                    id: this.state.idCounter,
                    message: message.toString(),
                    type: ItemType.Log
                })
            })
            this.originalConsoleLog.apply(w, arguments)
        }.bind(this)
    }

    disconnectConsole(w: Window = window) {
        window.removeEventListener('message', this.onError)
        w.console.log = this.originalConsoleLog
    }

    onError = (message: MessageEvent) => {
        this.setState({
            idCounter: this.state.idCounter + 1,
            items: this.state.items.push({
                id: this.state.idCounter,
                message: message.data,
                type: ItemType.Error
            })
        })
    }

    componentDidUpdate(prevProps: {}, prevState: State) {
        if (this.state.items === prevState.items) { return }
        window.requestAnimationFrame(() => {
            this.container.lastElementChild && this.container.lastElementChild.scrollIntoView()
        })
    }
}

const itemListStyle : React.CSSProperties = { overflow: 'auto', maxHeight: '200px' }
const itemStyle = { fontFamily: 'monospace', border: '1px solid #eee' }
const logStyle = { ...itemListStyle, background: '#ddffff' }
const errorStyle = { ...itemListStyle, background: '#ffdddd' }

export default Console
