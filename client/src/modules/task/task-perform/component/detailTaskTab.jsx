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


import {
    getStorage
} from '../../../../config';

class DetailTaskTab extends Component {

    constructor(props) {

        var idUser = getStorage("userId");

        super(props);
        this.state = {
            collapseInfo: false,

            startTimer: false,
            pauseTimer: false,

            timer: {
                task: this.props.id,
                startTimer: "",
                stopTimer: null,
                user: idUser,
                time: 0,
            },

            showModalApprove: "",
            showEdit: ""
        }
    }

    // componentDidUpdate() {
    //     // console.log('did update');
    //     if (this.props.id !== undefined) {
    //         let script3 = document.createElement('script');
    //         script3.src = '../lib/main/js/CoCauToChuc.js';
    //         script3.async = true;
    //         script3.defer = true;
    //         document.body.appendChild(script3);
    //         const { performtasks } = this.props;
    //         var currentTimer;
    //         if (typeof performtasks.currentTimer !== "undefined") currentTimer = performtasks.currentTimer;
    //         if (currentTimer && this.state.timer.startTimer === "") {
    //             this.setState(state => {
    //                 return {
    //                     ...state,
    //                     timer: {
    //                         ...currentTimer,
    //                         startTimer: currentTimer.startTimer - currentTimer.time
    //                     },
    //                     startTimer: true,
    //                     pauseTimer: currentTimer.pause,
    //                 }
    //             })
    //             //Chỉnh giao diện
    //             document.getElementById("start-timer-task").style.width = "20%";
    //             document.getElementById("btn-approve").style.marginLeft = "50%";
    //             // Setup thời thời gian chạy
    //             if (currentTimer.pause === false) {
    //                 this.timer = setInterval(() => this.setState(state => {
    //                     return {
    //                         ...state,
    //                         timer: {
    //                             ...state.timer,
    //                             time: Date.now() - this.state.timer.startTimer,
    //                         },
    //                     }
    //                 }), 1000);
    //             }
    //         }
    //     }

    // }

    componentDidMount() {
        // console.log('did mount');
        let script2 = document.createElement('script');
        script2.src = '../lib/main/js/uploadfile/custom.js';
        script2.async = true;
        script2.defer = true;
        document.body.appendChild(script2);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log('derived state from prop');
        if (nextProps.id !== prevState.id) {
            // console.log('nextProps.id !== prevState.id', nextProps.id , prevState.id);
            return {
                ...prevState,
                id: nextProps.id
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // console.log('should update');
        if (nextProps.id !== this.state.id) {
            // console.log('nextProps.id !== this.state.id', nextProps.id ,this.state.id, nextState.id);
            this.props.getLogTimer(nextProps.id);
            this.props.getTaskById(nextProps.id);
            // this.props.getTaskActions(nextProps.id);
            this.props.getStatusTimer(nextProps.id);

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

    // ========================TIMER=========================

    // startTimer = async () => {
    //     //Chỉnh giao diện
    //     document.getElementById("start-timer-task").style.width = "20%";
    //     document.getElementById("btn-approve").style.marginLeft = "50%";
    //     await this.setState(state => {
    //         return {
    //             ...state,
    //             timer: {
    //                 ...state.timer,
    //                 startTimer: Date.now()
    //             }
    //         }
    //     })
    //     this.props.startTimer(this.state.timer);
    //     //Chỉnh trạng thái bấm giờ và update database
    //     await this.setState(state => {
    //         return {
    //             ...state,
    //             timer: {
    //                 ...state.timer,
    //                 time: 0,
    //                 startTimer: Date.now(),
    //             },
    //             startTimer: true,
    //             pauseTimer: false
    //         }
    //     })
    //     // Setup thời thời gian chạy
    //     this.timer = setInterval(() => this.setState(state => {
    //         return {
    //             ...state,
    //             timer: {
    //                 ...state.timer,
    //                 time: Date.now() - this.state.timer.startTimer,
    //             },
    //         }
    //     }), 1);
    // }
    // stopTimer = async (timer) => {
    //     await this.setState(state => {
    //         return {
    //             ...state,
    //             timer: {
    //                 ...state.timer,
    //                 stopTimer: Date.now(),
    //             },
    //             startTimer: false,
    //             pauseTimer: false
    //         }
    //     })
    //     // Xóa biến timer
    //     clearInterval(this.timer);
    //     // Chỉnh giao diện
    //     document.getElementById("start-timer-task").style.width = "9%";
    //     document.getElementById("btn-approve").style.marginLeft = "80%";

    //     Swal.fire({
    //         title: "Thời gian đã làm: " + this.convertTime(this.state.timer.time),
    //         type: 'success',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Lưu'
    //     }).then((res) => {
    //         // Update dữ liệu: Thời gian kết thúc, time = oldTime + newTime
    //         this.props.stopTimer(timer._id, this.state.timer);
    //         this.setState(state => {
    //             // TODO: test sau
    //             return {
    //                 ...state,
    //                 timer: {
    //                     task: this.props.id,
    //                     startTimer: "",
    //                     stopTimer: null,
    //                     time: 0
    //                 }
    //             }
    //         })
    //     });
    //     // reset trạng thái timer
    // }
    // pauseTimer = async (timer) => {
    //     // Chuyển sang trạng thái dừng bấm giờ
    //     await this.setState(state => {
    //         return {
    //             ...state,
    //             pauseTimer: true
    //         }
    //     })
    //     // Xóa biến timer
    //     clearInterval(this.timer);
    //     // Update database: time
    //     this.props.pauseTimer(timer._id, this.state.timer);
    // }
    // continueTimer = async (timer) => {
    //     await this.setState(state => {
    //         return {
    //             ...state,
    //             timer: {
    //                 ...state.timer,
    //                 startTimer: Date.now()
    //             },
    //             startTimer: true,
    //             pauseTimer: false,
    //         }
    //     })
    //     this.props.continueTimer(timer._id, this.state.timer);
    //     await this.setState(state => {
    //         return {
    //             ...state,
    //             timer: {
    //                 ...state.timer,
    //                 startTimer: this.state.timer.startTimer - this.state.timer.time
    //             },
    //             startTimer: true,
    //             pauseTimer: false,
    //         }
    //     })
    //     this.timer = setInterval(() => this.setState(state => {
    //         return {
    //             ...state,
    //             timer: {
    //                 ...state.timer,
    //                 time: Date.now() - this.state.timer.startTimer,
    //             },
    //         }
    //     }), 1);
    // }
    // convertTime = (duration) => {
    //     // var milliseconds = parseInt((duration % 1000) / 100),
    //     var seconds = Math.floor((duration / 1000) % 60),
    //         minutes = Math.floor((duration / (1000 * 60)) % 60),
    //         hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    //     hours = (hours < 10) ? "0" + hours : hours;
    //     minutes = (minutes < 10) ? "0" + minutes : minutes;
    //     seconds = (seconds < 10) ? "0" + seconds : seconds;

    //     return hours + ":" + minutes + ":" + seconds;
    // }

    // =============================END TIMER==================================

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

    calculateOverdueDate = (enddate) => {
        var endTime = new Date(enddate).getTime();
        var time = Date.now() - endTime - 1000 * 3600 * 24;
        if (time <= 0) {
            return 0;
        } else {
            var day = Math.ceil(time / (1000 * 3600 * 24));
            return day;
        }
    }

    // Chuyển thời gian về định dạng mong muốn
    toDate = (date) => {
        if (date === void 0) {
            return new Date(0);
        }
        if (this.isDate(date)) {
            return date;
        } else {
            return new Date(parseFloat(date.toString()));
        }
    }
    isDate = (date) => {
        return (date instanceof Date);
    }
    format = (date, format) => {
        var d = this.toDate(date);
        return format
            .replace(/Y/gm, d.getFullYear().toString())
            .replace(/m/gm, ('0' + (d.getMonth() + 1)).substr(-2))
            .replace(/d/gm, ('0' + (d.getDate() + 1)).substr(-2))
            .replace(/H/gm, ('0' + (d.getHours() + 0)).substr(-2))
            .replace(/i/gm, ('0' + (d.getMinutes() + 0)).substr(-2))
            .replace(/s/gm, ('0' + (d.getSeconds() + 0)).substr(-2))
            .replace(/v/gm, ('0000' + (d.getMilliseconds() % 1000)).substr(-3));
    }

    handleShowEdit = async (id, role) => {
        console.log('edit id', id);
        console.log('edit role', role);
        await this.setState(state => {
            return {
                ...state,
                showEdit: id
            }
        });
        window.$(`#modal-edit-task-by-${role}-${id}`).modal('show');

    }
    handleShowEndTask = async (id, role) => {
        console.log('End id', id);
        console.log('ENd role', role);
        await this.setState(state => {
            return {
                ...state,
                showEndTask: id
            }
        });
        window.$(`#modal-evaluate-task-by-${role}-${id}`).modal('show');

    }
    handleShowEvaluate = async (id, role) => {
        console.log('id', id);
        console.log('role', role);
        await this.setState(state => {
            return {
                ...state,
                showEvaluate: id
            }
        });
        window.$(`#modal-evaluate-task-by-${role}-${id}`).modal('show');

    }

    render() {

        const { translate } = this.props;
        var task, actions, informations, currentTimer, logTimer;
        var statusTask;
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
                    <a className="btn btn-app" onClick={() => this.startTimer()} title="Bắt đầu thực hiện công việc">
                        <i class="fa fa-clock-o" style={{ fontSize: "16px" }} aria-hidden="true"></i>Bấm giờ
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
                <br />
                <div>

                    <div id="info" class="collapse in" style={{ margin: "10px 0px 0px 10px" }}>
                        <p><strong>Độ ưu tiên công việc:</strong> {task && task.priority}</p>
                        <p><strong>Trạng thái công việc:</strong> {task && task.status}</p>
                        <p><strong>Thời gian thực hiện:</strong> {this.formatDate(task && task.startDate)} - {this.formatDate(task && task.endDate)}</p>
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
                                            <p>Mức độ hoàn thành: {task && task.progress}%</p>
                                            {
                                                (task && task.taskInformations.length !== 0) &&
                                                task.taskInformations.map(info => {
                                                    return <div>
                                                        <p>{info.name}&nbsp;-&nbsp;Giá trị: {info.value}</p>
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

                                            (task.evaluations.map(eva => {
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
                                            })): <p>Chưa đánh giá công viêc</p>
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

                {/*{*/}
                {/*    (this.props.id && this.state.showEdit === this.props.id) &&*/}
                {/*    <ModalEditTaskByResponsibleEmployee*/}
                {/*        id={`editTask${this.props.id}`}*/}
                {/*    />*/}
                {/*}*/}


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
    pauseTimer: performTaskAction.pauseTimerTask,
    continueTimer: performTaskAction.continueTimerTask,
    stopTimer: performTaskAction.stopTimerTask,
    getLogTimer: performTaskAction.getLogTimerTask,
    getStatusTimer: performTaskAction.getTimerStatusTask
}

const detailTask = connect(mapStateToProps, actionGetState)(withTranslate(DetailTaskTab));

export { detailTask as DetailTaskTab };