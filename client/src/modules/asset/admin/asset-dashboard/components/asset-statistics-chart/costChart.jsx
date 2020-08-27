import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class CostChart extends Component {
    constructor(props) {
        super(props);
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { listAssets } = this.props;

        const { translate } = this.props;
        let dataPieChart, lessThanOneHundred = 0, oneHundred = 0, twoHundred = 0, fiveHundred = 0, oneBillion = 0, twoBillion = 0, fiveBillion = 0, tenBillion = 0;

        if (listAssets) {
            for (let i in listAssets) {
                let cost = listAssets[i].cost;

                if (cost < 100000000) {
                    lessThanOneHundred++;
                } else if (cost >= 100000000 && cost < 200000000) {
                    oneHundred++;
                } else if (cost >= 200000000 && cost < 500000000) {
                    twoHundred++;
                } else if (cost >= 500000000 && cost < 1000000000) {
                    fiveHundred++;
                } else if (cost >= 100000000 && cost < 2000000000) {
                    oneBillion++;
                } else if (cost >= 200000000 && cost < 5000000000) {
                    twoBillion++;
                } else if (cost >= 500000000 && cost < 10000000000) {
                    fiveBillion++;
                } else if (cost >= 10000000000) {
                    tenBillion++;
                }
            }
        }

        dataPieChart = [
            ["< 100.000.000", lessThanOneHundred],
            ["100.000.000 - 200.000.000", oneHundred],
            ["200.000.000 - 500.000.000", twoHundred],
            ["500.000.000 - 1.000.000.000", fiveHundred],
            ["1.000.000.000 - 2.000.000.000", oneBillion],
            ["2.000.000.000 - 5.000.000.000", twoBillion],
            ["5.000.000.000 - 10.000.000.000", fiveBillion],
            ["> 10.000.000.000", tenBillion],
        ];

        return dataPieChart;
    }

    // // Hàm xóa biểu đồ trước
    // removePreviousChart() {
    //     const chart = this.refs.chart;

    //     if (chart) {
    //         while (chart.hasChildNodes()) {
    //             chart.removeChild(chart.lastChild);
    //         }
    //     } 
    // }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: '#assetCost',

            data: {
                columns: dataPieChart,
                type: 'pie',
            },
            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            },
            padding: {
                top: 5,
                bottom: 5,
                right: 10,
                left: 10
            },
            tooltip: {
                format: {
                    title: function (d) {
                        return d;
                    },
                    value: function (value, ratio, id) {
                        return value;
                    }
                }
            },
            legend: {
                show: true
            }
        });
    }
    render() {
        const { translate } = this.props;
        const { listAssets } = this.props;

        console.log('call pie chart');
        this.pieChart();

        return (
            <React.Fragment>
                <div className="box-body qlcv" id="assetCostChart">
                    <section id="assetCost"></section>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
}

const actions = {
}

const AmountOfAssetChartConnected = connect(mapState, actions)(withTranslate(CostChart));

export { AmountOfAssetChartConnected as CostChart }