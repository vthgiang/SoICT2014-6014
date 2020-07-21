import React, { Component } from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from '../../../../common-components/';
import { getStorage } from "../../../../config";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { TaskInformationForm } from './taskInformationForm';
import { performTaskAction } from '../redux/actions';
import { TaskFormValidator } from '../../task-management/component/taskFormValidator';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import Swal from 'sweetalert2'

class ModalEditTaskByAccountableEmployee extends Component {

    constructor(props) {
        super(props);

        let userId = getStorage("userId");

        let { task } = this.props;

        let statusOptions = []; statusOptions.push(task && task.status);
        let priorityOptions = []; priorityOptions.push(task && task.priority);
        let taskName = task && task.name;
        let taskDescription = task && task.description;
        let progress = task && task.progress;

        let info = {}, taskInfo = task && task.taskInformations;
        for (let i in taskInfo) {
            if (taskInfo[i].type === "Date") {
                if (taskInfo[i].value) {
                    info[`${taskInfo[i].code}`] = {
                        value: this.formatDate(taskInfo[i].value),
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
                else {
                    info[`${taskInfo[i].code}`] = {
                        value: this.formatDate(Date.now()),
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
            }
            else if (taskInfo[i].type === "SetOfValues") {
                let splitter = taskInfo[i].extra.split('\n');
                if (taskInfo[i].value) {
                    info[`${taskInfo[i].code}`] = {
                        value: [taskInfo[i].value],
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                } else {
                    info[`${taskInfo[i].code}`] = {
                        value: [splitter[0]],
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
            }
            else {
                if (taskInfo[i].value) {
                    info[`${taskInfo[i].code}`] = {
                        value: taskInfo[i].value,
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
            }
        }

        let responsibleEmployees = task && task.responsibleEmployees.map(employee => { return employee._id });
        let accountableEmployees = task && task.accountableEmployees.map(employee => { return employee._id });
        let consultedEmployees = task && task.consultedEmployees.map(employee => { return employee._id });
        let informedEmployees = task && task.informedEmployees.map(employee => { return employee._id });
        let inactiveEmployees = task && task.inactiveEmployees;
        let listInactive = {};
        for (let i in inactiveEmployees) {
            if (accountableEmployees.indexOf(inactiveEmployees[i]) !== -1) {
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role: 'Accountable',
                    checked: true
                }
            }
            else if (responsibleEmployees.indexOf(inactiveEmployees[i]) !== -1) {
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role: 'Responsible',
                    checked: true
                }
            }
            else if (consultedEmployees.indexOf(inactiveEmployees[i]) !== -1) {
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role: 'Consulted',
                    checked: true
                }
            }
        }

        let startDate = this.formatDate(task.startDate);
        let endDate = this.formatDate(task.endDate);

        this.state = {
            listInactive: listInactive,
            userId: userId,
            task: task,
            info: info,
            taskName: taskName,
            taskDescription: taskDescription,
            statusOptions: statusOptions,
            priorityOptions: priorityOptions,
            progress: progress,
            startDate: startDate,
            endDate: endDate,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            consultedEmployees: consultedEmployees,
            informedEmployees: informedEmployees,
            inactiveEmployees: inactiveEmployees,
        }
    }

    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    handleChangeProgress = async (e) => {
        let value = parseInt(e.target.value);
        await this.setState(state => {
            return {
                ...state,
                progress: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
    }

    handleChangeNumberInfo = async (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Number'
            }
            return {
                ...state,
                errorOnNumberInfo: this.validateNumberInfo(value)
            }
        })
    }

    handleChangeTextInfo = async (e) => {
        let value = e.target.value;
        let name = e.target.name;
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Text'
            }
            return {
                ...state,
                errorOnTextInfo: this.validateTextInfo(value)
            }
        })
    }

    handleInfoDateChange = (value, code) => {
        console.log('value', value);
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'Date'
            }
            return {
                ...state,
                errorOnInfoDate: this.validateDate(value),
            }
        });
    }

    handleSetOfValueChange = async (value, code) => {
        console.log('value', value);

        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'SetOfValues'
            }
            return {
                ...state,
            }
        });
    }

    handleInfoBooleanChange = (event) => {
        let { name, value } = event.target;
        this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Boolean'
            }
            return {
                ...state,
            }
        });
    }


    validateInfoBoolean = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            msg = "Giá trị bắt buộc phải chọn";
        }

        return msg;
    }

    validateTextInfo = (value) => {
        let msg = undefined;
        if (value === "") {
            msg = "Giá trị không được để trống"
        }
        return msg;
    }

    validateNumberInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;

        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
        }

        return msg;
    }

    validatePoint = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    changeActiveEmployees = async (listInactive) => {
        let inactiveEmployees = [];
        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                inactiveEmployees.push(listInactive[i].value);
            }
        }
        await this.setState(state => {
            return {
                ...state,
                inactiveEmployees: inactiveEmployees
            }
        });
    }


    handleChangeActiveAccountable = async (e, id) => {
        let { task } = this.state;
        let target = e.target;
        let { value, name, checked } = target;

        let numOfResponsible = this.state.responsibleEmployees.length;
        let numOfAccountable = this.state.accountableEmployees.length;

        await this.setState(state => {
            state.listInactive[`${id}`] = {
                value: value,
                checked: checked,
                role: 'Accountable'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = this.state.listInactive;

        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                if (task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if (task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }

        if (numOfAccountable === numOfInactiveAcc) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_accountable'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'Accountable'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if (numOfInactiveResp === numOfResponsible) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_accountable'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'Accountable'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    handleChangeActiveResponsible = async (e, id) => {
        let { task } = this.state;
        let target = e.target;
        let { value, name, checked } = target;

        let numOfResponsible = task.responsibleEmployees.length;
        let numOfAccountable = task.accountableEmployees.length;

        await this.setState(state => {
            state.listInactive[`${id}`] = {
                value: value,
                checked: checked,
                role: 'Responsible'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = this.state.listInactive;

        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                if (task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if (task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }

        if (numOfInactiveResp === numOfResponsible) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_accountable'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'Responsible'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if (numOfAccountable === numOfInactiveAcc) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_accountable'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'Responsible'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    handleChangeActiveConsulted = async (e, id) => {
        let { task } = this.state;
        let target = e.target;
        let { value, name, checked } = target;

        let numOfResponsible = this.state.responsibleEmployees.length;
        let numOfAccountable = this.state.accountableEmployees.length;

        await this.setState(state => {
            state.listInactive[`${id}`] = {
                value: value,
                checked: checked,
                role: 'Consulted'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = this.state.listInactive;

        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                if (task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if (task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }

        if (numOfAccountable === numOfInactiveAcc) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_accountable'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                numOfInactiveResp = numOfInactiveResp - 1;
                numOfInactiveAcc = numOfInactiveAcc - 1;
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'Consulted'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if (numOfInactiveResp === numOfResponsible) {
            let { translate } = this.props;
            Swal.fire({
                title: translate('task.task_perform.err_has_responsible'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                numOfInactiveResp = numOfInactiveResp - 1;
                numOfInactiveAcc = numOfInactiveAcc - 1;
                this.setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'Consulted'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    handleTaskNameChange = event => {
        let value = event.target.value;
        this.validateTaskName(value, true);
    }

    validateTaskName = (value, willUpdateState) => {
        let { translate } = this.props;
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
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
        let { translate } = this.props;
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
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


    handleChangeTaskStartDate = (value) => {
        this.validateTaskStartDate(value, true);
    }
    validateTaskStartDate = (value, willUpdateState = true) => {
        let msg = TaskFormValidator.validateTaskStartDate(value, this.state.endDate);

        if (willUpdateState) {
            this.state.startDate = value;
            this.state.errorOnStartDate = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    handleChangeTaskEndDate = (value) => {
        this.validateTaskEndDate(value, true);
    }
    validateTaskEndDate = (value, willUpdateState = true) => {
        let msg = TaskFormValidator.validateTaskEndDate(this.state.startDate, value);

        if (willUpdateState) {
            this.state.endDate = value;
            this.state.errorOnEndDate = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg === undefined;
    }


    handleTaskProgressChange = event => {
        let value = event.target.value;
        this.validateTaskProgress(value, true);
    }

    validateTaskProgress = (value, willUpdateState) => {
        let { translate } = this.props;
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
        }
        if (value !== undefined && isNaN(value)) {
            errorMessage = translate('task.task_perform.err_nan');
        }
        if (value < 0 || value > 100) {
            errorMessage = translate('task.task_perform.modal_approve_task.err_range');
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
        var { info } = this.state;
        var check = true;
        for (let i in info) {
            if (info[i].value === undefined) {
                check = false;
                break;
            }
        }
        // check &&
        return this.validateTaskName(this.state.taskName, false)
            && this.validateTaskDescription(this.state.taskDescription, false)
            && this.validateTaskProgress(this.state.taskProgress, false);
    }

    handleSelectedPriority = (value) => {
        this.setState(state => {
            return {
                ...state,
                priorityOptions: value
            }
        });
    }

    handleSelectedStatus = (value) => {
        this.setState(state => {
            return {
                ...state,
                statusOptions: value
            }
        })
    }

    handleSelectedResponsibleEmployee = (value) => {
        this.setState(state => {
            return {
                ...state,
                responsibleEmployees: value
            }
        });
    }
    handleSelectedAccountableEmployee = (value) => {
        this.setState(state => {
            return {
                ...state,
                accountableEmployees: value
            }
        });
    }
    handleSelectedConsultedEmployee = (value) => {
        this.setState(state => {
            return {
                ...state,
                consultedEmployees: value
            }
        });
    }
    handleSelectedInformEmployee = (value) => {
        this.setState(state => {
            return {
                ...state,
                informedEmployees: value
            }
        });
    }

    handleAddTaskLog = (inactiveEmployees) => {
        let currentTask = this.state.task;
        let { taskName, taskDescription, statusOptions, priorityOptions, progress, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees } = this.state;

        let title = '';
        let description = '';

        if (taskName !== currentTask.name || taskDescription !== currentTask.description) {
            title = title + 'Chỉnh sửa thông tin cơ bản';

            if (taskName !== currentTask.name) {
                description = description + 'Tên công việc mới: ' + taskName;
            }

            if (taskDescription !== currentTask.description) {
                description = description === '' ? description + 'Mô tả công việc mới: ' + taskDescription : description + '. ' + 'Mô tả công việc mới: ' + taskDescription;
            }
        }

        if (statusOptions[0] !== currentTask.status ||
            priorityOptions[0] !== currentTask.priority ||
            JSON.stringify(responsibleEmployees) !== JSON.stringify(currentTask.responsibleEmployees.map(employee => { return employee._id })) ||
            JSON.stringify(accountableEmployees) !== JSON.stringify(currentTask.accountableEmployees.map(employee => { return employee._id })) ||
            JSON.stringify(consultedEmployees) !== JSON.stringify(currentTask.consultedEmployees.map(employee => { return employee._id })) ||
            JSON.stringify(informedEmployees) !== JSON.stringify(currentTask.informedEmployees.map(employee => { return employee._id })) ||
            JSON.stringify(inactiveEmployees) !== JSON.stringify(currentTask.inactiveEmployees.map(employee => { return employee._id }))
        ) {
            const { user } = this.props;
            let usercompanys;
            if (user.usercompanys) usercompanys = user.usercompanys;

            title = title === '' ? title + 'Chỉnh sửa thông tin chi tiết' : title + '. ' + 'Chỉnh sửa thông tin chi tiết';

            if (statusOptions[0] !== currentTask.status) {
                description = description === '' ? description + 'Trạng thái công việc mới: ' + this.formatStatus(statusOptions[0]) : description + '. ' + 'Trạng thái công việc mới: ' + this.formatStatus(statusOptions[0]);
            }

            if (priorityOptions[0] !== currentTask.priority) {
                description = description === '' ? description + 'Mức độ ưu tiên mới: ' + this.formatPriority(parseInt(priorityOptions[0])) : description + '. ' + 'Mức độ ưu tiên mới: ' + this.formatPriority(parseInt(priorityOptions[0]));
            }

            if (JSON.stringify(responsibleEmployees) !== JSON.stringify(currentTask.responsibleEmployees.map(employee => { return employee._id }))) {
                let responsibleEmployeesArr = [];
                for (const element of responsibleEmployees) {
                    let a = usercompanys.filter(item => item._id === element);
                    responsibleEmployeesArr.push(a[0].name)
                }
                description = description === '' ? description + 'Những người thực hiện công việc mới: ' + JSON.stringify(responsibleEmployeesArr) : description + '. ' + 'Những người thực hiện công việc mới: ' + JSON.stringify(responsibleEmployeesArr);
            }

            if (JSON.stringify(accountableEmployees) !== JSON.stringify(currentTask.accountableEmployees.map(employee => { return employee._id }))) {
                let accountableEmployeesArr = [];
                for (const element of accountableEmployees) {
                    let a = usercompanys.filter(item => item._id === element);
                    accountableEmployeesArr.push(a[0].name)
                }
                description = description === '' ? description + 'Những người phê duyệt công việc mới: ' + JSON.stringify(accountableEmployeesArr) : description + '. ' + 'Những người phê duyệt công việc mới: ' + JSON.stringify(accountableEmployeesArr);
            }

            if (JSON.stringify(consultedEmployees) !== JSON.stringify(currentTask.consultedEmployees.map(employee => { return employee._id }))) {
                let consultedEmployeesArr = [];
                for (const element of consultedEmployees) {
                    let a = usercompanys.filter(item => item._id === element);
                    consultedEmployeesArr.push(a[0].name)
                }
                description = description === '' ? description + 'Những người hỗ trợ công việc mới: ' + JSON.stringify(consultedEmployeesArr) : description + '. ' + 'Những người hỗ trợ công việc mới: ' + JSON.stringify(consultedEmployeesArr);
            }

            if (JSON.stringify(informedEmployees) !== JSON.stringify(currentTask.informedEmployees.map(employee => { return employee._id }))) {
                let informedEmployeesArr = [];
                for (const element of informedEmployees) {
                    let a = usercompanys.filter(item => item._id === element);
                    informedEmployeesArr.push(a[0].name)
                }
                description = description === '' ? description + 'Những người quan sát công việc mới: ' + JSON.stringify(informedEmployeesArr) : description + '. ' + 'Những người quan sát công việc mới: ' + JSON.stringify(informedEmployeesArr);
            }

            if (JSON.stringify(inactiveEmployees) !== JSON.stringify(currentTask.inactiveEmployees.map(employee => { return employee._id }))) {
                let inactiveEmployeesArr = [];
                for (const element of inactiveEmployees) {
                    let a = usercompanys.filter(item => item._id === element);
                    inactiveEmployeesArr.push(a[0].name)
                }
                description = description === '' ? description + 'Những người không tham giá công việc nữa: ' + JSON.stringify(inactiveEmployeesArr) : description + '. ' + 'Những người không tham giá công việc nữa: ' + JSON.stringify(inactiveEmployeesArr);
            }
        }
        if (progress !== currentTask.progress) {
            title = title === '' ? title + 'Chỉnh sửa thông tin đánh giá công việc tháng này' : title + '. ' + 'Chỉnh sửa thông tin đánh giá công việc tháng này';
            description = description === '' ? description + 'Mức độ hoàn thành mới: ' + progress + "%" : description + '. ' + 'Mức độ hoàn thành mới: ' + progress + "%";
        }

        if (title !== '' || description !== '') {
            this.props.addTaskLog({
                createdAt: Date.now(),
                taskId: currentTask._id,
                creator: getStorage("userId"),
                title: title,
                description: description,
            })
        }
    }

    save = () => {
        let listInactive = this.state.listInactive, taskId, inactiveEmployees = [];
        taskId = this.props.id;
        for (let i in listInactive) {
            if (listInactive[i].checked !== undefined && listInactive[i].checked === true) {
                inactiveEmployees.push(listInactive[i].value);
            }
        }
        let data = {
            name: this.state.taskName,
            description: this.state.taskDescription,
            status: this.state.statusOptions,
            priority: this.state.priorityOptions,
            user: this.state.userId,
            progress: this.state.progress,
            date: this.formatDate(Date.now()),

            startDate: this.state.startDate,
            endDate: this.state.endDate,

            accountableEmployees: this.state.accountableEmployees,
            consultedEmployees: this.state.consultedEmployees,
            responsibleEmployees: this.state.responsibleEmployees,
            informedEmployees: this.state.informedEmployees,
            inactiveEmployees: inactiveEmployees,

            info: this.state.info,
        }

        this.props.editTaskByAccountableEmployees(data, taskId);

        this.handleAddTaskLog(inactiveEmployees);
    }

    componentDidMount() {
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('PARENT nextProps, prevState', nextProps, prevState);
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined,
                errorTaskName: undefined,
                errorTaskDescription: undefined

            }
        } else {
            return null;
        }
    }

    formatPriority = (data) => {
        const { translate } = this.props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.normal');
        if (data === 3) return translate('task.task_management.high');
    }

    formatRole = (data) => {
        const { translate } = this.props;
        if (data === "Consulted") return translate('task.task_management.consulted');
        if (data === "Accountable") return translate('task.task_management.accountable');
        if (data === "Responsible") return translate('task.task_management.responsible');
    }

    formatStatus = (data) => {
        const { translate } = this.props;
        if (data === "Inprocess") return translate('task.task_management.inprocess');
        else if (data === "WaitForApproval") return translate('task.task_management.wait_for_approval');
        else if (data === "Finished") return translate('task.task_management.finished');
        else if (data === "Delayed") return translate('task.task_management.delayed');
        else if (data === "Canceled") return translate('task.task_management.canceled');
    }

    render() {

        const { task } = this.state;
        const { errorOnEndDate, errorOnStartDate, errorTaskName, errorTaskDescription, errorTaskProgress, taskName, taskDescription, statusOptions, priorityOptions,
            startDate, endDate, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees, inactiveEmployees
        } = this.state;

        const { user, tasktemplates, translate } = this.props;
        
        let departmentUsers, usercompanys;
        if (user.userdepartments) departmentUsers = user.userdepartments;
        if (user.usercompanys) usercompanys = user.usercompanys;

        let priorityArr = [
            { value: 1, text: translate('task.task_management.low') },
            { value: 2, text: translate('task.task_management.normal') },
            { value: 3, text: translate('task.task_management.high') }
        ];
        let statusArr = [
            { value: "Inprocess", text: translate('task.task_management.inprocess') },
            { value: "WaitForApproval", text: translate('task.task_management.wait_for_approval') },
            { value: "Finished", text: translate('task.task_management.finished') },
            { value: "Delayed", text: translate('task.task_management.delayed') },
            { value: "Canceled", text: translate('task.task_management.canceled') }
        ];

        let usersOfChildrenOrganizationalUnit;
        if (user && user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        return (
            <div>
                <React.Fragment>
                    <DialogModal
                        size={75}
                        maxWidth={750}
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
                                <legend className="scheduler-border">{translate('task.task_management.edit_basic_info')}</legend>
                                <div>
                                    <div className={`form-group ${errorTaskName === undefined ? "" : "has-error"}`}>
                                        <label>{translate('task.task_management.name')}<span className="text-red">*</span></label>
                                        <input type="text"
                                            value={taskName}
                                            className="form-control" onChange={this.handleTaskNameChange} />
                                        <ErrorLabel content={errorTaskName} />
                                    </div>
                                    <div
                                        className={`form-group ${errorTaskDescription === undefined ? "" : "has-error"}`}>
                                        <label>{translate('task.task_management.detail_description')}<span className="text-red">*</span></label>
                                        <input type="text"
                                            value={taskDescription}
                                            className="form-control" onChange={this.handleTaskDescriptionChange} />
                                        <ErrorLabel content={errorTaskDescription} />
                                    </div>
                                </div>

                            </fieldset>

                            {/*Thông tin chi tiết*/}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.edit_detail_info')}</legend>
                                <div>
                                    <div className="form-group">
                                        <label>{translate('task.task_management.detail_status')}</label>
                                        {
                                            <SelectBox
                                                id={`select-status-${this.props.perform}-${this.props.role}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={statusArr}
                                                multiple={false}
                                                value={statusOptions}
                                                onChange={this.handleSelectedStatus}
                                            />
                                        }
                                    </div>

                                    {/*Mức ưu tiên*/}
                                    <div className="form-group">
                                        <label>{translate('task.task_management.detail_priority')}</label>
                                        {
                                            <SelectBox
                                                id={`select-priority-${this.props.perform}-${this.props.role}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={priorityArr}
                                                multiple={false}
                                                value={priorityOptions}
                                                onChange={this.handleSelectedPriority}
                                            />
                                        }
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                        <label className="control-label">{translate('task.task_management.start_date')}*</label>
                                        <DatePicker
                                            id={`datepicker2-startdate-${this.props.id}`}
                                            value={startDate}
                                            onChange={this.handleChangeTaskStartDate}
                                        />
                                        <ErrorLabel content={errorOnStartDate} />
                                    </div>
                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                        <label className="control-label">{translate('task.task_management.end_date')}*</label>
                                        <DatePicker
                                            id={`datepicker2-enddate-${this.props.id}`}
                                            value={endDate}
                                            onChange={this.handleChangeTaskEndDate}
                                        />
                                        <ErrorLabel content={errorOnEndDate} />
                                    </div>
                                </div>
                            </fieldset>

                            <TaskInformationForm
                                task={task && task}

                                handleChangeProgress={this.handleChangeProgress}
                                handleInfoBooleanChange={this.handleInfoBooleanChange}
                                handleInfoDateChange={this.handleInfoDateChange}
                                handleSetOfValueChange={this.handleSetOfValueChange}
                                handleChangeNumberInfo={this.handleChangeNumberInfo}
                                handleChangeTextInfo={this.handleChangeTextInfo}

                                role={this.props.role}
                                perform={this.props.perform}
                                value={this.state}
                            />
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.edit_member_info')}</legend>

                                {/*Người thực hiện*/}
                                <div className="form-group">
                                    <label>{translate('task.task_management.responsible')}</label>
                                    {unitMembers &&
                                        <SelectBox
                                            id={`select-responsible-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={unitMembers}
                                            onChange={this.handleSelectedResponsibleEmployee}
                                            multiple={true}
                                            value={responsibleEmployees}
                                        />
                                    }
                                </div>

                                {/*Người phê duyệt*/}
                                <div className="form-group">
                                    <label>{translate('task.task_management.accountable')}</label>
                                    {unitMembers &&
                                        <SelectBox
                                            id={`select-accountable-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={unitMembers}
                                            onChange={this.handleSelectedAccountableEmployee}
                                            multiple={true}
                                            value={accountableEmployees}
                                        />
                                    }
                                </div>

                                {/*Người hỗ trợ*/}
                                <div className="form-group">
                                    <label>{translate('task.task_management.consulted')}</label>
                                    {usercompanys &&
                                        <SelectBox
                                            id={`select-consulted-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={
                                                usercompanys.map(x => {
                                                    return { value: x._id, text: x.name };
                                                })
                                            }
                                            onChange={this.handleSelectedConsultedEmployee}
                                            multiple={true}
                                            value={consultedEmployees}
                                        />
                                    }
                                </div>

                                {/*Người giám sát*/}
                                <div className="form-group">
                                    <label>{translate('task.task_management.informed')}</label>
                                    {usercompanys &&
                                        <SelectBox
                                            id={`select-informed-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={
                                                usercompanys.map(x => {
                                                    return { value: x._id, text: x.name };
                                                })
                                            }
                                            onChange={this.handleSelectedInformEmployee}
                                            multiple={true}
                                            value={informedEmployees}
                                        />
                                    }
                                </div>
                            </fieldset>

                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.edit_inactive_emp')}</legend>
                                <div className="form-group">

                                    <div className="checkbox">
                                        <strong>{translate('task.task_management.accountable')}</strong>
                                        {
                                            task.accountableEmployees.map(elem => {
                                                return <div>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={this.state.listInactive[`${elem._id}`] && this.state.listInactive[`${elem._id}`].checked === true}
                                                            value={elem._id}
                                                            name="accountable" onChange={(e) => this.handleChangeActiveAccountable(e, elem._id)}
                                                        />{elem.name}
                                                    </label>
                                                    <br />
                                                </div>
                                            })
                                        }
                                        <br />
                                        <strong>{translate('task.task_management.responsible')}</strong>
                                        {
                                            task.responsibleEmployees.map(elem => {
                                                return <div>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={this.state.listInactive[`${elem._id}`] && this.state.listInactive[`${elem._id}`].checked === true}
                                                            value={elem._id}
                                                            name="responsible" onChange={(e) => this.handleChangeActiveResponsible(e, elem._id)}
                                                        />{elem.name}
                                                    </label>
                                                    <br />
                                                </div>
                                            })
                                        }
                                        <br />
                                        {task.consultedEmployees.length !== 0 &&
                                            <React.Fragment>
                                                <strong>{translate('task.task_management.consulted')}</strong>
                                                {
                                                    task.consultedEmployees.map(elem => {
                                                        return <div>
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={this.state.listInactive[`${elem._id}`] && this.state.listInactive[`${elem._id}`].checked === true}
                                                                    value={elem._id}
                                                                    name="consulted" onChange={(e) => this.handleChangeActiveConsulted(e, elem._id)}
                                                                />{elem.name}
                                                            </label>
                                                            <br />
                                                        </div>
                                                    })
                                                }
                                            </React.Fragment>
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
    const { tasks, user, tasktemplates, performtasks } = state;
    return { tasks, user, tasktemplates, performtasks };
}

const actionGetState = { //dispatchActionToProps
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    editTaskByAccountableEmployees: performTaskAction.editTaskByAccountableEmployees,
    addTaskLog: performTaskAction.addTaskLog,
}

const modalEditTaskByAccountableEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByAccountableEmployee));
export { modalEditTaskByAccountableEmployee as ModalEditTaskByAccountableEmployee };
