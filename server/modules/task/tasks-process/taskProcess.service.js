const { TaskProcess } = require('../../../models').schema;
const mongoose = require('mongoose');
/**
 * Lấy tất cả các mẫu công việc
 */
exports.exportXmlDiagram = async (body) => {
  console.log(body)
    // var xmlDiagram = await TaskProcess.create(body);
  return 1
//     return xmlDiagram;
}