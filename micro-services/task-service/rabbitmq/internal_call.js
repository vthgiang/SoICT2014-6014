const TaskTemplateService = require('../modules/task/task-template/taskTemplate.service');

const call_service = async (link, params) => {
  switch (link[1]) {
    case 'taskTemplate': {
      if (link[2] === 'getAllTaskTemplates') {
        const { portal, query } = params;
        return await TaskTemplateService.getAllTaskTemplates(portal, query);
      }
      return;
    }
    default:
      break;
  }
};
const internalCall = async (link, params) => {
  try {
    const response = await call_service(link.split('.'), params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  internalCall,
};
