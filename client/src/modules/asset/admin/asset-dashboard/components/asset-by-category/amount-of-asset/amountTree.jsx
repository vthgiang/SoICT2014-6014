



import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from 'd3-format';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Tree } from '../../../../../../../common-components';

class AmountTree extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let { assetType, listAssets } = this.props;

        let typeName = [], countAssetType = [], idAssetType = [];
        for (let i in assetType) {
            countAssetType[i] = 0;
            idAssetType.push(assetType[i].id)
        }

        let chart = [];
        if (listAssets) {
            listAssets.map(asset => {
                let idx = idAssetType.indexOf(asset.assetType);
                countAssetType[idx]++;
            })
            for (let i in assetType) {

                let val = d3.format(",")(countAssetType[i])
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
        return (
            <div className="amout-asset" id="amout-asset">
                <br />

                <Tree
                    id="tree-qlcv-amout-asset"
                    data={dataTree}
                    plugins={false}
                />
            </div>
        )
    }
}

function mapState(state) { }

const actions = {}

const AmountTreeConnected = connect(mapState, actions)(withTranslate(AmountTree));

export { AmountTreeConnected as AmountTree }