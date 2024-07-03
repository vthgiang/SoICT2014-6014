const TaskTemplateService = require('../modules/task/task-template/taskTemplate.service');
const TaskProcessService = require('../modules/task/tasks-process/taskProcess.service')

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

  if (link[0] === 'taskProcess') {
    if (link[1] === 'getListUserProgressTask') {
      const { currentRole, month, year, portal } = params;
      return await TaskProcessService.getListUserProgressTask(currentRole, month, year, portal);
    }
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
