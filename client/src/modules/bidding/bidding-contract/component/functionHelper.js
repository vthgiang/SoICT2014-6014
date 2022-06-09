
// export const convertDepartmentIdToDepartmentName = (usersInUnitsOfCompany, departmentId) => {
//     if (!usersInUnitsOfCompany) return [];
//     const result = usersInUnitsOfCompany.filter(item => item.id === departmentId)?.[0]?.department;
//     return result
// }

export const getDepartmentIdByUserId = (listUserDepartment, userId) => {
    if (!listUserDepartment) return null;
    const unitWithUser = getDepartmentWithUsers(listUserDepartment);
    for (let x of unitWithUser) {
        const userList = x.value; // danh sách nhân viên trong phòng ban đó
        for (let user of userList) {
            if (user.value === userId) {
                return x.unitId
            }
        }
    }
}

// return user account of employee
export const convertEmployeeToUserInUnit = (allUser, employee) => {
    if (!allUser?.length) return null;
    for (let u of allUser) {
        if (u.email === employee.emailInCompany) {
            return u;
        }
    }
}

/**
 * hàm trả về dữ liệu decision khi update gói thầu
 * @param {BiddingPackage} bp dữ liệu gói thầu
 * @param {Array} allUsers danh sách tất cả user
 * @param {Array} listUserDepartment danh sách tất cả phòng ban và nhân viên trong phòng ban đó
 * @returns decision - quyết định giao triển khai hợp đồng
 */
export const getDecisionDataWhenUpdateBidPackage = (bp, allUsers, listUserDepartment) => {
    const proposalsCopy = bp.proposals ? bp.proposals : {
        executionTime: 0,
        unitOfTime: "days",
        tasks: [],
    };
    let decisionAuto = {
        tasks: proposalsCopy.tasks.map(x => {
            return {
                name: x.taskName,
                description: x.taskDescription,
                estimateTime: x.estimateTime,
                unitOfTime: x.unitOfTime ?? proposalsCopy.unitOfTime,
            }
        }),
        projectManager: [],
        responsibleEmployees: [],
        responsibleEmployeesWithUnit: [],
    }

    let responsibleEmployeesArr = [];
    let responsibleEmployeesWithUnitArr = [];
    let ObjResponsibleEmployeesWithUnit = {};
    for (let p of proposalsCopy.tasks) {
        for (let emp of p.directEmployees) {
            let cvtEmp = convertEmployeeToUserInUnit(allUsers, emp);
            if (cvtEmp) {
                responsibleEmployeesArr.push(cvtEmp._id)

                let unitIdOfEmp = getDepartmentIdByUserId(listUserDepartment, cvtEmp._id)

                let listEmp = ObjResponsibleEmployeesWithUnit[`${unitIdOfEmp}`]?.listUsers ?? [];
                ObjResponsibleEmployeesWithUnit[`${unitIdOfEmp}`] = {
                    unitId: unitIdOfEmp,
                    listUsers: [...listEmp, { userId: cvtEmp._id }]
                }
            }
        }
    }

    for (let p of proposalsCopy.tasks) {
        for (let emp of p.backupEmployees) {
            let cvtEmp = convertEmployeeToUserInUnit(allUsers, emp);
            if (cvtEmp) {
                responsibleEmployeesArr.push(cvtEmp._id)

                let unitIdOfEmp = getDepartmentIdByUserId(listUserDepartment, cvtEmp._id)

                let listEmp = ObjResponsibleEmployeesWithUnit[`${unitIdOfEmp}`]?.listUsers ?? [];
                ObjResponsibleEmployeesWithUnit[`${unitIdOfEmp}`] = {
                    unitId: unitIdOfEmp,
                    listUsers: [...listEmp, { userId: cvtEmp._id }]
                }
            }
        }
    }

    for (let key in ObjResponsibleEmployeesWithUnit) {
        responsibleEmployeesWithUnitArr.push(ObjResponsibleEmployeesWithUnit[key])
    }

    decisionAuto = {
        ...decisionAuto,
        responsibleEmployees: responsibleEmployeesArr,
        responsibleEmployeesWithUnit: responsibleEmployeesWithUnitArr,
    }

    return decisionAuto;
}

/**
 * hàm trả về dữ liệu project task khi tạo mới project theo
 * @param {BiddingPackage} bp dữ liệu gói thầu
 * @param {Array} allUsers danh sách tất cả user
 * @returns decision - quyết định giao triển khai hợp đồng
 */
export const getProjectTaskDataWhenCreateByContract = (bp, allUsers) => {
    const proposalsCopy = bp.proposals ? bp.proposals : {
        executionTime: 0,
        unitOfTime: "days",
        tasks: [],
    };

    let taskList = [];

    for (let idx in proposalsCopy.tasks) {
        let p = proposalsCopy.tasks[idx]
        let projectTaskData = {
            code: `Task_${Number(idx) + 1}`,
            name: p.taskName,
            description: p.taskDescription,
            preceedingTasks: Number(idx) === 0 ? [] : [`Task_${Number(idx)}`],
            estimateNormalTime: p.estimateTime, // thời gian ước lượng
            estimateOptimisticTime: Number(p.estimateTime) === 1 ? '0' : Number(p.estimateTime) === 2 ? '1' : (Number(p.estimateTime) - 2).toString(), // thòi lượng thỏa hiệp
            unitOfTime: p.unitOfTime,
            responsibleEmployees: [],
            accountableEmployees: [],
            totalResWeight: 80,
        }
        for (let emp of p.directEmployees) {
            let cvtEmp = convertEmployeeToUserInUnit(allUsers, emp);
            if (cvtEmp) {
                projectTaskData.responsibleEmployees.push(cvtEmp._id)
            }
        }
        for (let emp of p.backupEmployees) {
            let cvtEmp = convertEmployeeToUserInUnit(allUsers, emp);
            if (cvtEmp) {
                projectTaskData.accountableEmployees.push(cvtEmp._id)
            }
        }

        taskList.push(projectTaskData)
    }

    return taskList;
}

export const getDepartmentWithUsers = (usersOfChildrenOrganizationalUnit, includeManager = true, includeDeputyManager = true, includeEmployee = true) => {
    let unitMembers;
    let structEmployee = [];

    if (usersOfChildrenOrganizationalUnit) {
        let units = {}; // // Map: key-id nhân viên, value-phòng/ban nhân viên
        let employees = {}; // Map: key-id nhân viên, value-tên nhân viên
        let roles = {}; // Map: key-id nhân viên, value-các chức danh của nhân viên

        for (let i = 0; i < usersOfChildrenOrganizationalUnit.length; i++) {
            var unit = usersOfChildrenOrganizationalUnit[i];

            if (includeManager && unit) {
                for (let key in unit.managers) { // Xử lý managers
                    let value = unit.managers[key];
                    for (let j = 0; j < value.members.length; j++) {
                        let member = value.members[j];
                        if (employees[member._id]) {
                            roles[member._id] += ", " + value.name;
                        } else {
                            employees[member._id] = member.name;
                            roles[member._id] = value.name;
                            units[member._id] = units[member._id] ? units[member._id] : unit.department;
                        }
                    }
                }
            }

            if (includeDeputyManager) {
                for (let key in unit.deputyManagers) { // Xử lý deputyManagers
                    let value = unit.deputyManagers[key];
                    for (let j = 0; j < value.members.length; j++) {
                        let member = value.members[j];
                        if (employees[member._id]) {
                            roles[member._id] += ", " + value.name;
                        } else {
                            employees[member._id] = member.name;
                            roles[member._id] = value.name;
                            units[member._id] = units[member._id] ? units[member._id] : unit.department;
                        }
                    }
                }
            }


            if (includeEmployee) {
                for (let key in unit.employees) { // Xử lý employees
                    let value = unit.employees[key];
                    for (let j = 0; j < value.members.length; j++) {
                        let member = value.members[j];
                        if (employees[member._id]) {
                            roles[member._id] += ", " + value.name;
                        } else {
                            employees[member._id] = member.name;
                            roles[member._id] = value.name;
                            units[member._id] = units[member._id] ? units[member._id] : unit.department;
                        }
                    }
                }
            }
        }

        for (let item in employees) {
            structEmployee.push({
                id: item,
                name: employees[item],
                role: roles[item],
                department: units[item]
            });
        }
    }

    if (usersOfChildrenOrganizationalUnit) {
        unitMembers = usersOfChildrenOrganizationalUnit.map(unitMember => {
            var temp = [];
            for (let i = 0; i < structEmployee.length; i++) {
                let item = structEmployee[i];
                if (item.department === unitMember.department) {
                    temp.push({
                        text: item.name + " (" + item.role + ")",
                        value: item.id
                    });
                }
            }
            var unit = {
                text: unitMember && unitMember.department,
                value: temp,
                unitId: unitMember.id
            };

            return unit;
        });
    }

    return unitMembers;
}
