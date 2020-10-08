import React, { Component } from 'react';

class Quoter extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className="box" style={{ minHeight: "450px" }}>
        <div className="box-body">
          Quoter
        </div>
      </div>
    );
  }
}

export default Quoter;