const {
    Project,
    Role,
    UserRole,
    OrganizationalUnit,
    Employee,
    User,
    Salary,
    Task,
    ProjectChangeRequest,
} = require('../../models');
const arrayToTree = require("array-to-tree");
const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;
const { connect, } = require(`../../helpers/dbHelper`);
const { dateParse } = require(`../../helpers/functionHelper`);
const moment = require('moment');
const { createProjectTask } = require('../task/task-management/task.service');

const MILISECS_TO_DAYS = 86400000;

exports.get = async (portal, query) => {
    let { page, perPage, userId, projectName } = query;
    let options = {};
    options = userId ? {
        ...options,
        $or: [
            { 'projectManager': userId },
            { 'responsibleEmployees': userId },
            { 'creator': userId }
        ]
    } : {};

    if (projectName && projectName.toString().trim()) {
        options = {
            ...options,
            name: {
                $regex: projectName,
                $options: "i"
            }
        }
    }

    let project;

    let totalList = await Project(connect(DB_CONNECTION, portal)).countDocuments(options);
    if (query.calledId === "paginate") {
        let currentPage, currentPerPage;
        console.log('page, perPage', page, perPage)
        currentPage = page ? Number(page) : 1;
        currentPerPage = perPage ? Number(perPage) : 5;
        console.log('currentPage, currentPerPage', currentPage, currentPerPage)
        console.log('options', options)

        project = await Project(
            connect(DB_CONNECTION, portal)
        ).find(options).sort({createdAt: -1}).skip((currentPage - 1) * currentPerPage).limit(currentPerPage)
            .populate({ path: "responsibleEmployees", select: "_id name email" })
            .populate({ path: "projectManager", select: "_id name email" })
            .populate({ path: "creator", select: "_id name email" });
        console.log('project', project)
        return {
            docs: project,
            totalDocs: totalList,
        }
    }
    else {
        project = await Project(connect(DB_CONNECTION, portal)).find(options).sort({createdAt: -1})
            .populate({ path: "responsibleEmployees", select: "_id name email" })
            .populate({ path: "projectManager", select: "_id name email" })
            .populate({ path: "creator", select: "_id name email" })
    }
    // console.log('project2222222', project)
    return project;
}

exports.show = async (portal, id) => {
    let tp = await Project(connect(DB_CONNECTION, portal)).findById(id).populate({ path: "projectManager", select: "_id name" });

    return tp;
}

exports.create = async (portal, data) => {
    console.log('data', data)
    let newData = {};
    let newResponsibleEmployeesWithUnit = [];

    if (data) {
        // for (let i in data) {
        //     if (data[i] && data[i].length > 0) {
        //         newData = {
        //             ...newData,
        //             [i]: data[i]
        //         }
        //     }
        // }
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
        // ...newData,
        ...data,
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
    const a = await Project(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
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
            unitTime: data.unitTime,
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
        .populate({ path: "responsibleEmployees", select: "_id name" })
        .populate({ path: "accountableEmployees", select: "_id name" })
        .populate({ path: "consultedEmployees", select: "_id name" })
        .populate({ path: "informedEmployees", select: "_id name" })
        .populate({ path: "creator", select: "_id name" })
        .populate({ path: "preceedingTasks", select: "_id name" });
    // .populate([
    //     { path: "overallEvaluation.responsibleEmployees.employee", select: "_id name" },
    //     { path: "overallEvaluation.accountableEmployees.employee", select: "_id name" },
    // ]);
    let currentTasksWithinEvalMonth = []
    // Chỉ lấy những task mà có endDate trong khoảng đầu cuối của evalMonth
    currentTasks.forEach((currentTaskItem) => {
        const startOfCurrentMonthMoment = moment(evalMonth).startOf('month');
        const endOfCurrentMonthMoment = moment(evalMonth).endOf('month');
        if (moment(currentTaskItem.endDate).isSameOrAfter(startOfCurrentMonthMoment) &&
            moment(currentTaskItem.endDate).isSameOrBefore(endOfCurrentMonthMoment)) {
            currentTasksWithinEvalMonth.push(currentTaskItem);
        }
    })
    if (currentTasksWithinEvalMonth.length === 0) return [];
    return currentTasksWithinEvalMonth.map((item) => {
        return item;
    })
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

exports.getListProjectChangeRequests = async (portal, query) => {
    let { page, perPage, projectId } = query;
    console.log('page, perPage, projectId', page, perPage, projectId)
    let projectChangeRequestsList;
    let totalList = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).countDocuments({
        taskProject: projectId,
    });
    if (query.calledId === "paginate") {
        let currentPage = Number(page), currentPerPage = Number(perPage);
        console.log('currentPage, currentPerPage', currentPage, currentPerPage)

        projectChangeRequestsList = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).find({
            taskProject: projectId,
        }).sort({createdAt: -1}).skip((currentPage - 1) * currentPerPage).limit(currentPerPage)
        .populate({ path: "creator", select: "_id name email" });

        return {
            docs: projectChangeRequestsList,
            totalDocs: totalList,
        }
    }
    projectChangeRequestsList = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).find({
        taskProject: projectId,
    }).sort({createdAt: -1}).populate({ path: "creator", select: "_id name email" });
    console.log('Lấy danh sách CR', projectChangeRequestsList.length)
    return projectChangeRequestsList;
}

exports.createProjectChangeRequest = async (portal, changeRequest) => {
    console.log(changeRequest)
    const createCRResult = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).create(changeRequest);
    const projectChangeRequestsList = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).find({
        taskProject: createCRResult.taskProject,
    }).populate({ path: "creator", select: "_id name email" });
    return projectChangeRequestsList;
}

exports.updateStatusProjectChangeRequest = async (portal, changeRequestId, requestStatus) => {
    console.log(changeRequestId, requestStatus);
    // update requestStatus trong database
    const updateCRStatusResult = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).findByIdAndUpdate(changeRequestId, {
        $set: {
            requestStatus,
        }
    }, { new: true });
    // Nếu requestStatus là đồng ý thì thực thi
    if (Number(requestStatus) === 3) {
        // Nếu là dạng normal thì bỏ qua
        if (updateCRStatusResult.type === 'normal') { }
        // Nếu là dạng update trạng thái hoãn huỷ công việc
        else if (updateCRStatusResult.type === 'update_status_task') {
            const affectedItem = updateCRStatusResult.affectedTasksList[0];
            await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(affectedItem.task, {
                $set: {
                    status: affectedItem.new.status,
                }
            }, { new: true });
        }
        // Nếu là dạng edit_task hoặc add_task
        else {
            for (let affectedItem of updateCRStatusResult.affectedTasksList) {
                // Nếu task cần edit
                if (affectedItem.task) {
                    await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(affectedItem.task, {
                        $set: {
                            preceedingTasks: affectedItem.new.preceedingTasks,
                            startDate: affectedItem.new.startDate,
                            startDate: affectedItem.new.startDate,
                            endDate: affectedItem.new.endDate,
                            estimateNormalTime: affectedItem.new.estimateNormalTime,
                            estimateOptimisticTime: affectedItem.new.estimateOptimisticTime,
                            estimateNormalCost: affectedItem.new.estimateNormalCost,
                            estimateMaxCost: affectedItem.new.estimateMaxCost,
                            actorsWithSalary: affectedItem.new.actorsWithSalary,
                            responsibleEmployees: affectedItem.new.responsibleEmployees,
                            accountableEmployees: affectedItem.new.accountableEmployees,
                            totalResWeight: affectedItem.new.totalResWeight,
                            estimateAssetCost: affectedItem.new.estimateAssetCost,
                        }
                    }, { new: true });
                }
                // Nếu affectedItem.task là dạng undefined => Dạng add_task
                else {
                    await createProjectTask(portal, updateCRStatusResult.currentTask);
                }
            }
            await Project(connect(DB_CONNECTION, portal)).findByIdAndUpdate(updateCRStatusResult.taskProject, {
                $set: {
                    budgetChangeRequest: updateCRStatusResult.baseline.newCost,
                    endDateRequest: updateCRStatusResult.baseline.newEndDate,
                }
            }, { new: true });
        }
    }
    // query lại danh sách projectChangeRequest
    const projectChangeRequestsList = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).find({
        taskProject: updateCRStatusResult.taskProject,
    }).sort({createdAt: -1}).populate({ path: "creator", select: "_id name email" });
    return projectChangeRequestsList;
}

exports.updateListProjectChangeRequests = async (portal, data) => {
    console.log(data)
    const { newChangeRequestsList } = data
    for (let newCRItem of newChangeRequestsList) {
        await ProjectChangeRequest(connect(DB_CONNECTION, portal)).findOneAndUpdate(
            { _id: newCRItem._id },
            {
                ...newCRItem,
            },
            { new: true, overwrite: true },
        );
    }

    // query lại danh sách projectChangeRequest
    const projectChangeRequestsList = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).find({
        taskProject: newChangeRequestsList[0].taskProject,
    }).populate({ path: "creator", select: "_id name email" });
    return projectChangeRequestsList;
}

