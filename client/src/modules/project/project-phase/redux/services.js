import { sendRequest } from "../../../../helpers/requestHelper";

export const ProjectPhaseServices = {
    getAllPhaseByProject,
    getPhaseById,
    createPhase,
    editPhase,
    deletePhase,
    createMilestone,
    editMilestone,
    deleteMilestone,
    getAllMilestoneByProject,
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

/**
 * thêm mới 1 cột mốc
 * @param {*} data dữ liệu về cột mốc
 */
function createMilestone(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project-milestone`,
            method: "POST",
            data: data,
        },
        true,
        true,
        "project"
    );
};

/**
 * chỉnh sửa thông tin cột mốc
 * @param {*} id id của cột mốc
 * @param {*} milestone thông tin cần cập nhật
 */
function editMilestone(id, milestone) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project-milestone/${id}`,
            method: "PATCH",
            data: milestone,
        },
        true,
        true,
        "project"
    );
};

/**
 * lấy toàn bộ cột mốc thuộc dự án
 * @param {*} id id của dự án
 */
function getAllMilestoneByProject(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project/project-milestone/${id}`,
            method: "GET",
        },
        false,
        true,
        "project"
    );
};

/**
 * xoá thông tin cột mốc
 * @param {*} id id của cột mốc
 */
function deleteMilestone(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project-milestone/${id}`,
            method: "DELETE",
        },
        true,
        true,
        "project"
    );
}