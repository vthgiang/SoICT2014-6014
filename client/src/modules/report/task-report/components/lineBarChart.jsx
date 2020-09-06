import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";
import './transferList.css';

class LineBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barAndLineChart: false,
            pieChart: false,
        }
    }


    setDataMultiChart = (data) => {
        let dataConvert = [['x']], typeChart = {}, rotated;
        let indices = { time: 0 }; // chỉ số time = 0 ứng với mảng x trong dataConvert 
        if (data) {
            // Nếu dữ liệu nhiều thì xoay trục biểu đồ
            (data.length > 6) ? (rotated = true) : (rotated = false);

            data.forEach(x => {
                dataConvert[indices.time].push(x.time);
                x.tasks.forEach(({ code, value, chartType }) => {
                    if (!(code in indices))
                        indices[code] = dataConvert.push([code]) - 1;
                    dataConvert[indices[code]].push(value);

                    typeChart = { ...typeChart, [code]: chartType }; // lấy dạng biểu dồ cho từng trường thông tin để vẽ biểu đồ tương ứng( bar, line)
                })
            })
        }

        return { dataConvert, typeChart, rotated };
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

        let newData = data.dataConvert;
        let typeChart = data.typeChart;
        let rotated = data.rotated;

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
                rotated: rotated,
                x: {
                    type: 'category',
                    tick: {
                        multiline: true
                    },
                },
                y: {
                    label: {
                        text: 'Thành tiền',
                        position: 'outer-middle'
                    },
                }
            },
        });
    }


    render() {
        return (
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="lineBarChart">
                        <section ref="barChart"></section>
                    </div>
                </div>
            </div>
        )
    }
}

const lineBarChart = connect(null, null)(withTranslate(LineBarChart));
export { lineBarChart as LineBarChart };
