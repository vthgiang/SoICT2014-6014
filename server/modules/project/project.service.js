const {
    Project,
    Role,
    UserRole,
    OrganizationalUnit,
    Employee,
    User,
    Salary,
    Task,
} = require('../../models');
const arrayToTree = require("array-to-tree");
const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;
const { connect, } = require(`../../helpers/dbHelper`);
const { dateParse } = require(`../../helpers/functionHelper`);
const moment = require('moment');

const MILISECS_TO_DAYS = 86400000;

exports.get = async (portal, query) => {
    let { page, limit, userId } = query;
    let options = {};
    if (query.limit) {
        // options = {
        //     ...options,
        //     limit: query.limit
        // }
        // limit = query.lim
    }

    if (query.page) {
        // options = {
        //     ...options,
        //     page: query.page
        // }
    }
    options = {
        ...options,
        $or: [
            { 'projectManager': userId },
            { 'responsibleEmployees': userId },
            { 'creator': userId }
        ]
    }
    let project;
    if (query.calledId === "paginate") {
        project = await Project(
            connect(DB_CONNECTION, portal)
        ).paginate(options, {
            page, limit,
            populate: [
                { path: "responsibleEmployees", select: "_id name" },
                { path: "projectManager", select: "_id name" },
                { path: "creator", select: "_id name" }
            ]
        });
    }
    else {
        project = await Project(connect(DB_CONNECTION, portal)).find(options)
            .populate({ path: "responsibleEmployees", select: "_id name" })
            .populate({ path: "projectManager", select: "_id name" })
            .populate({ path: "creator", select: "_id name" })
    }
    return project;
}

exports.show = async (portal, id) => {
    let tp = await Project(connect(DB_CONNECTION, portal)).findById(id).populate({ path: "projectManager", select: "_id name" });

    return tp;
}

exports.create = async (portal, data) => {
    let newData = {};
    let newResponsibleEmployeesWithUnit = [];

    if (data) {
        for (let i in data) {
            if (data[i] && data[i].length > 0) {
                newData = {
                    ...newData,
                    [i]: data[i]
                }
            }
        }
        for (let employeeItem of data.responsibleEmployeesWithUnit) {
            let newListUsers = [];
            for (let userItem of employeeItem.listUsers) {
                let currentUser = await User(connect(DB_CONNECTION, portal)).findById(userItem.userId);
                // Tìm employee từ user email
                let currentEmployee = await Employee(connect(DB_CONNECTION, portal)).find({
                    'emailInCompany': currentUser.email
                })
                // Nếu user này không phải là nhân viên => Không có lương
                if (!currentEmployee || currentEmployee.length === 0) {
                    newListUsers.push({
                        userId: userItem.userId,
                        salary: 0
                    })
                    continue;
                }
                // Tra cứu bảng lương
                let currentSalary = await Salary(connect(DB_CONNECTION, portal)).find({
                    $and: [
                        { 'organizationalUnit': employeeItem.unitId },
                        { 'employee': currentEmployee[0]._id },
                    ]
                });
                newListUsers.push({
                    userId: userItem.userId,
                    salary: currentSalary && currentSalary.length > 0 ? Number(currentSalary[0].mainSalary) : 0,
                })
            }
            // Add vào mảng cuối cùng
            newResponsibleEmployeesWithUnit.push({
                unitId: employeeItem.unitId,
                listUsers: newListUsers,
            })
        }
        for (let employeeItem of data.responsibleEmployeesWithUnit) {
            let newListUsers = [];
            for (let userItem of employeeItem.listUsers) {
                let currentUser = await User(connect(DB_CONNECTION, portal)).findById(userItem.userId);
                // Tìm employee từ user email
                let currentEmployee = await Employee(connect(DB_CONNECTION, portal)).find({
                    'emailInCompany': currentUser.email
                })
                // Nếu user này không phải là nhân viên => Không có lương
                if (!currentEmployee || currentEmployee.length === 0) {
                    newListUsers.push({
                        userId: userItem.userId,
                        salary: 0
                    })
                    continue;
                }
                // Tra cứu bảng lương
                let currentSalary = await Salary(connect(DB_CONNECTION, portal)).find({
                    $and: [
                        { 'organizationalUnit': employeeItem.unitId },
                        { 'employee': currentEmployee[0]._id },
                    ]
                });
                newListUsers.push({
                    userId: userItem.userId,
                    salary: currentSalary && currentSalary.length > 0 ? Number(currentSalary[0].mainSalary) : 0,
                })
            }
            // Add vào mảng cuối cùng
            newResponsibleEmployeesWithUnit.push({
                unitId: employeeItem.unitId,
                listUsers: newListUsers,
            })
        }
    }

    let project = await Project(connect(DB_CONNECTION, portal)).create({
        ...newData,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    });
    return project;
}

exports.edit = async (portal, id, data) => {
    let newResponsibleEmployeesWithUnit = [];
    if (data) {
        for (let employeeItem of data.responsibleEmployeesWithUnit) {
            let newListUsers = [];
            for (let userItem of employeeItem.listUsers) {
                let currentUser = await User(connect(DB_CONNECTION, portal)).findById(userItem.userId);
                // Tìm employee từ user email
                let currentEmployee = await Employee(connect(DB_CONNECTION, portal)).find({
                    'emailInCompany': currentUser.email
                })
                // Nếu user này không phải là nhân viên => Không có lương
                if (!currentEmployee || currentEmployee.length === 0) {
                    newListUsers.push({
                        userId: userItem.userId,
                        salary: 0
                    })
                    continue;
                }
                // Tra cứu bảng lương
                let currentSalary = await Salary(connect(DB_CONNECTION, portal)).find({
                    $and: [
                        { 'organizationalUnit': employeeItem.unitId },
                        { 'employee': currentEmployee[0]._id },
                    ]
                });
                newListUsers.push({
                    userId: userItem.userId,
                    salary: currentSalary && currentSalary.length > 0 ? Number(currentSalary[0].mainSalary) : 0,
                })
            }
            // Add vào mảng cuối cùng
            newResponsibleEmployeesWithUnit.push({
                unitId: employeeItem.unitId,
                listUsers: newListUsers,
            })
        }
    }
    const a = await Project(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            code: data.code,
            name: data.name,
            parent: data.parent,
            startDate: data.startDate,
            endDate: data.startDate,
            description: data.description,
            projectManager: data.projectManager,
            responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
            responsibleEmployees: data.responsibleEmployees,
        }
    }, { new: true });
    return await Project(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: "projectManager", select: "_id name" })
}

exports.delete = async (portal, id) => {
    await Project(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    return id;
}

const getAmountOfWeekDaysInMonth = (date) => {
    let result = 0;
    for (var i = 1; i < 6; i++) {
        date.date(1);
        var dif = (7 + (i - date.weekday())) % 7 + 1;
        result += Math.floor((date.daysInMonth() - dif) / 7) + 1;
    }
    return result;
}

exports.getMembersWithScore = async (portal, id, evalMonth) => {
    const currentProject = await Project(connect(DB_CONNECTION, portal)).find({ _id: id }).populate({ path: "responsibleEmployees", select: "_id name" });
    const currentTasks = await Task(connect(DB_CONNECTION, portal))
        .find({
            taskProject: id,
        })
        .populate({ path: "responsibleEmployees", select: "_id name" })
        .populate({ path: "accountableEmployees", select: "_id name" })
        .populate({ path: "consultedEmployees", select: "_id name" })
        .populate({ path: "informedEmployees", select: "_id name" })
        .populate({ path: "creator", select: "_id name" })
        .populate({ path: "preceedingTasks", select: "_id name" });
    // Chỉ lấy những task mà có startDate nhỏ hơn hoặc bằng evalMonth && endDate bằng hoặc lớn hơn evalMonth
    currentTasks.forEach((currentTaskItem) => {
        const startMonth = Number(moment(currentTaskItem.startDate).format('M'));
        const endMonth = Number(moment(currentTaskItem.endDate).format('M'));
        const evalMonthNumber = Number(moment(evalMonth).format('M'));
        if (startMonth <= evalMonthNumber && evalMonthNumber <= endMonth) {
            currentTasksWithinEvalMonth.push(currentTaskItem);
        }
    })
    const members = currentProject.responsibleEmployees;
    let result = [];
    members.forEach((memberItem) => {
        // Lấy những task mà trong responsibleEmployees chứa id của member
        const taskResOnly = currentTasksWithinEvalMonth.map((taskItem) => {
            console.log(memberItem)
            console.log(taskItem.responsibleEmployees)
            return taskItem.responsibleEmployees.includes(memberItem)
        });
        // Nếu có item nào thì xử lí, còn không thì lặp tiếp mảng members
        if (taskResOnly.length > 0) {
            // Loop array taskResOnly
            taskResOnly.forEach((taskResOnlyItem) => {
                // Luong cua current member item
                const memberSalary = taskResOnlyItem.actorsWithSalary?.find((actorSalaryItem) => String(actorSalaryItem.userId) === String(memberItem._id))?.salary || 0;
                // Trọng số của responsible
                const weight = 0.8;
                // Tìm ngày cuối cùng của tháng đánh giá
                const evalMonthEnd = moment(evalMonth).endOf('month');
                // Tìm số ngày công của tháng đánh giá
                const weekDays = getAmountOfWeekDaysInMonth(evalMonthEnd);
                let estDuration = 0;
                if (moment(taskResOnlyItem.endDate).isBefore(evalMonthEnd)) {
                    estDuration = moment(evaluationDateFromPicker).diff(moment(startDate), 'milliseconds') / MILISECS_TO_DAYS;
                } else {
                    estDuration = evalMonthEnd.diff(moment(taskResOnlyItem.startDate), 'milliseconds') / MILISECS_TO_DAYS;
                }
                let estCost = taskResOnly.estimateAssetCost + memberSalary / 23
            })
        }
    })
    return id;
}

exports.getListTasksEval = async (portal, id, evalMonth) => {
    const currentTasks = await Task(connect(DB_CONNECTION, portal))
        .find({
            taskProject: id,
        })
    let currentTasksWithinEvalMonth = []
    // Chỉ lấy những task mà có startDate nhỏ hơn hoặc bằng evalMonth && endDate bằng hoặc lớn hơn evalMonth
    currentTasks.forEach((currentTaskItem) => {
        const startMonth = Number(moment(currentTaskItem.startDate).format('M'));
        const endMonth = Number(moment(currentTaskItem.endDate).format('M'));
        const evalMonthNumber = Number(moment(evalMonth).format('M'));
        if (startMonth <= evalMonthNumber && evalMonthNumber <= endMonth) {
            currentTasksWithinEvalMonth.push(currentTaskItem);
        }
    })
    if (currentTasksWithinEvalMonth.length === 0) return [];
    return currentTasksWithinEvalMonth.map((item) => {
        // Nếu task đấy chưa có đánh giá tháng này
        if (item.evaluations.length === 0 || !item.evaluations) {
            return {
                code: item.code,
                name: item.name,
                evalMonth,
                automaticPoint: undefined,
                employeePoint: undefined,
                approvedPoint: undefined,
            }
        }
        // Lấy Eval của tháng đang đánh giá
        const currentEvalution = item.evaluations.find((evaluationItem) => {
            const evalMonthNumber = Number(moment(evalMonth).format('M'));
            const currentItemEvalMonthNumber = Number(moment(evaluationItem.evaluatingMonth).format('M'));
            return evalMonthNumber === currentItemEvalMonthNumber
        });
        return {
            code: item.code,
            name: item.name,
            evalMonth,
            automaticPoint: currentEvalution.resultsForProject.automaticPoint,
            employeePoint: currentEvalution.resultsForProject.employeePoint,
            approvedPoint: currentEvalution.resultsForProject.approvedPoint,
        }
    })
}

