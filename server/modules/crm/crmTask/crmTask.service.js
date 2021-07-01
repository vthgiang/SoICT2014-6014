const { CrmTask } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { createTask } = require("../../task/task-management/task.service");
const { getCrmTaskTemplate } = require('../crmTaskTemplate/crmTaskTemplate.service');
const { getCrmUnitByRole } = require('../crmUnit/crmUnit.service');
const { getTaskById, editTaskByAccountableEmployees } = require('../../task/task-perform/taskPerform.service');

async function createCrmTask(portal, companyId, userId, role, type) {
    // lấy tháng và năm tạo công việc
    const now = new Date();
    const month = parseInt(now.getMonth());
    const year = parseInt(now.getFullYear());
    // lay ngay bat dau va ngay ket thuc cua thang
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    //lấy mẫu công việc'
    const crmTaskTemplate = await getCrmTaskTemplate(portal, companyId, role, type);
    // lấy thông tin đơn vị chăm sóc khách hàng
    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    //tao moi cong viec 
    const name = (type == 1) ? `Tìm kiếm khách hàng mới tháng ${month + 1} năm ${year} ` : `Chăm sóc khách hàng tháng ${month + 1} năm ${year} `;
    const description = (type == 1) ? `Công việc tìm kiếm khách hàng tháng ${month + 1} năm ${year} ` : `Công việc chăm sóc khách hàng tháng ${month + 1} năm ${year} `;
    const task = {
        name: name,
        description: description,
        quillDescriptionDefault: `<p>${description}</p>`,
        startDate: firstDay,
        endDate: lastDay,
        startTime: '08:00 AM',
        endTime: '05:30 PM',
        priority: 3,
        responsibleEmployees: userId,
        accountableEmployees: crmTaskTemplate.manager,
        consultedEmployees: [],
        informedEmployees: [],
        creator: userId,
        organizationalUnit: crmUnit.organizationalUnit._id,
        collaboratedWithOrganizationalUnits: [],
        taskTemplate: crmTaskTemplate.taskTemplate,
        parent: '',
        tags: [],
        imgs: null

    }
    const taskCreated = await createTask(portal, task);
    //tạo mới công việc CSKH
    const crmTask = {
        month: month + 1,
        year: year,
        task: taskCreated.task._id,
        user: userId,
        type: type,
    }
    const newCrmTask = await CrmTask(connect(DB_CONNECTION, portal)).create(crmTask);
    const getCrmTask = await CrmTask(connect(DB_CONNECTION, portal)).findById(newCrmTask._id);
    return getCrmTask;

}

exports.getCrmTask = async (portal, companyId, userId, role, type) => {
    // lay thoi gian hien tai
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let keySearch = {
        month,
        year,
        user: userId,
        type
    }
    const crmTasks = await CrmTask(connect(DB_CONNECTION, portal)).find(keySearch);
    if (crmTasks && crmTasks.length) {
        return crmTasks[0];
    }
    else {
        const newCrmTask = await createCrmTask(portal, companyId, userId, role, type);
        return newCrmTask;
    }

}
/**
 * cập nhật thông tin của công việc tìm kiếm khách hàng mới
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} userId 
 * @param {*} role 
 * @returns 
 */
exports.updateSearchingCustomerTaskInfo = async (portal, companyId, userId, role) => {
    const crmTask = await this.getCrmTask(portal, companyId, userId, role, 1);
    const task = await getTaskById(portal, crmTask.task, userId);
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const day = now.getDate()
   
    const { numberOfNewCustomers, newCustomerBuyingRate } = await require('../evaluation/evaluation.service').getNewCustomerBuyingRate(portal, companyId, { month, year }, userId, role);
 
    const taskData = {
        name: task.name,
        description: task.description,
        status: [task.status],
        priority: [task.priority],
        formula: task.formula,
        parent: '',
        user: task.accountableEmployees[0]._id,
        progress: 0,
        date: `${day}-${month}-${year}`,
        tags: [],
        startDate: task.startDate,
        endDate: task.endDate,
        collaboratedWithOrganizationalUnits: [],
        accountableEmployees: [task.accountableEmployees[0]._id],
        consultedEmployees: [],
        responsibleEmployees: [userId],
        informedEmployees: [],
        inactiveEmployees: [],
        info: {
            p1: { value: numberOfNewCustomers, code: 'p1', type: 'number' },
            p2: { value: newCustomerBuyingRate, code: 'p2', type: 'number' }
        }
    }

    await editTaskByAccountableEmployees(portal, taskData, crmTask.task);
    return true;
}

/**
 * Cập nhật thông tin cho công việc chăm sóc khách hàng
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} userId 
 * @param {*} role 
 * @returns 
 */

exports.updateCrmActionsTaskInfo = async (portal, companyId, userId, role) => {
    const crmTask = await this.getCrmTask(portal, companyId, userId, role, 2);
    const task = await getTaskById(portal, crmTask.task, userId);
    // lấy thông tin về khách hàng mới và tỉ lệ mua hàng ở khách hàng mới
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const day = now.getDate()
    // tính tỉ lệ giải quyết vấn đề
    const { numberOfCompletionActions, solutionRate } = await require('../evaluation/evaluation.service').getSolutionRate(portal, companyId, { month, year }, userId, role);
    // tính tỉ lệ hoàn thành hoạt động
    const { totalCareActions, completionRate, numberOfOverdueCareAction } = await require('../evaluation/evaluation.service').getCompletionRate(portal, companyId, { month, year }, userId, role);
    // tính tỉ lệ mua hàng ở khách hàng cũ
    const { customerRetentionRate } = await require('../evaluation/evaluation.service').getCustomerRetentionRate(portal, companyId, { month, year }, userId, role);
    const taskData = {
        name: task.name,
        description: task.description,
        status: [task.status],
        priority: [task.priority],
        formula: task.formula,
        parent: '',
        user: task.accountableEmployees[0]._id,
        progress: 0,
        date: `${day}-${month}-${year}`,
        tags: [],
        startDate: task.startDate,
        endDate: task.endDate,
        collaboratedWithOrganizationalUnits: [],
        accountableEmployees: [task.accountableEmployees[0]._id],
        consultedEmployees: [],
        responsibleEmployees: [userId],
        informedEmployees: [],
        inactiveEmployees: [],
        info: {
            p1: { value: customerRetentionRate*100, code: 'p1', type: 'number' },
            p2: { value: completionRate*100, code: 'p2', type: 'number' },
            p3: { value: solutionRate*100, code: 'p3', type: 'number' },
            p4: { value: totalCareActions, code: 'p4', type: 'number' }
        }
    }
    await editTaskByAccountableEmployees(portal, taskData, crmTask.task);
    return true;
}
