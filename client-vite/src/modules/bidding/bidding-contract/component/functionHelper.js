// export const convertDepartmentIdToDepartmentName = (usersInUnitsOfCompany, departmentId) => {
//     if (!usersInUnitsOfCompany) return [];
//     const result = usersInUnitsOfCompany.filter(item => item.id === departmentId)?.[0]?.department;
//     return result
// }

export const getDepartmentWithUsers = (
  usersOfChildrenOrganizationalUnit,
  includeManager = true,
  includeDeputyManager = true,
  includeEmployee = true
) => {
  let unitMembers
  const structEmployee = []

  if (usersOfChildrenOrganizationalUnit) {
    const units = {} // // Map: key-id nhân viên, value-phòng/ban nhân viên
    const employees = {} // Map: key-id nhân viên, value-tên nhân viên
    const roles = {} // Map: key-id nhân viên, value-các chức danh của nhân viên

    for (let i = 0; i < usersOfChildrenOrganizationalUnit.length; i++) {
      const unit = usersOfChildrenOrganizationalUnit[i]

      if (includeManager && unit) {
        for (const key in unit.managers) {
          // Xử lý managers
          const value = unit.managers[key]
          for (let j = 0; j < value.members.length; j++) {
            const member = value.members[j]
            if (employees[member._id]) {
              roles[member._id] += `, ${value.name}`
            } else {
              employees[member._id] = member.name
              roles[member._id] = value.name
              units[member._id] = units[member._id] ? units[member._id] : unit.department
            }
          }
        }
      }

      if (includeDeputyManager) {
        for (const key in unit.deputyManagers) {
          // Xử lý deputyManagers
          const value = unit.deputyManagers[key]
          for (let j = 0; j < value.members.length; j++) {
            const member = value.members[j]
            if (employees[member._id]) {
              roles[member._id] += `, ${value.name}`
            } else {
              employees[member._id] = member.name
              roles[member._id] = value.name
              units[member._id] = units[member._id] ? units[member._id] : unit.department
            }
          }
        }
      }

      if (includeEmployee) {
        for (const key in unit.employees) {
          // Xử lý employees
          const value = unit.employees[key]
          for (let j = 0; j < value.members.length; j++) {
            const member = value.members[j]
            if (employees[member._id]) {
              roles[member._id] += `, ${value.name}`
            } else {
              employees[member._id] = member.name
              roles[member._id] = value.name
              units[member._id] = units[member._id] ? units[member._id] : unit.department
            }
          }
        }
      }
    }

    for (const item in employees) {
      structEmployee.push({
        id: item,
        name: employees[item],
        role: roles[item],
        department: units[item]
      })
    }
  }

  if (usersOfChildrenOrganizationalUnit) {
    unitMembers = usersOfChildrenOrganizationalUnit.map((unitMember) => {
      const temp = []
      for (let i = 0; i < structEmployee.length; i++) {
        const item = structEmployee[i]
        if (item.department === unitMember.department) {
          temp.push({
            text: `${item.name} (${item.role})`,
            value: item.id
          })
        }
      }
      const unit = {
        text: unitMember && unitMember.department,
        value: temp,
        unitId: unitMember.id
      }

      return unit
    })
  }

  return unitMembers
}

export const getDepartmentIdByUserId = (listUserDepartment, userId) => {
  if (!listUserDepartment) return null
  const unitWithUser = getDepartmentWithUsers(listUserDepartment)
  for (const x of unitWithUser) {
    const userList = x.value // danh sách nhân viên trong phòng ban đó
    for (const user of userList) {
      if (user.value === userId) {
        return x.unitId
      }
    }
  }
  return null
}

// return user account of employee
export const convertEmployeeToUserInUnit = (allUser, employee) => {
  if (!allUser?.length) return null
  for (const u of allUser) {
    if (u.email === employee.emailInCompany) {
      return u
    }
  }
}

export const checkExistedUserId = (uid, listUsers) => {
  const check = listUsers.find((x) => String(x.userId) === String(uid))

  if (check) return true
  return false
}

/**
 * hàm trả về dữ liệu decision khi update gói thầu
 * @param {BiddingPackage} bp dữ liệu gói thầu
 * @param {Array} allUsers danh sách tất cả user
 * @param {Array} listUserDepartment danh sách tất cả phòng ban và nhân viên trong phòng ban đó
 * @returns decision - quyết định giao triển khai hợp đồng
 */
export const getDecisionDataWhenUpdateBidPackage = (bp, allUsers, listUserDepartment) => {
  const proposalsCopy = bp.proposals
    ? bp.proposals
    : {
        executionTime: 0,
        unitOfTime: 'days',
        tasks: []
      }
  let decisionAuto = {
    tasks: proposalsCopy.tasks.map((x) => {
      return {
        name: x.taskName,
        description: x.taskDescription,
        estimateTime: x.estimateTime,
        unitOfTime: x.unitOfTime ?? proposalsCopy.unitOfTime
      }
    }),
    projectManager: [],
    responsibleEmployees: [],
    responsibleEmployeesWithUnit: []
  }

  const responsibleEmployeesArr = []
  const responsibleEmployeesWithUnitArr = []
  const ObjResponsibleEmployeesWithUnit = {}
  for (const p of proposalsCopy.tasks) {
    for (const emp of p.directEmployees) {
      const cvtEmp = convertEmployeeToUserInUnit(allUsers, emp)
      if (cvtEmp) {
        responsibleEmployeesArr.push(cvtEmp._id)

        const unitIdOfEmp = getDepartmentIdByUserId(listUserDepartment, cvtEmp._id)

        const listEmp = ObjResponsibleEmployeesWithUnit[`${unitIdOfEmp}`]?.listUsers ?? []
        if (!checkExistedUserId(cvtEmp._id, listEmp)) {
          ObjResponsibleEmployeesWithUnit[`${unitIdOfEmp}`] = {
            unitId: unitIdOfEmp,
            listUsers: [...listEmp, { userId: cvtEmp._id }]
          }
        }
      }
    }
  }

  for (const p of proposalsCopy.tasks) {
    for (const emp of p.backupEmployees) {
      const cvtEmp = convertEmployeeToUserInUnit(allUsers, emp)
      if (cvtEmp) {
        responsibleEmployeesArr.push(cvtEmp._id)

        const unitIdOfEmp = getDepartmentIdByUserId(listUserDepartment, cvtEmp._id)

        const listEmp = ObjResponsibleEmployeesWithUnit[`${unitIdOfEmp}`]?.listUsers ?? []
        if (!checkExistedUserId(cvtEmp._id, listEmp)) {
          ObjResponsibleEmployeesWithUnit[`${unitIdOfEmp}`] = {
            unitId: unitIdOfEmp,
            listUsers: [...listEmp, { userId: cvtEmp._id }]
          }
        }
      }
    }
  }

  for (const key in ObjResponsibleEmployeesWithUnit) {
    responsibleEmployeesWithUnitArr.push(ObjResponsibleEmployeesWithUnit[key])
  }

  decisionAuto = {
    ...decisionAuto,
    responsibleEmployees: responsibleEmployeesArr,
    responsibleEmployeesWithUnit: responsibleEmployeesWithUnitArr
  }

  return decisionAuto
}

/**
 * hàm trả về dữ liệu project task khi tạo mới project theo
 * @param {BiddingPackage} bp dữ liệu gói thầu
 * @param {Array} allUsers danh sách tất cả user
 * @returns decision - quyết định giao triển khai hợp đồng
 */
export const getProjectTaskDataWhenCreateByContract = (bp, allUsers) => {
  const proposalsCopy = bp.proposals
    ? bp.proposals
    : {
        executionTime: 0,
        unitOfTime: 'days',
        tasks: []
      }

  const taskList = []

  for (const idx in proposalsCopy.tasks) {
    const p = proposalsCopy.tasks[idx]
    const projectTaskData = {
      code: p.code,
      name: p.taskName,
      description: p.taskDescription,
      preceedingTasks: p.preceedingTasks?.length > 0 ? p.preceedingTasks?.map((x) => x?.trim()) : [],
      estimateNormalTime: p.estimateTime, // thời gian ước lượng
      estimateOptimisticTime:
        Number(p.estimateTime) === 1 ? '0' : Number(p.estimateTime) === 2 ? '1' : (Number(p.estimateTime) - 2).toString(), // thòi lượng thỏa hiệp
      unitOfTime: p.unitOfTime,
      responsibleEmployees: [],
      accountableEmployees: [],
      totalResWeight: 80
      // tags: [p.tag],
    }
    for (const emp of p.directEmployees) {
      const cvtEmp = convertEmployeeToUserInUnit(allUsers, emp)
      if (cvtEmp) {
        projectTaskData.responsibleEmployees.push(cvtEmp._id)
      }
    }
    for (const emp of p.backupEmployees) {
      const cvtEmp = convertEmployeeToUserInUnit(allUsers, emp)
      if (cvtEmp) {
        projectTaskData.accountableEmployees.push(cvtEmp._id)
      }
    }

    taskList.push(projectTaskData)
  }

  return taskList
}
