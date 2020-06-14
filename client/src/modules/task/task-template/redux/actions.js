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
    getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany,
    _delete
};

// Get all tasktemplate
function getAll() {
    return dispatch => {
        dispatch({ type: taskTemplateConstants.GETALL_TEMPLATE_REQUEST } );

        taskTemplateService.getAll()
            .then(
                res => dispatch({ type: taskTemplateConstants.GETALL_TEMPLATE_SUCCESS, payload: res.data }),
                error => dispatch({ type: taskTemplateConstants.GETALL_TEMPLATE_FAILURE})
            );
    };
}

// Get all task template by role
function getAllTaskTemplateByRole(id) {
    return dispatch => {
        dispatch({ type: taskTemplateConstants.GETTEMPLATE_BYROLE_REQUEST, id });

        taskTemplateService.getAllTaskTemplateByRole(id)
            .then(
                res => dispatch({ type: taskTemplateConstants.GETTEMPLATE_BYROLE_SUCCESS, payload: res.data }),
                error => dispatch({ type: taskTemplateConstants.GETTEMPLATE_BYROLE_FAILURE})
            );
    };
}

// Get all task template by user
function getAllTaskTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name="") {
    return dispatch => {
        dispatch({ type: taskTemplateConstants.GETTEMPLATE_BYUSER_REQUEST});

        taskTemplateService.getAllTaskTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name).then(
            res => dispatch({ type: taskTemplateConstants.GETTEMPLATE_BYUSER_SUCCESS, payload: res.data}),
            error => dispatch({ type: taskTemplateConstants.GETTEMPLATE_BYUSER_FAILURE})
        );
    };
}

// Get task template by id
function getTaskTemplateById(id) {
    return dispatch => {
        dispatch({ type: taskTemplateConstants.GETTEMPLATE_BYID_REQUEST});

        taskTemplateService.getById(id).then(
            res => dispatch({ type: taskTemplateConstants.GETTEMPLATE_BYID_SUCCESS, payload: res.data }),
            error => dispatch({ type: taskTemplateConstants.GETTEMPLATE_BYID_FAILURE})
        );
    };
}

// Add a new target of unit
function addTaskTemplate(taskTemplate) {
    return dispatch => {
        dispatch({ type: taskTemplateConstants.ADDNEW_TEMPLATE_REQUEST } );

        taskTemplateService.addNewTaskTemplate(taskTemplate).then(
            res => dispatch({ type: taskTemplateConstants.ADDNEW_TEMPLATE_SUCCESS, payload: res.data }),
            error =>  dispatch({ type: taskTemplateConstants.ADDNEW_TEMPLATE_FAILURE})
        );
    };
}

// Edit a task template
function editTaskTemplate(id, taskTemplate) {
    return dispatch => {
        dispatch({type: taskTemplateConstants.EDIT_TEMPLATE_REQUEST});

        taskTemplateService.editTaskTemplate(id, taskTemplate).then(
            res => dispatch({ type: taskTemplateConstants.EDIT_TEMPLATE_SUCCESS, payload: res.data}),
            error => dispatch({ type: taskTemplateConstants.EDIT_TEMPLATE_FAILURE })
        );
    };
}

// Lấy người dùng các đơn vị con của một đơn vị và trong đơn vị đó
function getChildrenOfOrganizationalUnitsAsTree(unitId) {
    return dispatch => {
        dispatch({type: taskTemplateConstants.GET_ALL_USERS_OF_UNIT_AND_ITS_SUB_UNITS_REQUEST});
 
        taskTemplateService.getChildrenOfOrganizationalUnitsAsTree(unitId)
            .then(res=>{ 
                dispatch({
                    type: taskTemplateConstants.GET_ALL_USERS_OF_UNIT_AND_ITS_SUB_UNITS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskTemplateConstants.GET_ALL_USERS_OF_UNIT_AND_ITS_SUB_UNITS_FAILURE,
                    payload: error
                })
            })
    };
}
// Lấy người dùng trong các đơn vị của 1 công ty
function getAllUserInAllUnitsOfCompany() {
    return dispatch => {
        dispatch({type: taskTemplateConstants.GET_ALL_USERS_IN_UNITS_OF_COMPANY_REQUEST});
 
        taskTemplateService.getAllUserInAllUnitsOfCompany()
            .then(res=>{ 
                dispatch({
                    type: taskTemplateConstants.GET_ALL_USERS_IN_UNITS_OF_COMPANY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskTemplateConstants.GET_ALL_USERS_IN_UNITS_OF_COMPANY_FAILURE,
                    payload: error
                })
            })
    };
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch({ type: taskTemplateConstants.DELETE_TEMPLATE_REQUEST});

        taskTemplateService.deleteTaskTemplateById(id).then(
            res => dispatch({ type: taskTemplateConstants.DELETE_TEMPLATE_SUCCESS, payload: res.data }),
            error => dispatch({ type: taskTemplateConstants.DELETE_TEMPLATE_FAILURE})
        );
    };
}