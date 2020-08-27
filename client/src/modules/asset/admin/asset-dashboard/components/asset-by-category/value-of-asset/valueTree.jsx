



import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from 'd3-format';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Tree } from '../../../../../../../common-components';

class ValueTree extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let { assetType, listAssets } = this.props;

        let typeName = [], countAssetValue = [], idAssetType = [];
        for (let i in assetType) {
            countAssetValue[i] = 0;
            idAssetType.push(assetType[i].id)
        }

        let chart = [];
        if (listAssets) {
            listAssets.map(asset => {
                let idx = idAssetType.indexOf(asset.assetType);
                countAssetValue[idx] += asset.cost;
            })
            for (let i in assetType) {

                let val = d3.format(",")(countAssetValue[i])
                let title = `${assetType[i].title} - ${val} `

                typeName.push(assetType[i].title);

                chart.push({
                    id: assetType[i].id,
                    typeName: title,
                    parentId: assetType[i].parent_id,
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
        console.log('treee', dataTree);
        return (
            <div className="value-asset" id="value-asset">
                <br />
                <Tree
                    id="tree-qlcv-value-asset"
                    data={dataTree}
                    plugins={false}
                />
            </div>
        )
    }
}

function mapState(state) { }

const actions = {}

const ValueTreeConnected = connect(mapState, actions)(withTranslate(ValueTree));

export { ValueTreeConnected as ValueTree }