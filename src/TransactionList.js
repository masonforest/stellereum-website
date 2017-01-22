import React from 'react';
import {Table} from 'reactstrap';
import Navbar from './Navbar';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import _ from 'lodash';
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
    if(this.state.transactions[0]){
    window.m = moment(this.state.transactions[0].timestamp)}
    return (
      <div className="card">
        <div className="card-block">
          <h3 className="card-title">Transactions</h3>
          <Table>
            <thead>
              <tr>
                <th>Time</th>
                <th>From (Etherum Transaction ID)</th>
                <th>To (Stellar Account ID)</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {_.sortBy(this.state.transactions, ({timestamp}) => -timestamp)
                .map((transaction, index) =>
                <tr key={index}>
                  <td>{moment(transaction.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss")}</td>
                  <td>
                    <a
                      className="address"
                      href={`https://testnet.etherscan.io/tx/${transaction.transactionHash}`}
                      target="_blank"
                      >
                      <span>{transaction.transactionHash}</span>
                      <i className='fa fa-external-link' />
                    </a>
                  </td>
                  <td>
                    <a
                      className="address"
                      href={`http://testnet.stellarchain.io/address/${transaction.args.accountId}`}
                      target="_blank"
                      >
                      <span>{transaction.args.accountId}</span>
                      <i className='fa fa-external-link' />
                    </a>
                  </td>
                  <td className="amount">{new BigNumber(transaction.args.amount).dividedBy(new BigNumber("10e+18")).toString()}</td>
                  <td>Complete</td>
                </tr>
                )}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}
