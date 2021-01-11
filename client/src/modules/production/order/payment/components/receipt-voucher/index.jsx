import React, { Component } from "react";
import ReceiptVoucherManagementTable from "./receiptVoucherManagementTable";
class ReceiptVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <ReceiptVoucherManagementTable />
                </div>
            </div>
        );
    }
}

export default ReceiptVoucher;
