import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

class TwoBarChart extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING
        }
    }

    componentDidMount() {
        this.renderChart(this.state);
    }

    shouldComponentUpdate = (nextProps, nextState) => {

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let dataConvert = [], dateConvert = [], valueConvert = [];
        if (nextProps.data) {
            nextProps.data.forEach(x => {
                let date = new Date(x.time);
                let getYear = date.getFullYear();
                let getMonth = date.getMonth() + 1;
                let newDate = `${getYear}-${getMonth}-1`;
                return dateConvert = [...dateConvert, newDate];
            }
            )
        }
        dateConvert.unshift("x");
        console.log('dateConvert', dateConvert);

        if (nextProps.data) {
            let valueConvert = Object.values(nextProps.data.flatMap(x => x.tasks).reduce((a, i) => {
                if (typeof i.value === 'number') {
                    a[i.code] = a[i.code] || [i.code];
                    a[i.code].push(i.value);
                }
                return a;
            }, {}));

            console.log('values', valueConvert);
            dataConvert = [...[dateConvert], ...valueConvert];
            console.log('dataConvert', dataConvert);
        }

        return {
            ...prevState,
            nameData: nextProps.nameData,
            data: dataConvert,
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
        console.log('datata', data)
        this.removePreviousChart();
        this.chart = c3.generate({
            bindto: this.refs.chart,
            data: {
                x: 'x',
                columns: data.data,
                hide: true,
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
                        rotate: -45,
                        multiline: false
                    },
                },
                y: {
                    tick: { outer: false },
                }
            },
        });

    }
    render() {
        const { lineBar, nameChart } = this.state;
        console.log('state', this.state);
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
