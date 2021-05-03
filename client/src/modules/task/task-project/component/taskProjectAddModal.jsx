import moment from 'moment';
import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { getStorage } from '../../../../config';
import { getCurrentProjectDetails } from '../../../project/component/projects/functionHelper';
import { ProjectActions } from '../../../project/redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';
import { AddProjectTaskForm } from './addProjectTaskForm';

class TaskProjectAddModal extends Component {
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
                estimateNormalTime: '',
                estimateOptimisticTime: '',
                estimatePessimisticTime: '',
                estimateNormalCost: '',
                estimateMaxCost: '',
                preceedingTasks: [],
                budget: '',
                estimateAssetCost: '',
                actorsWithSalary: [],
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

    handleSubmit = async () => {
        const { user, project } = this.props;
        const projectDetail = getCurrentProjectDetails(project);
        const { newTask, startTime, endTime } = this.state;
        let startDateTask = this.convertDateTime(newTask.startDate, startTime);
        let endDateTask = this.convertDateTime(newTask.endDate, endTime);

        let estimateNormalTime = moment(endDateTask).diff(moment(startDateTask), `milliseconds`) || null;
        let estimateOptimisticTime = typeof estimateNormalTime === 'number' ? estimateNormalTime - 20000 : null;
        let estimatePessimisticTime = typeof estimateNormalTime === 'number' ? estimateNormalTime + 20000 : null;
        let preceedingTasks = newTask.preceedingTasks?.map(item => ({
            task: item,
            link: ''
        }))
        const newTaskFormatted = {
            ...newTask,
            taskProject: getCurrentProjectDetails(this.props.project)._id,
            organizationalUnit: user?.roledepartments?._id,
            estimateNormalTime,
            estimateOptimisticTime,
            estimatePessimisticTime,
            estimateNormalCost: Number(newTask.estimateNormalCost.replace(/,/g, '')),
            estimateMaxCost: Number(newTask.estimateMaxCost),
            preceedingTasks,
            budget: Number(newTask.budget.replace(/,/g, '')),
            actorsWithSalary: newTask.actorsWithSalary,
            estimateAssetCost: Number(newTask.estimateAssetCost.replace(/,/g, '')),
        }
        await this.props.addProjectTask({
            ...newTaskFormatted,
            startDate: startDateTask,
            endDate: endDateTask,
        });
        await this.props.onHandleReRender();
    }

    componentDidMount() {
        const userId = getStorage("userId");
        const currentRole = getStorage("currentRole");
        this.props.getProjectsDispatch({ calledId: "all", userId });
        this.props.getRoleSameDepartment(currentRole);
    }

    isFormValidated = () => {
        const { newTask } = this.state;
        return newTask.name.trim().length > 0 && newTask.budget.trim().length > 0 && newTask.startDate.trim().length > 0
            && newTask.endDate.trim().length > 0 && newTask.responsibleEmployees.length > 0 && newTask.accountableEmployees.length > 0
            && newTask.estimateAssetCost.trim().length > 0
    }

    render() {
        const { translate, task, id, parentTask, currentTasks, currentProjectTasks } = this.props;
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`addNewProjectTask-${id}`} isLoading={false}
                    formID={`form-add-new-project-task-${id}`}
                    func={this.handleSubmit}
                    title={translate('task.task_management.add_new_task')}
                    disableSubmit={!this.isFormValidated()}
                >
                    <AddProjectTaskForm
                        quillId={this.props.id}
                        handleChangeTaskData={this.onChangeTaskData}
                        handleChangeStartTime={this.onChangeStartTime}
                        handleChangeEndTime={this.onChangeEndTime}
                        id={id}
                        task={task}
                        parentTask={parentTask}
                        currentProjectTasks={currentProjectTasks}
                    />
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { project, department, role, user } = state;
    return { project, department, role, user }
}

const actionCreators = {
    addTask: taskManagementActions.addTask,
    addProjectTask: taskManagementActions.addProjectTask,
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    getTasksByProject: taskManagementActions.getTasksByProject,

    showInfoRole: RoleActions.show,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
};

const connectedModalAddTask = connect(mapStateToProps, actionCreators)(withTranslate(TaskProjectAddModal));
export { connectedModalAddTask as TaskProjectAddModal };
