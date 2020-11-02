import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { generateCode } from "../../../../../helpers/generateCode";
import { formatDate } from "../../../../../helpers/formatDate";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { DiscountActions } from "../redux/actions";
import { DialogModal, DatePicker, ButtonModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";

class DiscountCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            description: "",
            discountType: 0,
            customerType: 0,
            formality: 0,
            effectiveDate: "",
            expirationDate: "",
        };
    }

    componentWillMount() {
        this.props.getAllGoodsByType({ type: "product" });
    }

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, code: generateCode("DIS_") };
        });
    };

    handleNameChange = (e) => {
        let { value = "" } = e.target;
        this.setState((state) => {
            return {
                ...state,
                name: value,
            };
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({ nameError: message });
    };

    handleDescriptionChange = (e) => {
        let { value = "" } = e.target;
        this.setState((state) => {
            return {
                ...state,
                description: value,
            };
        });
    };

    handleChangeDiscountType = (value) => {
        if (!value) {
            value = null;
        }
        this.setState({ discountType: parseInt(value[0]) });
    };

    handleChangeEffectiveDate = (value) => {
        if (!value) {
            value = null;
        }

        this.setState({
            ...this.state,
            effectiveDate: value,
        });
    };

    handleChangeExpirationDate = (value) => {
        if (!value) {
            value = null;
        }

        this.setState({
            ...this.state,
            expirationDate: value,
        });
    };

    handleAddBonusGood = () => {
        this.setState((state) => {
            return {
                ...state,
                bonusGoods: [
                    ...state.bonusGoods,
                    {
                        good: "",
                        quantityOfBonusGood: "",
                        quantity: 0,
                        baseUnit: "",
                    },
                ],
            };
        });
    };

    render() {
        const { translate } = this.props;
        const {
            name,
            code,
            description,
            nameError,
            discountTypeError,
            discountType,
            customerType,
            formality,
            effectiveDate,
            expirationDate,
            minimumThresholdToBeApplied,
            maximumThresholdToBeApplied,
            discountedCash,
            discountedPercentage,
            loyaltyCoin,
            maximumFreeShippingCost,
            maximumDiscountedCash,
            bonusGoods,
            discountOnGoods,
        } = this.state;
        console.log("STATE", this.state);
        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
                    modalID={`modal-create-discount`}
                    button_name={"Thêm khuyến mãi"}
                    title={"Thêm khuyến mãi"}
                    onButtonCallBack={this.handleClickCreateCode}
                />
                <DialogModal
                    modalID={`modal-create-discount`}
                    isLoading={false}
                    formID={`form-create-discount`}
                    title={"Thêm khuyến mãi"}
                    msg_success={"Thêm thành công"}
                    msg_faile={"Thêm thất bại"}
                    // disableSubmit={!this.isFormValidated()}
                    // func={this.save}
                    size="75"
                    style={{ backgroundColor: "green" }}
                >
                    <form id={`form-create-discount`}>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>
                                    {"Mã giảm giá"}
                                    <span className="attention"> </span>
                                </label>
                                <input type="text" className="form-control" value={code} disabled="true" />
                            </div>
                            <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                                <label>
                                    {"Tên giảm giá"}
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" value={name} onChange={this.handleNameChange} />
                                <ErrorLabel content={nameError} />
                            </div>
                            <div className={`form-group ${!discountTypeError ? "" : "has-error"}`}>
                                <label>
                                    {"Loại giảm giá"}
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-create-discount-type`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: 0, text: "Giảm giá trên toàn đơn hàng" },
                                        { value: 1, text: "Giảm giá từng mặt hàng" },
                                    ]}
                                    onChange={this.handleChangeDiscountType}
                                    multiple={false}
                                    value={discountType}
                                />
                                <ErrorLabel content={discountTypeError} />
                            </div>
                            <div className={`form-group`}>
                                <label>
                                    {"Hình thức giảm giá"}
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-create-discount-formality`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: 0, text: "Giảm giá tiền" },
                                        { value: 1, text: "Giảm giá theo %" },
                                        { value: 2, text: "Tặng xu" },
                                        { value: 3, text: "Miễn phí vận chuyển" },
                                        { value: 4, text: "Tặng sản phẩm kèm theo" },
                                    ]}
                                    onChange={this.handleChangeDiscountFormality}
                                    multiple={false}
                                    value={formality}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Ngày bắt đầu</label>
                                <DatePicker
                                    id="date_picker_discount_effectiveDate"
                                    value={effectiveDate}
                                    onChange={this.handleChangeEffectiveDate}
                                    disabled={false}
                                />
                            </div>

                            <div className="form-group">
                                <label>Ngày kết thúc</label>
                                <DatePicker
                                    id="date_picker_discount_expirationDate"
                                    value={expirationDate}
                                    onChange={this.handleChangeExpirationDate}
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    {"Mô tả"}
                                    <span className="attention"> </span>
                                </label>
                                <textarea type="text" rows={4} className="form-control" value={description} onChange={this.handleDescriptionChange} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{"Chi tiết giảm giá"}</legend>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group`}>
                                        <label>
                                            {"Khách hàng được áp dụng"}
                                            <span className="attention"> * </span>
                                        </label>
                                        <SelectBox
                                            id={`select-create-discount-customer-type`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[
                                                { value: 0, text: "Khách thường" },
                                                { value: 1, text: "Khách VIP" },
                                                { value: 2, text: "Tất cả" },
                                            ]}
                                            onChange={this.handleChangeCustomerType}
                                            multiple={false}
                                            value={customerType}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className="form-group">
                                        <label>
                                            {discountType === 0 ? "Đơn hàng có giá trị từ:" : "Số lượng hàng từ: "}
                                            <span className="attention"> </span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={minimumThresholdToBeApplied}
                                            placeholder={discountType === 0 ? "vnđ" : "đơn vị"}
                                            onChange={this.handleMaximumThresholdToBeAppliedChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className="form-group">
                                        <label>
                                            {discountType === 0 ? "Đến: " : "Đến: "}
                                            <span className="attention"> </span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={maximumThresholdToBeApplied}
                                            onChange={this.handleMaximumThresholdToBeAppliedChange}
                                            placeholder={discountType === 0 ? "vnđ" : "đơn vị"}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className="form-group">
                                        <label>
                                            {"Phần trăm giảm giá"}
                                            <span className="attention"> </span>
                                        </label>
                                        <input type="number" className="form-control" value={discountedPercentage} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className="form-group">
                                        <label>
                                            {"Số tiền giảm giá tối đa"}
                                            <span className="attention"> </span>
                                        </label>
                                        <input type="number" className="form-control" value={maximumDiscountedCash} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className="form-group">
                                        <label>
                                            {"Sản phẩm được tặng kèm"}
                                            <span className="attention"> </span>
                                        </label>
                                        <SelectBox
                                            id={`select-create-discount-bonus-goods`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[
                                                { value: 0, text: "Khách thường" },
                                                { value: 1, text: "Khách VIP" },
                                                { value: 2, text: "Tất cả" },
                                            ]}
                                            onChange={this.handleChangeCustomerType}
                                            multiple={false}
                                            value={bonusGoods}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className="form-group">
                                        <label>
                                            {"Số lượng"}
                                            <span className="attention"> </span>
                                        </label>
                                        <input type="number" className="form-control" value={maximumDiscountedCash} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>
                                        Thông tin mặt hàng:
                                        <a style={{ cursor: "pointer" }} title="Thêm thông tin mặt hàng">
                                            <i
                                                className="fa fa-plus-square"
                                                style={{ color: "#00a65a", marginLeft: 5 }}
                                                onClick={this.handleAddBonusGood}
                                            />
                                        </a>
                                    </label>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className={`form-group`}>
                                            {/* Bảng thông tin chi tiết */}
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>STT</th>
                                                        <th>Mặt hàng</th>
                                                        <th>Hạn sử dụng</th>
                                                        <th>Đơn vị tính</th>
                                                        <th>Số lượng</th>
                                                        <th>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {!bonusGoods || bonusGoods.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5}>
                                                                <center>Chưa có dữ liệu</center>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        bonusGoods.map((good, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    {/* Tên trường dữ liệu */}
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <SelectBox
                                                                            id={`select-discount-bonus-good`}
                                                                            className="form-control select2"
                                                                            style={{ width: "100%" }}
                                                                            value={bonusGoods}
                                                                            items={[
                                                                                { value: "1", text: "penicillin" },
                                                                                { value: "2", text: "Bộ khô" },
                                                                                { value: "3", text: "Nước cất" },
                                                                                { value: "4", text: "Vỏ cây" },
                                                                            ]}
                                                                            onChange={this.handleBonusGoodsChange}
                                                                            multiple={false}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            value={good.name}
                                                                            name="nameField"
                                                                            style={{ width: "100%" }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            value={good.baseUnit}
                                                                            name="nameField"
                                                                            style={{ width: "100%" }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            value={good.quantity}
                                                                            name="nameField"
                                                                            style={{ width: "100%" }}
                                                                        />
                                                                    </td>

                                                                    {/* Hành động */}
                                                                    <td style={{ textAlign: "center" }}>
                                                                        <a
                                                                            className="delete"
                                                                            title="Delete"
                                                                            data-toggle="tooltip"
                                                                            onClick={() => this.handleDeleteGood(good)}
                                                                        >
                                                                            <i className="material-icons"></i>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    createNewDiscount: DiscountActions.createNewDiscount,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DiscountCreateForm));
