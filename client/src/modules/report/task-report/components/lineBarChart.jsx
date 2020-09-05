import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class LineBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barAndLineChart: false,
            pieChart: false,
        }
    }


    setDataMultiChart = (data) => {
        let dataConvert = [['x']], dateConvert, typeChart = {}, axisXType;
        let indices = { time: 0 }; // chỉ số time = 0 ứng với mảng x trong dataConvert 
        if (data) {
            data.forEach(x => {
                let date = new Date(x.time);
                let getYear = date.getFullYear();
                let getMonth = date.getMonth() + 1;
                let newDate = `${getYear}-${getMonth}-1`;

                //Check date không phải định dạng datetime thì cho axisXType = category
                if (isNaN(date)) {
                    axisXType = 'category';
                    dateConvert = x.time;
                } else {
                    axisXType = 'timeseries';
                    dateConvert = newDate;
                }

                dataConvert[indices.time].push(dateConvert);
                x.tasks.forEach(({ code, value, chartType }) => {
                    if (!(code in indices))
                        indices[code] = dataConvert.push([code]) - 1;
                    dataConvert[indices[code]].push(value);

                    typeChart = { ...typeChart, [code]: chartType }; // lấy dạng biểu dồ cho từng trường thông tin để vẽ biểu đồ tương ứng( bar, line)
                })
            })
        }

        return { dataConvert, typeChart, axisXType };
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.barLineChartData && nextProps.barLineChartData.length > 0) {
            return {
                ...prevState,
                barAndLineChart: true,
            }
        }
        return null;
    }


    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.barLineChartData && nextProps.barLineChartData.length > 0) {
            this.renderBarAndLineChart(nextProps.barLineChartData);
        }
        return true;
    }


    componentDidMount() {
        if (this.props.barLineChartData && this.props.barLineChartData.length > 0) {
            this.renderBarAndLineChart(this.props.barLineChartData);
        }
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


    renderBarAndLineChart = (data) => {
        this.removePreviousBarChart();
        data = this.setDataMultiChart(data);
        console.log("dataConvert", data)
        let newData = data.dataConvert;
        let typeChart = data.typeChart;

        let type = data.axisXType;

        this.chart = c3.generate({
            bindto: this.refs.barChart,
            padding: {
                top: 20,
                bottom: 20,
                right: 20
            },
            data: {
                x: 'x',
                columns: newData,
                type: 'bar',
                types: typeChart,
            },
            bar: {
                width: {
                    ratio: 0.4
                }
            },
            axis: {
                x: {
                    type: type,
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                        multiline: true
                    },
                },
                y: {
                    label: {
                        text: 'Thành tiền',
                        position: 'outer-middle'
                    },
                    tick: { outer: false },
                }
            },
        });
    }


    render() {
        return (
            <div className="box box-primary">
                <div className="box-header">
                    <h4 className="box-title">Báo cáo công việc</h4>
                </div>
                <div className="box-body qlcv">
                    <div className="taskReport-barchart">
                        <section ref="barChart"></section>
                    </div>
                </div>
            </div>
        )
    }
}

const lineBarChart = connect(null, null)(withTranslate(LineBarChart));
export { lineBarChart as LineBarChart };
