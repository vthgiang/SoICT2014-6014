
import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from 'd3-format';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DepreciationTree } from './depreciationTree';

class DepreciationBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChart: true
        }
    }

    componentDidMount() {
        if (this.refs.b) this.pieChart();
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
    setDataBarChart = () => {
        const { listAssets, assetType } = this.props;

        // let typeName = [], countAssetType = [], idAssetType = [];
        let countDepreciation = [], typeName = [], idAssetType = [];

        for (let i in assetType) {
            countDepreciation[i] = 0;
            idAssetType.push(assetType[i].id)
        }

        if (listAssets) {
            listAssets.map(asset => {
                let idx = idAssetType.indexOf(asset.assetType);
                countDepreciation[idx] += this.calculateDepreciation(asset.depreciationType, asset.cost, asset.usefulLife, asset.estimatedTotalProduction, asset.unitsProducedDuringTheYears, asset.startDepreciation) / 1000000;
            })
            for (let i in assetType) {
                typeName.push(assetType[i].title);
            }
        }

        let data = {
            count: countDepreciation,
            type: typeName
        }

        return data;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.b;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    //  // Khởi tạo BarChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataBarChart();
        // this.removePreviousChart();
        let count = dataPieChart.count;
        let heightCalc = dataPieChart.type.length * 24.8;
        let height = heightCalc < 320 ? 320 : heightCalc;
        let chart = c3.generate({
            bindto: this.refs.b,

            data: {
                columns: [count],
                type: 'bar',
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 0,
                left: 100
            },

            axis: {
                x: {
                    type: 'category',
                    categories: dataPieChart.type
                },

                y: {
                    label: {
                        text: 'Giá trị (Triệu)',
                        position: 'outer-right'
                    }
                },
                rotated: true
            },
            size: {
                height: height
            },

            color: {
                pattern: ['#1f77b4']
            },

            legend: {
                show: false
            }

        });
    }
    handleChangeViewChart = async (value) => {
        this.setState(state => {
            return {
                ...state,
                barChart: value
            }
        })
    }
    render() {
        const { assetType, listAssets } = this.props;
        const { barChart } = this.state;
        if (barChart) this.pieChart();
        return (
            <React.Fragment>
                <div className="box-tools pull-right">
                    <div className="btn-group pull-right">
                        <button type="button" className={`btn btn-xs ${!barChart ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(true)}>Bar chart</button>
                        <button type="button" className={`btn btn-xs ${!barChart ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewChart(false)}>Tree</button>
                    </div>
                </div>
                {barChart ? <div ref="b"></div> : <DepreciationTree
                    assetType={assetType}
                    listAssets={listAssets} />}

                {/* </div> */}
            </React.Fragment>
        )
    }
}

function mapState(state) { }

const actions = {}

const DepreciationBarChartConnected = connect(mapState, actions)(withTranslate(DepreciationBarChart));

export { DepreciationBarChartConnected as DepreciationBarChart }