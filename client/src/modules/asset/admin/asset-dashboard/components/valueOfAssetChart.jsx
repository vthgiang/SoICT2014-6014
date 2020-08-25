import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';


class ValueOfAssetChart extends Component {
    constructor(props) {
        super(props);
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { translate } = this.props;

        let dataPieChart, valueOfBuilding = 0, valueOfVehicle = 0, valueOfMachine = 0, valueOfOrther = 0;
        let listAsset = this.props.listAssets;

        if (listAsset) {

            listAsset.map(asset => {
                switch (asset.group) {
                    case "Building":
                        valueOfBuilding += asset.cost;
                        break;
                    case "Vehicle":
                        valueOfVehicle += asset.cost;
                        break;
                    case "Machine":
                        valueOfMachine += asset.cost;
                        break;
                    case "Other":
                        valueOfOrther += asset.cost;
                        break;
                }
            });
        }

        dataPieChart = [
            ["Mặt bằng", valueOfBuilding],
            ["Phương tiện", valueOfVehicle],
            ["Máy móc", valueOfMachine],
            ["Khác", valueOfOrther],
        ];
        return dataPieChart;
    }


    // Khởi tạo PieChart bằng C3
    pieChart = () => {

        let dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: this.refs.valueOfAsset,

            data: {
                columns: dataPieChart,
                type: 'pie',
            },
            pie: {
                label: {
                    format: function (value) {
                        return value / 1000000 + " M";
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
                        let valueByUnit, unit;
                        if (value >= 1000000000) {
                            valueByUnit = Math.round(value / 1000000000);
                            unit = "B";
                        }
                        else {
                            valueByUnit = Math.round(value / 1000000);
                            unit = "M";
                        }
                        return valueByUnit + unit;
                    }
                }
            },
            legend: {
                show: true
            }
        });
    }
    render() {
        this.pieChart()
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <section ref="valueOfAsset"></section>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
}

const actions = {
}

const ValueOfAssetChartConnected = connect(mapState, actions)(withTranslate(ValueOfAssetChart));

export { ValueOfAssetChartConnected as ValueOfAssetChart }