import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import TransactionList from './TransactionList';
import Deposit from './Deposit';
import './index.css';

injectTapEventPlugin();
ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Deposit}/>
      <Route path="/transactions" component={TransactionList} />
    </Route>
  </Router>,
  document.getElementById('root')
);
