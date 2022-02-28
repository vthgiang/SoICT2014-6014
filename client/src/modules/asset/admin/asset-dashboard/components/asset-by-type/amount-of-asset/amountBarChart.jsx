
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class AmountBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.barChart();
    }

    // Thiết lập dữ liệu biểu đồ
    setDataBarChart = () => {
        const {  setAmountOfAsset, translate ,listAssetsAmount } = this.props;
        let typeName = listAssetsAmount.typeName, shortName = listAssetsAmount.shortName, countAssetType = listAssetsAmount.countAssetType, idAssetType = listAssetsAmount.idAssetType;
        let countAssetTypeShow = [translate('asset.dashboard.amount')].concat(countAssetType);

        let data = {
            count: countAssetTypeShow,
            type: typeName,
            shortName: shortName
        }

        if (setAmountOfAsset && listAssetsAmount) {
            
            setAmountOfAsset(data);
        }
        return data;
    }

    // Khởi tạo BarChart bằng C3
    barChart = () => {
        let { translate } = this.props;
        let dataBarChart = this.setDataBarChart();
        let count = dataBarChart.count;
        let heightCalc = dataBarChart.type.length * 24.8;
        let height = heightCalc < 320 ? 320 : heightCalc;
        c3.generate({
            bindto: this.refs.amountBarChart,

            data: {
                columns: [count],
                type: 'bar',
                labels: true,
            },

            padding: {
                bottom: 20,
                right: 20
            },

            axis: {
                x: {
                    type: 'category',
                    categories: dataBarChart.shortName,
                    tick: {
                        multiline: false
                    }
                },
                y: {
                    label: {
                        text: translate('asset.dashboard.amount'),
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
                    title: function (index) { return dataBarChart.type[index] },

                }
            }
        });
    }

    render() {
        this.barChart();
        return (
            <React.Fragment>
                <div ref="amountBarChart"></div>
            </React.Fragment>
        )
    }
}

export default (withTranslate(AmountBarChart));