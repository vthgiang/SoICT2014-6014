import React, { Component } from 'react';

class Tax extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className="box" style={{ minHeight: "450px" }}>
        <div className="box-body">
          Tax
        </div>
      </div>
    );
  }
}

export default Tax;