const TaskProcessService = require('./taskProcess.service');
const NotificationServices = require('../../notification/notification.service');
const { LogInfo, LogError } = require('../../../logs');
const { sendEmail } = require('../../../helpers/emailHelper');

/**
 * hàm lấy tất cả các process
 * @param {*} req 
 * @param {*} res 
 */
exports.get = async (req, res) => {
	if (req.query.type === "template") {
		this.getAllXmlDiagrams(req, res);
	}
	else if (req.query.type === "task") {
		this.getAllTaskProcess(req, res);
	}
}

/**
 * Lấy tất cả diagram
 */
exports.getAllXmlDiagrams = async (req, res) => {
	try {
		var data = await TaskProcessService.getAllXmlDiagram(req.query);
		await LogInfo(req.user.email, `get all xml diagram `, req.user.company);
		res.status(200).json({
			success: true,
			messages: ['get_all_success'],
			content: data
		});
	} catch (error) {
		await LogError(req.user.email, `get all xml diagram `, req.user.company);
		res.status(400).json({
			success: false,
			messages: ['get_all_err'],
			content: error
		});
	}
}
/**
 * Lấy  diagram theo id
 */
exports.getXmlDiagramById = async (req, res) => {
	try {
		var data = await TaskProcessService.getXmlDiagramById(req.params);
		await LogInfo(req.user.email, `get all xml diagram `, req.user.company);
		res.status(200).json({
			success: true,
			messages: ['get_by_id_success'],
			content: data
		});
	} catch (error) {
		await LogError(req.user.email, `get all xml diagram `, req.user.company);
		res.status(400).json({
			success: false,
			messages: ['get_by_id_err'],
			content: error
		});
	}
}
/**
 * tạo mới diagram
 */
exports.createXmlDiagram = async (req, res) => {
	try {
		var data = await TaskProcessService.createXmlDiagram(req.body);
		await LogInfo(req.user.email, `create xml diagram `, req.user.company);
		res.status(200).json({
			success: true,
			messages: ['create_success'],
			content: data
		});
	} catch (error) {
		await LogError(req.user.email, `create xml diagram `, req.user.company);
		res.status(400).json({
			success: false,
			messages: ['create_error'],
			content: error
		});
	}
}

/**
 * chỉnh sửa mới diagram
 */
exports.editXmlDiagram = async (req, res) => {
	try {
		var data = await TaskProcessService.editXmlDiagram(req.params, req.body);
		await LogInfo(req.user.email, `edit xml diagram `, req.user.company);
		res.status(200).json({
			success: true,
			messages: ['edit_success'],
			content: data
		});
	} catch (error) {
		await LogError(req.user.email, `edit xml diagram `, req.user.company);
		res.status(400).json({
			success: false,
			messages: ['edit_fail'],
			content: error
		});
	}
}

/**
 * xóa diagram
 */
exports.deleteXmlDiagram = async (req, res) => {
	try {
		var data = await TaskProcessService.deleteXmlDiagram(req.params.diagramId, req.query);

		await LogInfo(req.user.email, `delete xml diagram `, req.user.company);
		res.status(200).json({
			success: true,
			messages: ['delete_success'],
			content: data
		});
	} catch (error) {
		await LogError(req.user.email, `edit xml diagram `, req.user.company);
		res.status(400).json({
			success: false,
			messages: ['delete_fail'],
			content: error
		});
	}
}

/**
 * Tạo công việc theo quy trình
 * @param {*} req 
 * @param {*} res 
 */
exports.createTaskByProcess = async (req, res) => {
	// try {
		let data = await TaskProcessService.createTaskByProcess(req.params.processId, req.body);

		let process = data.process;
		let mails = data.mailInfo;
		for (let i in mails) {
			let task = mails[i].task;
			let user = mails[i].user;
			let email = mails[i].email;
			let html = mails[i].html;

			let mailData = { "organizationalUnits": task.organizationalUnit._id, "title": "Tạo mới công việc", "level": "general", "content": html, "sender": task.organizationalUnit.name, "users": user };
			NotificationServices.createNotification(task.organizationalUnit.company, mailData,);
			sendEmail(email, "Tạo mới công việc hành công", '', html);
		}
		await LogInfo(req.user.email, `create_task_by_process`, req.user.company);
		res.status(200).json({
			success: true,
			messages: ['create_task_by_process_success'],
			content: process,
		});
	// } catch (error) {
	// 	await LogError(req.user.email, `create_task_by_process`, req.user.company);
	// 	res.status(400).json({
	// 		success: false,
	// 		messages: ['create_task_by_process_fail'],
	// 		content: error,
	// 	});
	// }
}

/**
 * lấy tất cả danh sách quy trình công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllTaskProcess = async (req, res) => {
	try {
		var data = await TaskProcessService.getAllTaskProcess(req.query);
		await LogInfo(req.user.email, `get_all_task_process_success`, req.user.company);
		res.status(200).json({
			success: true,
			messages: ['get_all_task_process_success'],
			content: data,
		});
	} catch (error) {
		await LogError(req.user.email, `get_all_task_process_fail`, req.user.company);
		res.status(400).json({
			success: false,
			messages: ['get_all_task_process_fail'],
			content: error,
		});
	}
}


/**
 * cập nhật diagram
 * @param {*} req 
 * @param {*} res 
 */
exports.updateDiagram = async (req, res) => {
	try {
		var data = await TaskProcessService.updateDiagram(req.params, req.body);
		await LogInfo(req.user.email, `update diagram`, req.user.company);
		res.status(200).json({
			success: true,
			messages: ['update_task_process_success'],
			content: data,
		});
	} catch (error) {
		await LogError(req.user.email, `update diagram`, req.user.company);
		res.status(400).json({
			success: false,
			messages: ['update_task_process_fail'],
			content: error,
		});
	}
}

/**
 * cập nhật thông tin quy trình công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.editProcessInfo = async (req, res) => {
	try {
		var data = await TaskProcessService.editProcessInfo(req.params, req.body);
		await LogInfo(req.user.email, `update info process`, req.user.company);
		res.status(200).json({
			success: true,
			messages: ['edit_info_process_success'],
			content: data,
		});
	} catch (error) {
		await LogError(req.user.email, `update info process`, req.user.company);
		res.status(400).json({
			success: false,
			messages: ['edit_info_process_fail'],
			content: error,
		});
	}
}