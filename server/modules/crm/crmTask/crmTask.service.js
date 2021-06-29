const { CrmTask } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { createTask } = require("../../task/task-management/task.service");
const { getCrmTaskTemplate } = require('../crmTaskTemplate/crmTaskTemplate.service');
const { getCrmUnitByRole } = require('../crmUnit/crmUnit.service');
const { getTaskById, editTaskByAccountableEmployees } = require('../../task/task-perform/taskPerform.service');
const { getNewCustomerBuyingRate } = require('../evaluation/evaluation.service');

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

exports.updateSearchingCustomerTaskInfo = async (portal, companyId, userId, role)=>{
    console.log('vao day');
    const crmTask = await this.getCrmTask(portal, companyId, userId, role, 1);
    console.log(11);
    const task = await getTaskById(portal, crmTask.task, userId);
    console.log(11);
    // lấy thông tin về khách hàng mới và tỉ lệ mua hàng ở khách hàng mới
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const day = now.getDay()
    const { numberOfNewCustomers, newCustomerBuyingRate } = await getNewCustomerBuyingRate(portal, companyId, { month, year }, userId, role);
    console.log(11);
    const taskData = {
        name: task.name,
        description: task.description,
        status: [task.status],
        priority: [task.priority],
        formula: task.formula,
        parent: '',
        user: accountableEmployees[0]._id,
        progress: 0,
        date: `${day}-${month}-${year}`,
        tags: [],
        startDate: task.startDate,
        endDate: task.endDate,
        collaboratedWithOrganizationalUnits: [],
        accountableEmployees: [accountableEmployees[0]._id],
        consultedEmployees: [],
        responsibleEmployees: [userId],
        informedEmployees: [],
        inactiveEmployees: [],
        info: {
            p1: { value: numberOfNewCustomers, code: 'p1', type: 'number' },
            p2: { value: newCustomerBuyingRate, code: 'p2', type: 'number' }
        }
    }
    console.log(11);
    return await editTaskByAccountableEmployees(portal, taskData, crmTask.task);
}

