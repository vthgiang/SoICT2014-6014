import React, { Component } from 'react';
import { DialogModal, ButtonModal, ErrorLabel } from '../../../../common-components/index';
import { taskManagementActions } from "../../task-management/redux/actions";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";


class ModalEditTaskByResponsibleEmployee extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    handleTaskNameChange = event => {
        let value = event.target.value;
        this.validateTaskName(value, true);
    }


    validateTaskName = (value, willUpdateState) => {
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = "Hãy điền tên công việc";
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
            errorMessage = "Hãy điền mô tả công việc";
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskDescription: value,
                    errorTaskDescription: errorMessage
                }
            })
        }
        return errorMessage === undefined;
    }

    isFormValidated = () => {
        return this.validateTaskName(this.state.taskName, false) && this.validateTaskDescription(this.state.taskDescription, false);
    }

    componentDidMount() {
        this.props.getTaskById(this.props.id);
    }

    render() {
        const { tasks } = this.props;
        const task = (tasks && tasks.task) && tasks.task.info;
        const taskInformation =  task && task.taskInformation;



        const { errorTaskName, errorTaskDescription } = this.state;

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
                                        <label>Tên công việc:<span className="text-red">*</span></label>
                                        <input type="text"
                                               value={this.state.taskName !== undefined ? this.state.taskName : task && task.name}
                                               className="form-control" onChange={this.handleTaskNameChange}/>
                                        <ErrorLabel content={errorTaskName}/>
                                    </div>
                                    {/*Input for task description*/}
                                    <div
                                        className={`form-group ${errorTaskDescription === undefined ? "" : "has-error"}`}>
                                        <label>Mô tả công việc:<span className="text-red">*</span></label>
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
                                    {/*Task information*/}
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
