import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { ButtonModal, DialogModal, formatDate } from "../../../../../common-components";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { capitalize } from "../../../../../helpers/stringMethod";

class CreateDiscountsForGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discountsChecked: {},
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.goodId !== prevState.goodId) {
            nextProps.handleDiscountsChange([]); // xóa sạch discounts ở component cha
            return {
                discountsChecked: {},
                goodId: nextProps.goodId,
            };
        }
    }

    getDiscountValue = (idCheckBox) => {
        let { listDiscountsByGoodId } = this.props.discounts;
        let { goodId } = this.props;

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

    handleDiscountChange = (e) => {
        let { discountsChecked } = this.state;
        const { handleDiscountsChange } = this.props;
        let { discountsProps } = this.props;
        let { id, checked } = e.target;

        if (checked === true) {
            let discountValue = this.getDiscountValue(id);
            discountsProps.push(discountValue);
            handleDiscountsChange(discountsProps);
        } else {
            let filterDiscountsProps = discountsProps.filter((element) => element._id !== id.split("-")[0]); //lọc phần tử có id ra khỏi state
            handleDiscountsChange(filterDiscountsProps);
        }

        discountsChecked[`${id}`] = checked;
        this.setState((state) => {
            return {
                ...state,
                discountsChecked,
            };
        });
    };

    getThresholdToBeAppliedTitle = (discount) => {
        let title = `mua từ ${discount.minimumThresholdToBeApplied >= 0 ? discount.minimumThresholdToBeApplied : ""}`;
        if (discount.maximumThresholdToBeApplied) {
            title = title + " đến " + discount.maximumThresholdToBeApplied;
        }
        if (discount.minimumThresholdToBeApplied >= 0) {
            title = title + " sản phẩm";
        }
        return title;
    };

    getBonusGoodTitle = (bonusGoods) => {
        let dataMap = bonusGoods.map((item) => {
            return item.quantityOfBonusGood + " " + item.good.baseUnit + " " + item.good.name;
        });
        return dataMap.join(", ");
    };

    getDiscountOnGoodTitle = (discountOnGoods) => {
        const { goodId } = this.props;
        let discount = discountOnGoods.find((element) => goodId === element.good._id);

        let title = `${discount.discountedPrice ? formatCurrency(discount.discountedPrice) : ""} (vnđ)/ ${discount.good.baseUnit} ${
            discount.expirationDate ? "đối với sản phẩm có hạn sử dụng trước ngày " + formatDate(discount.expirationDate) : ""
        }`;

        return title;
    };

    getNameDiscountForGood = (formality, discount) => {
        let title = this.getThresholdToBeAppliedTitle(discount);

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
                    ` được miễn phí vận chuyển ${
                        discount.maximumFreeShippingCost ? ", tối đa" + formatCurrency(discount.maximumFreeShippingCost) : ""
                    } (vnđ)`;
                break;
            case 4:
                title = title + ` được tặng ${discount.bonusGoods ? this.getBonusGoodTitle(discount.bonusGoods) : ""}`;
                break;
            case 5:
                title = title + `, giá sản phẩm chỉ còn ${discount.discountOnGoods ? this.getDiscountOnGoodTitle(discount.discountOnGoods) : ""}`;
                break;
            default:
                break;
        }
        return capitalize(title);
    };

    getDiscountOptions = (item) => {
        let { quantity, goodId } = this.props;
        let { discountsChecked } = this.state;
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

                        if (!quantity) {
                            disabled = true;
                        }

                        if (disabled && discountsChecked[`${item._id}-${index}`]) {
                            let e = {
                                target: {
                                    id: `${item._id}-${index}`,
                                    checked: false,
                                },
                            };
                            this.handleDiscountChange(e); // unchecked các phần tử bị disable
                        }

                        return (
                            <div class="form-check" style={{ display: "flex" }}>
                                <input
                                    type="checkbox"
                                    className={`form-check-input`}
                                    id={`${item._id}-${index}`}
                                    disabled={disabled}
                                    checked={discountsChecked[`${item._id}-${index}`]}
                                    onChange={this.handleDiscountChange}
                                    style={{ minWidth: "20px" }}
                                />
                                <label
                                    className={`form-check-label ${disabled ? "text-muted" : "text-success"}`}
                                    for={`${item._id}-${index}`}
                                    style={{ fontWeight: `${disabled ? 500 : 600}` }}
                                >
                                    {this.getNameDiscountForGood(formality, discount)}
                                </label>
                            </div>
                        );
                    }
                })}
            </div>
        );
    };

    render() {
        let { listDiscountsByGoodId } = this.props.discounts;
        return (
            <React.Fragment>
                <ButtonModal
                    modalID={`modal-add-quote-discount-for-good`}
                    button_name={"Chọn khuyến mãi"}
                    title={"Chọn khuyến mãi"}
                    className="form-control text-muted"
                />
                <DialogModal
                    modalID={`modal-add-quote-discount-for-good`}
                    isLoading={false}
                    title={"Chọn khuyến mãi"}
                    hasSaveButton={false}
                    hasNote={false}
                    size="50"
                    style={{ backgroundColor: "green" }}
                >
                    {!listDiscountsByGoodId.length ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <i className="fa fa-frown-o text-warning"></i> &ensp; <span>Chưa có khuyến mãi nào</span>
                        </div>
                    ) : (
                        listDiscountsByGoodId.map((item) => {
                            return (
                                <div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <i className="fa fa-gift text-warning"></i> &ensp; <strong>{item.name}</strong>
                                    </div>
                                    {this.getDiscountOptions(item)}
                                </div>
                            );
                        })
                    )}
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { discounts } = state;
    return { discounts };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateDiscountsForGood));
