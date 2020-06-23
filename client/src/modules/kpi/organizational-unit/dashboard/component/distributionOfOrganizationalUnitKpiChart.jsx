import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUnitKpiActions } from '../../creation/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class DistributionOfOrganizationalUnitKpiChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.state = {
            organizationalUnitId: null,
            dataStatus: this.DATA_STATUS.QUERYING
        };

        // Lấy Kpi của đơn vị hiện tại
        this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId);
    }
    
    shouldComponentUpdate = async (nextProps, nextState) => {
        if(nextProps.organizationalUnitId !== this.state.organizationalUnitId) {
            await this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"), nextProps.organizationalUnitId);
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }
        
        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.createKpiUnit.currentKPI)
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

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.organizationalUnitId !== prevState.organizationalUnitId) {
            return {
                ...prevState,
                organizationalUnitId: nextProps.organizationalUnitId
            }
        } else{
            return null;
        }
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { createKpiUnit } = this.props;
        var listOrganizationalUnitKpi, dataPieChart;

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if(listOrganizationalUnitKpi){
            dataPieChart = listOrganizationalUnitKpi.map(x => { 
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
            },

            legend: {                               // Ẩn chú thích biểu đồ
                show: true
            }
        });
    }

    render() {
        const { createKpiUnit } = this.props;
        var currentKpi;

        if(createKpiUnit) {
            currentKpi = createKpiUnit.currentKPI
        }

        return (
            <React.Fragment>
                {currentKpi &&
                    <div ref="chart"></div>
                }
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit
}

const connectedDistributionOfOrganizationalUnitKpiChart = connect(mapState, actions)(DistributionOfOrganizationalUnitKpiChart);
export { connectedDistributionOfOrganizationalUnitKpiChart as DistributionOfOrganizationalUnitKpiChart}
