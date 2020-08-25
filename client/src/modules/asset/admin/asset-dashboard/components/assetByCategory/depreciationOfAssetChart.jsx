
import React, { Component } from 'react';
import { connect } from 'react-redux';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Tree } from '../../../../../../common-components';
import c3 from 'c3';
import 'c3/c3.css';


class DepreciationOfAssetChart extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * Hàm để tính các giá trị khấu hao cho tài sản
     */
    calculateDepreciation = (depreciationType, cost, usefulLife, estimatedTotalProduction, unitsProducedDuringTheYears, startDepreciation) => {
        let annualDepreciation = 0, monthlyDepreciation = 0, remainingValue = cost;

        if (depreciationType === "Đường thẳng") { // Phương pháp khấu hao theo đường thẳng
            annualDepreciation = ((12 * cost) / usefulLife);
            monthlyDepreciation = cost / usefulLife;
            remainingValue = cost - (cost / usefulLife) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth()));

        } else if (depreciationType === "Số dư giảm dần") { // Phương pháp khấu hao theo số dư giảm dần
            let lastYears = false,
                t,
                usefulYear = usefulLife / 12,
                usedTime = (new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth());

            if (usefulYear < 4) {
                t = (1 / usefulYear) * 1.5;
            } else if (usefulYear >= 4 && usefulYear <= 6) {
                t = (1 / usefulYear) * 2;
            } else if (usefulYear > 6) {
                t = (1 / usefulYear) * 2.5;
            }

            // Tính khấu hao đến năm hiện tại
            for (let i = 1; i <= usedTime / 12; i++) {
                if (!lastYears) {
                    if (remainingValue * t > (remainingValue / (usefulYear - i + 1))) {
                        annualDepreciation = remainingValue * t;
                    } else {
                        annualDepreciation = (remainingValue / (usefulYear - i + 1));
                        lastYears = true;
                    }
                }

                remainingValue = remainingValue - annualDepreciation;
            }

            // Tính khấu hao đến tháng hiện tại
            if (usedTime % 12 !== 0) {
                if (!lastYears) {
                    if (remainingValue * t > (remainingValue / (usefulYear - Math.floor(usedTime / 12)))) {
                        annualDepreciation = remainingValue * t;
                    } else {
                        annualDepreciation = (remainingValue / (usefulYear - Math.floor(usedTime / 12)));
                        lastYears = true;
                    }
                }

                monthlyDepreciation = annualDepreciation / 12;
                remainingValue = remainingValue - (monthlyDepreciation * (usedTime % 12))
            }

        } else if (depreciationType === "Sản lượng") { // Phương pháp khấu hao theo sản lượng
            let monthTotal = unitsProducedDuringTheYears.length; // Tổng số tháng tính khấu hao
            let productUnitDepreciation = cost / (estimatedTotalProduction * (usefulLife / 12)); // Mức khấu hao đơn vị sản phẩm
            let accumulatedDepreciation = 0; // Giá trị hao mòn lũy kế

            for (let i = 0; i < monthTotal; i++) {
                accumulatedDepreciation += unitsProducedDuringTheYears[i].unitsProducedDuringTheYear * productUnitDepreciation;
            }

            remainingValue = cost - accumulatedDepreciation;
            annualDepreciation = monthTotal ? accumulatedDepreciation * 12 / monthTotal : 0;
        }
        // console.log('cost', parseInt(cost - remainingValue));
        return parseInt(cost - remainingValue);
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { translate } = this.props;

        let dataPieChart, depreciationExpenseOfBuilding = 0, depreciationExpenseOfVehicle = 0, depreciationExpenseOfMachine = 0, depreciationExpenseOfOrther = 0;
        let { listAssets } = this.props;
        let depreciationOfAsset = [];

        if (listAssets) {
            for (let i in listAssets) {

                depreciationOfAsset.push({
                    name: listAssets[i].assetName,
                    type: listAssets[i].assetType,
                    group: listAssets[i].group,
                    depreciationExpense: this.calculateDepreciation(listAssets[i].depreciationType, listAssets[i].cost, listAssets[i].usefulLife, listAssets[i].estimatedTotalProduction, listAssets[i].unitsProducedDuringTheYears, listAssets[i].startDepreciation)
                })
            }
        }
        if (depreciationOfAsset.length) {
            depreciationOfAsset.map(asset => {
                switch (asset.group) {
                    case "Building":
                        depreciationExpenseOfBuilding += asset.depreciationExpense;
                        break;
                    case "Vehicle":
                        depreciationExpenseOfVehicle += asset.depreciationExpense;
                        break;
                    case "Machine":
                        depreciationExpenseOfMachine += asset.depreciationExpense;
                        break;
                    case "Other":
                        depreciationExpenseOfOrther += asset.depreciationExpense;
                        break;
                }
            });
        }

        dataPieChart = [
            ["Mặt bằng", depreciationExpenseOfBuilding > 0 ? depreciationExpenseOfBuilding : 0],
            ["Phương tiện", depreciationExpenseOfVehicle],
            ["Máy móc", depreciationExpenseOfMachine],
            ["Khác", depreciationExpenseOfOrther],
        ];
        return dataPieChart;
    }


    // Khởi tạo PieChart bằng C3
    pieChart = () => {

        let dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: this.refs.depreciationExpenseOfAsset,

            data: {
                columns: dataPieChart,
                type: 'pie',
            },
            pie: {
                label: {
                    format: function (value) {
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
        const { displayBy, assetType, listAssets } = this.props;
        let countDepreciation = [], idAssetType = [];
        let dataTree;
        if (displayBy == "Group") {
            this.pieChart();
        }
        else {
            for (let i in assetType) {
                countDepreciation[i] = 0;
                idAssetType.push(assetType[i].id)
            }

            let chart = [];
            if (listAssets) {
                listAssets.map(asset => {
                    let idx = idAssetType.indexOf(asset.assetType);
                    countDepreciation[idx] += this.calculateDepreciation(asset.depreciationType, asset.cost, asset.usefulLife, asset.estimatedTotalProduction, asset.unitsProducedDuringTheYears, asset.startDepreciation);
                })
                for (let i in assetType) {
                    let val = countDepreciation[i]
                    let title = `${assetType[i].title} - ${val} `
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
                <div className="box-body qlcv">
                    {
                        displayBy == "Group" ?
                            <section ref="depreciationExpenseOfAsset"></section>
                            : <Tree
                                id="tree-qlcv-depreciation-by-type"
                                // onChanged={this.onChanged}
                                data={dataTree}
                                plugins={false}
                            />
                    }
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
}

const actions = {
}

const DepreciationOfAssetChartConnected = connect(mapState, actions)(withTranslate(DepreciationOfAssetChart));

export { DepreciationOfAssetChartConnected as DepreciationOfAssetChart }
