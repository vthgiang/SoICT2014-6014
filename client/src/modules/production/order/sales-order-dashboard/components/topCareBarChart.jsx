import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import c3 from "c3";
import "c3/c3.css";

import { DatePicker, SelectBox } from "../../../../../common-components";

class TopCareBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeGood: true, //de xem hien thi theo doanh so hay so luong san pham
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

    render() {
        this.barChart();
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">Top sản phẩm được quan tâm (theo số lượng)</h3>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Từ</label>
                            <DatePicker
                                id="incident_before"
                                onChange={this.onchangeDate}
                                disabled={false}
                                placeholder="start date"
                                style={{ width: "120px", borderRadius: "4px" }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Đến</label>
                            <DatePicker
                                id="incident_end"
                                onChange={this.onchangeDate}
                                disabled={false}
                                placeholder="end date"
                                style={{ width: "120px", borderRadius: "4px" }}
                            />
                        </div>
                        {/* <div className="form-group">
                            <label className="form-control-static">Chọn Top</label>
                            <input className="form-control" type="number" placeholder="Mặc định bằng 5" style={{ width: "175px" }} />
                        </div> */}
                        <div className="form-group" style={{ marginLeft: "20px" }}>
                            <button className="btn btn-success">Tìm kiếm</button>
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TopCareBarChart));
