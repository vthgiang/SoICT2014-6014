const { EmployeeWorkingSchedule, User, Employee, Role } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

const ROLE_NAME = ["Admin", "Trưởng phòng vận chuyển phía nam"]


function getArrayTimeFromString(stringDate) {
    arrayDate = stringDate.split('-');
    let year = arrayDate[2];
    let month = arrayDate[1];
    let day = arrayDate[0];
    const date = new Date(year, month - 1, day);
    const moment = require('moment');

    // start day of createdAt
    var start = moment(date).startOf('day');
    // end day of createdAt
    var end = moment(date).endOf('day');

    return [start, end];
}

exports.getAllTaskWithCondition = async (query, portal) => {
    let filter = {};
    let tasks = [];
    if (query.searchingDate) {
        filter.date = {
            '$gte': getArrayTimeFromString(query.searchingDate)[0],
            '$lte': getArrayTimeFromString(query.searchingDate)[1]
        }
    }
    let emailUser = await User(connect(DB_CONNECTION, portal)).findOne({'_id': query.userId}).select("email");
    let employeeId = "";
    if (emailUser) {
        let employee = await Employee(connect(DB_CONNECTION, portal)).findOne({'emailInCompany': emailUser.email}).select("_id fullName");
        employeeId = employee?._id;
    }
    if (employeeId) filter.employee = employeeId;

    let page, limit;
    page = query?.page ? Number(query.page) : 1;
    limit = query?.limit ? Number(query.limit) : 10;

    let employeeSchedules = await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal)).find(filter)
                        .populate([
                            { path: "shift.tasks.journey", select: "orders vehicleName code status" }
                        ])
                        .skip((page - 1) * limit)
                        .limit(limit);
    let roleName;
    if (query.role) {
        let role = await Role(connect(DB_CONNECTION, portal)).findOne({'_id': query.role})
        roleName = role.name;
    }
    if (roleName && ROLE_NAME.includes(roleName) && employeeSchedules.length > 0) {
        employeeSchedules.forEach((emp) => {
            tasks = [...tasks, emp.shift?.tasks]
        });
    } else if (roleName && !ROLE_NAME.includes(roleName) && employeeSchedules.length > 0) {
        let temp = employeeSchedules.filter((emp) => JSON.stringify(emp.employee) == JSON.stringify(employeeId));
        temp.forEach((task) => {
            tasks = [...tasks, task.shift?.tasks]
        });
    } else {
        tasks = [];
    }
    if (query.status) {
        tasks = tasks.filter((task) => {
            if (task[0]?.journey?.status == query.status) return true;
            return false;
        })
    }
    return {
        data: tasks,
        // totalTasks: totalTasks
    }

}