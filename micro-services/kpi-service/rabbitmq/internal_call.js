const ConfigSettingService = require('../modules/kpi/kpi-allocation/config-setting/configSetting.service');
const OrganizationalUnitDashboard = require('../modules/kpi/organizational-unit/dashboard/dashboard.service')

const call_service = async (link, params) => {
  console.log(link[0], params);
  switch (link[1]) {
    case 'getConfigSettingData': {
      const { company_id, portal } = params;
      return await ConfigSettingService.getConfigSettingData(company_id, portal);
    }
    case 'handleStartAllocation': {
      const { portal, kpiData } = params;
      return await ConfigSettingService.handleStartAllocation(portal, kpiData);
    }
    case 'organizationalUnit': {
      console.log(link)
      if (link[2] === 'getAllocationResultUnitKpi') {
        const { portal, currentUserUnitId } = params;
        return await OrganizationalUnitDashboard.getAllocationResultUnitKpi(portal, currentUserUnitId);
      }
      return
    }
    default:
      break;
  }
  // if (link[0] == "companyServices") {
  //   if (link[1] == "getAllCompanies")
  //     return companyServices.getAllCompanies(params);
  // } else if (link[0] == "profileServices") {
  //   if (link[1] == "getEmployeeInforByListId")
  //     return profileServices.getEmployeeInforByListId(
  //       params.portal,
  //       params.listId,
  //       params.params
  //     );
  // } else if (link[0] == "notificationServices") {
  //   if (link[1] == "createNotification")
  //     return notificationServices.createNotification(
  //       params.portal,
  //       params.company,
  //       params.data,
  //       params.manualNotification
  //     );
  // } else if (link[0] == "newsfeedServices") {
  //   if (link[1] == "createNewsFeed")
  //     return newsfeedServices.createNewsFeed(
  //       params.portal,
  //       params.data
  //     );
  // } else if (link[0] == "projectTemplateServices") {
  //   if (link[1] == "createProjectInfo") {
  //     return projectTemplateServices.createProjectInfo(
  //       params.portal,
  //       params.data
  //     );
  //   } else if (link[1] == "createTaskProjectCPM") {
  //     return projectTemplateServices.createTaskProjectCPM(
  //       params.portal,
  //       params.projectId,
  //       params.data
  //     );
  //   } else if (link[1] == "updateProjectInfoAfterCreateProjectTask") {
  //     return projectTemplateServices.updateProjectInfoAfterCreateProjectTask(
  //     );
  //   }
  // }
};
const internalCall = async (link, params) => {
  try {
    console.log(params.params);
    const response = await call_service(link.split('.'), params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  internalCall,
};
