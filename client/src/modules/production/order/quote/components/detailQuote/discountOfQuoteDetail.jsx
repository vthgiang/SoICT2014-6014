import React, { Component } from "react";
import { DialogModal } from "../../../../../../common-components";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../../helpers/formatDate";
import { capitalize } from "../../../../../../helpers/stringMethod";
import "../quote.css";

function DiscountsOfQuoteDetail(props) {

    const getBonusGoodTitle = (bonusGoods) => {
        let dataMap = bonusGoods.map((item) => {
            return item.quantityOfBonusGood + " " + item.good.baseUnit + " " + item.good.name;
        });
        return dataMap.join(", ");
    };

    const getNameDiscountForGood = (formality, discount) => {
        let title = "";

        switch (parseInt(formality)) {
            case 0:
                title = title + `Khuyến mãi ${discount.discountedCash ? formatCurrency(discount.discountedCash) : ""} (vnđ)`;
                break;
            case 1:
                title = title + `Giảm giá ${discount.discountedPercentage} (%)`;
                break;
            case 2:
                title = title + `Tặng ${discount.loyaltyCoin ? formatCurrency(discount.loyaltyCoin) : ""} (xu)`;
                break;
            case 3:
                title =
                    title +
                    `Miễn phí vận chuyển ${discount.maximumFreeShippingCost ? ", tối đa" + formatCurrency(discount.maximumFreeShippingCost) : ""
                    } (vnđ)`;
                break;
            case 4:
                title = title + `Tặng ${discount.bonusGoods ? getBonusGoodTitle(discount.bonusGoods) : ""}`;
                break;
            default:
                break;
        }
        return capitalize(title);
    };

    const { discountsOfQuoteDetail } = props;
    console.log("discountsOfQuoteDetail", discountsOfQuoteDetail);
    return (
        <DialogModal
            modalID="modal-detail-quote-discounts"
            isLoading={false}
            formID="form-detail-quote-discounts"
            title={"Chi tiết giảm giá áp dụng với giá trị đơn hàng"}
            size="50"
            hasSaveButton={false}
            hasNote={false}
        >
            {!discountsOfQuoteDetail.length ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <i className="fa fa-frown-o text-warning" style={{ fontSize: "20px" }}></i> &ensp; <span>Chưa có khuyến mãi nào</span>
                </div>
            ) : (
                discountsOfQuoteDetail.map((item) => {
                    return (
                        <div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <i className="fa fa-gift text-warning"></i> &ensp; <strong>{item.name}</strong>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "5px 0px 5px 20px",
                                }}
                            >
                                <i className="fa fa-genderless text-success"></i>&ensp;
                                    {getNameDiscountForGood(item.formality, item)}
                            </div>
                        </div>
                    );
                })
            )}
        </DialogModal>
    );
}

export default DiscountsOfQuoteDetail;
