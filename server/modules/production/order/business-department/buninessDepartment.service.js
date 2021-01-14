const {
    BusinessDepartment
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);


//Tạo phòng kinh doanh
exports.createBusinessDepartment = async (data, portal) => {
    let newBusinessDepartment = await BusinessDepartment(connect(DB_CONNECTION, portal)).create({
        organizationalUnit: data.organizationalUnit,
        role: data.role
    })

    let businessDepartment = await BusinessDepartment(connect(DB_CONNECTION, portal)).findById({ _id: newBusinessDepartment._id })
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

    return {businessDepartment};
}

//Sửa thông tin phòng kinh doanh
exports.editBusinessDepartment = async (id, data, portal) => {
    let oldBusinessDepartment = await BusinessDepartment(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldBusinessDepartment) {
        throw Error("Business Department is not existing")
    }
    oldBusinessDepartment.organizationalUnit = data.organizationalUnit;
    oldBusinessDepartment.role = data.role;

    await oldBusinessDepartment.save();

    let businessDepartment = await BusinessDepartment(connect(DB_CONNECTION, portal)).findById({ _id: oldBusinessDepartment._id })
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

    return {businessDepartment};
}

//Xem danh sách phòng kinh doanh
exports.getAllBusinessDepartments = async (query, portal) => {
    let { page, limit } = query;

    let option = {};
    if (query.role) {
        option.role = query.role
    }

    if (!page || !limit) {
        let allBusinessDepartments = await BusinessDepartment(connect(DB_CONNECTION, portal))
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

        return { allBusinessDepartments }
    } else {
        let allBusinessDepartments = await BusinessDepartment(connect(DB_CONNECTION, portal))
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
        return { allBusinessDepartments }
    }
}