import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SelectBox, ErrorLabel } from "../../../../../../../common-components";
import { formatCurrency } from "../../../../../../../helpers/formatCurrency";

function Payment(props) {

    const getTaxOptionsForGood = () => {
        let { listTaxsByGoodId } = props.goods.goodItems;
        let options = [];
        if (listTaxsByGoodId && listTaxsByGoodId.length) {
            options = listTaxsByGoodId.map((item) => {
                return {
                    value: item.code,
                    text: item.name + " -- " + item.percent + " (%)",
                };
            });
        }
        return options;
    };

    const getSelectTaxsId = () => {
        let { listTaxsByGoodId } = props.goods.goodItems;
        let percentString = "";
        if (listTaxsByGoodId && listTaxsByGoodId.length) {
            listTaxsByGoodId.forEach((item) => {
                percentString = percentString + item.percent;
            });
        }
        return percentString;
    };

    let { quantity, inventory, pricePerBaseUnit, code, goodName, baseUnit, taxs, note } = props;
    const { handleTaxsChange, handleNoteChange } = props;
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
                <div style={{ display: "flex", alignItems: "baseline" }}>
                    <div>Số lượng: &ensp;</div>
                    <h4> {quantity} </h4>
                    <div> / {inventory} sản phẩm có sẵn trong kho</div>
                </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10, height: "100%", borderTop: "solid 0.3px #c5c5c5" }}>
                <div className="form-group" style={{ display: "flex" }}>
                    <span className="text-red" style={{ width: "100px" }}>
                        <i className="fa  fa-money"></i> Thuế &ensp;
                        </span>
                    <SelectBox
                        id={`select-quote-taxs-${getSelectTaxsId()}-create`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={taxs}
                        items={getTaxOptionsForGood()}
                        onChange={handleTaxsChange}
                        multiple={true}
                    />
                </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10, height: "100%", borderTop: "solid 0.3px #c5c5c5" }}>
                <div className="form-group" style={{ display: "flex" }}>
                    <span style={{ width: "100px" }}>
                        <i className="fa fa-paint-brush text-info"></i> Ghi chú &ensp;
                        </span>
                    <textarea type="text" className="form-control" value={note} onChange={handleNoteChange} placeholder="Nhập vào ghi chú..." />
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

export default connect(mapStateToProps, null)(withTranslate(Payment));
