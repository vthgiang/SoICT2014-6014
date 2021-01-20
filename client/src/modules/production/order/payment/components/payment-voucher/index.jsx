import React, { Component } from "react";
import PaymentVoucherManagementTable from "./paymentVoucherManagementTable";
class PaymentVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <PaymentVoucherManagementTable />
                </div>
            </div>
        );
    }
}

export default PaymentVoucher;
