import {
    SabbaticalConstants
} from "./constants";
import {
    SabbaticalService
} from "./services";
export const SabbaticalActions = {
    getListSabbatical,
    createNewSabbatical,
    deleteSabbatical,
    updateSabbatical,
};

// lấy danh sách nghỉ phép
function getListSabbatical(data) {
    return dispatch => {
        dispatch(request());

        SabbaticalService.getListSabbatical(data)
            .then(
                listSabbatical => dispatch(success(listSabbatical)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: SabbaticalConstants.GET_SABBATICAL_REQUEST,
        };
    };

    function success(listSabbatical) {
        return {
            type: SabbaticalConstants.GET_SABBATICAL_SUCCESS,
            listSabbatical
        };
    };

    function failure(error) {
        return {
            type: SabbaticalConstants.GET_SABBATICAL_FAILURE,
            error
        };
    };
}

// tạo mới thông tin nghỉ phép
function createNewSabbatical(newSabbatical) {
    return dispatch => {
        dispatch(request(newSabbatical));

        SabbaticalService.createNewSabbatical(newSabbatical)
            .then(
                newSabbatical => dispatch(success(newSabbatical)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(newSabbatical) {
        return {
            type: SabbaticalConstants.CREATE_SABBATICAL_REQUEST,
            newSabbatical
        };
    };

    function success(newSabbatical) {
        return {
            type: SabbaticalConstants.CREATE_SABBATICAL_SUCCESS,
            newSabbatical
        };
    };

    function failure(error) {
        return {
            type: SabbaticalConstants.CREATE_SABBATICAL_FAILURE,
            error
        };
    };
}

// Xoá thông tin nghỉ phép của nhân viên
function deleteSabbatical(id) {
    return dispatch => {
        dispatch(request());

        SabbaticalService.deleteSabbatical(id)
            .then(
                sabbaticalDelete => dispatch(success(sabbaticalDelete)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: SabbaticalConstants.DELETE_SABBATICAL_REQUEST,
        };
    };

    function success(sabbaticalDelete) {
        return {
            type: SabbaticalConstants.DELETE_SABBATICAL_SUCCESS,
            sabbaticalDelete
        };
    };

    function failure(error) {
        return {
            type: SabbaticalConstants.DELETE_SABBATICAL_FAILURE,
            error
        };
    };
}

// cập nhật thông tin nghỉ phép của nhân viên
function updateSabbatical(id, infoSabbatical) {
    return dispatch => {
        dispatch(request());

        SabbaticalService.updateSabbatical(id, infoSabbatical)
            .then(
                infoSabbatical => dispatch(success(infoSabbatical)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: SabbaticalConstants.UPDATE_SABBATICAL_REQUEST,
        };
    };

    function success(infoSabbatical) {
        return {
            type: SabbaticalConstants.UPDATE_SABBATICAL_SUCCESS,
            infoSabbatical
        };
    };

    function failure(error) {
        return {
            type: SabbaticalConstants.UPDATE_SABBATICAL_FAILURE,
            error
        };
    };
}
