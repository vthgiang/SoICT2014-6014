import React, { Component } from "react";
import { DialogModal } from "../../../../../common-components";
import { formatDate } from "../../../../../helpers/formatDate";
import { formatCurrency } from "../../../../../helpers/formatCurrency";

class DiscountDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discountId: "",
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.discountDetail._id !== this.state.discountId) {
            this.setState({
                discountId: nextProps.discountDetail._id,
            });
            return false;
        }
        return true;
    }

    getTitleDiscountTable = (formality) => {
        switch (parseInt(formality)) {
            case 0:
                return "Mức giảm tiền mặt";
            case 1:
                return "Mức phần trăm";
            case 2:
                return "Mức xu được tặng";
            case 3:
                return "Phí v/c được giảm tối đa";
            case 4:
                return "Các sản phẩm được tặng kèm";
            default:
                return "";
        }
    };

    getContentDiscountTable = (formality, discount) => {
        switch (parseInt(formality)) {
            case 0:
                return discount.discountedCash;
            case 1:
                return discount.discountedPercentage;
            case 2:
                return discount.loyaltyCoin;
            case 3:
                return discount.maximumFreeShippingCost;
            case 4:
                return <a>{"Có " + discount.bonusGoods.length + " mặt hàng"}</a>;
            default:
                return "";
        }
    };

    render() {
        const { code, name, creator, description, status, type, formality, discounts, effectiveDate, expirationDate } = this.props.discountDetail;
        const typeConvert = ["Giảm trên toàn đơn", "Giảm giá từng mặt hàng"];
        const formalityConvert = [
            "Giảm tiền mặt",
            "Giảm theo phần trăm",
            "Tặng xu",
            "Miễn phí vận chuyển",
            "Tặng kèm hàng hóa",
            "Giảm giá bán sản phẩm",
        ];
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-detail-discount"
                    isLoading={false}
                    formID="form-detail-discount"
                    title={"Chi tiết giảm giá"}
                    size="75"
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-sla`}>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <strong>Mã:&emsp;</strong>
                                {code}
                            </div>
                            <div className="form-group">
                                <strong>Tên giảm giá:&emsp;</strong>
                                {name}
                            </div>
                            <div className="form-group">
                                <strong>Loại giảm giá:&emsp;</strong>
                                {type !== undefined ? typeConvert[type] : ""}
                            </div>
                            <div className="form-group">
                                <strong>Hình thức giảm giá:&emsp;</strong>
                                {formality !== undefined ? formalityConvert[formality] : ""}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <strong>Ngày bắt đầu:&emsp;</strong>
                                {effectiveDate ? formatDate(effectiveDate) : ""}
                            </div>
                            <div className="form-group">
                                <strong>Ngày kết thúc:&emsp;</strong>
                                {expirationDate ? formatDate(expirationDate) : ""}
                            </div>
                            <div className="form-group">
                                <strong>Mô tả:&emsp;</strong>
                                {description}
                            </div>
                            <div className="form-group">
                                <strong>Người chỉnh sửa lần cuối:&emsp;</strong>
                                {creator ? creator.name : ""}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{"Chi tiết giảm giá"}</legend>
                                <table id={`order-table-discount-create-detail`} className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Loại khách hàng</th>
                                            <th>{type == "0" ? "Giá trị tối thiểu" : "Số lượng tối thiểu"}</th>
                                            <th>{type == "0" ? "Giá trị tối đa" : "Số lượng tối đa"}</th>
                                            {type == "1" ? <th>Các mặt hàng áp dụng</th> : ""}
                                            {formality != "5" ? <th>{this.getTitleDiscountTable(formality)}</th> : ""}
                                            {formality == "1" ? <th>Mức tiền giảm tối đa</th> : ""}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!discounts || discounts.length === 0 ? (
                                            <tr>
                                                <td colSpan={5}>
                                                    <center>Chưa có dữ liệu</center>
                                                </td>
                                            </tr>
                                        ) : (
                                            discounts.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.customerType}</td>
                                                        <td>
                                                            {item.minimumThresholdToBeApplied ? formatCurrency(item.minimumThresholdToBeApplied) : ""}
                                                        </td>
                                                        <td>
                                                            {item.maximumThresholdToBeApplied ? formatCurrency(item.maximumThresholdToBeApplied) : ""}
                                                        </td>
                                                        {type == "1" && item.discountOnGoods ? (
                                                            <td className="discount-create-goods-block-td">
                                                                <a>{"Có " + item.discountOnGoods.length + " mặt hàng"}</a>
                                                            </td>
                                                        ) : null}
                                                        {console.log("getContentDiscountTable", this.getContentDiscountTable(formality, item))}
                                                        {formality != "5" ? <td>{this.getContentDiscountTable(formality, item)}</td> : ""}
                                                        {formality == "1" ? (
                                                            <td>{item.maximumDiscountedCash ? formatCurrency(item.maximumDiscountedCash) : ""}</td>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </tr>
                                                );
                                            })
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

export default DiscountDetailForm;
