const {
  Transport3Employee, Driver, Employee, Role
} = require('../../../models');

const {
  connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const userService = require('../../super-admin/user/user.service');

exports.getAllEmployeeTransport3 = async (portal, query, currentRole) => {
  let role = await Role(connect(DB_CONNECTION, portal)).find({
    _id: currentRole
  });

  if(role[0].name !== 'Trưởng phòng vận chuyển' && role[0].name !== 'Nhân viên giám sát') {
    return [];
  }

  const {page, limit} = query;

  let usersInDepartmentOfRole = await userService.getAllEmployeeOfUnitByRole(portal, currentRole);
  let emailsInCompany = usersInDepartmentOfRole?.map((user) => user.userId.email);
  let employeesInDepartmentOfRole = await Employee(connect(DB_CONNECTION, portal)).find({emailInCompany: {$in: emailsInCompany}});
  let employees = await Transport3Employee(connect(DB_CONNECTION, portal)).find({}).populate('employee');
  let lists = employeesInDepartmentOfRole?.map((employee) => {
    return {
      _id: employee._id,
      employeeNumber: employee.employeeNumber,
      fullName: employee.fullName,
      emailInCompany: employee.emailInCompany,
      gender: employee.gender,
      birthdate: employee.birthdate,
      contractEndDate: employee.contractEndDate,
      contractType: employee.contractType,
      status: employee.status,
    }
  });

  // filter lists not include in employees list _id
  let notConfirm = lists.filter((employee) => {
    return !employees.some((employeeTransport3) => {
      return employee._id.toString() === employeeTransport3.employee?._id.toString();
    });
  });

  let listEmployeesPage = await Transport3Employee(connect(DB_CONNECTION, portal)).paginate({}, {page, limit});
  return {
    listEmployeesNotConfirm: notConfirm,
    listEmployees: employees,
    totalPages: listEmployeesPage.totalPages
  };
}

exports.confirmEmployeeTransport3 = async (portal, employeeId) => {
  let employeesInDepartmentOfRole = await Employee(connect(DB_CONNECTION, portal)).find({_id: employeeId});
  if (employeesInDepartmentOfRole) {
    await Transport3Employee(connect(DB_CONNECTION, portal)).create({
      _id: employeeId,
      employee: employeeId,
      certificate: '',
      salary: 0
    });
  }
}

exports.removeEmployeeTransport3 = async (portal, employeeId) => {
    await Transport3Employee(connect(DB_CONNECTION, portal)).deleteOne({_id: employeeId});
}

exports.getInfoEmployeeTransport3 = async (portal, employeeId) => {
  return await Employee(connect(DB_CONNECTION, portal)).findOne({_id: employeeId});
}

exports.getMyEmployees = async (portal, user) => {
  return await Employee(connect(DB_CONNECTION, portal)).findOne({emailInCompany: user.email});
}
