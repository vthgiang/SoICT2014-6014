const { OrganizationalUnit } = require('../../../../models');

const { connect } = require('../../../../helpers/dbHelper');

const OrganizationalUnitServices = require('../../../super-admin/organizational-unit/organizationalUnit.service');

//1. Lấy id người hiện tại, cấp dưới của người đó
//2. Lấy cả phòng ban hiện tại của người đó và phòng ban con của phòng ban người đó công tác
exports.getAllRelationsUser = async (userId, currentRole, portal) => {
  //Lấy ra phòng ban người đó đang công tác
  let department = await OrganizationalUnitServices.getOrganizationalUnitByUserRole(portal, currentRole);

  // if (!department) throw new Error("Department not avaiable");
  let usersRelationship = [userId];
  if (department) {
    //Lấy các phòng ban con của phòng ban người này công tác
    let childDepartments = await OrganizationalUnit(connect(DB_CONNECTION, portal))
      .find({ parent: department._id })
      .populate([
        { path: 'managers', populate: { path: 'users' } },
        { path: 'deputyManagers', populate: { path: 'users' } },
        { path: 'employees', populate: { path: 'users' } },
      ]);
    const { managers, deputyManagers, employees } = department;
    let check = -1; //1. managers, 2. deputyManagers, 3. employees -- để check vai trò của người này
    //Kiểm tra xem người này có phải là trưởng đơn vị hay không
    for (let indexRole = 0; indexRole < managers.length; indexRole++) {
      for (let indexUser = 0; indexUser < managers[indexRole].users.length; indexUser++) {
        if (managers[indexRole].users[indexUser].userId.equals(userId)) {
          check = 1;
        }
      }
    }
    if (check === 1) {
      //Nếu là trưởng đơn vị
      //i. Lấy danh sách các phó đơn vị dưới quyền người này
      for (let indexRole = 0; indexRole < deputyManagers.length; indexRole++) {
        for (let indexUser = 0; indexUser < deputyManagers[indexRole].users.length; indexUser++) {
          if (!usersRelationship.find((element) => deputyManagers[indexRole].users[indexUser].userId.equals(element))) {
            usersRelationship.push(deputyManagers[indexRole].users[indexUser].userId.toString());
          }
        }
      }
      //ii. Lấy các nhân viên dưới quyền người này
      for (let indexRole = 0; indexRole < employees.length; indexRole++) {
        for (let indexUser = 0; indexUser < employees[indexRole].users.length; indexUser++) {
          if (!usersRelationship.find((element) => employees[indexRole].users[indexUser].userId.equals(element))) {
            usersRelationship.push(employees[indexRole].users[indexUser].userId.toString());
          }
        }
      }
    } else {
      //Kiểm tra xem người này có phải là phó đơn vị không
      for (let indexRole = 0; indexRole < deputyManagers.length; indexRole++) {
        for (let indexUser = 0; indexUser < deputyManagers[indexRole].users.length; indexUser++) {
          if (deputyManagers[indexRole].users[indexUser].userId.equals(userId)) {
            check = 2;
          }
        }
      }

      if (check === 2) {
        //Nếu là phó đơn vị
        //Lấy danh sách nhân viên người này quản lý
        for (let indexRole = 0; indexRole < employees.length; indexRole++) {
          for (let indexUser = 0; indexUser < employees[indexRole].users.length; indexUser++) {
            if (!usersRelationship.find((element) => employees[indexRole].users[indexUser].userId.equals(element))) {
              usersRelationship.push(employees[indexRole].users[indexUser].userId.toString());
            }
          }
        }
      }
    }

    if (childDepartments) {
      //Lấy hết các nhân viên phòng ban con
      for (let indexDepartment = 0; indexDepartment < childDepartments.length; indexDepartment++) {
        const { managers, deputyManagers, employees } = childDepartments[indexDepartment];
        //i. Lấy danh sách các phó đơn vị dưới quyền người này
        for (let indexRole = 0; indexRole < managers.length; indexRole++) {
          for (let indexUser = 0; indexUser < managers[indexRole].users.length; indexUser++) {
            if (!usersRelationship.find((element) => managers[indexRole].users[indexUser].userId.equals(element))) {
              usersRelationship.push(managers[indexRole].users[indexUser].userId.toString());
            }
          }
        }
        //ii. Lấy danh sách các phó đơn vị dưới quyền người này
        for (let indexRole = 0; indexRole < deputyManagers.length; indexRole++) {
          for (let indexUser = 0; indexUser < deputyManagers[indexRole].users.length; indexUser++) {
            if (!usersRelationship.find((element) => deputyManagers[indexRole].users[indexUser].userId.equals(element))) {
              usersRelationship.push(deputyManagers[indexRole].users[indexUser].userId.toString());
            }
          }
        }
        //iii. Lấy các nhân viên dưới quyền người này
        for (let indexRole = 0; indexRole < employees.length; indexRole++) {
          for (let indexUser = 0; indexUser < employees[indexRole].users.length; indexUser++) {
            if (!usersRelationship.find((element) => employees[indexRole].users[indexUser].userId.equals(element))) {
              usersRelationship.push(employees[indexRole].users[indexUser].userId.toString());
            }
          }
        }
      }
    }
  }

  //Những người mà người này được phép quản lý
  return usersRelationship;
};
