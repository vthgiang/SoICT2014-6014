



import React, { Component } from 'react';

import ValueBarChart from './valueBarChart';

import * as d3 from 'd3-format';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Tree } from '../../../../../../../common-components';


class ValueTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: false,
            crrValue: false,
        }
    }

    handleChangeViewChart = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                tree: value
            }
        })
    }

    handleChangeViewCurrentValue = () => {
        this.setState({
            ...this.state,
            crrValue: !this.state.crrValue,
        })
    }

    render() {
        const { assetType, listAssets, translate, setValueOfAsset, depreciationOfAsset } = this.props;
        const { tree, crrValue } = this.state;
        let typeName = [], countAssetValue = [], idAssetType = [], currentValue = [];

        for (let i in assetType) {
            countAssetValue[i] = 0;
            idAssetType.push(assetType[i]._id)
        }

        let chart = [];
        if (listAssets) {
            listAssets.map(asset => {
                for (let k in asset.assetType) {
                    let idx = idAssetType.indexOf(asset.assetType[k]._id);
                    countAssetValue[idx] += asset.cost;
                }
            })
            if (crrValue) {
                if (depreciationOfAsset && depreciationOfAsset.length > 0) {
                    currentValue = countAssetValue.map((o, i) => o - depreciationOfAsset[i]);
                }
            }

            for (let i in assetType) {
                let val;
                if (crrValue) {
                    val = d3.format(",")(currentValue[i])
                } else {
                    val = d3.format(",")(countAssetValue[i])
                }

                let title = `${assetType[i].typeName} - ${val} `

                typeName.push(assetType[i].typeName);

                chart.push({
                    id: assetType[i]._id,
                    typeName: title,
                    parentId: assetType[i].parent,
                })
            }
        }

        let dataTree = chart && chart.map(node => {
            return {
                ...node,
                id: node.id,
                text: node.typeName,
                parent: node.parentId ? node.parentId.toString() : "#"
            }
        })

        return (
            <div className="value-asset" id="value-asset">
                {/* Chọn loại biểu đồ */}
                <div className="box-tools" style={{ marginBottom: '15px' }}>
                    <div className="btn-group value-asset-option">
                        <button type="button" className={`btn btn-xs ${crrValue ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewCurrentValue()}>Nguyên giá</button>
                        <button type="button" className={`btn btn-xs ${crrValue ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewCurrentValue()}>Giá trị hiện tại</button>
                    </div>
                    <div className="btn-group pull-right">
                        <button type="button" className={`btn btn-xs ${tree ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>{translate('asset.dashboard.bar_chart')}</button>
                        <button type="button" className={`btn btn-xs ${tree ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewChart(true)}>{translate('asset.dashboard.tree')}</button>
                    </div>
                </div>
                {
                    tree ?
                        <div>
                            <br />
                            {/* Cây giá trị tài sản */}
                            <Tree
                                id={`tree-qlcv-value-asset-${crrValue}`}
                                data={dataTree}
                                plugins={false}
                            />
                        </div> : <ValueBarChart
                            listAssets={listAssets}
                            assetType={assetType}
                            setValueOfAsset={setValueOfAsset}
                            depreciationOfAsset={depreciationOfAsset}
                            crrValue={crrValue}
                        />
                }
            </div>
        )
    }
}

export default withTranslate(ValueTree);