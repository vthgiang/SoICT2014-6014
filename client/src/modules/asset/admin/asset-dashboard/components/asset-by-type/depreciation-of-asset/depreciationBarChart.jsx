import React, { Component } from 'react';
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
class DepreciationBarChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.barChart();
    }

    setDataBarChart = () => {
        const {  setDepreciationOfAsset, translate, listAssetsAmount } = this.props;
        let countDepreciation = listAssetsAmount.countAssetDepreciation, typeName = listAssetsAmount.typeName, shortName = listAssetsAmount.shortName, idAssetType = listAssetsAmount.idAssetType;

        let countDepreciationShow =  [translate('asset.dashboard.lost_value')].concat(countDepreciation)
        let data = {
            count: countDepreciationShow,
            type: typeName,
            shortName: shortName
        }

        if (listAssetsAmount  && setDepreciationOfAsset) {
            setDepreciationOfAsset(data);
        }

        return data;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.depreciationBarChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    // Khởi tạo BarChart bằng C3
    barChart = () => {
        let { translate } = this.props;
        let dataPieChart = this.setDataBarChart();
        let count = dataPieChart.count;
        let heightCalc = dataPieChart.type.length * 24.8;
        let height = heightCalc < 320 ? 320 : heightCalc;

        let chart = c3.generate({
            bindto: this.refs.depreciationBarChart,

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
                    categories: dataPieChart.shortName,
                    tick: {
                        multiline: false
                    }
                },

                y: {
                    label: {
                        text: translate('asset.dashboard.lost_value'),
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
        this.barChart();
        return (
            <React.Fragment>
                <div ref="depreciationBarChart"></div>
            </React.Fragment>
        )
    }
}

export default withTranslate(DepreciationBarChart);