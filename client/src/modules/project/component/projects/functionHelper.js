import { getStorage } from "../../../../config";

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
    const result = usersInUnitsOfCompany.filter(item => item.id === departmentId)?.[0]?.department;
    return result
}

export const convertUserIdToUserName = (listUsers, userId) => {
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