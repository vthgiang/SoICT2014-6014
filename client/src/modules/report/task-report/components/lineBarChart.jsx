import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';

class LineBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barAndLineChart: false,
            pieChart: false,
        }
    }


    setDataMultiChart = (data) => {
        let dataConvert = [], dateConvert = [], valueConvert = [], chartType = [], axisXType, showInReport;
        if (data) {
            data.forEach(x => {
                let date = new Date(x.time);
                //Check date là quý-năm thì cho axisXType = category
                if (isNaN(date)) {
                    axisXType = 'category';
                    return dateConvert = [...dateConvert, x.time.toString()];
                } else {
                    axisXType = 'timeseries';
                    let getYear = date.getFullYear();
                    let getMonth = date.getMonth() + 1;
                    let newDate = `${getYear}-${getMonth}-1`;
                    return dateConvert = [...dateConvert, newDate];
                }
            })
        }
        dateConvert.unshift("x");


        let allTasks = data.flatMap(x => x.tasks);
        // gom nhom giá trị các trường thông tin
        valueConvert = Object.values(allTasks.reduce((arr, item) => {
            arr[item.code] = arr[item.code] || [item.code];
            arr[item.code].push(item.value);
            return arr;
        }, {}));


        // gom nhom dang bieu do để
        chartType = allTasks.reduce((obj, item) => {
            return {
                ...obj,
                [item.code]: item.chartType
            }
        }, {});

        dataConvert = [...[dateConvert], ...valueConvert];
        return { dataConvert, chartType, axisXType };
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
        let chartType = data.chartType;
        let barLinechartType = {};
        let pieChartType = {};
        let type = data.axisXType;

        // xóa chartType = pie (biểu đồ tròn), định dạng loại biểu đồ tương ứng có data khi kết hợp cột với đường
        for (let i in chartType) {
            if (chartType[i] !== "pie") {
                barLinechartType[i] = chartType[i];
            } else {
                pieChartType[i] = chartType[i];
            }
        }


        this.chart = c3.generate({
            bindto: this.refs.barChart,
            data: {
                x: 'x',
                columns: newData,
                type: 'bar',
                types: barLinechartType,
            },
            bar: {
                width: { ratio: 0.3 }
            },
            axis: {
                x: {
                    type: type,
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                        // culling: false,
                        // format: function (d) {
                        //     console.log('d', d)
                        // }
                    },
                },
                y: {
                    tick: { outer: false },
                }
            },
        });
    }


    render() {
        return (
            <React.Fragment>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Báo cáo công việc</h3>
                    </div>
                    <div className="box-body dashboard_box_body">
                        <p className="pull-left" style={{ marginBottom: 0 }}><b>Thành tiền: Vnđ</b></p>
                        <div ref="barChart"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const lineBarChart = connect(null, null)(withTranslate(LineBarChart));
export { lineBarChart as LineBarChart };
