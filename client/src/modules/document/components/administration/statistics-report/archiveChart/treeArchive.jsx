
import React, { Component, useState } from 'react';
import { connect } from 'react-redux';

import * as d3 from 'd3-format';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Tree } from '../../../../../../common-components';
import BarChartArchive from './barChartArchive';

function TreeArchive(props) {
    const [state, setState] = useState({
        tree: false
    })

    const handleChangeViewChart = (value) => {
        setState({
            ...state,
            tree: value
        })
    }
    const { documents, archives } = props;
    let { tree } = state;
    let typeName = [], countArchive = [], idArchive = [];
    let chart = [];
    for (let i in archives) {
        countArchive[i] = 0;
        idArchive.push(archives[i]._id)
    }
    if (documents) {
        documents.map(doc => {
            doc.archives.map(archive => {
                let idx = idArchive.indexOf(archive);
                countArchive[idx]++;
            })
        })
        for (let i in archives) {

            let val = d3.format(",")(countArchive[i])
            let title = `${archives[i].name} - ${val} `

            typeName.push(archives[i].name);

            chart.push({
                id: archives[i]._id,
                typeName: title,
                parentId: archives[i].parent,
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
        <div className="amout-docs" id="amout-docs">
            <br />
            <div className="box-tools pull-right">
                <div className="btn-group pull-right">
                    <button type="button" className={`btn btn-xs ${tree ? "active" : "btn-danger"}`} onClick={() => handleChangeViewChart(false)}>Bar chart</button>
                    <button type="button" className={`btn btn-xs ${tree ? "btn-danger" : "active"}`} onClick={() => handleChangeViewChart(true)}>Tree</button>
                </div>
            </div>
            {
                tree ?
                    <div>
                        <br />
                        <Tree
                            id="tree-qlcv-amount-docs"
                            data={dataTree}
                            plugins={false}
                        />
                    </div> :
                    <BarChartArchive
                        archives={archives}
                        docs={documents}
                    />
            }
        </div>
    )
}
export default TreeArchive;