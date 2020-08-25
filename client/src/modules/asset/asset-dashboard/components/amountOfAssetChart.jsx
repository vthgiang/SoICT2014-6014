import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';


class AmountOfAssetChart extends Component {
    constructor(props) {
        super(props);

    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { translate } = this.props;
        const { displayBy, assetType } = this.props;
        console.log('ass', assetType);
        let dataPieChart, numberOfBuilding = 0, numberOfVehicle = 0, numberOfMachine = 0, numberOfOrther = 0;
        let listAsset = this.props.listAssets;
        let countAssetType = [], idAssetType = [];

        for (let i in assetType) {
            countAssetType[i] = 0;
            idAssetType.push(assetType[i].id)
        }

        if (displayBy === "Group") {
            if (listAsset) {
                console.log('listas', listAsset);
                listAsset.map(asset => {
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
        }
        else {
            let chart = [];
            if (listAsset) {
                listAsset.map(asset => {
                    let idx = idAssetType.indexOf(asset.assetType);
                    countAssetType[idx]++;
                })
                for (let i in assetType) {
                    let typeName = assetType[i].title;
                    chart.push([typeName, countAssetType[i]])
                }
            }
            console.log('heloooooooooooooo', chart);
        }
        return dataPieChart;
    }


    // Khởi tạo PieChart bằng C3
    pieChart = () => {

        let dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: this.refs.amountOfAsset,

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
        this.pieChart()
        return (
            <React.Fragment>
                <div className="box-body qlcv">

                    <section ref="amountOfAsset"></section>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
}

const actions = {
}

const AmountOfAssetChartConnected = connect(mapState, actions)(withTranslate(AmountOfAssetChart));

export { AmountOfAssetChartConnected as AmountOfAssetChart }