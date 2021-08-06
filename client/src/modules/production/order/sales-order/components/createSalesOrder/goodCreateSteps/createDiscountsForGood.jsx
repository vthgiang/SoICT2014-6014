import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../../../common-components";
import { formatCurrency } from "../../../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../../../helpers/formatDate";
import { capitalize } from "../../../../../../../helpers/stringMethod";

function CreateDiscountsForGood(props) {

    const [state, setState] = useState({
        goodId: "",
    })

    if (props.goodId !== state.goodId) {
        setState((state) => {
            return {
                ...state,
                goodId: props.goodId,
            };
        })
    }

    const getDiscountValue = (idCheckBox) => {
        let { listDiscountsByGoodId } = props.goods.goodItems;
        let { goodId } = props;

        let hash = idCheckBox.split("-");
        let discountId = hash[0];
        let indexOfDiscounts = hash[1];

        let discount = listDiscountsByGoodId.find((element) => element._id === discountId);
        let thresholdToBeApplied = discount.discounts[indexOfDiscounts];
        let discountChange = {
            _id: discount._id,
            code: discount.code,
            formality: discount.formality,
            type: discount.type,
            effectiveDate: discount.effectiveDate,
            expirationDate: discount.expirationDate,
            name: discount.name,
        };
        switch (parseInt(discount.formality)) {
            case 0:
                discountChange.discountedCash = thresholdToBeApplied.discountedCash;
                break;
            case 1:
                discountChange.discountedPercentage = thresholdToBeApplied.discountedPercentage;
                break;
            case 2:
                discountChange.loyaltyCoin = thresholdToBeApplied.loyaltyCoin;
                break;
            case 3:
                discountChange.maximumFreeShippingCost = thresholdToBeApplied.maximumFreeShippingCost;
                break;
            case 4:
                discountChange.bonusGoods = thresholdToBeApplied.bonusGoods;
                break;
            case 5:
                discountChange.discountOnGoods = thresholdToBeApplied.discountOnGoods.find((element) => goodId === element.good._id);
                break;
            default:
                break;
        }
        return discountChange;
    };

    const handleDiscountChange = (e) => {
        let { discountsChecked } = props;
        const { handleDiscountsChange } = props;
        let { discountsProps } = props;
        let { id, checked } = e.target;

        if (checked === true) {
            let discountValue = getDiscountValue(id);
            discountsProps.push(discountValue);
            handleDiscountsChange(discountsProps);
        } else {
            let filterDiscountsProps = discountsProps.filter((element) => element._id !== id.split("-")[0]); //lọc phần tử có id ra khỏi state
            for (let key in discountsChecked) {
                //Lọc những discount cùng mức do bất đồng bộ chưa lọc được khi nhận discount props
                if (discountsChecked[`${key}`] === false) {
                    filterDiscountsProps = filterDiscountsProps.filter((element) => element._id !== key.split("-")[0]);
                }
            }
            handleDiscountsChange(filterDiscountsProps);
        }

        discountsChecked[`${id}`] = checked;
        props.setDiscountsChecked(discountsChecked);
    };

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
        const { goodId } = props;
        let discount = discountOnGoods.find((element) => goodId === element.good._id);

        let title = `${discount.discountedPrice ? formatCurrency(discount.discountedPrice) : ""} (vnđ)/ ${discount.good.baseUnit} ${discount.expirationDate ? "đối với sản phẩm có hạn sử dụng trước ngày " + formatDate(discount.expirationDate) : ""
            }`;

        return title;
    };

    const getNameDiscountForGood = (formality, discount) => {
        let title = getThresholdToBeAppliedTitle(discount);

        switch (parseInt(formality)) {
            case 0:
                title = title + ` được khuyến mãi ${discount.discountedCash ? formatCurrency(discount.discountedCash) : ""} (vnđ)`;
                break;
            case 1:
                title = title + ` được giảm giá ${discount.discountedPercentage} (%)`;
                break;
            case 2:
                title = title + ` được tặng ${discount.loyaltyCoin ? formatCurrency(discount.loyaltyCoin) : ""} (xu)`;
                break;
            case 3:
                title =
                    title +
                    ` được miễn phí vận chuyển ${discount.maximumFreeShippingCost ? ", tối đa" + formatCurrency(discount.maximumFreeShippingCost) : ""
                    } (vnđ)`;
                break;
            case 4:
                title = title + ` được tặng ${discount.bonusGoods ? getBonusGoodTitle(discount.bonusGoods) : ""}`;
                break;
            case 5:
                title = title + `, giá sản phẩm chỉ còn ${discount.discountOnGoods ? getDiscountOnGoodTitle(discount.discountOnGoods) : ""}`;
                break;
            default:
                break;
        }
        return capitalize(title);
    };

    const getDiscountOptions = (item) => {
        let { quantity, goodId } = props;
        let { discountsChecked } = props;
        const { discounts, formality } = item;
        return (
            <div style={{ paddingLeft: "2rem" }}>
                {discounts.map((discount, index) => {
                    let checkGoodInDiscount = discount.discountOnGoods.find((element) => goodId === element.good._id); //Kiểm tra mặt hàng này có được trong danh mục khuyến mãi
                    if (checkGoodInDiscount) {
                        let disabled = false;
                        if (discount.minimumThresholdToBeApplied) {
                            if (parseInt(quantity) < discount.minimumThresholdToBeApplied) {
                                disabled = true;
                            }
                        }
                        if (discount.maximumThresholdToBeApplied) {
                            if (parseInt(quantity) > discount.maximumThresholdToBeApplied) {
                                disabled = true;
                            }
                        }

                        if (quantity === undefined || quantity === "" || quantity === null) {
                            disabled = true;
                        }

                        if (disabled && discountsChecked[`${item._id}-${index}`]) {
                            let e = {
                                target: {
                                    id: `${item._id}-${index}`,
                                    checked: false,
                                },
                            };
                            handleDiscountChange(e); // unchecked các phần tử bị disable
                        }

                        return (
                            <div className="form-check" style={{ display: "flex", paddingTop: "10px" }}>
                                <input
                                    type="checkbox"
                                    className={`form-check-input`}
                                    id={`${item._id}-${index}`}
                                    disabled={disabled}
                                    checked={discountsChecked[`${item._id}-${index}`]}
                                    onChange={handleDiscountChange}
                                    style={{ minWidth: "20px" }}
                                    key={index}
                                />
                                <label
                                    className={`form-check-label ${disabled ? "text-muted" : "text-success"}`}
                                    for={`${item._id}-${index}`}
                                    style={{ fontWeight: `${disabled ? 500 : 600}` }}
                                >
                                    {getNameDiscountForGood(formality, discount)}
                                </label>
                            </div>
                        );
                    }
                })}
            </div>
        );
    };

    let { listDiscountsByGoodId } = props.goods.goodItems;
    return (
        <React.Fragment>
            <a
                style={{
                    cursor: "pointer",
                }}
                data-toggle="modal"
                data-backdrop="static"
                href={"#modal-add-sales-order-discount-for-good"}
            >
                Chọn khuyến mãi
            </a>
            <DialogModal
                modalID={`modal-add-sales-order-discount-for-good`}
                isLoading={false}
                title={"Chọn khuyến mãi"}
                hasSaveButton={false}
                hasNote={false}
                size="50"
                style={{ backgroundColor: "green" }}
            >
                {!listDiscountsByGoodId.length ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <i className="fa fa-frown-o text-warning" style={{ fontSize: "20px" }}></i> &ensp;{" "}
                        <span>Không có khuyến mãi nào cho sản phẩm này</span>
                    </div>
                ) : (
                    listDiscountsByGoodId.map((item) => {
                        return (
                            <div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <i className="fa fa-gift text-warning"></i> &ensp; <strong>{item.name}</strong>
                                </div>
                                {getDiscountOptions(item)}
                            </div>
                        );
                    })
                )}
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateDiscountsForGood));
