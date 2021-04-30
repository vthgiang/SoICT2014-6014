import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { getStorage } from '../../../../config';
import { getCurrentProjectDetails } from '../../../project/component/projects/functionHelper';
import { ProjectActions } from '../../../project/redux/actions';
import { taskManagementActions } from '../redux/actions';
import { AddProjectTaskForm } from './addProjectTaskForm';
import { AddTaskForm } from './addTaskForm';
import ValidationHelper from '../../../../helpers/validationHelper';

class TaskAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTask: {
                name: "",
                description: "",
                quillDescriptionDefault: "",
                startDate: "",
                endDate: "",
                priority: 3,
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                creator: getStorage("userId"),
                organizationalUnit: "",
                collaboratedWithOrganizationalUnits: [],
                taskTemplate: "",
                taskProject: "",
            },
            startTime: "08:00 AM",
            endTime: "05:30 PM",
            currentRole: getStorage('currentRole'),
        };
    }

    onChangeTaskData = (value) => {
        this.setState({ newTask: value })
    }
    onChangeStartTime = (value) => {
        this.setState({ startTime: value });
    }
    onChangeEndTime = (value) => {
        this.setState({ endTime: value });
    }

    convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    handleSubmit = () => {
        const { newTask, startTime, endTime } = this.state;
        let startDateTask = this.convertDateTime(newTask.startDate, startTime);
        let endDateTask = this.convertDateTime(newTask.endDate, endTime);
        this.props.addTask({
            ...newTask,
            startDate: startDateTask,
            endDate: endDateTask,
        });
    }

    componentDidMount() {
        const userId = getStorage("userId");
        this.props.getProjectsDispatch({ calledId: "all", userId });
    }

    componentDidMount() {
        const userId = getStorage("userId");
        this.props.getProjectsDispatch({ calledId: "all", userId });
    }

    isFormValidated = () => {
        const { name, startDate, endDate, responsibleEmployees, accountableEmployees } = this.state.newTask;
        const { translate } = this.props;

        if (!ValidationHelper.validateEmpty(translate, name).status
            || !ValidationHelper.validateEmpty(translate, startDate).status
            || !ValidationHelper.validateEmpty(translate, endDate).status
            || !ValidationHelper.validateArrayLength(translate, responsibleEmployees).status
            || !ValidationHelper.validateArrayLength(translate, accountableEmployees).status)
            return false;
        return true;
    }

    render() {
        const { translate, task, id, parentTask, currentTasks, currentProjectTasks, isProjectForm = false } = this.props;
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`addNewTask-${id}`} isLoading={false}
                    formID={`form-add-new-task-${id}`}
                    func={this.handleSubmit}
                    title={translate('task.task_management.add_new_task')}
                    disableSubmit={!this.isFormValidated()}
                >
                    <AddTaskForm
                        quillId={this.props.id}
                        handleChangeTaskData={this.onChangeTaskData}
                        handleChangeStartTime={this.onChangeStartTime}
                        handleChangeEndTime={this.onChangeEndTime}
                        id={id}
                        task={task}
                        parentTask={parentTask}
                        currentTasks={currentTasks}
                    />
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { project } = state;
    return { project }
}

const actionCreators = {
    addTask: taskManagementActions.addTask,
    addProjectTask: taskManagementActions.addProjectTask,
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    getTasksByProject: taskManagementActions.getTasksByProject,
};

const connectedModalAddTask = connect(mapStateToProps, actionCreators)(withTranslate(TaskAddModal));
export { connectedModalAddTask as TaskAddModal };
