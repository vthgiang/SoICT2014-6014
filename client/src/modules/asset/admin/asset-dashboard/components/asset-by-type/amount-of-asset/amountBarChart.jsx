
import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from 'd3-format';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { AmountTree } from './amountTree';
class AmountBarChart extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
        this.pieChart();
        console.log('Goi did mount');
    }

    // Thiết lập dữ liệu biểu đồ
    setDataBarChart = () => {
        const { listAssets, assetType } = this.props;

        let typeName = [], shortName = [], countAssetType = [], idAssetType = [];
        for (let i in assetType) {
            countAssetType[i] = 0;
            idAssetType.push(assetType[i]._id)
        }

        let chart = [];
        if (listAssets) {
            listAssets.map(asset => {
                let idx = idAssetType.indexOf(asset.assetType);
                countAssetType[idx]++;
            })
            for (let i in assetType) {
                let longName = assetType[i].typeName.slice(0, 20) + "...";
                let name = assetType[i].typeName.length > 20 ? longName : assetType[i].typeName;
                shortName.push(name);
                typeName.push(assetType[i].typeName);

            }
        }
        let data = {
            count: countAssetType,
            type: typeName,
            shortName: shortName
        }

        return data;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.a;
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
            bindto: this.refs.a,

            data: {
                columns: [count],
                type: 'bar',
            },

            padding: {
                bottom: 20,
                right: 20
            },

            axis: {
                x: {
                    type: 'category',
                    categories: dataPieChart.shortName,
                    tick: {
                        multiline: false
                    }
                },
                y: {
                    label: {
                        text: 'Số lượng',
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
            },

            tooltip: {
                format: {
                    title: function (index) { return dataPieChart.type[index] },

                }
            }
        });
    }

    render() {
        this.pieChart();
        return (
            <React.Fragment>
                <div ref="a"></div>
            </React.Fragment>
        )
    }
}

export default AmountBarChart;