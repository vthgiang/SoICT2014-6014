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
        {path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id"},
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
exports.getPaginatedTasksThatUserHasResponsibleRole = async (perpageId,numberId,unitId,userId,statusId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var responsibleTasks;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            responsibleTasks = await Task.find({ responsibleEmployees: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            responsibleTasks = await Task.find({
                responsibleEmployees: { $in: [userId] },
                $or: [
                    { organizationalUnit: { $in: unitId.split(",") } },
                    { status: { $in: statusId.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        }
        var totalCount = await Task.count({ responsibleEmployees: { $in: [userId] } });
        var totalPages = Math.ceil(totalCount / perPage);
        return {
            "tasks": responsibleTasks,
            "totalPage": totalPages
        };
}

/**
 * Lấy công việc phê duyệt theo id người dùng
 */
exports.getPaginatedTasksThatUserHasAccountableRole = async (perpageId,numberId,unitId,statusId,userId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.status,req.params.user
    var accountableTasks;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            accountableTasks = await Task.find({ accountableEmployees: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            accountableTasks = await Task.find({
                accountableEmployees: { $in: [userId] },
                $or: [
                    { organizationalUnit: { $in: unitId.split(",") } },
                    { status: { $in: statusId.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        }
        var totalCount = await Task.count({ accountableEmployees: { $in: [userId] } });
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


exports.createTask = async (parentId,startDateId,endDateId,unitId,creatorId,nameId,descriptionId,priorityId,taskTemplateId,roleId,kpiId,responsibleId,accountableId,consultedId,informedId) => {
    // Lấy thông tin công việc cha
        var level = 1;
        if (mongoose.Types.ObjectId.isValid(parentId)) {
            var parent = await Task.findById(parentId);
            if (parent) level = parent.level + 1;
        }
        
        // convert thời gian từ string sang date
        var startTime = startDateId.split("-");
        var startDate = new Date(startTime[2], startTime[1]-1, startTime[0]);
        var endTime = endDateId.split("-");
        var endDate = new Date(endTime[2], endTime[1]-1, endTime[0]);
        
        if(taskTemplateId !== null){
            var taskTemplate = await TaskTemplate.findById(taskTemplateId);
            var taskActions = taskTemplate.taskActions;
            
            // taskActions.forEach(item => {
            //     item = {
            //         ...item,
            //         creator: taskTemplate.creator
            //     }
            // });
            
        }

        var evaluations = [{
            // date: startDate,
            kpis : kpiId,
            results : [],
            taskInformations: taskTemplate?taskTemplate.taskInformations:[],
        }]

        var task = await Task.create({ //Tạo dữ liệu mẫu công việc
            organizationalUnit: unitId,
            creator: creatorId, //id của người tạo
            name: nameId,
            description: descriptionId,
            startDate: startDate,
            endDate: endDate,
            priority: priorityId,
            taskTemplate: taskTemplate ? taskTemplate : null,
            taskInformations: taskTemplate?taskTemplate.taskInformations:[],
            taskActions: taskTemplate?taskActions:[],
            role: roleId,
            parent: parentId,
            level: level,
            evaluations: evaluations,
            responsibleEmployees: responsibleId,
            accountableEmployees: accountableId,
            consultedEmployees: consultedId,
            informedEmployees: informedId,
        });
        if(taskTemplateId !== null){
            var taskTemplate = await TaskTemplate.findByIdAndUpdate(
                taskTemplateId, { $inc: { 'numberOfUse': 1} }, { new: true }
            );
        }

        task = await task.populate({path: "organizationalUnit creator parent"}).execPopulate();
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
