import { ChangeRequestServices } from './services';
import { ChangeRequestConstants } from './constants';

export const ChangeRequestActions = {
    createProjectChangeRequestDispatch,
    updateStatusProjectChangeRequestDispatch,
    getListProjectChangeRequestsDispatch,
}

function createProjectChangeRequestDispatch(changeRequest) {
    return (dispatch) => {
        dispatch({ type: ChangeRequestConstants.CREATE_PROJECT_CHANGE_REQUEST });
        ChangeRequestServices.createProjectChangeRequestAPI(changeRequest)
            .then((res) => {
                dispatch({
                    type: ChangeRequestConstants.CREATE_PROJECT_CHANGE_REQUEST_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ChangeRequestConstants.CREATE_PROJECT_CHANGE_REQUEST_FAILE });
            });
    };
}

function getListProjectChangeRequestsDispatch(data) {
    if (data.calledId === 'paginate') {
        return (dispatch) => {
            dispatch({ type: ChangeRequestConstants.GET_PAGINATE_LIST_PROJECT_CHANGE_REQUESTS });
            ChangeRequestServices.getListProjectChangeRequestsAPI(data)
                .then((res) => {
                    dispatch({
                        type: ChangeRequestConstants.GET_PAGINATE_LIST_PROJECT_CHANGE_REQUESTS_SUCCESS,
                        payload: res.data.content,
                    });
                })
                .catch((err) => {
                    dispatch({ type: ChangeRequestConstants.GET_PAGINATE_LIST_PROJECT_CHANGE_REQUESTS_FAILE });
                });
        };
    }
    return (dispatch) => {
        dispatch({ type: ChangeRequestConstants.GET_LIST_PROJECT_CHANGE_REQUESTS });
        ChangeRequestServices.getListProjectChangeRequestsAPI(data)
            .then((res) => {
                dispatch({
                    type: ChangeRequestConstants.GET_LIST_PROJECT_CHANGE_REQUESTS_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ChangeRequestConstants.GET_LIST_PROJECT_CHANGE_REQUESTS_FAILE });
            });
    };
}

function updateStatusProjectChangeRequestDispatch(data) {
    return (dispatch) => {
        dispatch({ type: ChangeRequestConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST });
        ChangeRequestServices.updateStatusProjectChangeRequestAPI(data)
            .then((res) => {
                dispatch({
                    type: ChangeRequestConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ChangeRequestConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST_FAILE });
            });
    };
}
