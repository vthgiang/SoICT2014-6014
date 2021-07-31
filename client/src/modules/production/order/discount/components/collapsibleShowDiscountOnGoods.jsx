import React, { Component, useState } from "react";
import "./discount.css";

function CollapsibleShowDiscountOnGoods(props) {

    const [state, setState] = useState({
        visible: true,
    })

    const changeVisibility = (e) => {
        e.preventDefault();
        let { visible } = state;
        setState({
            ...state,
            visible: !visible,
        });
    };


    let { discountOnGoods } = props;
    // console.log("discountOnGoods", discountOnGoods);
    const { visible } = state;
    return (
        <React.Fragment>
            {discountOnGoods && discountOnGoods.length > 3 ? (
                <a onClick={changeVisibility} style={{ textDecoration: "underline", cursor: "pointer" }}>
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
                                        <div className="discount-on-goods-collapsible-code">{item.good.code}</div>
                                        <div className="discount-on-goods-collapsible-name">{item.good.name}</div>
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

export default CollapsibleShowDiscountOnGoods;
