import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { DiscountActions } from "../../discount/redux/actions";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import GoodSelected from "./goodCreateSteps/goodSelected";
import ApplyDiscount from "./goodCreateSteps/applyDiscount";
import Payment from "./goodCreateSteps/payment";
import "./quote.css";
class QuoteCreateGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: [],
            discountsOfGood: [],
            discountsOfGoodChecked: {},
            slasOfGood: [],
            slasOfGoodChecked: {},
            taxs: [],
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

    setDiscountsOfGoodChecked = (discountsOfGoodChecked) => {
        this.setState((state) => {
            return {
                ...state,
                discountsOfGoodChecked,
            };
        });
    };

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
                slasOfGood: [],
                slasOfGoodChecked: {},
                discountsOfGood: [],
                discountsOfGoodChecked: {},
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

    handleSlasOfGoodChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                slasOfGood: value,
            };
        });
    };

    setSlasOfGoodChecked = (slasOfGoodChecked) => {
        this.setState((state) => {
            return {
                ...state,
                slasOfGoodChecked,
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

    handleClearGood = (e) => {
        e.preventDefault();
        this.setState((state) => {
            return {
                ...state,
                discountsOfGood: [],
                taxs: [],
                slasOfGood: [],
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

    addGood = (e) => {
        e.preventDefault();
        console.log("STATE", this.state);
        const { listTaxsByGoodId } = this.props.goods.goodItems;
        let {
            taxs,
            slasOfGood,
            pricePerBaseUnit,
            discountsOfGood,
            good,
            goodName,
            baseUnit,
            quantity,
            code,
            pricePerBaseUnitOrigin,
            note,
            steps,
            salesPriceVariance,
        } = this.state;
        let { goods } = this.state;

        let amount = this.getOriginAmountOfGood();
        let amountAfterDiscount = this.getAmountAfterApplyDiscount();
        let amountAfterTax = this.getAmountAfterApplyTax();

        let listTaxs = taxs.map((item) => {
            let tax = listTaxsByGoodId.find((element) => element._id == item);
            if (tax) {
                return tax;
            }
        });

        let listSlas = [];
        let { listSlasByGoodId } = this.props.goods.goodItems;
        for (const key in slasOfGood) {
            let slaInfo = listSlasByGoodId.find((element) => element._id === key);
            listSlas.push({
                _id: key,
                title: slaInfo.title,
                descriptions: slasOfGood[key],
            });
        }

        let additionGood = {
            good: {
                _id: good,
                name: goodName,
                baseUnit: baseUnit,
                code: code,
            },
            pricePerBaseUnit: pricePerBaseUnit,
            pricePerBaseUnitOrigin: pricePerBaseUnitOrigin,
            quantity: quantity,
            taxs: listTaxs,
            slasOfGood: listSlas,
            discountsOfGood: discountsOfGood,
            note: note,
            amount,
            amountAfterDiscount,
            amountAfterTax,
            salesPriceVariance,
        };

        goods.push(additionGood);
        steps = steps.map((step, index) => {
            step.active = !index ? true : false;
            return step;
        });
        this.setState((state) => {
            return {
                ...state,
                goods,
                discountsOfGood: [],
                discountsOfGoodChecked: {},
                taxs: [],
                slasOfGood: [],
                slasOfGoodChecked: {},
                quantity: "",
                pricePerBaseUnit: "",
                pricePerBaseUnitError: undefined,
                pricePerBaseUnitOrigin: "",
                salesPriceVariance: "",
                note: "",
                inventory: "",
                baseUnit: "",
                good: "",
                code: "",
                goodName: "",
                step: 0,
                steps,
            };
        });
    };

    deleteGood = (goodId) => {
        let { goods } = this.state;
        let goodsSlice = goods.filter((item) => item._id !== goodId);

        this.setState((state) => {
            return {
                ...state,
                goods: goodsSlice,
            };
        });
    };

    handleEditGood = (item, index) => {
        let { listDiscountsByGoodId } = this.props.goods.goodItems;
        let { discountsOfGoodChecked, slasOfGoodChecked } = this.state;

        item.discountsOfGood.forEach((element) => {
            let discount = listDiscountsByGoodId.find((dis) => dis._id === element._id);
            if (discount) {
                console.log("discount", discount);
            }
        });

        this.setState({
            editGood: true,
            indexEditting: index,
            taxs: item.taxs.map((tax) => tax._id),
            quantity: item.quantity,
            pricePerBaseUnit: item.pricePerBaseUnit,
            pricePerBaseUnitError: undefined,
            pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
            salesPriceVariance: item.salesPriceVariance,
            note: item.note,
            inventory: item.good.inventory,
            goodName: item.good.name,
            good: item.good._id,
            baseUnit: item.good.baseUnit,
            code: item.good.code,
            discountsOfGood: item.discountsOfGood,
            slasOfGood: item.slasOfGood,
        });
    };

    handleCancelEditGood = (e) => {
        // e.preventDefault();
        // let { goodOptionsState, allGoodsSelected, indexEditting } = this.state;
        // goodOptionsState = this.filterOption(allGoodsSelected[indexEditting]);
        // this.setState({
        //     editGoodsTaxCollection: false,
        //     goodsSelected: Object.assign({}, this.EMPTY_GOOD),
        //     goodOptionsState,
        //     isSelectAll: true,
        //     goodsError: undefined,
        //     percentError: undefined,
        // });
    };

    handleSaveEditGood = () => {
        // let { goodsSelected, indexEditting, goodOptionsState, allGoodsSelected } = this.state;
        // goodOptionsState = this.filterOption(goodsSelected); //Lọc bỏ những options đã được chọn
        // allGoodsSelected[indexEditting] = goodsSelected;
        // this.setState({
        //     ...this.state,
        //     allGoodsSelected,
        //     goodsSelected: Object.assign({}, this.EMPTY_GOOD),
        //     goodOptionsState,
        //     isSelectAll: true,
        //     editGoodsTaxCollection: false,
        // });
    };

    render() {
        let {
            good,
            goods,
            goodName,
            code,
            pricePerBaseUnit,
            baseUnit,
            inventory,
            quantity,
            pricePerBaseUnitError,
            discountsOfGood,
            discountsOfGoodChecked,
            slasOfGood,
            slasOfGoodChecked,
            taxs,
            note,
            steps,
            step,
        } = this.state;
        console.log("DISCOUNT", this.state.discountsOfGood);
        let originAmount = this.getOriginAmountOfGood();
        let amountAfterApplyDiscount = this.getAmountAfterApplyDiscount();
        let amountAfterApplyTax = this.getAmountAfterApplyTax();
        console.log("GOOD", goods);
        console.log("DIS", this.props.goods.goodItems.listDiscountsByGoodId);
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
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
                            <div
                                style={{ padding: 10, backgroundColor: "white", height: "100%" }}
                                className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                            >
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
                                        handleQuantityChange={this.handleQuantityChange}
                                        good={good}
                                        goodName={goodName}
                                        code={code}
                                        baseUnit={baseUnit}
                                        inventory={inventory}
                                        pricePerBaseUnit={pricePerBaseUnit}
                                        handleDiscountsChange={(data) => this.handleDiscountsChange(data)}
                                        setDiscountsChecked={(checked) => this.setDiscountsOfGoodChecked(checked)}
                                        discountsChecked={discountsOfGoodChecked}
                                        discountsOfGood={discountsOfGood}
                                        slasOfGood={slasOfGood}
                                        handleSlasOfGoodChange={(data) => this.handleSlasOfGoodChange(data)}
                                        slasOfGoodChecked={slasOfGoodChecked}
                                        setSlasOfGoodChecked={(checked) => this.setSlasOfGoodChecked(checked)}
                                    />
                                )}
                                {step === 2 && (
                                    <Payment
                                        quantity={quantity}
                                        good={good}
                                        goodName={goodName}
                                        code={code}
                                        baseUnit={baseUnit}
                                        inventory={inventory}
                                        pricePerBaseUnit={pricePerBaseUnit}
                                        taxs={taxs}
                                        note={note}
                                        handleTaxsChange={this.handleTaxsChange}
                                        handleNoteChange={this.handleNoteChange}
                                    />
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
                                        {amountAfterApplyDiscount
                                            ? formatCurrency(Math.round((amountAfterApplyDiscount - originAmount) * 100) / 100) + " (vnđ)"
                                            : "0 (vnđ)"}
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
                                        {amountAfterApplyTax
                                            ? formatCurrency(Math.round((amountAfterApplyTax - amountAfterApplyDiscount) * 100) / 100) + " (vnđ)"
                                            : "0 (vnđ)"}
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
                                        {step === steps.length - 1 ? (
                                            <button className="btn btn-success" onClick={this.addGood}>
                                                Thêm
                                            </button>
                                        ) : (
                                            ""
                                        )}
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
                                <th title={"Giá niêm yết"}>Giá niêm yết (vnđ)</th>
                                <th title={"giá tính tiền"}>giá tính tiền (vnđ)</th>
                                <th title={"Số lượng"}>Số lượng</th>
                                <th title={"Khuyến mãi"}>Khuyến mãi</th>
                                <th title={"Thành tiền"}>Thành tiền</th>
                                <th title={"Thuế"}>Thuế</th>
                                <th title={"Tổng tiền"}>Tổng tiền</th>
                                <th>Cam kết chất lượng</th>
                                <th title={"Ghi chú"}>Ghi chú</th>
                                <th title={"Hành động"}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody id={`good-edit-manage-by-stock`}>
                            {goods &&
                                goods.length !== 0 &&
                                goods.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.good ? item.good.code : ""}</td>
                                        <td>{item.good ? item.good.name : ""}</td>
                                        <td>{item.good ? item.good.baseUnit : ""}</td>
                                        <td>{item.pricePerBaseUnitOrigin ? formatCurrency(item.pricePerBaseUnitOrigin) + " (vnđ)" : " 0 (vnđ)"}</td>
                                        <td>{item.pricePerBaseUnit ? formatCurrency(item.pricePerBaseUnit) + "(vnđ)" : " 0 (vnđ)"}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            {item.amount && item.amountAfterDiscount
                                                ? formatCurrency(item.amount - item.amountAfterDiscount) + " (vnđ)"
                                                : " 0 (vnđ)"}
                                        </td>
                                        <td>{item.amountAfterDiscount ? formatCurrency(item.amountAfterDiscount) : ""}</td>
                                        <td>
                                            {item.amountAfterDiscount && item.amountAfterTax
                                                ? formatCurrency(item.amountAfterTax - item.amountAfterDiscount) + " (vnđ)"
                                                : " 0 (vnđ)"}
                                            ({item.taxs.length ? item.taxs[0].percent : "0"}%)
                                        </td>
                                        <td>{item.amountAfterTax ? formatCurrency(item.amountAfterTax) + " (vnđ)" : "0 (vnđ)"}</td>
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
                                        <td>{item.note}</td>
                                        <td>
                                            <a className="edit text-yellow">
                                                <i className="material-icons" onClick={() => this.handleEditGood(item, index)}>
                                                    edit
                                                </i>
                                            </a>
                                            <a className="edit text-red">
                                                <i className="material-icons" onClick={() => this.deleteGood(item._id)}>
                                                    delete
                                                </i>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            {goods.length !== 0 && (
                                <tr>
                                    <td colSpan={7} style={{ fontWeight: 600 }}>
                                        <center>Tổng</center>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {formatCurrency(
                                            goods.reduce((accumulator, currentValue) => {
                                                return accumulator + (currentValue.amount - currentValue.amountAfterDiscount);
                                            }, 0)
                                        ) + " (vnđ)"}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {formatCurrency(
                                            goods.reduce((accumulator, currentValue) => {
                                                return accumulator + currentValue.amountAfterDiscount;
                                            }, 0)
                                        ) + " (vnđ)"}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {formatCurrency(
                                            goods.reduce((accumulator, currentValue) => {
                                                return accumulator + (currentValue.amountAfterTax - currentValue.amountAfterDiscount);
                                            }, 0)
                                        ) + " (vnđ)"}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {formatCurrency(
                                            goods.reduce((accumulator, currentValue) => {
                                                return accumulator + currentValue.amountAfterTax;
                                            }, 0)
                                        ) + " (vnđ)"}
                                    </td>
                                    <td colSpan={3}></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </fieldset>
            </div>
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
