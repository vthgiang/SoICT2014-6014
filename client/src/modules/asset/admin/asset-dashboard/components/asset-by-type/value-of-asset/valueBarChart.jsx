
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class ValueBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChart: true
        }
    }

    componentDidMount() {
        this.barChart();
    }

    // Thiết lập dữ liệu biểu đồ
    setDataBarChart = () => {
        const { setValueOfAsset, translate, depreciationOfAsset, crrValue, listAssetsAmount } = this.props;

        let typeName = [], shortName = [], countAssetValue = [], idAssetType = [], currentValue = [];
        let countAssetValueShow
        if (listAssetsAmount) {
            typeName = listAssetsAmount.typeName
            shortName = listAssetsAmount.shortName
            countAssetValue = listAssetsAmount.countAssetValue
            idAssetType = listAssetsAmount.idAssetType
            if (crrValue) {
                if (depreciationOfAsset && depreciationOfAsset.length > 0) {
                    currentValue = countAssetValue.map((o, i) => o - (depreciationOfAsset[i] / 1000000));
                }
                currentValue.unshift(translate('asset.dashboard.sum_value'));
            } else {
                countAssetValueShow=  [translate('asset.dashboard.sum_value')].concat(countAssetValue)
            }
           
        }

        let data = {
            count: crrValue ? currentValue : countAssetValueShow,
            type: typeName,
            shortName: shortName
        }

        if (listAssetsAmount && setValueOfAsset) {
            setValueOfAsset(data);
        }
        return data;
    }

    // Khởi tạo BarChart bằng C3
    barChart = () => {
        let { translate } = this.props;
        let dataPieChart = this.setDataBarChart();
        let count = dataPieChart.count;
        let heightCalc = dataPieChart.type.length * 24.8;
        let height = heightCalc < 320 ? 320 : heightCalc;
        let chart = c3.generate({
            bindto: this.refs.valueBarChart,
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
                    fit: true,
                    type: 'category',
                    categories: dataPieChart.shortName,
                    tick: {
                        multiline: false,

                    }
                },
                y: {
                    label: {
                        text: translate('asset.dashboard.sum_value'),
                        position: 'outer-right',
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
        this.barChart();
        return (
            <React.Fragment>

                <div ref="valueBarChart"></div>
            </React.Fragment>
        )
    }
}

export default withTranslate(ValueBarChart);