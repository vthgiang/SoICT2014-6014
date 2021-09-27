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
        const { translate, getAssetStatusData, listAssets ,chartAsset,statisticAsset} = this.props;
        const { type } = this.state;
        let filterAsset = {
            numberOfInUse : [],
            numberOfBroken : [],
            numberOfReadyToUse : [],
            numberOfLost : [],
            numberOfDisposed : []
        }, dataPieChart, numberOfReadyToUses = 0, numberOfInUses = 0, numberOfBrokens = 0, numberOfLosts = 0, numberOfDisposeds = 0;
        if (statisticAsset){
            let assetList = statisticAsset.statusOfAsset
            console.log("assetList",assetList)
            if (type && type.length){
                type.map((i)=>{
                    let index = assetList.idAssetTypes?.indexOf(i);
                    filterAsset.numberOfReadyToUse.push(assetList.numberOfReadyToUse[index]);
                    filterAsset.numberOfBroken.push(assetList.numberOfBroken[index]);
                    filterAsset.numberOfInUse.push(assetList.numberOfInUse[index]);
                    filterAsset.numberOfLost.push(assetList.numberOfLost[index]);
                    filterAsset.numberOfDisposed.push(assetList.numberOfDisposed[index]);
                })
            } else{
                filterAsset = assetList;
            }
           
            for (let i in filterAsset.numberOfReadyToUse){
                numberOfReadyToUses += filterAsset.numberOfReadyToUse[i]
            }
            for (let i in filterAsset.numberOfReadyToUse){
                numberOfInUses += filterAsset.numberOfInUse[i]
            }
            for (let i in filterAsset.numberOfReadyToUse){
                numberOfBrokens += filterAsset.numberOfBroken[i]
            }
            for (let i in filterAsset.numberOfReadyToUse){
                numberOfLosts += filterAsset.numberOfLost[i]
            }
            for (let i in filterAsset.numberOfReadyToUse){
                numberOfDisposeds += filterAsset.numberOfDisposed[i]
            }
        }
        dataPieChart = [
            [translate('asset.general_information.ready_use'), numberOfReadyToUses],
            [translate('asset.general_information.using'), numberOfInUses],
            [translate('asset.general_information.damaged'), numberOfBrokens],
            [translate('asset.general_information.lost'), numberOfLosts],
            [translate('asset.general_information.disposal'), numberOfDisposeds],
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
                type: 'donut',
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