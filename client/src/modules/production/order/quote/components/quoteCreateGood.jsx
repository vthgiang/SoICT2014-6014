import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { DiscountActions } from "../../discount/redux/actions";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { DatePicker, DialogModal, SelectBox, ButtonModal, ErrorLabel } from "../../../../../common-components";
import CreateDiscountsForGood from "./createDiscountsForGood";
import GoodSelected from "./goodCreateSteps/goodSelected";
import ApplyDiscount from "./goodCreateSteps/applyDiscount";
import Payment from "./goodCreateSteps/payment";
import "./quote.css";

class QuoteCreateGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // quantity: 0,
            discountsOfGood: [],
            taxs: [],
            slas: [],
            step: 0,
            steps: [
                {
                    label: "Chọn sản phẩm",
                    active: true,
                },
                {
                    label: "Các chính sách",
                    active: false,
                },
                {
                    label: "Thuế",
                    active: false,
                },
            ],
        };
    }

    componentDidMount() {
        this.props.getAllGoodsByType({ type: "product" });
    }

    nextStep = (e) => {
        e.preventDefault();
        let { step, steps } = this.state;
        step++;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        this.setState({
            steps: steps,
            step: step,
        });
    };
    preStep = (e) => {
        e.preventDefault();
        let { step, steps } = this.state;
        step--;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        this.setState((state) => {
            return {
                ...state,
                steps: steps,
                step: step,
            };
        });
    };

    handleDiscountsChange = (data) => {
        this.setState((state) => {
            return {
                ...state,
                discountsOfGood: data,
            };
        });
    };

    handleChangeDate = () => {};

    isGoodsValidated = () => {};

    handleGoodChange = async (value) => {
        let { listGoodsByType } = this.props.goods;
        const goodInfo = listGoodsByType.filter((item) => item._id === value[0]);
        await this.setState((state) => {
            return {
                ...state,
                good: goodInfo[0]._id,
                code: goodInfo[0].code,
                goodName: goodInfo[0].name,
                baseUnit: goodInfo[0].baseUnit,
                pricePerBaseUnit: goodInfo[0].pricePerBaseUnit,
                pricePerBaseUnitOrigin: goodInfo[0].pricePerBaseUnit, //giá gốc
                inventory: goodInfo[0].quantity,
                salesPriceVariance: goodInfo[0].salesPriceVariance ? goodInfo[0].salesPriceVariance : 0,
                pricePerBaseUnitError: undefined,
                taxs: [],
                slas: [],
                discountsOfGood: [],
                quantity: "",
            };
        });

        await this.props.getItemsForGood(value[0]);
    };

    validatePrice = (value, willUpdateState = true) => {
        let msg = undefined;
        let { salesPriceVariance, pricePerBaseUnitOrigin } = this.state;
        if (!value) {
            msg = "Giá trị không được để trống!";
        } else if (parseInt(value) < 0) {
            msg = "Giá không được âm";
        } else if (parseInt(value) < pricePerBaseUnitOrigin - salesPriceVariance) {
            msg = `Giá không được chênh lệch quá ${salesPriceVariance ? formatCurrency(salesPriceVariance) : 0} (vnđ) so với giá gốc: ${
                pricePerBaseUnitOrigin ? formatCurrency(pricePerBaseUnitOrigin) : 0
            } (vnđ)`;
        }

        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    pricePerBaseUnit: value,
                    pricePerBaseUnitError: msg,
                };
            });
        }
        return msg;
    };

    handlePriceChange = (e) => {
        let { value } = e.target;
        this.validatePrice(value, true);
    };

    handleQuantityChange = (e) => {
        let { value } = e.target;
        this.setState((state) => {
            return {
                ...state,
                quantity: value,
            };
        });
    };

    handleServiceLevelAgreementChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                slas: value,
            };
        });
    };

    handleNoteChange = (e) => {
        let { value } = e.target;
        this.setState({
            note: value,
        });
    };

    handleTaxsChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                taxs: value,
            };
        });
    };

    // applyDiscountForGood = (paymentAmount) => {
    //     const { discountsOfGood, pricePerBaseUnit } = this.state;
    //     let discountForFormality = {
    //         0: [],
    //         1: [],
    //         2: [],
    //         3: [],
    //         4: [],
    //         5: [],
    //     };
    //     discountsOfGood.forEach((element) => {
    //         discountForFormality[element.formality].push(element);
    //     });

    //     if (discountForFormality[5].length) {
    //         if (discountForFormality[5][0].discountOnGoods.discountedPrice !== pricePerBaseUnit) {
    //             this.setState({
    //                 pricePerBaseUnit: discountForFormality[5][0].discountOnGoods.discountedPrice,
    //             });
    //         }
    //     }
    //     if (discountForFormality[0].length) {
    //         paymentAmount = paymentAmount - discountForFormality[0][0].discountedCash;
    //     }
    //     if (discountForFormality[1].length) {
    //         paymentAmount = (paymentAmount * (100 - discountForFormality[1][0].discountedPercentage)) / 100;
    //     }
    //     console.log("discountForFormality", discountForFormality);
    //     return paymentAmount;
    // };

    getOriginAmountOfGood = () => {
        const { quantity, pricePerBaseUnit } = this.state;
        let originAmount = 0;
        if (pricePerBaseUnit && quantity) {
            originAmount = pricePerBaseUnit * quantity;
        }

        originAmount = Math.round(originAmount * 100) / 100;

        return originAmount;
    };

    getAmountAfterApplyDiscount = () => {
        let amountAfterApplyDiscount = this.getOriginAmountOfGood();
        const { discountsOfGood, pricePerBaseUnit } = this.state;
        let discountForFormality = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
        };
        discountsOfGood.forEach((element) => {
            discountForFormality[element.formality].push(element);
        });

        if (discountForFormality[5].length) {
            if (discountForFormality[5][0].discountOnGoods.discountedPrice !== pricePerBaseUnit) {
                this.setState({
                    pricePerBaseUnit: discountForFormality[5][0].discountOnGoods.discountedPrice,
                });
            }
        }
        if (discountForFormality[0].length) {
            amountAfterApplyDiscount = amountAfterApplyDiscount - discountForFormality[0][0].discountedCash;
        }
        if (discountForFormality[1].length) {
            amountAfterApplyDiscount = (amountAfterApplyDiscount * (100 - discountForFormality[1][0].discountedPercentage)) / 100;
        }

        amountAfterApplyDiscount = Math.round(amountAfterApplyDiscount * 100) / 100;

        return amountAfterApplyDiscount;
    };

    getAmountAfterApplyTax = () => {
        const { listTaxsByGoodId } = this.props.goods.goodItems;
        let amountAfterApplyTax = this.getAmountAfterApplyDiscount();
        const { taxs } = this.state;
        let listTaxs = taxs.map((item) => {
            let tax = listTaxsByGoodId.find((element) => element._id == item);
            if (tax) {
                return tax;
            }
        });

        if (listTaxs && listTaxs.length) {
            amountAfterApplyTax = ((listTaxs[0].percent + 100) / 100) * amountAfterApplyTax;
        }

        amountAfterApplyTax = Math.round(amountAfterApplyTax * 100) / 100;
        return amountAfterApplyTax;
    };

    // getPaymentAmountOfGood = () => {
    //     const { listTaxsByGoodId } = this.props.goods.goodItems;
    //     const { taxs, discountsOfGood, pricePerBaseUnit, quantity } = this.state;
    //     let listTaxs = taxs.map((item) => {
    //         let tax = listTaxsByGoodId.find((element) => element._id == item);
    //         if (tax) {
    //             return tax;
    //         }
    //     });

    //     let paymentAmount = 0;

    //     if (pricePerBaseUnit && quantity) {
    //         paymentAmount = pricePerBaseUnit * quantity;
    //     }
    //     paymentAmount = this.applyDiscountForGood(paymentAmount);

    //     if (listTaxs && listTaxs.length) {
    //         paymentAmount = ((listTaxs[0].percent + 100) / 100) * paymentAmount;
    //     }

    //     paymentAmount = Math.round(paymentAmount * 100) / 100;

    //     return paymentAmount ? `${formatCurrency(paymentAmount)} (vnđ)` : "";
    // };

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState((state) => {
            return {
                ...state,
                discountsOfGood: [],
                taxs: [],
                slas: [],
                slas: [],
                quantity: "",
                pricePerBaseUnit: "",
                pricePerBaseUnitError: "",
                pricePerBaseUnitOrigin: "",
                note: "",
                inventory: "",
                baseUnit: "",
                good: "",
                goodName: "",
            };
        });
    };

    render() {
        let {
            good,
            goodName,
            code,
            pricePerBaseUnit,
            baseUnit,
            inventory,
            quantity,
            pricePerBaseUnitError,
            discountsOfGood,
            taxs,
            slas,
            note,
            steps,
            step,
        } = this.state;
        console.log("DISCOUNT", this.state.discountsOfGood);
        let originAmount = this.getOriginAmountOfGood();
        let amountAfterApplyDiscount = this.getAmountAfterApplyDiscount();
        let amountAfterApplyTax = this.getAmountAfterApplyTax();
        return (
            // <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <fieldset className="scheduler-border" style={{ padding: 10 }}>
                <legend className="scheduler-border">Các mặt hàng</legend>
                {/* ---------------------STEP--------------------- */}
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ backgroundColor: "#f5f5f5" }}>
                    <div className="timeline">
                        <div className="timeline-progress" style={{ width: `${(step * 100) / (steps.length - 1)}%` }}></div>
                        <div className="timeline-items">
                            {steps.map((item, index) => (
                                <div className={`timeline-item ${item.active ? "active" : ""}`} key={index}>
                                    <div className="timeline-contain">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8" style={{ padding: 10, height: "100%" }}>
                        <div style={{ padding: 10, backgroundColor: "white", height: "100%" }} className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            {step === 0 && (
                                <GoodSelected
                                    good={good}
                                    goodName={goodName}
                                    pricePerBaseUnit={pricePerBaseUnit}
                                    baseUnit={baseUnit}
                                    inventory={inventory}
                                    quantity={quantity}
                                    pricePerBaseUnitError={pricePerBaseUnitError}
                                    handleGoodChange={this.handleGoodChange}
                                    handlePriceChange={this.handlePriceChange}
                                    handleQuantityChange={this.handleQuantityChange}
                                />
                            )}
                            {step === 1 && (
                                <ApplyDiscount
                                    quantity={quantity}
                                    good={good}
                                    goodName={goodName}
                                    code={code}
                                    baseUnit={baseUnit}
                                    inventory={inventory}
                                    pricePerBaseUnit={pricePerBaseUnit}
                                    handleDiscountsChange={(data) => this.handleDiscountsChange(data)}
                                    discountsOfGood={discountsOfGood}
                                    handleServiceLevelAgreementChange={this.handleServiceLevelAgreementChange}
                                    slas={slas}
                                />
                            )}
                            {step === 2 && (
                                <Payment taxs={taxs} note={note} handleTaxsChange={this.handleTaxsChange} handleNoteChange={this.handleNoteChange} />
                            )}
                        </div>
                    </div>

                    {/* ---------------------END-STEP--------------------- */}

                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, minHeight: "250px" }}>
                        <div style={{ padding: 10, backgroundColor: "white" }}>
                            <div className="form-group">
                                <strong>Thành tiền: </strong>
                                <span style={{ float: "right" }}>{originAmount ? formatCurrency(originAmount) + " (vnđ)" : "0 (vnđ)"}</span>
                            </div>
                            <div className="form-group">
                                <strong>Khuyến mãi: </strong>
                                <span style={{ float: "right" }} className="text-red">
                                    {amountAfterApplyDiscount ? formatCurrency(amountAfterApplyDiscount - originAmount) + " (vnđ)" : "0 (vnđ)"}
                                </span>
                            </div>
                            <div className="form-group">
                                <strong>Tổng tiền trước thuế: </strong>
                                <span style={{ float: "right" }}>
                                    {amountAfterApplyDiscount ? formatCurrency(amountAfterApplyDiscount) + " (vnđ)" : "0 (vnđ)"}
                                </span>
                            </div>
                            <div className="form-group">
                                <strong>Thuế: </strong>
                                <span style={{ float: "right" }}>
                                    {amountAfterApplyTax ? formatCurrency(amountAfterApplyTax - amountAfterApplyDiscount) + " (vnđ)" : "0 (vnđ)"}
                                </span>
                            </div>

                            <div className="form-group" style={{ borderTop: "solid 0.3px #c5c5c5", padding: "10px 0px" }}>
                                <strong>Tổng tiền sau thuế: </strong>
                                <span style={{ float: "right" }} className="text-red">
                                    {amountAfterApplyTax ? formatCurrency(amountAfterApplyTax) + " (vnđ)" : "0 (vnđ)"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={"pull-right"} style={{ padding: 10 }}>
                            <div>
                                <div>
                                    {step + 1} / {steps.length}
                                </div>
                                <div>
                                    {step !== 0 ? (
                                        <button className="btn" onClick={this.preStep}>
                                            Trước
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                    {step === steps.length - 1 ? (
                                        ""
                                    ) : (
                                        <button className="btn btn-success" onClick={this.nextStep}>
                                            Sau
                                        </button>
                                    )}
                                    {step === steps.length - 1 ? <button className="btn btn-success">Thêm</button> : ""}
                                </div>
                            </div>
                            {/* <button
                                className="btn btn-success"
                                style={{ marginLeft: "10px" }}
                                disabled={!this.isGoodsValidated()}
                                onClick={this.handleAddGood}
                            >
                                Thêm mới
                            </button>
                            <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
                                Xóa trắng
                            </button> */}
                        </div>
                    </div>
                </div>

                {/* Hiển thị bảng */}
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th title={"STT"}>STT</th>
                            <th title={"Mã sản phẩm"}>Mã sản phẩm</th>
                            <th title={"Tên sản phẩm"}>Tên sản phẩm</th>
                            <th title={"Đơn vị tính"}>Đ/v tính</th>
                            <th title={"Giá gốc"}>Giá niêm yết (vnđ)</th>
                            <th title={"giá tính tiền"}>giá (vnđ)</th>
                            <th title={"Số lượng"}>Số lượng</th>
                            <th title={"Khuyến mãi"}>Khuyến mãi</th>
                            <th title={"Thuế"}>Thuế</th>
                            <th title={"Thành tiền"}>Thành tiền</th>
                            <th title={"Tổng tiền"}>Tổng tiền</th>
                            <th title={"Tiết kiệm được"}>Tiết kiệm được</th>
                            <th>Cam kết chất lượng</th>
                            <th title={"Ghi chú"}>Ghi chú</th>
                            <th title={"Hành động"}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody id={`good-edit-manage-by-stock`}>
                        <tr>
                            <td>1</td>
                            <td>SP_0395</td>
                            <td>Thuốc úm gà</td>
                            <td>Hộp</td>
                            <td>400,000</td>
                            <td>350,000</td>
                            <td>10</td>
                            <td>0 vnđ</td>
                            <td>350,000 vnđ (10%)</td>
                            <td>3,500,000</td>
                            <td>3,850,000 vnđ</td>
                            <td>0.00 vnđ</td>
                            <td>
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    <a
                                        style={{
                                            cursor: "pointer",
                                        }}
                                        data-toggle="modal"
                                        data-backdrop="static"
                                        href={"#modal-create-quote-sla"}
                                    >
                                        Chi tiết
                                        <i className="fa fa-arrow-circle-right"></i>
                                    </a>
                                </div>
                            </td>
                            <td></td>
                            <td>
                                <a className="edit text-yellow">
                                    <i className="material-icons">edit</i>
                                </a>
                                <a className="edit text-red">
                                    <i className="material-icons">delete</i>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={7} style={{ fontWeight: 600 }}>
                                <center>Tổng</center>
                            </td>
                            <td style={{ fontWeight: 600 }}>0 (vnđ)</td>
                            <td style={{ fontWeight: 600 }}>400,000 (vnđ)</td>
                            <td style={{ fontWeight: 600 }}>4,400,000 (vnđ)</td>
                            <td colSpan={3}></td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
            // </div>
        );
    }
}

function mapStateToProps(state) {
    const { goods, discounts } = state;
    return { goods, discounts };
}

const mapDispatchToProps = {
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    getItemsForGood: GoodActions.getItemsForGood,
    getDiscountForOrderValue: DiscountActions.getDiscountForOrderValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteCreateGood));
