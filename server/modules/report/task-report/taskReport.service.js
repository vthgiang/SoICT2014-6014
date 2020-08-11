const mongoose = require("mongoose");
const { TaskReport, Task, TaskTemplate, Role, OrganizationalUnit, User } = require('../../../models').schema;


/**
 * Lấy ra danh sách các báo cáo công việc
 * @param  params 
 */
exports.getTaskReports = async (params) => {
    const nameSearch = params.name;
    const creatorSearch = params.creator;
    let dateSearch, month, year, startDate, endDate;
    if (params.month) {
        dateSearch = params.month.split('-');
        month = dateSearch[1], year = dateSearch[0];
        startDate = new Date(year, month - 1, 2);
        endDate = new Date(year, month - 1, 32);
    }

    let keySearch = {};

    if (nameSearch !== undefined && nameSearch.length !== 0) {
        keySearch = {
            ...keySearch,
            nameSearch: { $regex: params.name, $options: "i" },
        }
    }

    // Tìm kiếm theo người tạo
    if (creatorSearch !== undefined && creatorSearch.length !== 0) {
        keySearch = {
            ...keySearch,
            creatorSearch: { $regex: params.creator, $options: "i" },
        }
    }

    // Tìm kiếm theo tháng
    if (params.month !== undefined && params.month.length !== 0) {
        keySearch = {
            ...keySearch,
            createdAt: { $gte: startDate, $lte: endDate }
        }
    };

    let totalList = await TaskReport.countDocuments();
    let listTaskReport = await TaskReport.find(keySearch).sort({ 'createdAt': 'desc' })
        .skip(parseInt(params.page)).limit(parseInt(params.limit))
        .populate({ path: 'creator ', select: "_id name" })
        .populate({ path: 'taskTemplate' })
        .populate({ path: 'responsibleEmployees', select: '_id name company' })
        .populate({ path: 'accountableEmployees', select: '_id name company' })
        .populate({ path: 'organizationalUnit', select: 'deans viceDeans employees _id name company parent' })
        .populate({ path: 'readByEmployees' })

    return { totalList, listTaskReport };
}


/**
 * Lây 1 báo cáo 
 * @param {*} id id báo cáo
 */
exports.getTaskReportById = async (id) => {
    let taskReportById = await TaskReport.findById(id)
        .populate({ path: 'taskTemplate' })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'responsibleEmployees', select: '_id name company' })
        .populate({ path: 'accountableEmployees', select: '_id name company' })
        .populate({ path: 'readByEmployees', select: '_id name company' })
        .populate({ path: 'organizationalUnit', select: 'deans viceDeans employees _id name company parent' })
        .populate({ path: 'readByEmployees' })

    return taskReportById;
}


/**
 * Tạo mới một báo cáo
 * @param {*} data dữ liệu caần tạo
 * @param {*} user id người tạo
 */
exports.createTaskReport = async (data, user) => {
    // convert startDate từ string sang Date
    let startTime, start = null, endTime, end = null;
    if (data.startDate && data.endDate) {
        startTime = data.startDate.split("-");
        start = new Date(startTime[2], startTime[1] - 1, startTime[0]);

        // convert endDate từ string sang Date
        endTime = data.endDate.split("-");
        end = new Date(endTime[2], endTime[1] - 1, endTime[0]);
    }

    let statusConvert = Number(data.status);
    let frequencyConvert = data.frequency.toString();

    let configurations = [];
    for (let [index, value] of data.taskInformations.entries()) {
        configurations[index] = {
            code: value.code,
            name: value.name,
            type: value.type,
            filter: value.filter,
            newName: value.newName,
            charType: value.charType,
            showInReport: value.showInReport,
            aggregationType: value.aggregationType,
        }
    }

    let newTaskReport = await TaskReport.create({
        organizationalUnit: data.organizationalUnit,
        taskTemplate: data.taskTemplate,
        name: data.nameTaskReport,
        description: data.descriptionTaskReport,
        readByEmployees: data.readByEmployees,
        responsibleEmployees: data.responsibleEmployees,
        accountableEmployees: data.accountableEmployees,
        status: statusConvert,
        creator: user,
        startDate: start,
        endDate: end,
        frequency: frequencyConvert,
        configurations: configurations,

    })
    let getNewTaskReport = await TaskReport.findById(newTaskReport._id).populate({ path: 'creator', select: "_id name" });
    return getNewTaskReport;
}


/**
 * Sửa 1 báo cáo
 * @param {*} id id của báo cáo cần sửa
 * @param {*} data dữ liệu cần sửa 
 * @param {*} người sửa 
 */
exports.editTaskReport = async (id, data, user) => {
    let startTime, start = null, endTime, end = null;

    if (data.startDate && data.endDate) {
        // convert startDate từ string sang Date
        startTime = data.startDate.split("-");
        start = new Date(startTime[2], startTime[1] - 1, startTime[0]);

        // convert endDate từ string sang Date
        endTime = data.endDate.split("-");
        end = new Date(endTime[2], endTime[1] - 1, endTime[0]);
    } else
        if (data.startDate && !data.endDate) {
            // convert startDate từ string sang Date
            startTime = data.startDate.split("-");
            start = new Date(startTime[2], startTime[1] - 1, startTime[0]);
        } else
            if (!data.startDate && data.endDate) {
                // convert endDate từ string sang Date
                endTime = data.endDate.split("-");
                end = new Date(endTime[2], endTime[1] - 1, endTime[0]);
            }

    let frequencyConvert = data.frequency.toString();

    let configurations = [];
    for (let [index, value] of data.taskInformations.entries()) {
        configurations[index] = {
            code: value.code,
            name: value.name,
            type: value.type,
            filter: value.filter,
            newName: value.newName,
            charType: value.charType,
            showInReport: value.showInReport,
            aggregationType: value.aggregationType,
        }
    }

    await TaskReport.findByIdAndUpdate(id, {
        $set: {
            organizationalUnit: data.organizationalUnit,
            taskTemplate: data.taskTemplate,
            name: data.name,
            description: data.description,
            readByEmployees: data.readByEmployees,
            responsibleEmployees: data.responsibleEmployees,
            accountableEmployees: data.accountableEmployees,
            status: data.status,
            creator: user,
            startDate: start,
            endDate: end,
            frequency: frequencyConvert,
            configurations: configurations,
        }
    }, { new: true });
    return await TaskReport.findOne({ _id: id }).populate({ path: 'creator', select: '_id name' });
}


/**
 * Xóa một báo cáo
 * @param {*} id báo cáo cần xóa
 */
exports.deleteTaskReport = async (id) => {
    let deleteReport = await TaskReport.findOneAndDelete({ _id: id });
    return deleteReport;
}
