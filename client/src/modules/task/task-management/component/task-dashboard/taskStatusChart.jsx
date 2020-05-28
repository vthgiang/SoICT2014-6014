import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../../../../kpi/organizational-unit/dashboard/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class TaskStatusChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            dataStatus: this.DATA_STATUS.QUERYING
        };

        // Lấy danh sách các công việc theo từng Kpi của đơn vị hiện tại
        this.props.getAllTaskOfOrganizationalUnit(this.state.currentRole)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            // Lấy danh sách các công việc theo từng Kpi của đơn vị hiện tại
            this.props.getAllTaskOfOrganizationalUnit(this.state.currentRole);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            });
            return false
        } else if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            // Kiểm tra tasks đã được bind vào props hay chưa
            if(!nextProps.dashboardOrganizationalUnitKpi.tasks) {
                return false;           // Đang lấy dữ liệu, ko cần render lại
            };

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            });
            return false
        } else if(nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.pieChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                }
            });
        }

        return false
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { dashboardOrganizationalUnitKpi } = this.props;
        var listTask, dataPieChart, numberOfInprocess = 0, numberOfWaitForApproval = 0, numberOfFinished = 0, numberOfDelayed = 0, numberOfCanceled = 0;

        if(dashboardOrganizationalUnitKpi.tasks) {
            listTask = dashboardOrganizationalUnitKpi.tasks;
        };

        listTask.map(x => {
            switch(x.status) {
                case "Inprocess":
                    numberOfInprocess++;
                    break;
                case "WaitForApproval":
                    numberOfWaitForApproval++;
                    break;
                case "Finished":
                    numberOfFinished++;
                    break;
                case "Delayed":
                    numberOfDelayed++;
                    break;
                case "Canceled":
                    numberOfCanceled++;
                    break;
            }
        });

        dataPieChart = [
            [ "Inprocess", numberOfInprocess ],
            [ "WaitForApproval", numberOfWaitForApproval ],
            [ "Finished", numberOfFinished ],
            [ "Delayed", numberOfDelayed ],
            [ "Canceled", numberOfCanceled ]
        ];

        return dataPieChart;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviosChart = () => {
        const chart = this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        this.removePreviosChart();

        var dataPieChart = this.setDataPieChart();

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
        return(
            <React.Fragment>
                <div ref="chart"></div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { dashboardOrganizationalUnitKpi } = state;
    return { dashboardOrganizationalUnitKpi }
}
const actions = {
    getAllTaskOfOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllTaskOfOrganizationalUnit
}

const connectedTaskStatusChart = connect(mapState, actions)(TaskStatusChart);
export { connectedTaskStatusChart as TaskStatusChart };