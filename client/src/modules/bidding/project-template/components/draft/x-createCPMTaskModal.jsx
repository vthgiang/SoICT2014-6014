import { isArraysEqual } from '@fullcalendar/common';
import moment from 'moment';
import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { getStorage } from '../../../../config';
import { ChangeRequestActions } from '../../../project/change-requests/redux/actions';
import { getCurrentProjectDetails, getEndDateOfProject, getEstimateCostOfProject, getNewTasksListAfterCR, MILISECS_TO_DAYS, MILISECS_TO_HOURS, processAffectedTasksChangeRequest, processDataTasksStartEnd } from '../../../project/projects/components/functionHelper';
import { ProjectActions } from '../../../project/projects/redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { checkIfHasCommonItems } from '../../../task/task-management/component/functionHelpers';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { AddTaskFormCPM } from './addTaskFormCPM';

const CreateCPMTaskModal = (props) => {
    const { translate, task, id, parentTask, currentTasks, currentProjectTasks, project, user } = props;
    const projectDetail = getCurrentProjectDetails(project);
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
            estimateNormalTime: '',
            estimateOptimisticTime: '',
            estimateNormalCost: '',
            estimateMaxCost: '',
            estimateAssetCost: '1,000,000',
            estimateHumanCost: '',
            preceedingTasks: [],
            budget: '',
            actorsWithSalary: [],
            totalResWeight: 80,
            totalAccWeight: 20,
            currentResWeightArr: [],
            currentAccWeightArr: [],
            currentLatestStartDate: '',
            currentEarliestEndDate: '',
        },
        currentRole: getStorage('currentRole'),
    })
    const [startTime, setStartTime] = useState('08:00 AM');
    const [endTime, setEndTime] = useState('05:30 PM');
    const [description, setDescription] = useState('');

    const onChangeTaskData = (value) => {
        setState({
            ...state,
            newTask: value
        })
    }
    const onChangeStartTime = (value) => {
        setStartTime(value);
    }
    const onChangeEndTime = (value) => {
        setEndTime(value);
    }
    const onChangeDescription = (value) => {
        setDescription(value);
    }

    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    const handleSubmit = async () => {
        const { newTask } = state;
        let startDateTask = moment(convertDateTime(newTask.startDate, startTime)).format();
        let endDateTask = moment(convertDateTime(newTask.endDate, endTime)).format();

        const newTaskFormatted = {
            ...newTask,
            taskProject: getCurrentProjectDetails(props.project)._id,
            organizationalUnit: user?.roledepartments?._id,
            estimateNormalTime: Number(newTask.estimateNormalTime),
            estimateOptimisticTime: Number(newTask.estimateOptimisticTime),
            estimateNormalCost: Number(newTask.estimateNormalCost.replace(/,/g, '')),
            estimateMaxCost: Number(newTask.estimateMaxCost.replace(/,/g, '')),
            preceedingTasks: newTask.preceedingTasks,
            actorsWithSalary: newTask.actorsWithSalary,
            estimateAssetCost: Number(newTask.estimateAssetCost.replace(/,/g, '')),
            totalResWeight: Number(newTask.totalResWeight),
            startDate: startDateTask,
            endDate: endDateTask,
            description,
        }
        console.log('newTaskFormatted', newTaskFormatted)
        // const { affectedTasks, newTasksList } = processAffectedTasksChangeRequest(projectDetail, currentProjectTasks, newTaskFormatted);
        const newAffectedTasksList = [
            {
                task: undefined,
                old: undefined,
                new: {
                    ...newTaskFormatted,
                    name: newTask.name,
                    creator: getStorage('userId'),
                    organizationalUnit: user?.roledepartments?._id,
                    responsibleEmployees: newTask.responsibleEmployees,
                    accountableEmployees: newTask.accountableEmployees,
                    actorsWithSalary: newTask.actorsWithSalary,
                    estimateAssetCost: Number(String(newTask.estimateAssetCost).replace(/,/g, '')),
                    taskProject: projectDetail?._id,
                    totalResWeight: newTask.totalResWeight,
                    preceedingTasks: newTask.preceedingTasks?.map(item => ({
                        task: item,
                        link: ''
                    })),
                    estimateNormalTime: Number(newTask.estimateNormalTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                    estimateOptimisticTime: Number(newTask.estimateOptimisticTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                }
            }
        ]
        console.log('newAffectedTasksList', newAffectedTasksList)
        const currentTask = {
            ...newTaskFormatted,
            preceedingTasks: newTaskFormatted.preceedingTasks.map((preItem) => {
                return {
                    task: preItem,
                    link: '',
                }
            }),
            totalResWeight: newTask.totalResWeight,
            estimateNormalTime: Number(newTaskFormatted.estimateNormalTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
            estimateOptimisticTime: Number(newTaskFormatted.estimateOptimisticTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
        }
        const newTasksList = [...currentProjectTasks, newTaskFormatted];
        // const newTasksListAfterCR = getNewTasksListAfterCR(projectDetail, currentProjectTasks, newTaskFormatted);
        await props.createProjectChangeRequestDispatch({
            creator: getStorage('userId'),
            name: `Thêm mới công việc "${newTask.name}"`,
            description: `Thêm mới công việc "${newTask.name}"`,
            requestStatus: 1,
            type: 'add_task',
            currentTask,
            baseline: {
                oldEndDate: getEndDateOfProject(currentProjectTasks, false),
                newEndDate: getEndDateOfProject(newTasksList, false),
                oldCost: getEstimateCostOfProject(currentProjectTasks),
                newCost: getEstimateCostOfProject(newTasksList),
            },
            taskProject: projectDetail?._id,
            affectedTasksList: newAffectedTasksList,
        })
        await props.onHandleReRender();
    }

    useEffect(() => {
        const userId = getStorage("userId");
        const currentRole = getStorage("currentRole");
        props.getProjectsDispatch({ calledId: "user_all", userId });
        props.getRoleSameDepartment(currentRole);
    }, [])

    const isFormValidated = () => {
        const { newTask } = state;
        return !checkIfHasCommonItems(newTask.accountableEmployees, newTask.responsibleEmployees) && newTask.name.trim().length > 0 && newTask.estimateMaxCost.trim().length > 0 && newTask.startDate.trim().length > 0
            && newTask.endDate.trim().length > 0 && newTask.responsibleEmployees.length > 0 && newTask.accountableEmployees.length > 0
            && newTask.estimateAssetCost.trim().length > 0
    }

    return (
        <React.Fragment>
            <DialogModal
                size='100' modalID={`addNewProjectTask-${id}`} isLoading={false}
                formID={`form-add-new-project-task-${id}`}
                func={handleSubmit}
                title={`Yêu cầu thay đổi - ${translate('task.task_management.add_new_task')}`}
                disableSubmit={!isFormValidated()}
            >
                <AddTaskFormCPM
                    quillId={props.id}
                    handleChangeTaskData={onChangeTaskData}
                    handleChangeStartTime={onChangeStartTime}
                    handleChangeEndTime={onChangeEndTime}
                    handleChangeDescription={onChangeDescription}
                    id={id}
                    task={task}
                    parentTask={parentTask}
                    currentProjectTasks={currentProjectTasks}
                />
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, department, role, user } = state;
    return { project, department, role, user }
}

const actionCreators = {
    addTask: taskManagementActions.addTask,
    addProjectTask: taskManagementActions.addProjectTask,
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    createProjectChangeRequestDispatch: ChangeRequestActions.createProjectChangeRequestDispatch,

    showInfoRole: RoleActions.show,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
};

const connectedModalAddTask = connect(mapStateToProps, actionCreators)(withTranslate(CreateCPMTaskModal));
export { connectedModalAddTask as CreateCPMTaskModal };
