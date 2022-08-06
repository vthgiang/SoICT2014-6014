import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { getStorage } from '../../../../config';
import ValidationHelper from '../../../../helpers/validationHelper';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../task-template/redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';

import { DatePicker, TimePicker, SelectBox, ErrorLabel, ToolTip, TreeSelect, QuillEditor } from '../../../../common-components';
import { TaskFormValidator } from '../../task-management/component/taskFormValidator';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { ROOT_ROLE } from '../../../../helpers/constants';
import dayjs from "dayjs";
import { convertUserIdToUserName, getCurrentProjectDetails, getDurationWithoutSatSun, getEstimateHumanCostFromParams, getEstimateMemberCost, getMaxMinDateInArr, getNearestIntegerNumber, getProjectParticipants, handleWeekendAndWorkTime } from '../../../project/projects/components/functionHelper';
import moment from 'moment';
import { checkIfHasCommonItems, getSalaryFromUserId, numberWithCommas } from '../../task-management/component/functionHelpers';

const AddProjectTaskForm = (props) => {
    const [state, setState] = useState({
        newTask: {
            name: "",
            quillDescriptionDefault: "",
            startDate: moment().format('DD-MM-YYYY'),
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
            preceedingTasks: [],
            followingTasks: [],
            taskProject: "",
            taskPhase: "",
            estimateNormalTime: '',
            estimateOptimisticTime: '',
            estimateNormalCost: '',
            estimateMaxCost: '',
            estimateAssetCost: '1,000,000',
            estimateHumanCost: '',
            parent: '',
            actorsWithSalary: [],
            totalResWeight: 80,
            totalAccWeight: 20,
            currentResWeightArr: [],
            currentAccWeightArr: [],
            currentLatestStartDate: '',
            currentEarliestEndDate: '',
        },
        currentRole: getStorage('currentRole'),
    });
    const [startTime, setStartTime] = useState('08:00 AM');
    const [endTime, setEndTime] = useState('05:30 PM');
    const [tempEndDate, setTempEndDate] = useState('');
    const [description, setDescription] = useState('');

    const { id, newTask } = state;
    const { estimateNormalTime, estimateOptimisticTime, estimateNormalCost, estimateMaxCost, estimateAssetCost, responsibleEmployees, accountableEmployees,
        totalResWeight, totalAccWeight, currentResWeightArr, currentAccWeightArr, estimateHumanCost } = newTask;
    const { tasktemplates, user, translate, tasks, department, project, isProcess, info, role, currentProjectTasks, currentProjectPhase } = props;
    const projectDetail = getCurrentProjectDetails(project);
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []

    const [currentTasksToChoose, setCurrentTasksToChoose] = useState({
        preceeding: [],
        following: [],
    })

    const [currentPhaseToChoose, setCurrentPhaseToChoose] = useState({
        phases: []
    })

    useEffect(() => {
        let res = currentProjectPhase ? currentProjectPhase?.map(item => ({
            value: item._id,
            text: item.name
        })) : [];
        res.unshift({ value: "", text: "--Chọn giai đoạn--" })
        setCurrentPhaseToChoose({
            phases: res
        })
    }, [JSON.stringify(currentProjectPhase)])

    useEffect(() => {
        let res = currentProjectTasks ? currentProjectTasks?.map(item => ({
            value: item._id,
            text: item.name
        })) : [];
        // res.unshift({value: "", text: "Chọn công việc tiền nhiệm"})
        setCurrentTasksToChoose({
            preceeding: res,
            following: []
        })
    }, [JSON.stringify(currentProjectTasks)])

    let listTaskTemplate;
    let taskTemplate;
    if (tasktemplates.taskTemplate) {
        taskTemplate = tasktemplates.taskTemplate;
    }
    if (tasktemplates.items && newTask.organizationalUnit) {
        listTaskTemplate = tasktemplates.items
    }

    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }

    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time.replace(/CH/g, 'PM').replace(/SA/g, 'AM')}`;
        return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss');
    }

    const handleChangeTaskName = (event) => {
        let value = event.target.value;
        validateChangeTaskName(value, true);
    }

    const handleChangeTaskPhase = (selected) => {
        const currentNewTask = {
            ...state.newTask,
            taskPhase: selected[0],
        }
        setState({
            ...state,
            newTask: currentNewTask
        })
        setTimeout(() => {
            props.handleChangeTaskData(currentNewTask)
        }, 10);
    }

    const validateChangeTaskName = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateTaskName(translate, value, props.currentProjectTasks);

        const currentNewTask = {
            ...state.newTask,
            name: value,
            errorOnName: message,
        };
        if (willUpdateState) {
            setState({
                ...state,
                newTask: currentNewTask
            })
            setTimeout(() => {
                props.handleChangeTaskData(currentNewTask)
            }, 10);
        }
        return message === undefined;
    }

    const handleChangeTaskDescription = (value, imgs) => {
        validateTaskDescription(value, true);
    }
    const validateTaskDescription = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(props.translate, value);
        const currentNewTask = {
            ...state.newTask,
            errorOnDescription: message
        }
        if (willUpdateState) {
            setDescription(value);
            setState({
                ...state,
                newTask: currentNewTask
            });
            setTimeout(() => {
                props.handleChangeDescription(value)
                props.handleChangeTaskData(currentNewTask);
            }, 10);
        }
        return message === undefined;
    }

    const handleChangeTaskStartDate = (value) => {
        validateTaskStartDate(value, true);
    }
    const validateTaskStartDate = (value, willUpdateState = true) => {
        console.log('value', value)
        let { translate, project } = props;
        let { newTask } = state;
        let msg = TaskFormValidator.validateTaskStartDate(value, newTask.endDate, translate);
        const projectDetail = getCurrentProjectDetails(project);
        const curStartDateTime = convertDateTime(value, startTime);
        const taskItem = curStartDateTime && newTask.estimateNormalTime && {
            startDate: curStartDateTime,
            endDate: undefined,
            estimateNormalTime: Number(newTask.estimateNormalTime),
        }
        const curEndDateTime = taskItem ? handleWeekendAndWorkTime(projectDetail, taskItem).endDate : '';
        const curEndDate = curEndDateTime ? moment(curEndDateTime).format('DD-MM-YYYY') : state.newTask.endDate;
        const curEndTime = curEndDateTime ? moment(curEndDateTime).format('hh:mm A').replace(/CH/g, 'PM').replace(/SA/g, 'AM') : endTime;
        const currentNewTask = {
            ...state.newTask,
            startDate: value,
            endDate: curEndDate,
        }
        if (willUpdateState) {
            setEndTime(curEndTime);
            setState({
                ...state,
                newTask: currentNewTask,
            });
            setTimeout(() => {
                props.handleChangeEndTime(curEndTime);
                props.handleChangeTaskData(currentNewTask);
            }, 10);
        }
        return msg === undefined;
    }

    const handleStartTimeChange = (value) => {
        const { project } = props;
        let { newTask } = state;
        const projectDetail = getCurrentProjectDetails(project);
        const curStartDateTime = convertDateTime(state.newTask.startDate, value);
        const taskItem = curStartDateTime && newTask.estimateNormalTime && {
            startDate: curStartDateTime,
            endDate: undefined,
            estimateNormalTime: Number(newTask.estimateNormalTime),
        }
        const curEndDateTime = taskItem ? handleWeekendAndWorkTime(projectDetail, taskItem).endDate : '';
        const curEndDate = curEndDateTime ? moment(curEndDateTime).format('DD-MM-YYYY') : state.newTask.endDate;
        const curEndTime = curEndDateTime ? moment(curEndDateTime).format('hh:mm A').replace(/CH/g, 'PM').replace(/SA/g, 'AM') : endTime;
        setTempEndDate(curEndDate);
        setStartTime(value);
        setEndTime(curEndTime);
        setTimeout(() => {
            props.handleChangeStartTime(value);
            props.handleChangeEndTime(curEndTime);
        }, 10);
    }

    const handleChangeTaskPriority = (event) => {
        const currentNewTask = {
            ...state.newTask,
            priority: event.target.value
        }
        setState({
            ...state,
            newTask: currentNewTask,
        });
        setTimeout(() => {
            props.handleChangeTaskData(currentNewTask);
        }, 10);
    }

    const handleChangeTaskResponsibleEmployees = (value) => {
        validateTaskResponsibleEmployees(value, true);
    }
    const validateTaskResponsibleEmployees = (value, willUpdateState = true) => {
        let { translate, project } = props;
        const projectDetail = getCurrentProjectDetails(project);
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);

        if (willUpdateState) {
            const responsiblesWithSalaryArr = value?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem),
                    weight: Number(totalResWeight) / value.length,
                })
            })
            const accountablesWithSalaryArr = state.newTask.accountableEmployees?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem),
                    weight: Number(totalAccWeight) / state.newTask.accountableEmployees.length,
                })
            })
            const currentNewTask = {
                ...state.newTask,
                responsibleEmployees: value,
                errorOnResponsibleEmployees: message,
                actorsWithSalary: [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr],
            }
            setState({
                ...state,
                newTask: currentNewTask,
            });
            setTimeout(() => {
                props.handleChangeTaskData(currentNewTask)
            }, 10);
        }
        return message === undefined;
    }

    const handleChangeTaskAccountableEmployees = (value) => {
        validateTaskAccountableEmployees(value, true);
    }
    const validateTaskAccountableEmployees = (value, willUpdateState = true) => {
        let { translate, project } = props;
        const projectDetail = getCurrentProjectDetails(project);
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);
        if (checkIfHasCommonItems(value, newTask.responsibleEmployees)) {
            message = "Thành viên Thực hiện và Phê duyệt không được trùng nhau"
        }

        if (willUpdateState) {
            const accountablesWithSalaryArr = value?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem),
                    weight: Number(totalAccWeight) / value.length,
                })
            })
            const responsiblesWithSalaryArr = state.newTask.responsibleEmployees?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem),
                    weight: Number(totalResWeight) / state.newTask.responsibleEmployees.length,
                })
            })
            const currentNewTask = {
                ...state.newTask,
                accountableEmployees: value,
                errorOnAccountableEmployees: message,
                actorsWithSalary: [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr],
            }
            setState({
                ...state,
                newTask: currentNewTask,
            });
            setTimeout(() => {
                props.handleChangeTaskData(currentNewTask)
            }, 10);
        }
        return message === undefined;
    }

    const handleChangeTaskConsultedEmployees = (value) => {
        state.newTask.consultedEmployees = value;
        setState(state => {
            return {
                ...state,
            };
        });
        props.handleChangeTaskData(state.newTask)
    }
    const handleChangeTaskInformedEmployees = (value) => {
        const newCurrentTask = {
            ...state.newTask,
            informedEmployees: value,
        }
        setState({
            ...state,
            newTask: newCurrentTask,
        });
        setTimeout(() => {
            props.handleChangeTaskData(newCurrentTask)
        }, 10);
    }

    const handleChangePreceedingTask = (selected) => {
        let message;
        if (checkIfHasCommonItems(selected, newTask.followingTasks)) {
            message = "Danh sách công việc Tiền nhiệm và Kế nhiệm không được trùng nhau."
        }
        const currentNewTask = {
            ...state.newTask,
            preceedingTasks: selected,
            errorOnPreceedFollowTasks: message,
        }
        setState({
            ...state,
            newTask: currentNewTask
        })
        setTimeout(() => {
            props.handleChangeTaskData(currentNewTask)
        }, 10);
    }

    const handleChangeFollowingTask = (selected) => {
        let message;
        if (checkIfHasCommonItems(selected, newTask.followingTasks)) {
            message = "Danh sách công việc Tiền nhiệm và Kế nhiệm không được trùng nhau."
        }
        const currentNewTask = {
            ...state.newTask,
            followingTasks: selected,
            errorOnPreceedFollowTasks: message,
        }
        setState({
            ...state,
            newTask: currentNewTask
        })
        setTimeout(() => {
            props.handleChangeTaskData(currentNewTask)
        }, 10);
    }

    const handleChangeBudget = (event) => {
        let value = event.target.value;
        validateBudget(value, true);
    }
    const validateBudget = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateNumericInputMandatory(translate, value);

        const newCurrentTask = {
            ...state.newTask,
            estimateMaxCost: value,
            errorOnBudget: message,
        }
        if (willUpdateState) {
            setState({
                ...state,
                newTask: newCurrentTask,
            });
            setTimeout(() => {
                props.handleChangeTaskData(newCurrentTask);
            }, 10);
        }
        return message === undefined;
    }

    // Hàm check xem duration có phù hợp không?
    const isDurationNotSuitable = (estimateNormalTime) => {
        if (projectDetail?.unitTime === 'days') return estimateNormalTime > 7 || estimateNormalTime < 1 / 6
        return estimateNormalTime < 4 || estimateNormalTime > 56
    }
    // Hàm thay đổi estimateNormalTime
    const handleChangeEstTimeTask = (value, timeType) => {
        const { newTask } = state;
        const projectDetail = getCurrentProjectDetails(props.project);
        let message;
        if (value?.length === 0 || value?.match(/.*[a-zA-Z]+.*/) || isDurationNotSuitable(Number(value))) {
            message = projectDetail?.unitTime === 'days' ? "Không được bỏ trống và chỉ được điền số <= 7 và >= 1/6"
                : "Không được bỏ trống và chỉ được điền số <= 56 và >= 4"
        }

        if (timeType === 'estimateNormalTime') {
            const curStartDateTime = state.newTask.startDate ? convertDateTime(state.newTask.startDate, startTime) : undefined;
            const currentEstimateNormalTime = String(Number(value)) === 'NaN' ? 0 : Number(value);
            const taskItem = curStartDateTime && {
                startDate: curStartDateTime,
                endDate: undefined,
                estimateNormalTime: currentEstimateNormalTime,
            }
            const curEndDateTime = taskItem ? handleWeekendAndWorkTime(projectDetail, taskItem).endDate : '';
            console.log('curEndDateTime', curEndDateTime)
            const curEndDate = curEndDateTime ? moment(curEndDateTime).format('DD-MM-YYYY') : state.newTask.endDate;
            const curEndTime = curEndDateTime ? moment(curEndDateTime).format('hh:mm A').replace(/CH/g, 'PM').replace(/SA/g, 'AM') : endTime;

            const predictEstimateOptimisticTime = String(Number(value)) === 'NaN' || Number(value) === 0 || Number(value) === 1
                ? '0' : Number(value) === 2 ? '1' : (Number(value) - 2).toString()

            const newCurrentTask = {
                ...state.newTask,
                estimateNormalTime: value,
                estimateOptimisticTime: estimateOptimisticTime ? estimateOptimisticTime : predictEstimateOptimisticTime,
                errorOnTimeEst: message,
                endDate: curEndDate,
            }
            setEndTime(curEndTime);
            setState({
                ...state,
                newTask: newCurrentTask,
            })
            setTimeout(() => {
                props.handleChangeEndTime(curEndTime);
                props.handleChangeTaskData(newCurrentTask);
            }, 10);
            return;
        }
        const newCurrentTask = {
            ...state.newTask,
            [timeType]: value,
            errorOnTimeEst: message,
            errorOnMaxTimeEst: TaskFormValidator.validateTimeEst(value, props.translate, true, Number(newTask.estimateNormalTime)),
        }
        setState({
            ...state,
            newTask: newCurrentTask,
        })
        setTimeout(() => {
            props.handleChangeTaskData(newCurrentTask)
        }, 10);
    }

    const handleChangeAssetCost = (event) => {
        let value = event.target.value.toString();
        validateAssetCost(value, true);
    }
    const validateAssetCost = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateNumericInputMandatory(translate, value);

        const currentNewTask = {
            ...state.newTask,
            estimateAssetCost: value,
            estimateNormalCost: numberWithCommas(Number(estimateHumanCost.replace(/,/g, '')) + Number(value)),
            errorOnAssetCode: message,
        }
        if (willUpdateState) {
            setState({
                ...state,
                newTask: currentNewTask,
            })
            setTimeout(() => {
                props.handleChangeTaskData(currentNewTask)
            }, 10);
        }
        return message === undefined;
    }

    // Hàm thay đổi total trọng số của thành viên Thực Hiện
    const handleChangeTotalResWeight = (event) => {
        let value = event.target.value;
        validateTotalResWeight(value, true);
    }
    const validateTotalResWeight = (value, willUpdateState = true) => {
        let message = undefined;
        if (value?.length === 0 || value?.match(/.*[a-zA-Z]+.*/)) {
            message = "Không được bỏ trống và chỉ được điền số";
        }
        else if (Number(totalAccWeight) + Number(value) !== 100) {
            message = "Trọng số Thực hiện + Trọng số Phê duyệt phải bằng 100";
        }
        const newCurrentTask = {
            ...state.newTask,
            errorOnTotalWeight: message,
            totalResWeight: value,
        }
        if (willUpdateState) {
            setState({
                ...state,
                newTask: newCurrentTask,
            })
        }
        return message === undefined;
    }

    // Hàm thay đổi total trọng số của thành viên Phê Duyệt
    const handleChangeTotalAccWeight = (event) => {
        let value = event.target.value;
        validateTotalAccWeight(value, true);
    }
    const validateTotalAccWeight = (value, willUpdateState = true) => {
        let message = undefined;
        if (value?.length === 0 || value?.match(/.*[a-zA-Z]+.*/)) {
            message = "Không được bỏ trống và chỉ được điền số";
        }
        else if (Number(totalResWeight) + Number(value) !== 100) {
            message = "Trọng số Thực hiện + Trọng số Phê duyệt phải bằng 100";
        }
        const newCurrentTask = {
            ...state.newTask,
            errorOnTotalWeight: message,
            totalAccWeight: value,
        }
        if (willUpdateState) {
            setState({
                ...state,
                newTask: newCurrentTask,
            })
        }
        return message === undefined;
    }


    useEffect(() => {
        const { currentRole } = state;
        props.showInfoRole(currentRole);
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    useEffect(() => {
        let resultHumanCost = 0;
        const projectDetail = getCurrentProjectDetails(project);
        const newCurrentResWeightArr = responsibleEmployees.map((resItem, resIndex) => {
            return {
                userId: resItem,
                weight: Number(totalResWeight) / responsibleEmployees.length,
            }
        })
        const newCurrentAccWeightArr = accountableEmployees.map((accItem, accIndex) => {
            return {
                userId: accItem,
                weight: Number(totalAccWeight) / accountableEmployees.length,
            }
        })
        resultHumanCost += getEstimateHumanCostFromParams(
            projectDetail,
            estimateNormalTime,
            responsibleEmployees,
            accountableEmployees,
            projectDetail?.unitTime,
            newCurrentResWeightArr,
            newCurrentAccWeightArr,
        );
        const resultNormalCost = resultHumanCost + Number(estimateAssetCost.replace(/,/g, ''));

        const currentNewTask = {
            ...state.newTask,
            currentResWeightArr: newCurrentResWeightArr,
            currentAccWeightArr: newCurrentAccWeightArr,
            estimateHumanCost: numberWithCommas(resultHumanCost),
            estimateNormalCost: numberWithCommas(resultNormalCost),
            estimateMaxCost: numberWithCommas(getNearestIntegerNumber(resultNormalCost)),
        }
        setState({
            ...state,
            newTask: currentNewTask,
        });
        setTimeout(() => {
            props.handleChangeTaskData(currentNewTask);
        }, 10);
    }, [responsibleEmployees, accountableEmployees, estimateAssetCost, estimateNormalTime, totalResWeight, totalAccWeight])

    // Khi preceedingTasksList có sự thay đổi thì followingTasksList cũng phải thay đổi theo
    useEffect(() => {
        // let newFollowingTasksToChoose = [];
        // if (newTask.preceedingTasks.length !== 0) {
        //     for (let initItem of initTasksToChoose) {
        //         // Nếu (preceedingTasks hiện tại ko có item này) && (initItem hiện tại startDate mà > endDate newTask.preceedingTaskItem) 
        //         // thì push vào listFollowingToChoose
        //         const initItemStartDate = currentProjectTasks?.find(projectTaskItem => String(projectTaskItem._id) === String(initItem.value)).startDate;
        //         let counter = 0;
        //         for (let preceedingItem of newTask.preceedingTasks) {
        //             const preceedingItemEndDate = currentProjectTasks?.find(projectTaskItem => String(projectTaskItem._id) === String(preceedingItem)).endDate;
        //             if (String(initItem.value) !== String(preceedingItem)
        //                 && moment(initItemStartDate).isAfter(moment(preceedingItemEndDate))) {
        //                 // Phải check endDate từng preceedingItem một xem cái nào là lớn nhất, rồi so sánh với startDate init hiện tại
        //                 counter++;
        //             }
        //         }
        //         if (counter === newTask.preceedingTasks.length) {
        //             newFollowingTasksToChoose.push(initItem);
        //         }
        //     }
        // } else {
        //     newFollowingTasksToChoose = [...initTasksToChoose];
        // }
        // setCurrentTasksToChoose({
        //     ...currentTasksToChoose,
        //     following: newFollowingTasksToChoose,
        // })
        const preceedingTasksEndDateArr = newTask.preceedingTasks.map((preceedingItem) => {
            return currentProjectTasks?.find(projectTaskItem => String(projectTaskItem._id) === String(preceedingItem)).endDate;
        })
        const latestStartDate = getMaxMinDateInArr(preceedingTasksEndDateArr, 'max');
        const curStartDate = moment(latestStartDate).format('DD-MM-YYYY');
        const curStartTime = moment(latestStartDate).format('hh:mm A').replace(/CH/g, 'PM').replace(/SA/g, 'AM');
        newTask.preceedingTasks.length > 0 && setStartTime(curStartTime);
        newTask.preceedingTasks.length > 0 && setState({
            ...state,
            newTask: {
                ...state.newTask,
                currentLatestStartDate: latestStartDate,
                startDate: curStartDate,
            },

        })
        if (newTask.preceedingTasks.length > 0) {
            props.handleChangeStartTime(curStartTime);
            props.handleChangeTaskData({
                ...state.newTask,
                currentLatestStartDate: latestStartDate,
                startDate: curStartDate,
            })
        }
        // newTask.preceedingTasks.length > 0 && setTimeout(() => {
        //     props.handleChangeStartTime(curStartTime);
        //     props.handleChangeTaskData({
        //         ...state.newTask,
        //         currentLatestStartDate: latestStartDate,
        //         startDate: curStartDate,
        //     })
        // }, 10);
    }, [newTask.preceedingTasks])

    // Khi followingTasksList có sự thay đổi thì preceedingTasksList cũng phải thay đổi theo
    useEffect(() => {
        // let newPreceedingTasksToChoose = [];
        // if (newTask.followingTasks.length !== 0) {
        //     for (let initItem of initTasksToChoose) {
        //         // Nếu (followingTasks hiện tại ko có item này) && (initItem hiện tại endDate mà < startDate newTask.followingTaskItem) 
        //         // thì push vào listPreceedingToChoose
        //         const initItemEndDate = currentProjectTasks?.find(projectTaskItem => String(projectTaskItem._id) === String(initItem.value)).endDate;
        //         let counter = 0;
        //         for (let followingItem of newTask.followingTasks) {
        //             const followingItemStartDate = currentProjectTasks?.find(projectTaskItem => String(projectTaskItem._id) === String(followingItem)).startDate;
        //             if (String(initItem.value) !== String(followingItem)
        //                 && moment(initItemEndDate).isBefore(moment(followingItemStartDate))) {
        //                 // Phải check startDate từng followingItem một xem cái nào là lớn nhất, rồi so sánh với endDate init hiện tại
        //                 counter++;
        //             }
        //         }
        //         if (counter === newTask.followingTasks.length) {
        //             newPreceedingTasksToChoose.push(initItem);
        //         }
        //     }
        // } else {
        //     newPreceedingTasksToChoose = [...initTasksToChoose];
        // }
        // setCurrentTasksToChoose({
        //     ...currentTasksToChoose,
        //     preceeding: newPreceedingTasksToChoose,
        // })
    }, [newTask.followingTasks])

    useEffect(() => {
        const curStartDateTime = convertDateTime(newTask.startDate, startTime);
        // console.log('curStartDateTime', curStartDateTime, 'newTask.currentLatestStartDate', newTask.currentLatestStartDate)
        if (newTask.currentLatestStartDate && newTask.preceedingTasks.length > 0
            && moment(curStartDateTime).isBefore(moment(newTask.currentLatestStartDate).set('second', 0))) {
            setState({
                ...state,
                newTask: {
                    ...state.newTask,
                    errorOnStartDate: `Thời điểm bắt đầu phải sau thời gian kết thúc của công việc tiền nhiệm: ${moment(newTask.currentLatestStartDate).format('HH:mm DD/MM/YYYY')}`
                }
            })
        } else {
            setState({
                ...state,
                newTask: {
                    ...state.newTask,
                    errorOnStartDate: undefined,
                }
            })
        }
    }, [newTask.currentLatestStartDate, newTask.startDate, startTime])

    useEffect(() => {
        const currentNewTask = {
            ...state.newTask,
            endDate: tempEndDate,
        }
        setState({
            ...state,
            newTask: currentNewTask,
        });
        props.handleChangeTaskData(currentNewTask);
    }, [tempEndDate])

    return (
        <React.Fragment>
            {/** Form chứa thông tin của task */}
            <div className="row">
                <div className={`${isProcess ? "col-lg-12" : "col-sm-4 col-md-4 col-xs-12"}`}>

                    {/* Thông tin công việc */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('task.task_management.detail_info')}</legend>

                        <div className={'row'}>
                            {/* Tên dự án */}
                            <div className="col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group">
                                <label className="control-label">{translate('project.name')}<span className="text-red">*</span></label>
                                <input className="form-control" value={getCurrentProjectDetails(project)?.name} disabled={true} />
                            </div>

                            {/* Độ ưu tiên công việc */}
                            <div className="col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group">
                                <label className="control-label">{translate('task.task_management.detail_priority')}<span className="text-red">*</span></label>
                                <select className="form-control" value={newTask.priority} onChange={handleChangeTaskPriority}>
                                    <option value={5}>{translate('task.task_management.urgent')}</option>
                                    <option value={4}>{translate('task.task_management.high')}</option>
                                    <option value={3}>{translate('task.task_management.standard')}</option>
                                    <option value={2}>{translate('task.task_management.average')}</option>
                                    <option value={1}>{translate('task.task_management.low')}</option>
                                </select>
                            </div>
                        </div>

                        <div className={'row'}>
                            {/* Tên công việc */}
                            <div className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${newTask.errorOnName === undefined ? "" : "has-error"}`}>
                                <label>{translate('task.task_management.name')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" placeholder={translate('task.task_management.name')} value={(newTask.name)} onChange={handleChangeTaskName} />
                                <ErrorLabel content={newTask.errorOnName} />
                            </div>
                        </div>

                        <div className="row">
                            {/* Công việc tiền nhiệm */}
                            {currentTasksToChoose.preceeding.length > 0 &&
                                <div className={`form-group col-md-12 col-xs-12 ${newTask.errorOnPreceedFollowTasks === undefined ? "" : "has-error"}`}>
                                    <label>{translate('project.task_management.preceedingTask')}</label>
                                    <SelectBox
                                        id={`select-project-preceeding-task`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={currentTasksToChoose.preceeding}
                                        value={newTask.preceedingTasks}
                                        multiple={true}
                                        onChange={handleChangePreceedingTask}
                                    />
                                    <ErrorLabel content={newTask.errorOnPreceedFollowTasks} />
                                </div>
                            }
                            {/* Công việc kế nhiệm */}
                            {/* {currentTasksToChoose.following.length > 0 &&
                                <div className={`form-group col-md-6 col-xs-6 ${newTask.errorOnPreceedFollowTasks === undefined ? "" : "has-error"}`}>
                                    <label>Công việc kế nhiệm</label>
                                    <SelectBox
                                        id={`select-project-following-task`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={currentTasksToChoose.following}
                                        value={newTask.followingTasks}
                                        multiple={true}
                                        onChange={handleChangeFollowingTask}
                                    />
                                    <ErrorLabel content={newTask.errorOnPreceedFollowTasks} />
                                </div>
                            } */}
                        </div>

                        <div className='row'>
                            {/* Giai đoạn trong dự án */}
                            <div className={`form-group col-md-12 col-xs-12`}>
                                <label>{translate('project.task_management.phase')}</label>
                                <SelectBox
                                    id={`select-project-phase`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={currentPhaseToChoose.phases}
                                    value={newTask.taskPhase}
                                    multiple={false}
                                    onChange={handleChangeTaskPhase}
                                />
                            </div>
                        </div>

                        {/* Mô tả công việc */}
                        <div className={`form-group ${newTask.errorOnDescription === undefined ? "" : "has-error"}`}>
                            <label className="control-label">{translate('task.task_management.detail_description')}<span className="text-red">*</span></label>
                            <QuillEditor
                                id={`task-add-modal-${props.id}-${props.quillId}`}
                                table={false}
                                embeds={false}
                                getTextData={handleChangeTaskDescription}
                                maxHeight={180}
                                quillValueDefault={newTask.quillDescriptionDefault}
                                placeholder={translate('task.task_management.detail_description')}
                            />
                            <ErrorLabel content={newTask.errorOnDescription} />
                        </div>
                    </fieldset>

                    {/* Chi phí */}
                    {newTask.startDate.trim().length > 0 && newTask.endDate.trim().length > 0
                        && newTask.responsibleEmployees.length > 0 && newTask.accountableEmployees.length > 0
                        &&
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Ước lượng chi phí</legend>
                            <div className={'row'}>
                                {/* Chi phí ước lượng tài sản */}
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${newTask.errorOnAssetCode === undefined ? "" : 'has-error'}`}>
                                    <label className="control-label">Chi phí ước lượng tài sản<span className="text-red">*</span> ({getCurrentProjectDetails(project)?.unitCost})</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={estimateAssetCost}
                                        onChange={handleChangeAssetCost}
                                        onFocus={() => {
                                            setState({
                                                ...state,
                                                newTask: {
                                                    ...state.newTask,
                                                    estimateAssetCost: estimateAssetCost.replace(/,/g, ''),
                                                }
                                            })
                                        }}
                                        onBlur={() => {
                                            setState({
                                                ...state,
                                                newTask: {
                                                    ...state.newTask,
                                                    estimateAssetCost: numberWithCommas(estimateAssetCost),
                                                }
                                            })
                                        }}
                                    />
                                </div>
                                <ErrorLabel content={newTask.errorOnAssetCode} />
                                {/* Chi phí ước lượng nhân lực */}
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group`}>
                                    <label className="control-label">
                                        Chi phí ước lượng nhân lực ({getCurrentProjectDetails(project)?.unitCost})
                                    </label>
                                    <input className="form-control" value={newTask.estimateHumanCost} disabled={true} />
                                </div>
                            </div>
                            <div className={'row'}>
                                {/* Chi phí ước lượng */}
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${Number(estimateNormalCost.replace(/,/g, '')) > Number(newTask.estimateMaxCost.replace(/,/g, '')) ? 'has-error' : ''}`}>
                                    <label className="control-label">Chi phí ước lượng tổng ({getCurrentProjectDetails(project)?.unitCost})</label>
                                    <input className="form-control" value={estimateNormalCost} disabled={true} />
                                    <ErrorLabel content={Number(estimateNormalCost.replace(/,/g, '')) > Number(newTask.estimateMaxCost.replace(/,/g, '')) && "Ngân sách đang thấp hơn chi phí ước lượng"} />
                                </div>
                                {/* Ngân sách cho công việc */}
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${newTask.errorOnBudget === undefined ? "" : "has-error"}`}>
                                    <label>Chi phí thoả hiệp<span className="text-red">*</span> ({getCurrentProjectDetails(project)?.unitCost})</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Chi phí thoả hiệp"
                                        value={newTask.estimateMaxCost}
                                        onChange={handleChangeBudget}
                                        onFocus={() => {
                                            setState({
                                                ...state,
                                                newTask: {
                                                    ...state.newTask,
                                                    estimateMaxCost: newTask.estimateMaxCost.replace(/,/g, ''),
                                                }
                                            })
                                        }}
                                        onBlur={() => {
                                            setState({
                                                ...state,
                                                newTask: {
                                                    ...state.newTask,
                                                    estimateMaxCost: numberWithCommas(newTask.estimateMaxCost),
                                                }
                                            })
                                        }}
                                    />
                                    <ErrorLabel content={newTask.errorOnBudget} />
                                </div>
                            </div>
                        </fieldset>}
                </div>

                <div className={`${isProcess ? "col-lg-12" : "col-sm-8 col-md-8 col-xs-12"}`} >
                    {/* Thời gian */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Ước lượng thời gian</legend>
                        {/* Ngày bắt đầu công việc + Thời gian ước lượng công việc */}
                        <div className="row form-group">
                            <div className={`col-lg-3 col-md-3 col-ms-12 col-xs-12 ${newTask.errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label className="control-label">Thời điểm bắt đầu<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`datepicker1-${id}-${props.id}`}
                                    dateFormat="day-month-year"
                                    value={newTask.startDate}
                                    onChange={handleChangeTaskStartDate}
                                />
                                <TimePicker
                                    id={`time-picker-project-add-task`}
                                    value={startTime}
                                    onChange={handleStartTimeChange}
                                />
                                <ErrorLabel content={newTask.errorOnStartDate} />
                            </div>
                            <div className={`col-lg-3 col-md-3 col-ms-12 col-xs-12 ${newTask.errorOnTimeEst === undefined ? "" : "has-error"}`}>
                                <label className="control-label">
                                    Thời gian ước lượng ({translate(`project.unit.${getCurrentProjectDetails(props.project).unitTime}`)})
                                    <span className="text-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={estimateNormalTime}
                                    onChange={(e) => {
                                        handleChangeEstTimeTask(e.target.value, 'estimateNormalTime')
                                    }}
                                />
                                <ErrorLabel content={newTask.errorOnTimeEst} />
                            </div>
                            <div className={`col-lg-3 col-md-3 col-ms-12 col-xs-12 ${newTask.errorOnMaxTimeEst === undefined ? "" : "has-error"}`}>
                                <label className="control-label">
                                    Thời gian thoả hiệp ({translate(`project.unit.${getCurrentProjectDetails(props.project).unitTime}`)})
                                    <span className="text-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={estimateOptimisticTime}
                                    onChange={(e) => {
                                        handleChangeEstTimeTask(e.target.value, 'estimateOptimisticTime')
                                    }}
                                />
                                <ErrorLabel content={newTask.errorOnMaxTimeEst} />
                            </div>
                            {/* Thời điểm kết thúc công việc */}
                            <div className="row form-group">
                                <div className={`col-lg-3 col-md-3 col-ms-12 col-xs-12 ${newTask.errorOnEndDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">Thời điểm kết thúc</label>
                                    <div>
                                        {state.newTask.endDate && state.newTask.estimateNormalTime && `${state.newTask.endDate} ${endTime}`}
                                    </div>
                                    <ErrorLabel content={newTask.errorOnEndDate} />
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* Phân định trách nhiệm công việc */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('task.task_management.add_raci')} (RACI)</legend>
                        <div className="row form-group">
                            {/* Những người thực hiện công việc */}
                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnResponsibleEmployees === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.responsible')}<span className="text-red">*</span></label>
                                {getProjectParticipants(projectDetail) &&
                                    <SelectBox
                                        id={`responsible-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select"
                                        style={{ width: "100%" }}
                                        items={getProjectParticipants(projectDetail)}
                                        onChange={handleChangeTaskResponsibleEmployees}
                                        value={newTask.responsibleEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('task.task_management.add_resp') }}
                                    />
                                }
                                <ErrorLabel content={newTask.errorOnResponsibleEmployees} />
                            </div>
                            {/* Những người quản lý/phê duyệt công việc */}
                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnAccountableEmployees === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.accountable')}<span className="text-red">*</span></label>
                                {getProjectParticipants(projectDetail) &&
                                    <SelectBox
                                        id={`accounatable-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select"
                                        style={{ width: "100%" }}
                                        items={getProjectParticipants(projectDetail)}
                                        onChange={handleChangeTaskAccountableEmployees}
                                        value={newTask.accountableEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('task.task_management.add_acc') }}
                                    />
                                }
                                <ErrorLabel content={newTask.errorOnAccountableEmployees} />
                            </div>
                        </div>

                        <div className="row form-group">
                            {/* Những người tư vấn công việc */}
                            <div className='col-lg-6 col-md-6 col-ms-12 col-xs-12'>
                                <label className="control-label">{translate('task.task_management.consulted')}</label>
                                {getProjectParticipants(projectDetail) &&
                                    <SelectBox
                                        id={`consulted-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={getProjectParticipants(projectDetail)}
                                        onChange={handleChangeTaskConsultedEmployees}
                                        value={newTask.consultedEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('task.task_management.add_cons') }}
                                    />
                                }
                            </div>
                            {/* Những người quan sát công việc */}
                            <div className='col-lg-6 col-md-6 col-ms-12 col-xs-12 '>
                                <label className="control-label">{translate('task.task_management.informed')}</label>
                                {getProjectParticipants(projectDetail) &&
                                    <SelectBox
                                        id={`informed-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={getProjectParticipants(projectDetail)}
                                        onChange={handleChangeTaskInformedEmployees}
                                        value={newTask.informedEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('task.task_management.add_inform') }}
                                    />
                                }
                            </div>
                        </div>
                    </fieldset>
                    {/* Trọng số thành viên viên công việc */}
                    <fieldset className="scheduler-border" style={{ lineHeight: 1.5 }}>
                        <legend className="scheduler-border">Trọng số thành viên viên công việc</legend>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <h4 style={{ width: '50%' }}><strong>Thành viên thực hiện (%)</strong></h4>
                            <div className={`col-md-12 ${newTask.errorOnTotalWeight === undefined ? "" : "has-error"}`}
                                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={handleChangeTotalResWeight}
                                    value={totalResWeight}
                                    style={{ width: '20%' }}
                                />
                                <ErrorLabel content={newTask.errorOnTotalWeight} />
                            </div>
                        </div>
                        <table id="res-emp-weight-table" className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Họ và tên</th>
                                    <th>Trọng số (%)</th>
                                    <th>Lương tháng (VND)</th>
                                    <th>Ước lượng chi phí thành viên (VND)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(responsibleEmployees && responsibleEmployees.length !== 0 && currentResWeightArr && currentResWeightArr.length !== 0) &&
                                    responsibleEmployees.map((resItem, resIndex) => (
                                        <tr key={resIndex}>
                                            <td>{convertUserIdToUserName(listUsers, resItem)}</td>
                                            <td>{currentResWeightArr?.[resIndex]?.weight}</td>
                                            <td>{numberWithCommas(getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, resItem))}</td>
                                            <td>{
                                                estimateNormalTime && numberWithCommas(getEstimateMemberCost(
                                                    projectDetail,
                                                    resItem,
                                                    Number(estimateNormalTime),
                                                    projectDetail?.unitTime,
                                                    Number(currentResWeightArr?.[resIndex]?.weight)))
                                            }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <h4 style={{ width: '50%' }}><strong>Thành viên phê duyệt (%)</strong></h4>
                            <div className={`col-md-12 ${newTask.errorOnTotalWeight === undefined ? "" : "has-error"}`}
                                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={handleChangeTotalAccWeight}
                                    value={totalAccWeight}
                                    style={{ width: '20%' }}
                                />
                                <ErrorLabel content={newTask.errorOnTotalWeight} />
                            </div>
                        </div>
                        <table id="res-emp-weight-table" className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Họ và tên</th>
                                    <th>Trọng số (%)</th>
                                    <th>Lương tháng (VND)</th>
                                    <th>Ước lượng chi phí thành viên (VND)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(accountableEmployees && accountableEmployees.length !== 0) &&
                                    accountableEmployees.map((accItem, accIndex) => (
                                        <tr key={accIndex}>
                                            <td>{convertUserIdToUserName(listUsers, accItem)}</td>
                                            <td>{currentAccWeightArr?.[accIndex]?.weight}</td>
                                            <td>{numberWithCommas(getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accItem))}</td>
                                            <td>{
                                                estimateNormalTime && numberWithCommas(getEstimateMemberCost(
                                                    projectDetail,
                                                    accItem,
                                                    Number(estimateNormalTime),
                                                    projectDetail?.unitTime,
                                                    Number(currentAccWeightArr?.[accIndex]?.weight)))
                                            }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </fieldset>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { tasktemplates, tasks, user, department, project, role } = state;
    return { tasktemplates, tasks, user, department, project, role };
}

const actionCreators = {
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getPaginateTasksByUser: taskManagementActions.getPaginateTasksByUser,

    showInfoRole: RoleActions.show,
};

const connectedAddTaskForm = connect(mapState, actionCreators)(withTranslate(AddProjectTaskForm));
export { connectedAddTaskForm as AddProjectTaskForm };