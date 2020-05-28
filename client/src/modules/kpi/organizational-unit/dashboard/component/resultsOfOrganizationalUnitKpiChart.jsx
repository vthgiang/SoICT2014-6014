import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class ResultsOfOrganizationalUnitKpiChart extends Component {
    
    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            year: new Date().getFullYear(),
            dataStatus: this.DATA_STATUS.QUERYING
        };

        // Lấy tập KPI đơn vị theo từng năm
        this.props.getAllOrganizationalUnitKpiSetEachYear(this.state.currentRole, this.state.year)
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(this.state.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            // Lấy tập KPI đơn vị theo từng năm
            this.props.getAllOrganizationalUnitKpiSetEachYear(this.state.currentRole, this.state.year)

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            })
            return false;
        } else if(this.state.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsEachYear) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
        } else if(this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.multiLineChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                }
            })
        }

        return false;
    }
    
    // Thiết lập dữ liệu biểu đồ
    setDataMultiLineChart = () => {
        const { dashboardOrganizationalUnitKpi } = this.props;
        var listOrganizationalUnitKpiSetEachYear, automaticPoint, employeePoint, approvedPoint, date, dataMultiLineChart;

        if(dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsEachYear !== [] && dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsEachYear !== undefined) {
            listOrganizationalUnitKpiSetEachYear = dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsEachYear
        }

        if(listOrganizationalUnitKpiSetEachYear !== undefined) {
            automaticPoint = ['Hệ thống đánh giá'].concat(listOrganizationalUnitKpiSetEachYear.map(x => x.automaticPoint));
            
            employeePoint = ['Cá nhân tự đánh giá'].concat(listOrganizationalUnitKpiSetEachYear.map(x => x.employeePoint));

            approvedPoint = ['Quản lý đánh giá'].concat(listOrganizationalUnitKpiSetEachYear.map(x => x.approvedPoint));
        
            date = listOrganizationalUnitKpiSetEachYear.map(x => {
                date = new Date(x.date);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() - 1);
            })
        }
        
        dataMultiLineChart = [['x'].concat(date), automaticPoint, employeePoint, approvedPoint];

        return dataMultiLineChart;
    }

    // Xóa các chart đã render trước khi đủ dữ liệu
    removePreviosMultiLineChart = () => {
        const chart =  this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild)
        }
    }

    // Khởi tạo MultiLineChart bằng C3
    multiLineChart = () => {
        this.removePreviosMultiLineChart();
        
        // Tạo mảng dữ liệu
        var dataMultiLineChart = this.setDataMultiLineChart();

        this.chart = c3.generate({
            bindto: this.refs.chart,       // Đẩy chart vào thẻ div có id="multiLineChart"

            padding: {                              // Căn lề biểu đồ
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                x: 'x',
                columns: dataMultiLineChart,
                type: 'spline'
            },

            axis : {                                // Config trục tọa độ
                x : {
                    type : 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                    }
                }
            },

            zoom: {                                 // Cho phép zoom biểu đồ
                enabled: false
            }
        });
    }

    render() {
        return(
            <div ref="chart"></div>
        )
    }
}

function mapState(state) {
    const { dashboardOrganizationalUnitKpi } = state;
    return { dashboardOrganizationalUnitKpi };
}

const actions = {
    getAllOrganizationalUnitKpiSetEachYear: dashboardOrganizationalUnitKpiActions.getAllOrganizationalUnitKpiSetEachYear
}

const connectedResultsOfOrganizationalUnitKpiChart = connect(mapState, actions)(ResultsOfOrganizationalUnitKpiChart);
export { connectedResultsOfOrganizationalUnitKpiChart as ResultsOfOrganizationalUnitKpiChart }