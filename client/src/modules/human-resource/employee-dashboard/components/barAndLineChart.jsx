import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class BarAndLineChart extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.renderChart(this.state.data);
    }
    componentDidUpdate(){
        this.renderChart(this.state.data);
    }

    renderChart = (data) => {
        this.chart = c3.generate({
            bindto: this.refs.chart,
            data: {
                x: 'x',
                columns: [data.ratioX, data.data1, data.data2],
                types: {
                    data1: data.lineBar === true ? 'bar' : 'spline',
                },
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2
                }
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
                    tick: {
                        outer: false,
                    },
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        return value + '%';
                    }
                }
            }
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.lineBar !== prevState.lineBar) {
            return {
                ...prevState,
                data: {
                    lineBar: nextProps.lineBar,
                    nameData1: nextProps.nameData1,
                    nameData2: nextProps.nameData2,
                    ratioX: ['x', '2020-06-01', '2020-05-01', '2020-04-01', '2020-03-01', '2020-02-01', '2020-01-01', '2019-12-01', '2019-11-02', '2019-10-01', '2019-09-01', '2019-08-01', '2019-07-01'],
                    data1: ['data1', 12.33, 11.33, 10.33, 13.33, 10.33, 11.33, 12.33, 12.33, 11.33, 12.33, 9.33, 10.33],
                    data2: ['data2', 13.50, 13.50, 13.50, 13.50, 13.50, 13.50, 13.50, 13.50, 13.50, 13.50, 13.50, 13.50]
                }
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

// function mapState(state) {
//     const { employeesManager, department } = state;
//     return { employeesManager, department };
// }

// const actionCreators = {
//     getDepartment: DepartmentActions.get,
// };

const barAndLineChart = connect(null, null)(withTranslate(BarAndLineChart));
export { barAndLineChart as BarAndLineChart };
