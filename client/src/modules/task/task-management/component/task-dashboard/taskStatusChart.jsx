import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../redux/actions';

import { SelectBox } from '../../../../../common-components/index';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class TaskStatusChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        this.ROLE = { RESPONSIBLE: 1, ACCOUNTABLE: 2, CONSULTED: 3, INFORMED: 4, CREATOR: 5 };
        this.ROLE_SELECTBOX = [
            {
                text: 'Responsible',
                value: this.ROLE.RESPONSIBLE
            },
            {
                text: 'Accountable',
                value: this.ROLE.ACCOUNTABLE
            },
            {
                text: 'Consulted',
                value: this.ROLE.CONSULTED
            },
            {
                text: 'Informed',
                value: this.ROLE.INFORMED
            },
            {
                text: 'Creator',
                value: this.ROLE.CREATOR
            }
        ]

        this.state = {
            userId: localStorage.getItem("userId"),
            dataStatus: this.DATA_STATUS.QUERYING,
            role: this.ROLE.RESPONSIBLE,
            roleName: this.ROLE_SELECTBOX[0].text
        };

        this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null, null, null);
        this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if(nextState.role !== this.state.role) {
            await this.setState(state =>{
                return {
                    ...state,
                    role: nextState.role,
                };
            });
            
            this.pieChart();
        }

        if(nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null, null, null);
            this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
            this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
            this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
            this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
 
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            });
            return false
        } else if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            // Kiểm tra tasks đã được bind vào props hay chưa
            if(!nextProps.tasks.responsibleTasks || !nextProps.tasks.accountableTasks || !nextProps.tasks.consultedTasks || !nextProps.tasks.informedTasks || !nextProps.tasks.creatorTasks) {
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

    handleSelectRole = (value) => {
        var roleName = this.ROLE_SELECTBOX.filter(x => x.value === Number(value[0])).map(x => x.text);

        this.setState(state => {
            return {
                ...state,
                role: Number(value[0]),
                roleName: roleName
            }
        })
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { tasks } = this.props;
        var dataPieChart, numberOfInprocess = 0, numberOfWaitForApproval = 0, numberOfFinished = 0, numberOfDelayed = 0, numberOfCanceled = 0;
        var listTask, listTask;
        
        var now = new Date();
        var currentYear = now.getFullYear();
        var currentMonth = now.getMonth();
        var beginnigOfNextMonth = new Date(currentYear, currentMonth+1);
        var beginningOfMonth = new Date(currentYear, currentMonth);

        if(tasks.responsibleTasks && tasks.accountableTasks && tasks.consultedTasks && tasks.informedTasks && tasks.creatorTasks) {
            if(this.state.role === this.ROLE.RESPONSIBLE) {
                listTask = tasks.responsibleTasks;
            } else if(this.state.role === this.ROLE.ACCOUNTABLE) {
                listTask = tasks.accountableTasks;
            } else if(this.state.role === this.ROLE.CONSULTED) {
                listTask = tasks.consultedTasks;
            } else if(this.state.role === this.ROLE.INFORMED) {
                listTask = tasks.informedTasks;
            } else if(this.state.role === this.ROLE.CREATOR) {
                listTask = tasks.creatorTasks;
            }
        };
        
        // // Lọc các task trùng nhau
        // listTask = responsibleTasks.concat(accountableTasks).concat(consultedTasks).concat(informedTasks).concat(creatorTasks);
        // listTask.forEach(task => {
        //     let id = task._id;
        //     if(!(listIdTask.includes(task._id))) {
        //         listIdTask.push(task._id)
        //         listTaskFilter.push(task);
        //     }
        // });

        if(listTask) {
            listTask.filter(task => {        // lấy công việc tháng hiện tại
                if(new Date(task.startDate) < beginnigOfNextMonth && new Date(task.startDate) >= beginningOfMonth){
                    return 1;
                } else if(new Date(task.endDate) < beginnigOfNextMonth && new Date(task.endDate) >= beginningOfMonth){
                    return 1;
                } else if(new Date(task.endDate) >= beginnigOfNextMonth && new Date(task.startDate) < beginningOfMonth){
                    return 1;
                }
                return 0;
            }).map(task => {
                switch(task.status) {
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
        }
        
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
            bindto: this.refs.chart,             // Đẩy chart vào thẻ div có id="chart"
            
            data: {                                 // Dữ liệu biểu đồ
                columns: dataPieChart,
                type : 'pie',
            },

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            legend: {                               // Ẩn chú thích biểu đồ
                show: true
            }
        });
    }

    render() {
        return(
            <React.Fragment>
                <div className="box-body dashboard_box_body">
                    <section style={{ textAlign: "right", fontSize: "17px" }}>
                        <span className="label label-danger">{this.state.roleName}</span>
                        <i className="fa fa-gear" data-toggle="collapse" data-target="#role-of-status-task" style={{ padding: "5px", cursor: "pointer" }}></i>
                        
                        <div className="box box-primary box-solid collapse setting-table" id="role-of-status-task">
                            <div className="box-header with-border">
                                <h3 className="box-title">Vai trò</h3>
                                <div className="box-tools pull-right">
                                    <button type="button" className="btn btn-box-tool" data-toggle="collapse" data-target="#role-of-status-task" ><i className="fa fa-times"></i></button>
                                </div>
                            </div>

                            <div className="box-body">
                                <div className = "form-group">
                                    <SelectBox
                                        id={`roleOfStatusTaskSelectBox`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={this.ROLE_SELECTBOX}
                                        multiple={false}
                                        onChange={this.handleSelectRole}
                                        value={this.ROLE_SELECTBOX[0].value}
                                    />
                                </div> 
                            </div>
                        </div>
                    </section>

                    <section ref="chart"></section>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const actions = {
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser
}

const connectedTaskStatusChart = connect(mapState, actions)(TaskStatusChart);
export { connectedTaskStatusChart as TaskStatusChart };