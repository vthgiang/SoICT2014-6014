import React, { Component } from 'react';

class SalesOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className="box" style={{ minHeight: "450px" }}>
        <div className="box-body">
          Sales Order
        </div>
      </div>
    );
  }
}

export default SalesOrder;