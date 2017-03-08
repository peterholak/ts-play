import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router, Route, browserHistory, RouterState } from 'react-router'
import * as api from './api'

import App from './App'

const NoMatch = () => <div>No route for this path.</div>

const routes =
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path=":snippetId" />
        </Route>
        <Route path="*" component={NoMatch} />
    </Router>

ReactDOM.render(routes, document.getElementById('target'))
