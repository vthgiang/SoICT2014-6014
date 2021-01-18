import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { formatCurrency } from "../../../../../helpers/formatCurrency";

import c3 from "c3";
import "c3/c3.css";

class QuoteSummaryChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1, //1. xem theo số lượng, 2. xem theo doanh số
        };
    }

    componentDidMount() {
        this.pieChart();
    }

    handleChangeType = (type) => {
        this.setState({
            type,
        });
    };

    setDataPieChart = () => {
        const { type } = this.state;
        let quoteCounter = {};

        if (this.props.quotes) {
            quoteCounter = this.props.quotes.quoteCounter;
        }
        let dataPieChart = [];
        if (quoteCounter && type === 1) {
            dataPieChart = [
                ["Chờ phê duyệt", quoteCounter.totalNumberWithStauts[1]],
                ["Đã duyệt", quoteCounter.totalNumberWithStauts[2]],
                ["Đã chốt đơn", quoteCounter.totalNumberWithStauts[3]],
                ["Đã hủy", quoteCounter.totalNumberWithStauts[4]],
            ];
        }

        if (quoteCounter && type === 2) {
            dataPieChart = [
                ["Chờ phê duyệt", quoteCounter.totalMoneyWithStatus[1]],
                ["Đã duyệt", quoteCounter.totalMoneyWithStatus[2]],
                ["Đã chốt đơn", quoteCounter.totalMoneyWithStatus[3]],
                ["Đã hủy", quoteCounter.totalMoneyWithStatus[4]],
            ];
        }
        return dataPieChart;
    };

    removePreviousChart() {
        const chart = this.refs.amountPieChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataPieChart();
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.amountPieChart,

            data: {
                columns: dataPieChart,
                type: "pie",
            },

            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value ? formatCurrency(value) : "";
                    },
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

    render() {
        this.pieChart();
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">Số lượng, doanh số báo giá theo trạng thái</h3>
                    <div className="box-tools pull-right">
                        <div
                            className="btn-group pull-rigth"
                            style={{
                                position: "absolute",
                                right: "5px",
                                top: "5px",
                            }}
                        >
                            <button
                                type="button"
                                className={`btn btn-xs ${this.state.type === 2 ? "active" : "btn-danger"}`}
                                onClick={() => this.handleChangeType(1)}
                            >
                                Số lượng
                            </button>
                            <button
                                type="button"
                                className={`btn btn-xs ${this.state.type === 2 ? "btn-danger" : "active"}`}
                                onClick={() => this.handleChangeType(2)}
                            >
                                Doanh số
                            </button>
                        </div>
                    </div>
                    <div ref="amountPieChart"></div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { quotes } = state;
    return { quotes };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteSummaryChart));
