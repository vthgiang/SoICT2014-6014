const {
    BusinessDepartment, OrganizationalUnit
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

const OrganizationalUnitServices =  require('../../../super-admin/organizational-unit/organizationalUnit.service');


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
                    {
                        path: 'deputyManagers',
                        populate: [{
                            path: "users",
                            populate: [{
                                path: "userId"
                            }]
                        }]
                    },
                    {
                        path: 'employees',
                        populate: [{
                            path: "users",
                            populate: [{
                                path: "userId"
                            }]
                        }]
                    }]
                }]
            })
        return { allBusinessDepartments }
    }
}

//Lấy id người hiện tại, cấp dưới của người đó
//Lấy cả phòng ban hiện tại của người đó và phòng ban con
exports.getAllRelationsUser = async (userId, currentRole, portal) => { 
    //Lấy ra phòng ban người đó đang công tác
    let department = await OrganizationalUnitServices.getOrganizationalUnitByUserRole(portal, currentRole);
    
    if (!department) throw new Error("Department not avaiable");

    //Lấy các phòng ban con của phòng ban người này công tác
    let childDepartments = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .find({ parent: department._id })
        .populate([
        { path: 'managers', populate: { path: 'users' } },
        { path: 'deputyManagers', populate: { path: 'users' } },
        { path: 'employees', populate: { path: 'users' } }
    ]);
    let usersRelationship = [userId];
    const { managers, deputyManagers, employees } = department;
    let check = -1; //1. managers, 2. deputyManagers, 3. employees -- để check vai trò của người này
    //Kiểm tra xem người này có phải là trưởng đơn vị hay không
    for (let indexRole = 0; indexRole < managers.length; indexRole++){
        for (let indexUser = 0; indexUser < managers[indexRole].users.length; indexUser++){
            if (managers[indexRole].users[indexUser].userId.equals(userId)) {
                check = 1;
            }
        }
    }
    if (check === 1) {//Nếu là trưởng đơn vị
        //i. Lấy danh sách các phó đơn vị dưới quyền người này
        for (let indexRole = 0; indexRole < deputyManagers.length; indexRole++){
            for (let indexUser = 0; indexUser < deputyManagers[indexRole].users.length; indexUser++){
                if (!usersRelationship.find(element => deputyManagers[indexRole].users[indexUser].userId.equals(element))) {
                    usersRelationship.push(deputyManagers[indexRole].users[indexUser].userId.toString())
                }
            }
        }
        //ii. Lấy các nhân viên dưới quyền người này
        for (let indexRole = 0; indexRole < employees.length; indexRole++){
            for (let indexUser = 0; indexUser < employees[indexRole].users.length; indexUser++){
                if (!usersRelationship.find(element => employees[indexRole].users[indexUser].userId.equals(element))) {
                    usersRelationship.push(employees[indexRole].users[indexUser].userId.toString())
                }
            }
        }
    } else {//Kiểm tra xem người này có phải là phó đơn vị không
        for (let indexRole = 0; indexRole < deputyManagers.length; indexRole++){
            for (let indexUser = 0; indexUser < deputyManagers[indexRole].users.length; indexUser++){
                if (deputyManagers[indexRole].users[indexUser].userId.equals(userId)) {
                    check = 2;
                }
            }
        }

        if (check === 2) {//Nếu là phó đơn vị
            //Lấy danh sách nhân viên người này quản lý
            for (let indexRole = 0; indexRole < employees.length; indexRole++){
                for (let indexUser = 0; indexUser < employees[indexRole].users.length; indexUser++){
                    if (!usersRelationship.find(element => employees[indexRole].users[indexUser].userId.equals(element))) {
                        usersRelationship.push(employees[indexRole].users[indexUser].userId.toString())
                    }
                }
            }
        }
    }

    if (childDepartments) {//Lấy hết các nhân viên phòng ban con
        for (let indexDepartment = 0; indexDepartment < childDepartments.length; indexDepartment++) {
            const { managers, deputyManagers, employees } = childDepartments[indexDepartment];
            //i. Lấy danh sách các phó đơn vị dưới quyền người này
            for (let indexRole = 0; indexRole < managers.length; indexRole++){
                for (let indexUser = 0; indexUser < managers[indexRole].users.length; indexUser++){
                    if (!usersRelationship.find(element => managers[indexRole].users[indexUser].userId.equals(element))) {
                        usersRelationship.push(managers[indexRole].users[indexUser].userId.toString())
                    }
                }
            }
            //ii. Lấy danh sách các phó đơn vị dưới quyền người này
            for (let indexRole = 0; indexRole < deputyManagers.length; indexRole++){
                for (let indexUser = 0; indexUser < deputyManagers[indexRole].users.length; indexUser++){
                    if (!usersRelationship.find(element => deputyManagers[indexRole].users[indexUser].userId.equals(element))) {
                        usersRelationship.push(deputyManagers[indexRole].users[indexUser].userId.toString())
                    }
                }
            }
            //iii. Lấy các nhân viên dưới quyền người này
            for (let indexRole = 0; indexRole < employees.length; indexRole++){
                for (let indexUser = 0; indexUser < employees[indexRole].users.length; indexUser++){
                    if (!usersRelationship.find(element => employees[indexRole].users[indexUser].userId.equals(element))) {
                        usersRelationship.push(employees[indexRole].users[indexUser].userId.toString())
                    }
                }
            }
        }
    }
    console.log("usersRelationship", typeof usersRelationship[1])
    return usersRelationship;
}
