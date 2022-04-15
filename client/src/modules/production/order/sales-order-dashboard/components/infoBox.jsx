import React, { Component} from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { formatCurrency } from "../../../../../helpers/formatCurrency";

function InfoBox(props) {

    let salesOrdersCounter = {};

    if (props.salesOrders) {
        salesOrdersCounter = props.salesOrders.salesOrdersCounter;
    }

    console.log('sale order ', salesOrdersCounter)

    let quoteCounter = {};

    if (props.quotes) {
        quoteCounter = props.quotes.quoteCounter;
    }

    return (
        <div className="col-xs-12">
            <div className="col-md-4 col-sm-6 col-xs-6">
                <div className="info-box with-border">
                    <span className="info-box-icon bg-aqua">
                        <i className="fa fa-hand-o-right"></i>
                    </span>
                    <div className="info-box-content" title="Số báo giá">
                        <span className="info-box-text">Số báo giá</span>
                        <span className="info-box-number">{quoteCounter ? quoteCounter.count : 0} báo giá</span>
                        <a href={`/manage-quote`} target="_blank">
                            Xem thêm <i className="fa fa-arrow-circle-right"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="col-md-4 col-sm-6 col-xs-6">
                <div className="info-box with-border">
                    <span className="info-box-icon bg-green">
                        <i className="fa fa-hand-o-right"></i>
                    </span>
                    <div className="info-box-content" title="Tổng tiền mua hàng">
                        <span className="info-box-text">Số đơn kinh doanh</span>
                        <span className="info-box-number">{salesOrdersCounter ? salesOrdersCounter.count : 0} đơn</span>
                        <a href={`/manage-sales-order`} target="_blank">
                            Xem thêm <i className="fa fa-arrow-circle-right"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="col-md-4 col-sm-6 col-xs-6">
                <div className="info-box with-border">
                    <span className="info-box-icon bg-red">
                        <i className="fa fa-hand-o-right"></i>
                    </span>
                    <div className="info-box-content" title="Tổng tiền mua hàng">
                        <span className="info-box-text">Doanh số</span>
                        <span className="info-box-number">{formatCurrency(salesOrdersCounter ? salesOrdersCounter.totalMoney : "")} vnđ</span>
                        <a href={`/manage-payment`} target="_blank">
                            Xem thêm <i className="fa fa-arrow-circle-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const { salesOrders, quotes } = state;
    return { salesOrders, quotes };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InfoBox));
