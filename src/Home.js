import React from 'react';
import Deposit from './Deposit';
import Deposits from './Deposits';
import Withdrawls from './Withdrawls';
import Web3 from 'web3';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const CONTRACT_ABI =
[{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"amount","type":"uint256"}],"name":"Withdrawl","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"accountId","type":"string"}],"name":"Deposit","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"accountId","type":"string"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"DepositEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"WithdrawlEvent","type":"event"}]

var websocket = new WebSocket(process.env.REACT_APP_ETHEREUM_HOST, 'ethereum');
websocket.onopen = function(evt) {
  websocket.send(JSON.stringify({
    event: "subscribe",
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  }))
};

var web3;
var contract;
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
  web3.defaultAccount = web3.eth.accounts[0];
  var StelereumContract = web3.eth.contract(CONTRACT_ABI);
  contract = StelereumContract.at(process.env.REACT_APP_CONTRACT_ADDRESS);
}


export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      deposits: [],
      withdrawls: [],
    };
    websocket.onmessage = (message) => {
      const {event, data} = JSON.parse(message.data)
      if(event === 'event') {
        switch(data.event) {
        case 'DepositEvent':
          this.receiveDeposit(data);
          break;
        case 'WithdrawlEvent':
          this.receiveWithdrawl(data);
          break;
        default:
          break;
        }
      }
    }

  }

  receiveDeposit = (deposit) => {
    this.setState({
      deposits:[deposit, ...this.state.deposits]
    })
  }

  receiveWithdrawl = (withdrawl) => {
    this.setState({
      withdrawls:[withdrawl, ...this.state.withdrawls]
    })
  }


  render() {
    console.log(this.state)
    return <div>
      <div className="row">
        <div className="col-8">
              <div className="alert alert-danger">
              Warning: Stellereum is <strong>alpha quality</strong> software an should not be
              used in production.</div>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <Deposit />
        </div>
        <div className="col-8">
          <div className="card">
            <div className="card-block">
              <h3 className="card-title">Welcome to Stellereum</h3>
            </div>
            <div className="card-block">
              <p>Stellereum is a proof of concept of a <a
              href="https://www.stellar.org/developers/guides/anchor/">Stellar Anchor</a> that bridges <a href="http://www.stellar.org/">Stellar</a> to the  <a
              href="https://ethereum.org/">Ethereum</a> network.
              </p>
              <p>To withdrawl ETH send tokens to
              &lt;your ethereum address&gt;*stellereum.com.</p>
            <p>If you would like transact Ether manually you can call the <strong>Deposit</strong> and <strong>Withdrawl</strong> methods directly on the contract deployed at <a href="https://etherscan.io/address/0x1fa5314c4807a164d938791f5d2fa87d320f6418">0x1fa5314c4807a164d938791f5d2fa87d320f6418</a>. Stellereum was built by <a target="_blank" href="https://github.com/masonforest/">@masonforest</a> who works full time at <a target="_blank" href="http://www.thoughtbot.com/">thoughtbot</a>.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <Deposits deposits={this.state.deposits}/>
        </div>
        <div className="col-6">
          <Withdrawls withdrawls={this.state.withdrawls}/>
        </div>
      </div>
    </div>;
  }
}
