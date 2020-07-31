const mongoose = require("mongoose");
const { TaskReport, Task, TaskTemplate, Role, OrganizationalUnit, User } = require('../../../models').schema;


/**
 * Lấy ra danh sách các báo cáo công việc
 * @param  params 
 */
exports.getTaskReports = async (params) => {
    const name = params.name;
    let keySearch = {}

    if (name !== undefined && name.length !== 0) {
        keySearch = {
            ...keySearch,
            name: { $regex: params.name, $options: "i" },
        }
    }

    let totalList = await TaskReport.countDocuments();
    let listTaskReport = await TaskReport.find(keySearch).sort({ 'createdAt': 'desc' }).skip(parseInt(params.page)).limit(parseInt(params.limit)).populate({ path: 'creator', select: "_id name" });
    return { totalList, listTaskReport };
}


/**
 * Lây 1 báo cáo 
 * @param {*} id id báo cáo
 */
exports.getTaskReportById = async (id) => {
    let taskReportById = await TaskReport.findById(id)
        .populate({ path: 'creator', select: "_id name" });
    return taskReportById;
}


/**
 * Tạo mới một báo cáo
 * @param {*} data dữ liệu caần tạo
 * @param {*} user id người tạo
 */
exports.createTaskReport = async (data, user) => {
    // convert startDate từ string sang Date
    console.log('daaaaa', data);
    let startTime = data.startDate.split("-");
    let start = new Date(startTime[2], startTime[1] - 1, startTime[0]);

    // convert endDate từ string sang Date
    let endTime = data.endDate.split("-");
    let end = new Date(endTime[2], endTime[1] - 1, endTime[0]);

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
            aggregationType: value.aggregationType,
            showInReport: value.showInReport,
        }
    }

    let newTaskReport = await TaskReport.create({
        organizationalUnit: data.organizationalUnit,
        name: data.nameTaskReport,
        description: data.descriptionTaskReport,
        creator: user,
        startDate: start,
        endDate: end,
        taskTemplate: data.taskTemplate,
        status: statusConvert,
        frequency: frequencyConvert,
        responsibleEmployees: data.responsibleEmployees,
        accountableEmployees: data.accountableEmployees,
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
    await TaskReport.findByIdAndUpdate(id, {
        $set: {
            name: data.nameTaskReport,
            description: data.descriptionTaskReport,
            creator: user,
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
