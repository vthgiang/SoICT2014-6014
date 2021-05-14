const { Care } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const STATUS_VALUE = {
    unfulfilled: 1,
    processing: 2,
    accomplished: 3,
    expired: 4,
    completedOverdue: 5
};
exports.createCare = async (portal, companyId, data, userId) => {
    let { startDate, endDate } = data;
   

    if (startDate) {
        const date = startDate.split('-');
        startDate = [date[2], date[1], date[0]].join("-");

        data = { ...data, startDate };
    }

    if (endDate) {
        const date = endDate.split('-');
        endDate = [date[2], date[1], date[0]].join("-");
        data = { ...data, endDate };
    }

    if (userId) {
        data = { ...data, creator: userId ,updatedBy:userId };
    }
    //------------

    const newCare = await Care(connect(DB_CONNECTION, portal)).create(data);
    const care = await Care(connect(DB_CONNECTION, portal)).findById(newCare._id);
    if (care.status == 3 || care.status == 5) return;
    let now = new Date();
    if (care.startDate.getTime() > now.getTime()) updateCareStatus(care._id, STATUS_VALUE.unfulfilled, portal)
    else if (care.endDate.getTime() > now.getTime()) updateCareStatus(care._id, STATUS_VALUE.processing, portal)
    else updateCareStatus(care._id, STATUS_VALUE.expired, portal);


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

exports.getCares = async (portal, companyId, query) => {
    const { page, limit, customerId, status, customerCareTypes, customerCareStaffs } = query;
    console.log('query', query)
    let keySearch = {};
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

    const listDocsTotal = await Care(connect(DB_CONNECTION, portal)).countDocuments(keySearch);


    const listCare = await Care(connect(DB_CONNECTION, portal)).find({});
    listCare.forEach(care => {
        if (care.status == 3 || care.status == 5) return;
        let now = new Date();
        if (care.startDate > now) updateCareStatus(care._id, STATUS_VALUE.unfulfilled, portal)
        else if (care.endDate > now) updateCareStatus(care._id, STATUS_VALUE.processing, portal)
        else updateCareStatus(care._id, STATUS_VALUE.expired, portal)
    });

    const cares = await Care(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .skip(parseInt(page)).limit(parseInt(limit))
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name' })
        .populate({ path: 'customerCareStaffs', select: '_id name' })
        .populate({ path: 'customerCareTypes', select: '_id name' })
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

    await Care(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });

    return await Care(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'customer', select: '_id name' })
        .populate({ path: 'customerCareStaffs', select: '_id name' })
        .populate({ path: 'customerCareTypes', select: '_id name' })
}

exports.deleteCare = async (portal, companyId, id) => {
    let delCare = await Care(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delCare;
}