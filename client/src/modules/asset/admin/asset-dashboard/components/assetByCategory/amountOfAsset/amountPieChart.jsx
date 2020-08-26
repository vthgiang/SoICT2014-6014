import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from 'd3-format';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Tree } from '../../../../../../../common-components';


class AmountPieChart extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
        if (this.refs.amountPieChart) this.pieChart();
    }
    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { listAssets } = this.props;

        const { translate } = this.props;
        let dataPieChart, numberOfBuilding = 0, numberOfVehicle = 0, numberOfMachine = 0, numberOfOrther = 0;

        if (listAssets) {
            listAssets.map(asset => {
                switch (asset.group) {
                    case "Building":
                        numberOfBuilding++;
                        break;
                    case "Vehicle":
                        numberOfVehicle++;
                        break;
                    case "Machine":
                        numberOfMachine++;
                        break;
                    case "Other":
                        numberOfOrther++;
                        break;
                }
            });
        }

        dataPieChart = [
            ["Mặt bằng", numberOfBuilding],
            ["Phương tiện", numberOfVehicle],
            ["Máy móc", numberOfMachine],
            ["Khác", numberOfOrther],
        ];

        return dataPieChart;
    }
    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.amountPieChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {

        let dataPieChart = this.setDataPieChart();
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.amountPieChart,

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
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },
            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value, ratio, id) {

                        return value;
                    }
                    //            value: d3.format(',') // apply this format to both y and y2
                }
            },
            legend: {
                show: true
            }
        });
    }

    render() {
        this.pieChart();
        // console.log('render ');
        return (
            <React.Fragment>
                <section ref="amountPieChart"></section>
            </React.Fragment>
        )
    }
}

function mapState(state) { }

const actions = {}

const AmountPieChartConnected = connect(mapState, actions)(withTranslate(AmountPieChart));

export { AmountPieChartConnected as AmountPieChart }