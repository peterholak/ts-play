import * as React from 'react'
import { Alert, Button } from 'react-bootstrap'

interface State {
    items: LoggedItem[]
    idCounter: number
}

interface LoggedItem {
    message: string
    id: number,
    type: ItemType
}

type ItemType = 'error'|'log'|'warn'

class Console extends React.Component<{}, State> {

    state: State = {
        items: [],
        idCounter: 0
    }
    originalConsoleLog: any
    container: HTMLDivElement|null = null

    render() {
        return <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <big>Console</big>
                <Button onClick={() => this.setState({ items: [] })}>Clear</Button>
            </div>
            <div style={itemListStyle} ref={c => { this.container = c}}>
                {this.state.items.map(
                    (item: LoggedItem|undefined) => this.renderItem(item!)
                )}
            </div>
        </div>
    }

    renderItem(item: LoggedItem) {
        return <div key={item.id} style={itemStyleByType[item.type || ''] || {}}>
            {(item.type === 'error' || item.type === 'warn') ? "\u26A0" : ''} {item.message}
        </div>
    }

    connectConsole(w: Window|null = window) {
        if (w === null) {
            return
        }
        window.addEventListener('message', this.onMessage)
    }

    disconnectConsole(w: Window = window) {
        window.removeEventListener('message', this.onMessage)
    }

    onMessage = (message: MessageEvent) => {
        let data: Partial<{ type: ItemType, message: string}>
        try {
            data = JSON.parse(message.data)
        } catch(e) {
            console.warn('Failed to JSON.parse incoming message from iframe.')
            return
        }

        this.setState({
            idCounter: this.state.idCounter + 1,
            items: [ ...this.state.items, {
                id: this.state.idCounter,
                message: data.message || '',
                type: data.type || 'log'
            }]
        })
    }

    componentDidUpdate(prevProps: {}, prevState: State) {
        if (this.state.items === prevState.items) { return }
        window.requestAnimationFrame(() => {
            this.container!.scrollTop = this.container!.scrollHeight
        })
    }
}

const itemListStyle: React.CSSProperties = {
    border: '1px dashed #ccc',
    flex: 1,
    flexBasis: 0,
    minHeight: '2rem',
    overflow: 'auto'
}
const itemStyle = { fontSize: '10pt', fontFamily: 'Consolas, DejaVu Sans Mono, Monaco, Menlo, monospace', border: '1px solid #eee' }
const itemStyleByType = {
    log: { ...itemStyle, background: '#ddffff' },
    warn: { ...itemStyle, background: '#ffff88' },
    error: { ...itemStyle, background: '#ffdddd' }
}

export default Console
