const { Care } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getCrmTask } = require('../crmTask/crmTask.service');
const { createTaskAction, evaluationAction } = require('../../task/task-perform/taskPerform.service');
const { getCrmUnitByRole } = require('../crmUnit/crmUnit.service');
const STATUS_VALUE = {
    unfulfilled: 1,
    processing: 2,
    accomplished: 3,
    expired: 4,
    completedOverdue: 5
};
exports.createCare = async (portal, companyId, data, userId, role) => {
    let { startDate, endDate } = data;
    if (startDate) {
        const date = startDate.split('-');

        startDate = [date[2], date[1], date[0]].join("-");
        startDate = await new Date(startDate)
        data = { ...data, startDate };
    }
    if (endDate) {
        const date = endDate.split('-');
        endDate = [date[2], date[1], date[0]].join("-");
        endDate = await new Date(endDate)
        data = { ...data, endDate };
    }
    if (userId) {
        data = { ...data, creator: userId, updatedBy: userId };
    }
    // tạo trạng thái cho hoạt động
    let now = new Date();
    if (startDate.getTime() > now.getTime()) data = { ...data, status: STATUS_VALUE.unfulfilled }
    else if (endDate.getTime() > now.getTime()) data = { ...data, status: STATUS_VALUE.processing }
    else data = { ...data, status: STATUS_VALUE.expired }
    console.log('xong')
    // tạo trường đơn vị CSKH

    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    data = { ...data, crmUnit:crmUnit._id };


    const newCare = await Care(connect(DB_CONNECTION, portal)).create(data);
    const getNewCare = await Care(connect(DB_CONNECTION, portal)).findById(newCare._id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name ' })
        .populate({ path: 'customerCareStaffs', select: '_id name' })
        .populate({ path: 'customerCareTypes', select: '_id name' })
    return getNewCare;
}

const updateCareStatus = async (id, status, portal) => {
    await Care(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: { status: status }
    }, { new: true });
}

exports.getCares = async (portal, companyId, query, role) => {
    const { page, limit, customerId, status, customerCareTypes, customerCareStaffs, month, year, getAll } = query;
    let keySearch = {};
    if (!getAll) {
        const crmUnit = await getCrmUnitByRole(portal, companyId, role);
        if (!crmUnit) return { listDocsTotal:0, cares:[] };
        keySearch = { ...keySearch, crmUnit: crmUnit._id }
    }
    if (customerId) {
        keySearch =
        {
            ...keySearch,
            customer: customerId
        }
    }
    if (status) {
        keySearch =
        {
            ...keySearch,
            status: { $in: status }
        }
    }
    if (customerCareTypes) {
        keySearch =
        {
            ...keySearch,
            customerCareTypes: { $in: customerCareTypes }
        }
    }
    if (customerCareStaffs && customerCareStaffs != []) {
        keySearch =
        {
            ...keySearch,
            customerCareStaffs: { $in: customerCareStaffs }
        }
    }
    if (customerId) {
        keySearch =
        {
            ...keySearch,
            customer: customerId
        }
    }
    if (month && year) {
        let beginOfMonth = new Date(`${year}-${month}`); // cần chỉnh lại 
        let endOfMonth = new Date(year, month); // cần chỉnh lại
        keySearch =
        {
            ...keySearch,
            $or: [
                { startDate: { $gte: beginOfMonth, $lt: endOfMonth } },
                { endDate: { $gte: beginOfMonth, $lt: endOfMonth } }
            ],

        }
    }
    const listDocsTotal = await Care(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    const listCare = await Care(connect(DB_CONNECTION, portal)).find({});
    listCare.forEach(care => {
        if (care.status == 3 || care.status == 5) return;
        let now = new Date();
        if (care.startDate > now) updateCareStatus(care._id, STATUS_VALUE.unfulfilled, portal)
        else if (care.endDate > now) updateCareStatus(care._id, STATUS_VALUE.processing, portal)
        else updateCareStatus(care._id, STATUS_VALUE.expired, portal)
    });

    let cares;
    if (page && limit) {
        cares = await Care(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
            .skip(parseInt(page)).limit(parseInt(limit))
            .populate({ path: 'creator', select: '_id name' })
            .populate({ path: 'customer', select: '_id name' })
            .populate({ path: 'customerCareStaffs', select: '_id name' })
            .populate({ path: 'customerCareTypes', select: '_id name' });
    }
    else {
        cares = await Care(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
            .populate({ path: 'creator', select: '_id name' })
            .populate({ path: 'customer', select: '_id name' })
            .populate({ path: 'customerCareStaffs', select: '_id name' })
            .populate({ path: 'customerCareTypes', select: '_id name' });
    }
    return { listDocsTotal, cares };
}


exports.getCareById = async (portal, companyId, id) => {
    return await Care(connect(DB_CONNECTION, portal)).findById(id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name' })
        .populate({ path: 'customerCareStaffs', select: '_id name' })
        .populate({ path: 'customerCareTypes', select: '_id name' })
}


exports.editCare = async (portal, companyId, id, data, userId) => {
    let { startDate, endDate } = data;
    if (userId) {
        data = { ...data, creator: userId };
    }

    //format lai định dạng
    if (startDate) {
        const date = startDate.split('-');
        startDate = [date[2], date[1], date[0]].join("-");
        data = { ...data, startDate };
    }

    //format lai định dạng
    if (endDate) {
        const date = endDate.split('-');
        endDate = [date[2], date[1], date[0]].join("-");
        data = { ...data, endDate };
    }
    const oldCare = await Care(connect(DB_CONNECTION, portal)).findOne({ _id: id });
    await Care(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });
    await Care(connect(DB_CONNECTION, portal)).findOne({ _id: id });

    const newCare = await Care(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name' })
        .populate({ path: 'customerCareStaffs', select: '_id name' })
        .populate({ path: 'customerCareTypes', select: '_id name' })

    if (oldCare.status != newCare.status && (newCare.status == STATUS_VALUE.completedOverdue || newCare.status == STATUS_VALUE.accomplished)) {
        // Ghi lại công việc
        //lấy công việc chăm sóc khách hàng của nhân viên

        const crmTask = await getCrmTask(portal, userId, 2);
        //thêm mới hoạt động váo công việc
        let params = { taskId: crmTask.task }
        let body = {
            creator: userId,
            description: `<p> <strong> ${newCare.name}</strong>, tên khách hàng : <strong> ${newCare.customer.name}</strong>  </p>`,
            index: '1'
        }
        const action = await createTaskAction(portal, params, body, []);
        // thực hiện đánh giá cho hoạt động
        params = { taskId: crmTask.task, actionId: action.taskActions[0]._id }
        body = {
            rating: parseFloat(newCare.evaluation.point),
            actionImportanceLevel: 10,
            firstTime: 1,
            type: 'evaluation',
            role: 'accountable',
            creator: userId
        }
        evaluationAction(portal, params, body)

    }

    return newCare;
}

exports.deleteCare = async (portal, companyId, id) => {
    let delCare = await Care(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delCare;
}


