const { TaskProcess } = require('../../../models').schema;
const { User } = require('../../../models/index').schema;
const mongoose = require('mongoose');

/**
 * Lấy tất cả xml diagram
 */
exports.getAllXmlDiagram = () => {
  let data = TaskProcess.find().populate({ path: 'creator', select: 'name'});
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
    creator: body.creator,
    nameProcess: body.nameProcess,
    description: body.description,
    xmlDiagram: body.xmlDiagram,
    infoTask: info
  })
  data =  await TaskProcess.findById(data._id).populate({ path: 'creator', model: User ,select: 'name'});
  return data;
}