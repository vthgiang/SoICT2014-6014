import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Tree } from '../../../../../common-components';
import { createElement } from 'react';


class AmountOfAssetChart extends Component {
    constructor(props) {
        super(props);

    }
    // shouldComponentUpdate() {
    //     let d = document.getElementById("amountOfAsset");
    //     console.log('aaaaaaaaaaaaaaaaaa', d);
    //     if (d) return false;
    //     else return true;
    // }
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


    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataPieChart();
        let d = document.getElementById("amountOfAsset")
        let c = document.getElementById("amountOfAssetChart")
        console.log('c: ', c);
        if (c) console.log('d: ', c.childNodes[0]);
        if (!d) {

        };
        this.chart = c3.generate({
            bindto: '#amountOfAsset',

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
        const { displayBy, assetType, listAssets } = this.props;
        let countAssetType = [], idAssetType = [];


        let dataTree;
        if (displayBy == "Group") {
            console.log('call pie chart');
            this.pieChart();
        }
        else {
            for (let i in assetType) {
                countAssetType[i] = 0;
                idAssetType.push(assetType[i].id)
            }

            let chart = [];
            if (listAssets) {
                listAssets.map(asset => {
                    let idx = idAssetType.indexOf(asset.assetType);
                    countAssetType[idx]++;
                })
                for (let i in assetType) {
                    let title = `${assetType[i].title} (${countAssetType[i]})`
                    chart.push({
                        id: assetType[i].id,
                        typeName: title,
                        parentId: assetType[i].parent_id,
                    })
                }
            }

            dataTree = chart && chart.map(node => {
                return {
                    ...node,
                    id: node.id,
                    text: node.typeName,
                    amount: node.count,
                    parent: node.parentId ? node.parentId.toString() : "#"
                }
            })
        }
        return (
            <React.Fragment>
                <div className="box-body qlcv" id="amountOfAssetChart">
                    {/* { */}
                    {/* // displayBy == "Group" ? */}
                    {displayBy === "Group" && <section id="amountOfAsset"></section>}
                    <Tree
                        id="tree-qlcv-amount-by-type"
                        data={dataTree}
                        plugins={false}
                    />



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