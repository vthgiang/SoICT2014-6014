const {
    BusinessDepartment
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);


//Tạo phòng kinh doanh
exports.createBusinessDepartment = async (data, portal) => {
    let newBusinessDepartment = await BusinessDepartment(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        managers: data.managers,
        organizationalUnit: data.organizationalUnit,
        status: data.status,
        description: data.description,
        type: data.type
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
        }, {
            path: 'managers'
        }]);

    return {businessDepartment};
}

//Sửa thông tin phòng kinh doanh
exports.editBusinessDepartment = async (id, data, portal) => {
    let oldBusinessDepartment = await BusinessDepartment(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldBusinessDepartment) {
        throw Error("Business Department is not existing")
    }

    oldBusinessDepartment.code = data.code;
    oldBusinessDepartment.managers = data.managers;
    oldBusinessDepartment.organizationalUnit = data.organizationalUnit;
    oldBusinessDepartment.status = data.status;
    oldBusinessDepartment.description = data.description;
    oldBusinessDepartment.type = data.type;

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
        }, {
            path: 'managers'
        }]);

    return {businessDepartment};
}

//Xem danh sách phòng kinh doanh
exports.getAllBusinessDepartments = async (query, portal) => {
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

    if (query.type) {
        option.type = query.type
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
            }, {
                path: 'managers'
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
                }, {
                    path: 'managers'
                }]
            })
        return { allBusinessDepartments }
    }
}