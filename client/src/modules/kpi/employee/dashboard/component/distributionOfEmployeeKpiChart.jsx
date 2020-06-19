import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createKpiSetActions } from '../../creation/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class DistributionOfEmployeeKpiChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING
        };

        // Lấy Kpi của cá nhân hiện tại
        this.props.getEmployeeKpiSet();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            // Lấy Kpi của cá nhân hiện tại
            this.props.getEmployeeKpiSet();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.createEmployeeKpiSet.currentKPI)
                return false;
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE){
            this.pieChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }

        return false;
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { createEmployeeKpiSet } = this.props;
        var listEmployeeKpi, dataPieChart;

        if (createEmployeeKpiSet.currentKPI && createEmployeeKpiSet.currentKPI.kpis) {
            listEmployeeKpi = createEmployeeKpiSet.currentKPI.kpis
        }
        if(listEmployeeKpi){
            dataPieChart = listEmployeeKpi.map(x => { 
                return [ x.name, x.weight ]
            })
        }

        return dataPieChart;
    }

     // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart(){
        const chart = this.refs.chart;
        while(chart.hasChildNodes()){
            chart.removeChild(chart.lastChild);
        }
    } 

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        this.removePreviousChart();

        // Tạo mảng dữ liệu
        var dataPieChart;
        dataPieChart = this.setDataPieChart(); 

        this.chart = c3.generate({
            bindto: this.refs.chart,             // Đẩy chart vào thẻ div có id="pieChart"

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                columns: dataPieChart,
                type : 'pie',
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div ref="chart"></div>
            </React.Fragment>
        )
    }
        
}

function mapState(state) {
    const { createEmployeeKpiSet } = state;
    return { createEmployeeKpiSet };
}

const actions = {
    getEmployeeKpiSet: createKpiSetActions.getEmployeeKpiSet
}

const connectedDistributionOfEmployeeKpiChart = connect(mapState, actions)(DistributionOfEmployeeKpiChart);
export { connectedDistributionOfEmployeeKpiChart as DistributionOfEmployeeKpiChart}