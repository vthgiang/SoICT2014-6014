import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SelectBox } from "../../../../../../common-components";
import CreateDiscountsForGood from "../createDiscountsForGood";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";

class ApplyDiscount extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getServiceLevelAgreementOptionsForGood = () => {
        let { listSlasByGoodId } = this.props.goods.goodItems;
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

    render() {
        let { quantity, good, discountsOfGood, slas, inventory, pricePerBaseUnit, code, goodName, baseUnit } = this.props;
        const { handleDiscountsChange, handleServiceLevelAgreementChange } = this.props;
        return (
            <React.Fragment>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10 }}>
                    <div>
                        <h3>{code + " - " + goodName}</h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                        <span>Giá: &ensp;</span>
                        <h4 className="text-red">{pricePerBaseUnit ? formatCurrency(pricePerBaseUnit) + " (vnđ) " : "0 (vnđ) "}</h4>{" "}
                        <h6>/ {baseUnit}</h6>
                    </div>
                    <div style={{ display: "flex" }}>
                        <div>Số lượng &ensp;</div>
                        <div>
                            <input type="number" value={quantity} />
                        </div>
                        <div>&ensp;{inventory} sản phẩm có sẵn</div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10, height: "100%", borderTop: "solid 0.3px #c5c5c5" }}>
                    <div className="form-group">
                        <span className="text-red">
                            <i className="fa  fa-shirtsinbulk"></i> Khuyến mãi &ensp;
                        </span>
                        <CreateDiscountsForGood
                            quantity={quantity}
                            goodId={good}
                            handleDiscountsChange={(data) => handleDiscountsChange(data)}
                            discountsProps={discountsOfGood}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10, height: "100%", borderTop: "solid 0.3px #c5c5c5" }}>
                    <div className="form-group">
                        <span>
                            <i className="fa  fa-registered text-info"></i> Cam kết chất lượng &ensp;
                        </span>
                        <a>Chọn cam kết chất lượng</a>
                        {/* <SelectBox
                            id={`select-create-quote-sla-${good}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={slas}
                            items={this.getServiceLevelAgreementOptionsForGood()}
                            onChange={handleServiceLevelAgreementChange}
                            multiple={true}
                        /> */}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

export default connect(mapStateToProps, null)(withTranslate(ApplyDiscount));
