import React, { Component } from "react";
import BankAccountManagementTable from "./bankAccountManagementTable";
class BankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <BankAccountManagementTable />
                </div>
            </div>
        );
    }
}

export default BankAccount;
