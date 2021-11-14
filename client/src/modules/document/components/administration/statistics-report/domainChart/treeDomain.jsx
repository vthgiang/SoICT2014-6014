import React, { Component, useState } from 'react';
import * as d3 from 'd3-format';
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
    const { documents, domains ,chartDomain} = props;
    let { tree } = state;
    let typeName = [], countDomain = [], idDomain = [];
    let chart = [];
    if (chartDomain){
        for (let i in chartDomain.dataTree.domains.list) {

            let val = d3.format(",")(chartDomain.dataTree.countDomain[i])
            let title = `${chartDomain.dataTree.domains.list[i].name} - ${val} `

            typeName.push(chartDomain.dataTree.domains.list[i].name);

            chart.push({
                id: chartDomain.dataTree.domains.list[i]._id,
                typeName: title,
                parentId: chartDomain.dataTree.domains.list[i].parent,
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
                        data = {chartDomain}
                    />
            }
        </div>
    )

}
export default TreeDomain;