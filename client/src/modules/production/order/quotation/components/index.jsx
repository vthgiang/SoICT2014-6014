import React, { Component } from 'react';

class Quotation extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className="box" style={{ minHeight: "450px" }}>
        <div className="box-body">
          Quotation
        </div>
      </div>
    );
  }
}

export default Quotation;