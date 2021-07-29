import React, { Component, useEffect, useState } from "react";
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

function DiscountCreateDetail(props) {

    const [state, setState] = useState({
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
    })


    if (props.discountType !== state.discountType || props.formality !== state.formality) {
        setState((state) => {
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
                discountType: props.discountType,
                formality: props.formality,
            };
        })
    }

    useEffect(() => {

        setState({
            ...state,
            bonusGoods: [],
            discountOnGoods: [],
            goods: [],
            editDiscountDetail: false,
        });
    }, [props.discountCode])

    const getAllGoods = () => {
        const { translate, goods } = props;
        const { selectAll } = state;
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

    const handleAddBonusGood = () => {
        const { actionType } = props;
        window.$(`#modal-${actionType}-discount-bonus-goods`).modal("show");
    };

    const handleAddDiscountOnGoods = () => {
        const { actionType } = props;
        window.$(`#modal-${actionType}-discount-on-goods`).modal("show");
    };

    const handleSubmitBonusGoods = (dataSubmit) => {
        console.log("Data bonus", dataSubmit);
        setState({
            ...state,
            bonusGoods: dataSubmit,
        });
    };

    const handleSubmitDiscountOnGoods = (dataSubmit) => {
        setState({
            ...state,
            discountOnGoods: dataSubmit,
        });
    };

    const handleGoodChange = async (goods) => {
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
            goods = await getAllGoods().map((item) => {
                return item.value;
            });

            goods.splice(0, 1); //lấy phần tử all ra khỏi mảng
        } else if (checkSelectedAll.length && checkSelectedAll[0] === "unselected" && goods) {
            goods = [];
        }

        if (goods && goods.length === getAllGoods().length - 1) {
            //Tất cả các mặt hàng đã được chọn
            setState({
                ...state,
                selectAll: false,
            });
        } else if (!state.selectAll) {
            setState({
                ...state,
                selectAll: true,
            });
        }

        await setState((state) => {
            return {
                ...state,
                goods: goods,
            };
        });
        validateGoods(goods, true);
    };

    const validateGoods = (goods, willUpdateState = true) => {
        let msg = undefined;
        if (goods && goods.length === 0) {
            const { translate } = props;
            msg = "Mặt hàng không được để trống";
        }
        if (willUpdateState) {
            setState((state) => {
                return {
                    ...state,
                    goodError: msg,
                };
            });
        }
        return msg;
    };

    const validateCustomerType = (value, willUpdateState = true) => {
        let msg = undefined;

        if (!value.length) {
            msg = "Giá trị không được để trống";
        }

        if (willUpdateState) {
            setState({
                ...state,
                customerType: value[0],
                customerTypeError: msg,
            });
        }
        return msg;
    };

    const handleChangeCustomerType = (value) => {
        validateCustomerType(value, true);
    };

    const validateMinimumThreshold = (minimum, willUpdateState = true) => {
        const { maximumThresholdToBeApplied } = state;
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
            setState({
                ...state,
                minimumThresholdToBeApplied: minimum,
                minimumThresholdError: msg,
            });
        }
        return msg;
    };

    const validateMaximumThreshold = (maximum, willUpdateState = true) => {
        const { minimumThresholdToBeApplied } = state;
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
            setState({
                ...state,
                maximumThresholdToBeApplied: maximum,
                maximumThresholdError: msg,
            });
        }
        return msg;
    };

    const handleMinimumThresholdToBeAppliedChange = (e) => {
        validateMinimumThreshold(e.target.value, true);
    };

    const handleMaximumThresholdToBeAppliedChange = (e) => {
        validateMaximumThreshold(e.target.value, true);
    };

    const validateDiscountCash = (value, willUpdateState = true) => {
        let msg = undefined;

        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }

        if (willUpdateState) {
            setState({
                ...state,
                discountedCash: value,
                discountedCashError: msg,
            });
        }

        return msg;
    };

    const handleDiscountCashChange = (e) => {
        validateDiscountCash(e.target.value, true);
    };

    const validateDiscountedPercentage = (value, willUpdateState = true) => {
        let msg = undefined;

        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }

        if (willUpdateState) {
            setState({
                ...state,
                discountedPercentage: value,
                discountedPercentageError: msg,
            });
        }

        return msg;
    };

    const hanlleDiscountedPercentageChange = (e) => {
        validateDiscountedPercentage(e.target.value, true);
    };

    const validateMaximumDiscountedCash = (value, willUpdateState = true) => {
        let msg = undefined;

        if (parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }

        if (willUpdateState) {
            setState({
                ...state,
                maximumDiscountedCash: value,
                maximumDiscountedCashError: msg,
            });
        }

        return msg;
    };

    const handleMaximumDiscountedCashChange = (e) => {
        validateMaximumDiscountedCash(e.target.value, true);
    };

    const validateLoyaltyCoin = (value, willUpdateState = true) => {
        let msg = undefined;

        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (parseInt(value) < 0) {
            msg = "Giá trị không được âm";
        }

        if (willUpdateState) {
            setState({
                ...state,
                loyaltyCoin: value,
                loyaltyCoinError: msg,
            });
        }

        return msg;
    };

    const handleLoyaltyCoinChange = (e) => {
        validateLoyaltyCoin(e.target.value, true);
    };

    const validateMaximumFreeShippingCost = (value, willUpdateState = true) => {
        let msg = undefined;

        if (parseInt(value) <= 0) {
            msg = "Giá trị không được âm";
        }

        if (willUpdateState) {
            setState({
                ...state,
                maximumFreeShippingCost: value,
                maximumFreeShippingCostError: msg,
            });
        }

        return msg;
    };

    const handleMaximumFreeShippingCostChange = (e) => {
        validateMaximumFreeShippingCost(e.target.value, true);
    };

    const getFieldDiscountForSubmit = () => {
        let { discountType, formality } = state;
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
        } = state;

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

    const handleSubmitDiscountDetail = async (e) => {
        e.preventDefault();
        let { discounts } = props;

        let discount = getFieldDiscountForSubmit();

        discounts.push(discount);
        await props.onChangeDiscounts(discounts);
        await setState((state) => {
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

    const handleClearDiscountDetail = async (e) => {
        e.preventDefault();
        await setState((state) => {
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

    const handleEditDiscountDetail = (discountDetail, index) => {
        let { formality } = props;
        let goods = [];
        if (formality !== 5 && discountDetail.discountOnGoods && discountDetail.discountOnGoods.length) {
            goods = discountDetail.discountOnGoods.map((item) => item.good._id);
        }

        setState({
            ...state,
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

    const handleCancelEditDiscountDetail = (e) => {
        e.preventDefault();
        setState((state) => {
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

    const handleSaveEditDiscountDetail = () => {
        let { discounts } = props;
        let { indexEditting } = state;
        let discount = getFieldDiscountForSubmit();
        discounts[indexEditting] = discount;
        props.onChangeDiscounts(discounts);
        setState((state) => {
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

    const handleDeleteDiscountDeatail = (index) => {
        let { discounts } = props;
        discounts.splice(index, 1);
        props.onChangeDiscounts(discounts);
    };

    const isValidateDiscountDeatail = () => {
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
        } = state;
        const { formality, discountType } = props;
        const { translate } = props;
        if (formality == "0") {
            if (!ValidationHelper.validateEmpty(translate, discountedCash).status || validateDiscountCash(discountedCash, false)) {
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
            if (validateGoods(bonusGoods, false)) {
                return false;
            }
        } else if (formality == "5") {
            if (validateGoods(discountOnGoods, false)) {
                return false;
            }
        }

        if (discountType == "1" && formality != "5") {
            if (validateGoods(goods, false)) {
                return false;
            }
        }

        if (validateMinimumThreshold(minimumThresholdToBeApplied, false) || validateMaximumThreshold(maximumThresholdToBeApplied, false)) {
            return false;
        }

        if (!ValidationHelper.validateEmpty(translate, customerType).status) {
            return false;
        }
        return true;
    };

    const getTitleDiscountTable = () => {
        const { formality } = props;
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

    const getContentDiscountTable = (discount) => {
        const { formality } = props;
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

    const { discountType, formality, discounts } = props;
    const { translate } = props;
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
    } = state;

    return (
        <React.Fragment>
            <CreateBonusGoods
                handleSubmitBonusGoods={(data) => handleSubmitBonusGoods(data)}
                discountType={props.discountType}
                formality={props.formality}
                actionType={props.actionType}
                bonusGoods={bonusGoods}
                editDiscountDetail={editDiscountDetail}
                discountCode={props.discountCode}
                indexEdittingDiscount={state.indexEditting}
            />
            <CreateDiscountOnGoods
                handleSubmitDiscountOnGoods={(data) => handleSubmitDiscountOnGoods(data)}
                discountType={props.discountType}
                formality={props.formality}
                actionType={props.actionType}
                discountOnGoods={discountOnGoods}
                editDiscountDetail={editDiscountDetail}
                discountCode={props.discountCode}
                indexEdittingDiscount={state.indexEditting}
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
                                    onChange={handleChangeCustomerType}
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
                                    onChange={handleMinimumThresholdToBeAppliedChange}
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
                                    onChange={handleMaximumThresholdToBeAppliedChange}
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
                                        onChange={handleDiscountCashChange}
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
                                        onChange={hanlleDiscountedPercentageChange}
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
                                        onChange={handleMaximumDiscountedCashChange}
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
                                        onChange={handleLoyaltyCoinChange}
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
                                        onChange={handleMaximumFreeShippingCostChange}
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
                                                onClick={handleAddDiscountOnGoods}
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
                                        items={getAllGoods()}
                                        onChange={handleGoodChange}
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
                                                onClick={handleAddBonusGood}
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
                                            onClick={handleCancelEditDiscountDetail}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Hủy chỉnh sửa
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            disabled={!isValidateDiscountDeatail()}
                                            onClick={handleSaveEditDiscountDetail}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Lưu
                                        </button>
                                    </React.Fragment>
                                ) : (
                                    <button
                                        className="btn btn-success"
                                        style={{ marginLeft: "10px" }}
                                        disabled={!isValidateDiscountDeatail()}
                                        onClick={handleSubmitDiscountDetail}
                                    >
                                        Thêm
                                    </button>
                                )}
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearDiscountDetail}>
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
                                    {formality != "5" ? <th>{getTitleDiscountTable()}</th> : ""}
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
                                                {formality != "5" ? <td>{getContentDiscountTable(item)}</td> : ""}
                                                {formality == "1" ? <td>{item.maximumDiscountedCash}</td> : ""}
                                                <td>
                                                    <a
                                                        href="#abc"
                                                        className="edit"
                                                        title="Sửa"
                                                        onClick={() => handleEditDiscountDetail(item, index)}
                                                    >
                                                        <i className="material-icons">edit</i>
                                                    </a>
                                                    <a
                                                        href="#abc"
                                                        className="delete"
                                                        title="Xóa"
                                                        onClick={() => handleDeleteDiscountDeatail(index)}
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

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DiscountCreateDetail));
