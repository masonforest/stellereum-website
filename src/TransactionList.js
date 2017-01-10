import React from 'react';
import {Table} from 'reactstrap';
import Navbar from './Navbar';
import I from 'react-fontawesome';


const CONTRACT_ADDRESS = '0xc05b7a1c47123c840e0a71e33d464e34c1220181';
const CONTRACT_API =
[{"constant":false,"inputs":[{"name":"accountId","type":"string"}],"name":"Pay","outputs":[],"payable":true,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"accountId","type":"string"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Payment","type":"event"}];
var websocket = new WebSocket(process.env.REACT_APP_ETHEREUM_HOST, 'ethereum');
websocket.onopen = function(evt) {
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
      <div className="container">
        <div>
          <h2>Transactions</h2>
          <Table>
              <thead>
                <tr>
                  <th>From (Etherum Transsaction ID)</th>
                  <th>To (Stellar Account ID)</th>
                </tr>
              </thead>
              <tbody>
              {this.state.transactions.map((transaction, index) =>
                <tr key={index}>
                  <td>
                    <a
                      className="address"
                      href={`https://testnet.etherscan.io/tx/${transaction.transactionHash}`}
                      target="_blank"
                      >
                      <span>{transaction.transactionHash}</span>
                      <I name='external-link' />
                    </a>
                    </td>
                  <td>
                    <a
                      className="address"
                      href={`http://testnet.stellarchain.io/address/${transaction.args.accountId}`}
                      target="_blank"
                      >
                      <span>{transaction.args.accountId}</span>
                      <I name='external-link' />
                    </a>
                  </td>
                </tr>
                )}
              </tbody>
            </Table>
        </div>
      </div>
    );
  }
}
