const { Customer,User } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

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
    return [date[2],date[1],date[0]].join("-");
}


exports.createCustomer = async (portal, companyId, data, userId, fileConverts) => {
    let {companyEstablishmentDate, birthDate, files} = data;
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
    if (files && files.length > 0 && fileConverts && fileConverts.length>0) {
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

    const newCustomer = await Customer(connect(DB_CONNECTION, portal)).create(data);
    const getNewCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(newCustomer._id)
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' })
        .populate({path: 'creator',select: '_id name email'})
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
exports.getCustomers = async (portal, companyId, query) => {
    const { page, limit } = query;
    let keySearch = {};
    const listDocsTotal = await Customer(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const customers = await Customer(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .skip(parseInt(page)).limit(parseInt(limit))
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
        .populate({path: 'creator', select: '_id name email'})
        .populate({path: 'statusHistories.oldValue statusHistories.newValue statusHistories.createdBy', select: '_id name'})
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
exports.editCustomer = async (portal, companyId, id, data, userId,fileInfo) => {
    let { companyEstablishmentDate, birthDate, group, files} = data;

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
        data = {...data, avatar: fileInfo.avatar}
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
        .populate({path: 'statusHistories.oldValue statusHistories.newValue statusHistories.createdBy', select: '_id name'})
}

exports.editCustomerPoint = async (portal, companyId, id, data, userId) => {
    return await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });
}


exports.deleteCustomer = async (portal, companyId, id) => {
    let delCustomer = await Customer(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delCustomer;
}