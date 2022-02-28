const { CustomerCare } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getCrmTask, updateCrmActionsTaskInfo } = require('../crmTask/crmTask.service');
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
    let { startDate, endDate, customerCareStaffs} = data;
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
    if(!customerCareStaffs) {
        data = { ...data, customerCareStaffs: userId};
    }
    // tạo trạng thái cho hoạt động
    let now = new Date();
    if (startDate.getTime() > now.getTime()) data = { ...data, status: STATUS_VALUE.unfulfilled }
    else if (endDate.getTime() > now.getTime()) data = { ...data, status: STATUS_VALUE.processing }
    else data = { ...data, status: STATUS_VALUE.expired }
    // tạo trường đơn vị CSKH

    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    if (!crmUnit){
        data = { ...data, creator: userId };
    }
    data = { ...data, customerCareUnit: crmUnit._id };

    const newCare = await CustomerCare(connect(DB_CONNECTION, portal)).create(data);
    // Phần dưới đây thêm vào vì chưa xử lí được lỗi props ở phía client
    const getNewCare1 = await CustomerCare(connect(DB_CONNECTION, portal)).findById(newCare._id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name ' })
        .populate({ path: 'customerCareStaffs', select: '_id name' })
        .populate({ path: 'customerCareTypes', select: '_id name' })
    if (!crmUnit){
        return getNewCare1;
    }
    // Phần trên thêm vào vì chưa xử lí được lỗi props ở phía client

    // cập nhật công việc
    await updateCrmActionsTaskInfo(portal, companyId, userId, role);
    const getNewCare = await CustomerCare(connect(DB_CONNECTION, portal)).findById(newCare._id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name ' })
        .populate({ path: 'customerCareStaffs', select: '_id name' })
        .populate({ path: 'customerCareTypes', select: '_id name' })
    return getNewCare;
}

const updateCareStatus = async (id, status, portal) => {
    await CustomerCare(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: { status: status }
    }, { new: true });
}

exports.getCares = async (portal, companyId, query, userId, role) => {
    const { page, limit, customerId, status, customerCareTypes, customerCareStaffs, month, year, getAll } = query;
    let keySearch = {};
    if (!getAll) {
        const crmUnit = await getCrmUnitByRole(portal, companyId, role);
        //if (!crmUnit) return { listDocsTotal: 0, cares: [] };
        if (!crmUnit){
            keySearch = { ...keySearch, creator: userId };
        } 
        keySearch = { ...keySearch, customerCareUnit: crmUnit._id };
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
    const listDocsTotal = await CustomerCare(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    const listCare = await CustomerCare(connect(DB_CONNECTION, portal)).find({});
    listCare.forEach(care => {
        if (care.status == 3 || care.status == 5) return;
        let now = new Date();
        if (care.startDate > now) updateCareStatus(care._id, STATUS_VALUE.unfulfilled, portal)
        else if (care.endDate > now) updateCareStatus(care._id, STATUS_VALUE.processing, portal)
        else updateCareStatus(care._id, STATUS_VALUE.expired, portal)
    });

    let cares;
    if (page && limit) {
        cares = await CustomerCare(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
            .skip(parseInt(page)).limit(parseInt(limit))
            .populate({ path: 'creator', select: '_id name' })
            .populate({ path: 'customer', select: '_id name' })
            .populate({ path: 'customerCareStaffs', select: '_id name' })
            .populate({ path: 'customerCareTypes', select: '_id name' });
    }
    else {
        cares = await CustomerCare(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
            .populate({ path: 'creator', select: '_id name' })
            .populate({ path: 'customer', select: '_id name' })
            .populate({ path: 'customerCareStaffs', select: '_id name' })
            .populate({ path: 'customerCareTypes', select: '_id name' });
    }
    console.log(cares);
    return { listDocsTotal, cares };
}


exports.getCareById = async (portal, companyId, id) => {
    return await CustomerCare(connect(DB_CONNECTION, portal)).findById(id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name' })
        .populate({ path: 'customerCareStaffs', select: '_id name' })
        .populate({ path: 'customerCareTypes', select: '_id name' })
}


exports.editCare = async (portal, companyId, id, data, userId, role) => {
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
    const oldCare = await CustomerCare(connect(DB_CONNECTION, portal)).findOne({ _id: id });
    await CustomerCare(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });
    await CustomerCare(connect(DB_CONNECTION, portal)).findOne({ _id: id });

    const newCare = await CustomerCare(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name' })
        .populate({ path: 'customerCareStaffs', select: '_id name' })
        .populate({ path: 'customerCareTypes', select: '_id name' })

    if (oldCare.status != newCare.status && (newCare.status == STATUS_VALUE.completedOverdue || newCare.status == STATUS_VALUE.accomplished)) {
        // Ghi lại công việc
        //lấy công việc chăm sóc khách hàng của nhân viên
        console.log(1);
        const crmTask = await getCrmTask(portal, companyId, userId, role, 2);
        //thêm mới hoạt động váo công việc
        let params = { taskId: crmTask.task }
        let body = {
            creator: userId,
            description: `
            <p> Tên công việc :  <strong> ${newCare.name}</strong> </p>
            <p> Tên khách hàng : <strong> ${newCare.customer.name}</strong></p>
            <p> Mô tả : <i>${newCare.description ? newCare.description.slice(3, newCare.description.length - 4) : ''}</i> </p> 
            <p> Kết quả :  ${newCare.evaluation.result == 1 ? '<strong style="color:green">Thành công</strong>' : '<strong style="color:red">Thất bại</strong>'}</p>
            <p>  Nhận xét hoạt động : <i> ${newCare.evaluation.comment ? newCare.evaluation.comment.slice(3, newCare.description.length - 4) : ''}<i></p>
            `,
            index: '1'
        }
        console.log(1);
        const action = await createTaskAction(portal, params, body, []);
        console.log(1);
        // thực hiện đánh giá cho hoạt động
        // cập nhật công việc
        await updateCrmActionsTaskInfo(portal, companyId, userId, role);
        console.log(1);

    }

    return newCare;
}

exports.deleteCare = async (portal, companyId, id) => {
    let delCare = await CustomerCare(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delCare;
}


