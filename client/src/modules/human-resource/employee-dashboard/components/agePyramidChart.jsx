import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class AgePyramidChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                nameData1: 'Nữ',
                nameData2: 'Nam',
                ageRanges: ['65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '18-19'],
                data1: ['Nữ', -1, -5, -7, -8, -9, -12, -20, -15, -8, -19, -20],
                data2: ['Nam', 1, 4, 6, 10, 11, 40, 20, 12, 9, 20, 32],

            }
        }
    }

    componentDidMount() {
        this.renderChart(this.state.data);
    }
    findMaxOfArray = (data) => {
        let max = data[1];
        for (let i = 2; i < data.length - 1; i++) {
            if (data[i] > max) {
                max = data[i];
            }
        }
        return max;
    }

    renderChart = (data) => {
        let maxData1 = this.findMaxOfArray(data.data1), maxData2 = this.findMaxOfArray(data.data2);
        let qty_max = maxData1 >= maxData2 ? maxData1 : maxData2;

        this.chart = c3.generate({
            bindto: this.refs.chart,

            data: {
                columns: [data.data1, data.data2],
                type: 'bar',
                groups: [[data.nameData1, data.nameData2]]
            },
            padding: {
                top: 10,
            },
            bar: {
                width: { ratio: 0.9 },
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category', categories: data.ageRanges,
                    tick: { outer: false, centered: true },
                },
                y: {
                    tick: {
                        outer: false,
                        format: function (d) {
                            return (parseInt(d) === d) ? Math.abs(d) : null;
                        }
                    },
                    max: qty_max, min: -qty_max
                }
            },
            grid: {
                y: {
                    lines: [{ value: 0 }],
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        var format = function (d) {
                            return (parseInt(d) === d) ? Math.abs(d) : null;
                        }
                        return format(value) + ' nhân viên';
                    }
                }
            }
        });
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

const agePyramidChart = connect(null, null)(withTranslate(AgePyramidChart));
export { agePyramidChart as AgePyramidChart };
