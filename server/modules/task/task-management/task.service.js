const mongoose = require("mongoose");
const { Task, TaskAction, TaskTemplateInformation, Role, OrganizationalUnit } = require('../../../models/index').schema;

//Lấy tất cả các công việc
exports.getAllTask = (req, res) => {
    var tasks = Task.find();
    return tasks;  
}

//Lấy mẫu công việc theo Id
exports.getTaskById = async (id) => {
    //req.params.id
    var task = await Task.findById(id)
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees parent taskTemplate comments " });// results.member
        // .populate({path: "results", populate : {path: "member"}});
        // .populate('results.member')
    if (task.taskTemplate !== null) {
        var actionTemplates = await TaskAction.find({ taskTemplate: task.taskTemplate._id });
        var informationTemplate = await TaskTemplateInformation.find({ taskTemplate: task.taskTemplate._id });
        return {
            "info": task,
            "actions": actionTemplates,
            "informations": informationTemplate
        };
    } else {
        return {
            "info": task
        };
    }
}

//Lấy mẫu công việc theo chức danh và người dùng
exports.getTaskByRole = async (roleId,id) => {
    //req.params.role,req.params.id
    var tasks = await Task.find({
        role: roleId,
        creator: id
    }).populate({ path: 'taskTemplate', model: TaskTemplate });
    return tasks;
}

//Lấy công việc thực hiện chính theo id người dùng
exports.getResponsibleTaskByUser = async (perpageId,numberId,unitId,userId,statusId) => {
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

//Lấy công việc phê duyệt theo id người dùng
exports.getAccountableTaskByUser = async (perpageId,numberId,unitId,statusId,userId) => {
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

//Lấy công việc hỗ trợ theo id người dùng
exports.getConsultedTaskByUser = async (perpageId,numberId,unitId,userId,statusId) => {
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

//Lấy công việc thiết lập theo id người dùng
exports.getCreatorTaskByUser = async (perpageId,numberId,unitId,statusId,userId) => {
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

//Lấy công việc quan sát theo id người dùng
exports.getInformedTaskByUser = async (perpageId,numberId,unitId,userId,statusId) => {
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

//Tạo công việc mới
exports.create = async (parentId,startDateId,endDateId,unitId,creatorId,nameId,descriptionId,priorityId,taskTemplateId,roleId,kpiId,responsibleId,accountableId,consultedId,informedId) => {
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
        
        var task = await Task.create({ //Tạo dữ liệu mẫu công việc
            organizationalUnit: unitId,
            creator: creatorId, //id của người tạo
            name: nameId,
            description: descriptionId,
            startDate: startDate,
            endDate: endDate,
            priority: priorityId,
            taskTemplate: taskTemplateId,
            role: roleId,
            parent: parentId,
            level: level,
            kpis: kpiId,
            responsibleEmployees: responsibleId,
            accountableEmployees: accountableId,
            consultedEmployees: consultedId,
            informedEmployees: informedId,
        });
        console.log('task--->', task);
        if(taskTemplateId !== null){
            var taskTemplate = await TaskTemplate.findByIdAndUpdate(
                taskTemplateId, { $inc: { 'count': 1} }, { new: true }
            );
        }
        task = await task.populate({path: "organizationalUnit creator parent"}).execPopulate();
        return task;
}

//Xóa công việc
exports.delete = async (id) => {
    //req.params.id
    var template = await WorkTemplate.findByIdAndDelete(id); // xóa mẫu công việc theo id
    var privileges = await Privilege.deleteMany({
        resource: id, //id của task template
        resourceType: "TaskTemplate"
    });
}

// edit task status
// có 6 trạng thái công việc: Đang chờ, Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Bị hủy, Tạm hoãn
exports.editStatusOfTask = async (taskID, status) => {
    var task = await Task.findByIdAndUpdate(taskID, 
        { $set: {status: status }},
        { new: true } 
    );
    return task;
}
