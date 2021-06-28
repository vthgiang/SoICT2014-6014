const { Customer, User } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getCrmTask } = require('../crmTask/crmTask.service')
const { createTaskAction } = require('../../task/task-perform/taskPerform.service');
const { getCrmUnitByRole } = require('../crmUnit/crmUnit.service');
exports.getUrl = (destination, filename) => {
    let url = `${destination}/${filename}`;
    return url.substr(1, url.length);
}

/**
 * Hàm tạo mới một khách hàng
 * @param {*} portal tên công ty
 * @param {*} companyId 
 * @param {*} data dữ liệu thông tin khách hàng
 * @param {*} userId  id người tạo
 */
exports.formatDate = (value) => {
    const date = value.split('-');
    return [date[2], date[1], date[0]].join("-");
}


exports.createCustomer = async (portal, companyId, data, userId, fileConverts, role) => {
    let { companyEstablishmentDate, birthDate, files } = data;
    // tạo mã khách hàng
    const lastCustomer = await Customer(connect(DB_CONNECTION, portal)).findOne().sort({ $natural: -1 });
    let code;
    if (lastCustomer == null) code = 'KH001';
    else {
        let customerNumber = await lastCustomer.code;
        customerNumber = customerNumber.slice(2);
        customerNumber = parseInt(customerNumber) + 1;
        if (customerNumber < 10) code = 'KH00' + customerNumber;
        else if (customerNumber < 100) code = 'KH0' + customerNumber;
        else code = 'KH' + customerNumber;
    }

    data = { ...data, code };
    //format birthDate yy-mm-dd
    if (birthDate) {
        birthDate = this.formatDate(birthDate);
        data = { ...data, birthDate }; // merge giá trị mới của birthDate vào data
    }

    // format companyEstablishmentDate yy-mm-dd
    if (companyEstablishmentDate) {
        companyEstablishmentDate = this.formatDate(companyEstablishmentDate);

        data = { ...data, companyEstablishmentDate }; // merge giá trị mới của companyEstablishmentDate vào data
    }

    //Thêm người tạo
    if (userId) {
        data = { ...data, creator: userId };
    }
    // Thêm file đính kèm với khách hàng nếu có
    if (files && files.length > 0 && fileConverts && fileConverts.length > 0) {
        let result = [];
        files.forEach(x => {
            fileConverts.forEach(y => {
                if (x.fileName === y.originalname) {
                    result.push({
                        creator: userId,
                        name: x.name,
                        description: x.description,
                        fileName: x.fileName,
                        url: this.getUrl(y.destination, y.filename),
                    })
                }
            })
        })
        data = { ...data, files: result };
    }
    // thêm đơn vị quản lý 
    console.log('vao day', role);
    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    if (!crmUnit) return {};
    data = { ...data, crmUnit };
    const newCustomer = await Customer(connect(DB_CONNECTION, portal)).create(data);
    // them vao hoạt động tìm kiếm khách hàng
    //lấy công việc thêm khách hàng của nhân viên
    const crmTask = await getCrmTask(portal, userId, 1);
    //thêm mới hoạt động váo công việc
    const params = { taskId: crmTask.task }
    const body = {
        creator: userId,
        description: `<p>Thêm mới khách hàng<strong> ${newCustomer.name}</strong></p>`,
        index: '1'
    }
    createTaskAction(portal, params, body, []);

    const getNewCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(newCustomer._id)
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
    return getNewCustomer;
}


exports.importCustomers = async (portal, companyId, data, userId) => {
    for ([index, x] of data.entries()) {
        x["creator"] = userId;
        let owners = [];
        for (y of x.owner) {
            let owner = await User(connect(DB_CONNECTION, portal)).findOne({ email: y });
            if (owner) {
                owner = owner._id;
                owners = [...owners, owner];
            }
        }
        data[index].owner = owners;

        // format lai định dạng date trước khi lưu
        if (x.birthDate) {
            x.birthDate = this.formatDate(x.birthDate);
        }

        if (x.companyEstablishmentDate) {
            x.companyEstablishmentDate = this.formatDate(x.companyEstablishmentDate);
        }

        // ghi lại lịch sử tạo khách hàng

        if (x.status && x.status.length > 0) {
            x["statusHistories"] = [{
                oldValue: x.status[x.status.length - 1],
                newValue: x.status[x.status.length - 1],
                createdAt: new Date(),
                createdBy: userId,
            }]
        }
    }

    const result = await Customer(connect(DB_CONNECTION, portal)).insertMany(data);


    // them vao hoạt động tìm kiếm khách hàng
    //lấy công việc thêm khách hàng của nhân viên
    const crmTask = await getCrmTask(portal, userId, 1);
    //thêm mới hoạt động váo công việc
    const params = { taskId: crmTask.task }
    for ([index, x] of data.entries()) {
        const body = {
            creator: userId,
            description: `<p>Thêm mới khách hàng<strong> ${x.name}</strong></p>`,
            index: '1'
        }
        createTaskAction(portal, params, body, []);
    }

    let getResult = [];
    for (let obj of result) {
        const newObj = await Customer(connect(DB_CONNECTION, portal)).findOne({ _id: obj._id })
            .populate({ path: 'group', select: '_id name' })
            .populate({ path: 'status', select: '_id name' })
            .populate({ path: 'owner', select: '_id name email' });
        if (newObj) {
            getResult.push(newObj);
        }
    }
    return getResult;
}

/**
 * Hàm lấy danh sách tất cả các khách hàng
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} query 
 */
exports.getCustomers = async (portal, companyId, query, role) => {
    const { page, limit, customerCode, customerStatus, customerGroup, customerOwner, isNewCustomer, month, year, getAll } = query;

    let keySearch = {}
    if (!getAll) {
        // lấy đơn vị CSKH từ role
        const crmUnit = await getCrmUnitByRole(portal, companyId, role);
        console.log('crmUnit',crmUnit);
        if (!crmUnit) return { listDocsTotal :0, customers:[] } ;
        keySearch = { crmUnit: crmUnit }
    }
    if (customerCode) {
        keySearch = {
            ...keySearch,
            code: { $regex: customerCode, $options: "i" },
        }
    }
    if (customerStatus)
        keySearch = {
            ...keySearch,
            status: { $in: customerStatus }
        };
    if (customerGroup)
        keySearch = {
            ...keySearch,
            group: { $in: customerGroup }
        }
    if (customerOwner && customerOwner != 0) {
        keySearch = {
            ...keySearch,
            owner: { $in: customerOwner }
        }
    }
    if (month && year) {
        let beginOfMonth = new Date(`${year}-${month}`); // cần chỉnh lại 
        let endOfMonth = new Date(year, month); // cần chỉnh lại
        if (isNewCustomer)
            keySearch =
            {
                ...keySearch,
                createdAt: { $gte: beginOfMonth, $lt: endOfMonth }
            }
        else
            keySearch =
            {
                ...keySearch,
                createdAt: { $lt: beginOfMonth }
            }
    }

    const listDocsTotal = await Customer(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    let customers;
    if (page && limit) customers = await Customer(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .skip(parseInt(page)).limit(parseInt(limit))
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' });
    else customers = await Customer(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' });
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
        .populate({ path: 'owner', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
        .populate({ path: 'files.creator', select: '_id name ' })
        .populate({ path: 'statusHistories.oldValue statusHistories.newValue statusHistories.createdBy', select: '_id name' })
    return getCustomer;
}

/**
 * Lấy tổng số point của một khách hàng
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} id 
 * @param {*} data 
 * @param {*} userId 
 * @param {*} fileInfo 
 */
exports.getCustomerPoint = async (portal, companyId, customerId) => {
    const getCustomerPoint = await Customer(connect(DB_CONNECTION, portal)).findById(customerId);
    return {
        _id: getCustomerPoint._id,
        point: getCustomerPoint.point,
    }
}
/**
 * Hàm chỉnh sửa khách hàng
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} id 
 * @param {*} data 
 * @param {*} userId 
 */
exports.editCustomer = async (portal, companyId, id, data, userId, fileInfo) => {
    let { companyEstablishmentDate, birthDate, group, files } = data;

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

    // Cập nhật avatar cho khách hàng
    if (fileInfo.avatar) {
        data = { ...data, avatar: fileInfo.avatar }
    }

    // Thêm file đính kèm với khách hàng nếu có
    if (files && files.length > 0 && fileInfo.fileAttachment && fileInfo.fileAttachment.length > 0) {
        let result = [];
        files.forEach(x => {
            fileInfo.fileAttachment.forEach(y => {
                if (x.fileName === y.originalname) {
                    result.push({
                        creator: userId,
                        name: x.name,
                        description: x.description,
                        fileName: x.fileName,
                        url: this.getUrl(y.destination, y.filename),
                    })
                }
            })
        })
        data = { ...data, files: result };
    }

    await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });

    return await Customer(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
        .populate({ path: 'statusHistories.oldValue statusHistories.newValue statusHistories.createdBy', select: '_id name' })
}

exports.editCustomerPoint = async (portal, companyId, id, data, userId) => {
    return await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });
}

exports.addPromotion = async (portal, companyId, id, data, userId) => {
    let { value, description, minimumOrderValue, promotionalValueMax, expirationDate } = data;


    let promotions = [];
    let getCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(id);
    if (getCustomer.promotions) promotions = getCustomer.promotions;
    promotions = await [...promotions, { value, description, minimumOrderValue, promotionalValueMax, expirationDate: this.formatDate(expirationDate) }]
    getCustomer = await { getCustomer, promotions };
    await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: getCustomer
    }, { new: true });
    return await Customer(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
        .populate({ path: 'statusHistories.oldValue statusHistories.newValue statusHistories.createdBy', select: '_id name' })


}

exports.addRankPoint = async (portal, companyId, id, data, userId) => {
    let { paymentAmount } = data;
    let rankPoints = [];
    let getCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(id);
    if (getCustomer.rankPoints) rankPoints = getCustomer.rankPoints;
    //lay thoi gian hien tai
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    rankPoints = await [...rankPoints, { point: (paymentAmount / 10000), expirationDate: new Date(month + 3, year) }]
    getCustomer = await { getCustomer, rankPoints };
    return await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: getCustomer
    }, { new: true });
}




exports.deleteCustomer = async (portal, companyId, id) => {
    let delCustomer = await Customer(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delCustomer;
}