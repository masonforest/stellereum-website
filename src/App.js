import React from 'react';
import {Table} from 'reactstrap';
import Deposit from './Deposit';
import Navbar from './Navbar';
import I from 'react-fontawesome';

import './App.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const CONTRACT_API =
[{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"amount","type":"uint256"}],"name":"Withdrawl","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"accountId","type":"string"}],"name":"Deposit","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"accountId","type":"string"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"DepositEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"WithdrawlEvent","type":"event"}]
var websocket = new WebSocket(process.env.REACT_APP_ETHEREUM_HOST, 'ethereum');
websocket.onopen = function(evt) {
  console.log(evt)
  websocket.send(JSON.stringify({
    event: "subscribe",
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_API,
  }))
};

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: true,
      transactions: [],
    };
    websocket.onmessage = (message) => {
      const {event, data} = JSON.parse(message.data)
      if(event === 'event') {
        this.receiveTransaction(data);
      }
    }

    this.receiveTransaction =  this.receiveTransaction.bind(this);
  }

  receiveTransaction(transaction) {
    this.setState({
      transactions:[transaction, ...this.state.transactions]
    })
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
