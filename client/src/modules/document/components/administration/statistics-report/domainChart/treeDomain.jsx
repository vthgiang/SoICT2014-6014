
import React, { Component, useState } from 'react';
import { connect } from 'react-redux';

import * as d3 from 'd3-format';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Tree } from '../../../../../../common-components';
import BarChartDomain from './barChartDomain';

function TreeDomain(props) {
    const [state, setState] = useState({
        tree: false
    })
    const handleChangeViewChart = (value) => {
        setState({
            ...state,
            tree: value
        })
    }
    const { documents, domains } = props;
    let { tree } = state;
    let typeName = [], countDomain = [], idDomain = [];
    let chart = [];
    for (let i in domains) {
        countDomain[i] = 0;
        idDomain.push(domains[i]._id)
    }
    if (documents) {
        documents.map(doc => {
            doc.domains.map(domain => {
                let idx = idDomain.indexOf(domain);
                countDomain[idx]++;
            })
        })
        for (let i in domains) {

            let val = d3.format(",")(countDomain[i])
            let title = `${domains[i].name} - ${val} `

            typeName.push(domains[i].name);

            chart.push({
                id: domains[i]._id,
                typeName: title,
                parentId: domains[i].parent,
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
                    <BarChartDomain
                        domains={domains}
                        docs={documents}
                    />
            }
        </div>
    )

}
export default TreeDomain;