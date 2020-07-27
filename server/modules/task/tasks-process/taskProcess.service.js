const { TaskProcess } = require('../../../models').schema;
const mongoose = require('mongoose');

/**
 * Lấy tất cả xml diagram
 */
exports.getAllXmlDiagram = () => {
  let data = TaskProcess.find();
  return data
}

/**
 * Lấy diagram theo id
 * @param {*} params 
 */
exports.getXmlDiagramById = (params) => {
  let data = TaskProcess.findById(params.diagramId);
  return data
}

/**
 * Tạo mới 1 xml diagram
 * @param {*} body dữ liệu diagram cần tạo
 */
exports.createXmlDiagram = async (body) => {
  let info = [];
  for (const x in body.infoTask) {
    info.push(body.infoTask[x])
  }
  let data = await TaskProcess.create({
    xmlDiagram: body.xmlDiagram,
    infoTask: info
  })
  return data;
}