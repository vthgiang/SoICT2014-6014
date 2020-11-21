import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { DiscountActions } from "../../discount/redux/actions";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { DatePicker, DialogModal, SelectBox, ButtonModal, ErrorLabel } from "../../../../../common-components";
import CreateDiscountsForGood from "./createDiscountsForGood";
import { findDOMNode } from "react-dom";

class QuoteCreateGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // quantity: 0,
            discountsOfGood: [],
            taxs: [],
        };
    }

    componentDidMount() {
        this.props.getAllGoodsByType({ type: "product" });
    }

    handleDiscountsChange = (data) => {
        this.setState((state) => {
            return {
                ...state,
                discountsOfGood: data,
            };
        });
    };

    getGoodOptions = () => {
        let options = [];
        let { listGoodsByType } = this.props.goods;
        if (listGoodsByType) {
            options = listGoodsByType.map((item) => {
                return {
                    value: item._id,
                    text: item.code + " - " + item.name,
                };
            });
        }
        return options;
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
                goodName: goodInfo[0].name,
                baseUnit: goodInfo[0].baseUnit,
                pricePerBaseUnit: goodInfo[0].pricePerBaseUnit,
                pricePerBaseUnitOrigin: goodInfo[0].pricePerBaseUnit, //giá gốc
                inventory: goodInfo[0].quantity,
                salesPriceVariance: goodInfo[0].salesPriceVariance ? goodInfo[0].salesPriceVariance : 0,
                pricePerBaseUnitError: undefined,
                taxs: [],
            };
        });

        await this.props.getItemsForGood(value[0]);

        // await this.props.getSlaByGoodsId(value[0]);
        // await this.props.getTaxsByGoodsId(value[0]);
        // await this.props.getDiscountByGoodsId(value[0]);
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

    getServiceLevelAgreementOptionsForGood = () => {
        let { listSlasByGoodId } = this.props.goods.goodItems;
        let options = [];
        if (listSlasByGoodId && listSlasByGoodId.length) {
            options = listSlasByGoodId.map((item) => {
                return {
                    value: item._id,
                    text: item.title,
                };
            });
        }
        return options;
    };

    getTaxOptionsForGood = () => {
        let { listTaxsByGoodId } = this.props.goods.goodItems;
        let options = [];
        if (listTaxsByGoodId && listTaxsByGoodId.length) {
            options = listTaxsByGoodId.map((item) => {
                return {
                    value: item._id,
                    text: item.name + " -- " + item.percent + " (%)",
                };
            });
        }
        return options;
    };

    handleTaxsChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                taxs: value,
            };
        });
    };

    getPaymentAmountOfGood = () => {
        const { listTaxsByGoodId } = this.props.goods.goodItems;
        const { taxs, discountsOfGood, pricePerBaseUnit, quantity } = this.state;
        let listTaxs = taxs.map((item) => {
            return listTaxsByGoodId.find((element) => element._id == item);
        });

        let paymentAmount = 0;

        if (pricePerBaseUnit && quantity) {
            paymentAmount = pricePerBaseUnit * quantity;
        }
        if (taxs.length) {
            paymentAmount = ((listTaxs[0].percent + 100) / 100) * paymentAmount;
        }

        paymentAmount = Math.round(paymentAmount * 100) / 100;

        return paymentAmount ? `${formatCurrency(paymentAmount)} (vnđ)` : "";
    };

    render() {
        let { good, goodName, pricePerBaseUnit, baseUnit, inventory, quantity, pricePerBaseUnitError, discountsOfGood, taxs } = this.state;
        console.log("DISCOUNT", this.state.discountsOfGood);
        console.log("REDUX", this.props.goods.goodItems);
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <fieldset className="scheduler-border" style={{ padding: 10 }}>
                    <legend className="scheduler-border">Các mặt hàng</legend>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, height: "100%" }}>
                        <div className="form-group">
                            <label>
                                Sản phẩm
                                <span className="attention"> * </span>
                            </label>
                            <SelectBox
                                id={`select-good-code-quote`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={good}
                                items={this.getGoodOptions()}
                                onChange={this.handleGoodChange}
                                multiple={false}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Tên sản phẩm
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={goodName} />
                        </div>

                        <div className="form-group">
                            <label>
                                Đơn vị tính
                                <span className="attention"> * </span>
                            </label>
                            {/* <SelectBox
                                id={`select-quote-unit-good`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={baseUnit}
                                items={[
                                    {
                                        value: "Gói",
                                        text: "Gói",
                                    },
                                    {
                                        value: "Hộp",
                                        text: "Hộp",
                                    },
                                    {
                                        value: "Thùng",
                                        text: "Thùng",
                                    },
                                ]}
                                // onChange={this.handleGoodCodeChange}
                                multiple={false}
                            /> */}
                            <input type="text" className="form-control" value={baseUnit} disabled="true" />
                        </div>
                        <div className={`form-group ${!pricePerBaseUnitError ? "" : "has-error"}`}>
                            <label>
                                Giá
                                <span className="attention"> * </span>
                            </label>
                            <input type="number" className="form-control" value={pricePerBaseUnit} onChange={this.handlePriceChange} />
                            <ErrorLabel content={pricePerBaseUnitError} />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, height: "100%" }}>
                        <div className="form-group">
                            <label>
                                Số lượng còn trong kho
                                <span className="attention"> * </span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={inventory > 0 ? inventory + " " + baseUnit : "Hết hàng"}
                                disabled={true}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Số lượng
                                <span className="attention"> * </span>
                            </label>
                            <input type="number" className="form-control" value={quantity} onChange={this.handleQuantityChange} />
                        </div>

                        <div className="form-group">
                            <label>
                                Thành tiền
                                <span className="attention"> * </span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={pricePerBaseUnit && quantity ? formatCurrency(pricePerBaseUnit * quantity) + " (vnđ)" : ""}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Khuyến mãi <span className="attention"> * </span>
                            </label>
                            <CreateDiscountsForGood
                                quantity={quantity}
                                goodId={good}
                                handleDiscountsChange={(data) => this.handleDiscountsChange(data)}
                                discountsProps={discountsOfGood}
                            />
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, height: "100%" }}>
                        <div className="form-group">
                            <label>
                                Thuế <span className="attention"> * </span>
                            </label>
                            <SelectBox
                                id={`select-good-name-quote`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={taxs}
                                items={this.getTaxOptionsForGood()}
                                onChange={this.handleTaxsChange}
                                multiple={true}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Tổng tiền
                                <span className="attention"> * </span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={`6,500,000 vnđ`}
                                disabled={true}
                                value={this.getPaymentAmountOfGood()}
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Cam kết chất lượng
                                <span className="attention"> * </span>
                            </label>
                            <SelectBox
                                id={`select-create-quote-sla`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={goodName}
                                items={this.getServiceLevelAgreementOptionsForGood()}
                                // onChange={this.handleGoodCodeChange}
                                multiple={true}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Ghi chú
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={``} />
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={"pull-right"} style={{ padding: 10 }}>
                            <button
                                className="btn btn-success"
                                style={{ marginLeft: "10px" }}
                                disabled={!this.isGoodsValidated()}
                                onClick={this.handleAddGood}
                            >
                                Thêm mới
                            </button>
                            <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
                                Xóa trắng
                            </button>
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
                                <th title={"Giá"}>Giá (vnđ)</th>
                                <th title={"Số lượng"}>Số lượng</th>
                                <th title={"Thành tiền"}>Thành tiền</th>
                                <th title={"Khuyến mãi"}>Khuyến mãi</th>
                                <th title={"Thuế"}>Thuế</th>
                                <th title={"Tổng tiền"}>Tổng tiền</th>
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
                                <td>350,000</td>
                                <td>10</td>
                                <td>3,500,000</td>
                                <td>0 vnđ</td>
                                <td>350,000 vnđ (10%)</td>
                                <td>3,850,000 vnđ</td>
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
