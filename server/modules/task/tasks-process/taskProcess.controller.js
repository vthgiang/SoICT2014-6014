const TaskProcessService = require('./taskProcess.service');
const { LogInfo, LogError } = require('../../../logs');


/**
 * Lấy tất cả diagram
 */
exports.getAllXmlDiagram = async (req, res) => {
  try {
    var data = await TaskProcessService.getAllXmlDiagram(req.body);
    await LogInfo(req.user.email, `get all xml diagram `, req.user.company);
    res.status(200).json({
      success: true,
      messages: ['export thanh công'],
      content: data
    });
  } catch (error) {
    await LogError(req.user.email, `get all xml diagram `, req.user.company);
    res.status(400).json({
      success: false,
      messages: ['abc'],
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
      messages: ['export thanh công'],
      content: data
    });
  } catch (error) {
    await LogError(req.user.email, `get all xml diagram `, req.user.company);
    res.status(400).json({
      success: false,
      messages: ['abc'],
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
      messages: ['export thanh công'],
      content: data
    });
  } catch (error) {
    await LogError(req.user.email, `createt xml diagram `, req.user.company);
    res.status(400).json({
      success: false,
      messages: ['abc'],
      content: error
    });
  }
}
