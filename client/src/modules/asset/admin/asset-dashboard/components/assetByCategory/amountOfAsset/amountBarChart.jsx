
import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from 'd3-format';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { AmountTree } from './amountTree';
class AmountBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChart: true
        }
    }

    componentDidMount() {
        console.log('run did mount');
        this.pieChart();
    }

    // Thiết lập dữ liệu biểu đồ
    setDataBarChart = () => {
        const { listAssets, assetType } = this.props;

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

                // let val = d3.format(",")(countAssetType[i])
                // let title = `${assetType[i].title} - ${val} `

                typeName.push(assetType[i].title);

                // chart.push({
                //     id: assetType[i].id,
                //     typeName: title,
                //     parentId: assetType[i].parent_id,
                // })
            }
        }
        let data = {
            count: countAssetType,
            type: typeName
        }

        return data;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.a;
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
            bindto: this.refs.a,

            data: {
                columns: [count],
                type: 'bar',
            },

            padding: {
                top: 10,
                bottom: 20,
                right: 0,
                left: 100
            },

            axis: {
                x: {
                    type: 'category',
                    categories: dataPieChart.type
                },
                y: {
                    label: {
                        text: 'Số lượng',
                        position: 'outer-right'
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
        console.log('render');
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


                {
                    barChart ? <div ref="a"></div> :
                        <AmountTree
                            assetType={assetType}
                            listAssets={listAssets} />
                }
            </React.Fragment>
        )
    }
}

function mapState(state) { }

const actions = {}

const AmountBarChartConnected = connect(mapState, actions)(withTranslate(AmountBarChart));

export { AmountBarChartConnected as AmountBarChart }