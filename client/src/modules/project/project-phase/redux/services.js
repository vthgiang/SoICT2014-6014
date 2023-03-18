import { sendRequest } from "../../../../helpers/requestHelper";

export const ProjectPhaseServices = {
    getPhaseById,
    createPhase,
    editPhase,
    deletePhase,
    createMilestone,
    editMilestone,
    deleteMilestone,
    getMilestonesByProject,
    getPhasesByProject,
}

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

/**
 * lấy dữ liệu các cột mốc
 * @param {*} data dữ liệu về cột mốc cần tìm
 * @param {*} status trạng thái thực hiện
 * @param {*} name tên cột mốc
 * @param {*} priority độ ưu tiên
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate ngày kết thúc
 * @param {*} responsibleEmployees nhân viên thực hiện
 * @param {*} accountableEmployees nhận viên phê duyệt
 * @param {*} creatorEmployees người tạo cột mốc
 * @param {*} preceedingTasks công việc tiền nhiệm
 * @param {*} preceedingMilestones cột mốc tiền nhiệm
 * @param {*} projectId id của dự án
 * @param {*} page số trang
 * @param {*} perPage số bản ghi trên trang
 * @param {*} callId có lấy tất cả các cột mốc thuộc dự án hay không
 */

function getMilestonesByProject(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project-milestone`,
            method: "GET",
            params : data,
        },
        false,
        true,
        "project"
    );
};

/**
 * lấy dữ liệu các giai đoạn
 * @param {*} data dữ liệu về giai đoạn cần tìm
 * @param {*} status trạng thái thực hiện
 * @param {*} name tên giai đoạn
 * @param {*} priority độ ưu tiên
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate ngày kết thúc
 * @param {*} responsibleEmployees nhân viên thực hiện
 * @param {*} accountableEmployees nhận viên phê duyệt
 * @param {*} creatorEmployees người tạo giai đoạn
 * @param {*} projectId id của dự án
 * @param {*} page số trang
 * @param {*} perPage số bản ghi trên trang
 * @param {*} callId có lấy tất cả các giai đoạn thuộc dự án hay không
 */

function getPhasesByProject(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project-phase`,
            method: "GET",
            params : data,
        },
        false,
        true,
        "project"
    );
};