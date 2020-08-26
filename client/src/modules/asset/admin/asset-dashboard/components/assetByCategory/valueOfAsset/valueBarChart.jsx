
import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from 'd3-format';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ValueTree } from './valueTree';

class ValueBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChart: true
        }
    }

    componentDidMount() {
        if (this.refs.c) this.pieChart();
    }

    // Thiết lập dữ liệu biểu đồ
    setDataBarChart = () => {
        const { listAssets, assetType } = this.props;

        let typeName = [], shortName = [], countAssetValue = [], idAssetType = [];
        for (let i in assetType) {
            countAssetValue[i] = 0;
            idAssetType.push(assetType[i].id)
        }

        let chart = [];
        if (listAssets) {
            listAssets.map(asset => {
                let idx = idAssetType.indexOf(asset.assetType);
                countAssetValue[idx] += asset.cost / 1000000;
            })
            for (let i in assetType) {

                // let val = d3.format(",")(countAssetValue[i])
                // let title = `${assetType[i].title} - ${val} `
                let longName = assetType[i].title.slice(0, 15) + "...";
                let name = assetType[i].title.length > 15 ? longName : assetType[i].title;
                shortName.push(name);
                typeName.push(assetType[i].title);

                // chart.push({
                //     id: assetType[i].id,
                //     typeName: title,
                //     parentId: assetType[i].parent_id,
                // })
            }
        }
        let data = {
            count: countAssetValue,
            type: typeName,
            shortName: shortName
        }

        return data;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.c;
        if (chart) {
            console.log('c');
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    //  // Khởi tạo BarChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataBarChart();
        // this.removePreviousChart();
        let count = dataPieChart.count;
        let heightCalc = dataPieChart.type.length * 24.8;
        let height = heightCalc < 320 ? 320 : heightCalc;
        let chart = c3.generate({
            bindto: this.refs.c,

            data: {
                columns: [count],
                type: 'bar',
            },

            padding: {
                top: 0,
                bottom: 20,
                right: 0,
                left: 100
            },

            axis: {
                x: {
                    fit: true,
                    type: 'category',
                    categories: dataPieChart.shortName,
                    tick: {
                        multiline: false,

                    }
                },
                y: {
                    label: {
                        text: 'Giá trị (Triệu)',
                        position: 'outer-right',
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
    handleChangeViewChart = async (value) => {
        this.setState(state => {
            return {
                ...state,
                barChart: value
            }
        })
    }
    render() {
        const { assetType, listAssets } = this.props;
        const { barChart } = this.state;
        if (barChart) this.pieChart();
        return (
            <React.Fragment>
                <div className="box-tools pull-right">
                    <div className="btn-group pull-right">
                        <button type="button" className={`btn btn-xs ${!barChart ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(true)}>Bar chart</button>
                        <button type="button" className={`btn btn-xs ${!barChart ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewChart(false)}>Tree</button>
                    </div>
                </div>
                {barChart ? <div ref="c"></div> : <ValueTree
                    assetType={assetType}
                    listAssets={listAssets} />}

                {/* </div> */}
            </React.Fragment>
        )
    }
}

function mapState(state) { }

const actions = {}

const ValueBarChartConnected = connect(mapState, actions)(withTranslate(ValueBarChart));

export { ValueBarChartConnected as ValueBarChart }