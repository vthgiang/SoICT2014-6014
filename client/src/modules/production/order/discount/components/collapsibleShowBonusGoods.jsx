import React, { Component } from "react";
import "./discount.css";

class CollapsibleShowBonusGoods extends Component {
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
        let { bonusGoods } = this.props;
        const { visible } = this.state;
        return (
            <React.Fragment>
                {bonusGoods && bonusGoods.length > 3 ? (
                    <a onClick={this.changeVisibility} style={{ textDecoration: "underline", cursor: "pointer" }}>
                        {visible ? "Ẩn danh sách" : "Xem chi tiết"}
                    </a>
                ) : (
                    ""
                )}
                <div style={{ display: `${visible ? "block" : "none"}` }}>
                    <ul className="discount-bonus-goods-collapsible-ul">
                        {bonusGoods &&
                            bonusGoods.length &&
                            bonusGoods.map((item) => {
                                return (
                                    <>
                                        <li className="discount-bonus-goods-collapsible-li">
                                            <div className="discount-bonus-goods-collapsible-code">{item.code}</div>
                                            <div className="discount-bonus-goods-collapsible-name">{item.name}</div>
                                            <div className="discount-bonus-goods-collapsible-baseunit">{item.baseUnit}</div>
                                            <div className="discount-bonus-goods-collapsible-quantity">{item.quantityOfBonusGood}</div>
                                            <div className="discount-bonus-goods-collapsible-date">{item.expirationDateOfGoodBonus}</div>
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

export default CollapsibleShowBonusGoods;
