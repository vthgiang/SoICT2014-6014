import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, ErrorLabel, SelectBox, DatePicker, QuillEditor, TreeSelect, TimePicker, convertImageBase64ToFile } from '../../../../common-components/';
import { getStorage } from "../../../../config";

import { UserActions } from "../../../super-admin/user/redux/actions";
import { TaskInformationForm } from './taskInformationForm';
import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';

import { TaskFormValidator } from '../../task-management/component/taskFormValidator';
import { TaskTemplateFormValidator } from '../../task-template/component/taskTemplateFormValidator';

import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import Swal from 'sweetalert2'
import moment from 'moment';

function ModalEditTaskByAccountableEmployee(props) {
    const [state, setState] = useState(initState(props.task))

    const { user, tasktemplates, department, translate, project } = props;
    const { tasks, perform, id, role, title, hasAccountable } = props;

    const { task, organizationalUnit, collaboratedWithOrganizationalUnits, errorOnEndDate, errorOnStartDate, errorTaskName, errorTaskDescription, errorOnFormula, taskName, taskDescription, statusOptions, priorityOptions, taskDescriptionDefault,
        startDate, endDate, startTime, endTime, formula, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees, inactiveEmployees, parent, parentTask
        , taskProjectName } = state;

    function initState(task) {
        let userId = getStorage("userId");

        let organizationalUnit = task && task.organizationalUnit?._id;
        let collaboratedWithOrganizationalUnits = task && task.collaboratedWithOrganizationalUnits.map(e => { if (e) return e.organizationalUnit._id });

        let statusOptions = []; statusOptions.push(task && task.status);
        let priorityOptions = []; priorityOptions.push(task && task.priority);
        let taskName = task && task.name;
        let taskDescription = task && task.description;
        let progress = task && task.progress;
        let formula = task && task.formula;
        let parent = (task && task.parent) ? task.parent._id : "";
        let parentTask = task && task.parent;
        let taskProject = task && task.taskProject;

        let info = {}, taskInfo = task && task.taskInformations;
        for (let i in taskInfo) {
            if (taskInfo[i].type === "date") {
                if (taskInfo[i].value) {
                    info[`${taskInfo[i].code}`] = {
                        value: formatDate(taskInfo[i].value),
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
                else {
                    info[`${taskInfo[i].code}`] = {
                        value: formatDate(Date.now()),
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
            }
            else if (taskInfo[i].type === "set_of_values") {
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
                    role: 'accountable',
                    checked: true
                }
            }
            else if (responsibleEmployees.indexOf(inactiveEmployees[i]) !== -1) {
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role: 'responsible',
                    checked: true
                }
            }
            else if (consultedEmployees.indexOf(inactiveEmployees[i]) !== -1) {
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role: 'consulted',
                    checked: true
                }
            }
        }

        let startDate = formatDate(task.startDate);
        let endDate = formatDate(task.endDate);

        let startTime = formatTime(task.startDate);
        let endTime = formatTime(task.endDate);

        return {
            listInactive: listInactive,
            userId: userId,
            task: task,
            info: info,
            taskName: taskName,
            taskDescription: taskDescription,
            taskDescriptionDefault: taskDescription,
            organizationalUnit: organizationalUnit,
            collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits,
            statusOptions: statusOptions,
            priorityOptions: priorityOptions,
            progress: progress,
            formula: formula,
            parent: parent,
            parentTask: parentTask,
            taskProjectName: taskProject,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            consultedEmployees: consultedEmployees,
            informedEmployees: informedEmployees,
            inactiveEmployees: inactiveEmployees,
            errorInfo: {}
        }
    }

    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany();
        // unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false, calledId = null
        props.getPaginateTasksByUser([], "1", "5", [], [], [], null, null, null, null, null, false, "listSearch");
    }, [])

    if (props.id !== state.id) {
        setState({
            ...state,
            id: props.id,

            errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
            errorOnPoint: undefined,
            errorOnInfoDate: undefined,
            errorOnProgress: undefined,
            errorTaskName: undefined,
            errorTaskDescription: undefined,
            errorOnFormula: undefined,
            errorInfo: {},
            errorOnStartDate: undefined,
            errorOnEndDate: undefined,
        })
    }


    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    function formatDate(date) {
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

    // convert ISODate to String hh:mm AM/PM
    function formatTime(date) {
        var d = new Date(date);
        let time = moment(d).format("hh:mm");
        let suffix = " AM";
        if (d.getHours() >= 12 && d.getHours() <= 23) {
            suffix = " PM";
        }
        return time + suffix;
    }

    const handleChangeProgress = (e) => {
        let value = parseInt(e.target.value);
        setState({
            ...state,
            progress: value,
            errorOnProgress: validatePoint(value)
        })
    }

    const handleChangeNumberInfo = (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'number'
            }
            state.errorInfo[name] = validateNumberInfo(value);
            return {
                ...state,
            }
        })
    }

    const handleChangeTextInfo = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'text'
            }
            state.errorInfo[name] = validateTextInfo(value);
            return {
                ...state,
            }
        })
    }

    const handleInfoDateChange = (value, code) => {
        setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'date'
            }
            state.errorInfo[code] = validateDate(value);
            return {
                ...state,
            }
        });
    }

    const handleSetOfValueChange = async (value, code) => {
        setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'set_of_values'
            }
            return {
                ...state,
            }
        });
    }

    const handleInfoBooleanChange = (event) => {
        let { name, value } = event.target;
        setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'boolean'
            }
            return {
                ...state,
            }
        });
    }


    const validateInfoBoolean = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    const validateTextInfo = (value) => {
        let { translate } = props;
        let msg = undefined;
        if (value === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    const validateNumberInfo = (value) => {
        let { translate } = props;
        let msg = undefined;

        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    const validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
        }

        return msg;
    }

    const validatePoint = (value) => {
        let { translate } = props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    const handleChangeListInfo = async (data) => {
        setState({
            ...state,
            listInfo: data
        })
    }

    const changeActiveEmployees = async (listInactive) => {
        let inactiveEmployees = [];
        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                inactiveEmployees.push(listInactive[i].value);
            }
        }
        await setState({
            ...state,
            inactiveEmployees: inactiveEmployees
        });
    }


    const handleChangeActiveAccountable = async (e, id) => {
        let { task } = state;
        let target = e.target;
        let { value, name, checked } = target;

        let numOfResponsible = state.responsibleEmployees.length;
        let numOfAccountable = state.accountableEmployees.length;

        await setState(state => {
            state.listInactive[`${id}`] = {
                value: value,
                checked: checked,
                role: 'accountable'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = state.listInactive;

        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                if (task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if (task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }

        if (numOfAccountable === numOfInactiveAcc) {
            let { translate } = props;
            Swal.fire({
                title: translate('task.task_perform.err_has_accountable'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'accountable'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if (numOfInactiveResp === numOfResponsible) {
            let { translate } = props;
            Swal.fire({
                title: translate('task.task_perform.err_has_responsible'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'accountable'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    const handleChangeActiveResponsible = async (e, id) => {
        let { task } = state;
        let target = e.target;
        let { value, name, checked } = target;

        let numOfResponsible = task.responsibleEmployees.length;
        let numOfAccountable = task.accountableEmployees.length;

        await setState(state => {
            state.listInactive[`${id}`] = {
                value: value,
                checked: checked,
                role: 'responsible'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = state.listInactive;

        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                if (task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if (task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }

        if (numOfInactiveResp === numOfResponsible) {
            let { translate } = props;
            Swal.fire({
                title: translate('task.task_perform.err_has_responsible'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'responsible'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if (numOfAccountable === numOfInactiveAcc) {
            let { translate } = props;
            Swal.fire({
                title: translate('task.task_perform.err_has_accountable'),
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('task.task_perform.confirm'),
            }).then((res) => {
                setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'responsible'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    const handleChangeActiveConsulted = async (e, id) => {
        let { task } = state;
        let target = e.target;
        let { value, name, checked } = target;

        let numOfResponsible = state.responsibleEmployees.length;
        let numOfAccountable = state.accountableEmployees.length;

        await setState(state => {
            state.listInactive[`${id}`] = {
                value: value,
                checked: checked,
                role: 'consulted'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = state.listInactive;

        for (let i in listInactive) {
            if (listInactive[i].checked === true) {
                if (task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if (task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }

        if (numOfAccountable === numOfInactiveAcc) {
            let { translate } = props;
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
                setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'consulted'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if (numOfInactiveResp === numOfResponsible) {
            let { translate } = props;
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
                setState(state => {
                    state.listInactive[`${id}`] = {
                        value: value,
                        checked: false,
                        role: 'consulted'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    const handleTaskNameChange = event => {
        let value = event.target.value;
        validateTaskName(value, true);
    }

    const validateTaskName = (value, willUpdateState) => {
        let { translate } = props;
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
        }
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    taskName: value,
                    errorTaskName: errorMessage
                }
            })
        }
        return errorMessage === undefined;
    }

    const handleTaskDescriptionChange = (value, imgs) => {
        validateTaskDescription(value, imgs, true);
    }

    const validateTaskDescription = (value, imgs, willUpdateState) => {
        let { translate } = props;
        let errorMessage = undefined;
        // if (value === "") {
        //     errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
        // }
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    taskDescription: value,
                    taskDescriptionImages: imgs,
                    errorTaskDescription: errorMessage,
                }
            })
        }
        return errorMessage === undefined;
    }


    const handleChangeTaskStartDate = (value) => {
        validateTaskStartDate(value, true);
    }
    const validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = TaskFormValidator.validateTaskStartDate(value, state.endDate, props.translate);

        if (value === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        } else {
            let startDate = convertDateTime(value, state.startTime);
            let endDate = convertDateTime(state.endDate, state.endTime);
            if (startDate > endDate) {
                msg = translate('task.task_management.add_err_end_date');
            }
        }
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    startDate: value,
                    errorOnStartDate: msg,
                };
            });
        }
        return msg === undefined;
    }

    const handleChangeTaskEndDate = (value) => {
        validateTaskEndDate(value, true);
    }
    const validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = TaskFormValidator.validateTaskEndDate(state.startDate, value, props.translate);

        if (value === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        } else {
            let startDate = convertDateTime(state.startDate, state.startTime);
            let endDate = convertDateTime(value, state.endTime);
            if (startDate > endDate) {
                msg = translate('task.task_management.add_err_end_date');
            }
        }
        if (willUpdateState) {
            state.endDate = value;
            state.errorOnEndDate = msg;
            setState({
                ...state,
            });
        }
        return msg === undefined;
    }

    const handleChangeTaskFormula = (event) => {
        let value = event.target.value;
        validateFormula(value, true);
    }

    const validateFormula = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (value === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        if (willUpdateState) {
            setState({
                ...state,
                formula: value,
                errorOnFormula: msg,
            });
        }
        return msg === undefined;
    }

    const handleTaskProgressChange = event => {
        let value = event.target.value;
        validateTaskProgress(value, true);
    }

    const validateTaskProgress = (value, willUpdateState) => {
        let { translate } = props;
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
            setState({
                ...state,
                taskProgress: value,
                errorTaskProgress: errorMessage,
            })
        }
        return errorMessage === undefined;
    }

    const isFormValidated = () => {
        let { info, errorInfo } = state;
        let check = true;
        if (Object.keys(errorInfo).length !== 0) {
            for (let i in errorInfo) {
                if (errorInfo[i]) {
                    check = false;
                    return;
                }
            }
        }
        // check &&
        return validateTaskName(state.taskName, false)
            && validateTaskDescription(state.taskDescription, false)
            && (state.errorOnProgress === undefined && state.errorOnEndDate === undefined && state.errorOnStartDate === undefined && check);
    }

    const onSearch = async (txt) => {

        await props.getPaginateTasksByUser([], "1", "5", [], [], [], txt, null, null, null, null, false, "listSearch");

        await setState({
            ...state,
            parent: state.parentTask ? state.parentTask._id : "",
        })
    }

    const handleSelectedPriority = (value) => {
        setState({
            ...state,
            priorityOptions: value
        });
    }

    const handleChangeCollaboratedWithOrganizationalUnits = async (value) => {
        await setState(state => {
            return {
                ...state,
                collaboratedWithOrganizationalUnits: value
            };
        });
    }

    const handleSelectedStatus = (value) => {
        setState({
            ...state,
            statusOptions: value
        })
    }

    const handleSelectedParent = async (value) => {
        let val = value[0];

        await setState({
            ...state,
            parent: val,
        })
    }

    const handleSelectedResponsibleEmployee = (value) => {
        setState({
            ...state,
            responsibleEmployees: value
        });
    }
    const handleSelectedAccountableEmployee = (value) => {
        setState({
            ...state,
            accountableEmployees: value
        });
    }
    const handleSelectedConsultedEmployee = (value) => {
        setState({
            ...state,
            consultedEmployees: value
        });
    }
    const handleSelectedInformEmployee = (value) => {
        setState({
            ...state,
            informedEmployees: value
        });
    }

    const save = () => {
        let listInactive = state.listInactive, taskId, inactiveEmployees = [];
        taskId = props.id;
        for (let i in listInactive) {
            if (listInactive[i].checked !== undefined && listInactive[i].checked === true) {
                inactiveEmployees.push(listInactive[i].value);
            }
        }
        let startDateTask = convertDateTime(state.startDate, state.startTime);
        let endDateTask = convertDateTime(state.endDate, state.endTime);
        let imageDescriptions = convertImageBase64ToFile(state.taskDescriptionImages)

        let data = {
            listInfo: state.listInfo,

            name: state.taskName,
            description: state.taskDescription,
            imageDescriptions: imageDescriptions,
            status: state.statusOptions,
            priority: state.priorityOptions,
            formula: state.formula,
            parent: state.parent,
            user: state.userId,
            progress: state.progress,
            date: formatDate(Date.now()),

            startDate: startDateTask,
            endDate: endDateTask,

            collaboratedWithOrganizationalUnits: state.collaboratedWithOrganizationalUnits,
            accountableEmployees: state.accountableEmployees,
            consultedEmployees: state.consultedEmployees,
            responsibleEmployees: state.responsibleEmployees,
            informedEmployees: state.informedEmployees,
            inactiveEmployees: inactiveEmployees,
            taskProject: state.taskProjectName,
            info: state.info,
        }
        props.editTaskByAccountableEmployees(data, taskId);
    }

    const formatPriority = (data) => {
        const { translate } = props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.average');
        if (data === 3) return translate('task.task_management.standard');
        if (data === 4) return translate('task.task_management.high');
        if (data === 5) return translate('task.task_management.urgent');
    }

    const formatRole = (data) => {
        const { translate } = props;
        if (data === "consulted") return translate('task.task_management.consulted');
        if (data === "accountable") return translate('task.task_management.accountable');
        if (data === "responsible") return translate('task.task_management.responsible');
    }

    const formatStatus = (data) => {
        const { translate } = props;
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
    }

    const handleTaskProject = (value) => {
        value = value.toString();
        setState({
            ...state,
            taskProjectName: value
        })
    }

    const handleStartTimeChange = (value) => {
        let { translate } = props;
        let startDate = convertDateTime(state.startDate, value);
        let endDate = convertDateTime(state.endDate, state.endTime);
        let err;
        if (value.trim() === "") {
            err = translate('task.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('task.task_management.add_err_end_date');
        }
        setState({
            ...state,
            startTime: value,
            errorOnStartDate: err,
        });
    }

    const handleEndTimeChange = (value) => {
        let { translate } = props;
        let startDate = convertDateTime(state.startDate, state.startTime);
        let endDate = convertDateTime(state.endDate, value);
        let err;
        if (value.trim() === "") {
            err = translate('task.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('task.task_management.add_err_end_date');
        }
        setState({
            ...state,
            endTime: value,
            errorOnEndDate: err,
        });
    }

    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}-${splitter[1]}-${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    let departmentUsers, usercompanys;
    if (user.userdepartments) departmentUsers = user.userdepartments;
    if (user.usercompanys) usercompanys = user.usercompanys;

    // list công việc liên quan.
    let listParentTask = [{ value: "", text: `--${translate('task.task_management.add_parent_task')}--` }];

    if (tasks.listSearchTasks) {
        let arr = tasks.listSearchTasks.map(x => { return { value: x._id, text: x.name } });

        if (parentTask) {
            // kiểm tra parent cũ có trong list search hay không
            let hasParentItem = arr.find(e => e.value === parentTask._id);

            //không có parent trong arr
            !hasParentItem && listParentTask.unshift({ value: parentTask._id, text: parentTask.name })
            for (let i in arr) {
                if (arr[i].value === parentTask._id) {
                    listParentTask.unshift({ value: parentTask._id, text: parentTask.name })
                }
                else listParentTask.push({ value: arr[i].value, text: arr[i].text })
            }
        }
        else {
            listParentTask = [...listParentTask, ...arr];
        }
    }


    let priorityArr = [
        { value: 1, text: translate('task.task_management.low') },
        { value: 2, text: translate('task.task_management.average') },
        { value: 3, text: translate('task.task_management.standard') },
        { value: 4, text: translate('task.task_management.high') },
        { value: 5, text: translate('task.task_management.urgent') },
    ];
    let statusArr = [
        { value: "inprocess", text: translate('task.task_management.inprocess') },
        { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
        { value: "finished", text: translate('task.task_management.finished') },
        { value: "delayed", text: translate('task.task_management.delayed') },
        { value: "canceled", text: translate('task.task_management.canceled') },
    ];

    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }
    let unitMembers = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
    let listDepartment = department?.list;

    return (
        <div>
            <React.Fragment>
                <DialogModal
                    size={75}
                    maxWidth={750}
                    modalID={hasAccountable ? `modal-edit-task-by-${role}-${id}` : `modal-edit-task-by-${role}-${id}-has-not-accountable`}
                    formID={`form-edit-task-${role}-${id}`}
                    title={title}
                    isLoading={false}
                    func={save}
                    disableSubmit={!isFormValidated()}
                >
                    <form id={`form-edit-task-${role}-${id}`}>
                        {/*Thông tin cơ bản*/}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('task.task_management.edit_basic_info')}</legend>
                            <div>
                                <div className={`form-group ${errorTaskName === undefined ? "" : "has-error"}`}>
                                    <label>{translate('task.task_management.name')}<span className="text-red">*</span></label>
                                    <input type="text"
                                        value={taskName}
                                        className="form-control" onChange={handleTaskNameChange} />
                                    <ErrorLabel content={errorTaskName} />
                                </div>
                                <div
                                    className={`form-group ${errorTaskDescription === undefined ? "" : "has-error"}`}>
                                    <label>{translate('task.task_management.detail_description')}</label>
                                    <QuillEditor
                                        id={`task-edit-by-accountable-${props.id}`}
                                        table={false}
                                        embeds={false}
                                        quillValueDefault={taskDescriptionDefault}
                                        getTextData={handleTaskDescriptionChange}
                                        maxHeight={180}
                                        placeholder={"Mô tả công việc"}
                                    />
                                    <ErrorLabel content={errorTaskDescription} />
                                </div>
                                <div className="form-group">
                                    <label>{translate('task.task_management.add_parent_task')}</label>
                                    <SelectBox
                                        id={`select-parent-${perform}-${role}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={listParentTask}
                                        multiple={false}
                                        value={parent}
                                        onChange={handleSelectedParent}
                                        onSearch={onSearch}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        {translate('task.task_management.project')}
                                    </label>
                                    <TreeSelect
                                        id={`select-task-project-task-edit-by-accountable-${id}`}
                                        mode='radioSelect'
                                        data={project.data?.list}
                                        handleChange={handleTaskProject}
                                        value={[taskProjectName]}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        {/*Thông tin chi tiết*/}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('task.task_management.edit_detail_info')}</legend>
                            {/* <div> */}

                            {/* Đơn vị phối hợp thực hiện công việc */}
                            {listDepartment &&
                                <div className="form-group">
                                    <label>{translate('task.task_management.collaborated_with_organizational_units')}</label>
                                    <SelectBox
                                        id={`editMultiSelectUnitThatHaveCollaborated-${perform}-${role}`}
                                        lassName="form-control select2"
                                        style={{ width: "100%" }}
                                        items={listDepartment.filter(item => item._id !== organizationalUnit).map(x => {
                                            return { text: x.name, value: x._id }
                                        })}
                                        options={{ placeholder: translate('kpi.evaluation.dashboard.select_units') }}
                                        onChange={handleChangeCollaboratedWithOrganizationalUnits}
                                        value={collaboratedWithOrganizationalUnits}
                                        multiple={true}
                                    />
                                </div>
                            }

                            <div className="row form-group">
                                <div className="col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                    <label>{translate('task.task_management.detail_status')}</label>
                                    {
                                        <SelectBox
                                            id={`select-status-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={statusArr}
                                            multiple={false}
                                            value={statusOptions[0]}
                                            onChange={handleSelectedStatus}
                                        />
                                    }
                                </div>

                                {/*Mức ưu tiên*/}
                                <div className="col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                    <label>{translate('task.task_management.detail_priority')}</label>
                                    {
                                        <SelectBox
                                            id={`select-priority-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={priorityArr}
                                            multiple={false}
                                            value={priorityOptions[0]}
                                            onChange={handleSelectedPriority}
                                        />
                                    }
                                </div>
                            </div>


                            {/* </div> */}
                            <div className="row form-group">
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('task.task_management.start_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`datepicker2-startdate-${id}`}
                                        value={startDate}
                                        onChange={handleChangeTaskStartDate}
                                    />
                                    < TimePicker
                                        id={`time-picker-1-start-time${id}`}
                                        value={startTime}
                                        onChange={handleStartTimeChange}
                                    />
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('task.task_management.end_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`datepicker2-enddate-${id}`}
                                        value={endDate}
                                        onChange={handleChangeTaskEndDate}
                                    />
                                    < TimePicker
                                        id={`time-picker-2-end-time-${id}`}
                                        value={endTime}
                                        onChange={handleEndTimeChange}
                                    />
                                    <ErrorLabel content={errorOnEndDate} />
                                </div>
                            </div>
                            {/**Công thức tính của mẫu công việc */}
                            <div className={` form-group ${errorOnFormula === undefined ? "" : "has-error"}`} >
                                <label className="control-label" htmlFor="inputFormula">{translate('task_template.formula')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" id="inputFormula" placeholder="progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100"
                                    value={formula} onChange={handleChangeTaskFormula}
                                />
                                <ErrorLabel content={errorOnFormula} />

                                <br />
                                <div><span style={{ fontWeight: 800 }}>Ví dụ: </span>progress / (daysUsed / totalDays) - (sumRatingOfFailedActions / sumRatingOfAllActions) * 100</div>
                                <br />
                                <div><span style={{ fontWeight: 800 }}>{translate('task_template.parameters')}:</span></div>
                                <div><span style={{ fontWeight: 600 }}>daysOverdue</span> - Thời gian quá hạn (ngày)</div>
                                <div><span style={{ fontWeight: 600 }}>daysUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                                <div><span style={{ fontWeight: 600 }}>totalDays</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)</div>
                                <div><span style={{ fontWeight: 600 }}>averageActionRating</span> - Trung bình điểm đánh giá (rating) hoạt động của công việc</div>
                                <div><span style={{ fontWeight: 600 }}>sumRatingOfFailedActions</span> - Tổng các tích điểm hoạt động và độ quan trọng hoạt động của các hoạt động không đạt (rating &lt; 5)</div>
                                <div><span style={{ fontWeight: 600 }}>sumRatingOfAllActions</span> - Tổng các tích điểm hoạt động và độ quan trọng hoạt động của tất cả hoạt động</div>
                                <div><span style={{ fontWeight: 600 }}>progress</span> - % Tiến độ công việc (0-100)</div>
                                <div><span style={{ fontWeight: 600 }}>p1, p2,...</span> - Thông tin công việc kiểu số (Chỉ có với các công việc theo mẫu)</div>
                            </div>
                        </fieldset>

                        <TaskInformationForm
                            task={task && task}

                            handleChangeProgress={handleChangeProgress}
                            handleInfoBooleanChange={handleInfoBooleanChange}
                            handleInfoDateChange={handleInfoDateChange}
                            handleSetOfValueChange={handleSetOfValueChange}
                            handleChangeNumberInfo={handleChangeNumberInfo}
                            handleChangeTextInfo={handleChangeTextInfo}
                            handleChangeListInfo={handleChangeListInfo}

                            role={role}
                            perform={perform}
                            value={state}
                            progress={state.progress}
                        />
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('task.task_management.edit_member_info')}</legend>

                            {/*Người thực hiện*/}
                            <div className="form-group">
                                <label>{translate('task.task_management.responsible')}</label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`select-responsible-employee-${perform}-${role}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={handleSelectedResponsibleEmployee}
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
                                        id={`select-accountable-employee-${perform}-${role}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={handleSelectedAccountableEmployee}
                                        multiple={true}
                                        value={accountableEmployees}
                                    />
                                }
                            </div>

                            {/*Người tư vấn */}
                            <div className="form-group">
                                <label>{translate('task.task_management.consulted')}</label>
                                {usercompanys &&
                                    <SelectBox
                                        id={`select-consulted-employee-${perform}-${role}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            usercompanys.map(x => {
                                                return { value: x._id, text: x.name };
                                            })
                                        }
                                        onChange={handleSelectedConsultedEmployee}
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
                                        id={`select-informed-employee-${perform}-${role}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            usercompanys.map(x => {
                                                return { value: x._id, text: x.name };
                                            })
                                        }
                                        onChange={handleSelectedInformEmployee}
                                        multiple={true}
                                        value={informedEmployees}
                                    />
                                }
                            </div>
                        </fieldset>


                        {/* Thành viên rời khỏi công việc */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('task.task_management.edit_inactive_emp')}</legend>
                            <div className="form-group">

                                <div>
                                    {/* Thành viên phê duyệt */}
                                    <div style={{ marginBottom: 15 }}>
                                        <div style={{ marginBottom: 5 }}><strong>{translate('task.task_management.accountable')}</strong></div>
                                        {
                                            task.accountableEmployees.map((elem, index) => {
                                                return <div key={index} style={{ paddingLeft: 20 }}>
                                                    <label style={{ fontWeight: "normal", margin: "7px 0px" }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={state.listInactive[`${elem._id}`] && state.listInactive[`${elem._id}`].checked === true}
                                                            value={elem._id}
                                                            name="accountable" onChange={(e) => handleChangeActiveAccountable(e, elem._id)}
                                                        />&nbsp;&nbsp;&nbsp;{elem.name}
                                                    </label>
                                                </div>
                                            })
                                        }
                                    </div>

                                    <div style={{ marginBottom: 15 }}>
                                        <div style={{ marginBottom: 5 }}><strong>{translate('task.task_management.responsible')}</strong></div>
                                        {
                                            task.responsibleEmployees.map((elem, index) => {
                                                return <div key={index} style={{ paddingLeft: 20 }}>
                                                    <label style={{ fontWeight: "normal", margin: "7px 0px" }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={state.listInactive[`${elem._id}`] && state.listInactive[`${elem._id}`].checked === true}
                                                            value={elem._id}
                                                            name="responsible" onChange={(e) => handleChangeActiveResponsible(e, elem._id)}
                                                        />&nbsp;&nbsp;&nbsp;{elem.name}
                                                    </label>
                                                    <br />
                                                </div>
                                            })
                                        }
                                    </div>

                                    {task.consultedEmployees.length !== 0 &&
                                        <div>
                                            <div style={{ marginBottom: 5 }}><strong>{translate('task.task_management.consulted')}</strong></div>
                                            {
                                                task.consultedEmployees.map((elem, key) => {
                                                    return <div key={key} style={{ paddingLeft: 20 }}>
                                                        <label style={{ fontWeight: "normal", margin: "7px 0px" }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={state.listInactive[`${elem._id}`] && state.listInactive[`${elem._id}`].checked === true}
                                                                value={elem._id}
                                                                name="consulted" onChange={(e) => handleChangeActiveConsulted(e, elem._id)}
                                                            />&nbsp;&nbsp;&nbsp;{elem.name}
                                                        </label>
                                                        <br />
                                                    </div>
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
        </div >
    );
}

function mapStateToProps(state) {
    const { tasks, user, tasktemplates, performtasks, department, project } = state;
    return { tasks, user, tasktemplates, performtasks, department, project };
}

const actionGetState = { //dispatchActionToProps
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    editTaskByAccountableEmployees: performTaskAction.editTaskByAccountableEmployees,
    getPaginateTasksByUser: taskManagementActions.getPaginateTasksByUser,
}

const modalEditTaskByAccountableEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByAccountableEmployee));
export { modalEditTaskByAccountableEmployee as ModalEditTaskByAccountableEmployee };
