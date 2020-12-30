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
        manager: data.manager,
        organizationalUnit: data.organizationalUnit,
        status: data.status,
        description: data.description,
    })

    let businessDepartment = await BusinessDepartment(connect(DB_CONNECTION, portal)).findById({ _id: newBusinessDepartment._id })
        .populate([{
            path: "organizationalUnit",
            populate: [{
                path: 'deans',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            },
            { path: 'viceDeans' },
            { path: 'employees' }]
        }, {
            path: 'manager'
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
    oldBusinessDepartment.manager = data.manager;
    oldBusinessDepartment.organizationalUnit = data.organizationalUnit;
    oldBusinessDepartment.status = data.status;
    oldBusinessDepartment.description = data.description;

    await oldBusinessDepartment.save();

    let businessDepartment = await BusinessDepartment(connect(DB_CONNECTION, portal)).findById({ _id: oldBusinessDepartment._id })
        .populate([{
            path: "organizationalUnit",
            populate: [{
                path: 'deans',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            },
            { path: 'viceDeans' },
            { path: 'employees' }]
        }, {
            path: 'manager'
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

    if (!page || !limit) {
        let allBusinessDepartments = await BusinessDepartment(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([{
                path: "organizationalUnit",
                populate: [{
                    path: 'deans',
                    populate: [{
                        path: "users",
                        populate: [{
                            path: "userId"
                        }]
                    }]
                },
                { path: 'viceDeans' },
                { path: 'employees' }]
            }, {
                path: 'manager'
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
                        path: 'deans',
                        populate: [{
                            path: "users",
                            populate: [{
                                path: "userId"
                            }]
                        }]
                    },
                    { path: 'viceDeans' },
                    { path: 'employees' }]
                }, {
                    path: 'manager'
                }]
            })
        return { allBusinessDepartments }
    }
}