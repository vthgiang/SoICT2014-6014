import {
    DisciplineConstants
} from "./constants";
import {
    DisciplineService
} from "./services";
export const DisciplineActions = {
    getListDiscipline,
    createNewDiscipline,
    deleteDiscipline,
    updateDiscipline,
    getListPraise,
    createNewPraise,
    deletePraise,
    updatePraise,
};

// lấy danh sách kỷ luật
function getListDiscipline(data) {
    return dispatch => {
        dispatch(request());

        DisciplineService.getListDiscipline(data)
            .then(
                listDiscipline => dispatch(success(listDiscipline)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: DisciplineConstants.GET_DISCIPLINE_REQUEST,
        };
    };

    function success(listDiscipline) {
        return {
            type: DisciplineConstants.GET_DISCIPLINE_SUCCESS,
            listDiscipline
        };
    };

    function failure(error) {
        return {
            type: DisciplineConstants.GET_DISCIPLINE_FAILURE,
            error
        };
    };
}

// tạo mới thông tin kỷ luật của nhân viên
function createNewDiscipline(newDiscipline) {
    return dispatch => {
        dispatch(request(newDiscipline));

        DisciplineService.createNewDiscipline(newDiscipline)
            .then(
                newDiscipline => dispatch(success(newDiscipline)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(newDiscipline) {
        return {
            type: DisciplineConstants.CREATE_DISCIPLINE_REQUEST,
            newDiscipline
        };
    };

    function success(newDiscipline) {
        return {
            type: DisciplineConstants.CREATE_DISCIPLINE_SUCCESS,
            newDiscipline
        };
    };

    function failure(error) {
        return {
            type: DisciplineConstants.CREATE_DISCIPLINE_FAILURE,
            error
        };
    };
}

// Xoá thông tin kỷ luật của nhân viên
function deleteDiscipline(id) {
    return dispatch => {
        dispatch(request());

        DisciplineService.deleteDiscipline(id)
            .then(
                disciplineDelete => dispatch(success(disciplineDelete)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: DisciplineConstants.DELETE_DISCIPLINE_REQUEST,
        };
    };

    function success(disciplineDelete) {
        return {
            type: DisciplineConstants.DELETE_DISCIPLINE_SUCCESS,
            disciplineDelete
        };
    };

    function failure(error) {
        return {
            type: DisciplineConstants.DELETE_DISCIPLINE_FAILURE,
            error
        };
    };
}

// cập nhật thông tin kỷ luật của nhân viên
function updateDiscipline(id, infoDiscipline) {
    return dispatch => {
        dispatch(request());

        DisciplineService.updateDiscipline(id, infoDiscipline)
            .then(
                infoDiscipline => dispatch(success(infoDiscipline)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: DisciplineConstants.UPDATE_DISCIPLINE_REQUEST,
        };
    };

    function success(infoDiscipline) {
        return {
            type: DisciplineConstants.UPDATE_DISCIPLINE_SUCCESS,
            infoDiscipline
        };
    };

    function failure(error) {
        return {
            type: DisciplineConstants.UPDATE_DISCIPLINE_FAILURE,
            error
        };
    };
}





// lấy danh sách khen thưởng
function getListPraise(data) {
    return dispatch => {
        dispatch(request());

        DisciplineService.getListPraise(data)
            .then(
                listPraise => dispatch(success(listPraise)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: DisciplineConstants.GET_PRAISE_REQUEST,
        };
    };

    function success(listPraise) {
        return {
            type: DisciplineConstants.GET_PRAISE_SUCCESS,
            listPraise
        };
    };

    function failure(error) {
        return {
            type: DisciplineConstants.GET_PRAISE_FAILURE,
            error
        };
    };
}

// tạo mới thông tin khen thưởng
function createNewPraise(newPraise) {
    return dispatch => {
        dispatch(request(newPraise));

        DisciplineService.createNewPraise(newPraise)
            .then(
                newPraise => dispatch(success(newPraise)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(newPraise) {
        return {
            type: DisciplineConstants.CREATE_PRAISE_REQUEST,
            newPraise
        };
    };

    function success(newPraise) {
        return {
            type: DisciplineConstants.CREATE_PRAISE_SUCCESS,
            newPraise
        };
    };

    function failure(error) {
        return {
            type: DisciplineConstants.CREATE_PRAISE_FAILURE,
            error
        };
    };
}

// Xoá một chương trình đào tạo
function deletePraise(id) {
    return dispatch => {
        dispatch(request());

        DisciplineService.deletePraise(id)
            .then(
                praiseDelete => dispatch(success(praiseDelete)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: DisciplineConstants.DELETE_PRAISE_REQUEST,
        };
    };

    function success(praiseDelete) {
        return {
            type: DisciplineConstants.DELETE_PRAISE_SUCCESS,
            praiseDelete
        };
    };

    function failure(error) {
        return {
            type: DisciplineConstants.DELETE_PRAISE_FAILURE,
            error
        };
    };
}

// cập nhật thông tin của chương trình đào tạo
function updatePraise(id, infoPraise) {
    return dispatch => {
        dispatch(request());

        DisciplineService.updatePraise(id, infoPraise)
            .then(
                infoPraise => dispatch(success(infoPraise)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: DisciplineConstants.UPDATE_PRAISE_REQUEST,
        };
    };

    function success(infoPraise) {
        return {
            type: DisciplineConstants.UPDATE_PRAISE_SUCCESS,
            infoPraise
        };
    };

    function failure(error) {
        return {
            type: DisciplineConstants.UPDATE_PRAISE_FAILURE,
            error
        };
    };
}