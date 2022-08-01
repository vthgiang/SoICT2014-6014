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
 * @param {*} data 
 */
exports.create = async (portal, data) => {
    let phase = await ProjectPhase(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        description: data.description,
        project: data.project,
        budget: data.estimateCost,
        startDate:data.startDate,
        creator: data.creator,
        endDate: data.endDate,
    })

    if (data.listTask && data.listTask.length > 0) {
        let newTaskOfPhase = await Task(connect(DB_CONNECTION, portal)).updateMany({ _id: { $in: data.listTask }}, { taskPhase: phase._id });
    }

    phase = await ProjectPhase(connect(DB_CONNECTION, portal)).findById(phase._id)
        .populate({ path: "creator", select: "_id name email" })
    return phase;
}

/**
 * Lấy thông tin toàn bộ giai đoạn trong 1 dự án
 * @param {*} id id của project
 */
 exports.getProjectPhase = async (portal, id) => {
    let phases = await ProjectPhase(connect(DB_CONNECTION, portal)).find({
        project: id
    }).populate({ path: "creator", select: "_id name email" })
    return phases;

}

/**
 * Lấy thông tin của 1 giai đoạn
 * @param {*} id id của giai đoạn
 * @param {*} userId id của người sử dụng
 */
exports.get = async (portal, id, userId) => {
    let phase = await ProjectPhase(connect(DB_CONNECTION, portal)).findById(id).populate({ path: "creator", select: "_id name email" });
    return phase;
}

/**
 * Thay đổi thông tin của 1 giai đoạn
 * @param {*} id của giai đoạn
 * @param {*} data dữ liệu cần cập nhật
 */
exports.editPhase = async (portal, id, data) => {
    const a = await ProjectPhase(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description,
            progress: data.progress,
            status: data.status,
            budget: data.estimateCost,
        }
    }, { new: true });

    // Cập nhật lại thông tin về giai đoạn của các task
    const phase = await ProjectPhase(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: "creator", select: "_id name email" });
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