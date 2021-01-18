import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { DialogModal, DatePicker } from "../../../../../common-components";
import { formatDate } from "../../../../../helpers/formatDate";
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import DiscountsOfQuoteDetail from "./detailQuote/discountOfQuoteDetail";
import DiscountOfGoodDetail from "./detailQuote/discountOfGoodDetail";
import SlasOfGoodDetail from "./detailQuote/slasOfGoodDetail";
import "./quote.css";

class QuoteDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getAmountAfterApplyTax = () => {
        let { goods } = this.props.quoteDetail;
        let amountAfterApplyTax = 0;
        if (goods) {
            amountAfterApplyTax = goods.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.amountAfterTax;
            }, 0);
        }

        return amountAfterApplyTax;
    };

    getFreeShipCost = () => {
        let maxFreeShip = 0;
        let { discounts, shippingFee } = this.props.quoteDetail;
        if (discounts) {
            discounts.forEach((item) => {
                if (item.formality == 3) {
                    maxFreeShip += item.maximumFreeShippingCost;
                }
            });
        }

        let freeShipCost = 0;
        if (shippingFee >= maxFreeShip) {
            //Phí giao hàng lớn hơn tiền miễn phí giao hàng tối đa
            freeShipCost = maxFreeShip;
        } else {
            freeShipCost = shippingFee;
        }
        return freeShipCost;
    };

    getCoinOfAll = () => {
        let coinOfAll = 0;
        let { goods, discounts } = this.props.quoteDetail;

        if (goods) {
            goods.forEach((good) => {
                good.discounts.forEach((discount) => {
                    if (discount.formality == "2") {
                        coinOfAll += discount.loyaltyCoin;
                    }
                });
            });
        }

        if (discounts) {
            discounts.forEach((discount) => {
                if (discount.formality == "2") {
                    coinOfAll += discount.loyaltyCoin;
                }
            });
        }

        return coinOfAll;
    };

    getBonusGoodOfAll = () => {
        //Lấy tất cả các mặt hàng được tặng theo sản phẩm và toàn đơn
        let bonusGoods = [];
        let { goods, discounts } = this.props.quoteDetail;
        if (goods) {
            goods.forEach((good) => {
                good.discounts.forEach((discount) => {
                    if (discount.formality == "4") {
                        //Hình thức tặng hàng
                        discount.bonusGoods.forEach((goodOfBonus) => {
                            let indexOfGood = bonusGoods.findIndex((element) => element.good._id === goodOfBonus.good._id); //Kiểm tra xem mặt hàng này đã tồn tại trong bonusGood hay chưa, nếu có rồi thì chỉ cộng thêm số lượng, còn nếu chưa thì thêm vào
                            if (indexOfGood >= 0 && bonusGoods[indexOfGood].good.expirationDate === goodOfBonus.good.expirationDate) {
                                bonusGoods[indexOfGood].quantityOfBonusGood =
                                    bonusGoods[indexOfGood].quantityOfBonusGood + goodOfBonus.quantityOfBonusGood;
                            } else {
                                bonusGoods.push(Object.assign({}, goodOfBonus));
                            }
                        });
                    }
                });
            });
        }

        if (discounts) {
            discounts.forEach((discount) => {
                if (discount.formality == "4") {
                    //Hình thức tặng hàng
                    discount.bonusGoods.forEach((goodOfBonus) => {
                        let indexOfGood = bonusGoods.findIndex((element) => element.good._id === goodOfBonus.good._id); //Kiểm tra xem mặt hàng này đã tồn tại trong bonusGood hay chưa, nếu có rồi thì chỉ cộng thêm số lượng, còn nếu chưa thì thêm vào
                        if (indexOfGood >= 0 && bonusGoods[indexOfGood].good.expirationDate === goodOfBonus.good.expirationDate) {
                            bonusGoods[indexOfGood].quantityOfBonusGood =
                                bonusGoods[indexOfGood].quantityOfBonusGood + goodOfBonus.quantityOfBonusGood;
                        } else {
                            bonusGoods.push(Object.assign({}, goodOfBonus));
                        }
                    });
                }
            });
        }

        return bonusGoods;
    };

    getDiscountsValueQuote = (amount) => {
        let amountAfterApplyTax = amount;
        let { discounts } = this.props.quoteDetail;

        let discountForFormality = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
        };

        if (discounts) {
            discounts.forEach((element) => {
                discountForFormality[element.formality].push(element);
            });
        }

        if (discountForFormality[0].length) {
            amount = amount - discountForFormality[0][0].discountedCash;
        }
        if (discountForFormality[1].length) {
            amount = (amount * (100 - discountForFormality[1][0].discountedPercentage)) / 100;
        }

        amount = Math.round(amount * 100) / 100;
        return amountAfterApplyTax - amount;
    };

    setCurrentDiscountOfQuote = async (discountsOfQuoteDetail) => {
        await this.setState((state) => {
            return {
                ...state,
                discountsOfQuoteDetail,
            };
        });
        window.$("#modal-detail-quote-discounts").modal("show");
    };

    setCurrentDiscountOfGood = async (discountOfGoodDetail) => {
        await this.setState((state) => {
            return {
                ...state,
                discountOfGoodDetail,
            };
        });
        window.$("#modal-quote-detail-discounts-of-good").modal("show");
    };

    setCurrentSlasOfGood = async (slasOfGoodDetail) => {
        await this.setState((state) => {
            return {
                ...state,
                slasOfGoodDetail,
            };
        });
        window.$("#modal-quote-detail-slas-of-good").modal("show");
    };

    render() {
        const { quoteDetail } = this.props;
        const {
            customerPhone,
            customer,
            customerAddress,
            customerRepresent,
            customerTaxNumber,
            customerEmail,
            effectiveDate,
            expirationDate,
            code,
            shippingFee,
            deliveryTime,
            note,
            coin,
            paymentAmount,
            goods,
            discounts,
            salesOrder,
        } = quoteDetail._id ? quoteDetail : {};

        const { discountsOfQuoteDetail, discountOfGoodDetail, slasOfGoodDetail } = this.state;

        let allOfBonusGood = [];
        let freeShipCost = 0;
        let coinOfAll = 0;
        if (quoteDetail._id) {
            allOfBonusGood = this.getBonusGoodOfAll();
            freeShipCost = this.getFreeShipCost();
            coinOfAll = this.getCoinOfAll();
        }

        let customerCoin = 0;
        if (this.props.customers.customerPoint) {
            customerCoin = this.props.customers.customerPoint.point;
        }

        let amountAfterApplyTax = 0;
        let discountsOfQuote = 0; // Chưa tính miễn phí vận chuyển và sử dụng xu

        if (quoteDetail._id) {
            amountAfterApplyTax = this.getAmountAfterApplyTax();
            discountsOfQuote = this.getDiscountsValueQuote(amountAfterApplyTax); // Chưa tính miễn phí vận chuyển và sử dụng xu
        }

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-detail-quote"
                    isLoading={false}
                    formID="form-detail-quote"
                    title={"Chi tiết báo giá"}
                    size="100"
                    hasSaveButton={false}
                    hasNote={false}
                >
                    {discountsOfQuoteDetail && <DiscountsOfQuoteDetail discountsOfQuoteDetail={discountsOfQuoteDetail} />}
                    {discountOfGoodDetail && <DiscountOfGoodDetail discountOfGoodDetail={discountOfGoodDetail} />}
                    {slasOfGoodDetail && <SlasOfGoodDetail slasOfGoodDetail={slasOfGoodDetail} />}

                    {quoteDetail && quoteDetail._id && (
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border" style={{ background: "#f5f5f5" }}>
                                {/* <legend className="scheduler-border">Chốt đơn báo giá</legend> */}
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 quote-address" style={{ marginTop: "35px" }}>
                                    <div className="shopping-border-delivery"></div>
                                    <div className="shopping-address-title">
                                        <i className="fa fa-map-marker"></i>
                                        <span> Địa chỉ nhận hàng</span>
                                    </div>
                                    <div className="shopping-address-info">
                                        <div style={{ fontWeight: 600 }}>{`${customer ? customer.name : ""} (${customerPhone})`} &ensp;</div>
                                        <div>{customerAddress}</div>
                                    </div>
                                    {customerTaxNumber ? (
                                        <div className="shopping-customer-info-item">
                                            <small>Mã số thuế: &ensp;</small>
                                            <small className="shopping-customer-info-item-text">{customerTaxNumber}</small>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {customerRepresent ? (
                                        <div className="shopping-customer-info-item">
                                            <small>Người liên hệ: &ensp;</small>
                                            <small className="shopping-customer-info-item-text">{customerRepresent}</small>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {customerEmail ? (
                                        <div className="shopping-customer-info-item">
                                            <small>Email: &ensp;</small>
                                            <small className="shopping-customer-info-item-text">{customerEmail}</small>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {note ? (
                                        <div className="shopping-customer-info-item">
                                            <small>Ghi chú: </small>
                                            <small className="shopping-customer-info-item-text">{note}</small>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 shopping-quote-info">
                                    <div className="shopping-quote-info-title">
                                        <span>Thông tin chung</span>
                                    </div>
                                    <div className="shopping-quote-info-element">
                                        <div style={{ fontWeight: 600 }}>Mã báo giá &ensp;</div>
                                        <div style={{ color: "#888", fontSize: "13px" }}>{code}</div>
                                    </div>
                                    <div className="shopping-quote-info-element">
                                        <div style={{ fontWeight: 600 }}>Thời gian hiệu lực &ensp;</div>
                                        <div style={{ color: "#888", fontSize: "13px" }}>{effectiveDate ? formatDate(effectiveDate) : ""}</div>
                                        {effectiveDate && expirationDate ? <span>&ensp;-&ensp;</span> : ""}
                                        <div style={{ color: "#888", fontSize: "13px" }}>{expirationDate ? formatDate(expirationDate) : ""}</div>
                                    </div>
                                    {salesOrder && (
                                        <React.Fragment>
                                            <div className="shopping-quote-info-element">
                                                <div style={{ fontWeight: 600 }}>Đơn bán hàng được chốt &ensp;</div>
                                                <div style={{ color: "#671303", fontSize: "14px" }}>{salesOrder.code}</div>
                                            </div>
                                            <div className="shopping-quote-info-element">
                                                <div style={{ fontWeight: 600 }}>Chốt đơn bán hàng lúc &ensp;</div>
                                                <div style={{ color: "#888", fontSize: "13px" }}>{formatDate(salesOrder.createdAt)}</div>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 shopping-products">
                                    <div className="shopping-products-title">Các sản phẩm</div>
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
                                            </tr>
                                        </thead>
                                        <tbody id={`quote-show-goods`}>
                                            {goods &&
                                                goods.length !== 0 &&
                                                goods.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.good ? item.good.code : ""}</td>
                                                        <td>{item.good ? item.good.name : ""}</td>
                                                        <td>{item.good ? item.good.baseUnit : ""}</td>
                                                        <td>{item.pricePerBaseUnitOrigin ? formatCurrency(item.pricePerBaseUnitOrigin) : " 0"}</td>
                                                        <td>{item.pricePerBaseUnit ? formatCurrency(item.pricePerBaseUnit) : " 0"}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>
                                                            <a
                                                                onClick={() => this.setCurrentDiscountOfGood(item.discounts)}
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                title="Click để xem chi tiết"
                                                            >
                                                                {item.amount && item.amountAfterDiscount
                                                                    ? formatCurrency(item.amount - item.amountAfterDiscount)
                                                                    : " 0"}
                                                            </a>
                                                        </td>
                                                        <td>{item.amountAfterDiscount ? formatCurrency(item.amountAfterDiscount) : ""}</td>
                                                        <td>
                                                            {item.amountAfterDiscount && item.amountAfterTax
                                                                ? formatCurrency(item.amountAfterTax - item.amountAfterDiscount)
                                                                : " 0"}
                                                            ({item.taxs.length ? item.taxs[0].percent : "0"}%)
                                                        </td>
                                                        <td>{item.amountAfterTax ? formatCurrency(item.amountAfterTax) : "0 "}</td>
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
                                                                    onClick={() => this.setCurrentSlasOfGood(item.serviceLevelAgreements)}
                                                                >
                                                                    Chi tiết &ensp;
                                                                    <i className="fa fa-arrow-circle-right"></i>
                                                                </a>
                                                            </div>
                                                        </td>
                                                        <td>{item.note}</td>
                                                    </tr>
                                                ))}
                                            {goods && goods.length !== 0 && (
                                                <tr>
                                                    <td colSpan={7} style={{ fontWeight: 600 }}>
                                                        <center>Tổng</center>
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>
                                                        {formatCurrency(
                                                            goods.reduce((accumulator, currentValue) => {
                                                                return accumulator + (currentValue.amount - currentValue.amountAfterDiscount);
                                                            }, 0)
                                                        )}
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>
                                                        {formatCurrency(
                                                            goods.reduce((accumulator, currentValue) => {
                                                                return accumulator + currentValue.amountAfterDiscount;
                                                            }, 0)
                                                        )}
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>
                                                        {formatCurrency(
                                                            goods.reduce((accumulator, currentValue) => {
                                                                return accumulator + (currentValue.amountAfterTax - currentValue.amountAfterDiscount);
                                                            }, 0)
                                                        )}
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>
                                                        {formatCurrency(
                                                            goods.reduce((accumulator, currentValue) => {
                                                                return accumulator + currentValue.amountAfterTax;
                                                            }, 0)
                                                        )}
                                                    </td>
                                                    <td colSpan={2}></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 shopping-shipping">
                                    <div className="shopping-shipping-title">
                                        <i className="fa fa-truck"></i>
                                        <span> Giao hàng &ensp;</span>
                                    </div>
                                    <div className="shoppe-shipping-content">
                                        <div className="shopping-shipping-fee">
                                            <div> Phí giao hàng: &ensp;</div>
                                            <div style={{ fontWeight: 500 }}>{shippingFee ? formatCurrency(shippingFee) : "0"}</div>
                                        </div>
                                        <div className="shopping-shipping-time">
                                            <div className="shopping-shipping-time-title">Thời gian giao hàng dự kiến: &ensp;</div>
                                            <div style={{ fontWeight: 500 }}>
                                                {deliveryTime ? formatDate(deliveryTime) : "Chưa có thời gian giao hàng dự kiến"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {discounts && discounts.length !== 0 && (
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 shopping-discount">
                                        <div className="shopping-discount-title">
                                            <i className="fa  fa-shirtsinbulk"></i> Khuyến mãi toàn đơn
                                        </div>
                                        <div className="shopping-apply-discounts">
                                            <span>Khuyến mãi của đơn hàng &ensp;</span>
                                            <div className="shopping-apply-discounts-tag">
                                                <div>{`Đã sử dụng ${discounts.length} mã giảm giá`}</div>
                                            </div>
                                            <a
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => this.setCurrentDiscountOfQuote(discounts)}
                                            >
                                                Xem chi tiết
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {allOfBonusGood.length !== 0 && (
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 shopping-bonus-good">
                                        <div className="shopping-bonus-good-title">Các sản phẩm được tặng kèm</div>
                                        {allOfBonusGood.map((goodOfBonus, index) => (
                                            <div key={index} className="shopping-bonus-good-element">
                                                <div className="shopping-bonus-good-element-info">
                                                    {`${goodOfBonus.good.code} - ${goodOfBonus.good.name}`}{" "}
                                                </div>
                                                <div className="shopping-bonus-good-element-quantity">{`${goodOfBonus.quantityOfBonusGood} ${goodOfBonus.good.baseUnit}`}</div>
                                                {goodOfBonus.expirationDate ? (
                                                    <div className="shopping-bonus-good-element-date">
                                                        Hạn sử dụng:&ensp; {goodOfBonus.expirationDate}
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 shopping-payment">
                                    <div className="shopping-payment-header">
                                        <div className="shopping-payment-title">Tổng thanh toán</div>
                                        {coinOfAll ? (
                                            <div className="shopping-payment-all-coin">
                                                <div>
                                                    <span className="text-yellow">+{formatCurrency(coinOfAll)} xu</span>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="shopping-payment-content">
                                        <div className="shopping-payment-element">
                                            <div className="shopping-payment-element-title">Tổng tiền hàng (sau thuế)</div>
                                            <div className="shopping-payment-element-value">
                                                {amountAfterApplyTax ? formatCurrency(amountAfterApplyTax) : "0"}
                                            </div>
                                        </div>

                                        {discountsOfQuote > 0 ? ( //Tiền khuyến mãi toàn đơn là chưa tính freeship và trừ
                                            <div className="shopping-payment-element">
                                                <div className="shopping-payment-element-title">Khuyến mãi cho toàn đơn</div>
                                                <div className="shopping-payment-element-value">-{formatCurrency(discountsOfQuote)}</div>
                                            </div>
                                        ) : (
                                            ""
                                        )}

                                        <div className="shopping-payment-element">
                                            <div className="shopping-payment-element-title">Phí vận chuyển</div>
                                            <div className="shopping-payment-element-value">{shippingFee ? formatCurrency(shippingFee) : "0"}</div>
                                        </div>

                                        {freeShipCost ? (
                                            <div className="shopping-payment-element">
                                                <div className="shopping-payment-element-title">Miễn phí vận chuyển</div>
                                                <div className="shopping-payment-element-value">-{formatCurrency(freeShipCost)}</div>
                                            </div>
                                        ) : (
                                            ""
                                        )}

                                        {coin ? (
                                            <div className="shopping-payment-element">
                                                <div className="shopping-payment-element-title">Sử dụng xu</div>
                                                <div className="shopping-payment-element-value">-{formatCurrency(coin)}</div>
                                            </div>
                                        ) : (
                                            ""
                                        )}

                                        <div className="shopping-payment-element">
                                            <div className="shopping-payment-element-title"> Tổng tiền thanh toán:</div>
                                            <div className="shopping-payment-element-value" style={{ color: "#ee4d2d", fontSize: "20px" }}>
                                                {paymentAmount ? formatCurrency(paymentAmount) : "0"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    )}
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { customers } = state.crm;
    const { quoteDetail } = state.quotes;
    return { customers, quoteDetail };
}

const mapDispatchToProps = {
    getCustomerPoint: CrmCustomerActions.getCustomerPoint,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteDetailForm));
