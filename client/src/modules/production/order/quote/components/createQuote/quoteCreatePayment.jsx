import React, { Component } from "react";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import { DatePicker } from "../../../../../../common-components";
import "../quote.css";

class QuoteCreatePayment extends Component {
    render() {
        let { listGoods } = this.props;
        const {
            customerPhone,
            customerAddress,
            customerName,
            customerRepresent,
            effectiveDate,
            expirationDate,
            code,
            shippingFee,
            deliveryTime,
            note,
        } = this.props;
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <fieldset className="scheduler-border" style={{ background: "#f5f5f5" }}>
                    <legend className="scheduler-border">Chốt đơn báo giá</legend>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 quote-address">
                        <div className="shopping-border-delivery"></div>
                        <div className="shopping-address-title">
                            <i className="fa fa-map-marker"></i>
                            <span> Địa chỉ nhận hàng</span>
                        </div>
                        <div className="shopping-address-info">
                            <div style={{ fontWeight: 600 }}>{`${customerName} (${customerPhone})`} &ensp;</div>
                            <div>{customerAddress}</div>
                        </div>
                        <div>
                            <small className="shopping-address-represent">{customerRepresent}</small>
                        </div>
                        <div style={{ padding: "0px 20px" }}>
                            <small>Ghi chú: &ensp;</small>
                            <small style={{ color: "grey", fontStyle: "italic" }}>{note}</small>
                        </div>
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
                            <div style={{ color: "#888", fontSize: "13px" }}>{effectiveDate}</div>
                            <span>&ensp;-&ensp;</span>
                            <div style={{ color: "#888", fontSize: "13px" }}>{expirationDate}</div>
                        </div>
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
                                {listGoods &&
                                    listGoods.length !== 0 &&
                                    listGoods.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.good ? item.good.code : ""}</td>
                                            <td>{item.good ? item.good.name : ""}</td>
                                            <td>{item.good ? item.good.baseUnit : ""}</td>
                                            <td>
                                                {item.pricePerBaseUnitOrigin ? formatCurrency(item.pricePerBaseUnitOrigin) + " (vnđ)" : " 0 (vnđ)"}
                                            </td>
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
                                        </tr>
                                    ))}
                                {listGoods.length !== 0 && (
                                    <tr>
                                        <td colSpan={7} style={{ fontWeight: 600 }}>
                                            <center>Tổng</center>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {formatCurrency(
                                                listGoods.reduce((accumulator, currentValue) => {
                                                    return accumulator + (currentValue.amount - currentValue.amountAfterDiscount);
                                                }, 0)
                                            ) + " (vnđ)"}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {formatCurrency(
                                                listGoods.reduce((accumulator, currentValue) => {
                                                    return accumulator + currentValue.amountAfterDiscount;
                                                }, 0)
                                            ) + " (vnđ)"}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {formatCurrency(
                                                listGoods.reduce((accumulator, currentValue) => {
                                                    return accumulator + (currentValue.amountAfterTax - currentValue.amountAfterDiscount);
                                                }, 0)
                                            ) + " (vnđ)"}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {formatCurrency(
                                                listGoods.reduce((accumulator, currentValue) => {
                                                    return accumulator + currentValue.amountAfterTax;
                                                }, 0)
                                            ) + " (vnđ)"}
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
                                <div> Phí giao hàng &ensp;</div>
                                <input type="number" value={shippingFee} placeholder="Phí giao hàng... (vnđ)" />
                            </div>
                            <div className="shopping-shipping-time">
                                <div className="shopping-shipping-time-title">Thời gian giao hàng dự kiến &ensp;</div>
                                <DatePicker
                                    id="date_picker_create_quote_delivery-time"
                                    value={deliveryTime}
                                    // onChange={handleChangeDeliveryTime}
                                    disabled={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 shopping-discount">
                        <div className="shopping-discount-title">
                            <i className="fa  fa-shirtsinbulk"></i> Khuyến mãi toàn đơn
                        </div>
                        <div className="shopping-apply-discounts">
                            <span>Khuyến mãi của đơn hàng &ensp;</span>
                            <div className="shopping-apply-discounts-tag">
                                <div>{`Đã chọn ${2} mã giảm giá`}</div>
                            </div>
                            <a>Chọn khuyến mãi</a>
                        </div>
                        <div className="shopping-apply-loyalty-coin">
                            <div>
                                <i className="fa  fa-btc text-danger"></i>
                                <span> Sử dụng xu &ensp;</span>
                            </div>
                            <div className="shopping-apply-loyalty-coin-tag">
                                <div>{`Bạn đang có ${200} xu tương ứng với ${200} tiền`}</div>
                            </div>
                            <div className="shopping-apply-loyalty-coin-checkbox">
                                <span>Sử dụng ngay &ensp;</span>
                                <input
                                    type="checkbox"
                                    className={`form-check-input`}
                                    id={`check-box-use-loyalty-coin`}
                                    // checked={}
                                    // onChange={this.handleDiscountChange}
                                    style={{ minWidth: "20px" }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 shopping-bonus-good">
                        <div className="shopping-bonus-good-title">Các sản phẩm được tặng kèm</div>
                        <div className="shopping-bonus-good-element">
                            <div className="shopping-bonus-good-element-info">HAABCD - Bánh mì </div>
                            <div className="shopping-bonus-good-element-quantity">10 cái</div>
                            <div className="shopping-bonus-good-element-date">Hạn sử dụng:&ensp; 10-11-2021</div>
                        </div>
                        <div className="shopping-bonus-good-element">
                            <div className="shopping-bonus-good-element-info">HAB - Bún chả </div>
                            <div className="shopping-bonus-good-element-quantity">5 tô</div>
                            <div className="shopping-bonus-good-element-date">Hạn sử dụng:&ensp; 10-11-2021</div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 shopping-payment">
                        <div className="shopping-payment-title">Tổng thanh toán</div>
                        <div className="shopping-payment-content">
                            <div className="shopping-payment-element">
                                <div className="shopping-payment-element-title">Tổng tiền hàng (sau thuế)</div>
                                <div className="shopping-payment-element-value">1,000,000</div>
                            </div>
                            <div className="shopping-payment-element">
                                <div className="shopping-payment-element-title">Phí vận chuyển</div>
                                <div className="shopping-payment-element-value">100,000</div>
                            </div>
                            <div className="shopping-payment-element">
                                <div className="shopping-payment-element-title">Miễn phí vận chuyển</div>
                                <div className="shopping-payment-element-value">-100,000</div>
                            </div>
                            <div className="shopping-payment-element">
                                <div className="shopping-payment-element-title">Khuyến mãi cho toàn đơn</div>
                                <div className="shopping-payment-element-value">-45,000</div>
                            </div>
                            <div className="shopping-payment-element">
                                <div className="shopping-payment-element-title"> Tổng tiền thanh toán:</div>
                                <div className="shopping-payment-element-value" style={{ color: "#ee4d2d", fontSize: "20px" }}>
                                    1,055,000
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        );
    }
}

export default QuoteCreatePayment;
