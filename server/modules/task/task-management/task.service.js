const mongoose = require("mongoose");
const { Task, TaskTemplate, TaskAction, TaskTemplateInformation, Role, OrganizationalUnit, User } = require('../../../models/index').schema;

/**
 * Lấy tất cả các công việc
 */
 exports.getAllTasks = (req, res) => {
    var tasks = Task.find();
    return tasks;  
}

/**
 * Lấy mẫu công việc theo Id
 */
exports.getTask = async (id) => {
    //req.params.id
    var superTask = await Task.findById(id)
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator parent" })   
        .populate("evaluations.results.employee")
        .populate("evaluations.kpis.employee")
        .populate("evaluations.kpis.kpis")

    var task = await Task.findById(id).populate([
        {path: "parent", select: "name"},
        {path: "organizationalUnit", model: OrganizationalUnit},
        {path: "inactiveEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id"},
        {path: "evaluations.results.employee", select: "name email _id"},
        {path: "evaluations.kpis.employee", select: "name email _id"},
        {path: "evaluations.kpis.kpis"}
    ])
    
    if(task.taskTemplate === null){
        return {
            "info": task,
            // "actions": task.taskActions,
            // "informations": task.taskInformations
        };
    } else {
        var task2 = await Task.findById(id)
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator parent" })
        .populate({path: "taskActions.creator", model: User, select: "name email"});
        return {
            "info": task,
            "actions": task2.taskActions,
            "informations": task2.taskInformations
        };
    }
        
}

/**
 * Lấy mẫu công việc theo chức danh và người dùng
 * @id: id người dùng
 */
exports.getTasksCreatedByUser = async (id) => {
    var tasks = await Task.find({
        creator: id
    }).populate({ path: 'taskTemplate', model: TaskTemplate });
    return tasks;
}

/**
 * Lấy công việc thực hiện chính theo id người dùng
 */
exports.getPaginatedTasksThatUserHasResponsibleRole = async (task) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var { perPage, number, user, organizationalUnit, status, priority, special, name } = task;
    
    var responsibleTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        responsibleEmployees: {
            $in: [user]
        }
    };

    if(organizationalUnit !== '[]'){
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit.split(",")
            }
        };
    }

    if(status !== '[]'){
        keySearch = {
            ...keySearch,
            status: {
                $in: status.split(",")
            }
        };
    }

    if(priority !== '[]'){
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority.split(",")
            }
        };
    }

    if(special !== '[]'){
        special = special.split(",");
        for(var i = 0; i < special.length; i++){
            if(special[i] === "Lưu trong kho"){
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else{
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };                
            }
        }
    }

    if (name !== 'null') {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };
    
    responsibleTasks = await Task.find( keySearch ).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
    
    var totalCount = await Task.count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);

    return {
        "tasks": responsibleTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc phê duyệt theo id người dùng
 */
exports.getPaginatedTasksThatUserHasAccountableRole = async (task) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.status,req.params.user
    var { perPage, number, user, organizationalUnit, status, priority, special, name } = task;

    var accountableTasks;
        var perPage = Number(perPage);
        var page = Number(number);
        if (organizationalUnit === "[]" && status === "[]") {
            accountableTasks = await Task.find({ accountableEmployees: { $in: [user] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            accountableTasks = await Task.find({
                accountableEmployees: { $in: [user] },
                $or: [
                    { organizationalUnit: { $in: organizationalUnit.split(",") } },
                    { status: { $in: status.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        }
        var totalCount = await Task.count({ accountableEmployees: { $in: [user] } });
        var totalPages = Math.ceil(totalCount / perPage);
        return {
            "tasks": accountableTasks,
            "totalPage": totalPages
        };
}

/**
 * Lấy công việc hỗ trợ theo id người dùng
 */
exports.getPaginatedTasksThatUserHasConsultedRole = async (perpageId,numberId,unitId,userId,statusId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var consultedTasks;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            consultedTasks = await Task.find({ consultedEmployees: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            consultedTasks = await Task.find({
                consultedEmployees: { $in: [userId] },
                $or: [
                    { organizationalUnit: { $in: unitId.split(",") } },
                    { status: { $in: statusId.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        }
        var totalCount = await Task.count({ consultedEmployees: { $in: [userId] } });
        var totalPages = Math.ceil(totalCount / perPage);
        return {
            "tasks": consultedTasks,
            "totalPage": totalPages
        };
}

/**
 * Lấy công việc thiết lập theo id người dùng
 */
exports.getPaginatedTasksCreatedByUser = async (perpageId,numberId,unitId,statusId,userId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.status,req.params.user
    var creatorTasks;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            creatorTasks = await Task.find({ creator: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            creatorTasks = await Task.find({
                creator: { $in: [userId] },
                $or: [
                    { organizationalUnit: { $in: unitId.split(",") } },
                    { status: { $in: statusId.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        }
        var totalCount = await Task.count({ creator: { $in: [userId] } });
        var totalPages = Math.ceil(totalCount / perPage);
        return {
            "tasks": creatorTasks,
            "totalPage": totalPages 
        };
}

/**
 * Lấy công việc quan sát theo id người dùng
 */
exports.getPaginatedTasksThatUserHasInformedRole = async (perpageId,numberId,unitId,userId,statusId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var informedTasks;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            informedTasks = await Task.find({ informedEmployees: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage)
                .populate({ path: "organizationalUnit creator parent" });
        } else {
            informedTasks = await Task.find({
                informedEmployees: { $in: [userId] },
                $or: [
                    { organizationalUnit: { $in: unitId.split(",") } },
                    { status: { $in: statusId.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        }
        var totalCount = await Task.count({ informedEmployees: { $in: [userId] } });
        var totalPages = Math.ceil(totalCount / perPage);
        return {
            "tasks": informedTasks,
            "totalPage": totalPages
        };
}

/**
 * Tạo công việc mới
 */


exports.createTask = async (task) => {
    // Lấy thông tin công việc cha
    var level = 1;
    if (mongoose.Types.ObjectId.isValid(task.parent)) {
        var parent = await Task.findById(task.parent);
        if (parent) level = parent.level + 1;
    }
    
    // convert thời gian từ string sang date
    var splitter = task.startDate.split("-");
    var startDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
    splitter = task.endDate.split("-");
    var endDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
    
    if(task.taskTemplate !== ""){
        var taskTemplate = await TaskTemplate.findById(task.taskTemplate);
        var taskActions = taskTemplate.taskActions;
        var cloneActions = [];

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name:  taskActions[i].name,
                description:  taskActions[i].description,
                //creator: task.creator, // TODO: Bỏ. khi nào người thực hiện tích đã làm xong action thì người tạo action sẽ là người thực hiện
                // createdAt:  taskActions[i].createdAt,
                // updatedAt:  taskActions[i].updatedAt
            }
        }
    }
    var evaluations = [{
        results : [],
        taskInformations: taskTemplate?taskTemplate.taskInformations:[],
    }]

    var task = await Task.create({ //Tạo dữ liệu mẫu công việc
        organizationalUnit: task.organizationalUnit,
        creator: task.creator, //id của người tạo
        name: task.name,
        description: task.description,
        startDate: startDate,
        endDate: endDate,
        priority: task.priority,
        taskTemplate: taskTemplate ? taskTemplate : null,
        taskInformations: (taskTemplate)? taskTemplate.taskInformations: [],
        taskActions: taskTemplate? cloneActions: [],
        parent: (task.parent==="")? null : task.parent,
        level: level,
        evaluations: evaluations,
        responsibleEmployees: task.responsibleEmployees,
        accountableEmployees: task.accountableEmployees,
        consultedEmployees: task.consultedEmployees,
        informedEmployees: task.informedEmployees,
    });

    if(task.taskTemplate !== null){
        var taskTemplate = await TaskTemplate.findByIdAndUpdate(
            task.taskTemplate, { $inc: { 'numberOfUse': 1} }, { new: true }
        );
    }

    task = await task.populate({path: "organizationalUnit creator parent"},)
    return task;
}

/**
 * Xóa công việc
 */
exports.deleteTask = async (id) => {
    //req.params.id
    var template = await WorkTemplate.findByIdAndDelete(id); // xóa mẫu công việc theo id
    var privileges = await Privilege.deleteMany({
        resource: id, //id của task template
        resourceType: "TaskTemplate"
    });
}

/**
 * edit status of task
 */
exports.editTaskStatus = async (taskID, status) => {
    var task = await Task.findByIdAndUpdate(taskID, 
        { $set: {status: status }},
        { new: true } 
    );
    return task;
}
