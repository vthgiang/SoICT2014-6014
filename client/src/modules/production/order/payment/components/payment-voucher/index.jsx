import React, { Component } from "react";
class PaymentVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">Payment Voucher</div>
            </div>
        );
    }
}

export default PaymentVoucher;
