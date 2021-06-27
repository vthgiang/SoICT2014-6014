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
            type: data.type,
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
                                    .populate([
                                        {
                                            path: 'type.roleOrganizationalUnit',
                                            populate: [{
                                                path: "users",
                                                populate: [{
                                                    path: "userId"
                                                }]
                                            }]
                                        }
                                    ])
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
        .populate([
            {
                path: 'type.roleOrganizationalUnit',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            }
        ])
        // .skip((page - 1) * limit)
        // .limit(limit);
    return { 
        data: departments, 
        totalList 
    }
}

exports.getUserByRole = async (portal, data) => {
    if (!(data && data.currentUserId && data.role)) return [];
    currentUserId = String(data.currentUserId);
    role = Number(data.role);
    let departments = await TransportDepartment(connect(DB_CONNECTION, portal)).find()
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
        .populate([
            {
                path: 'type.roleOrganizationalUnit',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            }
        ])
    let res = []
    let currentRoleDepartments;
    if (Number(role)===1){
        currentRoleDepartments=departments;
    }
    else{
        if (departments && departments.length !==0){
            currentRoleDepartments = departments.filter(transportDepartment => {
                if (transportDepartment && transportDepartment.type && transportDepartment.type.length!==0){
                    if (transportDepartment.type[0].roleTransport === 1){
                        let flag = false;
                        // Kiểm tra có phải trưởng đơn vị không
                        transportDepartment.type[0].roleOrganizationalUnit.map(roleOrganizationalUnit => {
                            if (roleOrganizationalUnit.users && roleOrganizationalUnit.users.length !==0){
                                roleOrganizationalUnit.users.map(user => {
                                    if (user && user.userId && String(user.userId._id) === String(currentUserId)){
                                        flag = true;
                                    }
                                })
                            }
                        })
                        if (flag) {
                            return true;
                        }
                    }
                }
            })
        }
    }
    // return currentRoleDepartments;
    if (currentRoleDepartments && currentRoleDepartments.length !==0){
        currentRoleDepartments.map(transportDepartment => {
            let transportDepartmentType = transportDepartment.type.filter(r=> r.roleTransport === Number(role));
            if (transportDepartmentType && transportDepartmentType.length!==0){
                if(transportDepartmentType[0].roleOrganizationalUnit && transportDepartmentType[0].roleOrganizationalUnit.length !==0){
                    transportDepartmentType[0].roleOrganizationalUnit.map(roleOrganizationalUnit => {
                        if (roleOrganizationalUnit && roleOrganizationalUnit.users && roleOrganizationalUnit.users.length !==0){
                            roleOrganizationalUnit.users.map(user => {
                                // res.push(user);
                                if (res && res.length!==0){
                                    let k = res.filter(r=>String(r._id) === String(user.userId._id));
                                    if (!(k && k.length !==0)){
                                        res.push(user.userId);
                                    }
                                }
                                else {                                    
                                    res.push(user.userId);
                                }
                            })
                        }
                    })
                }
            }
        })
    }
    return {list: res, role: role};
}

exports.getDepartmentByRole = async (portal, currentRole) => {
    let listDepartments = await this.getAllTransportDepartments(portal);
    listDepartments = listDepartments.data; 
    let res;
    listDepartments.map(item => {
        if (item.type && item.type.length !==0){
            item.type.map(type => {
                if (type.roleOrganizationalUnit && type.roleOrganizationalUnit.length !==0){
                    type.roleOrganizationalUnit.map(role => {
                        if (String(role._id) === String(currentRole)){
                            res = item;
                        }
                    })
                }
            })
        }
    })
    return res;
}

exports.deleteDepartment = async (portal, id) => {
    let department = await TransportDepartment(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: id });
    return department;
}
