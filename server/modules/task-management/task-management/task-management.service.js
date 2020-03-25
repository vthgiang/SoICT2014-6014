const mongoose = require("mongoose");
const Task = require('../../../models/task.model');
const Role = require('../../../models/role.model');
const ActionTask = require('../../../models/actionTask.model');
const InformationTaskTemplate = require('../../../models/informationTaskTemplate.model');
const Department = require('../../../models/department.model');

//Lấy tất cả các công việc
exports.get = (req, res) => {
    Task.find()
        .then(tasks => res.status(200).json(tasks))
        .catch(err => res.status(400).json({ msg: err }));
    console.log("Get All Task");
}

//Lấy mẫu công việc theo Id
exports.getById = async (req, res) => {
    try {
        var task = await Task.findById(req.params.id)
            .populate({ path: "unit responsible accounatable consulted informed parent tasktemplate comments" });
        if (task.tasktemplate !== null) {
            var actionTemplates = await ActionTask.find({ tasktemplate: task.tasktemplate._id });
            var informationTemplate = await InformationTaskTemplate.find({ tasktemplate: task.tasktemplate._id });
            res.status(200).json({
                "info": task,
                "actions": actionTemplates,
                "informations": informationTemplate
            })
        } else {
            res.status(200).json({"info": task});
        }
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

//Lấy mẫu công việc theo chức danh và người dùng
exports.getByRole = async (req, res) => {
    try {
        var tasks = await Task.find({
            role: req.params.role,
            creator: req.params.id
        }).populate({ path: 'tasktemplate', model: TaskTemplate });
        res.status(200).json(tasks)
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

//Lấy công việc thực hiện chính theo id người dùng
exports.getTaskResponsibleByUser = async (req, res) => {
    try {
        var taskResponsibles;
        var perPage = Number(req.params.perpage);
        var page = Number(req.params.number);
        if (req.params.unit === "[]" && req.params.status === "[]") {
            taskResponsibles = await Task.find({ responsible: { $in: [req.params.user] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "unit creator parent" });
        } else {
            taskResponsibles = await Task.find({
                responsible: { $in: [req.params.user] },
                $or: [
                    { unit: { $in: req.params.unit.split(",") } },
                    { status: { $in: req.params.status.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "unit creator parent" });
        }
        var totalCount = await Task.count({ responsible: { $in: [req.params.user] } });
        var totalPages = Math.ceil(totalCount / perPage);
        console.log('----------------------taskResponsibles------------------------', taskResponsibles);
        res.status(200).json({
            "tasks": taskResponsibles,
            "totalpage": totalPages
        })
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

//Lấy công việc phê duyệt theo id người dùng
exports.getTaskAccounatableByUser = async (req, res) => {
    try {
        var taskAccounatables;
        var perPage = Number(req.params.perpage);
        var page = Number(req.params.number);
        if (req.params.unit === "[]" && req.params.status === "[]") {
            taskAccounatables = await Task.find({ accounatable: { $in: [req.params.user] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "unit creator parent" });
        } else {
            taskAccounatables = await Task.find({
                accounatable: { $in: [req.params.user] },
                $or: [
                    { unit: { $in: req.params.unit.split(",") } },
                    { status: { $in: req.params.status.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "unit creator parent" });
        }
        var totalCount = await Task.count({ accounatable: { $in: [req.params.user] } });
        var totalPages = Math.ceil(totalCount / perPage);
        res.status(200).json({
            "tasks": taskAccounatables,
            "totalpage": totalPages
        })
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

//Lấy công việc hỗ trợ theo id người dùng
exports.getTaskConsultedByUser = async (req, res) => {
    try {
        var taskConsulteds;
        var perPage = Number(req.params.perpage);
        var page = Number(req.params.number);
        if (req.params.unit === "[]" && req.params.status === "[]") {
            taskConsulteds = await Task.find({ consulted: { $in: [req.params.user] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "unit creator parent" });
        } else {
            taskConsulteds = await Task.find({
                consulted: { $in: [req.params.user] },
                $or: [
                    { unit: { $in: req.params.unit.split(",") } },
                    { status: { $in: req.params.status.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "unit creator parent" });
        }
        var totalCount = await Task.count({ consulted: { $in: [req.params.user] } });
        var totalPages = Math.ceil(totalCount / perPage);
        res.status(200).json({
            "tasks": taskConsulteds,
            "totalpage": totalPages
        })
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

//Lấy công việc thiết lập theo id người dùng
exports.getTaskCreatorByUser = async (req, res) => {
    try {
        var taskCreators;
        var perPage = Number(req.params.perpage);
        var page = Number(req.params.number);
        if (req.params.unit === "[]" && req.params.status === "[]") {
            taskCreators = await Task.find({ creator: { $in: [req.params.user] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "unit creator parent" });
        } else {
            taskCreators = await Task.find({
                creator: { $in: [req.params.user] },
                $or: [
                    { unit: { $in: req.params.unit.split(",") } },
                    { status: { $in: req.params.status.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "unit creator parent" });
        }
        var totalCount = await Task.count({ creator: { $in: [req.params.user] } });
        var totalPages = Math.ceil(totalCount / perPage);
        res.status(200).json({
            "tasks": taskCreators,
            "totalpage": totalPages
        })
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

//Lấy công việc quan sát theo id người dùng
exports.getTaskInformedByUser = async (req, res) => {
    try {
        var taskInformeds;
        var perPage = Number(req.params.perpage);
        var page = Number(req.params.number);
        if (req.params.unit === "[]" && req.params.status === "[]") {
            taskInformeds = await Task.find({ informed: { $in: [req.params.user] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage)
                .populate({ path: "unit creator parent" });
        } else {
            taskInformeds = await Task.find({
                informed: { $in: [req.params.user] },
                $or: [
                    { unit: { $in: req.params.unit.split(",") } },
                    { status: { $in: req.params.status.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "unit creator parent" });
        }
        var totalCount = await Task.count({ informed: { $in: [req.params.user] } });
        var totalPages = Math.ceil(totalCount / perPage);
        res.status(200).json({
            "tasks": taskInformeds,
            "totalpage": totalPages
        })
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

//Tạo công việc mới
exports.create = async (req, res) => {
    console.log('-------------------------đang them cong viec--------------------');
    try {
        // console.log(req.body);
        // Lấy thông tin công việc cha
        var level = 1;
        if (mongoose.Types.ObjectId.isValid(req.body.parent)) {
            var parent = await Task.findById(req.body.parent);
            if (parent) level = parent.level + 1;
        }
        // console.log(parent);
        // convert thời gian từ string sang date
        var starttime = req.body.startdate.split("-");
        var startdate = new Date(starttime[2], starttime[1]-1, starttime[0]);
        var endtime = req.body.enddate.split("-");
        var enddate = new Date(endtime[2], endtime[1]-1, endtime[0]);
        var task = await Task.create({ //Tạo dữ liệu mẫu công việc
            unit: req.body.unit,
            creator: req.body.creator, //id của người tạo
            name: req.body.name,
            description: req.body.description,
            startdate: startdate,
            enddate: enddate,
            priority: req.body.priority,
            tasktemplate: req.body.tasktemplate,
            role: req.body.role,
            parent: req.body.parent,
            level: level,
            kpi: req.body.kpi,
            responsible: req.body.responsible,
            accounatable: req.body.accounatable,
            consulted: req.body.consulted,
            informed: req.body.informed,
        });
        console.log('----------------đã thêm task---------------------: ', task);
        if(req.body.tasktemplate !== null){
            var tasktemplate = await TaskTemplate.findByIdAndUpdate(
                req.body.tasktemplate, { $inc: { 'count': 1} }, { new: true }
            );
        }
        task = await task.populate({path: "unit creator parent"}).execPopulate();
        res.status(200).json({
            message: "Create Task Template Successfully!",
            data: task
        });
    } catch (error) {
        res.status(400).json(error);
    }
}

// Sửa thông tin công việc


//Xóa công việc
exports.delete = async () => {
    try {
        var template = await WorkTemplate.findByIdAndDelete(req.params.id); // xóa mẫu công việc theo id
        var privileges = await Privilege.deleteMany({
            resource: req.params.id, //id của task template
            resourceType: "TaskTemplate"
        });

        res.status(200).json("Delete success");
    } catch (error) {
        res.status(400).json(error);
    }
    console.log("Delete Task Template")
}