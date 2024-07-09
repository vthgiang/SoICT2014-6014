const TaskProcessService = require('./taskProcess.service');
const NotificationServices = require('../../notification/notification.service');
const { sendEmail } = require('../../../helpers/emailHelper');
const Logger = require('../../../logs');
const rabbitmq = require('../../../rabbitmq/client');
const listRpcQueue = require('../../../rabbitmq/listRpcQueue');

const get = async (req, res) => {
  if (req.query.type === 'template') {
    getAllXmlDiagrams(req, res);
  } else if (req.query.type === 'task') {
    getAllTaskProcess(req, res);
  }
};

const getAllXmlDiagrams = async (req, res) => {
  try {
    const data = await TaskProcessService.getAllXmlDiagram(req.portal, req.query);
    await Logger.info(req.user.email, 'get all xml diagram', req.portal);
    res.status(200).json({
      success: true,
      messages: ['get_all_success'],
      content: data,
    });
  } catch (error) {
    await Logger.error(req.user.email, 'get all xml diagram', req.portal);
    res.status(400).json({
      success: false,
      messages: ['get_all_err'],
      content: error,
    });
  }
};

const getXmlDiagramById = async (req, res) => {
  try {
    const data = await TaskProcessService.getXmlDiagramById(req.portal, req.params);
    await Logger.info(req.user.email, 'get xml diagram by id', req.portal);
    res.status(200).json({
      success: true,
      messages: ['get_by_id_success'],
      content: data,
    });
  } catch (error) {
    await Logger.error(req.user.email, 'get xml diagram by id', req.portal);
    res.status(400).json({
      success: false,
      messages: ['get_by_id_err'],
      content: error,
    });
  }
};

const createXmlDiagram = async (req, res) => {
  try {
    const data = await TaskProcessService.createXmlDiagram(req.portal, req.body);
    await Logger.info(req.user.email, 'create xml diagram', req.portal);
    res.status(200).json({
      success: true,
      messages: ['create_success'],
      content: data,
    });
  } catch (error) {
    await Logger.error(req.user.email, 'create xml diagram', req.portal);
    res.status(400).json({
      success: false,
      messages: ['create_error'],
      content: error,
    });
  }
};

const editXmlDiagram = async (req, res) => {
  try {
    const data = await TaskProcessService.editXmlDiagram(req.portal, req.params, req.body);
    await Logger.info(req.user.email, 'edit xml diagram', req.portal);
    res.status(200).json({
      success: true,
      messages: ['edit_success'],
      content: data,
    });
  } catch (error) {
    await Logger.error(req.user.email, 'edit xml diagram', req.portal);
    res.status(400).json({
      success: false,
      messages: ['edit_failure'],
      content: error,
    });
  }
};

const deleteXmlDiagram = async (req, res) => {
  try {
    const data = await TaskProcessService.deleteXmlDiagram(req.portal, req.params.diagramId, req.query);
    await Logger.info(req.user.email, 'delete xml diagram', req.portal);
    res.status(200).json({
      success: true,
      messages: ['delete_success'],
      content: data,
    });
  } catch (error) {
    await Logger.error(req.user.email, 'delete xml diagram', req.portal);
    res.status(400).json({
      success: false,
      messages: ['delete_failure'],
      content: error,
    });
  }
};

const deleteTaskProcess = async (req, res) => {
  try {
    const data = await TaskProcessService.deleteTaskProcess(req.portal, req.params.taskProcessId, req.query);
    await Logger.info(req.user.email, 'delete taskProcess', req.portal);
    res.status(200).json({
      success: true,
      messages: ['delete_success'],
      content: data,
    });
  } catch (error) {
    await Logger.error(req.user.email, 'delete taskProcess', req.portal);
    res.status(400).json({
      success: false,
      messages: ['delete_failure'],
      content: error,
    });
  }
};

const getProcessById = async (req, res) => {
  try {
    const data = await TaskProcessService.getProcessById(req.portal, req.params);
    await Logger.info(req.user.email, 'get Process by id', req.portal);
    res.status(200).json({
      success: true,
      messages: ['get_by_id_success'],
      content: data,
    });
  } catch (error) {
    await Logger.error(req.user.email, 'get Process by id', req.portal);
    res.status(400).json({
      success: false,
      messages: ['get_by_id_err'],
      content: error,
    });
  }
};

const createTaskByProcess = async (req, res) => {
  try {
    const data = await TaskProcessService.createTaskByProcess(req.portal, req.params.processId, req.body);
    const { process, mailInfo } = data;
    for (const mail of mailInfo) {
      const { task, user, email, html, collaboratedEmail, collaboratedHtml, managersOfOrganizationalUnitThatHasCollaborated } = mail;
      const mailData = {
        organizationalUnits: task.organizationalUnit,
        title: 'Tạo mới công việc',
        level: 'general',
        content: html,
        sender: task.organizationalUnit.name,
        users: user,
        associatedDataObject: {
          dataType: 1,
          description: `<strong>${req.user.name}</strong>: đã tạo mới công việc theo quy trình`,
        },
      };

      const collaboratedData = {
        organizationalUnits: task.organizationalUnit._id,
        title: 'Tạo mới công việc được phối hợp với đơn vị bạn',
        level: 'general',
        content: collaboratedHtml,
        sender: task.organizationalUnit.name,
        users: managersOfOrganizationalUnitThatHasCollaborated,
      };

      NotificationServices.createNotification(req.portal, task.organizationalUnit.company, mailData);
      sendEmail(email, 'Tạo mới công việc thành công', '', html);

      NotificationServices.createNotification(req.portal, task.organizationalUnit.company, collaboratedData);
      if (collaboratedEmail && collaboratedEmail.length !== 0) {
        sendEmail(collaboratedEmail, 'Đơn vị bạn được phối hợp thực hiện công việc mới', '', collaboratedHtml);
      }
    }
    await Logger.info(req.user.email, 'create_task_by_process', req.portal);

    res.status(200).json({
      success: true,
      messages: ['create_task_by_process_success'],
      content: process,
    });
  } catch (error) {
    await Logger.error(req.user.email, 'create_task_by_process', req.portal);
    res.status(400).json({
      success: false,
      messages: ['create_task_by_process_failure'],
      content: error,
    });
  }
};

const getAllTaskProcess = async (req, res) => {
  const data = await TaskProcessService.getAllTaskProcess(req.portal, req.query);
  await Logger.info(req.user.email, 'get_all_task_process_success', req.portal);
  res.status(200).json({
    success: true,
    messages: ['get_all_task_process_success'],
    content: data,
  });
};

const updateDiagram = async (req, res) => {
  try {
    const data = await TaskProcessService.updateDiagram(req.portal, req.params, req.body);
    await Logger.info(req.user.email, 'update diagram', req.portal);
    res.status(200).json({
      success: true,
      messages: ['update_task_process_success'],
      content: data,
    });
  } catch (error) {
    await Logger.error(req.user.email, 'update diagram', req.portal);
    res.status(400).json({
      success: false,
      messages: ['update_task_process_failure'],
      content: error,
    });
  }
};

const editProcessInfo = async (req, res) => {
  const data = await TaskProcessService.editProcessInfo(req.portal, req.params, req.body);
  await Logger.info(req.user.email, 'update info process', req.portal);
  res.status(200).json({
    success: true,
    messages: ['edit_info_process_success'],
    content: data,
  });
};

const importProcessTemplate = async (req, res) => {
  const result = await TaskProcessService.importProcessTemplate(req.portal, req.body.data, req.body.idUser);
  await Logger.info(req.user.email, 'import process', req.portal);
  res.status(200).json({
    success: true,
    messages: ['import_process_success'],
    content: result,
  });
};

const getListUserProgressTask = async (req, res) => {
  try {
    const { currentRole, month, year } = req.query;
    const response = await rabbitmq.gRPC(
      'taskProcess.getListUserProgressTask',
      JSON.stringify({ currentRole, month, year, portal: req.portal }),
      listRpcQueue.TASK_SERVICE
    );
    res.status(200).json({
      success: true,
      messages: ['import_process_success'],
      content: JSON.parse(response),
    });
  } catch (error) {
    await Logger.error(req.user.email, 'get list user progress task failed', req.portal);
    res.status(400).json({
      success: false,
      messages: ['get_list_progress_task_failure'],
      content: error,
    });
  }
};

module.exports = {
  get,
  getAllXmlDiagrams,
  getXmlDiagramById,
  createXmlDiagram,
  editXmlDiagram,
  deleteXmlDiagram,
  deleteTaskProcess,
  getProcessById,
  createTaskByProcess,
  getAllTaskProcess,
  updateDiagram,
  getListUserProgressTask,
  editProcessInfo,
  importProcessTemplate,
};
