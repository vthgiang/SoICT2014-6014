const { TaskTemplate, Privilege, Role, UserRole, OrganizationalUnit, User } = require('../../../models').schema;
const mongoose = require('mongoose');
/**
 * Lấy tất cả các mẫu công việc
 */
exports.getAllTaskTemplates = (req, res) => {
    var taskTemplates = TaskTemplate.find()
    return taskTemplates;
}

/**
 * Lấy mẫu công việc thoe Id
 * @id id mẫu công việc
 */
exports.getTaskTemplate = async (id) => {
    var taskTemplate = TaskTemplate.findById(id).populate([
        {path: "organizationalUnit", model: OrganizationalUnit, select :"name deans"},
        {path: "readByEmployees", model: Role, select: "name"},
        {path: "creator responsibleEmployees accountableEmployees consultedEmployees informedEmployees", model: User, select: "name email"}]);
    return taskTemplate;
}

/**
 * Lấy mẫu công việc theo chức danh
 * @id id role
 */
exports.getTaskTemplatesOfUserRole = async (id) => {

    var roleId = await Role.findById(id); //lấy id role hiện tại
    var roles = [roleId._id]; //thêm id role hiện tại vào 1 mảng
    roles = roles.concat(roleId.abstract); //thêm các role children vào mảng
    var tasks = await Privilege.find({
        role: { $in: roles },
        resource_type: 'TaskTemplate'
    }).populate({ path: 'resource', model: TaskTemplate, populate: { path: 'creator' } });

    return tasks;
}

/**
 * Lấy mẫu công việc theo user
 * @id id người dùng
 * @pageNumber trang muốn lấy
 * @noResultsPerPage giới hạn hiển thị trên 1 bảng
 * @organizationalUnit id phòng ban 
 * @name tên mẫu công việc truy vấn
 */
exports.searchTaskTemplates = async (id, pageNumber, noResultsPerPage, organizationalUnit, name = "") => {
    // Lấy tất cả các role người dùng có
    var roles = await UserRole.find({ userId: id }).populate({ path: "roleId" });
    var newRoles = roles.map(role => role.roleId);
    // lấy tất cả các role con của role người dùng có
    var allRole = [];
    newRoles.map(item => {
        allRole = allRole.concat(item._id); //thêm id role hiện tại vào 1 mảng
        allRole = allRole.concat(item.parents); //thêm các role children vào mảng
    })
    var tasktemplates = [];
    let roleId = allRole.map(function (el) { return mongoose.Types.ObjectId(el) });
    if ((organizationalUnit === "[]") || (JSON.stringify(organizationalUnit) == JSON.stringify([]))) {
        var tasktemplate = await TaskTemplate.aggregate([
            { $match: { name: { "$regex": name, "$options": "i" } } },
            {
                $lookup:
                {
                    from: "privileges",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match:
                            {
                                $and: [{
                                    $expr:
                                    {
                                        $and: [
                                            { $eq: ["$resourceId", "$$id"] }
                                        ]
                                    }
                                },
                                {
                                    roleId: { $in: roleId }
                                }]
                            }
                        }
                    ],
                    as: "creator organizationalUnit"
                }
            },
            { $unwind: "$creator organizationalUnit" },
            {
                $facet: {
                    tasks: [{ $sort: { 'createdAt': 1 } },
                    ...noResultsPerPage === 0 ? [] : [{ $limit: noResultsPerPage * pageNumber }],
                    ...noResultsPerPage === 0 ? [] : [{ $skip: noResultsPerPage * (pageNumber - 1) }]],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            }
        ])
    } else {
        unit = organizationalUnit.map(function (el) { return mongoose.Types.ObjectId(el) });
        var tasktemplate = await TaskTemplate.aggregate([
            { $match: { $and: [{ name: { "$regex": name, "$options": "i" } }, { organizationalUnit: { $in: unit } }] } },
            {
                $lookup:
                {
                    from: "privileges",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match:
                            {
                                $and: [{
                                    $expr:
                                    {
                                        $and: [
                                            { $eq: ["$resourceId", "$$id"] }
                                        ]
                                    }
                                },
                                {
                                    roleId: { $in: roleId }
                                }]
                            }
                        }
                    ],
                    as: "creator organizationalUnit"
                }
            },
            { $unwind: "$creator organizationalUnit" },
            {
                $facet: {
                    tasks: [{ $sort: { 'createdAt': 1 } },
                    ...noResultsPerPage === 0 ? [] : [{ $limit: noResultsPerPage * pageNumber }],
                    ...noResultsPerPage === 0 ? [] : [{ $skip: noResultsPerPage * (pageNumber - 1) }]],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            }
        ])
    }

    tasktemplates = tasktemplate[0].tasks;
    await TaskTemplate.populate(tasktemplates, [
        {path: "organizationalUnit", model: OrganizationalUnit, select :"name deans"},
        {path: "readByEmployees", model: Role, select: "name"},
        {path: "creator responsibleEmployees accountableEmployees consultedEmployees informedEmployees", model: User, select: "name email"}]);
    var totalCount = 0;
    if (JSON.stringify(tasktemplates) !== JSON.stringify([])) {
        totalCount = tasktemplate[0].totalCount[0].count;
    }
    var totalPages = Math.ceil(totalCount / noResultsPerPage);
    return { taskTemplates: tasktemplates, pageTotal: totalPages };
}

/**
 * Tạo mới mẫu công việc
 * @body dữ liệu tạo mới mẫu công việc
 */
exports.createTaskTemplate = async (body) => {
    var tasktemplate = await TaskTemplate.create({ //Tạo dữ liệu mẫu công việc       
        organizationalUnit: body.organizationalUnit,
        name: body.name,
        creator: body.creator, //id của người tạo
        priority: '1',
        readByEmployees: body.readByEmployees, //role của người có quyền xem
        responsibleEmployees: body.responsibleEmployees,
        accountableEmployees: body.accountableEmployees,
        consultedEmployees: body.consultedEmployees,
        informedEmployees: body.informedEmployees,
        description: body.description,
        formula: body.formula,
        priority: body.priority,
        taskActions: body.taskActions.map(item => {
            return {
                name: item.name,
                description: item.description,
                mandatory: item.mandatory,
            }
        }),
        taskInformations: body.taskInformations.map((item, key) => {
            return {
                code: "p" + parseInt(key + 1),
                name: item.name,
                description: item.description,
                filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
                type: item.type,
                extra: item.extra,
            }
        })
    });

    // TODO: Xử lý quyển với action

    // xu ly quyen nguoi xem
    var read = body.readByEmployees;
    var roleId = [];
    var role, roleParent;
    role = await Role.find({ _id: { $in: read } });
    roleParent = role.map(item => item.parents);   // lấy ra các parent của các role
    var flag;
    var reads = role.map(item => item._id);     // lấy ra danh sách role có quyền xem ( thứ tự cùng với roleParent)
    for (let n in reads) {
        flag = 0;
        var parent = [];
        parent = parent.concat(roleParent[n]);
        for (let i in parent) {
            for (let j in reads) {
                if (JSON.stringify(reads[j]) === JSON.stringify(parent[i])) {  // nếu 1 role là kế thừa của role có sẵn quyền xem thì loại role đấy đi 
                    reads[n] = "";                                              // loại role
                    flag = 1;
                    roleId.push(reads[j]);                                    // thêm vào danh sách role có quyền xem
                }
            }
        }
        if (flag === 0) roleId.push(reads[n]);    // role này không là role cha của role khác => thêm vào danh sách role có quyền xem
    }
    // xử lý các role trùng lặp
    roleId = roleId.map(u => u.toString());
    for (let i = 0, max = roleId.length; i < max; i++) {
        if (roleId.indexOf(roleId[i]) != roleId.lastIndexOf(roleId[i])) {
            roleId.splice(roleId.indexOf(roleId[i]), 1);
            i--;
        }
    }
    // mỗi roleId là một Document
    for (let i in roleId) {
        var privilege = await Privilege.create({
            roleId: roleId[i], //id của người cấp quyền xem
            resourceId: tasktemplate._id,
            resourceType: "TaskTemplate",
            action: body.readByEmployees //quyền READ
        });
    }
    tasktemplate = await tasktemplate.populate("organizationalUnit creator").execPopulate();
    return tasktemplate;
}

/**
 * Xóa mẫu công việc
 * @id id công việc cần xóa
 */
exports.deleteTaskTemplate = async (id) => {
    var template = await TaskTemplate.findByIdAndDelete(id); // xóa mẫu công việc theo id
    var privileges = await Privilege.deleteMany({
        resourceId: id, //id của task template
        resourceType: "TaskTemplate"
    });

    return { id: id };
}

/**
 * Sửa mẫu công việc
 * @data dữ liệu cập nhật
 * @id id mẫu công việc cập nhật
 */
exports.editTaskTemplate = async (data, id) => {
    var taskTemplate = await TaskTemplate.findByIdAndUpdate(id,
        {
            $set: {
                name: data.name,
                description: data.description,
                formula: data.formula,
                priority: data.priority,
                accountableEmployees: data.accountableEmployees,
                readByEmployees: data.readByEmployees,
                informedEmployees: data.informedEmployees,
                responsibleEmployees: data.responsibleEmployees,
                consultedEmployees: data.consultedEmployees,
                organizationalUnit: data.organizationalUnit,
                taskActions: data.taskActions
            }
        },
        { new: true },
    ).populate([
        {path: "organizationalUnit", model: OrganizationalUnit, select :"name deans"},
        {path: "readByEmployees", model: Role, select: "name"},
        {path: "creator responsibleEmployees accountableEmployees consultedEmployees informedEmployees", model: User, select: "name email"}]);
        
    // xóa privilege tương ứng để tạo lại privilege tương ứng với quyền xem
    var privileges = await Privilege.deleteMany({
        resourceId: id, //id của task template
        resourceType: "TaskTemplate"
    });
    // xu ly quyen nguoi xem
    var read = data.readByEmployees;
    var roleId = [];
    var role, roleParent;
    role = await Role.find({ _id: { $in: read } });
    roleParent = role.map(item => item.parents);   // lấy ra các parent của các role
    var flag;
    var reads = role.map(item => item._id);     // lấy ra danh sách role có quyền xem ( thứ tự cùng với roleParent)
    for (let n in reads) {
        flag = 0;
        var parent = [];
        parent = parent.concat(roleParent[n]);
        for (let i in parent) {
            for (let j in reads) {
                if (JSON.stringify(reads[j]) === JSON.stringify(parent[i])) {  // nếu 1 role là kế thừa của role có sẵn quyền xem thì loại role đấy đi 
                    reads[n] = "";                                              // loại role
                    flag = 1;
                    roleId.push(reads[j]);                                    // thêm vào danh sách role có quyền xem
                }
            }
        }
        if (flag === 0) roleId.push(reads[n]);    // role này không là role cha của role khác => thêm vào danh sách role có quyền xem
    }
    // xử lý các role trùng lặp
    roleId = roleId.map(u => u.toString());
    for (let i = 0, max = roleId.length; i < max; i++) {
        if (roleId.indexOf(roleId[i]) != roleId.lastIndexOf(roleId[i])) {
            roleId.splice(roleId.indexOf(roleId[i]), 1);
            i--;
        }
    }
    // mỗi roleId là một Document
    for (let i in roleId) {
        var privilege = await Privilege.create({
            roleId: roleId[i], //id của người cấp quyền xem
            resourceId: id,
            resourceType: "TaskTemplate",
            action: data.readByEmployees //quyền READ
        });
    }
    return taskTemplate;
}

/**
 * Thêm mẫu công việc mới từ file excel
 * @param {*} data 
 * @param {*} id : id user
 */
exports.importTaskTemplate = async (data,id) => {
    for (let i = 0; i < data.length; i++) {
        // chuyen dia chi email sang id
        for (let j = 0; j < data[i].accountableEmployees.length; j++) {
            let accountableEmployees = await User.findOne({ email: data[i].accountableEmployees[j] });
            data[i].accountableEmployees[j] = String(accountableEmployees._id);
        };
        let read = [];
        for (let j = 0; j < data[i].readByEmployees.length; j++) {
            let readByEmployees = await Role.findOne({ name: data[i].readByEmployees[j] });
            readByEmployees = readByEmployees._id;
            read = [...read, readByEmployees];
        }
        data[i].readByEmployees = read;
        for (let j = 0; j < data[i].consultedEmployees.length; j++) {
            let consultedEmployees = await User.findOne({ email: data[i].consultedEmployees[j] });
            data[i].consultedEmployees[j] = String(consultedEmployees._id);
        };
        for (let j = 0; j < data[i].informedEmployees.length; j++) {
            let informedEmployees = await User.findOne({ email: data[i].informedEmployees[j] });
            data[i].informedEmployees[j] = String(informedEmployees._id);
        };
        for (let j = 0; j < data[i].responsibleEmployees.length; j++) {
            let responsibleEmployees = await User.findOne({ email: data[i].responsibleEmployees[j] });
            data[i].responsibleEmployees[j] = String(responsibleEmployees._id);            
        };
        // xu ly thong tin priority
        if (data[i].priority === "Cao") data[i].priority = 1;
        else if (data[i].priority === "Thấp") data[i].priority = 3;
        else data[i].priority = 2;
        // xu ly thong tin filledByAccountableEmployeesOnly 
        for (let j = 0; j < data[i].taskInformations.length; j++) {
            if (data[i].taskInformations[j][0]) {
                // format thong tin "chi qua ly duoc dien"
                data[i].taskInformations[j]["filledByAccountableEmployeesOnly"] = data[i].taskInformations[j][3];
                // if (data[i].taskInformations[j][3] === 'Đúng')
                //     data[i].taskInformations[j]["filledByAccountableEmployeesOnly"] = true;
                // else data[i].taskInformations[j]["filledByAccountableEmployeesOnly"] = false;
                // formart thong tin kieu du lieu
                data[i].taskInformations[j]["type"] = data[i].taskInformations[j][2];
                // if (data[i].taskInformations[j][2] == "Số") {
                //     data[i].taskInformations[j]["type"] = 'Number';
                // } else {
                //     if (data[i].taskInformations[j][2] == "Văn bản") {
                //         data[i].taskInformations[j]["type"] = 'Text';
                //     } else {
                //         if (data[i].taskInformations[j][2] == "Boolean") {
                //             data[i].taskInformations[j]["type"] = 'Boolean';
                //         } else {
                //             if (data[i].taskInformations[j][2] == "Ngày tháng") {
                //                 data[i].taskInformations[j]["type"] = 'Date';
                //             } else {
                //                 data[i].taskInformations[j]["type"] = "SetOfValues";
                //             }
                //         }
                //     }
                // }
                data[i].taskInformations[j]["name"] = data[i].taskInformations[j][0];
                data[i].taskInformations[j]["description"] = data[i].taskInformations[j][1];
            } else {
                data[i].taskInformations.splice(j,1);
            }
        }
        for (let j = 0; j < data[i].taskActions.length; j++) {
            if (data[i].taskActions[j][0]) {
                data[i].taskActions[j]["mandatory"] = data[i].taskActions[j][2];
                // if (data[i].taskActions[j][2] === "Bắt buộc")
                //     data[i].taskActions[j]["mandatory"] = true;
                // else data[i].taskActions[j]["mandatory"] = false;
                data[i].taskActions[j]["name"] = data[i].taskActions[j][0];
                data[i].taskActions[j]["description"] = data[i].taskActions[j][1];
            } else {
                data[i].taskActions.splice(j,1);
            }
        }
        let unit = await OrganizationalUnit.findOne({name: data[i].organizationalUnit});
        data[i].organizationalUnit = String(unit._id);
        data[i].creator = id;
        let result = await this.createTaskTemplate(data[i]);
    };

}
