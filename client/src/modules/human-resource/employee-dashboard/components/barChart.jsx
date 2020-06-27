import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineBar: true,
        }
    }

    componentDidMount() {
        this.renderChart(this.state);
    }
    componentDidUpdate() {
        this.renderChart(this.state);
    }
    // Bắt sự kiện thay đổi chế đọ xem biểu đồ
    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            lineBar: value
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState,
            nameChart: nextProps.nameChart,
            nameData1: nextProps.nameData1,
            ratioX: ['x', "2019-07-01", "2019-08-01", "2019-09-01", "2019-10-01", "2019-11-02", "2019-12-01", "2020-01-01", "2020-02-01", "2020-03-01", "2020-04-01", "2020-05-01", "2020-06-01"],
            data1: ['data1', 12, 15, 8, 13, 10, 18, 5, 14, 6, 18, 6, 9],
        }
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.chart;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    renderChart = (data) => {
        data.data1.shift();
        let fakeData1 = data.data1.map((x, index) => {
            if (index % 2 === 0) {
                return x * 2
            } else return x / 2
        });
        let fakeData2 = data.data1.map(x => 2 * x);
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.chart,
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: data.lineBar === true ? 'bar' : 'spline',
                names: {
                    data1: data.nameData1,
                },
                colors: {
                    data1: '#ff7f0e',
                },
            },
            // bar: {
            //     width: { ratio: 0.7 }
            // },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                        rotate: -45,
                        multiline: false
                    },
                },
                y: {
                    tick: { outer: false },
                }
            },
            // tooltip: {
            //     format: {
            //         value: function (value, ratio, id) { return value + '%'; }
            //     }
            // }
        });

        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...fakeData1]],
            });
        }, 100);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.data1]],
            });
        }, 300);
    }
    render() {
        const { lineBar, nameChart } = this.state;
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">{nameChart}</h3>
                    </div>
                    <div className="box-body dashboard_box_body">
                        <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: %</b></p>
                        <div className="box-tools pull-right">
                            <div className="btn-group pull-rigth" id="barChart">
                                <button type="button" className={`btn btn-default btn-xs ${lineBar === false ? 'active' : null}`} onClick={() => this.handleChangeViewChart(true)}>Bar chart</button>
                                <button type="button" className={`btn btn-default btn-xs ${lineBar === true ? 'active' : null}`} onClick={() => this.handleChangeViewChart(false)}>Line chart</button>
                            </div>
                        </div>
                        <div ref="chart"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

// function mapState(state) {
//     const { employeesManager, department } = state;
//     return { employeesManager, department };
// }

// const actionCreators = {
//     getDepartment: DepartmentActions.get,
// };

const barChart = connect(null, null)(withTranslate(BarChart));
export { barChart as BarChart };
