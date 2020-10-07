import React, { Component } from 'react';

class ManufacturingOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className="box" style={{ minHeight: "450px" }}>
        <div className="box-body">
          Manufacturing Order
        </div>
      </div>
    );
  }
}

export default ManufacturingOrder;
