const { TaskProcess } = require('../../../models').schema;
const mongoose = require('mongoose');
/**
 * Lấy tất cả các mẫu công việc
 */
exports.exportXmlDiagram = async (body) => {
  console.log((body.xmlDiagram))
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