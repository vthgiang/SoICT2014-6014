const { TaskTemplate, Privilege, Role, UserRole } = require('../../../models').schema;


//Lấy tất cả các mẫu công việc
exports.getAllTaskTemplates = (req, res) => {
    TaskTemplate.find()
        .then(templates => res.status(200).json(templates))
        .catch(err => res.status(400).json({ message: err }));
}

//Lấy mẫu công việc theo Id
exports.getTaskTemplate = async (id) => {
    var taskTemplate = TaskTemplate.findById(id).populate("organizationalUnit creator readByEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees");
    return taskTemplate;
}

//Lấy mẫu công việc theo chức danh
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

// lấy tất cả mẫu công việc theo id user
exports.searchTaskTemplates = async (id, pageNumber, noResultsPerPage, organizationalUnit, name="") => {
        // Lấy tất cả các role người dùng có
        var roles = await UserRole.find({ userId: id }).populate({path: "roleId"});
        var newRoles = roles.map(role => role.roleId);
        // lấy tất cả các role con của role người dùng có
        var allRole = [];
        newRoles.map(item => {
            allRole = allRole.concat(item._id); //thêm id role hiện tại vào 1 mảng
            allRole = allRole.concat(item.parents); //thêm các role children vào mảng
        })
        var tasktemplates;
        if ((organizationalUnit === "[]")||(JSON.stringify(organizationalUnit)==JSON.stringify([]))){
            tasktemplates = await Privilege.find({
                roleId: { $in: allRole },
                resourceType: 'TaskTemplate'
            }).sort({'createdAt': 'desc'})
            .skip(noResultsPerPage*(pageNumber-1))
            .limit(noResultsPerPage)
            .populate({ 
                path: 'resourceId', 
                model: TaskTemplate, 
                match: {name : { "$regex": name, "$options": "i" }},
                populate: { path: 'creator organizationalUnit' } 
            });
        } else {
            tasktemplates = await Privilege.find({
                roleId: { $in: allRole },
                resourceType: 'TaskTemplate'
            }).sort({'createdAt': 'desc'})
            .skip(noResultsPerPage*(pageNumber-1))
            .limit(noResultsPerPage)
            .populate({ 
                path: 'resourceId', 
                model: TaskTemplate, 
                match: { $and : [{name: { "$regex": name, "$options": "i" }},{organizationalUnit : { $in: organizationalUnit}}]} ,
                populate: { path: 'creator organizationalUnit' } 
            }); 
        }
        var totalCount = await Privilege.count({
            roleId: { $in: allRole },
            resourceType: 'TaskTemplate'
        });
        var totalPages = Math.ceil(totalCount / noResultsPerPage);
        return {taskTemplates : tasktemplates, pageTotal: totalPages};
}

//Tạo mẫu công việc
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
                code: "p"+parseInt(key+1),
                name: item.name,
                description: item.description,
                filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
                type: item.type,
                extra: item.extra,
            }
        })
    });
    // var reader = body.read; //role có quyền đọc
    // var read = await Action.findOne({ name: "READ" }); //lấy quyền đọc
    var privilege = await Privilege.create({
        roleId: body.readByEmployees[0], //id của người cấp quyền xem
        resourceId: tasktemplate._id,
        resourceType: "TaskTemplate",
        action: body.readByEmployees //quyền READ
    });
    var newTask = await Privilege.findById(privilege._id).populate({ path: 'resourceId', model: TaskTemplate, populate: { path: 'creator organizationalUnit' } });

    return newTask;
}

//Xóa mẫu công việc
exports.deleteTaskTemplate = async (id) => { 
    var template = await TaskTemplate.findByIdAndDelete(id); // xóa mẫu công việc theo id
    var privileges = await Privilege.deleteMany({
        resourceId: id, //id của task template
        resourceType: "TaskTemplate"
    });
    
    return ("Delete success");
}

/**
 * Sửa mẫu công việc
 */
exports.editTaskTemplate =async(data, id)=>{
    var taskTemplate = await TaskTemplate.findByIdAndUpdate(id,
        {$set: { 
            name: data.name,
            description: data.description,
            formula: data.formula,
            accountableEmployees: data.accountableEmployees,
            readByEmployees: data.readByEmployees,
            informedEmployees: data.informedEmployees,
            responsibleEmployees: data.responsibleEmployees,
            consultedEmployees: data.consultedEmployees,
            organizationalUnit: data.organizationalUnit._id,
            taskActions: data.taskActions
        }},
        { new: true},
    ).populate("organizationalUnit creator readByEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees");
  
    return taskTemplate;     
}