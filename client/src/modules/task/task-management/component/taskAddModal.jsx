import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { getStorage } from '../../../../config';
import { getTimeFromFormatDate } from '../../../../helpers/stringMethod';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { taskTemplateActions } from '../../../task/task-template/redux/actions';
import { taskManagementActions } from '../redux/actions';

import { DialogModal, DatePicker, SelectBox, ErrorLabel, ToolTip, TreeSelect, QuillEditor, TimePicker } from '../../../../common-components';
import { TaskFormValidator } from './taskFormValidator';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import ModalAddTaskProject from '../../task-project/component/modalAddTaskProject';
import { AddTaskForm } from './addTaskForm';


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
                parent: "",
                taskProject: "",
            },

            startTime: "12:00 AM",
            endTime: "12:00 AM",

            currentRole: getStorage('currentRole'),
        };
    }
    
    onChangeTaskData = (value) => {
        console.log("value",value)
        this.setState({ newTask: value })
    }
    convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}-${splitter[1]}-${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }
    handleSubmit = async (event) => {
        const { newTask, startTime, endTime } = this.state;
        let startDateTask = this.convertDateTime(newTask.startDate, startTime);
        let endDateTask = this.convertDateTime(newTask.endDate, endTime);

        console.log('start-end', startDateTask, endDateTask);

        // let startDate = newTask.startDate;
        // let endDate = newTask.endDate;
        // startDate = new Date(getTimeFromFormatDate(startDate, 'dd-mm-yyyy'));
        // endDate = new Date(getTimeFromFormatDate(endDate, 'dd-mm-yyyy'));
        this.props.addTask({
            ...newTask,
            startDate: startDateTask,
            endDate: endDateTask,
        });
        console.log(newTask)
    }
    render() {
        const { id, newTask } = this.state;
        const { tasktemplates, user, KPIPersonalManager, translate, tasks, department, taskProject, isProcess } = this.props;
        const { task } = this.props;

        let units, userdepartments, listTaskTemplate, listKPIPersonal, usercompanys;
        let listDepartment = department?.list;
        let taskTemplate;
        if (tasktemplates.taskTemplate) {
            taskTemplate = tasktemplates.taskTemplate;
        }

        if (tasktemplates.items && newTask.organizationalUnit) {
            // listTaskTemplate = tasktemplates.items.filter(function (taskTemplate) {
            //     return taskTemplate.organizationalUnit._id === newTask.organizationalUnit;
            // });
            listTaskTemplate = tasktemplates.items
        }
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }
        if (user.userdepartments) userdepartments = user.userdepartments;
        if (user.usercompanys) usercompanys = user.usercompanys;

        let usersOfChildrenOrganizationalUnit;
        if (user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }
        let usersInUnitsOfCompany;
        if (user && user.usersInUnitsOfCompany) {
            usersInUnitsOfCompany = user.usersInUnitsOfCompany;
        }

        let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        if (KPIPersonalManager.kpipersonals) listKPIPersonal = KPIPersonalManager.kpipersonals;

        let listParentTask = [{ value: "", text: `--${translate('task.task_management.add_parent_task')}--` }];

        if (this.props.parentTask && this.props.parentTask !== "" && this.props.currentTasks) {
            let taskItem = this.props.currentTasks.find(e => e._id === this.props.parentTask);
            taskItem && listParentTask.push({ value: taskItem._id, text: taskItem.name })
        }

        if (tasks.listSearchTasks) {
            let arr = tasks.listSearchTasks.map(x => { return { value: x._id, text: x.name } });
            listParentTask = [...listParentTask, ...arr];
        }

        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`addNewTask-${id}`} isLoading={false}
                    formID={`form-add-new-task-${id}`}
                    func={this.handleSubmit}
                    title={translate('task.task_management.add_new_task')}
                >
                    <AddTaskForm
                        quillId={this.props.id}
                        handleChangeTaskData={this.onChangeTaskData}
                    />
                    <ModalAddTaskProject />
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasktemplates, tasks, user, KPIPersonalManager, department, taskProject } = state;
    return { tasktemplates, tasks, user, KPIPersonalManager, department, taskProject };
}

const actionCreators = {
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    addTask: taskManagementActions.addTask,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllDepartment: DepartmentActions.get,
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getPaginateTasksByUser: taskManagementActions.getPaginateTasksByUser,
};

const connectedModalAddTask = connect(mapState, actionCreators)(withTranslate(TaskAddModal));
export { connectedModalAddTask as TaskAddModal };