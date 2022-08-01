import { sendRequest } from "../../../../helpers/requestHelper";

export const ProjectServices = {
    createProjectTasksFromCPM,
    createProjectPhaseFromCPM,
}

/**
 * thêm list công việc mới cho dự án theo CPM
 * @param {*} tasksList list công việc mới 
 */
function createProjectTasksFromCPM(tasksList) {
    console.log('------', tasksList);
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks/project-tasks/cpm`,
        method: 'POST',
        data: {
            tasksList,
        }
    }, true, true, 'project');
}

/**
 * thêm danh sách các giai đoạn trong dự án
 * @param {*} phaseList list giai đoạn 
 */
 function createProjectPhaseFromCPM(phaseList) {
    console.log('------', phaseList);
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/projects/project/project-phase`,
        method: 'POST',
        data: {
            phaseList,
        }
    }, true, true, 'project');
}