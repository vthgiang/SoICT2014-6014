const ProjectTemplateService = require('./projectTemplate.service');
const NotificationServices = require(`../notification/notification.service`);
const NewsFeed = require('../news-feed/newsFeed.service');
const { sendEmail } = require(`../../helpers/emailHelper`);
const Logger = require('../../logs');

exports.get = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.get(req.portal, req.query);

        await Logger.info(req.user.email, 'get_project_template_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_project_template_success'],
            content: tp
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, 'get_project_template_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_project_template_fail'],
            content: error
        })
    }
}

exports.show = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.show(req.portal, req.params.id);

        await Logger.info(req.user.email, 'show_task_project', req.portal)
        res.status(200).json({
            success: true,
            messages: ['show_project_template_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'show_task_project', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_project_template_fail'],
            content: error
        })
    }
}

exports.create = async (req, res) => {
    try {
        const project = await ProjectTemplateService.create(req.portal, req.body);
        await Logger.info(req.user.email, 'create_project_template_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_project_template_success'],
            content: project
        });
    } catch (error) {
        console.log('error', error)
        await Logger.error(req.user.email, ' create_project_template_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_project_template_fail'],
            content: error
        })
    }
}

exports.edit = async (req, res) => {
    try {
        const project = await ProjectTemplateService.edit(req.portal, req.params.id, req.body);
        await Logger.info(req.user.email, 'edit_project_template_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_project_template_success'],
            content: project
        });
    } catch (error) {
        await Logger.error(req.user.email, ' edit_project_template_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_project_template_fail'],
            content: error
        })
    }
}

exports.delete = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.delete(req.portal, req.params.id);

        await Logger.info(req.user.email, 'delete_task_project', req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_project_template_success'],
            content: tp
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_task_project', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_project_template_fail'],
            content: error
        })
    }
}

exports.getSalaryMembers = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.getSalaryMembers(req.portal, req.body.data);

        res.status(200).json({
            success: true,
            messages: ['get_salary_members_success'],
            content: tp
        });
    } catch (error) {
        console.log('get_salary_members', error);
        await Logger.error(req.user.email, 'get_salary_members', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_salary_members_fail'],
            content: error
        })
    }
}

exports.createProjectCpmByProjectTemplate = async (req, res) => {
    try {
        let tp = await ProjectTemplateService.createProjectByProjectTemplate(req.portal, req.params.templateId, req.body);
        const taskList = tp.tasks?.tasks;
        for (let itemTask of taskList) {
            var task = itemTask.task;
            var user = itemTask.user.filter(user => user !== req.user._id); // Lọc thông tin người tạo ra khỏi danh sách sẽ gửi thông báo

            // Gửi mail cho nhân viện tham gia công việc
            var email = itemTask.email;
            var html = itemTask.html;
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
        }

        await Logger.info(req.user.email, 'create_project_by_template_success', req.portal)

        res.status(200).json({
            success: true,
            messages: ['create_project_by_template_success'],
            content: tp.template
        });
    } catch (error) {
        console.log('create_project_by_template_fail', error);
        await Logger.error(req.user.email, 'create_project_by_template_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_project_by_template_fail'],
            content: error
        })
    }
}
