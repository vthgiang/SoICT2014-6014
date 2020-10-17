const { Customer } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Hàm tạo mới một khách hàng
 * @param {*} portal tên công ty
 * @param {*} companyId 
 * @param {*} data dữ liệu thông tin khách hàng
 * @param {*} userId  id người tạo
 */
exports.createCustomer = async (portal, companyId, data, userId) => {
    let {companyEstablishmentDate, birthDate} = data;

    //format birthDate yy-mm-dd
    if (birthDate) {
        const date = birthDate.split('-');
        birthDate = [date[2], date[1], date[0]].join("-");

        data = { ...data, birthDate }; // merge giá trị mới của birthDate vào data
    }

    // format companyEstablishmentDate yy-mm-dd
    if (companyEstablishmentDate) {
        const date = companyEstablishmentDate.split('-');
        companyEstablishmentDate = [date[2], date[1], date[0]].join('-');

        data = { ...data, companyEstablishmentDate }; // merge giá trị mới của companyEstablishmentDate vào data
    }

    //Thêm người tạo
    if (userId) {
        data = { ...data, creator: userId };
    }

    const newCustomer = await Customer(connect(DB_CONNECTION, portal)).create(data);

    const getNewCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(newCustomer._id)
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name' })
        .populate({path: 'creator',select: '_id name'})
    return getNewCustomer;
}

/**
 * Hàm lấy danh sách tất cả các khách hàng
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} query 
 */
exports.getCustomers = async (portal, companyId, query) => {
    const { page, limit } = query;
    let keySearch = {};
    const listDocsTotal = await Customer(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const customers = await Customer(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .skip(parseInt(page)).limit(parseInt(limit))
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name' });
    return { listDocsTotal, customers };

}

/**
 * Hàm lấy thông tin một khách hàng theo id
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} id 
 */
exports.getCustomerById = async (portal, companyId, id) => {
    const getCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(id)
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name' })
        .populate({path: 'creator', select: '_id name'})
        .populate({path: 'statusHistories.oldValue statusHistories.newValue statusHistories.createdBy', select: '_id name'})
    return getCustomer;
}

/**
 * Hàm chỉnh sửa khách hàng
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} id 
 * @param {*} data 
 * @param {*} userId 
 */
exports.editCustomer = async (portal, companyId, id, data, userId) => {
    let { companyEstablishmentDate, birthDate,group} = data;

    //format birthDate
    if (birthDate) {
        const date = birthDate.split('-');
        birthDate = [date[2], date[1], date[0]].join("-");
        data = { ...data, birthDate };
    }

    // format companyEstablishmentDate
    if (companyEstablishmentDate) {
        const date = companyEstablishmentDate.split('-');
        companyEstablishmentDate = [date[2], date[1], date[0]].join('-');
        data = { ...data, companyEstablishmentDate };
    }

    if (userId) {
        data = { ...data, creator: userId }; 
    }
    
    // check nếu ko có group (group ='') thì gán group = null. vì group ref tới schema group
    if (!group) {
        data = { ...data, group: null };
    }

    await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });

    return await Customer(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name' })
        .populate({ path: 'creator', select: '_id name' })
        .populate({path: 'statusHistories.oldValue statusHistories.newValue statusHistories.createdBy', select: '_id name'})
}


exports.deleteCustomer = async (portal, companyId, id) => {
    let delCustomer = await Customer(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delCustomer;
}