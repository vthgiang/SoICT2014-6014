// const KPIUnitService = require('./creation.service')
const Logger = require(`../../../../logs`);
const ConfigSettingService = require('./configSetting.service');

/**
 * Get config setting data
 */
const getConfigSettingData = async (request, response) => {
  try {
    const { company, email } = request.user;
    const portal = request.portal;
    const company_id = company._id;

    const result = await ConfigSettingService.getConfigSettingData(company_id, portal);
    // Logger.info(email, `Get kpi allocation's config setting`, portal);
    response.status(200).json({
      success: true,
      messages: ['get_kpi_allocation_config_setting_success'],
      content: result[0],
    });
  } catch (error) {
    // Logger.error(email, `Get kpi allocation's config setting`, portal);
    response.status(401).json({
      success: false,
      messages: ['get_kpi_allocation_config_setting_fail'],
      content: error,
    });
  }
};

const updateConfigSettingData = async (request, response) => {
  try {
    const payload = request.body;
    const { isReset, ...updates } = payload;
    const { id } = request.params;
    const portal = request.portal;
    const { email } = request.user;

    const result = await ConfigSettingService.updateConfigSettingData(id, updates, portal);

    Logger.info(email, `Update kpi allocation's config setting`, portal);
    response.status(200).json({
      success: true,
      messages: isReset === true ? ['reset_kpi_allocation_config_setting_success'] : ['update_kpi_allocation_config_setting_success'],
      content: result[0],
    });
  } catch (error) {
    Logger.error(email, `Update kpi allocation's config setting`, portal);
    response.status(401).json({
      success: false,
      messages: ['update_kpi_allocation_config_setting_fail'],
      content: error,
    });
  }
};

const createConfigSettingData = async (request, response) => {
  console.log(123);
};

const handleStartAllocation = async (request, response) => {
  try {
    const portal = request.portal;
    const { email } = request.user;
    const { configData, kpiData } = request.body;
    const { numberGeneration, solutionSize } = configData;

    const result = await ConfigSettingService.handleStartAllocation(portal, kpiData, numberGeneration, solutionSize);

    Logger.info(email, `Allocation success`, portal);
    response.status(200).json({
      success: true,
      messages: ['allocation_success'],
      content: result,
    });
  } catch (error) {
    Logger.error(email, `Allocation`, portal);
    response.status(401).json({
      success: false,
      messages: ['allocation_fail'],
      content: error,
    });
  }
};

const handleAssignKpiAndTask = async (request, response) => {
  try {
    const portal = request.portal;
    // const { email } = request.user;
    const { responseServerOutput, responseInput, listUnitKpi, month } = request.body;

    await ConfigSettingService.handleStartAssignAllocation(portal, responseServerOutput, responseInput, request.user, listUnitKpi, month);

    // Logger.info(email, `Assign task and kpi success`, portal);
    response.status(200).json({
      success: true,
      messages: ['assign_allocation_success'],
      content: [],
    });
  } catch (error) {
    // Logger.error(email, `Assign task and kpi`, portal);
    response.status(401).json({
      success: false,
      messages: ['assign_allocation_fail'],
      content: error,
    });
  }
};

module.exports = {
  getConfigSettingData,
  updateConfigSettingData,
  createConfigSettingData,
  handleStartAllocation,
  handleAssignKpiAndTask,
};
