import React, { Component } from "react";
import { DialogModal } from "../../../../../../common-components";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../../helpers/formatDate";

function PaymentVoucherDetailForm(props) {

    const getPaidForPayment = (salesOrders) => {
        let paid = salesOrders.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.money);
        }, 0);
        console.log(formatCurrency(paid));
        return formatCurrency(paid);
    };

    const { paymentDetail } = props;
    console.log("paymentDetail", paymentDetail);

    let paymentTypeConvert = ["", "Tiền mặt", "Chuyển khoản"];
    return (
        <DialogModal
            modalID="modal-payment-voucher-detail"
            isLoading={false}
            formID="form-payment-voucher-detail-form"
            title={"Chi tiết phiếu chiếu chi"}
            size="50"
            hasSaveButton={false}
            hasNote={false}
        >
            <form id={`form-payment-voucher-detail-form`}>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div className={`form-group`}>
                        <strong>Mã phiếu :&emsp;</strong>
                        {paymentDetail.code}
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div className={`form-group`}>
                        <strong>Nhà cung cấp :&emsp;</strong>
                        {paymentDetail.supplier ? paymentDetail.supplier.code + " - " + paymentDetail.supplier.name : ""}
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div className={`form-group`}>
                        <strong>Người nhận thanh toán :&emsp;</strong>
                        {paymentDetail.curator ? paymentDetail.curator.name : ""}
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div className={`form-group`}>
                        <strong>Phương thức thay toán:&emsp;</strong>
                        {paymentTypeConvert[paymentDetail.paymentType]}
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div className={`form-group`}>
                        <strong>Ngày thanh toán :&emsp;</strong>
                        {paymentDetail.paymentAt ? formatDate(paymentDetail.paymentAt) : ""}
                    </div>
                </div>
                {paymentDetail.bankAccountReceived ? (
                    <React.Fragment>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <strong>Tài khoản thanh toán:&emsp;</strong>
                                {paymentDetail.bankAccountReceived.account}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <strong>Ngân hàng:&emsp;</strong>
                                {paymentDetail.bankAccountReceived.bankAcronym}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <strong>Chủ tài khoản :&emsp;</strong>
                                {paymentDetail.bankAccountReceived.owner}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <strong>Tài khoản nhận tiền :&emsp;</strong>
                                {paymentDetail.bankAccountPartner}
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    ""
                )}
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Thanh toán cho từng đơn</legend>
                        <table id={`receipt-voucher-detail-sales-order`} className="table table-bordered not-sort">
                            <thead>
                                <tr>
                                    <th title={"STT"}>STT</th>
                                    <th title={"Mã đơn"}>Mã đơn nhập</th>
                                    <th title={"Số tiền thanh toán"}>Số tiền thanh toán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentDetail.purchaseOrders.length !== 0 &&
                                    paymentDetail.purchaseOrders.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.purchaseOrder.code}</td>
                                                <td>{item.money ? formatCurrency(item.money) : ""}</td>
                                            </tr>
                                        );
                                    })}
                                {paymentDetail.purchaseOrders.length !== 0 && (
                                    <tr>
                                        <td colSpan={2} style={{ fontWeight: 600 }}>
                                            <center>Tổng thanh toán</center>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {paymentDetail.purchaseOrders ? getPaidForPayment(paymentDetail.purchaseOrders) : ""}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </fieldset>
                </div>
            </form>
        </DialogModal>
    );
}

export default PaymentVoucherDetailForm;
