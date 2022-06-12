import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../common-components";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../helpers/formatDate";

function PurchaseDetailForm(props) {

    const getPaidTotalMoney = () => {
        const { paymentsForOrder } = props.payments;
        let paid = 0;
        if (paymentsForOrder.length) {
            paid = paymentsForOrder.reduce((accumulator, currentValue) => {
                if (currentValue.purchaseOrders.length) {
                    return accumulator + parseInt(currentValue.purchaseOrders[0].money);
                }
                return accumulator;
            }, 0);
        }

        return formatCurrency(paid);
    };


    const {
        code,
        approvers,
        stock,
        intendReceiveTime,
        supplier,
        discount,
        purchasingRequest,
        status,
        materials,
        description,
        paymentAmount,
    } = props.purchaseOrderDetail;
    const statusConvert = [
        {
            className: "text-primary",
            text: "no status",
        },
        {
            className: "text-primary",
            text: "Chờ phê duyệt",
        },
        {
            className: "text-warning",
            text: "Đã phê duyệt",
        },
        {
            className: "text-success",
            text: "Đã nhập kho",
        },
        {
            className: "text-success",
            text: "Đã hủy",
        },
    ];

    const { translate, payments } = props;
    let paymentsForOrder = [];
    if (payments.isLoading === false) {
        paymentsForOrder = payments.paymentsForOrder;
    }

    let paymentTypeConvert = ["", "Tiền mặt", "Chuyển khoản"];
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-detail-purchase-order"
                isLoading={false}
                formID="form-detail-purchase-order"
                title={"Chi tiết đơn mua nguyên vật liệu"}
                size="75"
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-purchase-order`}>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <strong>Mã đơn :&emsp;</strong>
                            {code}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <strong>Người phê duyệt :&emsp;</strong>
                            {approvers.length !== 0 ? approvers.map((item) => <span>{item.approver&&item.approver.name}, </span>) : ""}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <strong>Kho nhập nguyên vật liệu:&emsp;</strong>
                            {stock ? stock.name : ""}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <strong>Ngày dự kiến nhập hàng :&emsp;</strong>
                            {intendReceiveTime ? formatDate(intendReceiveTime) : ""}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <strong>Nhà cung cấp :&emsp;</strong>
                            {supplier ? supplier.name : ""}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <strong>Tiền khuyến mãi :&emsp;</strong>
                            {discount ? formatCurrency(discount) : ""}
                        </div>
                    </div>
                    {purchasingRequest && (
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <strong>Được tạo từ đơn đề nghị :&emsp;</strong>
                                {purchasingRequest.code}
                            </div>
                        </div>
                    )}
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <strong>Trạng thái đơn :&emsp;</strong>
                            <span className={status ? statusConvert[status].className : ""}>{status ? statusConvert[status].text : ""}</span>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <strong>Ghi chú :&emsp;</strong>
                            {description}
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin nguyên vật liệu</legend>
                            <table id={`purchase-order-detail-table`} className="table table-bordered not-sort">
                                <thead>
                                    <tr>
                                        <th title={"STT"}>STT</th>
                                        <th title={"Mã đơn"}>Nguyên vật liệu</th>
                                        <th title={"Mã đơn"}>Đơn vị tính</th>
                                        <th title={"Tổng tiền"}>Số lượng</th>
                                        <th title={"Còn"}>Giá nhập</th>
                                        <th title={"Số tiền thanh toán"}>Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materials.length !== 0 &&
                                        materials.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.material ? item.material.name : ""}</td>
                                                    <td>{item.material ? item.material.baseUnit : ""}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.price ? formatCurrency(item.price) : ""}</td>
                                                    <td style={{ fontWeight: 600 }}>
                                                        {item.price * item.quantity ? formatCurrency(item.price * item.quantity) : ""}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    {materials.length !== 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ fontWeight: 600 }}>
                                                <center>Tổng thanh toán</center>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{paymentAmount ? formatCurrency(paymentAmount) : ""}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </fieldset>
                    </div>
                    {paymentsForOrder && paymentsForOrder.length !== 0 && (
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin chi trả</legend>
                                <table id={`receipt-voucher-detail-sales-order`} className="table table-bordered not-sort">
                                    <thead>
                                        <tr>
                                            <th title={"STT"}>STT</th>
                                            <th title={"Mã phiếu thu"}>Mã phiếu chi</th>
                                            <th title={"Phương thức thanh toán"}>Phương thức thanh toán</th>
                                            <th title={"Tài khoản thụ hưởng"}>Người thanh toán</th>
                                            <th title={"Số tiền thanh toán"}>Thanh toán lúc</th>
                                            <th title={"Tài khoản thụ hưởng"}>Tài khoản thanh toán</th>
                                            <th title={"Tài khoản thụ hưởng"}>Chủ tài khoản</th>
                                            <th title={"Tài khoản thụ hưởng"}>Ngân hàng</th>
                                            <th title={"Tài khoản thụ hưởng"}>Tài khoản nhận tiền</th>
                                            <th title={"Số tiền thanh toán"}>Số tiền thanh toán</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentsForOrder.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.code}</td>
                                                    <td>{paymentTypeConvert[item.paymentType]}</td>
                                                    <td>{item.curator ? item.curator.name : "---"}</td>
                                                    <td>{item.paymentAt ? formatDate(item.paymentAt) : "---"}</td>
                                                    <td>{item.bankAccountReceived ? item.bankAccountReceived.account : "---"}</td>
                                                    <td>{item.bankAccountReceived ? item.bankAccountReceived.owner : "---"}</td>
                                                    <td>{item.bankAccountReceived ? item.bankAccountReceived.bankAcronym : "---"}</td>
                                                    <td>{item.bankAccountPartner}</td>
                                                    <td>{item.purchaseOrders.length ? formatCurrency(item.purchaseOrders[0].money) : "0"}</td>
                                                </tr>
                                            );
                                        })}
                                        {
                                            <tr>
                                                <td colSpan={9} style={{ fontWeight: 600 }}>
                                                    <center>Tổng tiền đã thanh toán</center>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>{getPaidTotalMoney()}</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    )}
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { payments } = state;
    return { payments };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseDetailForm));
