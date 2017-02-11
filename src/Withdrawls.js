import React from 'react';
import {Table} from 'reactstrap';
import Navbar from './Navbar';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import _ from 'lodash';

export default class Withdrawls extends React.Component {
  render() {
    if(this.props.withdrawls[0]){
      return (
        <div className="card">
          <div className="card-block">
            <h3 className="card-title">Withdrawls</h3>
            <Table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {_.sortBy(this.props.withdrawls, ({timestamp}) => -timestamp)
                .map((transaction, index) =>
                  <tr key={index}>
                    <td>{moment(transaction.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td>
                      <a
                      className="address"
                      href={`https://etherscan.io/tx/${transaction.transactionHash}`}
                      target="_blank"
                      >
                        <span>{transaction.transactionHash}</span>
                        <i className='fa fa-external-link' />
                      </a>
                    </td>
                    <td className="amount">{new BigNumber(transaction.args.amount).dividedBy(new BigNumber("10e+17")).toString()}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
    );
    } else {
      return null;
    }
  }
}
