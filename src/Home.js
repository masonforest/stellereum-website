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
        <div className="col-4">
          <Deposit />
        </div>
        <div className="col-8">
          <div className="card">
            <div className="card-block">
              <h3 className="card-title">Welcome to Stellereum</h3>
            </div>
            <div className="card-block">
              <p>Stellereum is a bridge between the <a href="https://www.stellar.org/">Stellar</a> and <a href="https://ethereum.org/">Ethereum</a> networks. Use the deposit form to deposit Ether. To withdrawl send tokens to &lt;your ethereum address&gt;*stellereum.com.</p>
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
