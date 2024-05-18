const {
    ManufacturingRouting,
    OrganizationalUnit,
    ManufacturingWorks,
    UserRole
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

exports.getAllManufacturingRoutings = async (query, portal) => {
    let option = {};
    let { currentRole, page, limit } = query;

    if (currentRole) {
        let role = [currentRole];
        const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
        let organizationalUnitId = departments.map(department => department._id);
        let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
            organizationalUnit: {
                $in: organizationalUnitId
            }
        });

        // Lấy ra các nhà máy mà currentRole quản lý
        let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
            manageRoles: {
                $in: role
            }
        })
        listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

        let listWorksId = listManufacturingWorks.map(x => x._id);
        option.manufacturingWorks = {
            $in: listWorksId
        }
    }


    if (!page || !limit) {
        let docs = await ManufacturingRouting(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([{
                path: "manufacturingWorks",
                select: "name"
            }, {
                path: "manufacturingMill",
                select: "name"
            }, {
                path: "workers.workerRole",
                select: "name"
            }, {
                path: "machines.machine",
                select: "name"
            }, {
                path: "creator",
                select: "name email"
            }, {
                path: "goods",
                select: "name"
            }]);
        let manufacturingRoutings = {};
        manufacturingRoutings.docs = docs;
        return { manufacturingRoutings }
    } else {
        let manufacturingRoutings = await ManufacturingRouting(connect(DB_CONNECTION, portal))
            .populate([{
                path: "manufacturingWorks",
                select: "name"
            }]);
        return { manufacturingRoutings }
    }
}

exports.getManufacturingRoutingById = async (id, portal) => {
    let manufacturingRouting = await ManufacturingRouting(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
        .populate([{
            path: "manufacturingWorks",
            select: "name"
        }, {
            path: "operations.manufacturingMill",
            select: "name"
        }, {
            path: "operations.workers.workerRole",
            select: "name"
        }, {
            path: "operations.machines.machine",
            select: "assetName"
        }, {
            path: "goods",
            select: "name"
        }]);

    if (!manufacturingRouting) {
        throw Error("Manufacturing Routing is not existing");
    }

    return { manufacturingRouting }
}

exports.createManufacturingRouting = async (data, portal) => {
    let manufacturingRouting = await ManufacturingRouting(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        manufacturingWorks: data.manufacturingWorks,
        goods: data.goods,
        creator: data.creator,
        status: data.status,
        description: data.description,
        operations: data.operations
    });

    return { manufacturingRouting }
}

// Tìm tất cả routing của 1 sản phẩm
exports.getManufacturingRoutingsByGood = async (goodId, portal) => {
    let manufacturingRoutings = await ManufacturingRouting(connect(DB_CONNECTION, portal))
        .find({ goods: { $in: [goodId] } })
        .populate([{
            path: "operations.manufacturingMill",
            select: "name"
        }]);

    if (!manufacturingRoutings) {
        throw Error("Manufacturing Routing is not existing");
    }

    return { manufacturingRoutings }
}

// Lấy tất cả công nhân và máy có thể sử dụng của 1 routing
exports.getAvailableResources = async (id, portal) => {
    let routing = await ManufacturingRouting(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
    
    const resources = await Promise.all(routing.operations.map(async operation => {
        const workerRoles = operation.workers.map(worker => worker.workerRole);
        let workers = await UserRole(connect(DB_CONNECTION, portal))
            .find({ roleId: { $in: workerRoles } })
            .populate({
                path: "userId",
                select: "name email"
            });
        
        workers = workers.map(worker => {
            return {
                userId: worker.userId._id,
                name: worker.userId.name,
                email: worker.userId.email
            }
        });

        return {
            operationId: operation.id,
            workers
        }
    }));

    return { resources }
}
