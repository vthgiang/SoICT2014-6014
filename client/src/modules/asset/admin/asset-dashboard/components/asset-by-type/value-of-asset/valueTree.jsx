



import React, { Component } from 'react';

import ValueBarChart from './valueBarChart';

import * as d3 from 'd3-format';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Tree } from '../../../../../../../common-components';


class ValueTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: false
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

    render() {
        let { assetType, listAssets } = this.props;
        let { tree } = this.state;
        let typeName = [], countAssetValue = [], idAssetType = [];

        for (let i in assetType) {
            countAssetValue[i] = 0;
            idAssetType.push(assetType[i]._id)
        }

        let chart = [];
        if (listAssets) {
            listAssets.map(asset => {
                let idx = idAssetType.indexOf(asset.assetType);
                countAssetValue[idx] += asset.cost;
            })
            for (let i in assetType) {

                let val = d3.format(",")(countAssetValue[i])
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
                <div className="box-tools pull-right">
                    <div className="btn-group pull-right">
                        <button type="button" className={`btn btn-xs ${tree ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Bar chart</button>
                        <button type="button" className={`btn btn-xs ${tree ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Tree</button>
                    </div>
                </div>
                {
                    tree ?
                        <div>
                            <br />
                            <Tree
                                id="tree-qlcv-value-asset"
                                data={dataTree}
                                plugins={false}
                            />
                        </div> : <ValueBarChart
                            listAssets={listAssets}
                            assetType={assetType}
                        />
                }
            </div>
        )
    }
}

export default ValueTree;