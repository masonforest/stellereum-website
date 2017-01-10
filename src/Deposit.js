import React from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import StellarSdk from 'stellar-sdk';
import Web3 from 'web3';

var web3;
var contract;

const CONTRACT_API =
[{"constant":false,"inputs":[{"name":"accountId","type":"string"}],"name":"Pay","outputs":[],"payable":true,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"accountId","type":"string"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Payment","type":"event"}];

if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
  web3.defaultAccount = web3.eth.accounts[0];
  var StelereumContract = web3.eth.contract(CONTRACT_API);
  contract = StelereumContract.at(process.env.REACT_APP_CONTRACT_ADDRESS);
}

export default class Deposit extends React.Component {
  constructor() {
    super();
    this.state = {
      address: "masonforest*lobstr.co",
      amount: ".01",
      signing: false,
    };
    this.depositCallback = this.depositCallback.bind(this);
    this.deposit = this.deposit.bind(this);
    this.pay = this.pay.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  deposit(e) {
    e.preventDefault();
    this.setState({...this.state, signing: true})
    if(StellarSdk.Keypair.isValidPublicKey(this.state.address)) {
      this.pay(this.state.address, this.state.amount)
    } else {
      StellarSdk
        .FederationServer
        .resolve(this.state.address)
        .then(({account_id}) => this.pay(account_id, this.state.amount))
    }
  }

  pay(accountId, amount) {
    contract.Pay(
        accountId,
        {
          from: web3.eth.accounts[0],
          value: web3.toWei(amount, 'ether'),
        },
        this.depositCallback)
  }

  depositCallback (error, transactionHash) {
    if(error) {
      console.log(error);
    } else {
      this.setState({
        address: "",
        amount: "",
        signing: false,
      });
    }
  }

  handleAddressChange({target: {value}}) {
    this.setState({...this.state, address: value})
  }

  handleAmountChange({target: {value}}) {
    this.setState({...this.state, amount: value})
  }

  render() {
    return <div>
    <h2>Deposit Ether</h2>
    <Form>
      <fieldset disabled={this.state.signing}>
        <FormGroup>
          <Label for="address">Stellar Address</Label>
          <Input onChange={this.handleAddressChange} type="address" name="address" id="address" value={this.state.address} placeholder="user@lobstr.co or GCEXAMPLE...."/>
        </FormGroup>
        <FormGroup>
          <Label for="amount">Amount in Ethers</Label>
          <Input onChange={this.handleAmountChange} type="amount" name="amount" value={this.state.amount} id="amount"/>
        </FormGroup>
        <Button onClick={this.deposit}>Deposit{this.state.signing ? ' (Signing)' : null}</Button>
      </fieldset>
    </Form>
    </div>;
  }
}
