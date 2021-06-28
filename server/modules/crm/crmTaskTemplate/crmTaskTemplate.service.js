const { CrmTask } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { createTask } = require("../../task/task-management/task.service");

async function createCrmTask(portal, type, userId) {
    // lấy tháng và năm tạo công việc
    const now = new Date();
    const month = parseInt(now.getMonth());
    const year = parseInt(now.getFullYear());
    // lay ngay bat dau va ngay ket thuc cua thang
    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    //tao moi cong viec 
    const name = (type == 1) ? `Tìm kiếm khách hàng mới tháng ${month + 1} năm ${year} ` : `Chăm sóc khách hàng tháng ${month + 1} năm ${year} `;
    const description = (type == 1) ? `Công việc tìm kiếm khách hàng tháng ${month + 1} năm ${year} ` : `Công việc chăm sóc khách hàng tháng ${month + 1} năm ${year} `;
    const task = {
        name,
        description,
        quillDescriptionDefault: '',
        startDate: firstDay,
        endDate: lastDay,
        priority: '3',
        responsibleEmployees: userId,
        accountableEmployees: userId,
        creator: userId,
        organizationalUnit: '609e4a423b77cb2d200d862e',
        taskTemplate: '',
        parent: '',
        taskProject: '',
        errorOnName: 'undefined',
        errorOnStartDate: 'undefined',
        errorOnEndDate: 'undefined',
        errorOnResponsibleEmployees: 'undefined',
        errorOnAccountableEmployees: 'undefined',
        imgs: 'null'
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

exports.getCrmTask = async (portal, userId, type) => {
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
    if (crmTasks && crmTasks.length) return crmTasks[0];
    else {
        newCrmTask = await createCrmTask(portal, type, userId);
        return newCrmTask;
    }

}
