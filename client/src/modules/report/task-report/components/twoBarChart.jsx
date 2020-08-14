import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
// import * as d3 from "d3";
// import { format } from 'd3';
class TwoBarChart extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING
        }
    }

    setDataMultiChart = (data) => {
        // const { data } = this.props;
        let dataConvert = [], dateConvert = [], valueConvert = [];
        if (data) {
            data.forEach(x => {
                let date = new Date(x.time);
                let getYear = date.getFullYear();
                let getMonth = date.getMonth() + 1;
                let newDate = `${getYear}-${getMonth}-1`;
                return dateConvert = [...dateConvert, newDate];
            })
        }
        dateConvert.unshift("x");
        valueConvert = Object.values(data.flatMap(x => x.tasks).reduce((a, i) => {
            if (typeof i.value === 'number') {
                a[i.code] = a[i.code] || [i.code];
                a[i.code].push(i.value);
            }
            return a;
        }, {}));

        dataConvert = [...[dateConvert], ...valueConvert];
        return dataConvert;
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.data) {
            if (nextProps.charType === "0") {
                this.renderBarChart(nextProps.data);
            } else if (nextProps.charType === "1") {
                this.renderLineChart(nextProps.data);
            } else {
                this.renderPieChart(nextProps.data);
            }

        }
        return true;
    }

    // Xóa các  barchart đã render khi chưa đủ dữ liệu
    removePreviousBarChart() {
        const chart = this.refs.barChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    // Xóa các  Piechart đã render khi chưa đủ dữ liệu
    removePrceviousPieChart() {
        const chart = this.refs.pieChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    // Xóa các  lineChart đã render khi chưa đủ dữ liệu
    removePrceviousLineChart() {
        const chart = this.refs.lineChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    renderBarChart = (data) => {
        this.removePreviousBarChart();
        data = this.setDataMultiChart(data);
        let newPiedata = [...data];
        newPiedata.shift();
        this.chart = c3.generate({
            bindto: this.refs.barChart,
            data: {
                x: 'x',
                columns: data,
                type: 'bar',

            },
            bar: {
                width: { ratio: 0.3 }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                    },
                },
                y: {
                    tick: { outer: false },
                }
            },
        });

    }

    renderLineChart = (data) => {
        this.removePrceviousLineChart();
        data = this.setDataMultiChart(data);
        this.chart = c3.generate({
            bindto: this.refs.lineChart,
            data: {
                x: 'x',
                columns: data,
                type: 'spline'
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); },
                        outer: false,
                    },
                },
                y: {
                    tick: {
                        outer: false,
                    },
                }
            },
        });
    }

    renderPieChart = (data) => {
        data = this.setDataMultiChart(data);
        let newPiedata = [...data];
        newPiedata.shift();
        this.removePrceviousPieChart();
        this.chart = c3.generate({
            bindto: this.refs.pieChart,
            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: {
                columns: newPiedata,
                type: 'pie',
            }
        })
    }
    render() {
        const { nameChart } = this.state;
        const { charType, data } = this.props;

        return (
            <React.Fragment>
                <div className="row">

                    <div className="col-md-6">
                        <div className="box-header with-border">
                            <h3 className="box-title">{}</h3>
                        </div>
                        <div className="box-body dashboard_box_body">
                            <p className="pull-left" style={{ marginBottom: 0 }}><b>Thành tiền: Vnđ</b></p>
                            <div ref="barChart"></div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="box-header with-border">
                            <h3 className="box-title">{}</h3>
                        </div>
                        <div className="box-body dashboard_box_body">
                            <p className="pull-left" style={{ marginBottom: 0 }}><b>Thành tiền: Vnđ</b></p>
                            <div ref="pieChart"></div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="box-header with-border">
                            <h3 className="box-title">{}</h3>
                        </div>
                        <div className="box-body dashboard_box_body">
                            <p className="pull-left" style={{ marginBottom: 0 }}><b>Thành tiền: Vnđ</b></p>
                            <div ref="lineChart"></div>
                        </div>
                    </div>



                </div>


            </React.Fragment>
        )
    }
}

const twoBarChart = connect(null, null)(withTranslate(TwoBarChart));
export { twoBarChart as TwoBarChart };
