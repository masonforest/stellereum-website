import React from 'react';
import Deposit from './Deposit';

export default class Example extends React.Component {
  render() {
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
        <div className="col-12">
        </div>
      </div>
    </div>;
  }
}
