const { TaskTemplate, Privilege, Role, UserRole } = require('../../../models').schema;


//Lấy tất cả các mẫu công việc
exports.get = (req, res) => {
    TaskTemplate.find()
        .then(templates => res.status(200).json(templates))
        .catch(err => res.status(400).json({ message: err }));
}

//Lấy mẫu công việc theo Id
exports.getById = async (req, res) => {
    try {
        var tasktemplate = await TaskTemplate.findById(req.params.id).populate("organizationalUnit creator responsibleEmployees accountableEmployees consultedEmployees informedEmployees");
        res.status(200).json({
            "info": tasktemplate,
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
exports.getByUser = async (id, pageNumber, noResultsPerPage, organizationalUnit, name="") => {
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
exports.create = async (body) => {
        var tasktemplate = await TaskTemplate.create({ //Tạo dữ liệu mẫu công việc
            organizationalUnit: body.unit,
            name: body.name,
            creator: body.creator, //id của người tạo
            readByEmployees: body.read, //id của người có quyền xem
            responsibleEmployees: body.responsible,
            accountableEmployees: body.accounatable,
            consultedEmployees: body.consulted,
            informedEmployees: body.informed,
            description: body.description,
            formula: body.formula,
            taskActions: body.listAction.map(item => {
                return {
                    name: item.name,
                    description: item.description,
                    mandatory: item.mandatary,
                }
            }),
            taskInformations: body.listInfo.map((item, key) => {
                return {
                    code: "p"+parseInt(key+1),
                    name: item.name,
                    description: item.description,
                    filledByAccountableEmployeesOnly: item.mandatary,
                    type: item.type,
                    extra: item.extra,
                }
            })
        });
        // var reader = body.read; //role có quyền đọc
        // var read = await Action.findOne({ name: "READ" }); //lấy quyền đọc
        var privilege = await Privilege.create({
            roleId: body.read[0], //id của người cấp quyền xem
            resourceId: tasktemplate._id,
            resourceType: "TaskTemplate",
            action: body.read //quyền READ
        });
        var newTask = await Privilege.findById(privilege._id).populate({ path: 'resourceId', model: TaskTemplate, populate: { path: 'creator organizationalUnit' } });

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