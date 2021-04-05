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