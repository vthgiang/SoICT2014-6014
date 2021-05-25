import { isArraysEqual } from "@fullcalendar/common";
import dayjs from "dayjs";
import moment from "moment";
import React from 'react';
import { getStorage } from "../../../../config";
import { getNumsOfDaysWithoutGivenDay, getSalaryFromUserId } from "../../../task/task-management/component/functionHelpers";

export const MILISECS_TO_DAYS = 86400000;
export const MILISECS_TO_HOURS = 3600000;

export const checkIfAbleToCRUDProject = ({ project, user, currentProjectId }) => {
    const currentRole = getStorage("currentRole");
    const userId = getStorage("userId");
    const checkIfCurrentRoleIsUnitManager = user?.usersInUnitsOfCompany?.filter(userItem => userItem?.managers?.[currentRole])?.length > 0;
    const projectDetail = project?.data?.list?.filter(item => item._id === currentProjectId)?.[0]
    const checkIfCurrentIdIsProjectManagerOrCreator =
        projectDetail?.projectManager?.filter(managerItem => managerItem?._id === userId)?.length > 0
        || projectDetail?.creator?._id === userId;
    return checkIfCurrentRoleIsUnitManager || checkIfCurrentIdIsProjectManagerOrCreator;
}

export const getCurrentProjectDetails = (project, projectId = undefined, type = 'user_all') => {
    const currentProjectId = projectId || window.location.href.split('?id=')[1];
    const projectDetail = type === 'user_all'
        ? project?.data?.listbyuser?.filter(item => item._id === currentProjectId)?.[0]
        : project?.data?.list?.filter(item => item._id === currentProjectId)?.[0];
    return projectDetail;
}

export const getListDepartments = (usersInUnitsOfCompany) => {
    return usersInUnitsOfCompany.map(item => ({
        text: item.department,
        value: item.id
    }))
}

export const convertDepartmentIdToDepartmentName = (usersInUnitsOfCompany, departmentId) => {
    if (!usersInUnitsOfCompany) return [];
    const result = usersInUnitsOfCompany.filter(item => item.id === departmentId)?.[0]?.department;
    return result
}

export const convertUserIdToUserName = (listUsers, userId) => {
    if (!listUsers) return [];
    for (let department of listUsers) {
        const userList = department.value;
        for (let user of userList) {
            if (user.value === userId) {
                // console.log('user.name', user.text, 'user.value', user.value, 'userId', userId)
                const userName = user.text.split('(')?.[0];
                return userName;
            }
        }
    }
}

// Lấy số ngày công trong tháng
export const getAmountOfWeekDaysInMonth = (date) => {
    let result = 0;
    for (var i = 1; i < 6; i++) {
        date.date(1);
        var dif = (7 + (i - date.weekday())) % 7 + 1;
        result += Math.floor((date.daysInMonth() - dif) / 7) + 1;
    }
    return result;
}

// Lấy duration (theo timeMode) giua startDate va endDate (tru di thu 7 va chu nhat)
export const getDurationWithoutSatSun = (startDate, endDate, timeMode) => {
    const numsOfSaturdays = getNumsOfDaysWithoutGivenDay(new Date(startDate), new Date(endDate), 6)
    const numsOfSundays = getNumsOfDaysWithoutGivenDay(new Date(startDate), new Date(endDate), 0)
    let duration = 0
    if (timeMode === 'hours') {
        duration = (moment(endDate).diff(moment(startDate), `milliseconds`) / MILISECS_TO_DAYS - numsOfSaturdays - numsOfSundays) * 8;
        // return theo don vi giờ - hours
        return duration;
    }
    if (timeMode === 'milliseconds') {
        duration = (moment(endDate).diff(moment(startDate), `milliseconds`) / MILISECS_TO_DAYS - numsOfSaturdays - numsOfSundays);
        // return theo don vi milliseconds
        return duration * MILISECS_TO_DAYS;
    }
    duration = moment(endDate).diff(moment(startDate), `milliseconds`) / MILISECS_TO_DAYS - numsOfSaturdays - numsOfSundays;
    // return theo don vi ngày - days
    return duration;
}

export const convertDateTime = (date, time) => {
    let splitter = date.split("-");
    let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
    return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss');
}
// convert ISODate to String hh:mm AM/PM
export const formatTime = (date) => {
    return dayjs(date).format("hh:mm A");
}

export const convertToMilliseconds = (duration, currentMode = 'days') => {
    if (currentMode === 'days') return duration * MILISECS_TO_DAYS;
    return duration * MILISECS_TO_HOURS;
}

// value ở dạng number
export const getNearestIntegerNumber = (value) => {
    const beforeDecimalPart = value.toString().split('.')[0].replace(/,/g, '');
    const beforeDecimalPartArr = beforeDecimalPart.split('');
    const numberWithFirstSecondIndexArr = beforeDecimalPartArr.map((item, index) => {
        if (index === 0 || index === 1) return item
        else return "0";
    })
    const numberWithFirstSecondIndex = numberWithFirstSecondIndexArr.join('');
    const result = Number(numberWithFirstSecondIndex) + Math.pow(10, beforeDecimalPart.length - 2);
    return result;
}

export const getEstimateHumanCostFromParams = (projectDetail, duration, currentResponsibleEmployees, currentAccountableEmployees, timeMode, currentResWeightArr, currentAccWeightArr) => {
    // trọng số default người thực hiện là 0.8, người phê duyệt là 0.2
    let cost = 0;
    const currentMonthWorkDays = getAmountOfWeekDaysInMonth(moment());
    for (let resItem of currentResponsibleEmployees) {
        const resWeightNotInDecimal = currentResWeightArr?.find(resWeightItem => String(resWeightItem.userId) === String(resItem))?.weight
        cost += (resWeightNotInDecimal ? (resWeightNotInDecimal / 100) : (0.8 / currentResponsibleEmployees.length))
            * getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, resItem) / currentMonthWorkDays * (timeMode === 'days' ? 1 : 8)
            * duration;
    }
    for (let accItem of currentAccountableEmployees) {
        const accWeightNotInDecimal = currentAccWeightArr?.find(accWeightItem => String(accWeightItem.userId) === String(accItem))?.weight
        cost += (accWeightNotInDecimal ? (accWeightNotInDecimal / 100) : (0.2 / currentAccountableEmployees.length))
            * getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accItem) / currentMonthWorkDays * (timeMode === 'days' ? 1 : 8)
            * duration;
    }
    return cost;
}

export const getEstimateMemberCost = (projectDetail, userId, duration, timeMode, weight) => {
    const currentMonthWorkDays = getAmountOfWeekDaysInMonth(moment());
    let cost = 0;
    cost = (weight / 100)
        * getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, userId) / currentMonthWorkDays * (timeMode === 'days' ? 1 : 8)
        * duration
    return cost;
}

export const getProjectParticipants = (projectDetail, hasManagerAndCreator = false) => {
    let projectParticipants = [];
    if (hasManagerAndCreator) {
        const formattedManagerArr = projectDetail?.projectManager?.map(item => {
            return ({
                text: item.name,
                value: item._id
            })
        })
        let formattedEmployeeArr = [];
        if (Array.isArray(projectDetail?.responsibleEmployees)) {
            for (let item of projectDetail?.responsibleEmployees) {
                if (!projectDetail?.projectManager.find(managerItem => managerItem.name === item.name)) {
                    formattedEmployeeArr.push({
                        text: item.name,
                        value: item._id
                    })
                }
            }
        }

        if (!projectParticipants || !formattedManagerArr || !formattedEmployeeArr) {
            return []
        }
        projectParticipants = formattedManagerArr.concat(formattedEmployeeArr)
        if (projectParticipants.find(item => String(item.value) === String(projectDetail?.creator?._id))) {
            return projectParticipants;
        }
        projectParticipants.push({
            text: projectDetail?.creator?.name,
            value: projectDetail?.creator?._id
        })
        return projectParticipants;
    }
    projectParticipants = projectDetail?.responsibleEmployees?.map(item => {
        return ({
            text: item.name,
            value: item._id
        })
    });
    return projectParticipants;
}

export const getEmailMembers = (projectDetail) => {
    let resultArr = [];
    // if (!projectDetail) return [];
    // resultArr.push(projectDetail?.creator?.email);
    // for (let managerItem of projectDetail?.projectManager) {
    //     if (!resultArr.includes(managerItem?.email)) {
    //         resultArr.push(managerItem?.email)
    //     }
    // }
    for (let employeeItem of projectDetail?.responsibleEmployees) {
        if (!resultArr.includes(employeeItem?.email)) {
            resultArr.push(employeeItem?.email)
        }
    }
    return resultArr;
}

export const getMaxMinDateInArr = (dateArr, mode = 'max') => {
    let result = dateArr[0];
    if (mode === 'max') {
        for (let dateItem of dateArr) {
            if (moment(dateItem).isAfter(moment(result))) {
                result = dateItem;
            }
        }
        return result;
    }
    for (let dateItem of dateArr) {
        if (moment(dateItem).isBefore(moment(result))) {
            result = dateItem;
        }
    }
    return result;
}

// Xử lý phần cộng thêm estimateNormalTime cho task hiện tại
export const handleWeekendAndWorkTime = (projectDetail, taskItem) => {
    // Nếu unitTime = 'days'
    if (projectDetail?.unitTime === 'days') {
        // Check xem startDate có phải thứ 7 hoặc chủ nhật không thì cộng thêm ngày để startDate vào ngày thứ 2 tuần sau
        let dayOfStartDate = (new Date(taskItem.startDate)).getDay();
        if (dayOfStartDate === 6) taskItem.startDate = moment(taskItem.startDate).add(2, 'days').format();
        if (dayOfStartDate === 0) taskItem.startDate = moment(taskItem.startDate).add(1, 'days').format();
        // Tách phần integer và phần decimal của estimateNormalTime
        const estimateNormalTimeArr = taskItem.estimateNormalTime.toString().split('.');
        const integerPart = Number(estimateNormalTimeArr[0]);
        const decimalPart = estimateNormalTimeArr.length === 2 ? Number(`.${estimateNormalTimeArr[1]}`) : undefined;
        let tempEndDate = '';
        // Cộng phần nguyên
        for (let i = 0; i < integerPart; i++) {
            // Tính tempEndDate = + 1 ngày trước để kiểm tra
            if (i === 0) {
                tempEndDate = moment(taskItem.startDate).add(1, 'days').format();
            } else {
                tempEndDate = moment(taskItem.endDate).add(1, 'days').format();
            }
            // Nếu tempEndDate đang là thứ 7 thì công thêm 2 ngày
            if ((new Date(tempEndDate)).getDay() === 6) {
                taskItem.endDate = moment(tempEndDate).add(2, 'days').format();
            }
            // Nếu tempEndDate đang là chủ nhật thì công thêm 1 ngày
            else if ((new Date(tempEndDate)).getDay() === 0) {
                taskItem.endDate = moment(tempEndDate).add(1, 'days').format();
            }
            // Còn không thì không cộng gì
            else {
                taskItem.endDate = tempEndDate;
            }
        }
        // Cộng phần thập phân (nếu có)
        if (decimalPart) {
            if (!taskItem.endDate) {
                taskItem.endDate = moment(taskItem.startDate).add(decimalPart, 'days').format();
            } else {
                taskItem.endDate = moment(taskItem.endDate).add(decimalPart, 'days').format();
            }
            // Check xem endDate hiện tại là thứ mấy => Cộng tiếp để bỏ qua thứ 7 và chủ nhật (nếu có)
            dayOfStartDate = (new Date(taskItem.endDate)).getDay();
            if (dayOfStartDate === 6) taskItem.endDate = moment(taskItem.endDate).add(2, 'days').format();
            if (dayOfStartDate === 0) taskItem.endDate = moment(taskItem.endDate).add(1, 'days').format();
        }
        return taskItem;
    }

    // Nếu unitTime = 'hours'
    const dailyMorningStartTime = moment('08:00', 'HH:mm');
    const dailyMorningEndTime = moment('12:00', 'HH:mm');
    const dailyAfternoonStartTime = moment('13:30', 'HH:mm');
    const dailyAfternoonEndTime = moment('17:30', 'HH:mm');
    // Check xem startDate có phải thứ 7 hoặc chủ nhật không thì cộng thêm ngày để startDate vào ngày thứ 2 tuần sau
    let dayOfStartDate = (new Date(taskItem.startDate)).getDay();
    if (dayOfStartDate === 6) taskItem.startDate = moment(taskItem.startDate).add(2, 'days').format();
    if (dayOfStartDate === 0) taskItem.startDate = moment(taskItem.startDate).add(1, 'days').format();
    // Tách phần integer và phần decimal của estimateNormalTime
    const estimateNormalTimeArr = taskItem.estimateNormalTime.toString().split('.');
    const integerPart = Number(estimateNormalTimeArr[0]);
    const decimalPart = estimateNormalTimeArr.length === 2 ? Number(`.${estimateNormalTimeArr[1]}`) : undefined;
    let tempEndDate = '';
    // Cộng phần nguyên
    for (let i = 0; i < integerPart; i++) {
        // Tính tempEndDate = + 1 tiêng trước để kiểm tra
        if (i === 0) {
            tempEndDate = moment(taskItem.startDate).add(1, 'hours').format();
        } else {
            tempEndDate = moment(taskItem.endDate).add(1, 'hours').format();
        }
        const currentEndDateInMomentHourMinutes = moment(moment(tempEndDate).format('HH:mm'), 'HH:mm');
        // Nếu đang ở giờ nghỉ trưa
        if (currentEndDateInMomentHourMinutes.isAfter(dailyMorningEndTime) && currentEndDateInMomentHourMinutes.isBefore(dailyAfternoonStartTime)) {
            tempEndDate = moment(tempEndDate).set({
                hour: 13,
                minute: 30,
            });
            tempEndDate = moment(tempEndDate).add(1, 'hours').format();
        }
        // Nếu quá 17:30
        else if (currentEndDateInMomentHourMinutes.isAfter(dailyAfternoonEndTime)) {
            tempEndDate = moment(tempEndDate).set({
                hour: 8,
                minute: 0,
            });
            tempEndDate = moment(tempEndDate).add(1, 'hours').format();
            tempEndDate = moment(tempEndDate).add(1, 'days').format();
        }
        // Nếu tempEndDate đang là thứ 7 thì công thêm 2 ngày
        if ((new Date(tempEndDate)).getDay() === 6) {
            taskItem.endDate = moment(tempEndDate).add(2, 'days').format();
        }
        // Nếu tempEndDate đang là chủ nhật thì công thêm 1 ngày
        else if ((new Date(tempEndDate)).getDay() === 0) {
            taskItem.endDate = moment(tempEndDate).add(1, 'days').format();
        }
        // Còn không thì không cộng gì
        else {
            taskItem.endDate = tempEndDate;
        }
    }
    // Cộng phần thập phân (nếu có)
    if (decimalPart) {
        if (!taskItem.endDate) {
            taskItem.endDate = moment(taskItem.startDate).add(decimalPart, 'hours').format();
        } else {
            taskItem.endDate = moment(taskItem.endDate).add(decimalPart, 'hours').format();
        }
        // Check xem endDate hiện tại là thứ mấy => Cộng tiếp để bỏ qua thứ 7 và chủ nhật (nếu có)
        dayOfStartDate = (new Date(taskItem.endDate)).getDay();
        if (dayOfStartDate === 6) taskItem.endDate = moment(taskItem.endDate).add(2, 'days').format();
        if (dayOfStartDate === 0) taskItem.endDate = moment(taskItem.endDate).add(1, 'days').format();
    }
    return taskItem;
}

// Xử lý cả mảng task từ estimateNormalTime ra startDate và endDate từng task
export const processDataTasksStartEnd = (projectDetail, currentTasksData, currentProjectTasks = undefined) => {
    if (!currentTasksData || currentTasksData.length === 0) return [];
    const tempTasksData = [...currentTasksData];
    // console.log('tempTasksData', tempTasksData)
    // Lặp mảng tasks
    for (let taskItem of tempTasksData) {
        console.log(taskItem.name, taskItem.startDate, taskItem.endDate)
        if (taskItem.estimateNormalTime > 20) {
            console.error('Estimate normal time đang quá lớn: ', taskItem.estimateNormalTime);
        }
        if (taskItem.preceedingTasks.length === 0 && (!taskItem.startDate || !taskItem.endDate)) {
            taskItem.startDate = taskItem.startDate || projectDetail?.startDate;
            taskItem = handleWeekendAndWorkTime(projectDetail, taskItem);
        }
        else {
            // Lặp mảng preceedingTasks của taskItem hiện tại
            for (let preceedingItem of taskItem.preceedingTasks) {
                const currentPreceedingTaskItem = tempTasksData.find(item => {
                    // chỗ này quan trọng nhất là .code
                    if (typeof preceedingItem === 'string') {
                        return String(item.code) === String(preceedingItem).trim();
                    }
                    return String(item.code) === String(preceedingItem.task);
                }) || (currentProjectTasks && currentProjectTasks.find(item => {
                    // chỗ này quan trọng nhất là .code
                    if (typeof preceedingItem === 'string') {
                        return String(item._id) === String(preceedingItem).trim();
                    }
                    return String(item._id) === String(preceedingItem.task);
                }));
                if (currentPreceedingTaskItem && (
                    !taskItem.startDate ||
                    moment(taskItem.startDate)
                        .isBefore(moment(currentPreceedingTaskItem.endDate))
                )) {
                    taskItem.startDate = currentPreceedingTaskItem.endDate;
                }
                taskItem = handleWeekendAndWorkTime(projectDetail, taskItem);
            }
        }
    }
    console.log('tempTasksData 33333333', tempTasksData);
    return tempTasksData;
}

// render item ở phần thông tin
export const renderItemLabelContent = (label, content, customTextStyle = {}, customContainerStyle = {}) => {
    return (
        <div className="col-md-6">
            <div className="form-horizontal">
                <div style={{ ...customContainerStyle }} className="form-group">
                    <strong className="col-sm-4">{label}</strong>
                    <div className="col-sm-8">
                        <span style={{ ...customTextStyle }}>{content}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const processAffectedTasksChangeRequest = (projectDetail, tasksList, currentTask) => {
    console.log('currentTask', currentTask)
    console.log('tasksList', tasksList)
    // Với taskList lấy từ DB xuống phải chia cho unitTIme
    // Với curentTask thì có thể không cần vì mình làm ở local
    const initTasksList = tasksList.map((taskItem, taskIndex) => {
        return {
            ...taskItem,
            estimateNormalTime: Number(taskItem.estimateNormalTime) / (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
            estimateOptimisticTime: Number(taskItem.estimateOptimisticTime) / (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
            preceedingTasks: taskItem.preceedingTasks,
            code: taskItem._id,
        }
    });
    let tempTasksList = initTasksList.map((taskItem, taskIndex) => {
        // Nếu là dạng edit task thì thay the item trong array luon
        if (String(taskItem._id) === String(currentTask?._id) || String(taskItem._id) === String(currentTask?.task)
            || String(taskItem.name) === String(currentTask?.name)) {
            return {
                ...currentTask,
                code: taskItem._id,
            }
        }
        return {
            ...taskItem,
            code: taskItem._id,
            startDate: '',
            endDate: '',
        }
    });
    console.log('tempTasksList', tempTasksList)
    console.log('currentTask?.task', currentTask?.task, 'currentTask?._id', currentTask?._id)

    const newTasksList = processDataTasksStartEnd(projectDetail, tempTasksList);
    console.log('newTasksList -----', newTasksList)
    let affectedTasks = [];
    for (let i = 0; i < newTasksList.length; i++) {
        if (!initTasksList[i]) {
            affectedTasks.push({
                task: undefined,
                taskProject: newTasksList[i].taskProject,
                old: undefined,
                new: {
                    ...newTasksList[i],
                },
            })
        }
        else if (!(
            isArraysEqual(newTasksList[i].preceedingTasks, initTasksList[i].preceedingTasks) && newTasksList[i].estimateNormalTime === initTasksList[i].estimateNormalTime
            && newTasksList[i].estimateOptimisticTime === initTasksList[i].estimateOptimisticTime
            && newTasksList[i].estimateNormalCost === initTasksList[i].estimateNormalCost && newTasksList[i].estimateMaxCost === initTasksList[i].estimateMaxCost
            && moment(newTasksList[i].startDate).isSame(moment(initTasksList[i].startDate)) && moment(newTasksList[i].endDate).isSame(moment(initTasksList[i].endDate))
            && isArraysEqual(newTasksList[i].responsibleEmployees, initTasksList[i].responsibleEmployees)
            && isArraysEqual(newTasksList[i].accountableEmployees, initTasksList[i].accountableEmployees)
        )) {
            console.log(newTasksList[i].name, initTasksList[i].name)
            console.log(newTasksList[i].estimateNormalTime, initTasksList[i].estimateNormalTime, newTasksList[i].estimateNormalTime === initTasksList[i].estimateNormalTime);
            console.log(newTasksList[i].estimateOptimisticTime, initTasksList[i].estimateOptimisticTime, newTasksList[i].estimateOptimisticTime === initTasksList[i].estimateOptimisticTime);
            console.log(newTasksList[i].estimateNormalCost, initTasksList[i].estimateNormalCost, newTasksList[i].estimateNormalCost === initTasksList[i].estimateNormalCost);
            console.log(newTasksList[i].estimateMaxCost, initTasksList[i].estimateMaxCost, newTasksList[i].estimateMaxCost === initTasksList[i].estimateMaxCost);
            console.log(newTasksList[i].preceedingTasks, initTasksList[i].preceedingTasks, isArraysEqual(newTasksList[i].preceedingTasks, initTasksList[i].preceedingTasks));
            console.log(newTasksList[i].startDate, initTasksList[i].startDate, moment(newTasksList[i].startDate).isSame(moment(initTasksList[i].startDate)));
            console.log(newTasksList[i].endDate, initTasksList[i].endDate, moment(newTasksList[i].endDate).isSame(moment(initTasksList[i].endDate)));
            affectedTasks.push({
                task: newTasksList[i]?._id || newTasksList[i]?.task,
                taskProject: newTasksList[i].taskProject,
                old: {
                    ...initTasksList[i],
                },
                new: {
                    ...newTasksList[i],
                },
            })
        }
        // console.log('----------------------------------------');
    }

    console.log('affectedTasks', affectedTasks);
    return {
        affectedTasks,
        newTasksList,
    };
}

export const getNewTasksListAfterCR = (projectDetail, tasksList, currentTask) => {
    // Với taskList lấy từ DB xuống phải chia cho unitTIme
    // Với curentTask thì có thể không cần vì mình làm ở local
    const initTasksList = tasksList.map((taskItem, taskIndex) => {
        return {
            ...taskItem,
            estimateNormalTime: Number(taskItem.estimateNormalTime) / (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
            estimateOptimisticTime: Number(taskItem.estimateOptimisticTime) / (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
            preceedingTasks: taskItem.preceedingTasks.map((preItem) => preItem.task),
            code: taskItem._id,
        }
    });
    let tempTasksList = initTasksList.map((taskItem, taskIndex) => {
        if (String(taskItem._id) === String(currentTask?._id) || String(taskItem._id) === String(currentTask?.task)) {
            return {
                ...currentTask,
                startDate: '',
                endDate: '',
            }
        }
        return {
            ...taskItem,
            startDate: '',
            endDate: '',
        }
    });
    // Nếu là dạng tạo mới task thì push vào cuối mảng hoặc là curentTask.task undefined
    if (!currentTask?.task && !currentTask?._id) {
        tempTasksList.push(currentTask);
        tempTasksList[tempTasksList.length - 1].startDate = currentTask.startDate;
        tempTasksList[tempTasksList.length - 1].endDate = '';
    }
    const newTasksList = processDataTasksStartEnd(projectDetail, tempTasksList);
    // console.log(newTasksList)
    return newTasksList;
}

export const getEndDateOfProject = (currentProjectTasks, needCustomFormat = true) => {
    if (!currentProjectTasks || currentProjectTasks.length === 0) return undefined;
    let currentEndDate = currentProjectTasks[0].endDate;
    for (let taskItem of currentProjectTasks) {
        if (moment(taskItem.endDate).isAfter(moment(currentEndDate))) {
            currentEndDate = taskItem.endDate;
        }
    }
    return needCustomFormat ? moment(currentEndDate).format('HH:mm DD/MM/YYYY') : moment(currentEndDate).format();
}

export const getEstimateCostOfProject = (currentProjectTasks) => {
    if (!currentProjectTasks || currentProjectTasks.length === 0) return 0;
    let estCost = 0;
    for (let taskItem of currentProjectTasks) {
        estCost += Number(taskItem.estimateNormalCost)
    }
    return estCost;
}

export const getEstimateMemberCostOfTask = (task, projectDetail, userId) => {
    let estimateNormalMemberCost = 0;
    if (!task || !projectDetail) return 0;
    const currentEmployee = task.actorsWithSalary.find((actorSalaryItem) => {
        return String(actorSalaryItem.userId) === String(userId)
    });
    if (currentEmployee) {
        estimateNormalMemberCost = Number(currentEmployee.salary) * Number(currentEmployee.weight / 100) * task.estimateNormalTime
            / (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS);
    }
    return estimateNormalMemberCost;
}

export const getActualMemberCostOfTask = (task, projectDetail, userId) => {
    let actualNormalMemberCost = 0;
    if (!task || !projectDetail) return 0;
    const currentEmployee = task.actorsWithSalary.find((actorSalaryItem) => {
        return String(actorSalaryItem.userId) === String(userId)
    });
    if (currentEmployee) {
        actualNormalMemberCost = Number(currentEmployee.actualCost || 0);
    }
    return actualNormalMemberCost;
}

export const renderLongListUsers = (list, limit = 10) => {
    if (!list) return '';
    if (list.length > limit) {
        const newList = list.filter((item, index) => index < limit);
        newList.push('...');
        return newList.join(', ');
    }
    return list.join(', ');
}

export const renderProjectTypeText = (projectType) => {
    if (projectType === 1) return "Đơn giản"
    return "Phương pháp CPM";
}