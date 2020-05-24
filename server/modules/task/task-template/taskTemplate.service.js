const { TaskTemplate, Privilege, Role, UserRole } = require('../../../models').schema;
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
    var taskTemplate = TaskTemplate.findById(id).populate("organizationalUnit creator readByEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees");
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
    var tasktemplates;
    if ((organizationalUnit === "[]") || (JSON.stringify(organizationalUnit) == JSON.stringify([]))) {
        roleId = allRole.map(function (el) { return mongoose.Types.ObjectId(el) });
        var tasktemplates = await TaskTemplate.aggregate([
            { $match: { $and: [{ name: { "$regex": name, "$options": "i" } }] } },
            {
                $lookup:
                {
                    from: "privileges",
                    let:{id:"$_id"},
                    pipeline: [
                        { $match:
                            { $and :[{ $expr:
                                { $and:[
                                        { $eq: ["$resourceId", "$$id"] }
                                    ]
                                }
                            },
                            {
                                roleId : { $in: roleId }
                            }]
                        } }
                    ],
                    // pipeline: [{ $match: { "$and": [{ resourceType: "TaskTemplate" }, { roleId: { $in: roleId } }] } }],
                    as: "creator organizationalUnit"
                }
            },
            { $sort: { 'createdAt': 1 } },
            { $limit: noResultsPerPage * pageNumber },
            { $skip: noResultsPerPage * (pageNumber - 1) },
        ])
        await TaskTemplate.populate(tasktemplates, { path: "creator organizationalUnit" });
        var tasks = await TaskTemplate.aggregate([
            { $match: { $and: [{ name: { "$regex": name, "$options": "i" } }] } },
            {
                $lookup:
                {
                    from: "privileges",
                    pipeline: [{ $match: { "$and": [{ resourceType: "TaskTemplate" }, { roleId: { $in: roleId } }] } }],
                    as: "creator organizationalUnit"
                }
            }
        ])
        var totalCount = tasks.length;
        var totalPages = Math.ceil(totalCount / noResultsPerPage);
        
        return { taskTemplates: tasktemplates, pageTotal: totalPages };
    } else {
        unit = organizationalUnit.map(function (el) { return mongoose.Types.ObjectId(el) });
        roleId = allRole.map(function (el) { return mongoose.Types.ObjectId(el) });
        console.log("roleId: "+roleId);
        var tasktemplates = await TaskTemplate.aggregate([
            { $match: { $and: [{ name: { "$regex": name, "$options": "i" } }, { organizationalUnit: { $in: unit } }] } },
            {
                $lookup:
                {
                    from: "privileges",
                    let:{id:"$_id"},
                    pipeline: [
                        { $match:
                            { $and :[{ $expr:
                                { $and:[
                                        { $eq: ["$resourceId", "$$id"] }
                                    ]
                                }
                            },
                            {
                                roleId : { $in: roleId }
                            }]
                        } }
                    ],
                    // pipeline: [{ $match: { $and: [{ resourceType: "TaskTemplate" }, { roleId: { $in: roleId } }] } }],
                    as: "creator organizationalUnit"
                }
            },
            { $sort: { 'createdAt': 1 } },
            { $limit: noResultsPerPage * pageNumber },
            { $skip: noResultsPerPage * (pageNumber - 1) },
        ])
        await TaskTemplate.populate(tasktemplates, { path: "creator organizationalUnit" });
        var tasks = await TaskTemplate.aggregate([
            { $match: { $and: [{ name: { "$regex": name, "$options": "i" } }, { organizationalUnit: { $in: unit } }] } },
            {
                $lookup:
                {
                    from: "privileges",
                    pipeline: [{ $match: { "$and": [{ resourceType: "TaskTemplate" }, { roleId: { $in: roleId } }] } }],
                    as: "creator organizationalUnit"
                }
            }
        ])
        var totalCount = tasks.length;
        var totalPages = Math.ceil(totalCount / noResultsPerPage);

        return { taskTemplates: tasktemplates, pageTotal: totalPages };
    }
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
        readByEmployees: body.readByEmployees, //role của người có quyền xem
        responsibleEmployees: body.responsibleEmployees,
        accountableEmployees: body.accountableEmployees,
        consultedEmployees: body.consultedEmployees,
        informedEmployees: body.informedEmployees,
        description: body.description,
        formula: body.formula,
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
    var privilege = await Privilege.create({
        roleId: body.readByEmployees[0], //id của người cấp quyền xem
        resourceId: tasktemplate._id,
        resourceType: "TaskTemplate",
        action: body.readByEmployees //quyền READ
    });
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
    ).populate("organizationalUnit creator readByEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees");

    return taskTemplate;
}