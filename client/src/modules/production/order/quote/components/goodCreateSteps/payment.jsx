import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SelectBox } from "../../../../../../common-components";
import CreateDiscountsForGood from "../createDiscountsForGood";

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getTaxOptionsForGood = () => {
        let { listTaxsByGoodId } = this.props.goods.goodItems;
        let options = [];
        if (listTaxsByGoodId && listTaxsByGoodId.length) {
            options = listTaxsByGoodId.map((item) => {
                return {
                    value: item._id,
                    text: item.name + " -- " + item.percent + " (%)",
                };
            });
        }
        return options;
    };

    getSelectTaxsId = () => {
        let { listTaxsByGoodId } = this.props.goods.goodItems;
        let percentString = "";
        if (listTaxsByGoodId && listTaxsByGoodId.length) {
            listTaxsByGoodId.forEach((item) => {
                percentString = percentString + item.percent;
            });
        }
        return percentString;
    };
    render() {
        let { taxs, note } = this.props;
        const { handleTaxsChange, handleNoteChange } = this.props;
        return (
            <React.Fragment>
                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{ padding: 10, height: "100%" }}>
                    <div className="form-group">
                        <label>
                            Thuế <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-quote-taxs-${this.getSelectTaxsId()}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={taxs}
                            items={this.getTaxOptionsForGood()}
                            onChange={handleTaxsChange}
                            multiple={true}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Ghi chú
                            <span className="attention"> * </span>
                        </label>
                        <input type="text" className="form-control" value={note} onChange={handleNoteChange} />
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

export default connect(mapStateToProps, null)(withTranslate(Payment));
