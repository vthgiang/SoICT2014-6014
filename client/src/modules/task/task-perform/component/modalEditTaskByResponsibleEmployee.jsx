import React, { Component } from 'react';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components/';
import { taskManagementActions } from "../../task-management/redux/actions";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from "../../../../config";


class ModalEditTaskByResponsibleEmployee extends Component {

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

    save = () => {
        console.log('submitted form edit task');
    }

    componentDidMount() {
        this.props.getTaskById(this.props.id);
    }

    render() {
        const {task, taskInformation } = this.state;
        const { errorTaskName, errorTaskDescription, errorTaskProgress } = this.state;

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

                                {/*KPI related*/}
                                <div className="form-group">
                                    <label>Liên kết KPI</label>
                                    {
                                        <SelectBox
                                            id={`select-kpi-personal`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {[]}
                                            onChange=""
                                            multiple={true}
                                            value=""
                                        />
                                    }
                                </div>
                            </fieldset>


                        </form>
                    </DialogModal>
                </React.Fragment>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { tasks } = state;
    return { tasks };
}

const actionGetState = { //dispatchActionToProps
    getTaskById: taskManagementActions.getTaskById,
}

const modalEditTaskByResponsibleEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByResponsibleEmployee));
export { modalEditTaskByResponsibleEmployee as ModalEditTaskByResponsibleEmployee };
