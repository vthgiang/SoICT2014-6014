import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { performTaskAction } from './../redux/actions';
import { taskManagementActions } from './../../task-management/redux/actions';
import { ModalEditTaskByResponsibleEmployee } from './modalEditTaskByResponsibleEmployee';
import { ModalEditTaskByAccountableEmployee } from './modalEditTaskByAccountableEmployee';
import { EvaluateByAccountableEmployee } from './evaluateByAccountableEmployee';
import { EvaluateByConsultedEmployee } from './evaluateByConsultedEmployee';
import { EvaluateByResponsibleEmployee } from './evaluateByResponsibleEmployee';
import Swal from 'sweetalert2';
import {
    getStorage
} from '../../../../config';

// import './actionTab.css'
class DetailTaskTab extends Component {

    constructor(props) {

        var idUser = getStorage("userId");

        super(props);
        this.state = {
            collapseInfo: false,
            openTimeCounnt: false,
            startTimer: false,
            pauseTimer: false,
            highestIndex: 0,
            currentUser: idUser,
            showModalApprove: "",
            showEdit: ""
        }
    }

    

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.id !== prevState.id) {

            return {
                ...prevState,
                id: nextProps.id
            }
        }
        return true;
    }
    shouldComponentUpdate = (nextProps, nextState) => {

        if (nextProps.id !== this.state.id) {
            this.props.getTaskById(nextProps.id);
            // this.props.getTaskActions(nextProps.id);
            this.props.getTimesheetLogs(nextProps.id);

            // return true;
        }
        return true;
    }

    handleChangeCollapseInfo = async () => {
        await this.setState(state => {
            return {
                ...state,
                collapseInfo: !state.collapseInfo
            }
        });
    }

    
    startTimer = async (taskId,userId) => {
        var timer = {
            startedAt: Date.now(),
            creator: userId,
            task: taskId
        };
        this.props.startTimer(timer);
    }


    // convert ISODate to String dd/mm/yyyy
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    }



    

    handleShowEdit = async (id, role) => {
        await this.setState(state => {
            return {
                ...state,
                showEdit: id
            }
        });
        window.$(`#modal-edit-task-by-${role}-${id}`).modal('show');

    }
    handleShowEndTask = async (id, role) => {
        await this.setState(state => {
            return {
                ...state,
                showEndTask: id
            }
        });
        window.$(`#modal-evaluate-task-by-${role}-${id}-stop`).modal('show');

    }
    

    handleShowEvaluate = async (id, role) => {
        await this.setState(state => {
            return {
                ...state,
                showEvaluate: id
            }
        });
        window.$(`#modal-evaluate-task-by-${role}-${id}-evaluate`).modal('show');

    }
    
    render() {
        const { translate } = this.props;
        var task, actions, informations;
        var statusTask;
        const{currentUser}= this.state
        
        const { tasks, performtasks, user } = this.props;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) statusTask = task.status;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null && tasks.task.info.taskTemplate !== null) {
            actions = tasks.task.actions;
            informations = tasks.task.informations;
        }
        var priority="";
        if(task && task.priority === 3) priority ="Cao";
        if(task && task.priority === 2) priority ="Trung bình";
        if(task && task.priority === 1) priority ="Thấp";

        return (
      
            <div>
                <div style={{ marginLeft: "-10px" }}>
                    { (this.props.role === "responsible" || this.props.role === "accountable") && 
                        <a className="btn btn-app" onClick={() => this.handleShowEdit(this.props.id, this.props.role)} title="Chỉnh sửa thông tin chung">
                            <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>Chỉnh sửa
                        </a>
                    }
                    
                    { (this.props.role !== "informed" && this.props.role !== "creator") &&
                        <a className="btn btn-app" onClick={() => !performtasks.currentTimer && this.startTimer(task._id,currentUser)} title="Bắt đầu thực hiện công việc" disabled={performtasks.currentTimer}>
                            <i class="fa fa-clock-o" style={{ fontSize: "16px" }} aria-hidden="true" ></i>Bấm giờ
                        </a>
                    }
                    { (this.props.role === "consulted" || this.props.role === "responsible" || this.props.role === "accountable") &&
                        <React.Fragment>
                            {/* <a className="btn btn-app" onClick={() => this.handleShowEndTask(this.props.id, this.props.role)} data-toggle="modal" data-target={`#modal-evaluate-task-by-${this.props.role}-${this.props.id}-stop`} data-backdrop="static" data-keyboard="false" title="Kết thúc công việc"> */}
                            <a className="btn btn-app" onClick={() => this.handleShowEndTask(this.props.id, this.props.role)} title="Kết thúc công việc">
                                <i className="fa fa-power-off" style={{ fontSize: "16px" }}></i>Kết thúc
                            </a>

                            {/* <a className="btn btn-app" onClick={() => this.handleShowEvaluate(this.props.id, this.props.role)} data-toggle="modal" data-target={`#modal-evaluate-task-by-${this.props.role}-${this.props.id}-evaluate`} data-backdrop="static" data-keyboard="false" title="Đánh giá công việc"> */}
                            <a className="btn btn-app" onClick={() => this.handleShowEvaluate(this.props.id, this.props.role)} title="Đánh giá công việc">
                                <i className="fa fa-calendar-check-o" style={{ fontSize: "16px" }}></i>Đánh giá
                            </a>
                        </React.Fragment>
                    }
                    {
                        (this.state.collapseInfo === false) ?
                        <a class="btn btn-app" data-toggle="collapse" href="#info" onClick={this.handleChangeCollapseInfo} role="button" aria-expanded="false" aria-controls="info">
                            <i class="fa fa-info" style={{ fontSize: "16px" }}></i>Ẩn thông tin
                        </a> :
                        <a class="btn btn-app" data-toggle="collapse" href="#info" onClick={this.handleChangeCollapseInfo} role="button" aria-expanded="false" aria-controls="info">
                            <i class="fa fa-info" style={{ fontSize: "16px" }}></i>Hiện thông tin
                        </a>
                    }
        
                </div>   

                <br />
                <div>
                    
                    <div id="info" class="collapse in" style={{ margin: "10px 0px 0px 10px" }}>
                        {/* <p><strong>Độ ưu tiên công việc:</strong> {task && task.priority}</p> */}
                        <p><strong>Độ ưu tiên công việc &nbsp;&nbsp;</strong> {priority}</p>
                        <p><strong>Trạng thái công việc &nbsp;&nbsp;</strong> {task && task.status}</p>
                        <p><strong>Thời gian thực hiện &nbsp;&nbsp;</strong> {this.formatDate(task && task.startDate)} - {this.formatDate(task && task.endDate)}</p>
                        {/* </div>
                                <hr />
                            </div>

                            <br /> */}
                        <br />
                        <div className="row">
                            <div className="col-sm-6">
                                <fieldset className="scheduler-border" style={{ /*border: "1px solid #fff" */ }}>
                                    <legend className="scheduler-border">Thông tin chung</legend>

                                    {/* Description */}
                                    <div>
                                        <dt>Mô tả</dt>
                                        <dd>
                                            {task && task.description}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt>Người thực hiện</dt>
                                        <dd>
                                            <ul>
                                                {
                                                    (task && task.responsibleEmployees.length !== 0) &&
                                                    task.responsibleEmployees.map(item => {
                                                        if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                                                            return <li><u>{item.name}</u></li>
                                                        } else {
                                                            return <li>{item.name}</li>
                                                        }

                                                    })
                                                }
                                            </ul>
                                        </dd>
                                        <dt>Người phê duyệt</dt>
                                        <dd>
                                            <ul>
                                                {
                                                    (task && task.accountableEmployees.length !== 0) &&
                                                    task.accountableEmployees.map(item => {
                                                        if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                                                            return <li><u>{item.name}</u></li>
                                                        } else {
                                                            return <li>{item.name}</li>
                                                        }
                                                    })
                                                }
                                            </ul>
                                        </dd>

                                        {
                                            (task && task.consultedEmployees.length !== 0) &&
                                            <React-Fragment>
                                                <dt>Người hỗ trợ</dt>
                                                <dd>
                                                    <ul>
                                                        {
                                                            (task && task.consultedEmployees.length !== 0) &&
                                                            task.consultedEmployees.map(item => {
                                                                if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                                                                    return <li><u>{item.name}</u></li>
                                                                } else {
                                                                    return <li>{item.name}</li>
                                                                }
                                                            })
                                                        }
                                                    </ul>
                                                </dd>
                                            </React-Fragment>
                                        }
                                        {
                                            (task && task.informedEmployees.length !== 0) &&
                                            <React-Fragment>
                                            <dt>Người quan sát</dt>
                                            <dd>
                                                <ul>
                                                    {
                                                        (task && task.informedEmployees.length !== 0) &&
                                                        task.informedEmployees.map(item => {
                                                            if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                                                                return <li><u>{item.name}</u></li>
                                                            } else {
                                                                return <li>{item.name}</li>
                                                            }
                                                        })
                                                    }
                                                </ul>
                                            </dd>
                                            </React-Fragment>
                                        }
                                    </div>

                                    <div>
                                        {/* Task information*/}
                                        <dt>Thông tin công việc</dt>
                                        <dd>
                                            <ul>
                                                <li>Mức độ hoàn thành: &nbsp;&nbsp; {task && task.progress}%</li>
                                                {(task && task.point && task.point !== -1) ?
                                                    <li>Điểm công việc &nbsp;&nbsp; {task && task.point}%</li> :
                                                    <li>Điểm công việc &nbsp;&nbsp; Chưa được tính</li>
                                                }
                                                {
                                                    (task && task.taskInformations.length !== 0) &&
                                                    task.taskInformations.map(info => {
                                                        
                                                        if(info.type === "Date") {
                                                            return <li>{info.name}&nbsp;-&nbsp;Giá trị: {info.value ? this.formatDate(info.value) : "Chưa đánh giá tháng này"}</li>
                                                        }
                                                        return <li>{info.name}: &nbsp;&nbsp;{info.value? info.value: "Chưa có thông tin"}</li>
                                                    })
                                                }
                                            </ul>
                                        </dd>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-sm-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Đánh giá công việc</legend>

                                    {/* Evaluations */}
                                    <div>
                                        {
                                            (task && task.evaluations && task.evaluations.length !== 0 ) && 
                                            task.evaluations.map(eva => {
                                                return (
                                                <div style={{paddingBottom: 10}}>
                                                    
                                                    { eva.results.length !== 0 ?
                                                        <dt>Đánh giá ngày {this.formatDate(eva.date)}</dt> : <dt>Đánh giá tháng {new Date(eva.date).getMonth() + 1}</dt>
                                                    }
                                                    
                                                    <dd>
                                                        {
                                                        eva.results.length !== 0 &&
                                                        <div>
                                                            <div><strong>Điểm các thành viên</strong> (Tự động - Tự đánh giá - Người phê duyệt đánh giá)</div>
                                                            <ul>
                                                            { (eva.results.length !== 0) ?
                                                                eva.results.map((res) => {
                                                                    return <li>{res.employee.name} - {res.automaticPoint?res.automaticPoint:"Chưa có điểm tự động"} - {res.employeePoint?res.employeePoint:"Chưa tự đánh giá"} - {res.approvedPoint?res.approvedPoint:"Chưa có điểm phê duyệt"}</li>
                                                                }) : <li>Chưa có ái đánh giá vông việc tháng này</li>
                                                            }
                                                            </ul>

                                                            {/* Danh gia theo task infomation - thoong tin cong viec thang vua qua lam duoc nhung gi */}
                                                            <div><strong>Thông tin công việc</strong></div>
                                                            <ul>
                                                            <li>Mức độ hoàn thành &nbsp;&nbsp; {task && task.progress}%</li>
                                                            {(task && task.point && task.point !== -1) ?
                                                                <li>Điểm công việc &nbsp;&nbsp; {task && task.point}%</li> :
                                                                <li>Điểm công việc &nbsp;&nbsp; Chưa được tính</li>
                                                            }

                                                            {
                                                                eva.taskInformations.map(info => {
                                                                    if( !isNaN(Date.parse(info.value)) && isNaN(info.value) ){
                                                                        return <li>{info.name}&nbsp;-&nbsp;Giá trị: {info.value ? this.formatDate(info.value) : "Chưa đánh giá tháng này"}</li>
                                                                    }
                                                                    return <li>{info.name}&nbsp;-&nbsp;Giá trị: {info.value ? info.value : "Chưa đánh giá tháng này"}</li>
                                                                })
                                                            }
                                                            </ul>
                                                        </div>     
                                                        }
                                                        

                                                    {/* </dd>

                                                    <dd> */}
                                                        {/* KPI */}
                                                        <div><strong>Liên kết KPI</strong></div>
                                                        <ul>
                                                        {(eva.kpis.length !== 0) ?
                                                            (
                                                                eva.kpis.map(item => {
                                                                    return (<li>KPI {item.employee.name}
                                                                        {(item.kpis.length !== 0) ?
                                                                            <ol>
                                                                                {
                                                                                    item.kpis.map(kpi => {
                                                                                        return <li>{kpi.name}</li>
                                                                                    })
                                                                                }
                                                                            </ol>
                                                                            : <span>&nbsp;&nbsp; Chưa liên kết công việc với KPI</span>
                                                                        }
                                                                    </li>)
                                                                })
                                                            ): <li>Chưa ai liên kết công việc với KPI</li>
                                                        }
                                                        </ul>
                                                    </dd>
                                                </div>);
                                            })
                                        }
                                        {(task && (!task.evaluations || task.evaluations.length === 0 )) && <dt>Chưa được đánh giá lần nào</dt>}
                                    
                                    </div>
                                </fieldset>
                            </div>

                        </div>

                    </div>
                </div>
                {
                    (this.props.id && this.state.showEdit === this.props.id) && this.props.role === "responsible" &&
                    <ModalEditTaskByResponsibleEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Chỉnh sửa công việc với vai trò người thực hiện'
                        perform={`edit-${this.props.role}`}
                    />
                }

                {
                    (this.props.id && this.state.showEdit === this.props.id) && this.props.role === "accountable" &&
                    <ModalEditTaskByAccountableEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Chỉnh sửa công việc với vai trò người phê duyệt'
                        perform={`edit-${this.props.role}`}
                    />
                }

                {
                    (this.props.id && this.state.showEvaluate === this.props.id && this.props.role === "responsible") &&
                    <EvaluateByResponsibleEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Đánh giá công việc với vai trò người thực hiện'
                        perform='evaluate'
                    />
                }
                {
                    (this.props.id && this.state.showEvaluate === this.props.id && this.props.role === "accountable") &&
                    <EvaluateByAccountableEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Đánh giá công việc với vai trò người phê duyệt'
                        perform='evaluate'
                    />
                }
                {
                    (this.props.id && this.state.showEvaluate === this.props.id && this.props.role === "consulted") &&
                    <EvaluateByConsultedEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Đánh giá công việc với vai trò người hỗ trợ'
                        perform='evaluate'
                    />
                }


                {
                    (this.props.id && this.state.showEndTask === this.props.id && this.props.role === "responsible") &&
                    <EvaluateByResponsibleEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Kết thúc công việc với vai trò người thực hiện'
                        perform='stop'
                    />
                }
                {
                    (this.props.id && this.state.showEndTask === this.props.id && this.props.role === "accountable") &&
                    <EvaluateByAccountableEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Kết thúc công việc với vai trò người phê duyệt'
                        perform='stop'
                    />
                }
                {
                    (this.props.id && this.state.showEndTask === this.props.id && this.props.role === "consulted") &&
                    <EvaluateByConsultedEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Kết thúc công việc với vai trò người hỗ trợ'
                        perform='stop'
                    />
                }
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { tasks, performtasks, user } = state;
    return { tasks, performtasks, user };

}

const actionGetState = { //dispatchActionToProps
    getTaskById: taskManagementActions.getTaskById,
    startTimer: performTaskAction.startTimerTask,
    stopTimer: performTaskAction.stopTimerTask,
    getTimesheetLogs: performTaskAction.getTimesheetLogs,
}

const detailTask = connect(mapStateToProps, actionGetState)(withTranslate(DetailTaskTab));

export { detailTask as DetailTaskTab };