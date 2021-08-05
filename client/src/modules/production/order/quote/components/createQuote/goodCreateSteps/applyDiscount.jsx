import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import CreateDiscountsForGood from "./createDiscountsForGood";
import { ErrorLabel } from "../../../../../../../common-components";
import { formatCurrency } from "../../../../../../../helpers/formatCurrency";
import "../../quote.css";
import CreateSlaForGood from "./createSlaForGood";

function ApplyDiscount(props) {

    const getServiceLevelAgreementOptionsForGood = () => {
        let { listSlasByGoodId } = props.goods.goodItems;
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

    const handleQuantity = (quantity, e) => {
        e.preventDefault();
        let data = { target: { value: quantity } };
        props.handleQuantityChange(data);
    };

    const countSlasChecked = () => {
        const { slasOfGoodChecked } = props;
        let count = 0;
        for (let key in slasOfGoodChecked) {
            if (slasOfGoodChecked[key] === true) {
                count++;
            }
        }
        return count;
    };

    let {
        quantity,
        good,
        discountsOfGood,
        inventory,
        pricePerBaseUnit,
        code,
        goodName,
        baseUnit,
        discountsChecked,
        slasOfGood,
        slasOfGoodChecked,
        handleSlasOfGoodChange,
        setSlasOfGoodChecked,
    } = props;

    let { quantityError } = props;

    const { handleDiscountsChange, setDiscountsChecked } = props;

    let countOfSlasChecked = countSlasChecked();
    return (
        <React.Fragment>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: "10px 10px 20px 10px" }}>
                <div>
                    <h3>{code + " - " + goodName}</h3>
                </div>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span>Giá: &ensp;</span>
                    <h4 className="text-red">{pricePerBaseUnit ? formatCurrency(pricePerBaseUnit) + " (vnđ) " : "0 (vnđ) "}</h4>{" "}
                    <h6>/ {baseUnit}</h6>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div>Số lượng: &ensp;</div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <button className="button-add-quantity-for-quote" onClick={(e) => handleQuantity(parseInt(quantity) - 1, e)}>
                            -
                            </button>
                        <input
                            type="number"
                            value={quantity}
                            className="input-add-quantity-for-quote"
                            onChange={props.handleQuantityChange}
                        />
                        <button className="button-add-quantity-for-quote" onClick={(e) => handleQuantity(parseInt(quantity) + 1, e)}>
                            +
                            </button>
                    </div>
                    <div>&ensp;{inventory} sản phẩm có sẵn trong kho</div>
                </div>
                {quantityError ? (
                    <div className="text-red" style={{ paddingTop: "5px" }}>
                        {quantityError}
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10, height: "100%", borderTop: "solid 0.3px #c5c5c5" }}>
                <div className="form-group apply-discount-for-good-element">
                    <span className="text-red">
                        <i className="fa  fa-shirtsinbulk"></i> Khuyến mãi &ensp;
                        </span>
                    <div className="apply-discounts-for-good-tag">
                        <div>{discountsOfGood.length ? `Đã chọn ${discountsOfGood.length} mã giảm giá` : "Hãy kiểm tra và chọn khuyến mãi"}</div>
                    </div>
                    <CreateDiscountsForGood
                        quantity={quantity}
                        goodId={good}
                        handleDiscountsChange={(data) => handleDiscountsChange(data)}
                        discountsProps={discountsOfGood}
                        setDiscountsChecked={(checked) => setDiscountsChecked(checked)}
                        discountsChecked={discountsChecked}
                    />
                </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10, height: "100%", borderTop: "solid 0.3px #c5c5c5" }}>
                <div className="form-group apply-discount-for-good-element">
                    <span>
                        <i className="fa  fa-registered text-info"></i> Cam kết chất lượng &ensp;
                        </span>
                    <div className="apply-discounts-for-good-tag">
                        <div>
                            {countOfSlasChecked ? `Đã chọn ${countOfSlasChecked} cam kết chất lượng` : "Hãy kiểm tra và chọn cam kết chất lượng"}
                        </div>
                    </div>
                    <CreateSlaForGood
                        goodId={good}
                        slasOfGood={slasOfGood}
                        handleSlasOfGoodChange={(data) => handleSlasOfGoodChange(data)}
                        slasOfGoodChecked={slasOfGoodChecked}
                        setSlasOfGoodChecked={(checked) => setSlasOfGoodChecked(checked)}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

export default connect(mapStateToProps, null)(withTranslate(ApplyDiscount));
