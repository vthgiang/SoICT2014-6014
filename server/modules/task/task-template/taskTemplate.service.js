const { TaskTemplate, Privilege, Role, UserRole } = require('../../../models').schema;


//Lấy tất cả các mẫu công việc
exports.getAllTaskTemplates = (req, res) => {
    TaskTemplate.find()
        .then(templates => res.status(200).json(templates))
        .catch(err => res.status(400).json({ message: err }));
}

//Lấy mẫu công việc theo Id
exports.getTaskTemplate = async (req, res) => {
    try {
        var tasktemplate = await TaskTemplate.findById(req.params.id).populate("organizationalUnit creator responsibleEmployees accountableEmployees consultedEmployees informedEmployees");
        var nameRead = await Role.findById(tasktemplate.readByEmployees);
        tasktemplate.readByEmployees[1] = nameRead.name; // thêm vào phân quyền của người được xem
        var actionTemplates = await TaskTemplateAction.find({ taskTemplate: tasktemplate._id });
        var informationTemplate = await TaskTemplateInformation.find({ taskTemplate: tasktemplate._id });
        res.status(200).json({
            "info": tasktemplate,
            "taskActions": actionTemplates,
            "taskInformations": informationTemplate
        })
    } catch (error) {
        res.status(400).json({ message: error });
    }
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
        return ({"message" : tasktemplates,"pages": totalPages});
}

//Tạo mẫu công việc
exports.createTaskTemplate = async (body) => {
        var tasktemplate = await TaskTemplate.create({ //Tạo dữ liệu mẫu công việc
            organizationalUnit: body.organizationalUnit,
            name: body.name,
            creator: body.creator, //id của người tạo
            readByEmployees: body.readByEmployees, //id của người có quyền xem
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
                    mandatory: item.mandatary,
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

        return ({
            message: "Create Task Template Successfully!",
            data: newTask
        });
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

/*
// sửa mẫu công việc sửa 12.05
*/
exports.editTaskTemplate =async(data,id)=>{ 
    var tasktemplate =await TaskTemplate.findByIdAndUpdate(id,
     {
         "$set" : 
         { 
             name : data.name,
             description:data.description,
             formula:data.formula,
             accountableEmployees:data.accountableEmployees,
             readByEmployees:data.readByEmployees,
             informedEmployees:data.informedEmployees,
             responsibleEmployees:data.responsibleEmployees,
             consultedEmployees:data.consultedEmployees,
             organizationalUnit:data.organizationalUnit._id,
             taskActions:data.taskActions
         }           
     },
     { "new": true, "upsert": true },
     function (err, managerparent) {
         if (err) throw err;
         
     }
     );
  
 return ({
     message: "Edit Task Template Successfully!",
     data : tasktemplate
 });       
}