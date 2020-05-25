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
import moment from 'moment'
import {
    getStorage
} from '../../../../config';
import Draggable from 'react-draggable';
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
            timer: {
                duration:null,
                startedAt: null,
                stoppedAt: null,
                creator: null,
                description: ""
            },
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
        
        await this.setState(state => {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    startedAt: Date.now(),
                    creator: userId,
                    task: taskId
                },
                openTimeCounnt: true
            }
        })
        //Setup thời thời gian chạy
        this.timer = setInterval(() => this.setState(state => {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    time: Date.now() - this.state.timer.startedAt,
                },
            }
        }), 100);
    }
    stopTimer = async (taskId,userId) => {
        await this.setState(state => {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    stoppedAt: Date.now(),
                    duration: Date.now()-this.state.timer.startedAt,
                    creator:userId,
                    task:taskId
                },
                openTimeCounnt:false
            }
        })
        
        var {timer} = this.state;
        console.log(timer)
        this.props.stopTimer(timer)
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
        window.$(`#modal-evaluate-task-by-${role}-${id}`).modal('show');

    }
    

    handleShowEvaluate = async (id, role) => {
        await this.setState(state => {
            return {
                ...state,
                showEvaluate: id
            }
        });
        window.$(`#modal-evaluate-task-by-${role}-${id}`).modal('show');

    }
    
    render() {
        const count = Date.now()-this.state.timer.startedAt
        const { translate } = this.props;
        var task, actions, informations, currentTimer, logTimer;
        var statusTask;
        const{currentUser}= this.state
        const { time } = this.state.timer;
        const { tasks, performtasks, user } = this.props;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) statusTask = task.status;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null && tasks.task.info.taskTemplate !== null) {
            actions = tasks.task.actions;
            informations = tasks.task.informations;
        }

        if (typeof performtasks.currentTimer !== "undefined") currentTimer = performtasks.currentTimer;
        if (performtasks.logtimer) logTimer = performtasks.logtimer;

        return (
      
            <div>
                {/* ------------TODO: code here--------------- */}
                {/* <a className="btn btn-app" data-toggle="modal" data-target="#modal-add-target" data-backdrop="static" data-keyboard="false">
                    <i className="fa fa-plus-circle" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.add_target')}
                </a>
                <OrganizationalUnitKpiAddTargetModal organizationalUnitKpiSetId={currentKPI._id} organizationalUnit={currentKPI.organizationalUnit} /> */}
                <div style={{ marginLeft: "-10px" }}>
                    <a className="btn btn-app" onClick={() => this.handleShowEdit(this.props.id, this.props.role)} data-backdrop="static" data-keyboard="false" title="Chỉnh sửa thông tin chung">
                        <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>Chỉnh sửa
                    </a>

                    {/* TODO: modal edit task */}

                    {/* <i class="material-icons">add</i> */}
                    <a className="btn btn-app" onClick={() => this.startTimer(task._id,currentUser)} title="Bắt đầu thực hiện công việc">
                        <i class="fa fa-clock-o" style={{ fontSize: "16px" }} aria-hidden="true" data-toggle="modal" href="#myModal"></i>Bấm giờ
                    </a>
                    
                    <a className="btn btn-app" onClick={() => this.handleShowEndTask(this.props.id, this.props.role)} data-toggle="modal" data-target="#modal-edit-task" data-backdrop="static" data-keyboard="false" title="Kết thúc công việc">
                        <i className="fa fa-power-off" style={{ fontSize: "16px" }}></i>Kết thúc
                    </a>

                    <a className="btn btn-app" onClick={() => this.handleShowEvaluate(this.props.id, this.props.role)} data-toggle="modal" data-target="#modal-edit-task" data-backdrop="static" data-keyboard="false" title="Đánh giá công việc">
                        <i className="fa fa-calendar-check-o" style={{ fontSize: "16px" }}></i>Đánh giá
                    </a>

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
                {this.state.openTimeCounnt &&
                        <Draggable
                        handle=".handle"
                        defaultPosition={{x: 0, y: 0}}
                        position={null}
                        grid={[1, 1]}
                        onStart={this.handleStart}
                        onDrag={this.handleDrag}
                        onStop={this.handleStop}>
                        <div className="handle" style={{height:"auto",width:'110px',backgroundColor:'white',zIndex:"1000000000000000000",border:"solid 1px",borderRadius:"20px",paddingLeft:"15px",paddingTop:'5px',paddingBottom:'5px'}}>
                           <ul className="list-inline" style={{marginBottom:'0px',marginTop:'2px',fontFamily:'sans-serif'}}>
                               <li>
                                    {moment.utc(count).format('HH:mm:ss')}
                               </li>
                               <li><a href="#" className="link-black text-lg" ><i class="fa fa-stop-circle-o fa-lg" aria-hidden="true" title="Dừng bấm giờ" onClick={() => this.stopTimer(task._id,currentUser)}></i></a></li>
                               
                           </ul>
                        </div>
                      </Draggable>
                    }    {/**14400000 */}
                {this.state.timer.time> 15000 &&
                <div>Mày làm quá 4 tiếng rồi em ê</div>}
                <br />
                <div>
                    
                    <div id="info" class="collapse in" style={{ margin: "10px 0px 0px 10px" }}>
                        <p><strong>Độ ưu tiên công việc:</strong> {task && task.priority}</p>
                        <p><strong>Trạng thái công việc:</strong> {task && task.status}</p>
                        <p><strong>Thời gian thực hiện:</strong> {}</p>
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
                                        <strong>Mô tả</strong>
                                        <div style={{ marginLeft: "10px" }}>
                                            <p>{task && task.description}</p>
                                        </div>
                                    </div>

                                    <br />
                                    <div>
                                        <strong>Vai trò</strong>
                                        <div style={{ marginLeft: "10px" }}>
                                            <p>Người thực hiện:</p>
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
                                            <p>Người phê duyệt:</p>
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

                                            {
                                                (task && task.consultedEmployees.length !== 0) &&
                                                <React-Fragment>
                                                    <p>Người phê duyệt:</p>
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
                                                </React-Fragment>
                                            }
                                            {
                                                (task && task.informedEmployees.length !== 0) &&
                                                <React-Fragment>
                                                    <p>Người phê duyệt:</p>
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
                                                </React-Fragment>
                                            }
                                        </div>
                                    </div>

                                    <br />
                                    <div>
                                        {/* Task information*/}
                                        <strong>Thông tin công việc</strong>
                                        <div style={{ marginLeft: "10px" }}>
                                            <p>-&nbsp;Mức độ hoàn thành: {task && task.progress}%</p>
                                            {
                                                (task && task.taskInformations.length !== 0) &&
                                                task.taskInformations.map(info => {
                                                    return <div>
                                                        <p>-&nbsp;{info.name}</p>
                                                        {/* &nbsp;-&nbsp;Giá trị: {info.value} */}
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-sm-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Đánh giá công việc</legend>

                                    {/* Evaluations */}
                                    <div>
                                        {/* <div className="tooltip2">
                                                    <a>
                                                        <i className="material-icons">help</i>
                                                    </a>
                                                    <span className="tooltip2text" style={{right: "0px"}}>
                                                    {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.content')}
                                                    </span>
                                                </div> */}

                                        {
                                            (task && task.evaluations.length !== 0) ?

                                            ( task.evaluations.map(eva => {
                                                if (eva.results.length !== 0) {
                                                    return <div>
                                                        <strong>Đánh giá ngày: <span>( {this.formatDate(eva.date)} )</span></strong>

                                                        <div style={{ marginLeft: "10px" }}>
                                                            {
                                                                eva.results.map((res) => {
                                                                    return <div >
                                                                        <p>{res.employee.name}&nbsp;-&nbsp;{res.role}&nbsp;-&nbsp;{res.automaticPoint}-{res.employeePoint}-{res.approvedPoint}</p>
                                                                    </div>
                                                                })
                                                            }
                                                        </div>
                                                        <br />

                                                        {/* Danh gia theo task infomation - thoong tin cong viec thang vua qua lam duoc nhung gi */}
                                                        <div style={{ marginLeft: "10px" }}>
                                                            <p>Mức độ hoàn thành: {task && task.progress}%</p>
                                                            {(task && task.point && task.point !== -1) ?
                                                                <p>Điểm công việc: {task && task.point}%</p> :
                                                                <p>Điểm công việc: Chưa được tính</p>
                                                            }

                                                            {
                                                                eva.taskInformations.map(info => {
                                                                    return <div>
                                                                        <p>{info.name}&nbsp;-&nbsp;Giá trị: {info.value}</p>
                                                                    </div>
                                                                })
                                                            }
                                                        </div>
                                                        <br />
                                                        <div style={{ marginLeft: "10px" }}>
                                                            {/* KPI */}
                                                            {(eva.kpis.length !== 0) &&
                                                                (
                                                                    eva.kpis.map(item => {
                                                                        return <div>
                                                                            <p>KPI &nbsp; {item.employee.name}: &nbsp;</p>
                                                                            {(item.kpis.length !== 0) ?
                                                                                <ol>
                                                                                    {
                                                                                        item.kpis.map(kpi => {
                                                                                            return <div>
                                                                                                <li>{kpi.name}</li>
                                                                                            </div>
                                                                                        })
                                                                                    }
                                                                                </ol>
                                                                                : <p>Chưa liên kết công việc với KPI</p>
                                                                            }
                                                                        </div>
                                                                    })
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                                else {
                                                    return <div style={{ marginLeft: "10px" }}>
                                                        {/* KPI */}
                                                        {(eva.kpis.length !== 0) &&
                                                            (
                                                                eva.kpis.map(item => {
                                                                    return <div>
                                                                        <p>KPI &nbsp; {item.employee.name}: &nbsp;</p>
                                                                        {(item.kpis.length !== 0) ?
                                                                            <ol>
                                                                                {
                                                                                    item.kpis.map(kpi => {
                                                                                        return <div>
                                                                                            <li>{kpi.name}</li>
                                                                                        </div>
                                                                                    })
                                                                                }
                                                                            </ol>
                                                                            : <p>Chưa liên kết công việc với KPI</p>
                                                                        }
                                                                    </div>
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                }
                                            })) 
                                            : <div>
                                                <p>Chưa đánh giá công viêc</p>
                                            </div> 
                                        }
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
                    />
                }

                {
                    (this.props.id && this.state.showEdit === this.props.id) && this.props.role === "accountable" &&
                    <ModalEditTaskByAccountableEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Chỉnh sửa công việc với vai trò người phê duyệt'
                    />
                }

                {
                    (this.props.id && this.state.showEvaluate === this.props.id && this.props.role === "responsible") &&
                    <EvaluateByResponsibleEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Đánh giá công việc với vai trò người thực hiện'
                    />
                }
                {
                    (this.props.id && this.state.showEvaluate === this.props.id && this.props.role === "accountable") &&
                    <EvaluateByAccountableEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Đánh giá công việc với vai trò người phê duyệt'
                    />
                }
                {
                    (this.props.id && this.state.showEvaluate === this.props.id && this.props.role === "consulted") &&
                    <EvaluateByConsultedEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Đánh giá công việc với vai trò người hỗ trợ'
                    />
                }


                {
                    (this.props.id && this.state.showEndTask === this.props.id && this.props.role === "responsible") &&
                    <EvaluateByResponsibleEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Kết thúc công việc với vai trò người thực hiện'
                    />
                }
                {
                    (this.props.id && this.state.showEndTask === this.props.id && this.props.role === "accountable") &&
                    <EvaluateByAccountableEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Kết thúc công việc với vai trò người phê duyệt'
                    />
                }
                {
                    (this.props.id && this.state.showEndTask === this.props.id && this.props.role === "consulted") &&
                    <EvaluateByConsultedEmployee
                        id={this.props.id}
                        role={this.props.role}
                        title='Kết thúc công việc với vai trò người hỗ trợ'
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
    getStatusTimer: performTaskAction.getTimerStatusTask
}

const detailTask = connect(mapStateToProps, actionGetState)(withTranslate(DetailTaskTab));

export { detailTask as DetailTaskTab };