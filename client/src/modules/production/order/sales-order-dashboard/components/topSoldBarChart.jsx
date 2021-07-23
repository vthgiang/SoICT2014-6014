import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SalesOrderActions } from "../../sales-order/redux/actions";

import c3 from "c3";
import "c3/c3.css";

import { DatePicker, SelectBox } from "../../../../../common-components";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";

function TopSoldBarChart(props) {

    const amountPieChart = React.createRef()
    const topSoldBarChart = React.createRef()

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
    })


    useEffect(() => {
            barChart();
    }, [])

    const setDataBarChart = () => {
        let topGoodsSoldValue = ["Top sản phẩm bán chạy theo số lượng"];

        if (props.salesOrders && props.salesOrders.topGoodsSold) {
            let topGoodsSoldMap = props.salesOrders.topGoodsSold.map((element) => element.quantity);
            topGoodsSoldValue = topGoodsSoldValue.concat(topGoodsSoldMap);
        }
        let dataBarChart = {
            columns: [topGoodsSoldValue && topGoodsSoldValue.length ? topGoodsSoldValue : []],
            type: "bar",
        };
        return dataBarChart;
    };

    function removePreviousChart() {
        
        const chart = topSoldBarChart.current;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    function handleChangeViewChart() {
        setState({
            ...state,
            typeGood: !state.typeGood,
        });
    }

    // Khởi tạo PieChart bằng C3
    const barChart = () => {

        let dataBarChart = setDataBarChart();
       
        let topGoodsSoldTitle = [];
        if (props.salesOrders && props.salesOrders.topGoodsSold) {
            topGoodsSoldTitle = props.salesOrders.topGoodsSold.map((element) => element.name);
        }

        removePreviousChart();

        let chart = c3.generate({
            bindto: topSoldBarChart.current,

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
                    categories: topGoodsSoldTitle && topGoodsSoldTitle.length ? topGoodsSoldTitle : [],
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

    const handleStartDateChange = (value) => {
        setState((state) => {
            return {
                ...state,
                startDate: value,
            };
        });
    };

    const handleEndDateChange = (value) => {
        setState((state) => {
            return {
                ...state,
                endDate: value,
            };
        });
    };

    const handleSunmitSearch = async () => {
        let { startDate, endDate, currentRole } = state;
        let data = {
            currentRole,
            startDate: startDate ? formatToTimeZoneDate(startDate) : "",
            endDate: endDate ? formatToTimeZoneDate(endDate) : "",
        };
        await props.getTopGoodsSold(data);
    };

    return (
        <div className="box">
            <div className="box-header with-border">
                <i className="fa fa-bar-chart-o" />
                <h3 className="box-title">Top sản phẩm bán chạy (theo số lượng)</h3>
                <div className="form-inline">
                    <div className="form-group">
                        <label style={{ width: "auto" }}>Từ</label>
                        <DatePicker
                            id="date_picker_dashboard_start_top_sold"
                            value={state.startDate}
                            onChange={handleStartDateChange}
                            disabled={false}
                        />
                    </div>

                    {/**Chọn ngày kết thúc */}
                    <div className="form-group">
                        <label style={{ width: "auto" }}>Đến</label>
                        <DatePicker
                            id="date_picker_dashboard_end_top_sold"
                            value={state.endDate}
                            onChange={handleEndDateChange}
                            disabled={false}
                        />
                    </div>
                    {/* <div className="form-group">
                            <label className="form-control-static">
                                Chọn Top
                            </label>
                            <input
                                className="form-control"
                                type="number"
                                placeholder="Mặc định bằng 5"
                                style={{ width: "175px" }}
                            />
                        </div> */}
                    <div className="form-group" style={{ marginLeft: "20px" }}>
                        <button className="btn btn-success" onClick={() => handleSunmitSearch()}>
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <div ref={topSoldBarChart} id ="topSoldBarChart"></div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const { salesOrders } = state;
    return { salesOrders };
}

const mapDispatchToProps = {
    getTopGoodsSold: SalesOrderActions.getTopGoodsSold,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TopSoldBarChart));
