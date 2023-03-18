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
        preceedingMilestones: data.preceedingMilestones,
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
 * Lấy thông tin giai đoạn trong 1 dự án
 * @param {*} data id
 */
 exports.getProjectPhase = async (portal, data) => {
    let { perPage, page, status, priority, name, projectId, startDate, endDate, responsibleEmployees, accountableEmployees, creatorEmployees, calledId } = data;
    let phases;

    let keySearch = {};
    let keySearchDateTime = {};

    // Tìm kiếm giai đoạn theo dự án
    if (projectId) {
        keySearch = {
            ...keySearch,
            project: projectId,
        }
    }

    // Tìm kiếm giai đoạn theo trạng thái
    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    // Tìm kiếm giai đoạn theo độ ưu tiên
    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    // Tìm kiếm giai đoạn theo tên
    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    // Tìm kiếm theo người thực hiện
    if (responsibleEmployees) {
        const responsible = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: responsibleEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: responsibleEmployees,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdResponsible = responsible && responsible.length > 0 ? responsible.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            responsibleEmployees: {
                $in: getIdResponsible
            }
        }
    }

    // Tìm kiếm theo người phê duyệt
    if (accountableEmployees) {
        const accountable = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: accountableEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: accountableEmployees,
                        $options: "i",
                    }
                }
            ]
        })
        const getIdAccountable = accountable && accountable.length > 0 ? accountable.map(o => o._id) : [];
        keySearch = {
            ...keySearch,
            accountableEmployees: {
                $in: getIdAccountable
            }
        }
    }

    // Tìm kiếm theo người thiết lập
    if (creatorEmployees) {
        const creator = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: creatorEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: creatorEmployees,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdCreator = creator && creator.length > 0 ? creator.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            creator: {
                $in: getIdCreator
            }
        }
    }

    // Tìm kiếm theo ngày bắt đầu, kết thúc
    if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySearchDateTime = {
            ...keySearchDateTime,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }

    else if (startDate) {
        startDate = new Date(startDate);

        keySearch = {
            ...keySearch,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, startDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, startDate.getFullYear()]
                    }
                }
            ]
        }
    }

    else if (endDate) {
        endDate = new Date(endDate);

        keySearch = {
            ...keySearch,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, endDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, endDate.getFullYear()]
                    }
                }
            ]
        }
    }

    let optionQuery = {
        $and: [
            keySearch,
            keySearchDateTime,
        ]
    }

    let totalList = await ProjectPhase(connect(DB_CONNECTION, portal)).countDocuments(optionQuery);

    // Nếu calledId là 'get_all' thì bỏ qua page và perPage
    if (calledId === 'get_all') {
        phases = await ProjectPhase(connect(DB_CONNECTION, portal)).find(optionQuery).sort({ createdAt: -1 })
            .populate({ path: "responsibleEmployees", select: "_id name" })
            .populate({ path: "accountableEmployees", select: "_id name" })
            .populate({ path: "consultedEmployees", select: "_id name" })
            .populate({ path: "informedEmployees", select: "_id name" })
            .populate({ path: "creator", select: "_id name" })
    }

    else {
        phases = await ProjectPhase(connect(DB_CONNECTION, portal))
            .find(optionQuery).sort({ createdAt: -1 }).skip((Number(page) - 1) * Number(perPage)).limit(Number(perPage))
            .populate({ path: "responsibleEmployees", select: "_id name" })
            .populate({ path: "accountableEmployees", select: "_id name" })
            .populate({ path: "consultedEmployees", select: "_id name" })
            .populate({ path: "informedEmployees", select: "_id name" })
            .populate({ path: "creator", select: "_id name" })
    }

    return {
        docs: phases,
        totalDocs: totalList,
    }
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
 * Lấy thông tin cột mốc trong 1 dự án
 * @param {*} data
 */
exports.getProjectMilestone = async (portal, data) => {
    let { perPage, page, status, priority, name, preceedingTasks, preceedingMilestones, projectId, startDate, endDate, responsibleEmployees, accountableEmployees, creatorEmployees, calledId } = data;
    let milestones;

    let keySearch = {};
    let keySearchDateTime = {};

    // Tìm kiếm cột mốc theo dự án
    if (projectId) {
        keySearch = {
            ...keySearch,
            project: projectId,
        }
    }

    // Tìm kiếm cột mốc theo trạng thái
    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    // Tìm kiếm cột mốc theo độ ưu tiên
    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    // Tìm kiếm cột mốc theo tên
    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    // Tìm kiếm cột mốc theo tên công việc tiền nhiệm
    if (preceedingTasks) {
        const predecessor = await Task(connect(DB_CONNECTION, portal)).find({
            name: {
                $regex: preceedingTasks,
                $options: "i",
            }
        })

        const getIdPredecessor = predecessor && predecessor.length > 0 ? predecessor.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            "preceedingTasks.task": {
                $in: getIdPredecessor
            }
        }
    }

     // Tìm kiếm cột mốc theo tên cột mốc tiền nhiệm
     if (preceedingMilestones) {
        const predecessor = await ProjectMilestone(connect(DB_CONNECTION, portal)).find({
            name: {
                $regex: preceedingMilestones,
                $options: "i",
            }
        })

        const getIdPredecessor = predecessor && predecessor.length > 0 ? predecessor.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            preceedingMilestones: {
                $in: getIdPredecessor
            }
        }
    }

    // Tìm kiếm theo người thực hiện
    if (responsibleEmployees) {
        const responsible = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: responsibleEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: responsibleEmployees,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdResponsible = responsible && responsible.length > 0 ? responsible.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            responsibleEmployees: {
                $in: getIdResponsible
            }
        }
    }

    // Tìm kiếm theo người phê duyệt
    if (accountableEmployees) {
        const accountable = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: accountableEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: accountableEmployees,
                        $options: "i",
                    }
                }
            ]
        })
        const getIdAccountable = accountable && accountable.length > 0 ? accountable.map(o => o._id) : [];
        keySearch = {
            ...keySearch,
            accountableEmployees: {
                $in: getIdAccountable
            }
        }
    }

    // Tìm kiếm theo người thiết lập
    if (creatorEmployees) {
        const creator = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: creatorEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: creatorEmployees,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdCreator = creator && creator.length > 0 ? creator.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            creator: {
                $in: getIdCreator
            }
        }
    }

    // Tìm kiếm theo ngày bắt đầu, kết thúc
    if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySearchDateTime = {
            ...keySearchDateTime,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }

    else if (startDate) {
        startDate = new Date(startDate);

        keySearch = {
            ...keySearch,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, startDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, startDate.getFullYear()]
                    }
                }
            ]
        }
    }

    else if (endDate) {
        endDate = new Date(endDate);

        keySearch = {
            ...keySearch,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, endDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, endDate.getFullYear()]
                    }
                }
            ]
        }
    }

    let optionQuery = {
        $and: [
            keySearch,
            keySearchDateTime,
        ]
    }

    let totalList = await ProjectMilestone(connect(DB_CONNECTION, portal)).countDocuments(optionQuery);

    // Nếu calledId là 'get_all' thì bỏ qua page và perPage
    if (calledId === 'get_all') {
        milestones = await ProjectMilestone(connect(DB_CONNECTION, portal)).find(optionQuery).sort({ createdAt: -1 })
            .populate({ path: "responsibleEmployees", select: "_id name" })
            .populate({ path: "accountableEmployees", select: "_id name" })
            .populate({ path: "consultedEmployees", select: "_id name" })
            .populate({ path: "informedEmployees", select: "_id name" })
            .populate({ path: "creator", select: "_id name" })
    }

    else {
        milestones = await ProjectMilestone(connect(DB_CONNECTION, portal))
            .find(optionQuery).sort({ createdAt: -1 }).skip((Number(page) - 1) * Number(perPage)).limit(Number(perPage))
            .populate({ path: "responsibleEmployees", select: "_id name" })
            .populate({ path: "accountableEmployees", select: "_id name" })
            .populate({ path: "consultedEmployees", select: "_id name" })
            .populate({ path: "informedEmployees", select: "_id name" })
            .populate({ path: "creator", select: "_id name" })
    }

    return {
        docs: milestones,
        totalDocs: totalList,
    }
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
            preceedingMilestones: data.preceedingMilestones,
        }
    }, { new: true });

    // Cập nhật lại thông tin về cột mốc
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