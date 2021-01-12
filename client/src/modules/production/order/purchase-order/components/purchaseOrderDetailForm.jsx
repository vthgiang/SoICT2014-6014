import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../common-components";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../helpers/formatDate";

class PurchaseDetailForm extends Component {
    constructor(props) {
        super(props);
    }

    getPaymentAmount = (materials, discount) => {
        let paymentAmount = 0;

        paymentAmount = materials.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.price * currentValue.quantity;
        }, 0);

        if (discount) {
            paymentAmount = paymentAmount - discount >= 0 ? paymentAmount - discount : 0;
        }

        return formatCurrency(paymentAmount);
    };

    render() {
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
        } = this.props.purchaseOrderDetail;
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
        ];
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-detail-purchase-order"
                    isLoading={false}
                    formID="form-detail-purchase-order"
                    title={"Chi tiết đơn mua nguyên vật liệu"}
                    size="50"
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
                                {approvers.length !== 0 ? approvers.map((item) => <span>{item.approver.name}, </span>) : ""}
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
                                                <td style={{ fontWeight: 600 }}>{this.getPaymentAmount(materials, discount)}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(PurchaseDetailForm));
