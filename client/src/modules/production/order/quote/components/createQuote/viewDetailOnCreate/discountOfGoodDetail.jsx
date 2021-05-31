import React, { Component } from "react";
import { DialogModal } from "../../../../../../../common-components";
import { formatCurrency } from "../../../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../../../helpers/formatDate";
import { capitalize } from "../../../../../../../helpers/stringMethod";

function DiscountOfGoodDetail(props) {

    const getThresholdToBeAppliedTitle = (discount) => {
        let title = `mua từ ${discount.minimumThresholdToBeApplied >= 0 ? discount.minimumThresholdToBeApplied : ""}`;
        if (discount.maximumThresholdToBeApplied) {
            title = title + " đến " + discount.maximumThresholdToBeApplied;
        }
        if (discount.minimumThresholdToBeApplied >= 0) {
            title = title + " sản phẩm";
        }
        return title;
    };

    const getBonusGoodTitle = (bonusGoods) => {
        let dataMap = bonusGoods.map((item) => {
            return item.quantityOfBonusGood + " " + item.good.baseUnit + " " + item.good.name;
        });
        return dataMap.join(", ");
    };

    const getDiscountOnGoodTitle = (discountOnGoods) => {
        let title = `${discountOnGoods.discountedPrice ? formatCurrency(discountOnGoods.discountedPrice) : ""} (vnđ)/ ${discountOnGoods.good.baseUnit
            } ${discountOnGoods.expirationDate ? "đối với sản phẩm có hạn sử dụng trước ngày " + formatDate(discountOnGoods.expirationDate) : ""}`;

        return title;
    };

    const getNameDiscountForGood = (formality, discount) => {
        // let title = getThresholdToBeAppliedTitle(discount);
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
            case 5:
                title = title + `Giảm giá sản phẩm chỉ còn ${discount.discountOnGoods ? getDiscountOnGoodTitle(discount.discountOnGoods) : ""}`;
                break;
            default:
                break;
        }
        return capitalize(title);
    };


    const { currentDiscounts } = props;
    return (
        <DialogModal
            modalID="modal-create-quote-discounts-of-good-detail"
            isLoading={false}
            formID="form-create-quote-sla"
            title={"Chi tiết giảm giá"}
            size="50"
            hasSaveButton={false}
            hasNote={false}
        >
            {!currentDiscounts.length ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <i className="fa fa-frown-o text-warning" style={{ fontSize: "20px" }}></i> &ensp; <span>Chưa có khuyến mãi nào</span>
                </div>
            ) : (
                currentDiscounts.map((item) => {
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

export default DiscountOfGoodDetail;
