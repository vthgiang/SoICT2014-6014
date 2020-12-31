const {
    AdminDepartment
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);


//Tạo phòng kinh doanh
exports.createAdminDepartment = async (data, portal) => {
    let newAdminDepartment = await AdminDepartment(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        organizationalUnit: data.organizationalUnit,
        status: data.status,
        description: data.description,
    })

    let adminDepartment = await AdminDepartment(connect(DB_CONNECTION, portal)).findById({ _id: newAdminDepartment._id })
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
        }]);

    return {adminDepartment};
}

//Sửa thông tin phòng kinh doanh
exports.editAdminDepartment = async (id, data, portal) => {
    let oldAdminDepartment = await AdminDepartment(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldAdminDepartment) {
        throw Error("Admin Department is not existing")
    }

    oldAdminDepartment.code = data.code;
    oldAdminDepartment.organizationalUnit = data.organizationalUnit;
    oldAdminDepartment.status = data.status;
    oldAdminDepartment.description = data.description;

    await oldAdminDepartment.save();

    let adminDepartment = await AdminDepartment(connect(DB_CONNECTION, portal)).findById({ _id: oldAdminDepartment._id })
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
        }]);

    return {adminDepartment};
}

//Xem danh sách phòng kinh doanh
exports.getAllAdminDepartments = async (query, portal) => {
    let { page, limit } = query;

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

    if (!page || !limit) {
        let allAdminDepartments = await AdminDepartment(connect(DB_CONNECTION, portal))
            .find(option)
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
            }]);

        return { allAdminDepartments }
    } else {
        let allAdminDepartments = await AdminDepartment(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [{
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
        return { allAdminDepartments }
    }
}