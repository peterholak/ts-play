import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router'
import { createBrowserHistory } from 'history'

import App from './App'

export const browserHistory = createBrowserHistory()
const NoMatch = () => <div>No route for this path.</div>

const routes =
    <Router history={browserHistory}>
        <Switch>
            <Route path="/:snippetId" component={App} />
            <Route path="/" component={App} />
            <Route component={NoMatch} />
        </Switch>
    </Router>

ReactDOM.render(routes, document.getElementById('target'))
