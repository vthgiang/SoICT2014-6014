const { CrmTaskTemplate } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { createTask } = require("../../task/task-management/task.service");
const { getCrmUnitByRole } = require('../crmUnit/crmUnit.service');
const { getAllUserInUnitAndItsSubUnits } = require('../../super-admin/user/user.service');
const { createTaskTemplate } = require('../../task/task-template/taskTemplate.service');
const { getCrmUnitKPI } = require('../crmUnitKPI/crmUnitKPI.service');

const createCrmTaskTemplate = async (portal, companyId, role, type ) => {
    // lấy đơn vị CSKH
    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    // lấy thông tin về trưởng đơn vị và các role nhân viên
    const listCrmDepartment = await getAllUserInUnitAndItsSubUnits(portal, crmUnit.organizationalUnit._id);
    const manager = listCrmDepartment[0].managers[Object.keys(listCrmDepartment[0].managers)[0]].members[0]._id;
    let listEmployeeRole = [];
    listCrmDepartment.forEach(unit => {
        listEmployeeRole = [...listEmployeeRole, Object.keys(unit.employees)[0]]
    });
    const getCrmUnitKPIs = await getCrmUnitKPI(portal, companyId, manager, role);
    const crmUnitKPI = getCrmUnitKPIs.crmUnitKPI;
    // tạo mẫu công việc
    let body
    if (type == 1)
        body = {
            organizationalUnit: crmUnit.organizationalUnit._id,
            name: 'Mẫu công việc tìm kiếm khách hàng mới',
            readByEmployees: listEmployeeRole,
            responsibleEmployees: [],
            accountableEmployees: [manager],
            consultedEmployees: [],
            informedEmployees: [],
            description: '<p>Mẫu công việc tìm kiếm khách hàng mới</p>',
            creator: manager,
            numberOfDaysTaken: '',
            formula: `((
                p1/${crmUnitKPI.numberOfNewCustomers.value})*${crmUnitKPI.numberOfNewCustomers.weight}+
                p2/${crmUnitKPI.newCustomerBuyingRate.value})*${crmUnitKPI.newCustomerBuyingRate.weight}
            )/(${crmUnitKPI.numberOfNewCustomers.weight}+${crmUnitKPI.newCustomerBuyingRate.weight})`,
            priority: 3,
            taskActions: [],
            taskInformations: [
                {
                    name: 'Số lượng khách hàng mới',
                    description: 'Số lượng khách hàng mới',
                    type: 'number',
                    extra: '',
                    filledByAccountableEmployeesOnly: true,
                    chosen: false,
                    selected: false
                },
                {
                    name: 'Tỉ lệ mua hàng ở khách hàng mới (%)',
                    description: 'Tỉ lệ mua hàng ở khách hàng mới',
                    type: 'number',
                    extra: '',
                    filledByAccountableEmployeesOnly: true
                }
            ],
            collaboratedWithOrganizationalUnits: []
        }
    else
        body = {
            organizationalUnit: crmUnit.organizationalUnit._id,
            name: 'Mẫu công việc chăm sóc khách hàng',
            readByEmployees: listEmployeeRole,
            responsibleEmployees: [],
            accountableEmployees: [manager],
            consultedEmployees: [],
            informedEmployees: [],
            description: '<p>Mẫu công việc chăm sóc khách hàng</p>',
            creator: manager,
            numberOfDaysTaken: '',
            formula: `((
                p1/${crmUnitKPI.customerRetentionRate.value}*${crmUnitKPI.customerRetentionRate.weight}+
                p2/${crmUnitKPI.completionRate.value}*${crmUnitKPI.completionRate.weight}+
                p3/${crmUnitKPI.solutionRate.value}*${crmUnitKPI.solutionRate.weight}+
                p4/${crmUnitKPI.totalActions.value}*${crmUnitKPI.totalActions.weight}
            )/(${crmUnitKPI.customerRetentionRate.weight}+${crmUnitKPI.completionRate.weight}+${crmUnitKPI.solutionRate.weight}+${crmUnitKPI.totalActions.weight})*100`,
            priority: 3,
            taskActions: [],
            taskInformations: [
                {
                    name: 'Tỉ lệ khách hàng quay lại mua hàng (%)',
                    description: 'Tỉ lệ khách hàng quay lại mua hàng',
                    type: 'number',
                    extra: '',
                    filledByAccountableEmployeesOnly: true,
                    chosen: false,
                    selected: false
                },
                {
                    name: 'Tỉ lệ hoàn thành hoạt động (%)',
                    description: 'Tỉ lệ hoàn thành hoạt động',
                    type: 'number',
                    extra: '',
                    filledByAccountableEmployeesOnly: true
                },
                {
                    name: 'Tỉ lệ  hoạt động  thành công (%)',
                    description: 'Tỉ lệ thành công ở các hoạt động đã hoàn thành',
                    type: 'number',
                    extra: '',
                    filledByAccountableEmployeesOnly: true
                }
                ,
                {
                    name: 'Tổng số hoạt động chăm sóc khách hàng',
                    description: 'Tổng số hoạt động chăm sóc khách hàng ',
                    type: 'number',
                    extra: '',
                    filledByAccountableEmployeesOnly: false
                }
            ],
            collaboratedWithOrganizationalUnits: []
        }

    //tạo mẫu công việc
    const taskTemplate = await createTaskTemplate(portal, body, manager);
    //tạo mới công việc CSKH
    const crmTaskTemplate = {
        taskTemplate: taskTemplate._id,
        type: type,
        crmUnit: crmUnit._id,
        manager
    }

    const newcrmTaskTemplate = await CrmTaskTemplate(connect(DB_CONNECTION, portal)).create(crmTaskTemplate);
    const getcrmTaskTemplate = await CrmTaskTemplate(connect(DB_CONNECTION, portal)).findById(newcrmTaskTemplate._id);
    return getcrmTaskTemplate;
}

exports.getCrmTaskTemplate = async (portal, companyId, role, type) => {
    let keySearch = {};
    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    if (!crmUnit) return {}
    keySearch = { ...keySearch, crmUnit: crmUnit._id ,type }
    const listCrmTaskTemplate = await CrmTaskTemplate(connect(DB_CONNECTION, portal)).find(keySearch);
    if (listCrmTaskTemplate && listCrmTaskTemplate.length > 0) return listCrmTaskTemplate[0];
    return createCrmTaskTemplate(portal, companyId, role, type);
}