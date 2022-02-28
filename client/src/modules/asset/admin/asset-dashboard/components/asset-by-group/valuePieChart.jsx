import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';


class ValuePieChart extends Component {
    constructor(props) {
        super(props);
    }


    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { translate } = this.props;
        const { chartAsset, setValueOfAsset } = this.props;
        let valueOfAsset = ""
        if (chartAsset){
            valueOfAsset = chartAsset.map(value=>{
                console.log(value)
                return ([translate(value[0]),value[1]])
            })
            // CHuyển dữ liệu lên component cha để export
            if (setValueOfAsset && JSON.stringify(valueOfAsset) !== JSON.stringify([])) {
                setValueOfAsset(valueOfAsset);
            } 
        }
        /* console.log(dataPieChart) */
        console.log("valueasset",valueOfAsset)
        return valueOfAsset;
        
    }


    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        if(this.setDataPieChart()){
        let valueOfAsset = this.setDataPieChart();
        this.chart = c3.generate({
            bindto: this.refs.valuePieChart,

            data: {
                columns: valueOfAsset,
                type: 'donut',
            },

            pie: {
                label: {
                    format: function (value) {
                        return value / 1000000 + " M";
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
                <div >
                    <section ref="valuePieChart"></section>
                </div>
            </React.Fragment>
        )
    }
}

export default (withTranslate(ValuePieChart));
