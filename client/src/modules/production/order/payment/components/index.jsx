import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import PaymentVoucher from "./payment-voucher/index";
import ReceiptVoucher from "./receipt-voucher/index";
class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
        };
    }

    handleChangeType = async (type) => {
        this.setState({
            type,
        });
    };
    render() {
        const { type } = this.state;
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active">
                        <a href="#payment-in" data-toggle="tab" onClick={() => this.handleChangeType(1)}>
                            {"Phiếu thu"}
                        </a>
                    </li>
                    <li>
                        <a href="#payment-out" data-toggle="tab" onClick={() => this.handleChangeType(2)}>
                            {"Phiếu chi"}
                        </a>
                    </li>
                </ul>
                {/* Phiếu thu */}
                {type === 1 && <ReceiptVoucher />}

                {/* Phiếu chi */}
                {type === 2 && <PaymentVoucher />}
            </div>
        );
    }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Payment));
