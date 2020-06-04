import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class AgePyramidChart extends Component {

    constructor(props) {
        super(props);
        this.state = {}
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

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart(){
        const chart = this.refs.chart;
        while(chart.hasChildNodes()){
            chart.removeChild(chart.lastChild);
        }
    } 

    renderChart = (data) => {
        this.removePreviousChart();
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
                y: { lines: [{ value: 0 }], }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        var format = function (d) { return (parseInt(d) === d) ? Math.abs(d) : null; }
                        return format(value) + ' nhân viên';
                    }
                }
            }
        });
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.data1 !== this.state.data1 || nextProps.data2 !== this.state.data2) {
            this.renderChart(this.state);
            
        }
        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data1 !== prevState.data1 || nextProps.data2 !== prevState.data2) {
            return {
                ...prevState,
                nameData1: 'Nữ',
                nameData2: 'Nam',
                ageRanges: ['65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '18-19'],
                data1: nextProps.data1,
                data2: nextProps.data2,
            }
        } else {
            return null;
        }
    }
    render() {
        return (
            <React.Fragment>
                <div ref="chart"></div>
            </React.Fragment>
        )
    }
}

const agePyramidChart = connect(null, null)(withTranslate(AgePyramidChart));
export { agePyramidChart as AgePyramidChart };
