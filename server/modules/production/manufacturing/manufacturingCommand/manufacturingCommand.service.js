const {
    ManufacturingCommand, ManufacturingPlan, ManufacturingWorks, OrganizationalUnit,
    ManufacturingOrder, SalesOrder, Lot, ManufacturingMill, PurchasingRequest
} = require(`../../../../models`);
const {
    connect
} = require(`../../../../helpers/dbHelper`);
const { deleteCommandFromSchedule } = require('../workSchedule/workSchedule.service');

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

// Hàm format to YYYY-MM để có thể dụng new Date
function formatToTimeZoneDate(stringDate) {
    let dateArray = stringDate.split("-");
    if (dateArray.length == 3) {
        let day = dateArray[0];
        let month = dateArray[1];
        let year = dateArray[2];
        return `${year}-${month}-${day}`
    }
    else if (dateArray.length == 2) {
        let month = dateArray[0];
        let year = dateArray[1];
        return `${year}-${month}`
    }
}



exports.createManufacturingCommand = async (data, portal) => {
    let newManufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        manufacturingPlan: data.manufacturingPlan,
        manufacturingMill: data.manufacturingMill,
        startDate: formatToTimeZoneDate(data.startDate),
        endDate: formatToTimeZoneDate(data.endDate),
        startTurn: data.startTurn,
        endTurn: data.endTurn,
        good: data.good._id,
        quantity: data.quantity,
        creator: data.creator,
        approvers: data.approvers.map(x => {
            return {
                approver: x,
                approvedTime: null
            }
        }),
        qualityControlStaffs: data.qualityControlStaffs.map(x => {
            return {
                staff: x,
                status: 1,
                content: null,
                time: null
            }
        }),
        responsibles: data.responsibles.map(x => {
            return x
        }),
        accountables: data.accountables.map(x => {
            return x
        }),
        description: data.description
    });

    let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).findById(newManufacturingCommand);

    let manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).findById(data.manufacturingPlan);
    manufacturingPlan.manufacturingCommands.push(manufacturingCommand._id);
    await manufacturingPlan.save();
    return { manufacturingCommand }
}


exports.getAllManufacturingCommands = async (query, user, portal) => {
    // Lấy ra tất cả các lệnh theo quyền được truyền vào hoặc theo user được truyền vào
    // Quyền quản lý nhà máy => xưởng => lệnh tương ứng
    // Trường accountables được phân cho người nên ta phân chia cho người nào thì người đó được quyền xem
    let { currentRole, code, planCode, manufacturingOrderCode, salesOrderCode,
        lotCode, accountables, fromDate, toDate, status, createdAt, page, limit, good, quantity_gt, quantity_lt, manufacturingMills
    } = query;
    if (!currentRole) {
        throw Error("currentRole is not defined")
    }


    // Xử  lý các quyền trước để tìm ra các kế hoạch trong các nhà máy được phân quyền
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    // Kiểm tra userId hiện tại có giám sát hay kiểm định chất lượng lệnh nào không
    let userId = [user._id];
    let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find({
            $or: [
                {
                    qualityControlStaffs: {
                        $elemMatch: {
                            staff: {
                                $in: userId
                            }
                        }
                    }
                }, {
                    accountables: {
                        $in: userId
                    }
                }, {
                    approvers: {
                        $elemMatch: {
                            approver: {
                                $in: userId
                            }
                        }
                    }
                }
            ]
        });
    let manufacturingCommandIds = manufacturingCommand.map(x => x._id);

    let options = {};

    if (manufacturingCommandIds.length == 0) { // Nếu userId không có giám sát, kiểm định chất lượng lệnh nào thì role kiểm soát nhà máy được xét đến
        // Lấy ra tất cả các xưởng mà quyền này được xem
        let listManufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
            manufacturingWorks: {
                $in: listWorksId
            }
        });

        let listMillIds = listManufacturingMills.map(x => x._id);

        options.manufacturingMill = {
            $in: listMillIds
        }
    } else if (manufacturingCommandIds.length != 0 && listWorksId.length != 0) {// Trường hợp cả kiểm soát nhà máy cả kiểm soát lệnh
        let listManufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
            manufacturingWorks: {
                $in: listWorksId
            }
        });

        let listMillIds = listManufacturingMills.map(x => x._id);

        options.$or = [
            {
                _id: {
                    $in: manufacturingCommandIds
                },
            }, {
                manufacturingMill: {
                    $in: listMillIds
                }
            }
        ]
    }
    else { // Trường hợp kiểm soát lệnh không kiểm soát nhà máy
        options._id = {
            $in: manufacturingCommandIds
        }
    }





    // Nếu trong query có truyền theo mã kế hoạch, đơn kinh doanh
    // Lấy ra các kế hoạch
    if (planCode || salesOrderCode) {
        let listManufacturingPlans = await ManufacturingPlan(connect(DB_CONNECTION, portal))
            .find();

        if (planCode) {
            listManufacturingPlans = listManufacturingPlans.filter(plan => plan.code.includes(planCode))
        }
        if (salesOrderCode) {
            let salesOrders = await SalesOrder(connect(DB_CONNECTION, portal)).find({
                code: new RegExp(salesOrderCode, "i")
            });
            let salesOrderIds = salesOrders.map(x => x._id);
            // Tìm ra kế hoạch cho các đơn này
            let manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).find({
                salesOrders: {
                    $in: salesOrderIds
                }
            })
            let ids = manufacturingPlan.map(x => x._id);
            listManufacturingPlans = listManufacturingPlans.filter(x => {
                for (let i = 0; i < ids.length; i++) {
                    if (ids[i].equals(x._id)) {
                        return true;
                    }
                }
                return false
            });
        }

        let listManufacturingPlanIds = listManufacturingPlans.map(x => x._id);

        options.manufacturingPlan = {
            $in: listManufacturingPlanIds
        }
    }

    // Xử lý mã lệnh sản xuất
    if (code) {
        options.code = new RegExp(code, "i");
    }

    // Xử lý mã lô
    if (lotCode) {
        let lots = await Lot(connect(DB_CONNECTION, portal)).find({
            code: new RegExp(lotCode, "i")
        });
        let commandIds = lots.map(x => x.manufacturingCommand);
        options._id = {
            $in: commandIds
        }
    }

    // Xử lý người giám sát
    if (accountables) {
        options.accountables = {
            $in: accountables
        }
    }

    // Xử lý ngày bắt đầu
    if (fromDate) {
        options.startDate = {
            '$gte': getArrayTimeFromString(fromDate)[0],
        }
    }

    // Xử lý ngày kết thúc
    if (toDate) {
        options.startDate = {
            ...options.startDate,
            '$lte': getArrayTimeFromString(toDate)[1]
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

    //  Xử lý lấy lệnh sản xuất theo mặt hàng
    if (good) {
        options.good = good
    }

    if (quantity_gt) {
        options.quantity = {
            '$gt': quantity_gt
        }
    }

    if (quantity_lt) {
        options.quantity = {
            ...options.quantity,
            '$lt': quantity_lt
        }
    }

    if (manufacturingMills) {
        options.manufacturingMill = {
            $in: manufacturingMills
        }
    }

    if (!page || !limit) {
        let manufacturingCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
            .find(options);
        return { manufacturingCommands };
    } else {
        let manufacturingCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
            .paginate(options, {
                limit: limit,
                page: page,
                populate: [{
                    path: "manufacturingPlan",
                    select: "code"
                }, {
                    path: "manufacturingMill",
                    select: "code name"
                }, {
                    path: "responsibles"
                }, {
                    path: "accountables"
                }, {
                    path: "creator"
                }, {
                    path: "good",
                    select: "code name baseUnit numberExpirationDate materials",
                    populate: [{
                        path: "materials.good",
                        select: "code name baseUnit",
                    }]
                }, {
                    path: "qualityControlStaffs.staff"
                }, {
                    path: "approvers.approver"
                }],
                sort: {
                    "updatedAt": "desc"
                }
            });
        return { manufacturingCommands }
    }
}

exports.getManufacturingCommandById = async (id, portal) => {
    let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .findById(id)
        .lean()
        .populate([{
            path: "manufacturingPlan",
            select: "code",
            populate: [{
                path: "salesOrders",
                select: "code"
            }]
        }, {
            path: "manufacturingMill",
            select: "code name"
        }, {
            path: "responsibles"
        }, {
            path: "accountables"
        }, {
            path: "creator"
        }, {
            path: "approvers.approver"
        }, {
            path: "good",
            select: "code name baseUnit materials",
            populate: [{
                path: "materials.good",
                select: "code name baseUnit",
            }]
        }, {
            path: "qualityControlStaffs.staff"
        }]);
    if (!manufacturingCommand) {
        throw Error("ManufacturingCommand is not existing");
    }
    let lot = await Lot(connect(DB_CONNECTION, portal)).find({
        manufacturingCommand: manufacturingCommand._id
    }).select('code _id manufacturingCommand');
    if (lot) {
        // await manufacturingCommand.markModified('attribute');
        manufacturingCommand.lot = lot;
    }

    return { manufacturingCommand }
}

function findIndexOfStaff(array, id) {
    let result = -1;
    array.forEach((element, index) => {
        if (element.staff == id) {
            result = index;
        }
    });
    return result;
}

function findIndexOfApprover(array, id) {
    let result = -1;
    array.forEach((element, index) => {
        if (element.approver == id) {
            result = index;
        }
    });
    return result;
}

exports.editManufaturingCommand = async (id, data, portal) => {
    let oldManufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .findById(id);
    if (!oldManufacturingCommand) {
        throw Error("manufacturing Command is not existing");
    }
    oldManufacturingCommand.code = data.code ? data.code : oldManufacturingCommand.code;
    oldManufacturingCommand.manufacturingPlan = data.manufacturingPlan ? data.manufacturingPlan : oldManufacturingCommand.manufacturingPlan;
    oldManufacturingCommand.manufacturingMill = data.manufacturingMill ? data.manufacturingMill : oldManufacturingCommand.manufacturingMill;
    oldManufacturingCommand.startDate = data.startDate ? data.startDate : oldManufacturingCommand.startDate;
    oldManufacturingCommand.endDate = data.endDate ? data.endDate : oldManufacturingCommand.endDate;
    oldManufacturingCommand.startTurn = data.startTurn ? data.startTurn : oldManufacturingCommand.startTurn;
    oldManufacturingCommand.endTurn = data.endTurn ? data.endTurn : oldManufacturingCommand.endTurn;
    oldManufacturingCommand.good = data.good ? data.good : oldManufacturingCommand.good;
    oldManufacturingCommand.quantity = data.quantity ? data.quantity : oldManufacturingCommand.quantity;
    oldManufacturingCommand.creator = data.creator ? data.creator : oldManufacturingCommand.creator;
    oldManufacturingCommand.responsibles = data.responsibles ?
        data.responsibles.map(x => {
            return x
        }) : oldManufacturingCommand.responsibles;
    oldManufacturingCommand.accountables = data.accountables ?
        data.accountables.map(x => {
            return x
        }) : oldManufacturingCommand.accountables;
    oldManufacturingCommand.description = data.description ? data.description : oldManufacturingCommand.description

    // Xử lý trường hợp kiểm định chất lượng lệnh sản xuất
    if (data.qualityControlStaff) {
        let index = findIndexOfStaff(oldManufacturingCommand.qualityControlStaffs, data.qualityControlStaff.staff);
        if (index !== -1) {
            oldManufacturingCommand.qualityControlStaffs[index].time = new Date(Date.now());
            oldManufacturingCommand.qualityControlStaffs[index].status = data.qualityControlStaff.status;
            oldManufacturingCommand.qualityControlStaffs[index].content = data.qualityControlStaff.content;
        }
    } else {
        oldManufacturingCommand.qualityControlStaffs = oldManufacturingCommand.qualityControlStaffs;
    }
    oldManufacturingCommand.status = data.status ? data.status : oldManufacturingCommand.status;
    if (data.approver) {
        let index = findIndexOfApprover(oldManufacturingCommand.approvers, data.approver);
        if (index != -1) {
            oldManufacturingCommand.approvers[index].approver = data.approver;
            oldManufacturingCommand.approvers[index].approvedTime = new Date(Date.now());
        }
    }
    oldManufacturingCommand.finishedProductQuantity = data.finishedProductQuantity ? data.finishedProductQuantity : oldManufacturingCommand.finishedProductQuantity;
    oldManufacturingCommand.substandardProductQuantity = data.substandardProductQuantity ? data.substandardProductQuantity : oldManufacturingCommand.substandardProductQuantity;
    oldManufacturingCommand.finishedTime = data.finishedTime ? data.finishedTime : oldManufacturingCommand.finishedTime;
    await oldManufacturingCommand.save();

    if (data.status == 3) {
        let manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).findById({
            _id: oldManufacturingCommand.manufacturingPlan
        });
        if (manufacturingPlan.status == 2) {
            manufacturingPlan.status = 3;
            await manufacturingPlan.save();
        }
    }
    if (data.status == 4) {
        let manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).findById({
            _id: oldManufacturingCommand.manufacturingPlan
        }).populate([{
            path: 'manufacturingCommands'
        }]);
        if (manufacturingPlan.status == 3) {
            let result = true;
            for (let i = 0; i < manufacturingPlan.manufacturingCommands.length; i++) {
                if (manufacturingPlan.manufacturingCommands[i].status != 4 && manufacturingPlan.manufacturingCommands[i].status != 5) {
                    result = false;
                }
            }
            if (result) {
                manufacturingPlan.status = 4;
                await manufacturingPlan.save();
            }
        }
    }

    if (data.status == 5) {
        // Thực hiện xóa lịch của xưởng và của người
        await deleteCommandFromSchedule(oldManufacturingCommand, portal);
        // Kiểm tra nếu đã lên phiếu đề nghị mua hàng cho lệnh này mà chưa xư lý thì cho thành hủy
        const purchasingRequest = await PurchasingRequest(connect(DB_CONNECTION, portal)).findOne({
            manufacturingCommand: oldManufacturingCommand._id
        });
        if (purchasingRequest && purchasingRequest.status == 1) {
            purchasingRequest.status = 3;
            await purchasingRequest.save();
        }

    }

    let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .findById({ _id: oldManufacturingCommand._id })
        .populate([{
            path: "manufacturingPlan",
            select: "code"
        }, {
            path: "manufacturingMill",
            select: "code name"
        }, {
            path: "responsibles"
        }, {
            path: "accountables"
        }, {
            path: "approvers.approver"
        }, {
            path: "creator"
        }, {
            path: "qualityControlStaffs.staff"
        }, {
            path: "good",
            select: "code name baseUnit numberExpirationDate materials",
            populate: [{
                path: "materials.good",
                select: "code name baseUnit",
            }]
        }]);

    return { manufacturingCommand }

}

exports.getNumberCommands = async (query, portal) => {
    const { currentRole, manufacturingWorks, fromDate, toDate } = query;
    if (!currentRole) {
        throw Error("CurrentRole is not defined");
    }
    // Lấy ra list các nhà máy là currentRole là trưởng phòng hoặc currentRole là role quản lý khác
    // Lấy ra list nhà máy mà currentRole là quản đốc nhà máy
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    if (manufacturingWorks) {
        listWorksId = manufacturingWorks;
    }

    let options = {};

    let listManufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
        manufacturingWorks: {
            $in: listWorksId
        }
    });

    let listMillIds = listManufacturingMills.map(x => x._id);

    options.manufacturingMill = {
        $in: listMillIds
    }

    if (fromDate) {
        options.createdAt = {
            $gte: getArrayTimeFromString(fromDate)[0]
        }
    }

    if (toDate) {
        options.createdAt = {
            ...options.createdAt,
            $lte: getArrayTimeFromString(toDate)[1]
        }
    }

    let commands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find(options);
    const totalCommands = commands.length;
    // Lọc ra Command chậm tiến độ
    let moment = require('moment');
    let date = new Date(moment().subtract(1, "days"));

    let arrayslowCommands = [];
    for (let i = 0; i < commands.length; i++) {
        if ((commands[i].status == 1 || commands[i].status == 2 || commands[i].status == 6) && (commands[i].startDate < date)
            || (commands[i].status == 3 && commands[i].endDate < date)
        ) {
            arrayslowCommands.push(commands[i])
        }
    }

    const slowCommands = arrayslowCommands.length;
    const trueCommands = totalCommands - slowCommands;

    return { totalCommands, trueCommands, slowCommands }

}

exports.getNumberCommandsStatus = async (query, portal) => {
    const { currentRole, manufacturingWorks, fromDate, toDate } = query;
    if (!currentRole) {
        throw Error("CurrentRole is not defined");
    }
    // Lấy ra list các nhà máy là currentRole là trưởng phòng hoặc currentRole là role quản lý khác
    // Lấy ra list nhà máy mà currentRole là quản đốc nhà máy
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    if (manufacturingWorks) {
        listWorksId = manufacturingWorks;
    }

    let options = {};

    let listManufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
        manufacturingWorks: {
            $in: listWorksId
        }
    });

    let listMillIds = listManufacturingMills.map(x => x._id);

    options.manufacturingMill = {
        $in: listMillIds
    }

    if (fromDate) {
        options.createdAt = {
            $gte: getArrayTimeFromString(fromDate)[0]
        }
    }

    if (toDate) {
        options.createdAt = {
            ...options.createdAt,
            $lte: getArrayTimeFromString(toDate)[1]
        }
    }

    options.status = 6;
    const command6 = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find(options).count();
    options.status = 1;
    const command1 = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find(options).count();
    options.status = 2;
    const command2 = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find(options).count();
    options.status = 3;
    const command3 = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find(options).count();
    options.status = 4;
    const command4 = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find(options).count();
    options.status = 5;
    const command5 = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find(options).count();
    return { command6, command1, command2, command3, command4, command5 }
}

exports.getTopTenProduct = async (query, portal) => {
    const { currentRole, manufacturingWorks, fromDate, toDate } = query;
    if (!currentRole) {
        throw Error("CurrentRole is not defined");
    }
    // Lấy ra list các nhà máy là currentRole là trưởng phòng hoặc currentRole là role quản lý khác
    // Lấy ra list nhà máy mà currentRole là quản đốc nhà máy
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    if (manufacturingWorks) {
        listWorksId = manufacturingWorks;
    }

    let options = {};

    let listManufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
        manufacturingWorks: {
            $in: listWorksId
        }
    });

    let listMillIds = listManufacturingMills.map(x => x._id);

    options.manufacturingMill = {
        $in: listMillIds
    }

    if (fromDate) {
        options.createdAt = {
            $gte: getArrayTimeFromString(fromDate)[0]
        }
    }

    if (toDate) {
        options.createdAt = {
            ...options.createdAt,
            $lte: getArrayTimeFromString(toDate)[1]
        }
    }
    options.status = {
        $in: [3, 4]
    }

    const listCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find(options).populate([{
            path: 'good',
            select: 'code name baseUnit'
        }]);

    let topTenProduct = [];

    for (let i = 0; i < listCommands.length; i++) {
        let index = topTenProduct.findIndex(x => x._id.equals(listCommands[i].good._id));
        if (index != -1) {
            let quantity = topTenProduct[index].quantity + listCommands[i].quantity;
            topTenProduct[index].quantity = quantity;
        } else {
            topTenProduct.push({
                _id: listCommands[i].good._id,
                code: listCommands[i].good.code,
                name: listCommands[i].good.name,
                baseUnit: listCommands[i].good.baseUnit,
                quantity: listCommands[i].quantity
            });
        }
    }

    topTenProduct = topTenProduct.sort((a, b) => {
        return b.quantity - a.quantity
    });
    return topTenProduct;
}

exports.getFluctuatingProduct = async (query, portal) => {
    const { currentRole, manufacturingWorks, fromMonth, toMonth, good } = query;
    if (!currentRole) {
        throw Error("CurrentRole is not defined");
    }
    // Lấy ra list các nhà máy là currentRole là trưởng phòng hoặc currentRole là role quản lý khác
    // Lấy ra list nhà máy mà currentRole là quản đốc nhà máy
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    if (manufacturingWorks) {
        listWorksId = manufacturingWorks;
    }

    let options = {};

    let listManufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
        manufacturingWorks: {
            $in: listWorksId
        }
    });

    let listMillIds = listManufacturingMills.map(x => x._id);

    options.manufacturingMill = {
        $in: listMillIds
    }

    if (good) {
        options.good = good
    }

    options.status = 4;

    YearMonthfrom = formatToTimeZoneDate(fromMonth);
    YearMonthto = formatToTimeZoneDate(toMonth);
    let listMonths = dateRange(YearMonthfrom, YearMonthto);


    let fluatingProduct = [];
    for (let i = 0; i < listMonths.length; i++) {
        let currentMonth = listMonths[i];
        let yearMonth = currentMonth.split("-");
        let startMonth = new Date(yearMonth[0], yearMonth[1] - 1, 1);
        let endMonth = new Date(yearMonth[0], yearMonth[1], 0);
        options.updatedAt = {
            $gte: startMonth,
            $lte: endMonth
        }

        let manufacturingCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
            .find(options);
        let fluatingMonth = getFluatingMonthFromCommands(manufacturingCommands, listMonths[i]);
        fluatingProduct.push(fluatingMonth);
    }
    return fluatingProduct;
}

function getFluatingMonthFromCommands(listCommands, month) {
    let fluatingMonth = {
        finishedProductQuantity: 0,
        substandardProductQuantity: 0,
        month: month
    };
    for (let i = 0; i < listCommands.length; i++) {
        fluatingMonth.finishedProductQuantity += listCommands[i].finishedProductQuantity ? listCommands[i].finishedProductQuantity : 0;
        fluatingMonth.substandardProductQuantity += listCommands[i].substandardProductQuantity ? listCommands[i].substandardProductQuantity : 0;
    }
    return fluatingMonth;
}

function dateRange(startDate, endDate) {
    var start = startDate.split('-');
    var end = endDate.split('-');
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            var month = j + 1;
            var displayMonth = month < 10 ? '0' + month : month;
            dates.push([i, displayMonth].join('-'));
        }
    }
    return dates;
}