import dayjs from "dayjs";
import moment from "moment";
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

export const getCurrentProjectDetails = (project, projectId = undefined) => {
    const currentProjectId = projectId || window.location.href.split('?id=')[1];
    const projectDetail = project?.data?.list?.filter(item => item._id === currentProjectId)?.[0];
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
    resultArr.push(projectDetail?.creator?.email);
    for (let managerItem of projectDetail?.projectManager) {
        if (!resultArr.includes(managerItem?.email)) {
            resultArr.push(managerItem?.email)
        }
    }
    for (let employeeItem of projectDetail?.responsibleEmployees) {
        if (!resultArr.includes(employeeItem?.email)) {
            resultArr.push(employeeItem?.email)
        }
    }
    return resultArr;
}
