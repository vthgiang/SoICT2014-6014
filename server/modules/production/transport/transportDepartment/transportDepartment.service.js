const {
    TransportDepartment
} = require('../../../../models');

const {
    connect
} = require(`../../../../helpers/dbHelper`);

/**
 * Tạo mới cấu hình đơn vị
 * @param {*} portal 
 * @param {*} data 
 * @param {*} userId 
 * @returns 
 */
exports.createTransportDepartment = async (portal, data) => {
    let newTransportDepartment;
    if (data && data.length !== 0) {
        newTransportDepartment = await TransportDepartment(connect(DB_CONNECTION, portal)).create({
            organizationalUnit: data.organizationalUnit,
            role: data.role,
        });
        
    }
    let transportDepartment = await TransportDepartment(connect(DB_CONNECTION, portal)).findById({ _id: newTransportDepartment._id })
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
                                        {
                                            path: 'deputyManagers',
                                            populate: [{
                                                path: "users",
                                                populate: [{
                                                    path: "userId"
                                                }]
                                            }]
                                        },{
                                            path: 'employees',
                                            populate: [{
                                                path: "users",
                                                populate: [{
                                                    path: "userId"
                                                }]
                                            }]
                                        }]
                                    }])
    return transportDepartment;
}

exports.getAllTransportDepartments = async (portal, data) => {
    let keySearch = {};
    // if (data?.exampleName?.length > 0) {
    //     keySearch = {
    //         exampleName: {
    //             $regex: data.exampleName,
    //             $options: "i"
    //         }
    //     }
    // }
    let page, limit;
    page = data?.page ? Number(data.page) : 1;
    limit = data?.limit ? Number(data.limit) : 20;

    let totalList = await TransportDepartment(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let departments = await TransportDepartment(connect(DB_CONNECTION, portal)).find(keySearch)
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
            {
                path: 'deputyManagers',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            },{
                path: 'employees',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            }]
        }])
        .skip((page - 1) * limit)
        .limit(limit);
    return { 
        data: departments, 
        totalList 
    }
}
