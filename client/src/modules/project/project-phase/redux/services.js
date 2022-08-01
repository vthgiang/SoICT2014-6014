import { sendRequest } from "../../../../helpers/requestHelper";

export const ProjectPhaseServices = {
    getAllPhaseByProject,
    getPhaseById,
    createPhase,
    editPhase,
    deletePhase
}

/**
 * lấy toàn bộ giai đoạn thuộc dự án
 * @param {*} id id của dự án
 */
function getAllPhaseByProject(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project/project-phase/${id}`,
            method: "GET",
        },
        false,
        true,
        "project"
    );
};

/**
 * lấy giai đoạn theo id
 * @param {*} id id của giai đoạn
 */
function getPhaseById(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project-phase/${id}`,
            method: "GET",
        },
        false,
        true,
        "project"
    );
};

/**
 * thêm mới 1 giai đoạn
 * @param {*} data dữ liệu về giai đoạn
 */
function createPhase(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project-phase`,
            method: "POST",
            data: data,
        },
        true,
        true,
        "project"
    );
};


/**
 * chỉnh sửa thông tin giai đoạn
 * @param {*} id id của giai đoạn
 * @param {*} phase thông tin cần cập nhật
 */
function editPhase(id, phase) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project-phase/${id}`,
            method: "PATCH",
            data: phase,
        },
        true,
        true,
        "project"
    );
};

/**
 * xoá thông tin giai đoạn
 * @param {*} id id của giai đoạn
 */
function deletePhase(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project-phase/${id}`,
            method: "DELETE",
        },
        true,
        true,
        "project"
    );
}