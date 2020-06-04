import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class MultipleBarChart extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.renderChart(this.state.data);
    }
    componentDidUpdate() {
        this.renderChart(this.state.data);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.lineBar !== prevState.lineBar) {
            return {
                ...prevState,
                data: {
                    lineBar: nextProps.lineBar,
                    nameData1: nextProps.nameData1,
                    nameData2: nextProps.nameData2,
                    nameData3: nextProps.nameData3,
                    ratioX: ['x', "2019-07-01", "2019-08-01", "2019-09-01", "2019-10-01", "2019-11-02", "2019-12-01", "2020-01-01", "2020-02-01", "2020-03-01", "2020-04-01", "2020-05-01", "2020-06-01"],
                    data1: ['data1', 12.33, 11.33, 10.33, 13.33, 10.33, 11.33, 12.33, 12.33, 11.33, 12.33, 9.33, 10.33],
                    data2: ['data2', 13.50, 13.50, 13.50, 12.50, 11.50, 13.50, 10.50, 13.50, 13.50, 11.50, 13.50, 9.50],
                    data3: ['data3', 11.50, 12.50, 19.50, 13.50, 13.50, 14.50, 13.50, 10.50, 13.50, 13.50, 12.50, 13.50]
                }
            }
        } else {
            return null;
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
                    data2: data.nameData2,
                    data3: data.nameData3
                }
            },
            bar: {
                width: { ratio: 0.8 }
            },
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
            tooltip: {
                format: {
                    value: function (value, ratio, id) { return value + '%'; }
                }
            }
        });
        var addColumn = (ratioX, data, delay) => {
            var dataTmp = [data[0], 0];
            setTimeout(function () {
                chart.load({
                    columns: [ratioX, dataTmp]
                });
            }, 1000);
            data.forEach(function (value, index) {
                setTimeout(function () {
                    dataTmp[index] = value;
                    chart.load({
                        columns: [ratioX, dataTmp],
                    });
                }, (500 + (delay / 12 * index)));
            });
        }
        addColumn(data.ratioX, data.data1, 2400);
        addColumn(data.ratioX, data.data2, 2400);
        addColumn(data.ratioX, data.data3, 2400);
    }
    render() {
        return (
            <React.Fragment>
                <div ref="chart"></div>
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

const multipleBarChart = connect(null, null)(withTranslate(MultipleBarChart));
export { multipleBarChart as MultipleBarChart };
