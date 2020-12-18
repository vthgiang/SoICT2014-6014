import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { TreeSelect } from '../../../../../../common-components';

class StautsChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: [],
        }
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { translate, getAssetStatusData, listAssets } = this.props;
        const { type } = this.state;

        let filterAsset = [], dataPieChart, numberOfReadyToUse = 0, numberOfInUse = 0, numberOfBroken = 0, numberOfLost = 0, numberOfDisposed = 0;

        if (type && type.length) {
            listAssets.map(x => {
                if (x.assetType.length) {
                    for (let i in x.assetType) {
                        for (let j in type) {
                            type[j] === x.assetType[i]._id && filterAsset.push(x);
                        }
                    }
                }
            })
        }
        else {
            filterAsset = listAssets;
        }

        if (filterAsset) {
            for (let i in filterAsset) {
                switch (filterAsset[i].status) {
                    case "ready_to_use":
                        numberOfReadyToUse++;
                        break;
                    case "in_use":
                        numberOfInUse++;
                        break;
                    case "broken":
                        numberOfBroken++;
                        break;
                    case "lost":
                        numberOfLost++;
                        break;
                    case "disposed":
                        numberOfDisposed++;
                        break;
                }
            }
        }

        dataPieChart = [
            [translate('asset.general_information.ready_use'), numberOfReadyToUse],
            [translate('asset.general_information.using'), numberOfInUse],
            [translate('asset.general_information.damaged'), numberOfBroken],
            [translate('asset.general_information.lost'), numberOfLost],
            [translate('asset.general_information.disposal'), numberOfDisposed],
        ];

        if (getAssetStatusData && listAssets) {
            getAssetStatusData(dataPieChart, type);
        }

        return dataPieChart;
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataPieChart();

        this.chart = c3.generate({
            bindto: '#assetStatus',

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
                    title: function (d) {
                        return d;
                    },
                    value: function (value, ratio, id) {
                        return value;
                    }
                }
            },
            legend: {
                show: true
            }
        });
    }

    getAssetTypes = () => {
        let { assetType } = this.props;
        // let assetTypeName = assetType && assetType.listAssetTypes;
        let typeArr = [];
        assetType && assetType.map(item => {
            typeArr.push({
                _id: item._id,
                id: item._id,
                name: item.typeName,
                parent: item.parent ? item.parent._id : null
            })
        })
        return typeArr;
    }

    handleChangeTypeAsset = (value) => {
        if (value.length === 0) {
            value = []
        }

        this.setState({
            ...this.state,
            type: value
        })

    }
    render() {
        const { translate } = this.props;
        const { type } = this.state;
        let typeArr = this.getAssetTypes();

        this.pieChart();

        return (
            <React.Fragment>
                <div className="form-group " style={{ width: "100%" }}>
                    <label style={{ minWidth: "fit-content", marginRight: "10px" }}>{translate('asset.general_information.asset_type')}</label>
                    <TreeSelect
                        data={typeArr}
                        value={type}
                        handleChange={this.handleChangeTypeAsset}
                        mode="hierarchical"
                    />
                </div>
                <div className="box-body qlcv" id="assetStatusChart">
                    <section id="assetStatus"></section>
                </div>
            </React.Fragment>
        )
    }
}

const StautsChartConnected = connect(null, null)(withTranslate(StautsChart));

export { StautsChartConnected as StautsChart }