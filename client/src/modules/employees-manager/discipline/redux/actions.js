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
function deleteDiscipline(employeeNumber, number) {
    return dispatch => {
        dispatch(request(employeeNumber, number));

        DisciplineService.deleteDiscipline(employeeNumber, number)
            .then(
                disciplineDelete => dispatch(success(disciplineDelete)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(employeeNumber, number) {
        return {
            type: DisciplineConstants.DELETE_DISCIPLINE_REQUEST,
            employeeNumber,
            number
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
function updateDiscipline(employeeNumber, number, infoDiscipline) {
    return dispatch => {
        dispatch(request(employeeNumber, number));

        DisciplineService.updateDiscipline(employeeNumber, number, infoDiscipline)
            .then(
                infoDiscipline => dispatch(success(infoDiscipline)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(employeeNumber, number) {
        return {
            type: DisciplineConstants.UPDATE_DISCIPLINE_REQUEST,
            employeeNumber,
            number
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
function deletePraise(employeeNumber, number) {
    return dispatch => {
        dispatch(request(employeeNumber, number));

        DisciplineService.deletePraise(employeeNumber, number)
            .then(
                praiseDelete => dispatch(success(praiseDelete)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(employeeNumber, number) {
        return {
            type: DisciplineConstants.DELETE_PRAISE_REQUEST,
            employeeNumber,
            number
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
function updatePraise(employeeNumber, number, infoPraise) {
    return dispatch => {
        dispatch(request(employeeNumber, number));

        DisciplineService.updatePraise(employeeNumber, number, infoPraise)
            .then(
                infoPraise => dispatch(success(infoPraise)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(employeeNumber, number) {
        return {
            type: DisciplineConstants.UPDATE_PRAISE_REQUEST,
            employeeNumber,
            number
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