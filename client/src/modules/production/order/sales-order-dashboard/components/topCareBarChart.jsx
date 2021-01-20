import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { QuoteActions } from "../../quote/redux/actions";

import c3 from "c3";
import "c3/c3.css";

import { DatePicker, SelectBox } from "../../../../../common-components";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";

class TopCareBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
        };
    }

    componentDidMount() {
        this.barChart();
    }

    setDataBarChart = () => {
        let topGoodsCareValue = ["Top sản phẩm được quan tâm theo số lượng"];

        if (this.props.quotes && this.props.quotes.topGoodsCare) {
            let topGoodsCareMap = this.props.quotes.topGoodsCare.map((element) => element.quantity);
            topGoodsCareValue = topGoodsCareValue.concat(topGoodsCareMap);
        }

        let dataBarChart = {
            columns: [topGoodsCareValue && topGoodsCareValue.length ? topGoodsCareValue : []],
            type: "bar",
        };
        return dataBarChart;
    };

    removePreviousChart() {
        const chart = this.refs.amountPieChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    handleChangeViewChart() {
        this.setState({
            typeGood: !this.state.typeGood,
        });
    }

    // Khởi tạo PieChart bằng C3
    barChart = () => {
        let dataBarChart = this.setDataBarChart();

        let topGoodsCareTitle = [];
        if (this.props.quotes && this.props.quotes.topGoodsCare) {
            topGoodsCareTitle = this.props.quotes.topGoodsCare.map((element) => element.name);
        }

        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.topCareBarChart,

            data: dataBarChart,

            bar: {
                width: {
                    ratio: 0.5, // this makes bar width 50% of length between ticks
                },
                // or
                //width: 100 // this makes bar width 100px
            },
            axis: {
                y: {
                    label: {
                        text: `${"Đơn vị tính"}`,
                        position: "outer-middle",
                    },
                },
                x: {
                    type: "category",
                    categories: topGoodsCareTitle && topGoodsCareTitle.length ? topGoodsCareTitle : [],
                },
            },

            tooltip: {
                format: {
                    title: function (d) {
                        return d;
                    },
                    value: function (value) {
                        return value;
                    },
                },
            },

            legend: {
                show: true,
            },
        });
    };

    handleStartDateChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                startDate: value,
            };
        });
    };

    handleEndDateChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                endDate: value,
            };
        });
    };

    handleSunmitSearch = async () => {
        let { startDate, endDate, currentRole } = this.state;
        let data = {
            currentRole,
            startDate: startDate ? formatToTimeZoneDate(startDate) : "",
            endDate: endDate ? formatToTimeZoneDate(endDate) : "",
        };
        await this.props.getTopGoodsCare(data);
    };

    render() {
        this.barChart();
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">Top sản phẩm được quan tâm (theo số lượng)</h3>
                    <div className="form-inline">
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Từ</label>
                            <DatePicker
                                id="date_picker_dashboard_start_top_care"
                                value={this.state.startDate}
                                onChange={this.handleStartDateChange}
                                disabled={false}
                            />
                        </div>

                        {/**Chọn ngày kết thúc */}
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Đến</label>
                            <DatePicker
                                id="date_picker_dashboard_end_top_care"
                                value={this.state.endDate}
                                onChange={this.handleEndDateChange}
                                disabled={false}
                            />
                        </div>
                        {/* <div className="form-group">
                            <label className="form-control-static">Chọn Top</label>
                            <input className="form-control" type="number" placeholder="Mặc định bằng 5" style={{ width: "175px" }} />
                        </div> */}
                        <div className="form-group" style={{ marginLeft: "20px" }}>
                            <button className="btn btn-success" onClick={() => this.handleSunmitSearch()}>
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                    <div ref="topCareBarChart"></div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { quotes } = state;
    return { quotes };
}

const mapDispatchToProps = {
    getTopGoodsCare: QuoteActions.getTopGoodsCare,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TopCareBarChart));
