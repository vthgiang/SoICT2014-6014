const { TaskReport } = require('../../../models').schema;


/**
 * Lấy ra danh sách các báo cáo công việc
 * @param  params 
 */
exports.getTaskReports = async (params) => {
    const { name, creator, month } = params;
    let dateSearch, getMonth, year, startDate, endDate, keySearch = {};

    if (month) {
        dateSearch = params.month.split('-');
        getMonth = dateSearch[1], year = dateSearch[0];
        startDate = new Date(year, getMonth - 1, 2);
        endDate = new Date(year, getMonth - 1, 32);
    }

    // Tìm kiếm theo tên báo cáo
    if (name && name.length !== 0) {
        keySearch = {
            ...keySearch,
            name: { $regex: name, $options: "i" },
        }
    }

    // Tìm kiếm theo người tạo
    if (creator && creator.length !== 0) {
        keySearch = {
            ...keySearch,
            creator: { $regex: params.creator, $options: "i" },
        }
    }

    // Tìm kiếm theo tháng
    if (month && month.length !== 0) {
        keySearch = {
            ...keySearch,
            createdAt: { $gte: startDate, $lte: endDate }
        }
    };

    // get tổng số record của bảng Task report
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
    let { organizationalUnit, taskTemplate, nameTaskReport, descriptionTaskReport,
        readByEmployees, responsibleEmployees, accountableEmployees, startDate, endDate, status, frequency, itemListBoxLeft, itemListBoxRight,
        taskInformations } = data;
    let startTime, start = null, endTime, end = null, configurations = [];

    if (status) {
        status = Number(status);
    }

    // convert startDate từ string qua Date
    if (data.startDate) {
        startTime = startDate.split("-");
        start = new Date(startTime[2], startTime[1] - 1, startTime[0]);
    }

    // convert endDate từ string sang Date
    if (endDate) {
        endTime = endDate.split("-");
        end = new Date(endTime[2], endTime[1] - 1, endTime[0]);
    }

    for (let [index, value] of taskInformations.entries()) {
        configurations[index] = {
            code: value.code,
            name: value.name,
            type: value.type,
            filter: value.filter,
            newName: value.newName,
            chartType: value.chartType,
            showInReport: value.showInReport,
            aggregationType: value.aggregationType,
            coefficient: value.coefficient,
        }
    }

    let newTaskReport = await TaskReport.create({
        organizationalUnit: organizationalUnit,
        taskTemplate: taskTemplate,
        name: nameTaskReport,
        description: descriptionTaskReport,
        readByEmployees: readByEmployees,
        responsibleEmployees: responsibleEmployees,
        accountableEmployees: accountableEmployees,
        status: status,
        creator: user,
        startDate: start,
        endDate: end,
        frequency: frequency,
        configurations: configurations,
        listDataChart: itemListBoxLeft,
        dataForAxisXInChart: itemListBoxRight,

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
    let { organizationalUnit, taskTemplate, name, description, readByEmployees, responsibleEmployees,
        accountableEmployees, status, startDate, endDate, dataForAxisXInChart, frequency, listDataChart, taskInformations } = data;
    let startTime, start = null, endTime, end = null, configurations = [];

    if (status && status.length > 0) {
        status = parseInt(status.toString());
    }

    if (startDate) {
        // convert startDate từ string sang Date
        startTime = startDate.split("-");
        start = new Date(startTime[2], startTime[1] - 1, startTime[0]);
    }

    if (endDate) {
        // convert endDate từ string sang Date
        endTime = endDate.split("-");
        end = new Date(endTime[2], endTime[1] - 1, endTime[0]);
    }

    for (let [index, value] of taskInformations.entries()) {
        configurations[index] = {
            code: value.code,
            name: value.name,
            type: value.type,
            filter: value.filter,
            newName: value.newName,
            chartType: value.chartType,
            showInReport: value.showInReport,
            aggregationType: value.aggregationType,
            coefficient: value.coefficient,
        }
    }

    await TaskReport.findByIdAndUpdate(id, {
        $set: {
            organizationalUnit: organizationalUnit,
            taskTemplate: taskTemplate,
            name: name,
            description: description,
            readByEmployees: readByEmployees,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            status: status,
            creator: user,
            startDate: start,
            endDate: end,
            frequency: frequency,
            configurations: configurations,
            listDataChart: listDataChart,
            dataForAxisXInChart: dataForAxisXInChart,
        }
    }, { new: true });
    return await TaskReport.findOne({ _id: id })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'taskTemplate' })
        .populate({ path: 'responsibleEmployees', select: '_id name company' })
        .populate({ path: 'accountableEmployees', select: '_id name company' })
        .populate({ path: 'readByEmployees', select: '_id name company' })
        .populate({ path: 'organizationalUnit', select: 'deans viceDeans employees _id name company parent' })
        .populate({ path: 'readByEmployees' });
}


/**
 * Xóa một báo cáo
 * @param {*} id báo cáo cần xóa
 */
exports.deleteTaskReport = async (id) => {
    let deleteReport = await TaskReport.findOneAndDelete({ _id: id });
    return deleteReport;
}
