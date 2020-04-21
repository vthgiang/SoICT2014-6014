const TaskTemplate = require('../../../models/task/taskTemplate.model');
const Privilege = require('../../../models/auth/privilege.model');
const Role = require('../../../models/auth/role.model');
const UserRole = require('../../../models/auth/userRole.model');
const Action = require('../../../models/super-admin/action.model');
const ActionTask = require('../../../models/task/taskAction.model');
const InformationTaskTemplate = require('../../../models/task/taskTemplateInformation.model');



//Lấy tất cả các mẫu công việc
exports.get = (req, res) => {
    TaskTemplate.find()
        .then(templates => res.status(200).json(templates))
        .catch(err => res.status(400).json({ message: err }));
}

//Lấy mẫu công việc theo Id
exports.getById = async (req, res) => {
    try {
        var tasktemplate = await TaskTemplate.findById(req.params.id).populate("unit creator responsible accounatable consulted informed");
        var actionTemplates = await ActionTask.find({ tasktemplate: tasktemplate._id });
        var informationTemplate = await InformationTaskTemplate.find({ tasktemplate: tasktemplate._id });
        res.status(200).json({
            "info": tasktemplate,
            "actions": actionTemplates,
            "informations": informationTemplate
        })
    } catch (error) {
        res.status(400).json({ message: error });
    }
}

//Lấy mẫu công việc theo chức danh
exports.getByRole = async (id) => {
   
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
exports.getByUser = async (id, pageNumber, noResultsPerPage, unit, name="") => {
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
        if ((unit === "[]")||(JSON.stringify(unit)==JSON.stringify([]))){
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
                populate: { path: 'creator unit' } 
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
                match: { $and : [{name: { "$regex": name, "$options": "i" }},{unit : { $in: unit}}]} ,
                populate: { path: 'creator unit' } 
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
exports.create = async (body) => {
        var tasktemplate = await TaskTemplate.create({ //Tạo dữ liệu mẫu công việc
            unit: body.unit,
            name: body.name,
            creator: body.creator, //id của người tạo
            read: body.read, //id của người có quyền xem
            responsible: body.responsible,
            accounatable: body.accounatable,
            consulted: body.consulted,
            informed: body.informed,
            description: body.description,
            formula: body.formula,
        });
        // var reader = body.read; //role có quyền đọc
        // var read = await Action.findOne({ name: "READ" }); //lấy quyền đọc
        var privilege = await Privilege.create({
            roleId: body.read[0], //id của người cấp quyền xem
            resourceId: tasktemplate._id,
            resourceType: "TaskTemplate",
            action: body.read //quyền READ
        });
       
        var actions = body.listAction.map(item => {
            ActionTask.create({
                tasktemplate: tasktemplate._id,
                name: item.name,
                description: item.description,
                mandatary: item.mandatary,
                type: "TaskTemplate"
            })
        });
        var informations = body.listInfo.map((item, key) => {
            InformationTaskTemplate.create({
                tasktemplate: tasktemplate._id,
                code: "p"+parseInt(key+1),
                name: item.name,
                description: item.description,
                mandatary: item.mandatary,
                type: item.type,
                extra: item.extra
            })
        });
        var newTask = await Privilege.findById(privilege._id).populate({ path: 'resourceId', model: TaskTemplate, populate: { path: 'creator unit' } });

        return ({
            message: "Create Task Template Successfully!",
            data: newTask
        });
}

//Xóa mẫu công việc
exports.delete = async (id) => { 
        var template = await TaskTemplate.findByIdAndDelete(id); // xóa mẫu công việc theo id
        var privileges = await Privilege.deleteMany({
            resourceId: id, //id của task template
            resourceType: "TaskTemplate"
        });
        
        return ("Delete success");
}

//sửa mẫu công việc
exports.edit =async(data,id)=>{
 
       
       var tasktemplate =await TaskTemplate.findById(id).select('-name -description') ;
       if(data.name != null && data.description!=null)
       {
        tasktemplate.name =data.name;
        tasktemplate.description=data.description;
       }
       tasktemplate.save();
     
    return ({
        message: "Edit Task Template Successfully!",
        data : tasktemplate
    });
       

}