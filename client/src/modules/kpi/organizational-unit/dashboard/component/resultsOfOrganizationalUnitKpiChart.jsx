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

        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();

        this.state = {
            organizationalUnitId: null,
            startDate: currentYear + '-' + 1,
            endDate: currentYear + '-' + (currentMonth + 2),
            dataStatus: this.DATA_STATUS.QUERYING
        };
    }

    componentDidMount = () => {
        this.props.getAllOrganizationalUnitKpiSetByTime(this.props.organizationalUnitId, this.state.startDate, this.state.endDate);

        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if(nextProps.organizationalUnitId !== this.state.organizationalUnitId) {
            // Cần đặt await, và phải đặt trước setState để kịp thiết lập createEmployeeKpiSet.employeeKpiSetByMonth là null khi gọi service
            await this.props.getAllOrganizationalUnitKpiSetByTime(nextProps.organizationalUnitId, this.state.startDate, this.state.endDate);
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }
        
        if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.dashboardOrganizationalUnitKpi.organizationalUnitKpiSets) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
            return false;
        } else if(nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
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
    setDataMultiLineChart = () => {
        const { dashboardOrganizationalUnitKpi } = this.props;
        var listOrganizationalUnitKpiSetEachYear, automaticPoint, employeePoint, approvedPoint, date, dataMultiLineChart;

        if(dashboardOrganizationalUnitKpi.organizationalUnitKpiSets) {
            listOrganizationalUnitKpiSetEachYear = dashboardOrganizationalUnitKpi.organizationalUnitKpiSets
        }

        if(listOrganizationalUnitKpiSetEachYear) {

            automaticPoint = ['Hệ thống đánh giá'];
            employeePoint = ['Cá nhân tự đánh giá'];
            approvedPoint = ['Quản lý đánh giá'];
            date = ['x'];

            listOrganizationalUnitKpiSetEachYear.map(x => {
                automaticPoint.push(x.automaticPoint);
                employeePoint.push(x.employeePoint);
                approvedPoint.push(x.approvedPoint);

                var newDate = new Date(x.date);
                newDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + (newDate.getDate() - 1);
                date.push(newDate);
            });
        }
        
        dataMultiLineChart = [date, automaticPoint, employeePoint, approvedPoint];

        return dataMultiLineChart;
    };

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
                },
                y: {
                    max: 100,
                    min: 0,
                    label: {
                        text: 'Điểm',
                        position: 'outer-right'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
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
    getAllOrganizationalUnitKpiSetByTime: dashboardOrganizationalUnitKpiActions.getAllOrganizationalUnitKpiSetByTime
}

const connectedResultsOfOrganizationalUnitKpiChart = connect(mapState, actions)(ResultsOfOrganizationalUnitKpiChart);
export { connectedResultsOfOrganizationalUnitKpiChart as ResultsOfOrganizationalUnitKpiChart }