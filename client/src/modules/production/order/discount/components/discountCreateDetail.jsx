import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import ValidationHelper from "../../../../../helpers/validationHelper";
import CreateBonusGoods from "./createBonusGoods";
import CreateDiscountOnGoods from "./createDiscountOnGoods";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { DialogModal, DatePicker, ButtonModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import "./discount.css";
import CollapsibleShowDiscountOnGoods from "./collapsibleShowDiscountOnGoods";
import CollapsibleShowBonusGoods from "./collapsibleShowBonusGoods";

class DiscountCreateDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discountedCash: "",
            discountedPercentage: "",
            loyaltyCoin: "",
            maximumFreeShippingCost: "",
            maximumDiscountedCash: "",
            minimumThresholdToBeApplied: "",
            maximumThresholdToBeApplied: "",
            customerType: 2,
            bonusGoods: [],
            discountOnGoods: [],
            goods: [],
            selectAll: true,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.discountType !== prevState.discountType || nextProps.formality !== prevState.formality) {
            return {
                discountedCash: "",
                discountedPercentage: "",
                loyaltyCoin: "",
                maximumFreeShippingCost: "",
                maximumDiscountedCash: "",
                minimumThresholdToBeApplied: "",
                maximumThresholdToBeApplied: "",
                customerType: 2,
                bonusGoods: [],
                discountOnGoods: [],
                goods: [],
                selectAll: true,
                discountType: nextProps.discountType,
                formality: nextProps.formality,
            };
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.discountCode !== this.props.discountCode) {
            this.setState({
                bonusGoods: [],
                discountOnGoods: [],
                goods: [],
                editDiscountDetail: false,
            });
            return false;
        }
        return true;
    };

    getAllGoods = () => {
        const { translate, goods } = this.props;
        const { selectAll } = this.state;
        let listGoods = [
            selectAll
                ? {
                      value: "all",
                      text: "CHỌN TẤT CẢ",
                  }
                : {
                      value: "unselected",
                      text: "BỎ CHỌN TẤT CẢ",
                  },
        ];

        const { listGoodsByType } = goods;

        if (listGoodsByType) {
            listGoodsByType.map((item) => {
                listGoods.push({
                    value: item._id,
                    text: item.code + "-" + item.name,
                });
            });
        }

        return listGoods;
    };

    handleAddBonusGood = () => {
        const { actionType } = this.props;
        window.$(`#modal-${actionType}-discount-bonus-goods`).modal("show");
    };

    handleAddDiscountOnGoods = () => {
        const { actionType } = this.props;
        window.$(`#modal-${actionType}-discount-on-goods`).modal("show");
    };

    handleSubmitBonusGoods = (dataSubmit) => {
        console.log("Data bonus", dataSubmit);
        this.setState({
            bonusGoods: dataSubmit,
        });
    };

    handleSubmitDiscountOnGoods = (dataSubmit) => {
        this.setState({
            discountOnGoods: dataSubmit,
        });
    };
    handleGoodChange = async (goods) => {
        // if (goods.length === 0) {
        //     goods = null;
        // }
        let checkSelectedAll = [];
        if (goods) {
            checkSelectedAll = await goods.filter((item) => {
                return item === "all" || item === "unselected";
            });
        }

        if (checkSelectedAll.length && checkSelectedAll[0] === "all" && goods) {
            goods = await this.getAllGoods().map((item) => {
                return item.value;
            });

            goods.splice(0, 1); //lấy phần tử all ra khỏi mảng
        } else if (checkSelectedAll.length && checkSelectedAll[0] === "unselected" && goods) {
            goods = [];
        }

        if (goods && goods.length === this.getAllGoods().length - 1) {
            //Tất cả các mặt hàng đã được chọn
            this.setState({
                selectAll: false,
            });
        } else if (!this.state.selectAll) {
            this.setState({
                selectAll: true,
            });
        }

        await this.setState((state) => {
            return {
                ...state,
                goods: goods,
            };
        });
        this.validateGoods(goods, true);
    };

    validateGoods = (goods, willUpdateState = true) => {
        let msg = undefined;
        if (goods && goods.length === 0) {
            const { translate } = this.props;
            msg = "Mặt hàng không được để trống";
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    goodError: msg,
                };
            });
        }
        return msg;
    };

    validateCustomerType = (value, willUpdateState = true) => {
        let msg = undefined;

        if (!value.length) {
            msg = "Giá trị không được để trống";
        }

        if (willUpdateState) {
            this.setState({
                customerType: value[0],
                customerTypeError: msg,
            });
        }
        return msg;
    };

    handleChangeCustomerType = (value) => {
        this.validateCustomerType(value, true);
    };

    validateMinimumThreshold = (minimum, willUpdateState = true) => {
        const { maximumThresholdToBeApplied } = this.state;
        let msg = undefined;
        if (parseInt(minimum) < 0) {
            msg = "Giá trị không được âm";
        } else if (minimum && maximumThresholdToBeApplied) {
            if (parseInt(minimum) >= parseInt(maximumThresholdToBeApplied)) {
                msg = "Mức tối thiểu phải nhỏ hơn mức tối đa";
            } else {
                msg = undefined;
            }
        }
        if (willUpdateState) {
            this.setState({
                minimumThresholdToBeApplied: minimum,
                minimumThresholdError: msg,
            });
        }
        return msg;
    };

    validateMaximumThreshold = (maximum, willUpdateState = true) => {
        const { minimumThresholdToBeApplied } = this.state;
        let msg = undefined;
        if (parseInt(maximum) <= 0) {
            msg = "Giá trị phải lớn hơn 0";
        } else if (minimumThresholdToBeApplied && maximum) {
            if (parseInt(minimumThresholdToBeApplied) >= parseInt(maximum)) {
                msg = "Mức tối thiểu phải nhỏ hơn mức tối đa";
            } else {
                msg = undefined;
            }
        }
        if (willUpdateState) {
            this.setState({
                maximumThresholdToBeApplied: maximum,
                maximumThresholdError: msg,
            });
        }
        return msg;
    };

    handleMinimumThresholdToBeAppliedChange = (e) => {
        this.validateMinimumThreshold(e.target.value, true);
    };

    handleMaximumThresholdToBeAppliedChange = (e) => {
        this.validateMaximumThreshold(e.target.value, true);
    };

    validateDiscountCash = (value, willUpdateState = true) => {
        let msg = undefined;

        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }

        if (willUpdateState) {
            this.setState({
                discountedCash: value,
                discountedCashError: msg,
            });
        }

        return msg;
    };

    handleDiscountCashChange = (e) => {
        this.validateDiscountCash(e.target.value, true);
    };

    validateDiscountedPercentage = (value, willUpdateState = true) => {
        let msg = undefined;

        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }

        if (willUpdateState) {
            this.setState({
                discountedPercentage: value,
                discountedPercentageError: msg,
            });
        }

        return msg;
    };

    hanlleDiscountedPercentageChange = (e) => {
        this.validateDiscountedPercentage(e.target.value, true);
    };

    validateMaximumDiscountedCash = (value, willUpdateState = true) => {
        let msg = undefined;

        if (parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }

        if (willUpdateState) {
            this.setState({
                maximumDiscountedCash: value,
                maximumDiscountedCashError: msg,
            });
        }

        return msg;
    };

    handleMaximumDiscountedCashChange = (e) => {
        this.validateMaximumDiscountedCash(e.target.value, true);
    };

    validateLoyaltyCoin = (value, willUpdateState = true) => {
        let msg = undefined;

        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }

        if (willUpdateState) {
            this.setState({
                loyaltyCoin: value,
                loyaltyCoinError: msg,
            });
        }

        return msg;
    };

    handleLoyaltyCoinChange = (e) => {
        this.validateLoyaltyCoin(e.target.value, true);
    };

    validateMaximumFreeShippingCost = (value, willUpdateState = true) => {
        let msg = undefined;

        if (parseInt(value) <= 0) {
            msg = "Giá trị không được âm";
        }

        if (willUpdateState) {
            this.setState({
                maximumFreeShippingCost: value,
                maximumFreeShippingCostError: msg,
            });
        }

        return msg;
    };

    handleMaximumFreeShippingCostChange = (e) => {
        this.validateMaximumFreeShippingCost(e.target.value, true);
    };

    getFieldDiscountForSubmit = () => {
        let { discountType, formality } = this.state;
        let {
            discountedCash,
            discountedPercentage,
            loyaltyCoin,
            maximumFreeShippingCost,
            maximumDiscountedCash,
            minimumThresholdToBeApplied,
            maximumThresholdToBeApplied,
            customerType,
            bonusGoods,
            discountOnGoods,
            goods,
        } = this.state;

        if (formality != 5) {
            discountOnGoods = goods.map((item) => {
                return {
                    good: { _id: item },
                };
            });
        }

        let discount = {};

        if (discountedCash) {
            discount.discountedCash = discountedCash;
        }
        if (discountedPercentage) {
            discount.discountedPercentage = discountedPercentage;
        }
        if (loyaltyCoin) {
            discount.loyaltyCoin = loyaltyCoin;
        }
        if (maximumFreeShippingCost) {
            discount.maximumFreeShippingCost = maximumFreeShippingCost;
        }
        if (maximumDiscountedCash) {
            discount.maximumDiscountedCash = maximumDiscountedCash;
        }
        if (minimumThresholdToBeApplied) {
            discount.minimumThresholdToBeApplied = minimumThresholdToBeApplied;
        }
        if (maximumThresholdToBeApplied) {
            discount.maximumThresholdToBeApplied = maximumThresholdToBeApplied;
        }
        if (customerType) {
            discount.customerType = customerType;
        }
        if (bonusGoods && bonusGoods.length !== 0) {
            discount.bonusGoods = bonusGoods;
        }
        if (discountOnGoods && discountOnGoods.length !== 0) {
            discount.discountOnGoods = discountOnGoods;
        }

        return discount;
    };

    handleSubmitDiscountDetail = async (e) => {
        e.preventDefault();
        let { discounts } = this.props;

        let discount = this.getFieldDiscountForSubmit();

        discounts.push(discount);
        await this.props.onChangeDiscounts(discounts);
        await this.setState((state) => {
            return {
                ...state,
                discountedCash: "",
                discountedPercentage: "",
                loyaltyCoin: "",
                maximumFreeShippingCost: "",
                maximumDiscountedCash: "",
                minimumThresholdToBeApplied: "",
                maximumThresholdToBeApplied: "",
                customerType: 2,
                bonusGoods: [],
                discountOnGoods: [],
                goods: [],
                selectAll: true,
            };
        });
    };

    handleClearDiscountDetail = async (e) => {
        e.preventDefault();
        await this.setState((state) => {
            return {
                ...state,
                discountedCash: "",
                discountedPercentage: "",
                loyaltyCoin: "",
                maximumFreeShippingCost: "",
                maximumDiscountedCash: "",
                minimumThresholdToBeApplied: "",
                maximumThresholdToBeApplied: "",
                customerType: 2,
                bonusGoods: [],
                discountOnGoods: [],
                goods: [],
            };
        });
    };

    handleEditDiscountDetail = (discountDetail, index) => {
        let { formality } = this.props;
        let goods = [];
        if (formality !== 5 && discountDetail.discountOnGoods && discountDetail.discountOnGoods.length) {
            goods = discountDetail.discountOnGoods.map((item) => item.good._id);
        }

        this.setState({
            customerType: discountDetail.customerType,
            minimumThresholdToBeApplied: discountDetail.minimumThresholdToBeApplied,
            maximumThresholdToBeApplied: discountDetail.maximumThresholdToBeApplied,
            discountedCash: discountDetail.discountedCash,
            discountedPercentage: discountDetail.discountedPercentage,
            loyaltyCoin: discountDetail.loyaltyCoin,
            maximumFreeShippingCost: discountDetail.maximumFreeShippingCost,
            maximumDiscountedCash: discountDetail.maximumDiscountedCash,
            bonusGoods: discountDetail.bonusGoods,
            discountOnGoods: formality == 5 ? discountDetail.discountOnGoods : [],
            goods,
            indexEditting: index,
            editDiscountDetail: true,
        });
    };

    handleCancelEditDiscountDetail = (e) => {
        e.preventDefault();
        this.setState((state) => {
            return {
                ...state,
                discountedCash: "",
                discountedPercentage: "",
                loyaltyCoin: "",
                maximumFreeShippingCost: "",
                maximumDiscountedCash: "",
                minimumThresholdToBeApplied: "",
                maximumThresholdToBeApplied: "",
                customerType: 2,
                bonusGoods: [],
                discountOnGoods: [],
                goods: [],
                indexEditting: "",
                editDiscountDetail: false,
            };
        });
    };

    handleSaveEditDiscountDetail = () => {
        let { discounts } = this.props;
        let { indexEditting } = this.state;
        let discount = this.getFieldDiscountForSubmit();
        discounts[indexEditting] = discount;
        this.props.onChangeDiscounts(discounts);
        this.setState((state) => {
            return {
                ...state,
                discountedCash: "",
                discountedPercentage: "",
                loyaltyCoin: "",
                maximumFreeShippingCost: "",
                maximumDiscountedCash: "",
                minimumThresholdToBeApplied: "",
                maximumThresholdToBeApplied: "",
                customerType: 2,
                bonusGoods: [],
                discountOnGoods: [],
                goods: [],
                indexEditting: "",
                editDiscountDetail: false,
            };
        });
    };

    handleDeleteDiscountDeatail = (index) => {
        let { discounts } = this.props;
        discounts.splice(index, 1);
        this.props.onChangeDiscounts(discounts);
    };

    isValidateDiscountDeatail = () => {
        const {
            discountedCash,
            discountedPercentage,
            loyaltyCoin,
            customerType,
            bonusGoods,
            discountOnGoods,
            goods,
            minimumThresholdToBeApplied,
            maximumThresholdToBeApplied,
        } = this.state;
        const { formality, discountType } = this.props;
        const { translate } = this.props;
        if (formality == "0") {
            if (!ValidationHelper.validateEmpty(translate, discountedCash).status || this.validateDiscountCash(discountedCash, false)) {
                return false;
            }
        } else if (formality == "1") {
            if (!ValidationHelper.validateEmpty(translate, discountedPercentage).status) {
                return false;
            }
        } else if (formality == "2") {
            if (!ValidationHelper.validateEmpty(translate, loyaltyCoin).status) {
                return false;
            }
        } else if (formality == "3") {
        } else if (formality == "4") {
            if (this.validateGoods(bonusGoods, false)) {
                return false;
            }
        } else if (formality == "5") {
            if (this.validateGoods(discountOnGoods, false)) {
                return false;
            }
        }

        if (discountType == "1" && formality != "5") {
            if (this.validateGoods(goods, false)) {
                return false;
            }
        }

        if (this.validateMinimumThreshold(minimumThresholdToBeApplied, false) || this.validateMaximumThreshold(maximumThresholdToBeApplied, false)) {
            return false;
        }

        if (!ValidationHelper.validateEmpty(translate, customerType).status) {
            return false;
        }
        return true;
    };

    getTitleDiscountTable = () => {
        const { formality } = this.props;
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

    getContentDiscountTable = (discount) => {
        const { formality } = this.props;
        switch (formality) {
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
        const { discountType, formality, discounts } = this.props;
        const { translate } = this.props;
        const {
            customerType,
            minimumThresholdToBeApplied,
            maximumThresholdToBeApplied,
            discountedCash,
            discountedPercentage,
            loyaltyCoin,
            maximumFreeShippingCost,
            maximumDiscountedCash,
            bonusGoods,
            discountOnGoods,
            minimumThresholdError,
            maximumThresholdError,
            discountedCashError,
            discountedPercentageError,
            maximumDiscountedCashError,
            loyaltyCoinError,
            maximumFreeShippingCostError,
            goods,
            editDiscountDetail,
            goodError,
        } = this.state;

        return (
            <React.Fragment>
                <CreateBonusGoods
                    handleSubmitBonusGoods={(data) => this.handleSubmitBonusGoods(data)}
                    discountType={this.props.discountType}
                    formality={this.props.formality}
                    actionType={this.props.actionType}
                    bonusGoods={bonusGoods}
                    editDiscountDetail={editDiscountDetail}
                    discountCode={this.props.discountCode}
                    indexEdittingDiscount={this.state.indexEditting}
                />
                <CreateDiscountOnGoods
                    handleSubmitDiscountOnGoods={(data) => this.handleSubmitDiscountOnGoods(data)}
                    discountType={this.props.discountType}
                    formality={this.props.formality}
                    actionType={this.props.actionType}
                    discountOnGoods={discountOnGoods}
                    editDiscountDetail={editDiscountDetail}
                    discountCode={this.props.discountCode}
                    indexEdittingDiscount={this.state.indexEditting}
                />
                {discountType >= 0 && formality >= 0 ? (
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
                                <div className={`form-group ${!minimumThresholdError ? "" : "has-error"}`}>
                                    <label>
                                        {discountType == 0 ? "Đơn hàng có giá trị từ:" : "Số lượng hàng từ: "}
                                        <span className="attention"> </span>
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={minimumThresholdToBeApplied}
                                        placeholder={discountType == 0 ? "vnđ" : "đơn vị"}
                                        onChange={this.handleMinimumThresholdToBeAppliedChange}
                                    />
                                    <ErrorLabel content={minimumThresholdError} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <div className={`form-group ${!maximumThresholdError ? "" : "has-error"}`}>
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
                                    <ErrorLabel content={maximumThresholdError} />
                                </div>
                            </div>
                            {formality == 0 ? (
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!discountedCashError ? "" : "has-error"}`}>
                                        <label>
                                            {"Giảm giá tiền mặt"}
                                            <span className="attention">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={discountedCash}
                                            onChange={this.handleDiscountCashChange}
                                        />
                                        <ErrorLabel content={discountedCashError} />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {formality == 1 ? (
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!discountedPercentageError ? "" : "has-error"}`}>
                                        <label>
                                            {"Phần trăm giảm giá"}
                                            <span className="attention">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={discountedPercentage}
                                            onChange={this.hanlleDiscountedPercentageChange}
                                        />
                                        <ErrorLabel content={discountedPercentageError} />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {formality == 1 ? (
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!maximumDiscountedCashError ? "" : "has-error"}`}>
                                        <label>
                                            {"Tiền giảm giá tối đa"}
                                            <span className="attention"> </span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={maximumDiscountedCash}
                                            placeholder="vd: 50000"
                                            onChange={this.handleMaximumDiscountedCashChange}
                                        />
                                        <ErrorLabel content={maximumDiscountedCashError} />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {formality == 2 ? (
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!loyaltyCoinError ? "" : "has-error"}`}>
                                        <label>
                                            {"Tặng xu"}
                                            <span className="attention">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={loyaltyCoin}
                                            placeholder="vd: 10000"
                                            onChange={this.handleLoyaltyCoinChange}
                                        />
                                        <ErrorLabel content={loyaltyCoinError} />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {formality == 3 ? (
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!maximumFreeShippingCostError ? "" : "has-error"}`}>
                                        <label>
                                            {"Miễn phí vận chuyển tối đa"}
                                            <span className="attention"> </span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={maximumFreeShippingCost}
                                            placeholder="vd: 50000"
                                            onChange={this.handleMaximumFreeShippingCostChange}
                                        />
                                        <ErrorLabel content={maximumFreeShippingCostError} />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {discountType == 1 && formality == 5 ? (
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
                                        <label>
                                            Các mặt hàng được áp dụng:
                                            <a style={{ cursor: "pointer" }} title="Thêm các mặt hàng áp dụng">
                                                <i
                                                    className="fa fa-plus-square"
                                                    style={{ color: "#28A745", marginLeft: 5 }}
                                                    onClick={this.handleAddDiscountOnGoods}
                                                />
                                            </a>
                                        </label>
                                        {discountOnGoods && discountOnGoods.length ? (
                                            <CollapsibleShowDiscountOnGoods discountOnGoods={discountOnGoods} />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {discountType == 1 && formality != 5 ? (
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!goodError ? "" : "has-error"}`}>
                                        <label className="control-label">
                                            Các mặt hàng được áp dụng: <span className="attention"> * </span>
                                        </label>
                                        <SelectBox
                                            id={`select-discount-on-goods2`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={goods}
                                            items={this.getAllGoods()}
                                            onChange={this.handleGoodChange}
                                            multiple={true}
                                        />
                                        <ErrorLabel content={goodError} />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {formality == 4 ? (
                                <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                    <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
                                        <label>
                                            Sản phẩm tặng kèm:
                                            <a style={{ cursor: "pointer" }} title="Thêm các sản phẩm tặng kèm">
                                                <i
                                                    className="fa fa-plus-square"
                                                    style={{ color: "#28A745", marginLeft: 5 }}
                                                    onClick={this.handleAddBonusGood}
                                                />
                                            </a>
                                        </label>
                                        {bonusGoods && bonusGoods.length ? <CollapsibleShowBonusGoods bonusGoods={bonusGoods} /> : ""}
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={"pull-right"} style={{ padding: 10 }}>
                                    {editDiscountDetail ? (
                                        <React.Fragment>
                                            <button
                                                className="btn btn-success"
                                                onClick={this.handleCancelEditDiscountDetail}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                Hủy chỉnh sửa
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                disabled={!this.isValidateDiscountDeatail()}
                                                onClick={this.handleSaveEditDiscountDetail}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                Lưu
                                            </button>
                                        </React.Fragment>
                                    ) : (
                                        <button
                                            className="btn btn-success"
                                            style={{ marginLeft: "10px" }}
                                            disabled={!this.isValidateDiscountDeatail()}
                                            onClick={this.handleSubmitDiscountDetail}
                                        >
                                            Thêm
                                        </button>
                                    )}
                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearDiscountDetail}>
                                        Xóa trắng
                                    </button>
                                </div>
                            </div>
                            <table id={`order-table-discount-create-detail`} className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Loại khách hàng</th>
                                        <th>{discountType == "0" ? "Giá trị tối thiểu" : "Số lượng tối thiểu"}</th>
                                        <th>{discountType == "0" ? "Giá trị tối đa" : "Số lượng tối đa"}</th>
                                        {discountType == "1" ? <th>Các mặt hàng áp dụng</th> : ""}
                                        {formality != "5" ? <th>{this.getTitleDiscountTable()}</th> : ""}
                                        {formality == "1" ? <th>Mức tiền giảm tối đa</th> : ""}
                                        <th>Hành động</th>
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
                                                    {discountType == "1" && item.discountOnGoods ? (
                                                        <td className="discount-create-goods-block-td">
                                                            <a>{"Có " + item.discountOnGoods.length + " mặt hàng"}</a>
                                                        </td>
                                                    ) : null}
                                                    {formality != "5" ? <td>{this.getContentDiscountTable(item)}</td> : ""}
                                                    {formality == "1" ? <td>{item.maximumDiscountedCash}</td> : ""}
                                                    <td>
                                                        <a
                                                            href="#abc"
                                                            className="edit"
                                                            title="Sửa"
                                                            onClick={() => this.handleEditDiscountDetail(item, index)}
                                                        >
                                                            <i className="material-icons">edit</i>
                                                        </a>
                                                        <a
                                                            href="#abc"
                                                            className="delete"
                                                            title="Xóa"
                                                            onClick={() => this.handleDeleteDiscountDeatail(index)}
                                                        >
                                                            <i className="material-icons">delete</i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </fieldset>
                    </div>
                ) : (
                    ""
                )}
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DiscountCreateDetail));
