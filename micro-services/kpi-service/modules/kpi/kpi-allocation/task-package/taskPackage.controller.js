const Logger = require(`../../../../logs`);
const TaskPackageService = require('./taskPackage.service');
const TaskTypeService = require('./taskType.service');

const getListTaskType = async (request, response) => {
    const { company, email } = request.user;
    const portal = request.portal;
    try {
        const company_id = company._id;
        const result = await TaskTypeService.getListTaskType(company_id, portal);
        Logger.info(email, `Get kpi allocation's task type`, portal);
        response.status(200).json({
            success: true,
            messages: ['get_kpi_allocation_task_type_success'],
            content: result,
        });
    } catch (error) {
        Logger.error(email, `Get list task package`, portal);
        response.status(401).json({
            success: false,
            messages: ['get_kpi_allocation_task_type_fail'],
            content: error,
        });
    }
};

const addTaskType = async (request, response) => {
    const { company, email } = request.user;
    const portal = request.portal;
    const payload = request.body;
    try {
        const company_id = company._id;
        const result = await TaskTypeService.addTaskType(company_id, portal, payload);
        Logger.info(email, `Add kpi allocation's task type`, portal);
        response.status(200).json({
            success: true,
            messages: ['add_kpi_allocation_task_type_success'],
            content: result,
        });
    } catch (error) {
        Logger.error(email, `Add list task package`, portal);
        response.status(401).json({
            success: false,
            messages: ['add_kpi_allocation_task_type_fail'],
            content: error,
        });
    }
};

const getListTaskPackage = async (request, response) => {
    const { company, email } = request.user;
    const portal = request.portal;

    try {
        const company_id = company._id;

        const result = await TaskPackageService.getAllTaskPackage(company_id, portal);
        Logger.info(email, `Get task package success`, portal);
        response.status(200).json({
            success: true,
            messages: ['get_kpi_allocation_task_package_success'],
            content: result,
        });
    } catch (error) {
        Logger.error(email, `Get list task package`, portal);
        response.status(401).json({
            success: false,
            messages: ['get_list_task_package_fail'],
            content: error,
        });
    }
};

const addTask = async (request, response) => {
    const { company, email } = request.user;
    const portal = request.portal;
    const payload = request.body;

    try {
        const company_id = company._id;
        const result = await TaskPackageService.addTaskDetail(company_id, portal, payload)
        Logger.info(email, `Add kpi allocation's task`, portal);
        response.status(200).json({
            success: true,
            messages: ['add_kpi_allocation_task_success'],
            content: result,
        });
    } catch (error) {
        Logger.error(email, `Add task package`, portal);
        response.status(401).json({
            success: false,
            messages: ['add_kpi_allocation_task_fail'],
            content: error,
        });
    }
};

module.exports = {
    getListTaskPackage,
    getListTaskType,
    addTaskType,
    addTask,
};
