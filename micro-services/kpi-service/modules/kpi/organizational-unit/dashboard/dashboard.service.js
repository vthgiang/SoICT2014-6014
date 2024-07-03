const Models = require('../../../../models');
const { OrganizationalUnit, AllocationUnitResult, EmployeeKpiSet, Task, TaskTemplate } = Models;
const arrayToTree = require('array-to-tree');
const { connect } = require('../../../../helpers/dbHelper');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
// const { sendEmailForCreateTask } = require('../../../task/task-management/task.service');
const cloneDeep = require('lodash/cloneDeep');

/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @id Id công ty
 * @role Id của role ứng với đơn vị cần lấy đơn vị con
 */
const getChildrenOfOrganizationalUnitsAsTree = async (portal, company, role) => {
  let organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({
    $or: [{ managers: { $in: role } }, { deputyManagers: { $in: role } }, { employees: { $in: role } }],
  });
  const data = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find(); //{company: company}

  const newData = data.map((department) => {
    return {
      id: department._id.toString(),
      name: department.name,
      description: department.description,
      managers: department.managers.map((item) => item.toString()),
      deputyManagers: department.deputyManagers.map((item) => item.toString()),
      employees: department.employees.map((item) => item.toString()),
      parent_id: department.parent !== null ? department.parent.toString() : null,
    };
  });

  const tree = await arrayToTree(newData);

  if (organizationalUnit) {
    for (let j = 0; j < tree.length; j++) {
      let queue = [];
      if (organizationalUnit.name === tree[j].name) {
        return tree[j];
      }
      queue.push(tree[j]);
      while (queue.length > 0) {
        v = queue.shift();
        if (v.children !== undefined) {
          for (let i = 0; i < v.children.length; i++) {
            let u = v.children[i];
            if (organizationalUnit.name === u.name) {
              return u;
            } else {
              queue.push(u);
            }
          }
        }
      }
    }
  }

  return null;
};

const getAllocationResultUnitKpi = async (portal, currentUserUnitId) => {
  const result = await AllocationUnitResult(connect(DB_CONNECTION, portal))
    .find({ organizationalUnit: new ObjectId(currentUserUnitId) })
    .populate('taskEmployeeIds')
    .populate('kpiEmployee.assigner')
    .populate('kpiEmployee.kpis')
    .populate({
      path: 'taskEmployeeIds',
      populate: [{ path: 'responsibleEmployees', model: 'User' }],
    })
    .populate({
      path: 'kpiEmployee.kpis',
      model: 'EmployeeKpi',
      populate: {
        path: 'parent',
        model: 'OrganizationalUnitKpi',
      },
    });
  return result;
};

const saveAllocationResultUnitKpi = async (portal, { userId, kpiAllocationUnitResult, currentUserUnitId }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  // assign kpi
  await Promise.all(
    kpiAllocationUnitResult.kpiEmployee.map(async (item) => {
      const kpiIds = item.kpis.map((kpi) => {
        return new ObjectId(kpi._id);
      });

      await EmployeeKpiSet(connect(DB_CONNECTION, portal)).create({
        organizationalUnit: new ObjectId(currentUserUnitId),
        creator: new ObjectId(item.assigner._id),
        approver: new ObjectId(userId),
        date: new Date(currentYear, currentMonth + 1, 0),
        kpis: kpiIds,
        automaticPoint: 0,
        employeePoint: 0,
        approvedPoint: 0,
        status: 2,
      });
    })
  );

  // assign task
  // console.log(kpiAllocationUnitResult.taskEmployeeIds);
  await Promise.all(
    kpiAllocationUnitResult.taskEmployeeIds.map(async (item) => {
      const formula = 'progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100';

      const newTask = await Task(connect(DB_CONNECTION, portal)).create({
        organizationalUnit: item.organizationalUnit,
        creator: new ObjectId(userId),
        name: item.name,
        description: item.description,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        priority: item.priority,
        formula,
        taskTemplate: item.taskTemplate,
        parent: null,
        level: item.level,
        responsibleEmployees: item.responsibleEmployees.map((e) => e._id),
        accountableEmployees: [new ObjectId(userId)],
        isAutomaticallyCreated: true,
      });

      if (newTask.taskTemplate !== null) {
        await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(newTask.taskTemplate, { $inc: { numberOfUse: 1 } }, { new: true });
      }

    //   let mail = await sendEmailForCreateTask(portal, cloneDeep(newTask));
    })
  );
};

module.exports = {
  getChildrenOfOrganizationalUnitsAsTree,
  getAllocationResultUnitKpi,
  saveAllocationResultUnitKpi,
};
