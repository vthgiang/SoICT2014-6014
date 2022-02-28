const TaskManagementService = require('./task.service');
const NotificationServices = require(`../../notification/notification.service`);
const NewsFeed = require('../../news-feed/newsFeed.service');
const { sendEmail } = require(`../../../helpers/emailHelper`);
const Logger = require(`../../../logs`);
const { Task, Project } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const moment = require('moment')
// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý công việc



/**
 * Lấy công việc theo tùy chọn
 * @param {*} req 
 * @param {*} res 
 */


exports.getTasks = async (req, res) => {
    if (req.query.type === "all_by_user") {
        getTasksByUser(req, res);
    }
    else if (req.query.type === "responsible") {
        getPaginatedTasksThatUserHasResponsibleRole(req, res);
    }
    else if (req.query.type === "consulted") {
        getPaginatedTasksThatUserHasConsultedRole(req, res);
    }
    else if (req.query.type === "informed") {
        getPaginatedTasksThatUserHasInformedRole(req, res);
    }
    else if (req.query.type === "creator") {
        getPaginatedTasksCreatedByUser(req, res);
    }
    else if (req.query.type === "accountable") {
        getPaginatedTasksThatUserHasAccountableRole(req, res);
    }
    else if (req.query.type === "all_role") {
        getPaginatedTasksByUser(req, res);
    }
    else if (req.query.type === "choose_multi_role") {
        getPaginatedTasks(req, res);
    }
    else if (req.query.type === "paginated_task_by_unit") {
        getPaginatedTasksByOrganizationalUnit(req, res);
    }
    else if (req.query.type === "get_all_task_of_organizational_unit") {
        getAllTaskOfOrganizationalUnit(req, res);
    }
    else if (req.query.type === "task_in_unit") {
        getAllTaskOfOrganizationalUnitByMonth(req, res);
    }
    else if (req.query.type === "get_all_task_of_children_organizational_unit") {
        getAllTaskOfChildrenOrganizationalUnit(req, res)
    }
    else if (req.query.type === "priority") {
        getAllTaskByPriorityOfOrganizationalUnit(req, res)
    }
    else if (req.query.type === "project") {
        getTasksByProject(req, res)
    }
}



/**
 * Lấy task evaluation
 * @param {*} req 
 * @param {*} res 
 */


exports.getTaskEvaluations = async (req, res) => {
    try {
        let taskEvaluation = await TaskManagementService.getTaskEvaluations(req.portal, req.query);

        await Logger.info(req.user.email, 'get_task_evaluations', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_evaluation_success'],
            content: taskEvaluation,
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_task_evaluations', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_task_evaluation_fail'],
            content: error,
        });
    }

}


/**
 * Lấy công việc theo vai trò người thực hiện chính
 */

getPaginatedTasksThatUserHasResponsibleRole = async (req, res) => {
    try {
        let task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            startDateAfter: req.query.startDateAfter,
            endDateBefore: req.query.endDateBefore,
            aPeriodOfTime: req.query.aPeriodOfTime
        };
        let responsibleTasks = await TaskManagementService.getPaginatedTasksThatUserHasResponsibleRole(req.portal, task);

        await Logger.info(req.user.email, 'paginated_task_that_user_has_responsible_role', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_responsible_employee_success'],
            content: responsibleTasks
        })
    } catch (error) {

        await await Logger.error(req.user.email, 'paginated_task_that_user_has_responsible_role', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_responsible_employee_failure'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người phê duyệt
 */
getPaginatedTasksThatUserHasAccountableRole = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };
        var accountableTasks = await TaskManagementService.getPaginatedTasksThatUserHasAccountableRole(req.portal, task);

        await Logger.info(req.user.email, 'paginated_tasks_that_user_has_account_table_role', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_accountable_employee_success'],
            content: accountableTasks
        });
    } catch (error) {

        await Logger.error(req.user.email, 'paginated_tasks_that_user_has_account_table_role', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_accountable_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người tư vấn
 */
getPaginatedTasksThatUserHasConsultedRole = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };
        var consultedTasks = await TaskManagementService.getPaginatedTasksThatUserHasConsultedRole(req.portal, task);

        await Logger.info(req.user.email, 'paginated_task_that_user_has_consulted_role', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_consulted_employee_success'],
            content: consultedTasks
        })
    } catch (error) {

        await Logger.error(req.user.email, 'paginated_task_that_user_has_consulted_role', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_consulted_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người tạo
 */
getPaginatedTasksCreatedByUser = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };
        var creatorTasks = await TaskManagementService.getPaginatedTasksCreatedByUser(req.portal, task);

        await Logger.info(req.user.email, 'paginated_tasks_created_by_user', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_creator_success'],
            content: creatorTasks
        })
    } catch (error) {
        await Logger.error(req.user.email, 'paginated_tasks_created_by_user', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_creator_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người quan sát
 */
getPaginatedTasksThatUserHasInformedRole = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };

        var informedTasks = await TaskManagementService.getPaginatedTasksThatUserHasInformedRole(req.portal, task);
        await Logger.info(req.user.email, 'paginated_task_that_user_has_informed_role', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_informed_employee_success'],
            content: informedTasks
        })
    } catch (error) {
        await Logger.error(req.user.email, 'paginated_task_that_user_has_informed_role', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_informed_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc chọn theo user
 */
getPaginatedTasksByUser = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            page: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };

        var tasks = await TaskManagementService.getPaginatedTasksByUser(req.portal, task);
        await Logger.info(req.user.email, ` get task informed by user `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_user_success'],
            content: tasks
        })
    } catch (error) {
        await Logger.error(req.user.email, ` get task informed by user  `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_user_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc chọn nhiều role
 */
getPaginatedTasks = async (req, res) => {
    try {
        let task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            role: req.query.role,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime,
            responsibleEmployees: req.query.responsibleEmployees,
            accountableEmployees: req.query.accountableEmployees,
            creatorEmployees: req.query.creatorEmployees,
            creatorTime: req.query.creatorTime,
            projectSearch: req.query.projectSearch,
            tags: req.query.tags
        };

        let tasks = await TaskManagementService.getPaginatedTasks(req.portal, task);
        await Logger.info(req.user.email, 'get_task_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_success'],
            content: tasks
        })
    } catch (error) {
        await Logger.error(req.user.email, 'get_task_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_fail'],
            content: error
        })
    }
}

/**
 * Tìm kiếm đơn vị theo 1 roleId
 */
getPaginatedTasksByOrganizationalUnit = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            page: req.query.page,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            isAssigned: req.query.isAssigned,
            responsibleEmployees: req.query.responsibleEmployees,
            accountableEmployees: req.query.accountableEmployees,
            creatorEmployees: req.query.creatorEmployees,
            organizationalUnitRole: req.query.organizationalUnitRole,
            tags: req.query.tags
        };

        let tasks = await TaskManagementService.getPaginatedTasksByOrganizationalUnit(req.portal, task, req.query.type);

        await Logger.info(req.user.email, ` get paginated tasks by organizational unit `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_paginated_tasks_by_organizational_unit_success'],
            content: tasks
        })
    } catch (error) {
        await Logger.error(req.user.email, ` get paginated tasks by organizational unit  `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_paginated_tasks_by_organizational_unit_failure'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người thực hiện chính với điều kiện thời gian
 */
getTasksThatUserHasResponsibleRoleByDate = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            aPeriodOfTime: req.query.aPeriodOfTime
        };
        var responsibleTasks = await TaskManagementService.getTasksThatUserHasResponsibleRoleByDate(req.portal, task);

        await await Logger.info(req.user.email, 'get_task_that_user_has_responsible_role_by_date', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_responsible_employee_success'],
            content: responsibleTasks
        })
    } catch (error) {

        await await Logger.error(req.user.email, 'get_task_that_user_has_responsible_role_by_date', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_responsible_employee_fail'],
            content: error
        })
    }
}

/**
 * Tạo một công việc mới
 */
exports.createTask = async (req, res) => {
    try {
        if (req?.files?.length > 0) {
            req.files.map(item => {
                if (req.body?.description) {
                    let src = `<img src="${item?.originalname?.split(".")?.[0]}">`.toString()
                    let newSrc = `<img src="${item?.path}">`.toString()

                    req.body.description = req.body.description.toString().replace(src, newSrc)
                }
            })
        }
        let body = JSON.parse(req.body.data)
        var tasks = await TaskManagementService.createTask(req.portal, body);
        var task = tasks.task;
        var user = tasks.user.filter(user => user !== req.user._id); //lọc thông tin người tạo ra khỏi danh sách sẽ gửi thông báo

        // Gửi mail cho nhân viện tham gia công việc
        var email = tasks.email;
        var html = tasks.html;
        var data = {
            organizationalUnits: task.organizationalUnit._id,
            title: "Tạo mới công việc",
            level: "general",
            content: html,
            sender: task.organizationalUnit.name,
            users: user,
            associatedDataObject: {
                dataType: 1,
                value: task.priority,
                description: `<p>${req.user.name} đã tạo mới công việc: <strong>${task.name}</strong> có sự tham gia của bạn.</p>`
            },
        };

        // Gửi mail cho trưởng đơn vị phối hợp thực hiện công việc
        let collaboratedEmail = tasks.collaboratedEmail;
        let collaboratedHtml = tasks.collaboratedHtml;
        let collaboratedData = {
            organizationalUnits: task.organizationalUnit._id,
            title: "Tạo mới công việc được phối hợp với đơn vị bạn",
            level: "general",
            content: collaboratedHtml,
            sender: task.organizationalUnit.name,
            users: tasks.managersOfOrganizationalUnitThatHasCollaborated,
            associatedDataObject: {
                dataType: 1,
                description: `Đơn vị bạn được mời phối hợp thực hiện trong công việc: <strong>${task.name}</strong></p>`
            },
        };

        await NotificationServices.createNotification(req.portal, req.user.company._id, data);
        await NotificationServices.createNotification(req.portal, req.user.company._id, collaboratedData);
        await sendEmail(email, task.name, '', html, null, `${task._id}@gmail.com`);
        collaboratedEmail && collaboratedEmail.length !== 0
            && await sendEmail(collaboratedEmail, "Đơn vị bạn được phối hợp thực hiện công việc mới", '', collaboratedHtml);
        await NewsFeed.createNewsFeed(req.portal, {
            title: data?.title,
            description: data?.content,
            creator: req.user._id,
            associatedDataObject: {
                dataType: 1,
                value: task?._id
            },
            relatedUsers: data?.users
        });
        await NewsFeed.createNewsFeed(req.portal, {
            title: collaboratedData?.title,
            description: collaboratedData?.content,
            creator: req.user._id,
            associatedDataObject: {
                dataType: 1,
                value: task?._id
            },
            relatedUsers: collaboratedData?.users
        });

        await Logger.info(req.user.email, 'create_task', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_task_success'],
            content: tasks?.taskPopulate
        });
    } catch (error) {
        console.log('error', error)
        await Logger.error(req.user.email, 'create_task', req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_task_fail'],
            content: error
        })
    }
}

/**
 * Tạo một công việc mới của dự án
 */
exports.createProjectTask = async (req, res) => {
    try {
        var tasks = await TaskManagementService.createProjectTask(req.portal, req.body);
        var task = tasks.task;
        var user = tasks.user.filter(user => user !== req.user._id); //lọc thông tin người tạo ra khỏi danh sách sẽ gửi thông báo

        // // Gửi mail cho nhân viện tham gia công việc
        var email = tasks.email;
        var html = tasks.html;
        var data = {
            organizationalUnits: task.organizationalUnit._id,
            title: "Tạo mới công việc",
            level: "general",
            content: html,
            sender: task.organizationalUnit.name,
            users: user,
            associatedDataObject: {
                dataType: 1,
                value: task.priority,
                description: `<p>${req.user.name} đã tạo mới công việc: <strong>${task.name}</strong> có sự tham gia của bạn.</p>`
            },
        };

        await NotificationServices.createNotification(req.portal, req.user.company._id, data);
        await sendEmail(email, "Bạn có công việc mới", '', html);
        await NewsFeed.createNewsFeed(req.portal, {
            title: data?.title,
            description: data?.content,
            creator: req.user._id,
            associatedDataObject: {
                dataType: 1,
                value: task?._id,
                description: task?.name
            },
            relatedUsers: data?.users
        });

        await Logger.info(req.user.email, 'create_task', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_task_success'],
            content: task
        });
    } catch (error) {
        await Logger.error(req.user.email, 'create_task', req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_task_fail'],
            content: error
        })
    }
}

/**
 * Tạo các công việc theo file excel - CPM cho dự án
 */
exports.createProjectTasksFromCPM = async (req, res) => {
    try {
        let totalProjectBudget = 0;
        let endDateOfProject = req.body[0]?.endDate;
        for (let currentTask of req.body) {
            if (currentTask.preceedingTasks.length > 0) {
                let currentNewPreceedingTasks = [];
                for (let currentPreceedingItem of currentTask.preceedingTasks) {
                    const localPreceedingItem = req.body.find(item => item.code === currentPreceedingItem.task);
                    const remotePreceedingItem = await Task(connect(DB_CONNECTION, req.portal)).findOne({
                        taskProject: currentTask.taskProject,
                        name: localPreceedingItem.name
                    });
                    currentNewPreceedingTasks.push({
                        task: remotePreceedingItem._id,
                        link: ''
                    })
                }
                currentTask = {
                    ...currentTask,
                    isFromCPM: true,
                    preceedingTasks: currentNewPreceedingTasks,
                }
            }
            var tasks = await TaskManagementService.createProjectTask(req.portal, currentTask);
            var task = tasks.task;
            var user = tasks.user.filter(user => user !== req.user._id); // Lọc thông tin người tạo ra khỏi danh sách sẽ gửi thông báo

            // Gửi mail cho nhân viện tham gia công việc
            var email = tasks.email;
            var html = tasks.html;
            var data = {
                organizationalUnits: task.organizationalUnit._id,
                title: "Tạo mới công việc",
                level: "general",
                content: html,
                sender: task.organizationalUnit.name,
                users: user,
                associatedDataObject: {
                    dataType: 1,
                    value: task.priority,
                    description: `<p>${req.user.name} đã tạo mới công việc: <strong>${task.name}</strong> có sự tham gia của bạn.</p>`
                },
            };

            await NotificationServices.createNotification(req.portal, req.user.company._id, data);
            await sendEmail(email, "Bạn có công việc mới", '', html);
            await NewsFeed.createNewsFeed(req.portal, {
                title: data?.title,
                description: data?.content,
                creator: req.user._id,
                associatedDataObject: {
                    dataType: 1,
                    value: task?._id,
                    description: task?.name
                },
                relatedUsers: data?.users
            });

            await Logger.info(req.user.email, 'create_tasks_list_excel_cpm', req.portal)

            totalProjectBudget += currentTask.estimateNormalCost;
            if (moment(currentTask.endDate).isAfter(moment(endDateOfProject))) {
                endDateOfProject = currentTask.endDate;
            }
        }

        await Project(connect(DB_CONNECTION, req.portal)).findByIdAndUpdate(req.body[0].taskProject, {
            $set: {
                budget: totalProjectBudget,
                endDate: endDateOfProject,
                budgetChangeRequest: totalProjectBudget,
                endDateRequest: endDateOfProject,
            }
        }, { new: true });
        res.status(200).json({
            success: true,
            messages: ['create_tasks_list_excel_cpm_success'],
            content: null
        });
    } catch (error) {
        await Logger.error(req.user.email, 'create_tasks_list_excel_cpm', req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_tasks_list_excel_cpm_fail'],
            content: error
        })
    }
}

/**
 *  Xóa một hoặc nhiều công việc đã thiết lập
 */
exports.deleteTask = async (req, res) => {
    try {
        TaskManagementService.deleteTask(req.portal, req.params.taskId, req.query.userId);

        await Logger.info(req.user.email, 'delete_task', req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_success']
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_task', req.portal)
        res.status(400).json({
            success: false,
            messages: ['delete_fail']
        })
    }
}

/**
 * Lay ra cong viec con
 */
exports.getSubTask = async (req, res) => {
    try {
        var task = await TaskManagementService.getSubTask(req.portal, req.params.taskId);

        await Logger.info(req.user.email, 'get_sub_task', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_subtask_success'],
            content: task
        })
    } catch (error) {

        await Logger.error(req.user.email, 'get_sub_task', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_subtask_fail'],
            content: error
        })
    }
}

/**
 * edit task by responsible employee
 */
exports.editTaskByResponsibleEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.editTaskByResponsibleEmployees(req.portal, req.body, req.params.id);
        var user = task.user;
        var tasks = task.tasks;
        var data = {
            "organizationalUnits": tasks.organizationalUnit,
            "title": "Cập nhật thông tin công việc",
            "level": "general",
            "content": `${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt`,
            "sender": tasks.name,
            "users": tasks.accountableEmployees,
            associatedDataObject: {
                dataType: 1,
                description: `<p><strong>${tasks.name}:</strong> ${user.name} đã cập nhật thông tin công việc với vai trò người thực hiện</p>`,
            }
        };

        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, data,);
        let title = "Cập nhật thông tin công việc:" + task.name;
        sendEmail(task.email, task.name, '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.id}">${process.env.WEBSITE}/task?taskId=${req.params.id}</a></p>`, `${tasks._id}@gmail.com`, null);
        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: task.newTask
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_fail'],
            content: error
        });
    }
}
/**
 * edit task by responsible employee
 */
exports.editTaskByAccountableEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.editTaskByAccountableEmployees(req.portal, req.body, req.params.id);
        var user = task.user;
        var tasks = task.tasks;
        var data = {
            "organizationalUnits": tasks.organizationalUnit,
            "title": "Cập nhật thông tin công việc",
            "level": "general",
            "content": `${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt`,
            "sender": tasks.name,
            "users": tasks.responsibleEmployees,
            associatedDataObject: {
                dataType: 1,
                description: `<p><strong>${tasks.name}:</strong> ${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt</p>`
            }
        };

        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, data,);
        let title = "Cập nhật thông tin công việc:" + task.name;
        sendEmail(task.email, task.name, '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.id}">${process.env.WEBSITE}/task?taskId=${req.params.id}</a></p>`, `${tasks._id}@gmail.com`, null);
        await Logger.info(req.user.email, 'edit_task_by_account_table_employees', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: task.newTask
        })
    } catch (error) {
        await Logger.error(req.user.email, 'edit_task_by_account_table_employees', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_fail'],
            content: error
        });
    }
}
/**
 * evaluate task by consulted employee
 */
exports.evaluateTaskByConsultedEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.evaluateTaskByConsultedEmployees(req.portal, req.body, req.params.id);
        await Logger.info(req.user.email, 'evaluate_task_by_consulted_employees', req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, 'evaluate_task_by_consulted_employees', req.portal);
        res.status(400).json({
            success: false,
            messages: ['evaluate_task_fail'],
            content: error
        });
    }
}
/**
 * evaluate task by responsible employee
 */
exports.evaluateTaskByResponsibleEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.evaluateTaskByResponsibleEmployees(req.portal, req.body, req.params.id);
        await Logger.info(req.user.email, 'evaluate_task_by_responsible_employees', req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, 'evaluate_task_by_responsible_employees', req.portal);
        res.status(400).json({
            success: false,
            messages: ['evaluate_task_fail'],
            content: error
        });
    }
}
/**
 * evaluate task by accountable employee
 */
exports.evaluateTaskByAccountableEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.evaluateTaskByAccountableEmployees(req.portal, req.body, req.params.id);
        await Logger.info(req.user.email, 'evaluate_task_by_account_table_employees', req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, 'evaluate_task_by_account_table_employees', req.portal);
        res.status(400).json({
            success: false,
            messages: ['evaluate_task_fail'],
            content: error
        });
    }
}

/**
 * lấy các công việc sắp hết hạn và quá hạn của nhân viên 
 */
getTasksByUser = async (req, res) => {
    try {
        const tasks = await TaskManagementService.getTasksByUser(req.portal, req.query);

        await Logger.info(req.user.email, 'get_task_by_user', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_by_user_success'],
            content: tasks
        });
    }
    catch (error) {
        await Logger.error(req.user.email, 'get_task_by_user', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_task_by_user_fail'],
            content: error
        });
    }
}

/** Lấy tất cả task của organizationalUnit theo tháng hiện tại */
getAllTaskOfOrganizationalUnit = async (req, res) => {
    try {
        let tasksOfOrganizationalUnit = await TaskManagementService.getAllTaskOfOrganizationalUnit(req.portal, req.query.roleId, req.query.organizationalUnitId, req.query.month);

        Logger.info(req.user.email, 'get_all_task_of_organizational_unit', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_task_of_organizational_unit_success'],
            content: tasksOfOrganizationalUnit
        })
    } catch (error) {
        Logger.error(req.user.email, 'get_all_task_of_organizational_unit', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_task_of_organizational_unit_failure'],
            content: error
        })
    }
}

/** Lấy tất cả task của các đơn vị con của đơn vị hiện tại */
getAllTaskOfChildrenOrganizationalUnit = async (req, res) => {
    try {
        let tasksOfChildrenOrganizationalUnit = await TaskManagementService.getAllTaskOfChildrenOrganizationalUnit(req.portal, req.query.roleId, req.query.month, req.query.organizationalUnitId); // req.portal === req.user.company._id

        Logger.info(req.user.email, 'get_all_task_of_children_organizational_unit', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_task_of_children_organizational_unit_success'],
            content: tasksOfChildrenOrganizationalUnit
        })
    } catch (error) {
        Logger.error(req.user.email, 'get_all_task_of_children_organizational_unit', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_task_of_children_organizational_unit_failure'],
            content: error
        })
    }
}
/** Lấy tất cả task của organizationalUnit trong một khoảng thời gian */
getAllTaskOfOrganizationalUnitByMonth = async (req, res) => {
    try {
        let task = {
            organizationalUnitId: req.query.organizationUnitId,
            startMonth: req.query.startDateAfter,
            endMonth: req.query.endDateBefore,
        };
        let responsibleTasks = await TaskManagementService.getAllTaskOfOrganizationalUnitByMonth(req.portal, task);

        await Logger.info(req.user.email, 'get_all_task_of_organizational_unit_by_month', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_all_task_of_organizational_unit_success'],
            content: responsibleTasks
        })
    } catch (error) {
        await Logger.error(req.user.email, 'get_all_task_of_organizational_unit_by_month', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_all_task_of_organizational_unit_failure'],
            content: error
        })
    }
}

exports.getTaskAnalyseOfUser = async (req, res) => {
    try {
        let portal = req.portal;
        let { userId } = req.params;
        let { type, date } = req.query;
        let taskAnalys = await TaskManagementService.getTaskAnalyseOfUser(portal, userId, type, date);

        await Logger.info(req.user.email, 'get_task_analys_of_user_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_analys_of_user_success'],
            content: taskAnalys
        })
    } catch (error) {

        await Logger.error(req.user.email, 'get_task_analys_of_user_failure', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_task_analys_of_user_failure'],
            content: error
        })
    }
}

getAllTaskByPriorityOfOrganizationalUnit = async (req, res) => {
    try {
        let task = {
            organizationalUnitId: req.query.organizationUnitId,
            date: req.query.date,
        };
        const data = await TaskManagementService.getAllTaskByPriorityOfOrganizationalUnit(req.portal, task);
        await Logger.info(req.user.email, 'get_all_task_by_priority_of_organizational_unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_all_task_by_priority_of_organizational_unit_success'],
            content: data
        })
    } catch (error) {
        await Logger.error(req.user.email, 'get_all_task_by_priority_of_organizational_unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_all_task_by_priority_of_organizational_unit_failure'],
            content: error
        })
    }
}

exports.getUserTimeSheet = async (req, res) => {
    try {
        let portal = req.portal;
        let { userId, month, year, requireActions } = req.query;
        let timesheetlogs = await TaskManagementService.getUserTimeSheet(portal, userId, month, year, requireActions);

        await Logger.info(req.user.email, 'get_user_time_sheet_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_user_time_sheet_success'],
            content: timesheetlogs
        })
    } catch (error) {
        await Logger.error(req.user.email, 'get_user_time_sheet_failure', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_user_time_sheet_failure'],
            content: error
        })
    }
}

exports.getAllUserTimeSheet = async (req, res) => {
    try {
        let portal = req.portal;
        let { month, year, rowLimit, page, timeLimit } = req.query;
        let timesheetlogs = await TaskManagementService.getUserTimeSheet(portal, null, month, year, false, rowLimit, page, timeLimit);

        await Logger.info(req.user.email, 'get_all_user_time_sheet_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_all_user_time_sheet_success'],
            content: timesheetlogs
        })
    } catch (error) {
        await Logger.error(req.user.email, 'get_all_user_time_sheet_failure', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_user_time_sheet_failure'],
            content: error
        })
    }
}

getTasksByProject = async (req, res) => {
    try {
        let portal = req.portal;
        let { projectId, page, perPage } = req.query;
        let tasksResult = await TaskManagementService.getTasksByProject(portal, projectId, page, perPage);

        await Logger.info(req.user.email, 'get_tasks_by_project_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_tasks_by_project_success'],
            content: tasksResult
        })
    } catch (error) {
        console.log('get_tasks_by_project_failure', error)
        await Logger.error(req.user.email, 'get_tasks_by_project_failure', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_tasks_by_project_failure'],
            content: error
        })
    }
}


exports.importTasks = async (req, res) => {
    try {
        let data = {}, dataUpdate = {};
        const { importData, importType } = req.body;

        let checkImport;
        if (importType === "import_tasks" && importData?.valueImport?.length) {
            checkImport = await TaskManagementService.checkImportTasks(req.body?.importData?.valueImport, req.portal, req.user);
        }
        let checkImportUpdate;
        if (importType === "import_update_task_info" && importData?.valueImport?.length) {
            checkImportUpdate = await TaskManagementService.checkImportUpdateTasks(req.body?.importData?.valueImport, req.portal, req.user);
        }

        if (importType === "import_tasks") {
            if (checkImport?.data?.length && (!checkImport?.rowError || checkImport?.rowError?.length === 0)) {
                await TaskManagementService.importTasks(checkImport.data, req.portal, req.user);

                if (importData?.valueImportTaskActions?.length) {
                    await TaskManagementService.importTaskActions(req.body?.importData?.valueImportTaskActions, req.portal, req.user);
                }

                if (importData?.valueImportTaskTimesheetLog?.length) {
                    await TaskManagementService.importTimeSheetLogs(req.body?.importData?.valueImportTaskTimesheetLog, req.portal, req.user);
                }

                await Logger.info(req.user.email, 'import_task_success', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ['import_task_success'],
                    content: []
                })

            } else {
                // return lỗi về client
                data = { generalInfo: { ...checkImport } }

                await Logger.error(req.user.email, 'import_task_failure', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["import_task_failure"],
                    content: data
                });
            }
        }

        // trường hợp update import.
        if (importType === "import_update_task_info") {
            if (checkImportUpdate?.data?.length && (!checkImportUpdate?.rowError || checkImportUpdate?.rowError?.length === 0)) {
                dataUpdate = await TaskManagementService.importUpdateTasks(checkImportUpdate.data, req.portal, req.user);
                await Logger.info(req.user.email, 'import_task_success', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ['import_task_success'],
                    content: []
                })
            } else {
                // return lỗi về client
                dataUpdate = { generalInfo: { ...checkImportUpdate } }

                await Logger.error(req.user.email, 'import_update_task_failure', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["import_update_task_failure"],
                    content: dataUpdate
                });
            }
        }
    } catch (error) {
        console.log('errror', error)
        await Logger.error(req.user.email, 'import_task_failure', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['import_task_failure'],
            content: error
        })
    }
}


exports.getOrganizationTaskDashboardChartData = async (req, res) => {
    try {
        const data = await TaskManagementService.getOrganizationTaskDashboardChartData(req.query, req.portal, req.user);
        await Logger.info(req.user.email, 'get_task_dashboard_data_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_task_dashboard_data_success'],
            content: data
        })
    } catch (error) {
        console.log('errror', error)
        await Logger.error(req.user.email, 'get_task_dashboard_data_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_task_dashboard_data_fail'],
            content: error
        })
    }
}
