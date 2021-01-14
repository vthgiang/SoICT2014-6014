const {
    ManufacturingCommand, ManufacturingPlan, ManufacturingWorks, OrganizationalUnit,
    ManufacturingOrder, SalesOrder, Lot, ManufacturingMill
} = require(`../../../../models`);
const {
    connect
} = require(`../../../../helpers/dbHelper`);

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
                    select: "code name baseUnit numberExpirationDate"
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
                populate: [{
                    path: 'creator', select: 'name'
                }, {
                    path: 'customer', select: 'name taxNumber'
                }, {
                    path: 'goods.good',
                    populate: [{
                        path: 'manufacturingMills.manufacturingMill'
                    }]
                }, {
                    path: 'goods.manufacturingWorks', select: 'code name address description'
                }, , {
                    path: 'goods.discounts.bonusGoods.good', select: 'code name baseUnit'
                }, {
                    path: 'goods.discounts.discountOnGoods.good', select: 'code name baseUnit'
                }, {
                    path: 'discounts.bonusGoods.good', select: 'code name baseUnit'
                }, {
                    path: 'quote', select: 'code createdAt'
                }]
            }, {
                path: "approvers",
                populate: [{
                    path: "approver"
                }]
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
            select: "code name baseUnit"
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
    oldManufacturingCommand.finishedProductQuantity = data.finishedProductQuantity ? data.finishedProductQuantity : oldManufacturingCommand.finishedProductQuantity;
    oldManufacturingCommand.substandardProductQuantity = data.substandardProductQuantity ? data.substandardProductQuantity : oldManufacturingCommand.substandardProductQuantity;
    oldManufacturingCommand.finishedTime = data.finishedTime ? data.finishedTime : oldManufacturingCommand.finishedTime;


    await oldManufacturingCommand.save();

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
            path: "creator"
        }, {
            path: "qualityControlStaffs.staff"
        }, {
            path: "good",
            select: "code name baseUnit numberExpirationDate"
        }]);

    return { manufacturingCommand }

}