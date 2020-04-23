const mongoose = require("mongoose");
const { Task, TaskAction, TaskTemplateInformation, Role, OrganizationalUnit } = require('../../../models/index').schema;

//Lấy tất cả các công việc
exports.get = (req, res) => {
    Task.find()
        .then(tasks => res.status(200).json(tasks))
        .catch(err => res.status(400).json({ message: err }));
}

//Lấy mẫu công việc theo Id
exports.getById = async (id) => {
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
exports.getByRole = async (roleId,id) => {
    //req.params.role,req.params.id
    var tasks = await Task.find({
        role: roleId,
        creator: id
    }).populate({ path: 'taskTemplate', model: TaskTemplate });
    return tasks;
}

//Lấy công việc thực hiện chính theo id người dùng
exports.getTaskResponsibleByUser = async (perpageId,numberId,unitId,userId,statusId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var taskResponsibles;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            taskResponsibles = await Task.find({ responsibleEmployees: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            taskResponsibles = await Task.find({
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
            "tasks": taskResponsibles,
            "totalpage": totalPages
        };
}

//Lấy công việc phê duyệt theo id người dùng
exports.getTaskAccounatableByUser = async (perpageId,numberId,unitId,statusId,userId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.status,req.params.user
    var taskAccounatables;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            taskAccounatables = await Task.find({ accountableEmployees: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            taskAccounatables = await Task.find({
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
            "tasks": taskAccounatables,
            "totalpage": totalPages
        };
}

//Lấy công việc hỗ trợ theo id người dùng
exports.getTaskConsultedByUser = async (perpageId,numberId,unitId,userId,statusId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var taskConsulteds;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            taskConsulteds = await Task.find({ consultedEmployees: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            taskConsulteds = await Task.find({
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
            "tasks": taskConsulteds,
            "totalpage": totalPages
        };
}

//Lấy công việc thiết lập theo id người dùng
exports.getTaskCreatorByUser = async (perpageId,numberId,unitId,statusId,userId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.status,req.params.user
    var taskCreators;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            taskCreators = await Task.find({ creator: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            taskCreators = await Task.find({
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
            "tasks": taskCreators,
            "totalpage": totalPages 
        };
}

//Lấy công việc quan sát theo id người dùng
exports.getTaskInformedByUser = async (perpageId,numberId,unitId,userId,statusId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var taskInformeds;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            taskInformeds = await Task.find({ informedEmployees: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage)
                .populate({ path: "organizationalUnit creator parent" });
        } else {
            taskInformeds = await Task.find({
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
            "tasks": taskInformeds,
            "totalpage": totalPages
        };
}

//Tạo công việc mới
exports.create = async (parentId,startdateId,enddateId,unitId,creatorId,nameId,descriptionId,priorityId,tasktemplateId,roleId,kpiId,responsibleId,accounatableId,consultedId,informedId) => {
    console.log('--------create task---------');    
    // Lấy thông tin công việc cha
        var level = 1;
        if (mongoose.Types.ObjectId.isValid(parentId)) {
            var parent = await Task.findById(parentId);
            if (parent) level = parent.level + 1;
        }
        
        // convert thời gian từ string sang date
        var starttime = startdateId.split("-");
        var startdate = new Date(starttime[2], starttime[1]-1, starttime[0]);
        var endtime = enddateId.split("-");
        var enddate = new Date(endtime[2], endtime[1]-1, endtime[0]);
        
        var task = await Task.create({ //Tạo dữ liệu mẫu công việc
            organizationalUnit: unitId,
            creator: creatorId, //id của người tạo
            name: nameId,
            description: descriptionId,
            startDate: startdate,
            endDate: enddate,
            priority: priorityId,
            taskTemplate: tasktemplateId,
            role: roleId,
            parent: parentId,
            level: level,
            kpis: kpiId,
            responsibleEmployees: responsibleId,
            accountableEmployees: accounatableId,
            consultedEmployees: consultedId,
            informedEmployees: informedId,
        });
        console.log('task--->', task);
        if(tasktemplateId !== null){
            var tasktemplate = await TaskTemplate.findByIdAndUpdate(
                tasktemplateId, { $inc: { 'count': 1} }, { new: true }
            );
        }
        task = await task.populate({path: "unit creator parent"}).execPopulate();
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
    var task = await Task.findByIdAndUpdate(taskID, { $set: {status: status }}, { new: true } );
    return task;
}
