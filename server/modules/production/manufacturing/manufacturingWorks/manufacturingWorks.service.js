const {
    ManufacturingWorks,
    ManufacturingMill,
    OrganizationalUnit,
    Role,
    UserRole,
    Asset
} = require(`../../../../models`);


const { getAllEmployeeOfUnitByRole } = require("../../../super-admin/user/user.service");


const {
    connect
} = require(`../../../../helpers/dbHelper`);

// Thêm mới nhà máy sản xuất
exports.createManufacturingWorks = async (data, portal) => {
    let newManfacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
        status: data.status,
        manufacturingMills: data.manufacturingMills,
        description: data.description,
        organizationalUnit: data.organizationalUnit,
        turn: data.turn,
        manageRoles: data.manageRoles.map(role => {
            return role
        })
    });

    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById({ _id: newManfacturingWorks._id })
        .populate([{
            path: "manufacturingMills", select: "code name teamLeader description"
        }, {
            path: "organizationalUnit",
            populate: [
                {
                    path: 'managers',
                    populate: [{
                        path: "users",
                        populate: [{
                            path: "userId"
                        }]
                    }]
                },
                { path: 'deputyManagers' },
                { path: 'employees' }
            ]
        }]);

    return { manufacturingWorks }
}

// Lấy ra tất cả các nhà máy sản xuất
exports.getAllManufacturingWorks = async (query, portal) => {
    let { page, limit } = query;
    // let option = {};
    // if (query.code) {
    //     option.code = {
    //         $regex: query.code,
    //         $options: "i"
    //     }
    // }
    // if (query.name) {
    //     option.name = {
    //         $regex: query.name,
    //         $options: "i"
    //     }

    // Tương đương với đoạn code

    let option = {};
    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }
    if (query.name) {
        option.name = new RegExp(query.name, "i")
    }
    if (query.status) {
        option.status = query.status
    }

    if (query.currentRole) {
        // Nếu truyền vào currentRole thì sẽ lấy ra tất cả các nhà máy mà role đó có quyền quản lý
        let role = [query.currentRole];
        const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
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
        option._id = {
            $in: listWorksId
        }
    }

    if (!page || !limit) {
        let docs = await ManufacturingWorks(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([{
                path: "manufacturingMills", select: "code name teamLeader description",
            }, {
                path: "organizationalUnit",
                populate: [
                    {
                        path: 'managers',
                        populate: [{
                            path: "users",
                            populate: [{
                                path: "userId"
                            }]
                        }]
                    },
                    { path: 'deputyManagers' },
                    { path: 'employees' }
                ]
            }]);
        let allManufacturingWorks = {};
        allManufacturingWorks.docs = docs;
        return { allManufacturingWorks }
    } else {
        let allManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [{
                    path: "manufacturingMills", select: 'code name description'
                }, {
                    path: "organizationalUnit",
                    populate: [{
                        path: 'managers',
                        populate: [{
                            path: "users",
                            populate: [{
                                path: "userId"
                            }]
                        }]
                    },
                    { path: 'deputyManagers' },
                    { path: 'employees' }]
                }]
            })
        return { allManufacturingWorks }
    }
}

// Xem chi tiết 1 nhà máy sản xuất
exports.getManufacturingWorksById = async (id, portal) => {
    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([{
            path: "manufacturingMills", select: "code name description"
        }, {
            path: "organizationalUnit",
            populate: [{
                path: 'managers',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            },
            { path: 'deputyManagers' },
            { path: 'employees' }]
        }, {
            path: 'manageRoles'
        }]);

    const employees = await getAllEmployeesOfWorks(id, portal);
    const assets = await getAllAssetsOfManufacturingWorks(id, portal);

    if (!manufacturingWorks) {
        throw Error("ManufacturingWorks is not existing")
    }
    return { manufacturingWorks, employees, assets }
}

// Xóa nhà máy sản xuất
exports.deleteManufacturingWorks = async (id, portal) => {
    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
    if (!manufacturingWorks) {
        throw Error("ManufacturingWorks is not existing")
    }
    return { manufacturingWorks }
}

// Sửa thông tin nhà máy sản xuất
exports.editManufacturingWorks = async (id, data, portal) => {
    let oldManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldManufacturingWorks) {
        throw Error("manufacturingWorks is not existing")
    }

    oldManufacturingWorks.code = data.code ? data.code : oldManufacturingWorks.code;
    oldManufacturingWorks.name = data.name ? data.name : oldManufacturingWorks.name;
    oldManufacturingWorks.organizationalUnit = data.organizationalUnit ? data.organizationalUnit : oldManufacturingWorks.organizationalUnit;
    oldManufacturingWorks.phoneNumber = data.phoneNumber ? data.phoneNumber : oldManufacturingWorks.phoneNumber;
    oldManufacturingWorks.address = data.address ? data.address : oldManufacturingWorks.address;
    oldManufacturingWorks.turn = data.turn ? data.turn : oldManufacturingWorks.turn;
    oldManufacturingWorks.description = data.description ? data.description : oldManufacturingWorks.description;
    oldManufacturingWorks.status = data.status ? data.status : oldManufacturingWorks.status;
    oldManufacturingWorks.manageRoles = data.manageRoles ? data.manageRoles.map(role => { return role }) : oldManufacturingWorks.manageRoles


    await oldManufacturingWorks.save();

    if (data.status == 0 && oldManufacturingWorks.manufacturingMills.length != 0) {
        oldManufacturingWorks.manufacturingMills.forEach(async millId => {
            let mill = await ManufacturingMill(connect(DB_CONNECTION, portal)).findById({ _id: millId });
            if (mill) {
                mill.status = 0;
                await mill.save();
            }
        });
        // for (let i = 0; i < oldManufacturingWorks.manufacturingMills.length; i++) {
        //     let mill = await ManufacturingMill(connect(DB_CONNECTION, portal)).findById({ _id: oldManufacturingWorks.manufacturingMills[i] });
        //     if (mill) {
        //         mill.status = 0;
        //         await mill.save();
        //     }

        // }
    }

    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById({ _id: oldManufacturingWorks.id })
        .populate([{
            path: "organizationalUnit",
            populate: [{
                path: 'managers',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            },
            { path: 'deputyManagers' },
            { path: 'employees' }]
        }, {
            path: "manufacturingMills", select: "code teamLeader name"
        }]);

    return { manufacturingWorks }
}

exports.getUserByWorksManageRole = async (currentRole, portal) => {
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

    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .find({
            _id: {
                $in: listWorksId
            }
        })
        .populate([{
            path: "organizationalUnit",
        }]);
    let employees = [];
    for (let i = 0; i < manufacturingWorks.length; i++) {
        let emplyeeArray = await getAllEmployeeOfUnitByRole(portal, manufacturingWorks[i].organizationalUnit.employees);
        employees = [...employees, ...emplyeeArray]
    }
    return { employees };

}

// Lấy ra tất cả các role employee của nhà máy sản xuất
exports.getAllManufacturingEmployeeRoles = async (id, portal) => {
    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate({
            path: "organizationalUnit",
            populate: [
                { path: 'employees' }
            ]
        })
    
    if (!manufacturingWorks) {
        throw Error("ManufacturingWorks is not existing")
    }

    let employees = manufacturingWorks.organizationalUnit.employees;
    
    let roles = await Role(connect(DB_CONNECTION, portal))
        .find({_id: { $in: employees }});

    return { roles }
}

// Lấy ra tất cả các employee của nhà máy sản xuất
const getAllEmployeesOfWorks = async (id, portal) => {
    const manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate({
            path: "organizationalUnit",
            populate: [
                { path: 'employees' }
            ]
        })
    
    if (!manufacturingWorks) {
        throw Error("ManufacturingWorks is not existing")
    }

    const employeeRoles = manufacturingWorks.organizationalUnit.employees;
    
    const userRoles = await UserRole(connect(DB_CONNECTION, portal))
        .find({ roleId: { $in: employeeRoles } })
        .populate([{
            path: 'userId',
            select: 'name email'
        }])
    
    const employees = userRoles.map(userRole => ({
        _id: userRole.userId._id,
        name: userRole.userId.name
    }))
    
    return employees
}

// Lấy ra tất cả các máy móc được giao cho nhà máy sản xuất
const getAllAssetsOfManufacturingWorks = async (id, portal) => {
    const manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById(id)

    const organizationalUnitId = manufacturingWorks.organizationalUnit;

    const assets = await Asset(connect(DB_CONNECTION, portal))
        .find({ assignedToOrganizationalUnit: organizationalUnitId })

    return assets
}
