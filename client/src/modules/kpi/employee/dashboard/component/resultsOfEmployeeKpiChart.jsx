import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createKpiSetActions } from '../../creation/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class ResultsOfEmployeeKpiChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.TODAY = new Date();

        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING,
            userId: localStorage.getItem("userId")
        };
    }

    componentDidMount = () => {
        this.props.getAllEmployeeKpiSetByMonth(this.state.userId, this.props.startDate, this.props.endDate);

        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if(nextProps.startDate !== this.state.startDate || nextProps.endDate !== this.state.endDate) {
            // Cầ đặt await, và phải đặt trước setState để kịp thiết lập createEmployeeKpiSet.employeeKpiSetByMonth là null khi gọi service
            await this.props.getAllEmployeeKpiSetByMonth(this.state.userId, nextProps.startDate, nextProps.endDate);
       
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }

        if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.createEmployeeKpiSet.employeeKpiSetByMonth) {
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
        if(nextProps.startDate !== prevState.startDate || nextProps.endDate !== prevState.endDate) {
            return {
                ...prevState,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate
            }
        } else{
            return null;
        }
    }

    // Thiết lập dữ liệu biểu đồ
    setDataMultiLineChart = () => {
        const { createEmployeeKpiSet } = this.props;
        var listEmployeeKpiSetEachYear, automaticPoint, employeePoint, approvedPoint, date, dataMultiLineChart;

        if(createEmployeeKpiSet.employeeKpiSetByMonth) {
            listEmployeeKpiSetEachYear = createEmployeeKpiSet.employeeKpiSetByMonth
        }

        if(listEmployeeKpiSetEachYear) {

            automaticPoint = ['Hệ thống đánh giá'];
            employeePoint = ['Cá nhân tự đánh giá'];
            approvedPoint = ['Quản lý đánh giá'];
            date = ['x'];

            listEmployeeKpiSetEachYear.map(x => {
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
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth
}

const connectedResultsOfEmployeeKpiChart = connect(mapState, actions)(ResultsOfEmployeeKpiChart);
export { connectedResultsOfEmployeeKpiChart as ResultsOfEmployeeKpiChart }