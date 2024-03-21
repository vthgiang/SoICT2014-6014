const {
    ProjectTemplate,
    Project,
    Employee,
    User,
    Salary,
    Task,
} = require('../models');
require('array-to-tree');
const { connect, } = require('../helpers/dbHelper');
const moment = require('moment');
const { createProjectTask } = require('./task');

exports.get = async (portal, query) => {
    let { page, perPage, userId, searchName } = query;
    let options = {};
    options = userId ? {
        ...options,
        $or: [
            { 'projectManager': userId },
            { 'responsibleEmployees': userId },
            { 'creator': userId }
        ]
    } : {};

    if (searchName && searchName.toString().trim()) {
        options = {
            ...options,
            name: {
                $regex: searchName,
                $options: 'i'
            }
        }
    }

    let project;

    let totalList = await ProjectTemplate(connect(DB_CONNECTION, portal)).countDocuments(options);
    let currentPage, currentPerPage;
    currentPage = page ? Number(page) : 1;
    currentPerPage = perPage ? Number(perPage) : 5;

    project = await ProjectTemplate(
        connect(DB_CONNECTION, portal)
    ).find(options).sort({ createdAt: -1 }).skip((currentPage - 1) * currentPerPage).limit(currentPerPage)
        .populate({ path: 'responsibleEmployees', select: '_id name email' })
        .populate({ path: 'projectManager', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
        .populate({ path: 'task.responsibleEmployees task.accountableEmployees task.consultedEmployees task.informedEmployees', select: '_id name' })
    return {
        list: project,
        totalItem: totalList,
    }
}

exports.show = async (portal, id) => {
    let tp = await ProjectTemplate(connect(DB_CONNECTION, portal)).findById(id).populate({ path: 'projectManager', select: '_id name' });

    return tp;
}

exports.create = async (portal, data) => {
    console.log('data', data)
    let newData = {};
    let newResponsibleEmployeesWithUnit = [];

    if (data) {
        for (let employeeItem of data.responsibleEmployeesWithUnit) {
            let newListUsers = [];
            for (let userItem of employeeItem.listUsers) {
                // Nếu như gửi lên từ client đã có lương rồi
                if (userItem.salary) {
                    newListUsers.push({
                        userId: userItem.userId,
                        salary: userItem.salary,
                    })
                }
                else {
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
            }
            // Add vào mảng cuối cùng
            newResponsibleEmployeesWithUnit.push({
                unitId: employeeItem.unitId,
                listUsers: newListUsers,
            })
        }
    }

    let project = await ProjectTemplate(connect(DB_CONNECTION, portal)).create({
        ...data,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    });
    // return project;

    return await ProjectTemplate(connect(DB_CONNECTION, portal)).findOne({ _id: project._id })
        .populate({ path: 'responsibleEmployees', select: '_id name email' })
        .populate({ path: 'projectManager', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
        .populate({ path: 'task.responsibleEmployees task.accountableEmployees task.consultedEmployees task.informedEmployees', select: '_id name' })
}

exports.edit = async (portal, id, data) => {
    console.log('data', id, data)
    let newResponsibleEmployeesWithUnit = [];
    if (data) {
        for (let employeeItem of data.responsibleEmployeesWithUnit) {
            let newListUsers = [];
            for (let userItem of employeeItem.listUsers) {
                // Nếu như gửi lên từ client đã có lương rồi
                if (userItem.salary) {
                    newListUsers.push({
                        userId: userItem.userId,
                        salary: userItem.salary,
                    })
                }
                else {
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
            }
            // Add vào mảng cuối cùng
            newResponsibleEmployeesWithUnit.push({
                unitId: employeeItem.unitId,
                listUsers: newListUsers,
            })
        }
    }
    const a = await ProjectTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            // code: data.code,
            name: data.name,
            projectType: data.projectType,
            parent: data.parent,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description,
            projectManager: data.projectManager,
            responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
            responsibleEmployees: data.responsibleEmployees,
            unitOfTime: data.unitOfTime,
            currenceUnit: data.currenceUnit,

            tasks: data.tasks,
        }
    }, { new: true });
    return await ProjectTemplate(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'responsibleEmployees', select: '_id name email' })
        .populate({ path: 'projectManager', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
        .populate({ path: 'task.responsibleEmployees task.accountableEmployees task.consultedEmployees task.informedEmployees', select: '_id name' })
}

exports.delete = async (portal, id) => {
    await ProjectTemplate(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
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

exports.getSalaryMembers = async (portal, data) => {
    let newResponsibleEmployeesWithUnit = [];
    for (let employeeItem of data.responsibleEmployeesWithUnit) {
        let newListUsers = [];
        for (let userItem of employeeItem.listUsers) {
            // Nếu như gửi lên từ client đã có lương rồi
            if (userItem.salary) {
                newListUsers.push({
                    userId: userItem.userId,
                    salary: userItem.salary,
                })
            }
            else {
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
        }
        // Add vào mảng cuối cùng
        newResponsibleEmployeesWithUnit.push({
            unitId: employeeItem.unitId,
            listUsers: newListUsers,
        })
    }
    return newResponsibleEmployeesWithUnit;
}

exports.createProjectInfo = async (portal, data) => {
    // console.log('data', data)
    let newData = {};
    let newResponsibleEmployeesWithUnit = [];

    if (data) {
        for (let employeeItem of data.responsibleEmployeesWithUnit) {
            let newListUsers = [];
            for (let userItem of employeeItem.listUsers) {
                // Nếu như gửi lên từ client đã có lương rồi
                if (userItem.salary) {
                    newListUsers.push({
                        userId: userItem.userId,
                        salary: userItem.salary,
                    })
                }
                else {
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
            }
            // Add vào mảng cuối cùng
            newResponsibleEmployeesWithUnit.push({
                unitId: employeeItem.unitId,
                listUsers: newListUsers,
            })
        }
    }

    let project = await Project(connect(DB_CONNECTION, portal)).create({
        ...data,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    });
    return project;
}

exports.createTaskProjectCPM = async (portal, projectId, data) => {
    let totalProjectBudget = 0;
    let endDateOfProject = data[0]?.endDate;
    let resultArr = [];
    for (let currentTask of data) {
        if (currentTask.preceedingTasks.length > 0) {
            let currentNewPreceedingTasks = [];
            for (let currentPreceedingItem of currentTask.preceedingTasks) {
                const localPreceedingItem = data.find(item => item.code === currentPreceedingItem.task);
                // console.log(335, localPreceedingItem)

                const remotePreceedingItem = await Task(connect(DB_CONNECTION, portal)).findOne({
                    taskProject: projectId,
                    name: localPreceedingItem.name
                });
                if (remotePreceedingItem) {
                    currentNewPreceedingTasks.push({
                        task: remotePreceedingItem._id,
                        link: ''
                    })
                }
            }
            currentTask = {
                ...currentTask,
                taskProject: projectId,
                isFromCPM: true,
                preceedingTasks: currentNewPreceedingTasks,
            }
        }
        else {
            currentTask = {
                ...currentTask,
                taskProject: projectId,
                isFromCPM: true,
                preceedingTasks: [],
            }
        }
        var tasks = await createProjectTask(portal, currentTask);

        resultArr.push(tasks)

        totalProjectBudget += currentTask.estimateNormalCost;
        if (moment(currentTask.endDate).isAfter(moment(endDateOfProject))) {
            endDateOfProject = currentTask.endDate;
        }
    }
    return {
        tasks: resultArr,
        totalProjectBudget,
        endDateOfProject
    }
}

exports.updateProjectInfoAfterCreateProjectTask = async (portal, projectId, data) => {
    const { totalProjectBudget, endDateOfProject } = data
    const project = await Project(connect(DB_CONNECTION, portal)).findByIdAndUpdate(projectId, {
        $set: {
            budget: totalProjectBudget,
            endDate: endDateOfProject,
            budgetChangeRequest: totalProjectBudget,
            endDateRequest: endDateOfProject,
        }
    }, { new: true });

    return project;
}

exports.createProjectByProjectTemplate = async (portal, templateId, data) => {
    const project = await this.createProjectInfo(portal, data.project);
    if (!project) throw ['create_project_failed!'];

    const projectId = project._id;
    const createdTaskList = await this.createTaskProjectCPM(portal, projectId, data.tasks);
    if (!createdTaskList) throw ['create_task_project_failed!'];

    const updatedProject = await this.updateProjectInfoAfterCreateProjectTask(portal, projectId, createdTaskList)
    if (!updatedProject) throw ['failed_to_update_project_after_create_project_task!'];

    await ProjectTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(templateId, { $inc: { 'numberOfUse': 1 } }, { new: true });

    const updatedtemplate = await ProjectTemplate(connect(DB_CONNECTION, portal)).findOne({ _id: templateId })
        .populate({ path: 'responsibleEmployees', select: '_id name email' })
        .populate({ path: 'projectManager', select: '_id name email' })
        .populate({ path: 'creator', select: '_id name email' })
        .populate({ path: 'task.responsibleEmployees task.accountableEmployees task.consultedEmployees task.informedEmployees', select: '_id name' })

    return {
        template: updatedtemplate,
        tasks: createdTaskList,
    }
}
