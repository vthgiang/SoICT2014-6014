import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { withTranslate } from 'react-redux-multilingual';
import { performTaskAction } from '../redux/actions';
import { DialogModal, ErrorLabel, ButtonModal } from '../../../../common-components';
import { taskManagementActions } from '../../task-management/redux/actions';

class ModalApproveTask extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }
    UNSAFE_componentWillMount() {
        this.props.getTaskById(this.props.taskID);
    }
    
    addResult = (taskID) => { // tạo mới result task rồi thêm vào db, cập nhật lại result trong task
        var { currentUser, role, performtasks } = this.props;
        //1-responsible, 2-accountable, 3-consulted
        if (role === "responsible") {
            return this.props.createResult({
                result: {
                    employee: currentUser,
                    automaticPoint: this.state.automaticPoint,
                    employeePoint: this.state.employeePoint1,
                    approvedPoint: this.state.approvedPoint1,
                    role: "responsible"
                },
                task: taskID
            });
        } else if (role === "consulted") {
            return this.props.createResult({
             
                result: {
                    employee: currentUser,
                    automaticPoint: this.state.automaticPoint,
                    employeePoint: this.state.employeePoint2,
                    approvedPoint: this.state.approvedPoint2,
                    role: "consulted"
                },
                task: taskID
            });
        } else if (role === "accountable") {
            var employeePoint = this.state.employeePoint3;
            return this.props.createResult({
   
                result: {
                    employee: currentUser,
                    automaticPoint: this.state.automaticPoint,
                    employeePoint: employeePoint,
                    approvedPoint: employeePoint,
                    role: "accountable"
                },
                task: taskID
            });
        }
    }

    confirmResult = (taskID) => {
        var { tasks, performtasks } = this.props;
        var task;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
        var listResult = [
            {
                automaticPoint: this.state.automaticPoint,
                employeePoint: this.state.employeePoint1,
                approvedPoint: this.state.approvedPoint1,
                _id: task && task.results[0]._id,
                employee: task && task.responsibleEmployees[0]._id,
                role: "responsible"
            },
            {
                automaticPoint: this.state.automaticPoint,
                employeePoint: this.state.employeePoint2,
                approvedPoint: this.state.approvedPoint2,
                _id: task && task.results[1]._id,
                employee: task && task.consultedEmployees[0]._id,
                roleMember: "consulted"
            }
        ]; // currentTask.results;
        return this.props.editResultTask(listResult, taskID);
    }

    handleChangeMyPoint = async () => {
        await this.setState(state => {
            var percent = parseInt(this.percent.value);
            var a = this.validatePoint(percent)
            return {
                ...state,
                automaticPoint: percent,
                errorOnPercent: this.validatePoint(percent)
            }
        });

    }

    onHandleChange = async (e, namePoint) => {
        // var name = e.target.name;
        var value = parseInt(e.target.value);
        if (namePoint === "automaticPoint") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    automaticPoint: value,
                    errorOnPercent: this.validatePoint(value)
                }
            });
        }
        if (namePoint === "employeePoint1") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    employeePoint1: value,
                    errorOnResponsibleEmployeePoint: this.validatePoint(value)
                }
            });
        }
        if (namePoint === "approvedPoint1") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    approvedPoint1: value,
                    errorOnResponsibleApprovedPoint: this.validatePoint(value)
                }
            });
        }
        if (namePoint === "employeePoint2") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    employeePoint2: value,
                    errorOnConsultedEmployeePoint: this.validatePoint(value)
                }
            });
        }
        if (namePoint === "approvedPoint2") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    approvedPoint2: value,
                    errorOnConsultedApprovedPoint: this.validatePoint(value)
                }
            });
        }
        if (namePoint === "employeePoint3") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    employeePoint3: value,
                    errorOnApprovedPoint: this.validatePoint(value)
                }
            });
        }
        // console.log(this.state);
    }

    validatePoint = (value) => {
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = "Giá trị không được vượt quá khoảng 0-100";
        }
        if (isNaN(value)) {
            msg = "Giá trị không được để trống";
        }
        return msg;
    }

    save = () => {
        var { tasks, currentUser, role, performtasks } = this.props;
        if (role === "responsible") {
            var status = { status: "Chờ phê duyệt" };
            this.addResult(this.props.taskID);
            return this.props.editStatusOfTask(this.props.taskID, status);
        }
        else if (role === "consulted") {
            return this.addResult(this.props.taskID);
        }
        else if (role === "accountable") {
            var status = { status: "Đã hoàn thành" };
            this.addResult(this.props.taskID);
            this.confirmResult(this.props.taskID);
            return this.props.editStatusOfTask(this.props.taskID, status);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) { // nếu next != prev thì cập nhật state
        const { tasks } = nextProps;
        if (nextProps.taskID !== prevState.taskID) {
            var task;
            var responsiblePoint, consultedPoint, accountablePoint;
            if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
            if (task && task.results) {
                var listResult = task.results;
                listResult.map((item) => {
                    if (task.responsibleEmployees[0]._id === item.employee && item.role === "responsible") responsiblePoint = item;
                    if (task.consultedEmployees[0]._id === item.employee && item.role === "consulted") consultedPoint = item;
                    if (task.accountableEmployees[0]._id === item.employee && item.role === "accountable") accountablePoint = item;
                })
            }
            const automaticPoint_def = (responsiblePoint) ? responsiblePoint.automaticPoint : 0;
            const defaultPoint = {
                automaticPoint: (responsiblePoint) ? responsiblePoint.automaticPoint : 0,
                responsible: {
                    employeePoint: (responsiblePoint) ? responsiblePoint.employeePoint : 0,
                    approvedPoint: (responsiblePoint) ? responsiblePoint.approvedPoint : 0
                },
                consulted: {
                    employeePoint: (consultedPoint) ? consultedPoint.employeePoint : 0,
                    approvedPoint: (consultedPoint) ? consultedPoint.approvedPoint : 0
                },
                accountable: {
                    employeePoint: (accountablePoint) ? (accountablePoint.employeePoint) : automaticPoint_def
                }
            }
            return {
                ...prevState,
                //  automaticPoint, employeePoint1, employeePoint2, employeePoint3, approvedPoint1, approvedPoint2 
                taskID: nextProps.taskID,
                automaticPoint: task && defaultPoint.automaticPoint,
                employeePoint1: task && defaultPoint.responsible.employeePoint,
                approvedPoint1: task && defaultPoint.responsible.approvedPoint,
                employeePoint2: task && defaultPoint.consulted.employeePoint,
                approvedPoint2: task && defaultPoint.consulted.approvedPoint,
                employeePoint3: task && defaultPoint.accountable.employeePoint,

                errorOnApprovedPoint: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnConsultedApprovedPoint: undefined,
                errorOnConsultedEmployeePoint: undefined,
                errorOnPercent: undefined,
                errorOnResponsibleApprovedPoint: undefined,
                errorOnResponsibleEmployeePoint: undefined,
                errorOnAutomaticPoint: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { currentUser, role, resultTask } = this.props;
        var { automaticPoint, employeePoint1, employeePoint2, employeePoint3, approvedPoint1, approvedPoint2 } = this.state;
        var { errorOnApprovedPoint, errorOnConsultedApprovedPoint, errorOnConsultedEmployeePoint, errorOnPercent, errorOnResponsibleApprovedPoint, errorOnResponsibleEmployeePoint, errorOnAutomaticPoint } = this.state;

        return (
            <React.Fragment>
                {/* <ModalButton modalID="modal-approve-task" button_name="Yêu cầu phê duyệt" title="Yêu cầu phê duyệt"/> */}
                <DialogModal
                    size="50"
                    modalID={`modal-approve-task-${this.props.taskID}`}
                    formID="form-approve-task"
                    title="Yêu cầu kết thúc công việc"
                    msg_success="Yêu cầu kết thúc công việc thành công"
                    msg_faile="Yêu cầu kết thúc công việc không thành công"
                    func={this.save}
                >
                    {/* <div className="form-inline" > */}
                    <form id="form-approve-task" >


                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin công việc*:</legend>
                            <div className={`form-group ${errorOnPercent === undefined ? "" : "has-error"}`}>
                                <label className="form-control-static" htmlfor="percent">Công việc hoàn thành(%):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="percent"
                                    placeholder={10}
                                    ref={input => this.percent = input}
                                    value={automaticPoint}
                                    onChange={() => this.handleChangeMyPoint()}
                                    disabled={role !== "responsible"}
                                />
                                <ErrorLabel content={errorOnPercent} />
                            </div>
                            <div className={`form-group ${errorOnAutomaticPoint === undefined ? "" : "has-error"}`}>
                                <label className="form-control-static" htmlfor="automaticPoint">Điểm hệ thống:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="automaticPoint"
                                    placeholder={10}
                                    // ref={input => this.automaticPoint = input} 
                                    // defaultValue={task && defaultPoint.automaticPoint} 
                                    disabled="true"
                                    name="automaticPoint"
                                    value={automaticPoint}
                                    onChange={(e) => this.onHandleChange(e, "automaticPoint")}
                                />
                                <ErrorLabel content={errorOnAutomaticPoint} />
                            </div>
                        </fieldset>

                        {(role === "responsible" || role === "accountable") &&
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Vai trò người thực hiện:</legend>
                                <div className={`form-group ${errorOnResponsibleEmployeePoint === undefined ? "" : "has-error"}`}>
                                    <label className="form-control-static" htmlfor="employeePoint1">Điểm tự đánh giá:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="employeePoint1"
                                        placeholder={80}
                                        // ref={input => this.employeePoint1 = input} 
                                        // defaultValue={task && defaultPoint.responsible.employeePoint} 
                                        disabled={role !== "responsible"}
                                        name="employeePoint1"
                                        value={employeePoint1}
                                        onChange={(e) => this.onHandleChange(e, "employeePoint1")}
                                    />
                                    <ErrorLabel content={errorOnResponsibleEmployeePoint} />
                                </div>
                                <div className={`form-group ${errorOnResponsibleApprovedPoint === undefined ? "" : "has-error"}`}>
                                    <label className="form-control-static" htmlfor="approvedPoint1">Điểm quản lý đánh giá:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="approvedPoint1"
                                        placeholder={80}
                                        // ref={input => this.approvedPoint1 = input} 
                                        // defaultValue={task && defaultPoint.responsible.approvedPoint} 
                                        disabled={role !== "accountable"}
                                        name="approvedPoint1"
                                        value={approvedPoint1}
                                        onChange={(e) => this.onHandleChange(e, "approvedPoint1")}
                                    />
                                    <ErrorLabel content={errorOnResponsibleApprovedPoint} />
                                </div>
                            </fieldset>
                        }

                        {(role === "consulted" || role === "accountable") &&
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Vai trò người hỗ trợ:</legend>
                                <div className={`form-group ${errorOnConsultedEmployeePoint === undefined ? "" : "has-error"}`}>
                                    <label className="form-control-static" htmlfor="employeePoint2">Điểm tự đánh giá:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="employeePoint2"
                                        placeholder={10}
                                        // ref={input => this.employeePoint2 = input} 
                                        // defaultValue={task && defaultPoint.consulted.employeePoint} 
                                        disabled={role !== "consulted"}
                                        name="employeePoint2"
                                        value={employeePoint2}
                                        onChange={(e) => this.onHandleChange(e, "employeePoint2")}
                                    />
                                    <ErrorLabel content={errorOnConsultedEmployeePoint} />
                                </div>
                                <div className={`form-group ${errorOnConsultedApprovedPoint === undefined ? "" : "has-error"}`}>
                                    <label className="form-control-static" htmlfor="approvedPoint2">Điểm quản lý đánh giá:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="approvedPoint2"
                                        placeholder={10}
                                        // ref={input => this.approvedPoint2 = input} 
                                        // defaultValue={task && defaultPoint.consulted.approvedPoint} 
                                        disabled={role !== "accountable"}
                                        name="approvedPoint2"
                                        value={approvedPoint2}
                                        onChange={(e) => this.onHandleChange(e, "approvedPoint2")}
                                    />
                                    <ErrorLabel content={errorOnConsultedApprovedPoint} />
                                </div>
                            </fieldset>
                        }
                        {(role === "accountable") &&
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Vai trò người phê duyệt:</legend>
                                <div className={`form-group ${errorOnApprovedPoint === undefined ? "" : "has-error"}`}>
                                    <label className="form-control-static" htmlfor="employeePoint3">Điểm tự đánh giá:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="employeePoint3"
                                        placeholder={10}
                                        // ref={input => this.employeePoint3 = input} 
                                        // defaultValue={task && defaultPoint.accountable.employeePoint} 
                                        disabled={role !== "accountable"}
                                        name="employeePoint3"
                                        value={employeePoint3}
                                        onChange={(e) => this.onHandleChange(e, "employeePoint3")}
                                    />
                                    <ErrorLabel content={errorOnApprovedPoint} />
                                </div>
                            </fieldset>
                        }


                    </form>
                    {/* </div> */}

                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks } = state; // tasks,
    return { tasks, performtasks }; // tasks,
}
const getState = {
    // create: DepartmentActions.create
    getTaskById: taskManagementActions.getTaskById,
    createResult: performTaskAction.createResultTask,
    editResultTask: performTaskAction.editResultTask,
    editStatusOfTask: taskManagementActions.editStatusOfTask
}

export default connect(mapState, getState)(ModalApproveTask); 
