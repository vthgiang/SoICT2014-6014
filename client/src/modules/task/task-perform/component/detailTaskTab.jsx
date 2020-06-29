import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { performTaskAction } from './../redux/actions';
import { taskManagementActions } from './../../task-management/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
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
        super(props);
        
        var idUser = getStorage("userId");
        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.ROLE = {
            RESPONSIBLE: {name: "Người thực hiện", value: "responsible"},
            ACCOUNTABLE:  {name: "Người phê duyệt", value: "accountable"},
            CONSULTED:  {name: "Người hỗ trợ", value: "consulted"},
            CREATOR:  {name: "Người tạo", value: "creator"},
            INFORMED:  {name: "Người quan sát", value: "informed"},
        };

        this.state = {
            collapseInfo: false,
            openTimeCounnt: false,
            startTimer: false,
            pauseTimer: false,
            highestIndex: 0,
            currentUser: idUser,
            // render: false,
            // showModalApprove: "",
            // showEdit: "",
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        }

    }


    // static getDerivedStateFromProps(nextProps, prevState) {
    //     console.log('vào get derived--------------', prevState);
    //     if (nextProps.id !== prevState.id) {

    //         return {
    //             ...prevState,
    //             // id: nextProps.id
    //             // render: true
    //         }
    //     }
    //     return true;
    // }
    shouldComponentUpdate = (nextProps, nextState) => {

        if (nextProps.id !== this.state.id) {
            // this.props.getTaskById(nextProps.id);
            // this.props.getTaskActions(nextProps.id);
            // this.props.getTimesheetLogs(nextProps.id);
            this.setState(state=>{
                return{
                    ...state,
                    id: nextProps.id,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });
            // return false;
            return true;
        }

        if (this.state.dataStatus === this.DATA_STATUS.QUERYING){
            if (!nextProps.tasks.task){
                return false;
            } else { // Dữ liệu đã về
                // let task = nextProps.tasks.task.info;
                let task = nextProps.task;
                // console.log('render roleeeeeeeeeeeeeeeeeeeeee\n\n\n\nthis.props, nextProps, nextState, task',this.props, nextProps, nextState, task);

                this.props.getChildrenOfOrganizationalUnits(task.organizationalUnit._id);


                let roles = [];
                if (task) {
                    let userId = getStorage("userId");
                    let tmp = task.responsibleEmployees.find(item => item._id === userId);
                    if (tmp){
                        roles.push(this.ROLE.RESPONSIBLE);
                    }

                    tmp = task.accountableEmployees.find(item => item._id === userId);
                    if (tmp){
                        roles.push(this.ROLE.ACCOUNTABLE);
                    }

                    tmp = task.consultedEmployees.find(item => item._id === userId);
                    if (tmp){
                        roles.push(this.ROLE.CONSULTED);
                    }

                    tmp = task.informedEmployees.find(item => item._id === userId);
                    if (tmp){
                        roles.push(this.ROLE.INFORMED);
                    }

                    if (userId === task.creator._id){
                        roles.push(this.ROLE.CREATOR);
                    }
                }

                let currentRole;
                if (roles.length>0){
                    currentRole= roles[0].value;
                    if (this.props.onChangeTaskRole){
                        this.props.onChangeTaskRole(currentRole);
                    }
                }
                
                this.setState(state=>{
                    return{
                        ...state,
                        dataStatus: this.DATA_STATUS.FINISHED,
                        roles: roles,
                        currentRole: roles.length>0? roles[0].value: null,
                    }
                })
                return false;
            }
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

    formatPriority = (data) => {
        const {translate} = this.props;
        if(data === 1) return translate('task.task_management.low');
        if(data === 2) return translate('task.task_management.normal');
        if(data === 3) return translate('task.task_management.high');
    }

    formatStatus = (data) => {
        const {translate} = this.props;
        if( data === "Inprocess" ) return translate('task.task_management.inprocess');
        else if( data === "WaitForApproval" ) return translate('task.task_management.wait_for_approval');       
        else if( data === "Finished" ) return translate('task.task_management.finished');       
        else if( data === "Delayed" ) return translate('task.task_management.delayed');       
        else if( data === "Canceled" ) return translate('task.task_management.canceled');       
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

    refresh = async () => {
        this.props.getTaskById(this.state.id);
        this.props.getSubTask(this.state.id);
        this.props.getTimesheetLogs(this.state.id);
        this.props.getTaskLog(this.state.id);

        await this.setState(state => {
            return {
                ...state,
                showEdit: undefined,
                showEndTask: undefined,
                showEvaluate: undefined,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        })

    }

    changeRole = (role) => {
        this.setState(state => {
            return {
                ...state,
                currentRole: role
            }
        })
        this.props.onChangeTaskRole(role);
    }
    
    render() {
        // console.log('stateeeeeee\n\n', this.state);
        const { translate } = this.props;
        var task, actions, informations;
        var statusTask;
        const{currentUser}= this.state
        
        const { tasks, performtasks, user } = this.props;
        // task = this.props.task;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null){
            // task = tasks.task.info;
            task = tasks.task;
        }
        
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) statusTask = task.status;
        // if (typeof tasks.task !== 'undefined' && tasks.task !== null && tasks.task.info.taskTemplate !== null) {
        // if (typeof tasks.task !== 'undefined' && tasks.task !== null && tasks.task.taskTemplate !== null) {
        //     actions = tasks.task.actions;
        //     informations = tasks.task.informations;
        // }
        
        let roles = this.state.roles;
        let currentRole = this.state.currentRole;

        let checkInactive = true;
        if(task) checkInactive = task.inactiveEmployees.indexOf(this.state.currentUser) === -1; // return true if user is active user

        return (
      
            <div>
                <div style={{ marginLeft: "-10px" }}>
                    <a className="btn btn-app" onClick={this.refresh} title="Refresh">
                        <i className="fa fa-refresh" style={{ fontSize: "16px" }} aria-hidden="true" ></i>Refresh
                    </a>
                    
                    { ( (currentRole === "responsible" || currentRole === "accountable") && checkInactive ) &&
                        <a className="btn btn-app" onClick={() => this.handleShowEdit(this.props.id, currentRole)} title="Chỉnh sửa thông tin chung">
                            <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>Chỉnh sửa
                        </a>
                    }
                    
                    { ((currentRole === "consulted" || currentRole === "responsible" || currentRole === "accountable") && checkInactive ) &&
                        <a className="btn btn-app" onClick={() => !performtasks.currentTimer && this.startTimer(task._id,currentUser)} title="Bắt đầu thực hiện công việc" disabled={performtasks.currentTimer}>
                            <i className="fa fa-clock-o" style={{ fontSize: "16px" }} aria-hidden="true" ></i>Bấm giờ
                        </a>
                    }
                    { ( (currentRole === "consulted" || currentRole === "responsible" || currentRole === "accountable") && checkInactive ) &&
                        <React.Fragment>
                            <a className="btn btn-app" onClick={() => this.handleShowEndTask(this.props.id, currentRole)} title="Kết thúc công việc">
                                <i className="fa fa-power-off" style={{ fontSize: "16px" }}></i>Kết thúc
                            </a>

                            <a className="btn btn-app" onClick={() => this.handleShowEvaluate(this.props.id, currentRole)} title="Đánh giá công việc">
                                <i className="fa fa-calendar-check-o" style={{ fontSize: "16px" }}></i>Đánh giá
                            </a>
                        </React.Fragment>
                    }
                    {
                        (this.state.collapseInfo === false) ?
                        <a className="btn btn-app" data-toggle="collapse" href="#info" onClick={this.handleChangeCollapseInfo} role="button" aria-expanded="false" aria-controls="info">
                            <i className="fa fa-info" style={{ fontSize: "16px" }}></i>Ẩn thông tin
                        </a> :
                        <a className="btn btn-app" data-toggle="collapse" href="#info" onClick={this.handleChangeCollapseInfo} role="button" aria-expanded="false" aria-controls="info">
                            <i className="fa fa-info" style={{ fontSize: "16px" }}></i>Hiện thông tin
                        </a>
                    }

                    {roles && roles.length>1 &&
                    <div className="dropdown" style={{margin: "10px 0px 0px 10px", display: "inline-block"}}>
                        <a className="btn btn-app" style={{margin: "-10px 0px 0px 0px"}} data-toggle="dropdown">
                            <i className="fa fa-user" style={{ fontSize: "16px" }}></i>Chọn Vai trò
                        </a>
                        <ul className="dropdown-menu">
                            {roles.map(
                                (item, index) => {return <li className={item.value===currentRole ? "active" : undefined} key={index}><a href="#" onClick={() => this.changeRole(item.value)}>{item.name}</a></li>}
                            )}
                        </ul>
                    </div>
                    }
                </div>   

                <br />
                <div>
                    
                    <div id="info" className="collapse in" style={{ margin: "10px 0px 0px 10px" }}>
                        {task && <p><strong>Link công việc &nbsp;&nbsp; <a href={`/task?taskId=${task._id}`} target="_blank">{task.name}</a></strong></p>}
                        <p><strong>Độ ưu tiên công việc &nbsp;&nbsp;</strong> {task && this.formatPriority(task.priority)}</p>
                        <p><strong>Trạng thái công việc &nbsp;&nbsp;</strong> {task && this.formatStatus(task.status)}</p>
                        <p><strong>Thời gian thực hiện &nbsp;&nbsp;</strong> {this.formatDate(task && task.startDate)} - {this.formatDate(task && task.endDate)}</p>
                        
                        <br />
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
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
                                                        if (task.inactiveEmployees.indexOf(item._id) !== -1) { // tìm thấy item._id
                                                            return <li><strike>{item.name}</strike></li>
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
                                                        if (task.inactiveEmployees.indexOf(item._id) !== -1) { // tìm thấy item._id
                                                            return <li><strike>{item.name}</strike></li>
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
                                                                if (task.inactiveEmployees.indexOf(item._id) !== -1) { // tìm thấy item._id
                                                                    return <li><strike>{item.name}</strike></li>
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
                                                            if (task.inactiveEmployees.indexOf(item._id) !== -1) { // tìm thấy item._id
                                                                return <li><strike>{item.name}</strike></li>
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
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Đánh giá công việc</legend>

                                    {/* Evaluations */}
                                    <div>
                                        {
                                            (task && task.evaluations && task.evaluations.length !== 0 ) && 
                                            task.evaluations.map(eva => {
                                                return (
                                                <div style={{paddingBottom: 10}}>
                                                    
                                                    {/* { eva.results.length !== 0 ? */}
                                                        {/* // <dt>Đánh giá ngày {this.formatDate(eva.date)}</dt> : <dt>Đánh giá tháng {new Date(eva.date).getMonth() + 1}</dt> */}
                                                        <dt>Đánh giá ngày {this.formatDate(eva.date)}</dt>
                                                    {/* } */}
                                                    
                                                    <dd>
                                                        {
                                                        eva.results.length !== 0 &&
                                                        <div>
                                                            <div><strong>Điểm các thành viên</strong> (Tự động - Tự đánh giá - Người phê duyệt đánh giá)</div>
                                                            <ul>
                                                            { (eva.results.length !== 0) ?
                                                                eva.results.map((res) => {
                                                                    if(task.inactiveEmployees.indexOf(res.employee._id) !== -1){
                                                                        return <li><strike>{res.employee.name}</strike> - {res.automaticPoint?res.automaticPoint:"Chưa có điểm tự động"} - {res.employeePoint?res.employeePoint:"Chưa tự đánh giá"} - {res.approvedPoint?res.approvedPoint:"Chưa có điểm phê duyệt"}</li>
                                                                    }
                                                                    else {
                                                                        return <li>{res.employee.name} - {res.automaticPoint?res.automaticPoint:"Chưa có điểm tự động"} - {res.employeePoint?res.employeePoint:"Chưa tự đánh giá"} - {res.approvedPoint?res.approvedPoint:"Chưa có điểm phê duyệt"}</li>
                                                                    }
                                                                }) : <li>Chưa có ái đánh giá công việc tháng này</li>
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
                    (this.props.id && this.state.showEdit === this.props.id) && currentRole === "responsible" &&
                    <ModalEditTaskByResponsibleEmployee
                        id={this.props.id}
                        task={task && task}
                        role={currentRole}
                        title='Chỉnh sửa công việc với vai trò người thực hiện'
                        perform={`edit-${currentRole}`}
                    />
                }

                {
                    (this.props.id && this.state.showEdit === this.props.id) && currentRole === "accountable" &&
                    <ModalEditTaskByAccountableEmployee
                        id={this.props.id}
                        task={task && task}
                        role={currentRole}
                        title='Chỉnh sửa công việc với vai trò người phê duyệt'
                        perform={`edit-${currentRole}`}
                    />
                }

                {
                    (this.props.id && this.state.showEvaluate === this.props.id && currentRole === "responsible") &&
                    <EvaluateByResponsibleEmployee
                        id={this.props.id}
                        task={task && task}
                        role={currentRole}
                        title='Đánh giá công việc với vai trò người thực hiện'
                        perform='evaluate'
                    />
                }
                {
                    (this.props.id && this.state.showEvaluate === this.props.id && currentRole === "accountable") &&
                    <EvaluateByAccountableEmployee
                        id={this.props.id}
                        task={task && task}
                        role={currentRole}
                        title='Đánh giá công việc với vai trò người phê duyệt'
                        perform='evaluate'
                    />
                }
                {
                    (this.props.id && this.state.showEvaluate === this.props.id && currentRole === "consulted") &&
                    <EvaluateByConsultedEmployee
                        id={this.props.id}
                        task={task && task}
                        role={currentRole}
                        title='Đánh giá công việc với vai trò người hỗ trợ'
                        perform='evaluate'
                    />
                }


                {
                    (this.props.id && this.state.showEndTask === this.props.id && currentRole === "responsible") &&
                    <EvaluateByResponsibleEmployee
                        id={this.props.id}
                        task={task && task}
                        role={currentRole}
                        title='Kết thúc công việc với vai trò người thực hiện'
                        perform='stop'
                    />
                }
                {
                    (this.props.id && this.state.showEndTask === this.props.id && currentRole === "accountable") &&
                    <EvaluateByAccountableEmployee
                        id={this.props.id}
                        task={task && task}
                        role={currentRole}
                        title='Kết thúc công việc với vai trò người phê duyệt'
                        perform='stop'
                    />
                }
                {
                    (this.props.id && this.state.showEndTask === this.props.id && currentRole === "consulted") &&
                    <EvaluateByConsultedEmployee
                        id={this.props.id}
                        task={task && task}
                        role={currentRole}
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
    getSubTask: taskManagementActions.getSubTask,
    startTimer: performTaskAction.startTimerTask,
    stopTimer: performTaskAction.stopTimerTask,
    getTimesheetLogs: performTaskAction.getTimesheetLogs,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getTaskLog: performTaskAction.getTaskLog,
}

const detailTask = connect(mapStateToProps, actionGetState)(withTranslate(DetailTaskTab));

export { detailTask as DetailTaskTab };