import React, { Component } from "react";

class BankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">Bank Account</div>
            </div>
        );
    }
}

export default BankAccount;
