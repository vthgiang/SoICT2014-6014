import dayjs from "dayjs";
import moment from "moment";
import { getStorage } from "../../../../config";
import { getNumsOfDaysWithoutGivenDay } from "../../../task/task-management/component/functionHelpers";

export const MILISECS_TO_DAYS = 86400000;

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

export const getCurrentProjectDetails = (project) => {
    const currentProjectId = window.location.href.split('?id=')[1];
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
export const getDurationDaysWithoutSatSun = (startDate, endDate, timeMode = 'days') => {
    const numsOfSaturdays = getNumsOfDaysWithoutGivenDay(new Date(startDate), new Date(endDate), 6)
    const numsOfSundays = getNumsOfDaysWithoutGivenDay(new Date(startDate), new Date(endDate), 0)
    let duration = 0
    if (timeMode === 'hours') {
        duration = (moment(endDate).diff(moment(startDate), `milliseconds`) / MILISECS_TO_DAYS - numsOfSaturdays - numsOfSundays) * 24;
        return duration;
    }
    duration = moment(endDate).diff(moment(startDate), `milliseconds`) / MILISECS_TO_DAYS - numsOfSaturdays - numsOfSundays;
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