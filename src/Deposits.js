import React from 'react';
import {Table} from 'reactstrap';
import Navbar from './Navbar';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import _ from 'lodash';

export default class Deposits extends React.Component {
  render() {
    if(this.props.deposits[0]){
      return (
        <div className="card">
          <div className="card-block">
            <h3 className="card-title">Deposits</h3>
            <Table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {_.sortBy(this.props.deposits, ({timestamp}) => -timestamp)
                .map((transaction, index) =>
                  <tr key={index}>
                    <td>
                      <div>{moment(transaction.timestamp * 1000).format("YYYY-MM-DD")}</div>
                      <div>{moment(transaction.timestamp * 1000).format("HH:mm:ss")}</div>
                    </td>
                    <td>
                      <div>
                      <a
                      className="address"
                      href={`https://etherscan.io/tx/${transaction.transactionHash}`}
                      target="_blank"
                      >
                        <span>{transaction.transactionHash}</span>
                        <i className='fa fa-external-link' />
                      </a>
                      </div>
                      <div className="to-address">
                      <i className='fa fa-arrow-right' />
                      <a
                      className="stellar-address"
                      href={`https://stellarchain.io/address/${transaction.args.accountId}`}
                      target="_blank"
                      >
                      <span>{transaction.args.accountId}</span>
                      <i className='fa fa-external-link' />
                      </a>
                      </div>
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
