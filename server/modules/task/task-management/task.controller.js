const TaskManagementService = require('./task.service');
const {  LogInfo,  LogError } = require('../../../logs');
// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý công việc
// Lấy tất cả các công việc
exports.getAllTask = async (req, res) => {
    try {
        var tasks = TaskManagementService.getAllTask(req, res);
        await LogInfo(req.user.email, ` get all tasks `,req.user.company);
        res.status(200).json({
            success: true, 
            messages: ['get all task success'], 
            content: {tasks}
        });
    } catch (error) {
        await LogError(req.user.email, ` get task by id `,req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['get all task fail'], 
            content: {error}
        });
    }
}

// Lấy công việc theo id
exports.getTaskById = async (req, res) => {
    try {
        var task = await TaskManagementService.getTaskById(req.params.id);
        await LogInfo(req.user.email, ` get task by id `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Get task by id success'],
            content: {task}
        });
    } catch (error) {
        await LogError(req.user.email, ` get task by id `,req.user.company);
        res.status(400).json({
            success: false,
            messages: ['Get task by id fail'],
            content: {error}
        });
    };
};

// Lấy công việc theo chức danh
exports.getTaskByRole = async (req, res) => {
    try {
        var tasks= await TaskManagementService.getByRole(req.params.role,req.params.id);
        await LogInfo(req.user.email, ` get task by role `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['Get tasks by role success'],
            content: {tasks}
        });
    } catch (error) {
        await LogError(req.user.email, ` get task by role  `,req.user.company)
        res.status(400).json({
            success: false,
            messages: ['Get tasks by role fail'],
            content: {error}
        })
    }

}

// Lấy công việc theo vai trò người thực hiện chính
exports.getResponsibleTaskByUser = async (req, res) => {
    try {
        var responsibleTasks = await TaskManagementService.getResponsibleTaskByUser(req.params.perPage,req.params.number,req.params.unit,req.params.user,req.params.status);
        await await LogInfo(req.user.email, ` get task responsible by user `,req.user.company)
        res.status(200).json({
            success:true,
            messages: ['get task of responsible employee success'],
            content: {responsibleTasks}
        })
    } catch (error) {
        await await LogError(req.user.email, ` get task responsible by user `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['get task of responsible employee fail'],
            content: {error}
        })
    }
}

// Lấy công việc theo vai trò người phê duyệt
exports.getAccountableTaskByUser = async (req, res) => {
    try {
        var accountableTasks = await TaskManagementService.getAccountableTaskByUser(req.params.perPage,req.params.number,req.params.unit,req.params.status,req.params.user);
        await LogInfo(req.user.email, ` get task accountable by user  `,req.user.company)
        // res.status(200).json(accountableTasks);
        res.status(200).json({
            success:true,
            messages: ['get task of accountable employee success'],
            content: {accountableTasks}
        });
    } catch (error) {
        await LogError(req.user.email, ` get task accountable by user `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['get task of accountable employee fail'],
            content: {error}
        })
    }
}

// Lấy công việc theo vai trò người hỗ trợ
exports.getConsultedTaskByUser = async (req, res) => {
    try {
        var consultedTasks = await  TaskManagementService.getConsultedTaskByUser(req.params.perPage,req.params.number,req.params.unit,req.params.user,req.params.status);
        await LogInfo(req.user.email, ` get task consulted by user `,req.user.company)
        res.status(200).json({
            success:true,
            messages: ['get task of consulted employee success'],
            content: {consultedTasks}
        })
    } catch (error) {
        await LogError(req.user.email, ` get task consulted by user `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['get task of consulted employee fail'],
            content: {error}
        })
    }
}

// Lấy công việc theo vai trò người tạo
exports.getCreatorTaskByUser = async (req, res) => {
    try {
        var creatorTasks = await  TaskManagementService.getCreatorTaskByUser(req.params.perPage,req.params.number,req.params.unit,req.params.status,req.params.user);
        await LogInfo(req.user.email, ` get task creator by user `,req.user.company)
        res.status(200).json({
            success:true,
            messages: ['get task of creator success'],
            content: {creatorTasks}
        })
    } catch (error) {
        await LogError(req.user.email, ` get task creator by user `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['get task of creator fail'],
            content: {error}
        })
    }
}

// Lấy công việc theo vai trò người quan sát
exports.getInformedTaskByUser = async (req, res) => {
    try {
        var informedTasks = await TaskManagementService.getInformedTaskByUser(req.params.perPage,req.params.number,req.params.unit,req.params.user,req.params.status);
        await LogInfo(req.user.email, ` get task informed by user `,req.user.company)
        res.status(200).json({
            success:true,
            messages: ['get task of informed employee success'],
            content: {informedTasks}
        })
    } catch (error) {
        await LogError(req.user.email, ` get task informed by user  `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['get task of informed employee fail'],
            content: {error}
        })
    }
}

// Tạo một công việc mới
exports.create = async (req, res) => {
    try {
        var task = await TaskManagementService.create(req.body.parent,req.body.startDate,req.body.endDate,req.body.unit,req.body.creator,req.body.name,req.body.description,req.body.priority,req.body.taskTemplate,req.body.role,req.body.kpi,req.body.responsibleEmployees,req.body.accountableEmployees,req.body.consultedEmployees,req.body.informedEmployees); 
        await LogInfo(req.user.email, ` create task `,req.user.company)
        res.status(200).json({
            success:true,
            messages: ['create task success'],
            content: {task}
        });
    } catch (error) {
        await LogError(req.user.email, ` create task  `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['create task fail'],
            content: {error}
        })
    }
}
// Xóa một công việc đã thiết lập
exports.delete = async (req, res) => {
    try {
        TaskManagementService.delete(req.params.id);
        await LogInfo(req.user.email, ` delete task  `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['delete success']
        });
    } catch (error) {
        await LogError(req.user.email, ` delete task `,req.user.company)
        res.status(400).json({
            success: false,
            messages: ['delete fail']
        })
    }
}

// chinh sua trng thai cua cong viec
exports.editStatusOfTask = async (req, res) => {
    try {
        var task = await TaskManagementService.editStatusOfTask(req.params.id, req.body.status);
        // await LogInfo(req.user.email, ` edit status of task  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit status of task success'],
            content: {task}
        })
    } catch (error) {
        // await LogError(req.user.email, ` edit status of task `,req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit status of task fail'],
            content: {error}
        });
    }
}