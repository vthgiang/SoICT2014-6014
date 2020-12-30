import { sendRequest } from '../../../../helpers/requestHelper';

const TaskProjectService = {
    get,
    show,
    create,
    edit,
    destroy
};

function get(params={}) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/task-project`,
        method: 'GET',
        params
    }, false, true, 'task.task_project');
}

function show() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/task-project`,
        method: 'GET',
    }, false, false, 'task.task_project');
}

function create(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/task-project`,
        method: 'POST',
        data
    }, true, true, 'task.task_project');
}

function edit(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/task-project/${id}`,
        method: 'PATCH',
        data
    }, true, true, 'task.task_project');
}

function destroy(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/task-project/${id}`,
        method: 'DELETE',
    }, true, true, 'task.task_project');
}

export default TaskProjectService;