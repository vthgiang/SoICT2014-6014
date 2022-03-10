const { Customer, User, CustomerGroup } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { createTaskAction } = require('../../task/task-perform/taskPerform.service');
const { getCrmUnitByRole } = require('../crmUnit/crmUnit.service');
const { getCrmTask, updateSearchingCustomerTaskInfo } = require('../crmTask/crmTask.service');
exports.getUrl = (destination, filename) => {
    console.log(destination);
    let url = `${destination}/${filename}`;
    return url;
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

const createCustomerCode = async (portal) => {

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
    return code;
}

const createCustomerCareCode = async (portal, id) => {

    // Tạo mã khuyến mãi
    const customer = await Customer(connect(DB_CONNECTION, portal)).findById(id);

    const lastCustomerCare = customer.promotions[customer.promotions.length - 1];
    let code;
    if (lastCustomerCare == null) code = 'KM001';
    else {
        let customerCareNumber = await lastCustomerCare.code;
        customerCareNumber = customerCareNumber.slice(2);
        customerCareNumber = parseInt(customerCareNumber) + 1;
        if (customerCareNumber < 10) code = 'KM00' + customerCareNumber;
        else if (customerCareNumber < 100) code = 'KM0' + customerCareNumber;
        else code = 'KM' + customerCareNumber;
    }
    return code;
}

exports.createCustomer = async (portal, companyId, data, userId, fileConverts, role) => {
    data = await JSON.parse(JSON.stringify(data));
    let { companyEstablishmentDate, birthDate, files } = data;
    // tạo mã khách hàng
    const code = await createCustomerCode(portal);

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

    const crmUnit = await getCrmUnitByRole(portal, companyId, role);

    //if (!crmUnit) return {};
    if (!crmUnit){
        data = { ...data, creator: userId };
    }
    data = { ...data, customerCareUnit: crmUnit._id };
    const newCus = await Customer(connect(DB_CONNECTION, portal)).create(data)
    // Phần dưới đây thêm vào vì chưa xử lí được lỗi props ở phía client
    const newCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(newCus._id)
        .populate({ path: 'customerGroup', select: '_id name' })
        .populate({ path: 'customerStatus', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
    if (!crmUnit){
        return newCustomer;
    }
    // Phần trên thêm vào vì chưa xử lí được lỗi props ở phía client

    // them vao hoạt động tìm kiếm khách hàng
    //lấy công việc thêm khách hàng của nhân viên
    const crmTask = await getCrmTask(portal, companyId, userId, role, 1);
    //thêm mới hoạt động váo công việc
    const params = { taskId: crmTask.task }
    // console.log('newCustomer',newCustomer);
    const body = {
        creator: userId,
        description: `
        <p>Thêm mới khách hàng : <strong> ${newCustomer.name}</strong></p>
        <p>Mã khách hàng : <strong> ${newCustomer.code}</strong></p>
        <p>email khách hàng : <strong> ${newCustomer.email}</strong></p>
        <p>Trạng thái khách hàng : <strong style="color:green"> ${newCustomer.customerStatus[0].name}</strong></p>
        <p>Khách hàng thuộc nhóm : <strong> ${newCustomer.customerGroup.name}</strong></p>
        `,
        index: '1'
    }
    await createTaskAction(portal, params, body, []);
    await updateSearchingCustomerTaskInfo(portal, companyId, userId, role);

    const getNewCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(newCustomer._id)
        .populate({ path: 'customerGroup', select: '_id name' })
        .populate({ path: 'customerStatus', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
    return getNewCustomer;
}


exports.importCustomers = async (portal, companyId, data, userId, role) => {
    // thêm đơn vị quản lý 
    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    if (!crmUnit) return {};
    //lấy công việc thêm khách hàng của nhân viên
    const crmTask = await getCrmTask(portal, companyId, userId, role, 1);
    const params = { taskId: crmTask.task }
    let getResult = [];
    for ([index, x] of data.entries()) {
        const code = await createCustomerCode(portal);
        x.crmUnit = crmUnit._id;
        x.code = code;
        x.creator = userId;
        let owners = [];
        for (y of x.owner) {
            let owner = await User(connect(DB_CONNECTION, portal)).findOne({ email: y });
            if (owner) {
                owner = owner._id;
                owners = [...owners, owner];
            }
        }
        x.owner = owners;
        console.log('vao 2')
        // format lai định dạng date trước khi lưu
        if (x.birthDate) {
            x.birthDate = this.formatDate(x.birthDate);
        }

        if (x.companyEstablishmentDate) {
            x.companyEstablishmentDate = this.formatDate(x.companyEstablishmentDate);
        }

        // ghi lại lịch sử tạo khách hàng
        if (x.status && x.status.length > 0) {
            x.statusHistories = [{
                oldValue: x.status[x.status.length - 1],
                newValue: x.status[x.status.length - 1],
                createdAt: new Date(),
                createdBy: userId,
            }]
        }
        const newCustomer = await Customer(connect(DB_CONNECTION, portal)).create(x);
        //thêm hoạt động vaod công việc tìm kiếm khách hàng
        const body = {
            creator: userId,
            description: `
            <p>Thêm mới khách hàng<strong> ${x.name}</strong></p>
            
            `,
            index: '1'
        }
        createTaskAction(portal, params, body, []);


        const getCustomer = await Customer(connect(DB_CONNECTION, portal)).findOne({ _id: newCustomer._id })
            .populate({ path: 'customerGroup', select: '_id name' })
            .populate({ path: 'customerStatus', select: '_id name' })
            .populate({ path: 'owner', select: '_id name email' });
        if (getCustomer) {
            getResult.push(getCustomer);
        }

    }
    // cập nhật lại thông tin công việc
    await updateSearchingCustomerTaskInfo(portal, companyId, userId, role);


    return getResult;
}

/**
 * Hàm lấy danh sách tất cả các khách hàng
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} query 
 */
 /*exports.getCustomers = async (portal, companyId, query, userId, role) => {
    const { page, limit, customerCode, customerStatus, customerGroup, customerOwner, isNewCustomer, month, year, getAll } = query;

    let keySearch = {}
    if (!getAll) {
        // lấy đơn vị CSKH từ role
        const crmUnit = await getCrmUnitByRole(portal, companyId, role);
        //if (!crmUnit) return { listDocsTotal: 0, customers: [] };
        if (!crmUnit){
            keySearch = { ...keySearch, creator: userId };
        } 
        keySearch = { ...keySearch, customerCareUnit: crmUnit._id };
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
            customerStatus: { $in: customerStatus }
        };
    if (customerGroup)
        keySearch = {
            ...keySearch,
            customerGroup: { $in: customerGroup }
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
        .populate({ path: 'customerGroup', select: '_id name' })
        .populate({ path: 'customerStatus', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' });
    else customers = await Customer(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .populate({ path: 'customerGroup', select: '_id name' })
        .populate({ path: 'customerStatus', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' });
    return { listDocsTotal, customers };
}*/

exports.getCustomers = async (portal, companyId, query, userId, role) => {
    const { page, limit, customerCode, customerStatus, customerGroup, customerOwner, isNewCustomer, month, year, getAll } = query;

    let keySearch = {}
    if (!getAll) {
        // lấy đơn vị CSKH từ role
        const crmUnit = await getCrmUnitByRole(portal, companyId, role);
        //if (!crmUnit) return { listDocsTotal: 0, customers: [] };
        if (!crmUnit){
            keySearch = { ...keySearch, creator: userId };
        } 
        keySearch = { ...keySearch, customerCareUnit: crmUnit._id };
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
            customerStatus: { $in: customerStatus }
        };
    if (customerGroup)
        keySearch = {
            ...keySearch,
            customerGroup: { $in: customerGroup }
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
        .populate({ path: 'customerGroup', select: '_id name' })
        .populate({ path: 'customerStatus', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' });
    else customers = await Customer(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .populate({ path: 'customerGroup', select: '_id name' })
        .populate({ path: 'customerStatus', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' });

    
    if (getAll) {
        for (let i = 0; i < customers.length; i++) {
            let allPromotions = await this.getCustomerPromotions(portal, companyId, customers[i]._id);
            customers[i].canUsedPromotions = allPromotions;
        }
    }
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
        .populate({ path: 'customerGroup', select: '_id name' })
        .populate({ path: 'customerStatus', select: '_id name' })
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
        data = { ...data, customerGroup: null };
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
        .populate({ path: 'customerGroup', select: '_id name' })
        .populate({ path: 'customerStatus', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
        .populate({ path: 'statusHistories.oldValue statusHistories.newValue statusHistories.createdBy', select: '_id name' })
}

exports.editCustomerPoint = async (portal, companyId, id, data, userId) => {
    return await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });
}

exports.addPromotion = async (portal, companyId, id, data, userId, careCode) => {
    let { value, description, minimumOrderValue, promotionalValueMax, expirationDate } = data;

    if (!careCode) { 
        careCode = await createCustomerCareCode(portal, id);
    }

    let promotions = [];
    const code = careCode;
    let getCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(id);
    if (getCustomer.promotions) promotions = getCustomer.promotions;
    promotions = await [...promotions, { code, value, description, minimumOrderValue, promotionalValueMax, expirationDate: this.formatDate(expirationDate), status: 1 }]
    getCustomer = await { getCustomer, promotions };
    await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: getCustomer
    }, { new: true });
    
    return await Customer(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'customerGroup', select: '_id name' })
        .populate({ path: 'customerStatus', select: '_id name' })
        .populate({ path: 'owner', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
        .populate({ path: 'statusHistories.oldValue statusHistories.newValue statusHistories.createdBy', select: '_id name' })
}

// Lấy tất cả danh sách khuyến mãi của 1 khách hàng còn sử dụng được( Lấy từ bảng customer và khuyến mãi từ bảng customerGroup)
exports.getCustomerPromotions = async (portal, companyId, customerId) => {
    let promotions = [];
    const customer = await this.getCustomerById(portal, companyId, customerId);

    let now = new Date();
    // Lấy khuyến mại của riêng khách hàng còn sử dụng được, chưa hết hạn, chưa từng sử dụng
    if (customer && customer.promotions)  { 
        for ( let i = 0; i < customer.promotions.length; i++) {
            if (customer.promotions[i].status == 1 && now < new Date(customer.promotions[i].expirationDate)) {
                promotions = [...promotions, customer.promotions[i]];
            }
        }
    }

    let group;
    if (customer.customerGroup) {
        group = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(customer.customerGroup);
    }

    // Lấy khuyến mại áp dụng với nhóm mà khách hàng nằm trong nhóm đó (lấy những khuyến mãi mà khách hàng chưa sử dụng)
    if (group && group.promotions) {
        const groupPromotions = group.promotions;

        groupPromotions.forEach(x => {
            if (!x.exceptCustomer && !x.customerUsed ) {   
                // Trường hợp khuyến mãi ko có khách hàng ngoại lệ và chưa từng được khách hàng nào sử dụng                 
                promotions = [...promotions, x];
            } else {
                let checkExcept = true; // Kiểm tra xem khách hàng có thuộc ngoại lệ hay ko
                                        // true -> ko thuộc ngoại lệ 
                let checkUsed = true; // Kiểm tra xem khách hàng đã từng sử dụng khuyến mại chưa 
                                       // true -> chưa từng
                
                if (x.exceptCustomer) {
                    x.exceptCustomer.map((o) => {
                        if (o.toString() === customer._id.toString()) checkExcept = false;                    
                    })
                }
                
                if (x.customerUsed) {
                    x.customerUsed.map((o) => {
                        if (o.toString() === customer._id.toString()) {
                            checkUsed = false;    
                        }                
                    })
                }
                
                if (checkExcept && checkUsed ) promotions = [...promotions, x];  
                          
            }
        })
    }

    return promotions;

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

// Xóa khuyến mãi của khách hàng 
exports.deletePromotion = async (portal, companyId, customerId, data, userId) => {
    let { code } = data;
    let customer = await Customer(connect(DB_CONNECTION, portal)).findById(customerId);
    let promotions = [];
    if (customer.promotions) {
        const listPromotions = customer.promotions;
        listPromotions.forEach(x => {
            if (x.code !== code ) { 
                promotions = [...promotions, x];
            }
        })
    }
    customer.promotions = promotions;
    return await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(customerId, {
        $set: customer
    }, { new: true });

}

exports.usePromotion = async (portal, companyId, customerId, data, userId) => {
    let { code } = data;
    //console.log("du lieu dau vao");
    //console.log(code);
    //console.log(customerId);
    
    let customer = await Customer(connect(DB_CONNECTION, portal)).findById(customerId);
    //console.log(customer);

    if (code.includes("KMN")) {
        //console.log("Truong hop la khuyen mai nhom");

        let group = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(customer.customerGroup);
        let promotions = [];
        if (group.promotions)  {
            let listPromotions = group.promotions;
            listPromotions.forEach(x => {
                if (x.code == code) {
                    let customerUsed = x.customerUsed;
                    customerUsed = [...customerUsed, customerId];
                    x.customerUsed = customerUsed;
                    promotions = [...promotions, x];
                } else {
                    promotions = [...promotions, x];
                }
            })
        }
        group.promotions = promotions;
        //console.log("thong tin nhom sau khi sua doi");
        //console.log(group);
        await CustomerGroup(connect(DB_CONNECTION, portal)).findByIdAndUpdate(group._id,{
            $set: group
        }, { new: true });

    } else {
        //console.log("Truong hop la khuyen mai ca nhan");

        let promotions = [];
        if (customer.promotions) {
            const listPromotions = customer.promotions;
            listPromotions.forEach(x => {
                if (x.code == code) { 
                    x.status = 0;
                    promotions = [...promotions, x];
                } else promotions =  [...promotions, x ];
            })
        }
        customer.promotions = promotions; 

        //console.log("thong tin khach hang sau khi sua doi");
        //console.log(customer);
        return await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(customerId, {
            $set: customer
        }, { new: true });
    }
}

// Chỉnh sửa khuyến mãi của khách hàng
exports.editPromotion = async (portal, companyId, customerId, data, userId) => {
    let { promotion } = data;
    let customer = await Customer(connect(DB_CONNECTION, portal)).findById(customerId);
    let promotions = [];
    if (customer.promotions) {
        const listPromotions = customer.promotions;
        listPromotions.forEach(x => {
            if (x.code == promotion.code) { 
                promotions = [...promotions, promotion]
            } else promotions =  [...promotions, x ];
        })
    }
    customer.promotions = promotions; 
    return await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(customerId, {
        $set: customer
    }, { new: true });

}
