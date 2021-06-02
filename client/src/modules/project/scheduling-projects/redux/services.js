import { sendRequest } from "../../../../helpers/requestHelper";

export const ProjectServices = {
    createProjectTasksFromCPM,
}

/**
 * thêm list công việc mới cho dự án theo CPM
 * @param {*} tasksList list công việc mới 
 */
function createProjectTasksFromCPM(tasksList) {
    console.log('------', tasksList)
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks/project-tasks/cpm`,
        method: 'POST',
        data: tasksList
    }, true, true, 'task.task_management');
}