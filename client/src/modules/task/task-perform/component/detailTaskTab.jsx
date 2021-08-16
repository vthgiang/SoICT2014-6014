import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { performTaskAction } from './../redux/actions';
import { taskManagementActions } from './../../task-management/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';

import { ModalEditTaskByResponsibleEmployee } from './modalEditTaskByResponsibleEmployee';
import { ModalEditTaskByAccountableEmployee } from './modalEditTaskByAccountableEmployee';
import { HoursSpentOfEmployeeChart } from './hourSpentOfEmployeeChart';
import { CollaboratedWithOrganizationalUnits } from './collaboratedWithOrganizationalUnits';

import { EvaluationModal } from './evaluationModal';
import { getStorage } from '../../../../config';
import { SelectFollowingTaskModal } from './selectFollowingTaskModal';
import { withTranslate } from 'react-redux-multilingual';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { ShowMoreShowLess, QuillEditor } from '../../../../common-components';
import Swal from 'sweetalert2';

import { TaskAddModal } from '../../task-management/component/taskAddModal';
import { ModalAddTaskTemplate } from '../../task-template/component/addTaskTemplateModal';
import { RequestToCloseTaskModal } from './requestToCloseTaskModal';

import { ROOT_ROLE } from '../../../../helpers/constants';
import dayjs from 'dayjs';

// convert ISODate to String dd-mm-yyyy
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

const taskPriorityColor = (priority) => {
    switch (priority) {
        case 5:
            return "#ff0707";
        case 4:
            return "#ff5707";
        case 3:
            return "#28A745";
        case 2:
            return "#ffa707";
        default:
            return "#808080"
    }
}


const taskStatusColor = (status) => {
    switch (status) {
        case "inprocess":
            return "#385898";
        case "canceled":
            return "#e86969";
        case "delayed":
            return "#db8b0b";
        case "finished":
            return "#31b337";
        default:
            return "#333";
    }
}

function DetailTaskTab(props) {
    const [state, setState] = useState(() => initState())
    const [dataCheck, setDataCheck] = useState({})
    const [currentRole, setCurrentRole] = useState(null)
    const { performtasks, user, translate, role } = props;
    const { showToolbar, id, isProcess } = props; // props form parent component ( task, id, showToolbar, onChangeTaskRole() )
    const { currentUser, roles, collapseInfo,
        showEdit, showEndTask, showEvaluate, showRequestClose,
        showMore, showCopy, showSaveAsTemplate, modalEditId
    } = state

    const ROLE = {
        RESPONSIBLE: { name: translate('task.task_management.responsible'), value: "responsible" },
        ACCOUNTABLE: { name: translate('task.task_management.accountable'), value: "accountable" },
        CONSULTED: { name: translate('task.task_management.consulted'), value: "consulted" },
        CREATOR: { name: translate('task.task_management.creator'), value: "creator" },
        INFORMED: { name: translate('task.task_management.informed'), value: "informed" },
    };

    function initState() {
        var idUser = getStorage("userId");
        let currentRoleId = getStorage("currentRole");

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        return {
            collapseInfo: false,
            openTimeCounnt: false,
            startTimer: false,
            pauseTimer: false,
            highestIndex: 0,
            currentUser: idUser,
            currentRoleId,
            showMore: {},
            modalEditId: undefined,
            currentMonth: currentYear + '-' + (currentMonth + 1),
            nextMonth: (currentMonth > 10) ? ((currentYear + 1) + '-' + (currentMonth - 10)) : (currentYear + '-' + (currentMonth + 2)),
            dueForEvaluationOfTask: currentYear + '-' + (currentMonth + 1) + '-' + 7
        }
    }

    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany();
        const { currentRoleId } = state;
        props.showInfoRole(currentRoleId);
    }, [])

    useEffect(() => {
        setState({
            ...state,
            id: props.id,
            editCollaboratedTask: false
        })
    }, [props.id])

    useEffect(() => {
        if (performtasks?.task) {
            let task = performtasks.task; /// chú ý: cần check thêm trường hợp quy trình có lấy dữ liệu ở performTasks hay ko
            if (task?.organizationalUnit) props.getChildrenOfOrganizationalUnits(task.organizationalUnit._id);

            let roles = [];
            if (task) {
                let userId = getStorage("userId");
                let tmp = task.responsibleEmployees.find(item => item._id === userId);
                if (tmp) {
                    roles.push(ROLE.RESPONSIBLE);
                }

                tmp = task.accountableEmployees && task.accountableEmployees.find(item => item._id === userId);
                if (tmp) {
                    roles.push(ROLE.ACCOUNTABLE);
                }

                tmp = task.consultedEmployees && task.consultedEmployees.find(item => item._id === userId);
                if (tmp) {
                    roles.push(ROLE.CONSULTED);
                }

                tmp = task.informedEmployees && task.informedEmployees.find(item => item._id === userId);
                if (tmp) {
                    roles.push(ROLE.INFORMED);
                }

                if (task.creator._id)
                    if (userId === task.creator._id) roles.push(ROLE.CREATOR);
                if (!task.creator._id)
                    if (userId === task.creator) roles.push(ROLE.CREATOR);
            }

            if (roles.length > 0) {
                if (!currentRole) {
                    setCurrentRole(roles[0].value)
                    if (props.onChangeTaskRole) {
                        props.onChangeTaskRole(roles[0].value);
                    }
                }
                else {
                    if (!roles.some(e => e.value === currentRole)) {
                        setCurrentRole(roles[0].value)
                        if (props.onChangeTaskRole) {
                            props.onChangeTaskRole(roles[0].value);
                        }
                    }
                    else {
                        if (props.onChangeTaskRole) {
                            props.onChangeTaskRole(currentRole);
                        }
                    }
                }
            }
            setState({
                ...state,
                roles: roles,
            })
        }
    }, [JSON.stringify(performtasks?.task)])

    useEffect(() => {
        window.$(`#modal-request-close-task-${showRequestClose}`).modal('show');
    }, [showRequestClose])

    useEffect(() => {
        window.$(`#task-evaluation-modal-${showEvaluate}-`).modal('show');
    }, [showEvaluate])

    useEffect(() => {
        window.$(`#modal-add-task-template-${showSaveAsTemplate}`).modal('show');
    }, [showSaveAsTemplate])

    useEffect(() => {
        window.$(modalEditId).modal('show');
    }, [modalEditId])

    const handleChangeCollapseInfo = () => {
        setState({
            ...state,
            collapseInfo: !state.collapseInfo
        });
    }

    const handleChangeShowMoreEvalItem = (id) => {
        setState(state => {
            state.showMore[id] = !state.showMore[id];
            return {
                ...state,
            }
        });
    }

    const startTimer = (taskId, overrideTSLog = 'no') => {
        let userId = getStorage("userId");
        let timer = {
            creator: userId,
            overrideTSLog
        };
        props.startTimer(taskId, timer).catch(err => {
            let warning = Array.isArray(err.response.data.messages) ? err.response.data.messages : [err.response.data.messages];
            if (warning[0] === 'time_overlapping') {
                Swal.fire({
                    title: `Bạn đã hẹn tắt bấm giờ cho công việc [ ${warning[1]} ]`,
                    html: `<h4 class="text-red">Lưu lại những giờ đã bấm được cho công việc [ ${warning[1]} ] và bấm giờ công việc mới</h4>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Bấm giờ mới',
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let timer = {
                            creator: userId,
                            overrideTSLog: 'yes'
                        };
                        props.startTimer(taskId, timer)
                    }
                })
            }
        })
    }

    const formatPriority = (data) => {
        const { translate } = props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.average');
        if (data === 3) return translate('task.task_management.standard');
        if (data === 4) return translate('task.task_management.high');
        if (data === 5) return translate('task.task_management.urgent');
    }

    const formatStatus = (data) => {
        const { translate } = props;
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
    }


    const handleShowEdit = (id, role, checkHasAccountable) => {
        let modalId = `#modal-edit-task-by-${role}-${id}`;
        if (checkHasAccountable === false && role === "responsible") {
            modalId = `#modal-edit-task-by-${role}-${id}-has-not-accountable`
        }
        setState({
            ...state,
            showEdit: id,
            modalEditId: modalId
        });

        window.$(modalId).modal('show');

    }

    const handleShowRequestCloseTask = (id) => {
        setState({
            ...state,
            showRequestClose: id
        });

        let modalId = `#modal-request-close-task-${id}`;
        window.$(modalId).modal('show');
    }

    const handleOpenTaskAgain = (id) => {
        const { translate } = props;

        Swal.fire({
            title: translate('task.task_management.confirm_open_task'),
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
        }).then((res) => {
            if (res.value) {
                props.openTaskAgain(id)
            }
        });
    }

    const handleEndTask = (id, status, codeInProcess, typeOfTask) => {
        setState({
            ...state,
            showEndTask: id,
        });

        window.$(`#modal-select-following-task`).modal('show');
    }

    const handleShowEvaluate = (id, role) => {
        setState({
            ...state,
            showEvaluate: id
        });
        // window.$(`#modal-evaluate-task-by-${role}-${id}-evaluate`).modal('show');
        window.$(`#task-evaluation-modal-${id}-`).modal('show');

    }

    const handleCopyTask = (id, role) => {
        setState({
            ...state,
            showCopy: `copy-task-${id}`
        });
        window.$(`#addNewTask-copy-task-${id}`).modal('show');

    }

    const handleSaveAsTemplate = (id, role) => {
        setState({
            ...state,
            showSaveAsTemplate: id
        });
        window.$(`#modal-add-task-template-${id}`).modal('show');

    }

    const refresh = () => {
        props.getTaskById(state.id);
        props.getSubTask(state.id);
        props.getTimesheetLogs(state.id);
        props.getTaskLog(state.id);
        setState({
            ...state,
            showEdit: undefined,
            showEndTask: undefined,
            showEvaluate: undefined,
        })

    }
    const changeRole = (role) => {
        setCurrentRole(role)
        props.onChangeTaskRole(role);
    }

    const confirmTask = (task) => {
        if (task) {
            props.confirmTask(task._id);
        }
    }

    /** Kiểm tra nhân viên chưa xác nhận công việc */
    const handleCheckConfirmTask = (task) => {
        const { currentUser } = state;

        let checkConfirmOtherUser = false, checkConfirmCurrentUser = false, listEmployee, listEmployeeNotConfirm = [];
        let confirmedByEmployeesId, listEmployeeId;

        if (task && task.responsibleEmployees && task.accountableEmployees && task.consultedEmployees && task.confirmedByEmployees) {
            listEmployee = task.responsibleEmployees.concat(task.accountableEmployees).concat(task.consultedEmployees);
            confirmedByEmployeesId = task.confirmedByEmployees.map(item => item._id);
            listEmployeeId = listEmployee.map(item => item._id);

            listEmployeeNotConfirm = listEmployee.filter(item => {
                if (!confirmedByEmployeesId.includes(item._id)) {
                    return true;
                }
            })
            // Lọc các phần tử trùng lặp
            let idArray = listEmployeeNotConfirm.map(item => item._id);
            idArray = idArray.map((item, index, array) => {
                if (array.indexOf(item) === index) {
                    return index;
                } else {
                    return false
                }
            })
            idArray = idArray.filter(item => listEmployeeNotConfirm[item]);
            listEmployeeNotConfirm = idArray.map(item => {
                return listEmployeeNotConfirm[item]
            })

            if (listEmployeeId.includes(currentUser) && !confirmedByEmployeesId.includes(currentUser)) {
                checkConfirmCurrentUser = true
            };
        }

        if (listEmployeeNotConfirm.length !== 0) {
            checkConfirmOtherUser = true;
        }

        listEmployeeNotConfirm = listEmployeeNotConfirm.filter(item => item.active);

        return {
            listEmployeeNotConfirm: listEmployeeNotConfirm,
            checkConfirmCurrentUser: checkConfirmCurrentUser,
            checkConfirmOtherUser: checkConfirmOtherUser,
            checkConfirm: checkConfirmOtherUser || checkConfirmCurrentUser
        }
    }

    /** Kiểm tra hoạt động chưa có đánh giá */
    const handleCheckEvaluationTaskAction = (task) => {
        if (task) {
            let { taskActions } = task;
            if (taskActions) {
                let rated = taskActions.filter(task => task.rating === -1);
                return {
                    checkEvaluationTaskAction: rated.length !== 0,
                    numberOfTaskActionNotEvaluate: rated.length
                }
            }
        }
        return {
            checkEvaluationTaskAction: false
        }
    }

    /** Kiểm tra nhân viên chưa liên kết KPI */
    const handleCheckEvaluationTaskAndKpiLink = (task) => {
        const { currentMonth, nextMonth } = state;

        let evaluations = [], checkEvaluationTask = false;
        let listEmployeeNotKpiLink = [], responsibleEmployeesNotKpiLink = [], accountableEmployeesNotKpiLink = [], consultedEmployeesNotKpiLink = [];

        if (task && task.evaluations) {
            evaluations = task.evaluations.filter(item => new Date(item.evaluatingMonth) >= new Date(currentMonth) && new Date(item.evaluatingMonth) < new Date(nextMonth));

            if (evaluations.length === 0) {
                // Check đánh giá trong tháng
                checkEvaluationTask = true;
            } else {
                // Nhân viên chưa liên kết KPI
                if (evaluations[0].results && evaluations[0].results.length !== 0) {
                    if (task.responsibleEmployees) {
                        responsibleEmployeesNotKpiLink = task.responsibleEmployees.filter(item => {
                            for (let i = 0; i < evaluations[0].results.length; i++) {
                                if (evaluations[0].results[i].employee && item._id === evaluations[0].results[i].employee._id && evaluations[0].results[i].role === 'responsible') {
                                    if (evaluations[0].results[i].kpis && evaluations[0].results[i].kpis.length !== 0) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        })
                    }
                    if (task.accountableEmployees) {
                        accountableEmployeesNotKpiLink = task.accountableEmployees.filter(item => {
                            for (let i = 0; i < evaluations[0].results.length; i++) {
                                if (evaluations[0].results[i].employee && item._id === evaluations[0].results[i].employee._id && evaluations[0].results[i].role === 'accountable') {
                                    if (evaluations[0].results[i].kpis && evaluations[0].results[i].kpis.length !== 0) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        })
                    }
                    if (task.consultedEmployees) {
                        consultedEmployeesNotKpiLink = task.consultedEmployees.filter(item => {
                            for (let i = 0; i < evaluations[0].results.length; i++) {
                                if (evaluations[0].results[i].employee && item._id === evaluations[0].results[i].employee._id && evaluations[0].results[i].role === 'consulted') {
                                    if (evaluations[0].results[i].kpis && evaluations[0].results[i].kpis.length !== 0) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        })
                    }

                    listEmployeeNotKpiLink = responsibleEmployeesNotKpiLink.concat(accountableEmployeesNotKpiLink).concat(consultedEmployeesNotKpiLink);
                }
            }
        }

        // Loc phần tử lặp
        let idArray = listEmployeeNotKpiLink.map(item => item._id);
        idArray = idArray.map((item, index, array) => {
            if (array.indexOf(item) === index) {
                return index;
            } else {
                return false
            }
        })
        idArray = idArray.filter(item => listEmployeeNotKpiLink[item]);
        listEmployeeNotKpiLink = idArray.map(item => {
            return listEmployeeNotKpiLink[item]
        })
        listEmployeeNotKpiLink = listEmployeeNotKpiLink.filter(item => item.active);

        return {
            checkEvaluationTask: checkEvaluationTask,
            checkKpiLink: listEmployeeNotKpiLink.length !== 0,
            listEmployeeNotKpiLink: listEmployeeNotKpiLink
        }
    }

    /** Kiểm tra thời hạn đánh giá */
    const handleCheckDeadlineForEvaluation = (task) => {
        const { dueForEvaluationOfTask, currentMonth } = state;

        let checkDeadlineForEvaluation = false, deadlineForEvaluation, evaluations;
        let currentDate = new Date();
        let lastMonth = currentDate.getFullYear() + '-' + currentDate.getMonth();

        if (task && task.evaluations) {
            // Check evaluations tháng trước
            evaluations = task.evaluations.filter(item => new Date(item.evaluatingMonth) >= new Date(lastMonth) && new Date(item.evaluatingMonth) < new Date(currentMonth));

            if (evaluations.length !== 0) {
                // Check số ngày đến hạn đánh giá
                deadlineForEvaluation = ((new Date(dueForEvaluationOfTask)).getTime() - currentDate.getTime()) / (3600 * 24 * 1000);
                if (deadlineForEvaluation > 0) {
                    checkDeadlineForEvaluation = true;

                    if (deadlineForEvaluation < 1) {
                        if (deadlineForEvaluation * 24 < 1) {
                            deadlineForEvaluation = Math.floor(deadlineForEvaluation * 24 * 60) + ` ${props.translate('task.task_management.warning_minutes')}`;
                        } else {
                            deadlineForEvaluation = Math.floor(deadlineForEvaluation * 24) + ` ${props.translate('task.task_management.warning_hours')}`;
                        }
                    } else {
                        deadlineForEvaluation = Math.floor(deadlineForEvaluation) + ` ${props.translate('task.task_management.warning_days')}`;
                    }
                }
            }
        }

        return {
            checkDeadlineForEvaluation: checkDeadlineForEvaluation,
            deadlineForEvaluation: deadlineForEvaluation
        }
    }

    /** Kiểm tra đơn vị chưa xác nhận phân công công việc */
    const handleCheckConfirmAssginOfOrganizationalUnit = (task) => {
        let unitHasNotConfirm = [];

        if (task && task.collaboratedWithOrganizationalUnits) {
            if (task.collaboratedWithOrganizationalUnits.length !== 0) {
                task.collaboratedWithOrganizationalUnits.map(item => {
                    if (!item.isAssigned) {
                        unitHasNotConfirm.push(item.organizationalUnit && item.organizationalUnit.name);
                    }
                })
            }
        }

        return {
            checkConfirm: unitHasNotConfirm.length !== 0,
            unitHasNotConfirm: unitHasNotConfirm
        }
    }

    const calculateHoursSpentOnTask = async (taskId, timesheetLogs, month, evaluate, startDate, endDate) => {
        let results = evaluate && evaluate.results;
        results.map(item => {
            item.hoursSpent = 0;
        })

        for (let i in timesheetLogs) {
            let log = timesheetLogs[i];
            let startedAt = new Date(log.startedAt);
            let stoppedAt = new Date(log.stoppedAt);

            if (startedAt.getTime() >= (new Date(startDate)).getTime() && stoppedAt.getTime() <= (new Date(endDate)).getTime()) {
                let { creator, duration } = log;
                let check = true;
                let newResults = [];

                newResults = results.map(item => {
                    if (item.employee && creator._id === item.employee._id) {

                        check = false;
                        return {
                            ...item,
                            employee: item.employee._id,
                            hoursSpent: duration + item.hoursSpent,
                        }
                    } else {
                        return item;
                    }
                })

                if (check) {
                    let employeeHoursSpent = {
                        employee: creator,
                        hoursSpent: duration,
                    };

                    newResults.push(employeeHoursSpent);
                }

                results = [...newResults];
            }
        }

        let data = {
            evaluateId: evaluate._id,
            timesheetLogs: results.map(item => {
                return {
                    employee: item.employee && item.employee,
                    hoursSpent: item.hoursSpent
                }
            }),
        }

        await props.editHoursSpentInEvaluate(data, taskId);
    }

    const getTaskActionsNotPerform = (taskActions) => {
        return taskActions.filter(action => !action.creator).length;
    }

    /** 
     * Kiểm tra role hiện tại có phải trưởng đơn vị ko
     * Nếu có, tạo SelectBox tất cả nhân viên của đơn vị 
     * Ngược lại, trả về mảng rỗng
    */
    const setSelectBoxOfUserSameDepartmentCollaborated = (task) => {
        const { user } = props;
        const { currentUser } = state;
        let usersInUnitsOfCompany, unitThatCurrentUserIsManager, employeeSelectBox = [];

        if (user) {
            usersInUnitsOfCompany = user.usersInUnitsOfCompany;
        }

        if (usersInUnitsOfCompany && usersInUnitsOfCompany.length !== 0) {
            unitThatCurrentUserIsManager = usersInUnitsOfCompany.filter(unit => {
                let check = false;
                let unitCollaborated = task?.collaboratedWithOrganizationalUnits?.length > 0 && task.collaboratedWithOrganizationalUnits.map(item => item.organizationalUnit && item.organizationalUnit?._id);

                if (unitCollaborated?.length > 0 && unitCollaborated.includes(unit.id) && unit.managers) {
                    let employee = Object.values(unit.managers);
                    if (employee && employee.length !== 0) {
                        employee.map(employee => {
                            employee.members && employee.members.map(item => {
                                if (item._id == currentUser) check = true;
                            })
                        })
                    }
                }

                return check;
            })
        }

        if (unitThatCurrentUserIsManager && unitThatCurrentUserIsManager.length !== 0) {
            unitThatCurrentUserIsManager.map(item => {
                let temporary = [];
                temporary = getEmployeeSelectBoxItems([item]);
                temporary[0] = {
                    ...temporary[0],
                    id: item.id
                };
                employeeSelectBox = employeeSelectBox.concat(temporary[0]);
            })
        }

        // employeeSelectBox rỗng = user hiện tại không phải trưởng đơn vị các đơn vị phối hợp
        return employeeSelectBox;
    }

    const remindEvaluateTaskOnThisMonth = (task) => {
        let endOfMonth = new Date(dayjs().endOf('month').format()); // lấy ngày cuối cũng của tháng hiện tại
        let today = new Date();
        let check;

        // kiểm tra đánh giá tháng hiện tại
        let denta = Math.abs(endOfMonth.getTime() - today.getTime());
        let dentaDate = denta / (24 * 60 * 60 * 1000);

        if (dentaDate <= 7) {
            check = true;
        }
        return check;
    }

    /** sắp xếp đánh giá theo thứ tự tháng */
    const handleSortMonthEval = (evaluations) => {
        const sortedEvaluations = evaluations.sort((a, b) => new Date(b.evaluatingMonth) - new Date(a.evaluatingMonth));
        return sortedEvaluations;
    }

    // convert ISODate to String hh:mm AM/PM
    function formatTime(date) {
        return dayjs(date).format("DD-MM-YYYY hh:mm A")
    }


    useEffect(() => {
        let task;
        if (props?.isProcess) {
            task = props.task;
        } else if (Object.entries(performtasks).length > 0) {
            task = performtasks.task;
        }
        console.log('taskEfect', task);

        if (task) {
            let codeInProcess, typeOfTask, statusTask, checkInactive = true, evaluations, evalList = [];
            // Các biến dùng trong phần Nhắc Nhở
            let warning = false, checkEvaluate, checkConfirmTask, checkEvaluationTaskAction, checkEvaluationTaskAndKpiLink, checkDeadlineForEvaluation, checkConfirmAssginOfOrganizationalUnit;
            // Các biến dùng cho biểu đồ đóng góp thời gian
            let hoursSpentOfEmployeeInTask, hoursSpentOfEmployeeInEvaluation = {};
            // Các biến check trưởng đơn vị phối hợp
            let employeeCollaboratedWithUnitSelectBox;

            // kiểm tra công việc chỉ có người thực hiện
            let checkHasAccountable = true;

            codeInProcess = task.codeInProcess;
            if (codeInProcess) {
                let splitter = codeInProcess.split("_");
                typeOfTask = splitter[0];
            }

            if (task?.accountableEmployees?.length === 0) {
                checkHasAccountable = false;
            }

            statusTask = task.status;
            checkInactive = task.inactiveEmployees && task.inactiveEmployees.indexOf(currentUser) === -1;

            if (task?.evaluations?.length !== 0) {
                evaluations = task.evaluations; //.reverse()
            }

            // thêm giá trị prevDate vào evaluation
            if (evaluations && evaluations.length > 0) {
                for (let i = 0; i < evaluations.length; i++) {
                    let prevEval;
                    let startDate = task.startDate;
                    let prevDate = startDate;
                    let splitter = formatDate(evaluations[i].evaluatingMonth).split("-");

                    let dateOfPrevEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                    let newMonth = dateOfPrevEval.getMonth() - 1;
                    if (newMonth < 0) {
                        newMonth += 12;
                        dateOfPrevEval.setYear(dateOfPrevEval.getFullYear() - 1);
                    }
                    dateOfPrevEval.setDate(15);
                    dateOfPrevEval.setMonth(newMonth);

                    let monthOfPrevEval = dateOfPrevEval.getMonth();
                    let yearOfPrevEval = dateOfPrevEval.getFullYear();
                    prevEval = evaluations.find(e => (monthOfPrevEval === new Date(e.evaluatingMonth).getMonth() && yearOfPrevEval === new Date(e.evaluatingMonth).getFullYear()));
                    if (prevEval) {
                        prevDate = prevEval.evaluatingMonth;
                    } else {
                        // trong TH k có đánh giá tháng trước, so sánh tháng trước với tháng start date
                        if (!((yearOfPrevEval === new Date(startDate).getFullYear() && monthOfPrevEval < new Date(startDate).getMonth()) // bắt đầu tháng bất kì khác tháng 1
                            || (yearOfPrevEval < new Date(startDate).getFullYear()) // TH bắt đầu là tháng 1 - chọn đánh giá tháng 1
                        )) {
                            prevDate = new Date(dayjs(`${yearOfPrevEval}-${monthOfPrevEval + 1}`).endOf('month').format())
                        }
                    }
                    evalList.push({ ...evaluations[i], prevDate: prevDate })
                }
            }

            evalList = handleSortMonthEval(evalList);

            // Xử lý dữ liệu phần Nhắc nhở
            checkEvaluate = remindEvaluateTaskOnThisMonth(task);
            checkConfirmTask = handleCheckConfirmTask(task);
            checkEvaluationTaskAction = handleCheckEvaluationTaskAction(task);
            checkEvaluationTaskAndKpiLink = handleCheckEvaluationTaskAndKpiLink(task);
            checkDeadlineForEvaluation = handleCheckDeadlineForEvaluation(task);
            checkConfirmAssginOfOrganizationalUnit = handleCheckConfirmAssginOfOrganizationalUnit(task);
            warning = (statusTask === "inprocess") && ((checkEvaluate) || (checkConfirmTask && checkConfirmTask.checkConfirm)
                || (checkEvaluationTaskAction && checkEvaluationTaskAction.checkEvaluationTaskAction)
                || (checkEvaluationTaskAndKpiLink && checkEvaluationTaskAndKpiLink.checkEvaluationTask)
                || (checkEvaluationTaskAndKpiLink && checkEvaluationTaskAndKpiLink.checkKpiLink)
                || (checkDeadlineForEvaluation && checkDeadlineForEvaluation.checkDeadlineForEvaluation)
                || (checkInactive && codeInProcess && (currentRole === "accountable" || (currentRole === "responsible" && checkHasAccountable === false))))
                || (checkConfirmAssginOfOrganizationalUnit.checkConfirm)
                || (currentRole === "accountable" && task?.requestToCloseTask?.requestStatus === 1);

            // Xử lý dữ liệu biểu đồ đóng góp thời gian công việc
            if (task?.hoursSpentOnTask) {
                hoursSpentOfEmployeeInTask = {};
                for (let i = 0; i < task.timesheetLogs.length; i++) {
                    let tsheetlog = task.timesheetLogs[i];

                    if (tsheetlog && tsheetlog.stoppedAt && tsheetlog.creator) {
                        let times = hoursSpentOfEmployeeInTask[tsheetlog.creator.name] ? hoursSpentOfEmployeeInTask[tsheetlog.creator.name] : 0;

                        if (tsheetlog.acceptLog) {
                            hoursSpentOfEmployeeInTask[tsheetlog.creator.name] = times + tsheetlog.duration;
                        }
                    }
                }
            }

            if (task?.evaluations?.length !== 0) {
                task.evaluations.map(item => {
                    if (item.results && item.results.length !== 0) {
                        hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth] = {};

                        item.results.map(result => {
                            if (result.employee) {
                                if (!hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth][result.employee.name]) {
                                    if (result.hoursSpent) {
                                        hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth][result.employee.name] = Number.parseFloat(result.hoursSpent);
                                    }
                                } else {
                                    hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth][result.employee.name] = hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth][result.employee.name] + result.hoursSpent ? Number.parseFloat(result.hoursSpent) : 0;
                                }
                            }
                        })
                    } else {
                        hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth] = null;
                    }
                })
            }

            // Xử lý phần đơn vị phối hợp
            employeeCollaboratedWithUnitSelectBox = setSelectBoxOfUserSameDepartmentCollaborated(task);

            setDataCheck({
                ...dataCheck,
                task,
                evalList,
                typeOfTask,
                evaluations,
                checkEvaluate,
                checkConfirmTask,
                checkEvaluationTaskAction,
                checkEvaluationTaskAndKpiLink,
                checkDeadlineForEvaluation,
                checkConfirmAssginOfOrganizationalUnit,
                warning,
                statusTask,
                checkHasAccountable,
                checkInactive,
                codeInProcess,
                hoursSpentOfEmployeeInTask,
                hoursSpentOfEmployeeInEvaluation,
                employeeCollaboratedWithUnitSelectBox
            })

        }
    }, [JSON.stringify(props?.task), JSON.stringify(props?.performtasks?.task), props.isProcess])

    const { evalList,
        typeOfTask,
        task,
        evaluations,
        checkEvaluate,
        checkConfirmTask,
        checkEvaluationTaskAction,
        checkEvaluationTaskAndKpiLink,
        checkDeadlineForEvaluation,
        checkConfirmAssginOfOrganizationalUnit,
        warning,
        statusTask,
        checkHasAccountable,
        checkInactive,
        codeInProcess,
        hoursSpentOfEmployeeInTask,
        hoursSpentOfEmployeeInEvaluation,
        employeeCollaboratedWithUnitSelectBox } = dataCheck;

    const checkCurrentRoleIsManager = role && role.item &&
        role.item.parents.length > 0 && role.item.parents.filter(o => o.name === ROOT_ROLE.MANAGER)

    console.log('currentRole', currentRole);

    return (
        <React.Fragment>
            {(showToolbar) &&
                <div style={{ marginLeft: "-10px" }}>
                    <a className="btn btn-app" onClick={refresh} title="Refresh">
                        <i className="fa fa-refresh" style={{ fontSize: "16px" }} aria-hidden="true" ></i>{translate('task.task_management.detail_refresh')}
                    </a>

                    {((currentRole === "responsible" || currentRole === "accountable") && checkInactive) &&
                        <a className="btn btn-app" onClick={() => handleShowEdit(id, currentRole, checkHasAccountable)} title="Chỉnh sửa thông tin chung">
                            <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_edit')}
                        </a>
                    }
                    {
                        performtasks?.task?.status !== "finished" &&
                        <React.Fragment>
                            {((currentRole === "consulted" || currentRole === "responsible" || currentRole === "accountable") && checkInactive) &&
                                <a className="btn btn-app" onClick={() => !performtasks.currentTimer && startTimer(task._id, currentUser)} title="Bắt đầu thực hiện công việc" disabled={performtasks.currentTimer}>
                                    <i className="fa fa-clock-o" style={{ fontSize: "16px" }} aria-hidden="true" ></i>{translate('task.task_management.detail_start_timer')}
                                </a>
                            }
                        </React.Fragment>
                    }

                    {((currentRole === "consulted" || currentRole === "responsible" || currentRole === "accountable") && checkInactive) &&
                        <React.Fragment>
                            <a className="btn btn-app" onClick={() => handleShowEvaluate(id, currentRole)} title={translate('task.task_management.detail_evaluate')}>
                                <i className="fa fa-calendar-check-o" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_evaluate')}
                            </a>
                        </React.Fragment>
                    }
                    {((currentRole === "responsible" || currentRole === "accountable") && checkInactive) &&
                        <React.Fragment>
                            <a className="btn btn-app" onClick={() => handleCopyTask(id, currentRole)} title={translate('task.task_management.detail_copy_task')}>
                                <i className="fa fa-clone" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_copy_task')}
                            </a>
                        </React.Fragment>
                    }
                    {((currentRole === "accountable" || currentRole === "responsible") && checkInactive) && checkCurrentRoleIsManager && checkCurrentRoleIsManager.length > 0 &&
                        <React.Fragment>
                            <a className="btn btn-app" onClick={() => handleSaveAsTemplate(id, currentRole)} title={translate('task.task_management.detail_save_as_template')}>
                                <i className="fa fa-floppy-o" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_save_as_template')}
                            </a>
                        </React.Fragment>
                    }

                    {task && statusTask !== "finished" && (((currentRole === "responsible" && task?.requestToCloseTask?.requestStatus !== 3) || (currentRole === "accountable" && task?.requestToCloseTask?.requestStatus === 1)) && checkInactive) && checkHasAccountable
                        && <a className="btn btn-app" onClick={() => handleShowRequestCloseTask(id)} title={currentRole === "responsible" ? translate('task.task_perform.request_close_task') : translate('task.task_perform.approval_close_task')}>
                            <i className="fa fa-external-link-square" style={{ fontSize: "16px" }}></i>{currentRole === "responsible" ? translate('task.task_perform.request_close_task') : translate('task.task_perform.approval_close_task')}
                        </a>
                    }
                    {task && statusTask !== "inprocess" && statusTask !== "wait_for_approval" && checkInactive
                        && <a className="btn btn-app" onClick={() => handleOpenTaskAgain(id)} title={translate('task.task_perform.open_task_again')}>
                            <i className="fa fa-rocket" style={{ fontSize: "16px" }}></i>{translate('task.task_perform.open_task_again')}
                        </a>
                    }

                    {
                        (collapseInfo === false) ?
                            <a className="btn btn-app" data-toggle="collapse" href="#info" onClick={handleChangeCollapseInfo} role="button" aria-expanded="false" aria-controls="info">
                                <i className="fa fa-info" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_hide_info')}
                            </a> :
                            <a className="btn btn-app" data-toggle="collapse" href="#info" onClick={handleChangeCollapseInfo} role="button" aria-expanded="false" aria-controls="info">
                                <i className="fa fa-info" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_show_info')}
                            </a>
                    }

                    {roles && roles.length > 1 &&
                        <div className="dropdown" style={{ margin: "10px 0px 0px 10px", display: "inline-block" }}>
                            <a className="btn btn-app" style={{ margin: "-10px 0px 0px 0px" }} data-toggle="dropdown">
                                <i className="fa fa-user" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_choose_role')}
                            </a>
                            <ul className="dropdown-menu">
                                {roles.map(
                                    (item, index) => { return <li className={item.value === currentRole ? "active" : undefined} key={index}><a href="#" onClick={() => changeRole(item.value)}>{item.name}</a></li> }
                                )}
                            </ul>
                        </div>
                    }
                </div>
            }

            <div>
                <div id="info" className="collapse in">
                    {/* Thông tin chung */}
                    {/* Nhắc nhở */}
                    {
                        task && warning &&
                        <div className="description-box warning">
                            <h4>{translate('task.task_management.warning')}</h4>

                            {/* Phê duyệt yêu cầu kết thúc công việc */}
                            {currentRole === "accountable" && task?.requestToCloseTask?.requestStatus === 1
                                && <div>
                                    <strong>Công việc đang chờ phê duyệt yêu cầu kết thúc:</strong>
                                    <a style={{ cursor: "pointer" }} onClick={() => handleShowRequestCloseTask(id)}>
                                        Phê duyệt yêu cầu
                                    </a>
                                </div>
                            }

                            {/* Kích hoạt công việc phía sau trong quy trình */}
                            {statusTask === "inprocess" && checkInactive && codeInProcess && (currentRole === "accountable" || (currentRole === "responsible" && checkHasAccountable === false)) &&
                                <div>
                                    <strong>{translate('task.task_perform.is_task_process')}:</strong>
                                    <a style={{ cursor: "pointer" }} onClick={() => handleEndTask(id, "inprocess", codeInProcess, typeOfTask)}>
                                        {translate('task.task_perform.following_task')}
                                    </a>
                                </div>
                            }

                            {/* Số hoạt động chưa thực hiện */}
                            {
                                getTaskActionsNotPerform(task.taskActions) > 0 &&
                                <div>
                                    <strong>{translate('task.task_perform.actions_not_perform')}</strong>
                                    <span className="text-red">{getTaskActionsNotPerform(task.taskActions)}</span>
                                </div>
                            }

                            {/* Xác nhận công việc */}
                            {
                                checkConfirmTask && checkConfirmTask.checkConfirmCurrentUser
                                && <div><strong>{translate('task.task_management.you_need')} <a style={{ cursor: "pointer" }} onClick={() => confirmTask(task)}>{translate('task.task_management.confirm_task')}</a></strong></div>
                            }
                            {
                                checkConfirmTask && checkConfirmTask.checkConfirmOtherUser
                                && <div>
                                    <strong>{translate('task.task_management.not_confirm')}:</strong>
                                    {
                                        checkConfirmTask.listEmployeeNotConfirm.length !== 0
                                        && checkConfirmTask.listEmployeeNotConfirm.map((item, index) => {
                                            let seperator = index !== 0 ? ", " : "";
                                            return <span key={index}>{seperator}{item.name}</span>
                                        })
                                    }
                                </div>
                            }

                            {/* Chưa có đánh giá */}
                            {
                                task.status === "inprocess" && checkEvaluationTaskAndKpiLink && checkEvaluationTaskAndKpiLink.checkEvaluationTask
                                && <div><strong>{translate('task.task_management.not_have_evaluation')}</strong></div>
                            }

                            {/* Nhắc nhở đánh giá */
                                task.status === "inprocess" && checkEvaluationTaskAndKpiLink && checkEvaluationTaskAndKpiLink.checkEvaluationTask && checkEvaluate
                                && <div><strong>{translate("task.task_management.warning_evaluate")}</strong></div>
                            }

                            {/* Chưa liên kết KPI */}
                            {
                                task.status === "inprocess" && checkEvaluationTaskAndKpiLink && checkEvaluationTaskAndKpiLink.checkKpiLink
                                && <div>
                                    <strong>{translate('task.task_management.detail_not_kpi')}:</strong>
                                    {
                                        checkEvaluationTaskAndKpiLink.listEmployeeNotKpiLink.length !== 0
                                        && checkEvaluationTaskAndKpiLink.listEmployeeNotKpiLink.map((item, index) => {
                                            let seperator = index !== 0 ? ", " : "";
                                            return <span key={index}>{seperator}{item.name}</span>
                                        })
                                    }
                                </div>
                            }

                            {/* Chưa đánh giá hoạt động */}
                            {
                                checkEvaluationTaskAction && checkEvaluationTaskAction.checkEvaluationTaskAction
                                && <div>
                                    <strong>{translate('task.task_management.action_not_rating')}:</strong><span style={{ color: "red" }}>{checkEvaluationTaskAction.numberOfTaskActionNotEvaluate}</span>
                                </div>
                            }

                            {/* Chưa xác nhận phân công công việc */}
                            {
                                checkConfirmAssginOfOrganizationalUnit && checkConfirmAssginOfOrganizationalUnit.checkConfirm
                                && <div>
                                    <strong>{translate('task.task_management.unit_not_confirm_assigned_task')}:</strong>
                                    {
                                        checkConfirmAssginOfOrganizationalUnit.unitHasNotConfirm && checkConfirmAssginOfOrganizationalUnit.unitHasNotConfirm.length !== 0
                                        && checkConfirmAssginOfOrganizationalUnit.unitHasNotConfirm.map((item, index) => {
                                            let seperator = index !== 0 ? ", " : "";
                                            return <span key={index}>{seperator}{item}</span>
                                        })
                                    }
                                </div>
                            }

                            {/* Thời hạn chỉnh sửa thông tin */}
                            {
                                checkDeadlineForEvaluation && checkDeadlineForEvaluation.checkDeadlineForEvaluation
                                && <div>
                                    <strong>{translate('task.task_management.left_can_edit_task')}:</strong><span style={{ color: "red" }}>{checkDeadlineForEvaluation.deadlineForEvaluation}</span>
                                </div>
                            }
                        </div>
                    }

                    {/* Phân công công việc cho nhân viên */}
                    {employeeCollaboratedWithUnitSelectBox && employeeCollaboratedWithUnitSelectBox.length !== 0
                        && employeeCollaboratedWithUnitSelectBox.map(item =>
                            <CollaboratedWithOrganizationalUnits
                                key={item.id}
                                task={task}
                                employeeSelectBox={item}
                                unitId={item.id}
                            />
                        )
                    }


                    {/* Các trường thông tin cơ bản */}
                    {task &&
                        <div className="description-box">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <i style={{ fontSize: '17px', marginRight: '5px' }} className="fa fa-info-circle" aria-hidden="true"></i>
                                <h4>{translate('task.task_management.detail_general_info')}</h4>
                            </div>

                            <div><strong>{translate('task.task_management.detail_link')}:</strong> <a href={`/task?taskId=${task._id}`} target="_blank">{task.name}</a></div>
                            <div><strong>{translate('task.task_management.detail_time')}:</strong> {formatTime(task && task.startDate)} <i className="fa fa-fw fa-caret-right"></i> {formatTime(task && task.endDate)} </div>
                            <div><strong>{translate('task.task_management.unit_manage_task')}:</strong> {task && task.organizationalUnit ? task.organizationalUnit.name : translate('task.task_management.err_organizational_unit')}</div>
                            <div>
                                <strong>{translate('task.task_management.collaborated_with_organizational_units')}: </strong>
                                <span>
                                    {task.collaboratedWithOrganizationalUnits.length !== 0
                                        ? <span>
                                            {
                                                task.collaboratedWithOrganizationalUnits.map((item, index) => {
                                                    let seperator = index !== 0 ? ", " : "";
                                                    return <span key={index}>{seperator}{item.organizationalUnit && item.organizationalUnit.name}</span>
                                                })
                                            }
                                        </span>
                                        : <span>{translate('task.task_management.not_collaborated_with_organizational_units')}</span>
                                    }
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <strong>{translate('task.task_management.detail_priority')}:</strong>
                                <div style={{ display: 'flex', alignItems: 'center' }} >
                                    <span className="material-icons" style={{ fontSize: "17px", color: taskPriorityColor(task?.priority) }}>priority_high</span>
                                    <span> {task && formatPriority(task.priority)}</span>
                                </div>

                            </div>
                            <div><strong>{translate('task.task_management.detail_status')}:</strong> <span style={{ color: taskStatusColor(task?.status) }}>{task && formatStatus(task.status)}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center' }}><strong>{translate('task.task_management.detail_progress')}:</strong>
                                <div className="progress-task" style={{ width: '30%' }}>
                                    <div className="fillmult" data-width={`${task && task.progress}%`} style={{ width: `${task && task.progress}%`, backgroundColor: task && task.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                    <span className="perc"> {task && task.progress}%</span>
                                </div>
                            </div>
                            {
                                (task.taskInformations && task.taskInformations.length !== 0) &&
                                task.taskInformations.map((info, key) => {
                                    if (info.type === "date") {
                                        return <div key={key}><strong>{info.name}:</strong> {info.value ? formatDate(info.value) : translate('task.task_management.detail_not_hasinfo')}</div>
                                    }
                                    return <div key={key}>
                                        <strong>{info.name}:</strong>
                                        {
                                            info.value ?
                                                info.value : Number(info.value) === 0 ? info.value :
                                                    translate('task.task_management.detail_not_hasinfo')}
                                    </div>
                                })
                            }

                            {/* Mô tả công việc */}
                            <div>
                                <strong>{translate('task.task_management.detail_description')}:</strong>
                                <ShowMoreShowLess
                                    id={"task-description"}
                                    isHtmlElement={true}
                                    characterLimit={200}
                                >
                                    <QuillEditor
                                        id={`description-${task?._id}`}
                                        toolbar={false}
                                        quillValueDefault={task?.description}
                                        maxHeight={250}
                                        enableDropImage={false}
                                        enableEdit={false}
                                        showDetail={{
                                            enable: true,
                                            titleShowDetail: translate('task.task_management.detail_description'),
                                            width: "75%"
                                        }}
                                    />
                                </ShowMoreShowLess>
                            </div>
                        </div>
                    }

                    <div>
                        {/* Vai trò */}
                        {task &&
                            <div className="description-box">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontSize: '17px', marginRight: '5px' }} className="material-icons">
                                        people_alt
                                    </span>
                                    <h4>
                                        {translate('task.task_management.role')}
                                    </h4>
                                </div>

                                {/* Người thực hiện */}
                                <strong>{translate('task.task_management.responsible')}:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {
                                        task?.responsibleEmployees?.length > 0 && task.responsibleEmployees.map((item, index) => {
                                            // Nếu người này không còn trong công việc
                                            if (task?.inactiveEmployees?.some(o => o._id === item._id)) {
                                                return (
                                                    <a key={index} title="đã rời khỏi công việc" className="raci-style" style={{ opacity: .5 }}>
                                                        <img src={process.env.REACT_APP_SERVER + item.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                        <span>{item.name}</span>
                                                    </a>
                                                )
                                            }

                                            return <span key={index} className="raci-style">
                                                <img src={process.env.REACT_APP_SERVER + item.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                <span>{item.name}</span>
                                            </span>
                                        })
                                    }
                                </div>

                                {/* Người phê duyệt */}
                                <strong style={{ display: "inline-block", marginTop: '5px' }}>{translate('task.task_management.accountable')}:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {
                                        task?.accountableEmployees?.length > 0 && task.accountableEmployees.map((item, index) => {
                                            // Nếu người này không còn trong công việc
                                            if (task?.inactiveEmployees?.some(o => o._id === item._id)) {
                                                return (
                                                    <a key={index} title="đã rời khỏi công việc" className="raci-style" style={{ opacity: .5 }}>
                                                        <img src={process.env.REACT_APP_SERVER + item.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                        <span>{item.name}</span>
                                                    </a>
                                                )
                                            }

                                            return <span key={index} className="raci-style">
                                                <img src={process.env.REACT_APP_SERVER + item.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                <span>{item.name}</span>
                                            </span>
                                        })
                                    }
                                </div>

                                {
                                    (task && task.consultedEmployees && task.consultedEmployees.length !== 0) &&
                                    <div>
                                        {/* Người hỗ trợ */}
                                        <strong style={{ display: "inline-block", marginTop: '5px' }}>{translate('task.task_management.consulted')}:</strong>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                task?.consultedEmployees?.length > 0 && task.consultedEmployees.map((item, index) => {
                                                    // Nếu người này không còn trong công việc
                                                    if (task?.inactiveEmployees?.some(o => o._id === item._id)) {
                                                        return (
                                                            <a key={index} title="đã rời khỏi công việc" className="raci-style" style={{ opacity: .5 }}>
                                                                <img src={process.env.REACT_APP_SERVER + item.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                                <span>{item.name}</span>
                                                            </a>
                                                        )
                                                    }

                                                    return <span key={index} className="raci-style">
                                                        <img src={process.env.REACT_APP_SERVER + item.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                        <span>{item.name}</span>
                                                    </span>
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                                {
                                    (task && task.informedEmployees && task.informedEmployees.length !== 0) &&
                                    <div>
                                        {/* Người quan sát */}
                                        <strong style={{ display: "inline-block", marginTop: '5px' }}>{translate('task.task_management.informed')}:</strong>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                task?.informedEmployees?.length > 0 && task.informedEmployees.map((item, index) => {
                                                    // Nếu người này không còn trong công việc
                                                    if (task?.inactiveEmployees?.some(o => o._id === item._id)) {
                                                        return (
                                                            <a key={index} title="đã rời khỏi công việc" className="raci-style" style={{ opacity: .5 }}>
                                                                <img src={process.env.REACT_APP_SERVER + item.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                                <span>{item.name}</span>
                                                            </a>
                                                        )
                                                    }

                                                    return <span key={index} className="raci-style">
                                                        <img src={process.env.REACT_APP_SERVER + item.avatar} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />
                                                        <span>{item.name}</span>
                                                    </span>
                                                })
                                            }
                                        </div>
                                    </div>
                                }


                                {
                                    hoursSpentOfEmployeeInTask && JSON.stringify(hoursSpentOfEmployeeInTask) !== '{}' &&
                                    <div>
                                        <strong>Tổng thời gian đóng góp:</strong>
                                        <HoursSpentOfEmployeeChart
                                            refs="totalTime"
                                            data={hoursSpentOfEmployeeInTask}
                                        />
                                    </div>
                                }
                            </div>
                        }

                        {/* Đánh giá công việc */}
                        <div>
                            {(evalList) &&
                                evalList.map((eva, keyEva) => {
                                    return (
                                        <div key={keyEva} className="description-box">
                                            <h4>
                                                {translate('task.task_management.detail_eval')}&nbsp;{formatDate(eva.startDate)} <i className="fa fa-fw fa-caret-right"></i> {formatDate(eva.endDate)}
                                            </h4>
                                            <a style={{ cursor: "pointer" }} onClick={() => handleChangeShowMoreEvalItem(eva._id)}>{showMore[eva._id] ? <p>Nhấn chuột để ẩn chi tiết&nbsp;&nbsp;<i className="fa fa-angle-double-up"></i></p> : <p>Nhấn chuột để xem chi tiết&nbsp;&nbsp;<i className="fa fa-angle-double-down"></i></p>}</a>
                                            {showMore[eva._id] &&
                                                <div>
                                                    {
                                                        eva.results.length !== 0 &&
                                                        <div>
                                                            <div><strong>{translate('task.task_management.detail_point')}</strong> ({translate('task.task_management.detail_auto_point')} - {translate('task.task_management.detail_emp_point')} - {translate('task.task_management.detail_acc_point')})</div>
                                                            <ul>
                                                                {(eva.results.length !== 0) ?
                                                                    eva.results.map((res, index) => {
                                                                        if (res.employee && task.inactiveEmployees?.indexOf(res.employee._id) !== -1) {
                                                                            return <li key={index}><strike>{res.employee.name}</strike>: &nbsp;&nbsp; {(res.automaticPoint !== null && res.automaticPoint !== undefined) ? res.automaticPoint : translate('task.task_management.detail_not_auto')} - {res.employeePoint ? res.employeePoint : translate('task.task_management.detail_not_emp')} - {res.approvedPoint ? res.approvedPoint : translate('task.task_management.detail_not_acc')}</li>
                                                                        }
                                                                        else {
                                                                            return <li key={index}>{res.employee && res.employee.name}: &nbsp;&nbsp; {(res.automaticPoint !== null && res.automaticPoint !== undefined) ? res.automaticPoint : translate('task.task_management.detail_not_auto')} - {res.employeePoint ? res.employeePoint : translate('task.task_management.detail_not_emp')} - {res.approvedPoint ? res.approvedPoint : translate('task.task_management.detail_not_acc')}</li>
                                                                        }
                                                                    }) : <li>{translate('task.task_management.detail_not_eval')}</li>
                                                                }
                                                            </ul>
                                                        </div>
                                                    }
                                                    <div>
                                                        <div><strong>{translate('task.task_management.detail_info')}</strong></div>
                                                        <ul>
                                                            <li>{translate('task.task_management.detail_progress')}: &nbsp;&nbsp; {(eva.progress !== null && eva.progress !== undefined) ? `${eva.progress}%` : translate('task.task_management.detail_not_eval_on_month')}</li>
                                                            {
                                                                eva.taskInformations.map((info, key) => {
                                                                    if (info.type === "date") {
                                                                        return <li key={key}>{info.name}: &nbsp;&nbsp; {info.value ? formatDate(info.value) : translate('task.task_management.detail_not_eval_on_month')}</li>
                                                                    }
                                                                    return <li key={key}>{info.name}: &nbsp;&nbsp; {
                                                                        info.value ?
                                                                            info.value : Number(info.value) === 0 ? info.value :
                                                                                translate('task.task_management.detail_not_eval_on_month')}</li>
                                                                })
                                                            }
                                                        </ul>
                                                    </div>

                                                    {/* KPI */}
                                                    {(eva.results.length !== 0) ?
                                                        (
                                                            eva.results.map((item, key) => {
                                                                return (
                                                                    <div key={key}>
                                                                        <strong>KPI {item.employee && item.employee.name}:</strong>
                                                                        {(item.kpis.length !== 0) ?
                                                                            <ul>
                                                                                {
                                                                                    item.kpis.map((kpi, keyKpi) => {
                                                                                        return <li key={keyKpi}>{kpi.name}</li>
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                            : <span>{translate('task.task_management.detail_not_kpi')}</span>
                                                                        }
                                                                    </div>)
                                                            })
                                                        ) : <div><strong>{translate('task.task_management.detail_all_not_kpi')}</strong></div>
                                                    }


                                                    {/* Thời gian bấm giờ */}
                                                    <strong>Thời gian đóng góp:</strong>
                                                    {showToolbar && <a style={{ cursor: "pointer" }} onClick={() => calculateHoursSpentOnTask(task._id, task.timesheetLogs, eva.evaluatingMonth, eva, eva.startDate, eva.endDate)} title="Cập nhật thời gian bấm giờ">Nhấn chuột để cập nhật dữ liệu <i className="fa fa-fw fa-clock-o"></i></a>}
                                                    {
                                                        eva.results.length !== 0 && hoursSpentOfEmployeeInEvaluation[eva.evaluatingMonth] && JSON.stringify(hoursSpentOfEmployeeInEvaluation[eva.evaluatingMonth]) !== '{}'
                                                        &&
                                                        <React.Fragment>
                                                            <HoursSpentOfEmployeeChart
                                                                refs={"evaluationBox" + eva.evaluatingMonth}
                                                                data={hoursSpentOfEmployeeInEvaluation[eva.evaluatingMonth]}
                                                            />
                                                        </React.Fragment>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    );
                                })
                            }
                            {(task && (!task.evaluations || task.evaluations.length === 0)) && <dt>{translate('task.task_management.detail_none_eval')}</dt>}

                        </div>

                    </div>

                </div>
            </div>
            {
                (id && showEdit === id) && currentRole === "responsible" && checkHasAccountable === true &&
                <ModalEditTaskByResponsibleEmployee
                    id={id}
                    task={task && task}
                    role={currentRole}
                    title={translate('task.task_management.detail_resp_edit')}
                    perform={`edit-${currentRole}`}
                />
            }

            {
                (id && showEdit === id) && currentRole === "responsible" && checkHasAccountable === false &&
                <ModalEditTaskByAccountableEmployee
                    id={id}
                    task={task && task}
                    role={currentRole}
                    hasAccountable={false}
                    title={translate('task.task_management.detail_resp_edit')}
                    perform={`edit-${currentRole}-hasnot-accountable`}
                />
            }

            {
                (id && showEdit === id) && currentRole === "accountable" &&
                <ModalEditTaskByAccountableEmployee
                    id={id}
                    task={task && task}
                    hasAccountable={true}
                    role={currentRole}
                    title={translate('task.task_management.detail_acc_edit')}
                    perform={`edit-${currentRole}`}
                />
            }

            {
                (id && showEvaluate === id) &&
                <EvaluationModal
                    id={id}
                    task={task && task}
                    hasAccountable={checkHasAccountable}
                    role={currentRole}
                    title={translate('task.task_management.detail_cons_eval')}
                    perform='evaluate'
                />
            }
            {
                (id && showEndTask === id) &&
                <SelectFollowingTaskModal
                    id={id}
                    task={task && task}
                    role={currentRole}
                    typeOfTask={typeOfTask}
                    codeInProcess={codeInProcess}
                    title={translate('task.task_perform.choose_following_task')}
                    perform='selectFollowingTask'
                    refresh={refresh}
                />
            }
            {
                // (id && showCopy === `copy-task-${id}`) &&
                <TaskAddModal id={`copy-task-${id}`} task={task} />
            }
            {
                showSaveAsTemplate &&
                <ModalAddTaskTemplate savedTaskAsTemplate={true} savedTaskItem={task} savedTaskId={showSaveAsTemplate} />
            }

            {
                (id && showRequestClose === id) && (currentRole === "responsible" || currentRole === "accountable") && checkHasAccountable &&
                <RequestToCloseTaskModal
                    id={id}
                    task={task && task}
                    role={currentRole}
                />
            }
        </React.Fragment>
    );
}


function mapStateToProps(state) {
    const { performtasks, user, role } = state;
    return { performtasks, user, role };

}

const actionGetState = { //dispatchActionToProps
    getTaskById: performTaskAction.getTaskById,
    getSubTask: taskManagementActions.getSubTask,
    startTimer: performTaskAction.startTimerTask,
    stopTimer: performTaskAction.stopTimerTask,
    getTimesheetLogs: performTaskAction.getTimesheetLogs,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getTaskLog: performTaskAction.getTaskLog,
    editHoursSpentInEvaluate: performTaskAction.editHoursSpentInEvaluate,
    confirmTask: performTaskAction.confirmTask,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    openTaskAgain: performTaskAction.openTaskAgain,

    showInfoRole: RoleActions.show,
}

const detailTask = connect(mapStateToProps, actionGetState)(withTranslate(DetailTaskTab));

export { detailTask as DetailTaskTab };