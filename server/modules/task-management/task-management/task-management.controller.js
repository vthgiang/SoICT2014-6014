const TaskManagementService = require('./task-management.service');
const {  LogInfo,  LogError } = require('../../../logs');
// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý công việc
// Lấy tất cả các công việc
exports.get = (req, res) => {
    return TaskManagementService.get(req, res);
}

// Lấy công việc theo id
exports.getById =async (req, res) => {
    try {
        var task = await TaskManagementService.getById(req.params.id);
        await LogInfo(req.user.email, ` get task by id `,req.user.company);
        res.status(200).json(task);
    } catch (error) {
        await LogError(req.user.email, ` get task by id `,req.user.company);
        res.status(400).json({
            message : error
        });
    };
};
// Lấy công việc theo chức danh
exports.getByRole =async (req, res) => {
try {
    var tasks= await TaskManagementService.getByRole(req.params.role,req.params.id);
    await LogInfo(req.user.email, ` get task by role `,req.user.company)
    res.status(200).json(tasks);
} catch (error) {
    await LogError(req.user.email, ` get task by role  `,req.user.company)
    res.status(400).json({
        message: error
    })
}

}

// Lấy công việc theo vai trò người tạo
exports.getTaskCreatorByUser =async (req, res) => {
    try {
        var taskCreators = await  TaskManagementService.getTaskCreatorByUser(req.params.perpage,req.params.number,req.params.unit,req.params.status,req.params.user);
        await LogInfo(req.user.email, ` get task creator by user `,req.user.company)
        res.status(200).json(taskCreators)
    } catch (error) {
        await LogError(req.user.email, ` get task creator by user `,req.user.company)
        res.status(400).json({
            message: error
        })
    }
}

// Lấy công việc theo vai trò người phê duyệt
exports.getTaskAccounatableByUser =async (req, res) => {
    try {
        var taskAccounatables = await TaskManagementService.getTaskAccounatableByUser(req.params.perpage,req.params.number,req.params.unit,req.params.status,req.params.user);
        await LogInfo(req.user.email, ` get task accountable by user  `,req.user.company)
        res.status(200).json(taskAccounatables);
    } catch (error) {
        await LogError(req.user.email, ` get task accountable by user `,req.user.company)
        res.status(400).json({
            message: error
        })
    }
}

// Lấy công việc theo vai trò người hỗ trợ
exports.getTaskConsultedByUser =async (req, res) => {
    try {
        var taskConsulteds = await  TaskManagementService.getTaskConsultedByUser(req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status);
        await LogInfo(req.user.email, ` get task consulted by user `,req.user.company)
        res.status(200).json(taskConsulteds)
    } catch (error) {
        await LogError(req.user.email, ` get task consulted by user `,req.user.company)
        res.status(400).json({
            message: error
        })
    }
}

// Lấy công việc theo vai trò người quan sát
exports.getTaskInformedByUser =async (req, res) => {
    try {
        var taskInformeds = await TaskManagementService.getTaskInformedByUser(req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status);
        await LogInfo(req.user.email, ` get task informed by user `,req.user.company)
        res.status(200).json(taskInformeds)
    } catch (error) {
        await LogError(req.user.email, ` get task informed by user  `,req.user.company)
        res.status(400).json({
            message: error
        })
    }
}

// Lấy công việc theo vai trò người thực hiện chính
exports.getTaskResponsibleByUser =async (req, res) => {
    try {
        var taskResponsibles = await TaskManagementService.getTaskResponsibleByUser(req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status);
        await await LogInfo(req.user.email, ` get task responsible by user `,req.user.company)
        res.status(200).json(taskResponsibles)
    } catch (error) {
        await await LogError(req.user.email, ` get task responsible by user `,req.user.company)
        res.status(400).json({
            message: error
        })
    }
}
// Tạo một công việc mới
exports.create = async (req, res) => {
    try {
        var task = await TaskManagementService.create(req.body.parent,req.body.startdate,req.body.enddate,req.body.unit,req.body.creator,req.body.name,req.body.description,req.body.priority,req.body.tasktemplate,req.body.role,req.body.kpi,req.body.responsible,req.body.accounatable,req.body.consulted,req.body.informed); 
        await LogInfo(req.user.email, ` create task `,req.user.company)
        res.status(200).json({
            message: "Create Task Template Successfully!",
            data: task
        });
    } catch (error) {
        await LogInfo(req.user.email, ` create task  `,req.user.company)
        res.status(400).json({
            message: error
        })
    }
}
// Xóa một công việc đã thiết lập
exports.delete =async (req, res) => {
    try {
        TaskManagementService.delete(req.params.id);
        await LogInfo(req.user.email, ` delete task  `,req.user.company)
        res.status(200).json("Delete success");
    } catch (error) {
        await LogError(req.user.email, ` delete task `,req.user.company)
        res.status(400).json({
            message: error
        })
    }

}