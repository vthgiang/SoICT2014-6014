const {
    ManufacturingPlan, OrganizationalUnit, ManufacturingWorks
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);



function getArrayTimeFromString(stringDate) {
    arrayDate = stringDate.split('-');
    let year = arrayDate[2];
    let month = arrayDate[1];
    let day = arrayDate[0];
    const date = new Date(year, month - 1, day);
    const moment = require('moment');

    // start day of createdAt
    var start = moment(date).startOf('day');
    // end day of createdAt
    var end = moment(date).endOf('day');

    return [start, end];
}

exports.createManufacturingPlan = async (data, portal) => {
    let newManufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        manufacturingOrder: data.manufacturingOrder ? data.manufacturingOrder : null,
        salesOrder: data.salesOrder ? data.salesOrder : null,
        goods: data.goods.map(x => {
            return {
                good: x.good,
                quantity: x.quantity,
                orderedQuantity: x.orderedQuantity ? x.orderedQuantity : null
            }
        }),
        approvers: data.approvers.map(x => {
            return {
                approver: x.approver,
                approvedTime: null
            }
        }),
        creator: data.creator,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        logs: [{
            creator: data.creator,
            title: data.title,
            description: data.description
        }],
        manufacturingWorks: data.manufacturingWorks.map(x => {
            return x
        })
    });

    let manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).findById(newManufacturingPlan._id);

    return { manufacturingPlan }
}

exports.getAllManufacturingPlans = async (query, portal) => {
    console.log(query);
    let { code, manufacturingOrder, salesOrder, manufacturingCommand, manufacturingWorks
        , startDate, endDate, createdAt, status, progress, page, limit, currentRole } = query;
    if (!currentRole) {
        throw Error("Role is not defined")
    }

    // Lấy ra list các nhà máy là currentRole là trưởng phòng hoặc currentRole là role quản lý khác
    // Lấy ra list nhà máy mà currentRole là quản đốc nhà máy
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'deans': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy à currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    let options = {};

    options.manufacturingWorks = {
        $in: listWorksId
    }
    // Xử lý code
    if (code) {
        options.code = new RegExp(code, "i");
    }
    // Truyền manufacturingWorks nghĩa là được xem hết kế hoạch của tất cả các nhà máy
    // Xử lý manufacturingWorks
    if (manufacturingWorks) {
        options.manufacturingWorks = {
            $in: manufacturingWorks
        }
    }
    // Xử lý ngày bắt đầu
    if (startDate) {
        options.startDate = {
            '$gte': getArrayTimeFromString(startDate)[0],
            '$lte': getArrayTimeFromString(startDate)[1]
        }
    }
    // Xử lý ngày kết thúc
    if (endDate) {
        options.endDate = {
            '$gte': getArrayTimeFromString(endDate)[0],
            '$lte': getArrayTimeFromString(endDate)[1]
        }
    }
    // Xử lý ngày tạo
    if (createdAt) {
        options.createdAt = {
            '$gte': getArrayTimeFromString(createdAt)[0],
            '$lte': getArrayTimeFromString(createdAt)[1]
        }
    }
    // Xử lý trạng thái
    if (status) {
        options.status = {
            $in: status
        }
    }


    if (!page || !limit) {
        let manufacturingPlans = await ManufacturingPlan(connect(DB_CONNECTION, portal)).find(options);
        return { manufacturingPlans }
    } else {
        let manufacturingPlans = await ManufacturingPlan(connect(DB_CONNECTION, portal))
            .paginate(options, {
                limit,
                page,
                populate: [{
                    path: "creator"
                }]
            });

        // Xử lý mã đơn sản xuất truyền vào
        if (manufacturingOrder) {
        }
        // Xử lý mã đơn kinh doanh
        if (salesOrder) {
        }
        // Xử lý mã lệnh sản xuất truyền vào
        if (manufacturingCommand) {

        }
        // Xử lý tình trạng truyền vào
        if (progress) {

        }
        return { manufacturingPlans }
    }
}