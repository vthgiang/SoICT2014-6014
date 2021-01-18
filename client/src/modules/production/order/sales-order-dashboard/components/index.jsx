import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SalesOrderActions } from "../../sales-order/redux/actions";
import { QuoteActions } from "../../quote/redux/actions";

import { DatePicker, SelectBox } from "../../../../../common-components";
import QuoteSummaryChart from "./quoteSummaryChart";
import TopCareBarChart from "./topCareBarChart";
import SalesOrderStatusChart from "./salesOrderStatusChart";
import TopSoldBarChart from "./topSoldBarChart";
import InfoBox from "./infoBox";
import SalesOfEmployee from "./salesOfEmployee";
// import QuoteSalesMappingAreaChart from "./quoteSalesMappingAreaChart";
// import RevenueAndSalesBarChart from "./revenueAndSalesBarChart";
// import AverageQuoteToSales from "./averageQuoteToSales";

class SalesOrderDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
        };
    }

    componentDidMount() {
        const { currentRole } = this.state;
        this.props.countSalesOrder({ currentRole });
        this.props.getTopGoodsSold({ currentRole });
        this.props.getSalesForDepartments();
        this.props.countQuote({ currentRole });
        this.props.getTopGoodsCare({ currentRole });
    }

    render() {
        console.log("SALES ORDER DASHBOARD", this.props.salesOrders);
        console.log("QUOTE DASHBOARD", this.props.quotes);
        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="form-inline" style={{ marginBottom: "10px" }}>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Định dạng</label>
                            <SelectBox
                                id="selectBoxDay"
                                items={[
                                    { value: "1", text: "Ngày" },
                                    { value: "0", text: "Tháng" },
                                    { value: "3", text: "Năm" },
                                ]}
                                style={{ width: "10rem" }}
                                onChange={this.onchangeDate}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Từ</label>
                            <DatePicker
                                id="monthStartInHome"
                                dateFormat="month-year"
                                value={"02-2020"}
                                onChange={this.onchangeDate}
                                disabled={false}
                            />
                        </div>

                        {/**Chọn ngày kết thúc */}
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Đến</label>
                            <DatePicker
                                id="monthEndInHome"
                                dateFormat="month-year"
                                value={"10-2020"}
                                onChange={this.handleSelectMonthEnd}
                                disabled={false}
                            />
                        </div>

                        <div className="form-group">
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSunmitSearch()}>
                                Tìm kiếm
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <InfoBox />

                        <div className="col-xs-12">
                            <div className="col-xs-6">
                                <QuoteSummaryChart />
                            </div>

                            <div className="col-xs-6">
                                <SalesOrderStatusChart />
                            </div>
                        </div>
                        {/* <div className="col-xs-12">
                            <QuoteSalesMappingAreaChart />
                        </div> */}

                        {/* <div className="col-xs-12">
                            <RevenueAndSalesBarChart />
                        </div> */}

                        <div className="col-xs-12">
                            <div className="col-xs-6">
                                <TopCareBarChart />
                            </div>

                            <div className="col-xs-6">
                                <TopSoldBarChart />
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <SalesOfEmployee />
                        </div>
                        {/* <div className="col-xs-12">
                            <AverageQuoteToSales />
                        </div> */}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { salesOrders, quotes } = state;
    return { salesOrders, quotes };
}

const mapDispatchToProps = {
    countSalesOrder: SalesOrderActions.countSalesOrder,
    getTopGoodsSold: SalesOrderActions.getTopGoodsSold,
    getSalesForDepartments: SalesOrderActions.getSalesForDepartments,
    countQuote: QuoteActions.countQuote,
    getTopGoodsCare: QuoteActions.getTopGoodsCare,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderDashboard));
