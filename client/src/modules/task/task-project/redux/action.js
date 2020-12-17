import TaskProjectConstant from "./constant";
import TaskProjectService from "./service";

const TaskProjectAction = {
    get,
    show,
    create,
    edit,
    destroy
};

function get(params={}) {
    return dispatch => {
        dispatch({ type: TaskProjectConstant.GET_TASK_PROJECT_REQUEST } );

        TaskProjectService.get(params)
            .then(res => dispatch({ 
                type: TaskProjectConstant.GET_TASK_PROJECT_SUCCESS, 
                payload: res.data.content
            }))
            .catch(err => dispatch({ 
                type: TaskProjectConstant.GET_TASK_PROJECT_FAILE
            }))
    };
}

function show(id) {
    return dispatch => {
        dispatch({ type: TaskProjectConstant.SHOW_TASK_PROJECT_REQUEST } );

        TaskProjectService.show(id)
            .then(res => dispatch({ 
                type: TaskProjectConstant.SHOW_TASK_PROJECT_SUCCESS, 
                payload: res.data.content
            }))
            .catch(err => dispatch({ 
                type: TaskProjectConstant.SHOW_TASK_PROJECT_FAILE
            }))
    };
}

function create(data={}) {
    return dispatch => {
        dispatch({ type: TaskProjectConstant.CREATE_TASK_PROJECT_REQUEST } );

        TaskProjectService.create(data)
            .then(res => dispatch({ 
                type: TaskProjectConstant.CREATE_TASK_PROJECT_SUCCESS, 
                payload: res.data.content
            }))
            .catch(err => dispatch({ 
                type: TaskProjectConstant.CREATE_TASK_PROJECT_FAILE
            }))
    };
}

function edit(id, data={}) {
    return dispatch => {
        dispatch({ type: TaskProjectConstant.EDIT_TASK_PROJECT_REQUEST } );

        TaskProjectService.edit(id, data)
            .then(res => dispatch({ 
                type: TaskProjectConstant.EDIT_TASK_PROJECT_SUCCESS, 
                payload: res.data.content
            }))
            .catch(err => dispatch({ 
                type: TaskProjectConstant.EDIT_TASK_PROJECT_FAILE
            }))
    };
}

function destroy(id) {
    return dispatch => {
        dispatch({ type: TaskProjectConstant.DELETE_TASK_PROJECT_REQUEST } );

        TaskProjectService.destroy(id)
            .then(res => dispatch({ 
                type: TaskProjectConstant.DELETE_TASK_PROJECT_SUCCESS, 
                payload: res.data.content
            }))
            .catch(err => dispatch({ 
                type: TaskProjectConstant.DELETE_TASK_PROJECT_FAILE
            }))
    };
}

export default TaskProjectAction;