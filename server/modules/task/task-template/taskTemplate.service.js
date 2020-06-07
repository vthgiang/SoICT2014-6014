const { TaskTemplate, Privilege, Role, UserRole,OrganizationalUnit } = require('../../../models').schema;
const DashboardService = require('../../kpi/evaluation/dashboard/dashboard.service');
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
                    ...noResultsPerPage===0? []: [{ $limit: noResultsPerPage * pageNumber }],
                    ...noResultsPerPage===0? []: [{ $skip: noResultsPerPage * (pageNumber - 1) }]],
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
                    ...noResultsPerPage===0? []: [{ $limit: noResultsPerPage * pageNumber }],
                    ...noResultsPerPage===0? []: [{ $skip: noResultsPerPage * (pageNumber - 1) }]],
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
    await TaskTemplate.populate(tasktemplates, { path: "creator organizationalUnit" });
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
        priority:body.priority,
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
        roleId: body.readByEmployees, //id của người cấp quyền xem
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
                priority:data.priority,
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
/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @id Id công ty
 * @unitID Id của của đơn vị cần lấy đơn vị con
 */
exports.getAllChildrenOfOrganizationalUnitsAsTree = async (id, unitId) => {
    //Lấy tất cả các đơn vị con của 1 đơn vị
    var organizationalUnit = await OrganizationalUnit.findById(unitId);
    var data;
    data = await DashboardService.getChildrenOfOrganizationalUnitsAsTree(id, organizationalUnit.dean);
   
    var queue=[];
    var departments = [];
    //BFS tìm tât cả đơn vị con-hàm của Đức
    departments.push(data);
    queue.push(data);    
    while(queue.length > 0){
        var v = queue.shift();
        if(v.children !== undefined){
         for(var i = 0; i < v.children.length; i++){
             var u = v.children[i];
             queue.push(u);
             departments.push(u);

         }
     }
    }
    //Lấy tất cả user của từng đơn vị
    var userArray=[];
    userArray=await _getAllUsersInOrganizationalUnits(departments);
    return userArray;
   
}

/**
 * Hàm tiện ích dùng trong service ở trên 
 * Khác với hàm bên module User: nhận vào 1 mảng các department và trả về 1 mảng với mỗi ptu là tất cả các nhân viên trong từng 1 phòng ban
 */
_getAllUsersInOrganizationalUnits = async (data) => {
    var userArray=[];
    for(let i= 0;i<data.length;i++)
    { 
        var department=data[i];
        var userRoles = await UserRole
        .find({ roleId: {$in: [department.dean, department.viceDean, department.employee]}})
        .populate({path: 'userId', select: 'name'})
    
        var tmp = await Role.find({_id: {$in: [department.dean, department.viceDean, department.employee]}}, {name: 1});
        var roles = {};
        tmp.forEach(item => {
        if (item._id.equals(department.dean))
            roles.dean = item;
        else if (item._id.equals(department.viceDean))
            roles.viceDean = item;
        else if (item._id.equals(department.employee))
            roles.employee = item;
        })

        let deans=[], viceDeans=[], employees=[];
        userRoles.forEach((item) => {
        if (item.roleId.equals(department.dean)){
            deans.push(item.userId);
        } else if (item.roleId.equals(department.viceDean)){
            viceDeans.push(item.userId);
        } else if (item.roleId.equals(department.employee)){
            employees.push(item.userId);
        }
        });

    var users = {deans: deans, viceDeans: viceDeans, employees: employees, roles: roles,department:department.name};
    userArray.push(users)
    }
     
    return userArray;
}