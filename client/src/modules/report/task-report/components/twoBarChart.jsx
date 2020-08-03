import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class TwoBarChart extends Component {
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


    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState,
            nameChart: nextProps.nameChart,
            nameData1: nextProps.nameData1,
            nameData2: nextProps.nameData2,
            ratioX: ['x', "2020-07-01", "2020-08-01"],
            data1: ['data1', 5, 7],
            data2: ['data1', 22, 26],
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
        data.data2.shift();
        let fakeData1 = data.data1.map(x => 2 * x);
        let fakeData2 = data.data2.map(x => x / 2);
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.chart,
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: 'bar',
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2,
                },
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
                        rotate: -45,
                        multiline: false
                    },
                },
                y: {
                    tick: { outer: false },
                }
            },
        });

        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...fakeData1], ['data2', ...fakeData2]],
            });
        }, 30);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.data1], ['data2', ...data.data2]],
            });
        }, 50);
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
                        <p className="pull-left" style={{ marginBottom: 0 }}><b>Thành tiền: Vnđ</b></p>
                        <div ref="chart"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const twoBarChart = connect(null, null)(withTranslate(TwoBarChart));
export { twoBarChart as TwoBarChart };
