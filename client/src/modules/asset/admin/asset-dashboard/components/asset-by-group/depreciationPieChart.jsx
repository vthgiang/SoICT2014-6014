import React, { Component } from 'react';
import { connect } from 'react-redux';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import c3 from 'c3';
import 'c3/c3.css';



class DepreciationPieChart extends Component {
    constructor(props) {
        super(props);
    }

    /* componentDidMount() {
        if (this.refs.depreciationExpenseOfAsset) this.pieChart();
    } */

    // Hàm để tính các giá trị khấu hao cho tài sản
    

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { listAssets, translate, setDepreciationOfAsset,chartAsset } = this.props;
        let depreciationOfAsset = "";
        if (chartAsset){
            depreciationOfAsset = chartAsset.map(value=>{
                return ([translate(value[0]),value[1]])
            })
            
            if (setDepreciationOfAsset && JSON.stringify(depreciationOfAsset) !== JSON.stringify([])) {
                setDepreciationOfAsset(depreciationOfAsset);
            } 
        }

        return depreciationOfAsset;
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        if(this.setDataPieChart()){
            let depreciationOfAsset = this.setDataPieChart();
        this.chart = c3.generate({
            bindto: this.refs.depreciationExpenseOfAsset,

            data: {
                columns: depreciationOfAsset,
                type: 'donut',
            },
            pie: {
                label: {
                    format: function (value) {
                        let valueByUnit, unit;
                        if (value >= 1000000000) {
                            valueByUnit = Math.round(value / 1000000000);
                            unit = "B";
                        }
                        else {
                            valueByUnit = Math.round(value / 1000000);
                            unit = "M";
                        }
                        return valueByUnit + unit;
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
                    title: function (d) { return d; },
                    value: function (value, ratio, id) {
                        let valueByUnit, unit;
                        if (value >= 1000000000) {
                            valueByUnit = Math.round(value / 1000000000);
                            unit = "B";
                        }
                        else {
                            valueByUnit = Math.round(value / 1000000);
                            unit = "M";
                        }
                        return valueByUnit + unit;
                    }
                }
            },

            legend: {
                show: true
            }
        });
        }
        
    }
    render() {
        this.pieChart();

        return (
            <React.Fragment>
                <div>
                    <section ref="depreciationExpenseOfAsset"></section>
                </div>
            </React.Fragment>
        )
    }
}

export default (withTranslate(DepreciationPieChart));