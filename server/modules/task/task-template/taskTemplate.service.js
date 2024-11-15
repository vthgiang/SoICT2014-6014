const { TaskTemplate, Privilege, Role, UserRole, OrganizationalUnit, User } = require(`../../../models`);
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const rabbitMq = require('../../../rabbitmq/client');
const listRpcQueue = require('../../../rabbitmq/listRpcQueue');

const cleanHtml = (str) => {
  let st;
  let vt = str.indexOf('&nbsp;');
  while (vt >= 0) {
    st = vt === 0 ? str.slice(vt + 6) : str.slice(0, vt) + str.slice(vt + 6);
    str = st;
    vt = str.indexOf('&nbsp;');
  }
  vt = str.indexOf('<');
  while (vt >= 0) {
    let vt2 = str.indexOf('>');
    st = vt === 0 ? str.slice(vt2 + 1) : str.slice(0, vt) + str.slice(vt2 + 1);
    str = st;
    vt = str.indexOf('<');
  }
  return str;
};

/**
 * Lấy tất cả các mẫu công việc
 */
exports.getAllTaskTemplates = async (portal, query) => {
  const result = await rabbitMq.gRPC('taskService.taskTemplate.getAllTaskTemplates', JSON.stringify({ portal, query }), listRpcQueue.TASK_SERVICE);
  return JSON.parse(result);
  // if (query.pageNumber === '1' && query.noResultsPerPage === '0') {
  //   // LẤY DANH SÁCH TẤT CẢ CÁC MẪU CÔNG VIỆC CÓ TRONG HỆ THỐNG CỦA CÔNG TY
  //   let docs = await TaskTemplate(connect(DB_CONNECTION, portal))
  //     .find()
  //     .populate([
  //       {
  //         path: 'creator readByEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees',
  //         select: 'name email',
  //       },
  //       { path: 'organizationalUnit' },
  //       { path: 'collaboratedWithOrganizationalUnits' },
  //       { path: 'listMappingTask.organizationalUnitKpi' },
  //     ]);

  //   return {
  //     docs: docs,
  //   };
  // }
  // if (query.roleId) {
  //   // LẤY DANH SÁCH MẪU CÔNG VIỆC VỚI MỘT VAI TRÒ NÀO ĐÓ

  //   let role = await Role(connect(DB_CONNECTION, portal)).findById(query.roleId);
  //   let roles = [role._id, ...role.parents];

  //   let tasks = await Privilege(connect(DB_CONNECTION, portal))
  //     .find({
  //       role: { $in: roles },
  //       resourceType: 'TaskTemplate',
  //     })
  //     .populate({ path: 'resource', populate: { path: 'creator' } });

  //   return tasks;
  // } else if (query.userId) {
  //   // LẤY DANH SÁCH TẤT CẢ CÁC MẪU CÔNG VIỆC MÀ NGƯỜI DÙNG CÓ QUYỀN XEM

  //   let id = query.userId,
  //     pageNumber = Number(query.pageNumber),
  //     noResultsPerPage = Number(query.noResultsPerPage),
  //     organizationalUnit = query.arrayUnit,
  //     name = query.name;
  //   // Danh sách các quyền của user - userRoles
  //   let dataRoles = await UserRole(connect(DB_CONNECTION, portal)).find({ userId: id }).populate('roleId');
  //   dataRoles = dataRoles.map((userRole) => userRole.roleId);
  //   let userRoles = dataRoles.reduce((arr, role) => [...arr, role._id, ...role.parents], []);
  //   userRoles = userRoles.filter((role, index) => role.toString() === userRoles[index].toString());
  //   let option = !organizationalUnit
  //     ? {
  //         $or: [{ readByEmployees: { $in: userRoles } }, { creator: id }],
  //         name: { $regex: name, $options: 'i' },
  //       }
  //     : {
  //         $or: [{ readByEmployees: { $in: userRoles } }, { creator: id }],
  //         name: { $regex: name, $options: 'i' },
  //         organizationalUnit: { $in: organizationalUnit },
  //       };
  //       console.log(option)
  //   return await TaskTemplate(connect(DB_CONNECTION, portal)).paginate(option, {
  //     page: pageNumber,
  //     limit: noResultsPerPage,
  //     populate: [
  //       {
  //         path: 'creator readByEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees',
  //         select: 'name email',
  //       },
  //       { path: 'organizationalUnit' },
  //       { path: 'collaboratedWithOrganizationalUnits' },
  //       { path: 'listMappingTask.organizationalUnitKpi' },
  //     ],
  //   });
  // } else {
  //   // LẤY DANH SÁCH TẤT CẢ CÁC MẪU CÔNG VIỆC CÓ TRONG HỆ THỐNG CỦA CÔNG TY

  //   return await TaskTemplate(connect(DB_CONNECTION, portal)).find().populate({ path: 'listMappingTask.organizationalUnitKpi' });
  // }
};

/**
 * Lấy mẫu công việc thoe Id
 * @id id mẫu công việc
 */
exports.getTaskTemplate = async (portal, id) => {
  return await TaskTemplate(connect(DB_CONNECTION, portal))
    .findById(id)
    .populate([
      { path: 'organizationalUnit collaboratedWithOrganizationalUnits', select: 'name managers' },
      { path: 'readByEmployees', select: 'name' },
      { path: 'creator responsibleEmployees accountableEmployees consultedEmployees informedEmployees', select: 'name email avatar' },
    ]);
};

/**
 * Tạo mới mẫu công việc
 * @body dữ liệu tạo mới mẫu công việc
 */
exports.createTaskTemplate = async (portal, body, userId) => {
  //kiểm tra tên mẫu công việc đã tồn tại hay chưa ?
  let checkTaskTemplate = await TaskTemplate(connect(DB_CONNECTION, portal)).findOne({ name: body.name });
  if (checkTaskTemplate) throw ['task_template_name_exist'];

  body.taskActions.forEach((action) => {
    if (action.description) action.description = cleanHtml(action.description);
  });

  body.taskInformations.forEach((info) => {
    if (info.description) info.description = cleanHtml(info.description);
  });

  //Tạo dữ liệu mẫu công việc
  var tasktemplate = await TaskTemplate(connect(DB_CONNECTION, portal)).create({
    organizationalUnit: body.organizationalUnit,
    collaboratedWithOrganizationalUnits: body.collaboratedWithOrganizationalUnits,
    name: body.name,
    creator: userId, //id của người tạo
    readByEmployees: Array.isArray(body.readByEmployees) ? body.readByEmployees : [], //role của người có quyền xem
    responsibleEmployees: body.responsibleEmployees,
    accountableEmployees: body.accountableEmployees,
    consultedEmployees: body.consultedEmployees,
    informedEmployees: body.informedEmployees,
    description: body.description,
    formula: body.formula,
    priority: body.priority,
    taskActions: body.taskActions.map((item) => {
      return {
        name: item.name,
        description: item.description,
        mandatory: item.mandatory,
      };
    }),
    taskInformations: body.taskInformations.map((item, key) => {
      return {
        code: 'p' + parseInt(key + 1),
        name: item.name,
        description: item.description,
        filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
        type: item.type,
        extra: item.extra,
      };
    }),
    isMappingTask: body.isMappingTask,
    listMappingTask: body.listMappingTask.map((item, key) => {
      const [dayStart, monthStart, yearStart] = item.startDate.split('-');
      const formattedDateStringStart = `${yearStart}-${monthStart}-${dayStart}`;

      const [dayEnd, monthEnd, yearEnd] = item.endDate.split('-');
      const formattedDateStringEnd = `${yearEnd}-${monthEnd}-${dayEnd}`;

      return {
        taskName: item.taskName,
        taskDescription: item.taskDescription,
        durations: parseFloat(item.duration),
        startDate: new Date(formattedDateStringStart),
        endDate: new Date(formattedDateStringEnd),
        target: item.taskValue,
        unit: item.taskValueUnit,
        organizationalUnitKpi: item.goalCompanyId.map((goal_id) => {
          return new ObjectId(goal_id);
        }),
        factor: {...item.factor}
      };
    }),
  });

  // Handle roles and privileges
  const read = Array.isArray(body.readByEmployees) ? body.readByEmployees : [];
  const roles = await Role(connect(DB_CONNECTION, portal)).find({ _id: { $in: read } });

  const roleIdSet = new Set();
  roles.forEach((role) => {
    roleIdSet.add(role._id.toString());
    role.parents.forEach((parentId) => roleIdSet.add(parentId.toString()));
  });

  const uniqueRoleIds = Array.from(roleIdSet);
  const privileges = uniqueRoleIds.map((roleId) => ({
    roleId: roleId,
    resourceId: tasktemplate._id,
    resourceType: 'TaskTemplate',
    action: read,
  }));

  await Privilege(connect(DB_CONNECTION, portal)).insertMany(privileges);

  // // TODO: Xử lý quyển với action

  // // xu ly quyen nguoi xem
  // let read = Array.isArray(body.readByEmployees) ? body.readByEmployees : [];
  // let roleId = [];
  // let role, roleParent;
  // role = await Role(connect(DB_CONNECTION, portal)).find({ _id: { $in: read } });
  // roleParent = role.map(item => item.parents);   // lấy ra các parent của các role
  // let flag;
  // let reads = role.map(item => item._id);     // lấy ra danh sách role có quyền xem ( thứ tự cùng với roleParent)
  // for (let n in reads) {
  //     flag = 0;
  //     let parent = [];
  //     parent = parent.concat(roleParent[n]);
  //     for (let i in parent) {
  //         for (let j in reads) {
  //             if (JSON.stringify(reads[j]) === JSON.stringify(parent[i])) {  // nếu 1 role là kế thừa của role có sẵn quyền xem thì loại role đấy đi
  //                 reads[n] = "";                                              // loại role
  //                 flag = 1;
  //                 roleId.push(reads[j]);                                    // thêm vào danh sách role có quyền xem
  //             }
  //         }
  //     }
  //     if (flag === 0) roleId.push(reads[n]);    // role này không là role cha của role khác => thêm vào danh sách role có quyền xem
  // }
  // // xử lý các role trùng lặp
  // roleId = roleId.map(u => u.toString());
  // for (let i = 0, max = roleId.length; i < max; i++) {
  //     if (roleId.indexOf(roleId[i]) != roleId.lastIndexOf(roleId[i])) {
  //         roleId.splice(roleId.indexOf(roleId[i]), 1);
  //         i--;
  //     }
  // }
  // // mỗi roleId là một Document
  // for (let i in roleId) {
  //     var privilege = await Privilege(connect(DB_CONNECTION, portal)).create({
  //         roleId: roleId[i], //id của người cấp quyền xem
  //         resourceId: tasktemplate._id,
  //         resourceType: "TaskTemplate",
  //         action: read //quyền READ
  //     });
  // }
  const result = await tasktemplate
    .populate([
      { path: 'organizationalUnit collaboratedWithOrganizationalUnits', select: 'name managers' },
      { path: 'readByEmployees', select: 'name' },
      { path: 'creator responsibleEmployees accountableEmployees consultedEmployees informedEmployees', select: 'name email' },
      { path: 'listMappingTask.organizationalUnitKpi' },
    ])
    .execPopulate();

  return result;
};

/**
 * Xóa mẫu công việc
 * @id id công việc cần xóa
 */
exports.deleteTaskTemplate = async (portal, id) => {
  var template = await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndDelete(id); // xóa mẫu công việc theo id
  var privileges = await Privilege(connect(DB_CONNECTION, portal)).deleteMany({
    resourceId: id, //id của task template
    resourceType: 'TaskTemplate',
  });

  return { id: id };
};

/**
 * Sửa mẫu công việc
 * @data dữ liệu cập nhật
 * @id id mẫu công việc cập nhật
 */
exports.editTaskTemplate = async (portal, data, id) => {
  // thêm quyền xem mẫu công việc cho trưởng đơn vị của công việc
  let units = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findById(data.organizationalUnit);
  let roleManagers = units.managers;
  let readByEmployee = data.readByEmployees;
  for (let i in roleManagers) {
    let flag = true;
    for (let x in readByEmployee) {
      if (JSON.stringify(readByEmployee[x]) === JSON.stringify(roleManagers[i])) {
        flag = false;
        break;
      }
    }
    if (flag) {
      readByEmployee.push(roleManagers[i]);
    }
  }

  // thêm quyền xem mẫu công việc cho đơn vị phối hợp (neu co)
  if (data.collaboratedWithOrganizationalUnits.length) {
    units = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findById(data.collaboratedWithOrganizationalUnits);
    roleManagers = units.managers;
    readByEmployee = data.readByEmployees;
    for (let i in roleManagers) {
      let flag = true;
      for (let x in readByEmployee) {
        if (JSON.stringify(readByEmployee[x]) === JSON.stringify(roleManagers[i])) {
          flag = false;
          break;
        }
      }
      if (flag) {
        readByEmployee.push(roleManagers[i]);
      }
    }
  }

  var taskTemplate = await TaskTemplate(connect(DB_CONNECTION, portal))
    .findByIdAndUpdate(
      id,
      {
        $set: {
          name: data.name,
          description: data.description,
          formula: data.formula,
          priority: data.priority,
          accountableEmployees: data.accountableEmployees,
          readByEmployees: data.readByEmployees,
          informedEmployees: data.informedEmployees,
          responsibleEmployees: data.responsibleEmployees,
          consultedEmployees: data.consultedEmployees,
          organizationalUnit: data.organizationalUnit,
          taskActions: data.taskActions,
          taskInformations: data.taskInformations.map((item, key) => {
            return {
              code: 'p' + parseInt(key + 1),
              name: item.name,
              description: item.description,
              filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
              type: item.type,
              extra: item.extra,
            };
          }),
        },
      },
      { new: true }
    )
    .populate([
      { path: 'organizationalUnit collaboratedWithOrganizationalUnits', select: 'name managers' },
      { path: 'readByEmployees', select: 'name' },
      { path: 'creator responsibleEmployees accountableEmployees consultedEmployees informedEmployees', select: 'name email' },
    ]);

  // xóa privilege tương ứng để tạo lại privilege tương ứng với quyền xem
  var privileges = await Privilege(connect(DB_CONNECTION, portal)).deleteMany({
    resourceId: id, //id của task template
    resourceType: 'TaskTemplate',
  });
  // xu ly quyen nguoi xem
  var read = data.readByEmployees;
  var roleId = [];
  var role, roleParent;
  role = await Role(connect(DB_CONNECTION, portal)).find({ _id: { $in: read } });
  roleParent = role.map((item) => item.parents); // lấy ra các parent của các role
  var flag;
  var reads = role.map((item) => item._id); // lấy ra danh sách role có quyền xem ( thứ tự cùng với roleParent)
  for (let n in reads) {
    flag = 0;
    var parent = [];
    parent = parent.concat(roleParent[n]);
    for (let i in parent) {
      for (let j in reads) {
        if (JSON.stringify(reads[j]) === JSON.stringify(parent[i])) {
          // nếu 1 role là kế thừa của role có sẵn quyền xem thì loại role đấy đi
          reads[n] = ''; // loại role
          flag = 1;
          roleId.push(reads[j]); // thêm vào danh sách role có quyền xem
        }
      }
    }
    if (flag === 0) roleId.push(reads[n]); // role này không là role cha của role khác => thêm vào danh sách role có quyền xem
  }
  // xử lý các role trùng lặp
  roleId = roleId.map((u) => u.toString());
  for (let i = 0, max = roleId.length; i < max; i++) {
    if (roleId.indexOf(roleId[i]) != roleId.lastIndexOf(roleId[i])) {
      roleId.splice(roleId.indexOf(roleId[i]), 1);
      i--;
    }
  }
  // mỗi roleId là một Document
  for (let i in roleId) {
    var privilege = await Privilege(connect(DB_CONNECTION, portal)).create({
      roleId: roleId[i], //id của người cấp quyền xem
      resourceId: id,
      resourceType: 'TaskTemplate',
      action: read, //quyền READ
    });
  }
  return taskTemplate;
};

/**
 * Thêm mẫu công việc mới từ file excel
 * @param {*} data
 * @param {*} id : id user
 */
exports.importTaskTemplate = async (portal, data, id) => {
  let results = [];
  for (let i = 0; i < data.length; i++) {
    data[i]['creator'] = id;

    // chuyen dia chi email sang id
    if (data[i].accountableEmployees[0]) {
      for (let j = 0; j < data[i].accountableEmployees.length; j++) {
        let accountableEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].accountableEmployees[j] });
        if (accountableEmployees) {
          data[i].accountableEmployees[j] = accountableEmployees._id;
        } else {
          accountableEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].accountableEmployees[j] });
          if (accountableEmployees) {
            data[i].accountableEmployees[j] = accountableEmployees._id;
          } else {
            data[i].accountableEmployees[j] = null;
          }
        }
      }
    } else {
      data[i].accountableEmployees = [];
    }

    let read = [];
    if (data[i].readByEmployees[0]) {
      for (let j = 0; j < data[i].readByEmployees.length; j++) {
        // Đổi tên "Trưởng đơn vị, phó đơn vị, nhân viên đơn vị trùng tên trong database"
        switch (data[i].readByEmployees[j]) {
          case 'Trưởng đơn vị':
            data[i].readByEmployees[j] = 'Manager';
            break;
          case 'Phó đơn vị':
            data[i].readByEmployees[j] = 'Deputy Manager';
            break;
          case 'Nhân viên đơn vị':
            data[i].readByEmployees[j] = 'Employee';
            break;
          default:
            break;
        }
        let readByEmployees = await Role(connect(DB_CONNECTION, portal)).findOne({ name: data[i].readByEmployees[j] });
        readByEmployees = readByEmployees._id;
        read = [...read, readByEmployees];
      }
      data[i].readByEmployees = read;
    } else {
      data[i].readByEmployees = [];
    }

    if (data[i].consultedEmployees[0]) {
      for (let j = 0; j < data[i].consultedEmployees.length; j++) {
        let consultedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].consultedEmployees[j] });
        if (consultedEmployees) {
          data[i].consultedEmployees[j] = consultedEmployees._id;
        } else {
          consultedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].consultedEmployees[j] });
          if (consultedEmployees) {
            data[i].consultedEmployees[j] = consultedEmployees._id;
          } else {
            data[i].consultedEmployees[j] = null;
          }
        }
      }
    } else {
      data[i].consultedEmployees = [];
    }

    if (data[i].informedEmployees[0]) {
      for (let j = 0; j < data[i].informedEmployees.length; j++) {
        let informedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].informedEmployees[j] });
        if (informedEmployees) {
          data[i].informedEmployees[j] = informedEmployees._id;
        } else {
          informedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].informedEmployees[j] });
          if (informedEmployees) {
            data[i].informedEmployees[j] = informedEmployees._id;
          } else {
            data[i].informedEmployees[j] = null;
          }
        }
      }
    } else {
      data[i].informedEmployees = [];
    }

    if (data[i].responsibleEmployees[0]) {
      for (let j = 0; j < data[i].responsibleEmployees.length; j++) {
        let responsibleEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].responsibleEmployees[j] });
        if (responsibleEmployees) {
          data[i].responsibleEmployees[j] = responsibleEmployees._id;
        } else {
          responsibleEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].responsibleEmployees[j] });
          if (responsibleEmployees) {
            data[i].responsibleEmployees[j] = responsibleEmployees._id;
          } else {
            data[i].responsibleEmployees[j] = null;
          }
        }
      }
    } else {
      data[i].responsibleEmployees = [];
    }

    // xu ly thong tin filledByAccountableEmployeesOnly
    for (let j = 0; j < data[i].taskInformations.length; j++) {
      if (data[i].taskInformations[j][0]) {
        // format thong tin "chi qua ly duoc dien"
        if (data[i].taskInformations[j][3] === 'true') {
          data[i].taskInformations[j]['filledByAccountableEmployeesOnly'] = 'true';
        } else {
          data[i].taskInformations[j]['filledByAccountableEmployeesOnly'] = 'false';
        }

        // formart thong tin kieu du lieu
        data[i].taskInformations[j]['type'] = data[i].taskInformations[j][2].toLowerCase();
        data[i].taskInformations[j]['name'] = data[i].taskInformations[j][0];
        data[i].taskInformations[j]['description'] = data[i].taskInformations[j][1];
        data[i].taskInformations[j]['extra'] = '';
      } else {
        if (!data[i].taskInformations[j][0]) {
          data[i].taskInformations[j] = [];
          // break;
        }
        data[i].taskInformations.splice(j, 1);
        j--;
      }
    }

    for (let j = 0; j < data[i].taskActions.length; j++) {
      if (data[i].taskActions[j][0]) {
        if (data[i].taskActions[j][2] === 'Bắt buộc' || data[i].taskActions[j][2] === 'true') {
          data[i].taskActions[j]['mandatory'] = true;
        } else {
          data[i].taskActions[j]['mandatory'] = false;
        }
        data[i].taskActions[j]['name'] = data[i].taskActions[j][0];
        data[i].taskActions[j]['description'] = data[i].taskActions[j][1];
      } else {
        if (!data[i].taskActions[j][0]) {
          data[i].taskActions[j] = [];
          // break;
        }
        data[i].taskActions.splice(j, 1);
        j--;
      }
    }
    switch (data[i].priority) {
      case 'Cao':
        data[i].priority = 3;
        break;
      case 'Thấp':
        data[i].priority = 2;
        break;
      default:
        data[i].priority = 1;
    }

    let unit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ name: data[i].organizationalUnit });
    data[i].organizationalUnit = String(unit._id);
    if (data[i].collaboratedWithOrganizationalUnits) {
      if (data[i].collaboratedWithOrganizationalUnits[0]) {
        let collaboratedWithOrganizationalUnit = [];
        for (let j = 0; j < data[i].collaboratedWithOrganizationalUnits.length; j++) {
          let collaboratedWithOrganizationalUnits = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({
            name: data[i].collaboratedWithOrganizationalUnits,
          });
          collaboratedWithOrganizationalUnits = collaboratedWithOrganizationalUnits._id;
          collaboratedWithOrganizationalUnit = [...collaboratedWithOrganizationalUnit, collaboratedWithOrganizationalUnits];
        }
        data[i].collaboratedWithOrganizationalUnits = collaboratedWithOrganizationalUnit;
      } else {
        data[i].collaboratedWithOrganizationalUnits = undefined;
      }
    } else {
      data[i].collaboratedWithOrganizationalUnits = undefined;
    }

    let result = await this.createTaskTemplate(portal, data[i], id);
    results = [...results, result];
  }
  return results;
};
