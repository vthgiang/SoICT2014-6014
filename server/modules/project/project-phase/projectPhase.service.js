const {
    Project,
    Role,
    UserRole,
    OrganizationalUnit,
    Employee,
    User,
    Salary,
    Task,
    ProjectChangeRequest,
    ProjectPhase,
    ProjectMilestone,
} = require('../../../models');
const arrayToTree = require("array-to-tree");
const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;
const { connect, } = require(`../../../helpers/dbHelper`);
const { dateParse } = require(`../../../helpers/functionHelper`);
const moment = require('moment');
const { createProjectTask } = require('../../task/task-management/task.service');

const MILISECS_TO_DAYS = 86400000;

/**
 * Hàm hỗ trợ lấy số tuần trong 1 tháng
*/
const getAmountOfWeekDaysInMonth = (date) => {
    let result = 0;
    for (var i = 1; i < 6; i++) {
        date.date(1);
        var dif = (7 + (i - date.weekday())) % 7 + 1;
        result += Math.floor((date.daysInMonth() - dif) / 7) + 1;
    }
    return result;
}

/**
 * Tạo giai đoạn mới trong dự án
 * @param {*} data 
 */
exports.createCPMProjectPhase = async (portal, data) => {
    let phaseList = [];
    if (!Array.isArray(data.phaseList)) {
        phaseList.push(phaseList);
    }
    else phaseList = [...data.phaseList];

    if (phaseList && phaseList.length > 0) {
        phaseList = phaseList.map(phase => {
            return {
                subject: phase.subject,
                name: phase.name,
                project: phase.project,
                description: phase.description,
                startDate: phase.startDate,
                endDate: phase.endDate,
                creator: phase.creator,
                responsibleEmployees: phase.responsibleEmployees,
                accountableEmployees: phase.accountableEmployees,
                consultedEmployees: phase.consultedEmployees,
                informedEmployees: phase.informedEmployees,
                budget: phase.estimateCost,
            }
        })
    }

    let phases = await ProjectPhase(connect(DB_CONNECTION, portal)).insertMany(phaseList)
    let phaseIds = phases.map(phase => {
        return phase._id
    })

    phases = await ProjectPhase(connect(DB_CONNECTION, portal)).find({ _id: { $in: phaseIds } })
        .populate({ path: "creator", select: "_id name email" })
    return phases;
}

/**
 * Tạo 1 giai đoạn mới trong dự án
 * @param {*} data dữ liệu về giai đoạn
 */
exports.createPhase = async (portal, data) => {
    let phase = await ProjectPhase(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        description: data.description,
        project: data.project,
        budget: data.estimateCost,
        startDate:data.startDate,
        creator: data.creator,
        priority: data.priority,
        responsibleEmployees: data.responsibleEmployees, 
        accountableEmployees: data.accountableEmployees, 
        consultedEmployees: data.consultedEmployees,
        informedEmployees: data.informedEmployees,
        confirmedByEmployees: data.responsibleEmployees.concat(data.accountableEmployees).concat(data.consultedEmployees).includes(data.creator) ? [data.creator] : [],
        endDate: data.endDate,
    })

    if (data.listTask && data.listTask.length > 0) {
        let newTaskOfPhase = await Task(connect(DB_CONNECTION, portal)).updateMany({ _id: { $in: data.listTask }}, { taskPhase: phase._id });
    }

    phase = await ProjectPhase(connect(DB_CONNECTION, portal)).findById(phase._id)
        .populate({ path: "creator", select: "_id name email" })
        .populate({ path: "responsibleEmployees", select: "_id name" })
        .populate({ path: "accountableEmployees", select: "_id name" })
        .populate({ path: "consultedEmployees", select: "_id name" })
        .populate({ path: "informedEmployees", select: "_id name" });
    return phase;
}

/**
 * Tạo 1 cột mốc trong dự án
 * @param {*} data dữ liệu của cột mốc
 */
exports.createMilestone = async (portal, data) => {
    let milestone = await ProjectMilestone(connect(DB_CONNECTION, portal)).create({
        ...data,
        projectPhase: data.projectPhase,
        name: data.name,
        description: data.description,
        priority: data.priority,
        responsibleEmployees: data.responsibleEmployees,
        accountableEmployees: data.accountableEmployees,
        consultedEmployees: data.consultedEmployees,
        informedEmployees: data.informedEmployees,
        confirmedByEmployees: data.responsibleEmployees.concat(data.accountableEmployees).concat(data.consultedEmployees).includes(data.creator) ? [data.creator] : [],
        preceedingTasks: data.preceedingTasks,
        project: data.project,
        startDate: data.startDate,
        creator: data.creator,
        endDate: data.endDate,
    })

    milestone = await ProjectMilestone(connect(DB_CONNECTION, portal)).findById(milestone._id)
        .populate({ path: "creator", select: "_id name email" })
        .populate({ path: "responsibleEmployees", select: "_id name" })
        .populate({ path: "accountableEmployees", select: "_id name" })
        .populate({ path: "consultedEmployees", select: "_id name" })
        .populate({ path: "informedEmployees", select: "_id name" });
    return milestone;
}

/**
 * Lấy thông tin toàn bộ giai đoạn trong 1 dự án
 * @param {*} id id của project
 */
 exports.getProjectPhase = async (portal, id) => {
    let phases = await ProjectPhase(connect(DB_CONNECTION, portal)).find({
        project: id
    }).populate({ path: "creator", select: "_id name email" })
    .populate({ path: "responsibleEmployees", select: "_id name" })
    .populate({ path: "accountableEmployees", select: "_id name" })
    .populate({ path: "consultedEmployees", select: "_id name" })
    .populate({ path: "informedEmployees", select: "_id name" });
    return phases;

}

/**
 * Lấy thông tin của 1 giai đoạn
 * @param {*} id id của giai đoạn
 * @param {*} userId id của người sử dụng
 */
exports.getPhase = async (portal, id, userId) => {
    let phase = await ProjectPhase(connect(DB_CONNECTION, portal)).findById(id)
    .populate({ path: "creator", select: "_id name email" })
    .populate({ path: "responsibleEmployees", select: "_id name" })
    .populate({ path: "accountableEmployees", select: "_id name" })
    .populate({ path: "consultedEmployees", select: "_id name" })
    .populate({ path: "informedEmployees", select: "_id name" });
    return phase;
}

/**
 * Thay đổi thông tin của 1 giai đoạn
 * @param {*} id của giai đoạn
 * @param {*} data dữ liệu cần cập nhật
 */
exports.editPhase = async (portal, id, data) => {
    data = {
        ...data,
        actualEndDate: data.status === "finished"? new Date(): undefined,
    }

    const a = await ProjectPhase(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            priority: data.priority,
            responsibleEmployees: data.responsibleEmployees, 
            accountableEmployees: data.accountableEmployees, 
            consultedEmployees: data.consultedEmployees,
            informedEmployees: data.informedEmployees,
            confirmedByEmployees: data.responsibleEmployees.concat(data.accountableEmployees).concat(data.consultedEmployees).includes(data.creator) ? [data.creator] : [],
            actualEndDate: data.actualEndDate,
            description: data.description,
            progress: data.progress,
            status: data.status,
            budget: data.estimateCost,
        }
    }, { new: true });

    // Cập nhật lại thông tin về giai đoạn của các task
    const phase = await ProjectPhase(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: "creator", select: "_id name email" })
        .populate({ path: "responsibleEmployees", select: "_id name" })
        .populate({ path: "accountableEmployees", select: "_id name" })
        .populate({ path: "consultedEmployees", select: "_id name" })
        .populate({ path: "informedEmployees", select: "_id name" });
    return phase;
}

/**
 * Xoá giai đoạn theo id
 * @param {*} id
*/
exports.deletePhase = async (portal, id) => {
    await ProjectPhase(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    return id;
}

/**
 * Lấy thông tin toàn bộ cột mốc trong 1 dự án
 * @param {*} id id của project
 */
exports.getProjectMilestone = async (portal, id) => {
    let milestones = await ProjectMilestone(connect(DB_CONNECTION, portal)).find({
        project: id
    }).populate({ path: "creator", select: "_id name email" })
    .populate({ path: "responsibleEmployees", select: "_id name" })
    .populate({ path: "accountableEmployees", select: "_id name" })
    .populate({ path: "consultedEmployees", select: "_id name" })
    .populate({ path: "informedEmployees", select: "_id name" });
    return milestones;
}

/**
 * Thay đổi thông tin của 1 cột mốc
 * @param {*} id của cột mốc
 * @param {*} data dữ liệu cần cập nhật
 */
exports.editMilestone = async (portal, id, data) => {
    data = {
        ...data,
        actualEndDate: data.status === "finished"? new Date(): undefined,
    }
    const a = await ProjectMilestone(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            actualEndDate: data.actualEndDate,
            description: data.description,
            progress: data.progress,
            status: data.status,
            priority: data.priority,
            projectPhase: data.projectPhase,
            responsibleEmployees: data.responsibleEmployees,
            accountableEmployees: data.accountableEmployees,
            consultedEmployees: data.consultedEmployees,
            informedEmployees: data.informedEmployees,
            preceedingTasks: data.preceedingTasks,
        }
    }, { new: true });

    // Cập nhật lại thông tin về giai đoạn của các task
    const milestone = await ProjectMilestone(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: "creator", select: "_id name email" })
        .populate({ path: "responsibleEmployees", select: "_id name" })
        .populate({ path: "accountableEmployees", select: "_id name" })
        .populate({ path: "consultedEmployees", select: "_id name" })
        .populate({ path: "informedEmployees", select: "_id name" });
    return milestone;
}

/**
 * Xoá cột mốc theo id
 * @param {*} id
*/
exports.deleteMilestone = async (portal, id) => {
    await ProjectMilestone(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    return id;
}