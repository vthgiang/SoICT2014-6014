import React, { useEffect, useState } from 'react';
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

function TaskAddModal(props) {
    const [state, setState] = useState({
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
    })

    const { translate, task, id, parentTask, currentTasks, currentProjectTasks, isProjectForm = false } = props;

    const onChangeTaskData = (value) => {
        setState({
            ...state,
            newTask: value
        })
    }
    const onChangeStartTime = (value) => {
        setState({
            ...state,
            startTime: value
        });
    }
    const onChangeEndTime = (value) => {
        setState({
            ...state,
            endTime: value
        });
    }

    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    const handleSubmit = () => {
        const { newTask, startTime, endTime } = state;
        let startDateTask = convertDateTime(newTask.startDate, startTime);
        let endDateTask = convertDateTime(newTask.endDate, endTime);
        props.addTask({
            ...newTask,
            startDate: startDateTask,
            endDate: endDateTask,
        });
    }

    useEffect(() => {
        const userId = getStorage("userId");
        props.getProjectsDispatch({ calledId: "" });
    }, [])

    const isFormValidated = () => {
        const { name, startDate, endDate, responsibleEmployees, accountableEmployees } = state.newTask;
        const { translate } = props;

        if (!ValidationHelper.validateEmpty(translate, name).status
            || !ValidationHelper.validateEmpty(translate, startDate).status
            || !ValidationHelper.validateEmpty(translate, endDate).status
            || !ValidationHelper.validateArrayLength(translate, responsibleEmployees).status
            || !ValidationHelper.validateArrayLength(translate, accountableEmployees).status)
            return false;
        return true;
    }

    return (
        <React.Fragment>
            <DialogModal
                size='100' modalID={`addNewTask-${id}`} isLoading={false}
                formID={`form-add-new-task-${id}`}
                func={handleSubmit}
                title={translate('task.task_management.add_new_task')}
                disableSubmit={!isFormValidated()}
            >
                <AddTaskForm
                    quillId={props.id}
                    handleChangeTaskData={onChangeTaskData}
                    handleChangeStartTime={onChangeStartTime}
                    handleChangeEndTime={onChangeEndTime}
                    id={id}
                    task={task}
                    parentTask={parentTask}
                    currentTasks={currentTasks}
                />
            </DialogModal>
        </React.Fragment>
    );
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
