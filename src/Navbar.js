import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router'


export default class Example extends React.Component {
  render() {
    return (
      <div>
        <Navbar color="faded" light>
          <div className="container">
            <NavbarBrand href="/">Stellereum</NavbarBrand>
          </div>
        </Navbar>
      </div>
    );
  }
            // <Nav style={{float: 'right'}} navbar>
            //   <NavItem>
            //     <Link className="nav-link" to="">Deposit</Link>
            //   </NavItem>
            //   <NavItem>
            //     <Link className="nav-link" to="/transactions">Transaction List</Link>
            //   </NavItem>
            // </Nav>
}
