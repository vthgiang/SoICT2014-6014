import { taskTemplateConstants } from "./constants";
//import { alertActions } from "./AlertActions";
import { taskTemplateService } from "./services";
export const taskTemplateActions = {
    getAll,
    getAllTaskTemplateByRole,
    getAllTaskTemplateByUser,
    getTaskTemplateById,
    addTaskTemplate,
    editTaskTemplate,
    _delete
};

// Get all tasktemplate
function getAll() {
    return dispatch => {
        dispatch(request());

        taskTemplateService.getAll()
            .then(
                tasktemplates => dispatch(success(tasktemplates)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: taskTemplateConstants.GETALL_TEMPLATE_REQUEST } }
    function success(tasktemplates) { return { type: taskTemplateConstants.GETALL_TEMPLATE_SUCCESS, tasktemplates } }
    function failure(error) { return { type: taskTemplateConstants.GETALL_TEMPLATE_FAILURE, error } }
}

// Get all task template by role
function getAllTaskTemplateByRole(id) {
    return dispatch => {
        dispatch(request(id));

        taskTemplateService.getAllTaskTemplateByRole(id)
            .then(
                tasktemplates => dispatch(success(tasktemplates)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: taskTemplateConstants.GETTEMPLATE_BYROLE_REQUEST, id } }
    function success(tasktemplates) { return { type: taskTemplateConstants.GETTEMPLATE_BYROLE_SUCCESS, tasktemplates } }
    function failure(error) { return { type: taskTemplateConstants.GETTEMPLATE_BYROLE_FAILURE, error } }
}

// Get all task template by user
function getAllTaskTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name="") {
    return dispatch => {
        dispatch(request());

        taskTemplateService.getAllTaskTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name)
            .then(
                tasktemplates => dispatch(success(tasktemplates)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: taskTemplateConstants.GETTEMPLATE_BYUSER_REQUEST} }
    function success(tasktemplates) { return { type: taskTemplateConstants.GETTEMPLATE_BYUSER_SUCCESS, tasktemplates } }
    function failure(error) { return { type: taskTemplateConstants.GETTEMPLATE_BYUSER_FAILURE, error } }
}

// Get task template by id
function getTaskTemplateById(id) {
    return dispatch => {
        dispatch(request(id));

        taskTemplateService.getById(id)
            .then(
                tasktemplate => dispatch(success(tasktemplate)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: taskTemplateConstants.GETTEMPLATE_BYID_REQUEST, id } }
    function success(tasktemplate) { return { type: taskTemplateConstants.GETTEMPLATE_BYID_SUCCESS, tasktemplate } }
    function failure(error) { return { type: taskTemplateConstants.GETTEMPLATE_BYID_FAILURE, error } }
}

// Add a new target of unit
function addTaskTemplate(taskTemplate) {
    return dispatch => {
        dispatch(request(taskTemplate));

        taskTemplateService.addNewTaskTemplate(taskTemplate)
            .then(
                taskTemplate => { 
                    dispatch(success(taskTemplate));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(taskTemplate) { return { type: taskTemplateConstants.ADDNEW_TEMPLATE_REQUEST, taskTemplate } }
    function success(taskTemplate) { return { type: taskTemplateConstants.ADDNEW_TEMPLATE_SUCCESS, taskTemplate } }
    function failure(error) { return { type: taskTemplateConstants.ADDNEW_TEMPLATE_FAILURE, error } }
}

// Edit a task template
function editTaskTemplate(id, taskTemplate) {
    return dispatch => {
        dispatch({type: taskTemplateConstants.EDIT_TEMPLATE_REQUEST});

        taskTemplateService.editTaskTemplate(id, taskTemplate).then(
            res => { 
                dispatch({ type: taskTemplateConstants.EDIT_TEMPLATE_SUCCESS, payload: res });
            },
            error => {
                dispatch({ type: taskTemplateConstants.EDIT_TEMPLATE_FAILURE });
            }
        );
    };
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        taskTemplateService.deleteTaskTemplateById(id)
            .then(
                taskTemplate => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: taskTemplateConstants.DELETE_TEMPLATE_REQUEST, id } }
    function success(id) { return { type: taskTemplateConstants.DELETE_TEMPLATE_SUCCESS, id } }
    function failure(id, error) { return { type: taskTemplateConstants.DELETE_TEMPLATE_FAILURE, id, error } }
}