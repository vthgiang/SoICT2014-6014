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
                path: "operations.resources.workerRole",
                select: "name"
            }, {
                path: "operations.resources.machine",
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
            .find(option)
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
            path: "operations.resources.workerRole",
            select: "name",
        }, {
            path: "operations.resources.machine",
            select: "code assetName cost estimatedTotalProduction"
        }, {
            path: "goods",
            select: "name"
        }]);

    if (!manufacturingRouting) {
        throw Error("Manufacturing Routing is not existing");
    }
    
    const operationDocs = manufacturingRouting._doc.operations
    

    const operations = await Promise.all(operationDocs.map(async operation => {
        const resources = await Promise.all(operation.resources.map(async res => {
            const workerRole = res.workerRole;
            const workers = await UserRole(connect(DB_CONNECTION, portal))
                .find({ roleId: workerRole })
                .populate({
                    path: "userId",
                    select: "name email"
                });
            return {
                ...res._doc,
                workers
            }
        }))
        return {
            ...operation._doc,
            resources
        }
    }))

    const doc = {
        ...manufacturingRouting._doc,
        operations
    }

    return { manufacturingRouting: doc }
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
        }, {
            path: "operations.resources.workerRole",
            select: "name"
        }, {
            path: "operations.resources.machine",
            select: "assetName"
        }]);

    if (!manufacturingRoutings) {
        throw Error("Manufacturing Routing is not existing");
    }

    return { manufacturingRoutings }
}

// Lấy tất cả công nhân và máy khả dụng của một routing
exports.getAvailableResources = async (id, portal) => {
    let routing = await ManufacturingRouting(connect(DB_CONNECTION, portal))
        .findById(id)
    
    const resources = await Promise.all(routing.operations.map(async operation => {
        const workerRoles = operation.resources.map(res => res.workerRole);
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
