import React, { Component } from "react";
import "./discount.css";

class CollapsibleShowDiscountOnGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        };
    }

    changeVisibility = (e) => {
        e.preventDefault();
        let { visible } = this.state;
        this.setState({
            visible: !visible,
        });
    };

    render() {
        let { discountOnGoods } = this.props;
        const { visible } = this.state;
        return (
            <React.Fragment>
                {discountOnGoods && discountOnGoods.length > 3 ? (
                    <a onClick={this.changeVisibility} style={{ textDecoration: "underline", cursor: "pointer" }}>
                        {visible ? "Ẩn danh sách" : "Xem chi tiết"}
                    </a>
                ) : (
                    ""
                )}
                <div style={{ display: `${visible ? "block" : "none"}` }}>
                    <ul className="discount-on-goods-collapsible-ul">
                        {discountOnGoods &&
                            discountOnGoods.length &&
                            discountOnGoods.map((item) => {
                                return (
                                    <>
                                        <li className="discount-on-goods-collapsible-li">
                                            <div className="discount-on-goods-collapsible-code">{item.code}</div>
                                            <div className="discount-on-goods-collapsible-name">{item.name}</div>
                                            <div className="discount-on-goods-collapsible-price">{item.discountedPrice}</div>
                                            <div className="discount-on-goods-collapsible-date">{item.expirationDate}</div>
                                        </li>
                                    </>
                                );
                            })}
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}

export default CollapsibleShowDiscountOnGoods;
