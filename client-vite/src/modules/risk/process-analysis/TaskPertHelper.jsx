import React from "react";

export const roundProb = (prob) => {
    return Math.round(prob * 10000) / 100
}
export const getEmployeeSelectBoxItems = (usersOfChildrenOrganizationalUnit, includeManager = true, includeDeputyManager = true, includeEmployee = true) => {
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
                value: temp
            };

            return unit;
        });
    }

    return unitMembers;
}
export const round = (num, pow) => {
    return Math.round(num * 10 ** pow) / (10 ** pow)
}
export const getColor = (prob) => {
    let color = "#FF0000"
    if (prob >= 0.5) {
        color = '#FFFF00'
    }
    if (prob >= 0.89) {
        color = '#40FF00'
    }
    return color
}
export const getRiskColor = (prob) => {
    let color = '#40FF00'
    if (prob >= 0.5) {
        color = '#FFFF00'
    }
    if (prob >= 0.9) {
        color = "#FF0000"
    }
    if( prob>1){
        color = "#58ACFA"
    }
    return color
}
export const getRankProb = (prob) => {
    let rank = 1
    // console.log('prob',prob)
    if (prob >= 0.5) {
        rank = 2
    }
    if (prob >= 0.89) {
        rank = 3
    }
    return rank
}

export const getStatusStr = (translate,status) => {
    // inprocess", "wait_for_approval", "finished", "delayed", "canceled","temp_finished"
    let icon = "fa fa-check-circle";
    let color = "#088A08"
    let statusStr =  translate('task.task_management.inprocess')
    if (status == "inprocess") {
        color = "AEB404"
        icon = "fa fa-spinner";
        statusStr =translate('task.task_management.inprocess');
    }
    if (status == "wait_for_approval") {
        color = "#0080FF"
        icon = "fa fa-arrow-circle-up"
        statusStr =  translate('task.task_management.wait_for_approval');
    }
    if (status == "canceled") {
        color = ""
        icon = "";
        statusStr = translate('task.task_management.canceled');
    }
    if (status == "delayed") {
        color = ""
        icon = "";
        statusStr = translate('task.task_management.delayed');
    }
    if (status == "temp_finished" || status == "finished") {

        icon = "fa fa-check-circle"
        statusStr = translate('task.task_management.finished');
    }
    return <React.Fragment><div style={{ color: color }}>
        <div className="row">
            <i className={icon} />
        </div>
        <div>
            <p className="row">{statusStr}</p>
        </div>
    </div>
    </React.Fragment>
}