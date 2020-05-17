import React, { Component } from 'react';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components/';
import { taskManagementActions } from "../../task-management/redux/actions";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from "../../../../config";
import { UserActions } from "../../../super-admin/user/redux/actions";


class ModalEditTaskByAccountableEmployee extends Component {

    constructor(props) {
        super(props);

        var userId = getStorage("userId");


        let { tasks } = this.props;

        let task = (tasks && tasks.task) && tasks.task.info;
        let taskInformation = [{name: "Số nợ cần thu", value: 100},{name: "Số nợ đã thu", value: 60},{name: "Loại thuốc cần thu", value: "Thuốc viên"}];
        // let taskInformation = task && task.taskInformations;

        this.state = {
            userId: userId,
            task: task,
            taskInformation: taskInformation,
        }
    }

    handleTaskNameChange = event => {
        let value = event.target.value;
        this.validateTaskName(value, true);
    }

    validateTaskName = (value, willUpdateState) => {
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = "Tên công việc không được để trống";
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskName: value,
                    errorTaskName: errorMessage
                }
            })
        }
        return errorMessage === undefined;
    }

    handleTaskDescriptionChange = event => {
        let value = event.target.value;
        this.validateTaskDescription(value, true);
    }

    validateTaskDescription = (value, willUpdateState) => {
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = "Mô tả công việc không được để trống";
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskDescription: value,
                    errorTaskDescription: errorMessage,
                }
            })
        }
        return errorMessage === undefined;
    }

    handleTaskProgressChange = event => {
        let value = event.target.value;
        this.validateTaskProgress(value, true);
    }

    validateTaskProgress = (value, willUpdateState) => {
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = "Hãy nhập mức độ hoàn thành công việc";
        }
        if (value !== undefined && isNaN(value)) {
            errorMessage = "Mức độ hoàn thành phải có định dạng number";
        }
        if (value < 0 || value > 100) {
            errorMessage = "Mức độ hoàn thành phải trong khoảng 0 - 100";
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskProgress: value,
                    errorTaskProgress: errorMessage,
                }
            })
        }
        return errorMessage === undefined;
    }

    isFormValidated = () => {
        return this.validateTaskName(this.state.taskName, false)
            && this.validateTaskDescription(this.state.taskDescription, false)
            && this.validateTaskProgress(this.state.taskProgress, false);
    }

    handleSelectedPriority = () => {
        console.log("selected priority")
    }

    handleSelectedStatus = () => {
        console.log("selected status")
    }

    handleSelectedResponsibleEmployee = () => {
        console.log('selected responsible employee');
    }

    save = () => {
        console.log('submitted form edit task');
    }

    componentDidMount() {
        this.props.getTaskById(this.props.id);
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    }

    render() {
        const {task, taskInformation } = this.state;
        const { errorTaskName, errorTaskDescription, errorTaskProgress } = this.state;

        const { user } = this.props;
        var departmentUsers = [];
        if (user.userdepartments) departmentUsers = user.userdepartments;

        let priorityOptions = [{value: 3, text: "Cao"}, {value: 2, text:"Trung bình"}, {value: 1, text:"Thấp"}];
        let statusOptions = [{value: 1, text: "Inprocess"}, {value: 2, text:"WaitForApproval"}, {value: 3, text:"Finished"}, {value: 4, text:"Delayed"}, {value: 5, text:"Canceled"}];

        return (
            <div>
                <React.Fragment>
                    <DialogModal
                        size="50"
                        modalID={`modal-edit-task-by-${this.props.role}-${this.props.id}`}
                        formID={`form-edit-task-${this.props.role}-${this.props.id}`}
                        title={this.props.title}
                        isLoading={false}
                        func={this.save}
                        disableSubmit={!this.isFormValidated()}
                    >
                        <form id={`form-edit-task-${this.props.role}-${this.props.id}`}>
                            {/*Thông tin cơ bản*/}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin cơ bản</legend>
                                <div>
                                    {/*Input for task name*/}
                                    <div className={`form-group ${errorTaskName === undefined ? "" : "has-error"}`}>
                                        <label>Tên công việc<span className="text-red">*</span></label>
                                        <input type="text"
                                               value={this.state.taskName !== undefined ? this.state.taskName : task && task.name}
                                               className="form-control" onChange={this.handleTaskNameChange}/>
                                        <ErrorLabel content={errorTaskName}/>
                                    </div>
                                    {/*Input for task description*/}
                                    <div
                                        className={`form-group ${errorTaskDescription === undefined ? "" : "has-error"}`}>
                                        <label>Mô tả công việc<span className="text-red">*</span></label>
                                        <input type="text"
                                               value={this.state.taskDescription !== undefined ? this.state.taskDescription : task && task.description}
                                               className="form-control" onChange={this.handleTaskDescriptionChange}/>
                                        <ErrorLabel content={errorTaskDescription}/>
                                    </div>
                                </div>
                            </fieldset>

                            {/*Thông tin chi tiết*/}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin chi tiết</legend>
                                <div>

                                    {/*Trạng thái*/}
                                    <div className="form-group">
                                        <label>Mức ưu tiên</label>
                                        {
                                            <SelectBox
                                                id={`select-status`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items = {statusOptions}
                                                multiple={false}
                                                value={statusOptions.filter(s => s.text === task.status)[0].value}
                                                onChange={this.handleSelectedStatus}
                                            />
                                        }
                                    </div>

                                    {/*Mức ưu tiên*/}
                                    <div className="form-group">
                                        <label>Mức ưu tiên</label>
                                        {
                                            <SelectBox
                                                id={`select-priority`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items = {priorityOptions}
                                                multiple={false}
                                                value={priorityOptions.find(p => p.value === task.priority)}
                                                onChange={this.handleSelectedPriority}
                                            />
                                        }
                                    </div>

                                    {/*Mức độ hoàn thành*/}
                                    <div className={`form-group ${errorTaskProgress === undefined ? "" : "has-error"}`}>
                                        <label>Mức độ hoàn thành</label>
                                        <input type="text"
                                               value={this.state.taskProgress !== undefined ? this.state.taskProgress : task && task.progress}
                                               className="form-control" onChange={this.handleTaskProgressChange}/>
                                        <ErrorLabel content={errorTaskProgress}/>
                                    </div>

                                    {/*Task information*/}
                                    {
                                        (taskInformation != null && taskInformation.length !== 0) && taskInformation.map((info, index) => {
                                            return <div
                                                className={`form-group`}>
                                                <label>{info.name}</label>
                                                <input type="text"
                                                       value={info.value}
                                                       className="form-control"
                                                       onChange=""/>
                                            </div>
                                        })
                                    }
                                </div>
                            </fieldset>

                            {/*Người thực hiện*/}
                            <div className="form-group">
                                <label>Người thực hiện</label>
                                {
                                    <SelectBox
                                        id={`select-responsible-employee`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items = {departmentUsers.map(employee => { return { value: employee._id, text: employee.userId.name } })}
                                        onChange={this.handleSelectedResponsibleEmployee}
                                        multiple={true}
                                        value=""
                                    />
                                }
                            </div>

                            {/*Người phê duyệt*/}
                            <div className="form-group">
                                <label>Người phê duyệt</label>
                                {
                                    <SelectBox
                                        id={`select-accountable-employee`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items = {departmentUsers.map(employee => { return { value: employee._id, text: employee.userId.name } })}
                                        onChange={this.handleSelectedResponsibleEmployee}
                                        multiple={true}
                                        value=""
                                    />
                                }
                            </div>

                            {/*Người hỗ trợ*/}
                            <div className="form-group">
                                <label>Người hỗ trợ</label>
                                {
                                    <SelectBox
                                        id={`select-consulted-employee`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items = {departmentUsers.map(employee => { return { value: employee._id, text: employee.userId.name } })}
                                        onChange={this.handleSelectedResponsibleEmployee}
                                        multiple={true}
                                        value=""
                                    />
                                }
                            </div>

                            {/*Người giám sát*/}
                            <div className="form-group">
                                <label>Người giám sát</label>
                                {
                                    <SelectBox
                                        id={`select-informed-employee`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items = {departmentUsers.map(employee => { return { value: employee._id, text: employee.userId.name } })}
                                        onChange={this.handleSelectedResponsibleEmployee}
                                        multiple={true}
                                        value=""
                                    />
                                }
                            </div>

                        </form>
                    </DialogModal>
                </React.Fragment>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { tasks, user } = state;
    return { tasks, user };
}

const actionGetState = { //dispatchActionToProps
    getTaskById: taskManagementActions.getTaskById,
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment
}

const modalEditTaskByAccountableEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByAccountableEmployee));
export { modalEditTaskByAccountableEmployee as ModalEditTaskByAccountableEmployee };
