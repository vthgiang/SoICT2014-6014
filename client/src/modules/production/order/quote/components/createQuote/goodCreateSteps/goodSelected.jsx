import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SelectBox, ErrorLabel } from "../../../../../../../common-components";

class GoodSelected extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getGoodOptions = () => {
        let options = [];
        let { listGoodsByType } = this.props.goods;
        if (listGoodsByType) {
            options = [{ value: "title", text: "---Chọn mặt hàng---" }];

            let mapOptions = listGoodsByType.map((item) => {
                return {
                    value: item._id,
                    text: item.code + " - " + item.name,
                };
            });

            options = options.concat(mapOptions);
        }
        return options;
    };

    render() {
        let { good, goodName, pricePerBaseUnit, baseUnit, inventory, quantity, pricePerBaseUnitError } = this.props;
        const { handleGoodChange, handlePriceChange, handleQuantityChange } = this.props;
        return (
            <React.Fragment>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10, height: "100%" }}>
                    <div className="form-group">
                        <label>
                            Sản phẩm
                            <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-good-code-quote`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={good}
                            items={this.getGoodOptions()}
                            onChange={handleGoodChange}
                            multiple={false}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Tên sản phẩm
                            <span className="attention"> * </span>
                        </label>
                        <input type="text" className="form-control" value={goodName} />
                    </div>

                    <div className="form-group">
                        <label>
                            Đơn vị tính
                            <span className="attention"> * </span>
                        </label>
                        <input type="text" className="form-control" value={baseUnit} disabled="true" />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10, height: "100%" }}>
                    <div className={`form-group ${!pricePerBaseUnitError ? "" : "has-error"}`}>
                        <label>
                            Đơn giá
                            <span className="attention"> * </span>
                        </label>
                        <input type="number" className="form-control" value={pricePerBaseUnit} onChange={handlePriceChange} />
                        <ErrorLabel content={pricePerBaseUnitError} />
                    </div>
                    <div className="form-group">
                        <label>
                            Số lượng còn trong kho
                            <span className="attention"> * </span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={inventory ? (inventory > 0 ? inventory + " " + baseUnit : "Hết hàng") : ""}
                            disabled={true}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Số lượng
                            <span className="attention"> * </span>
                        </label>
                        <input type="number" className="form-control" value={quantity} onChange={handleQuantityChange} />
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodSelected));
