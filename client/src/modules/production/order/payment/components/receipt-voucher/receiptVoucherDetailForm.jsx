import React, { Component } from "react";
import { DialogModal } from "../../../../../../common-components";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../../helpers/formatDate";

class ReceiptVoucherDetailForm extends Component {
    getPaidForPayment = (salesOrders) => {
        let paid = salesOrders.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.money;
        }, 0);

        return formatCurrency(paid);
    };

    render() {
        const { paymentDetail } = this.props;

        let paymentTypeConvert = ["", "Tiền mặt", "Chuyển khoản"];
        return (
            <DialogModal
                modalID="modal-receipt-voucher-detail"
                isLoading={false}
                formID="form-receipt-voucher-detail-form"
                title={"Chi tiết phiếu thu"}
                size="50"
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-receipt-voucher-detail-form`}>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <strong>Khách hàng :&emsp;</strong>
                            {paymentDetail.customer ? paymentDetail.customer.code + " - " + paymentDetail.customer.name : ""}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <strong>Người nhận thanh toán :&emsp;</strong>
                            {paymentDetail.customer ? paymentDetail.curator.name : ""}
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
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <strong>Tổng tiền thanh toán :&emsp;</strong>
                            {paymentDetail.salesOrders ? this.getPaidForPayment(paymentDetail.salesOrders) : ""}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thanh toán cho từng đơn</legend>
                            <table id={`receipt-voucher-detail-sales-order`} className="table table-bordered not-sort">
                                <thead>
                                    <tr>
                                        <th title={"STT"}>STT</th>
                                        <th title={"Mã đơn"}>Mã đơn hàng</th>
                                        <th title={"Số tiền thanh toán"}>Số tiền thanh toán</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentDetail.salesOrders.length !== 0 &&
                                        paymentDetail.salesOrders.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.salesOrder.code}</td>
                                                    <td>{item.money ? formatCurrency(item.money) : ""}</td>
                                                </tr>
                                            );
                                        })}
                                    {paymentDetail.salesOrders.length !== 0 && (
                                        <tr>
                                            <td colSpan={2} style={{ fontWeight: 600 }}>
                                                <center>Tổng thanh toán</center>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>
                                                {formatCurrency(
                                                    paymentDetail.salesOrders.reduce((accumulator, currentValue) => {
                                                        return accumulator + currentValue.money;
                                                    }, 0)
                                                )}
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
}

export default ReceiptVoucherDetailForm;
