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
    ProjectPhase,
    ProjectMilestone
} = require('../../../models');
const arrayToTree = require("array-to-tree");
const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;
const { connect, } = require(`../../../helpers/dbHelper`);
const { dateParse } = require(`../../../helpers/functionHelper`);
const moment = require('moment');
const { createProjectTask } = require('../../task/task-management/task.service');

const MILISECS_TO_DAYS = 86400000;

/**
 * Hàm hỗ trợ lấy số tuần trong 1 tháng
*/
const getAmountOfWeekDaysInMonth = (date) => {
    let result = 0;
    for (var i = 1; i < 6; i++) {
        date.date(1);
        var dif = (7 + (i - date.weekday())) % 7 + 1;
        result += Math.floor((date.daysInMonth() - dif) / 7) + 1;
    }
    return result;
}


/**
 * Lấy danh sách các dự án thoả mãn điều kiện
 * @param {*} query 
 */
exports.get = async (portal, query) => {
    let { page, perPage, userId, projectName, endDate, startDate, projectType, creatorEmployee, projectManager, responsibleEmployees } = query;
    let options = {};
    let keySearchDateTime = {};
    // Tìm kiếm theo id người sử dụng
    options = userId ? {
        ...options,
        $or: [
            { 'projectManager': userId },
            { 'responsibleEmployees': userId },
            { 'creator': userId }
        ]
    } : {};
    // console.log("userId: ", userId)

    // Tìm kiếm theo tên dự án
    if (projectName && projectName.toString().trim()) {
        options = {
            ...options,
            name: {
                $regex: projectName,
                $options: "i"
            }
        }
    }

    // Tìm kiếm theo thành viên dự án
    if (responsibleEmployees) {
        const responsible = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: responsibleEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: responsibleEmployees,
                        $options: "i",
                    }
                }
            ]
        })
        const getIdResponsible = responsible && responsible.length > 0 ? responsible.map(o => o._id) : [];

        options = {
            ...options,
            responsibleEmployees: {
                $in: getIdResponsible
            }
        }
    }

    // Tìm kiếm theo người quản trị dự án
    if (projectManager) {
        const manager = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: projectManager,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: projectManager,
                        $options: "i",
                    }
                }
            ]
        })
        const getIdManager = manager && manager.length > 0 ? manager.map(o => o._id) : [];
        options = {
            ...options,
            projectManager: {
                $in: getIdManager
            }
        }
    }

    // Tìm kiếm theo người tạo dự án
    if (creatorEmployee) {
        let creator = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: creatorEmployee,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: creatorEmployee,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdCreator = creator && creator.length > 0 ? creator.map(o => o._id) : [];

        options = {
            ...options,
            creator: {
                $in: getIdCreator
            }
        }
    }

    // Tìm kiếm theo hình thức quản lý dự án
    if (projectType) {
        options = {
            ...options,
            projectType: {
                $in: projectType,
            }
        };
    }
    let project;

     // Tìm kiếm theo ngày bắt đầu, kết thúc
     if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySearchDateTime = {
            ...keySearchDateTime,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }

    else if (startDate) {
        startDate = new Date(startDate);

        options = {
            ...options,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, startDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, startDate.getFullYear()]
                    }
                }
            ]
        }
    }

    else if (endDate) {
        endDate = new Date(endDate);

        options = {
            ...options,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, endDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, endDate.getFullYear()]
                    }
                }
            ]
        }
    }

    options = {
        $and: [
            options,
            keySearchDateTime,
        ]
    }

    let totalList = await Project(connect(DB_CONNECTION, portal)).countDocuments(options);
    // Nếu calledId là 'paginate' thì thực hiện phân trang
    if (query.calledId === "paginate") {
        let currentPage, currentPerPage;
        currentPage = page ? Number(page) : 1;
        currentPerPage = perPage ? Number(perPage) : 5;

        project = await Project(connect(DB_CONNECTION, portal)).find(options).sort({ createdAt: -1 }).skip((currentPage - 1) * currentPerPage).limit(currentPerPage)
            .populate({ path: "responsibleEmployees", select: "_id name" })
            .populate({ path: "projectManager", select: "_id name email" })
            .populate({ path: "creator", select: "_id name email" })
            .populate({ path: "assets", select: "_id assetName assetType group" })
            .populate({ path: "responsibleEmployeesWithUnit", select: "unitId listUsers" })
            .populate({ path: "kpiTarget.type", select: "_id name criteria unit" })
            .populate({ path: "tasks"});
        return {
            docs: project,
            totalDocs: totalList,
        }
    }

    else {
        project = await Project(connect(DB_CONNECTION, portal)).find(options).sort({ createdAt: -1 })
            .populate({ path: "responsibleEmployees", select: "_id name" })
            .populate({ path: "projectManager", select: "_id name email" })
            .populate({ path: "creator", select: "_id name email" })
            .populate({ path: "assets", select: "_id assetName assetType group" })
            .populate({ path: "responsibleEmployeesWithUnit", select: "unitId listUsers" })
            .populate({ path: "kpiTarget.type", select: "_id name" })
            .populate({ path: "tasks"});

    }
    return project;
}

exports.show = async (portal, id) => {
    let tp = await Project(connect(DB_CONNECTION, portal)).findById(id).populate({ path: "projectManager", select: "_id name" });
    return tp;
}

/**
 * Tạo dự án mới
 * @param {*} data 
 */
exports.create = async (portal, data, userId, company) => {
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
        // for (let employeeItem of data.responsibleEmployeesWithUnit) {
        //     let newListUsers = [];
        //     for (let userItem of employeeItem.listUsers) {
        //         // Nếu như gửi lên từ client đã có lương rồi
        //         if (userItem.salary) {
        //             newListUsers.push({
        //                 userId: userItem.userId,
        //                 salary: userItem.salary,
        //             })
        //         }
        //         else {

        //             let currentUser = await User(connect(DB_CONNECTION, portal)).findById(userItem.userId);
        //             // Tìm employee từ user email
        //             let currentEmployee = await Employee(connect(DB_CONNECTION, portal)).find({
        //                 'emailInCompany': currentUser.email
        //             })
        //             // Nếu user này không phải là nhân viên => Không có lương
        //             if (!currentEmployee || currentEmployee.length === 0) {
        //                 newListUsers.push({
        //                     userId: userItem.userId,
        //                     salary: 0
        //                 })
        //                 continue;
        //             }
        //             // Tra cứu bảng lương
        //             let currentSalary = await Salary(connect(DB_CONNECTION, portal)).find({
        //                 $and: [
        //                     { 'organizationalUnit': employeeItem.unitId },
        //                     { 'employee': currentEmployee[0]._id },
        //                 ]
        //             });
        //             newListUsers.push({
        //                 userId: userItem.userId,
        //                 salary: currentSalary && currentSalary.length > 0 ? Number(currentSalary[0].mainSalary) : 0,
        //             })
        //         }
        //     }
        //     // Add vào mảng cuối cùng
        //     newResponsibleEmployeesWithUnit.push({
        //         unitId: employeeItem.unitId,
        //         listUsers: newListUsers,
        //     })
        // }
    }

    let project = await Project(connect(DB_CONNECTION, portal)).create({
        // ...newData,
        ...data,
        responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
        company: company,
        creator: userId,
        status: 'proposal'
    });

    if (data?.tasksData && data?.tasksData?.length) {
        const tasksToAdd = data?.tasksData.map((task) => {
            return {
                ...task,
                status: 'proposal',
                taskProject: project._id,
                preceedingTasks: task?.preceedingTasks && task?.preceedingTasks?.length ? task?.preceedingTasks.map((item) => {
                    return {
                        link: item
                    }
                }) : []
            }
        }) 

        // Tạo các tasks và lấy các `_id` của chúng
        const createdTasks = await Task(connect(DB_CONNECTION, portal)).insertMany(tasksToAdd);

        // Tạo bản đồ ánh xạ taskCode -> _id và taskCode -> taskCode
        const taskCodeToIdMap = {};
        createdTasks.forEach(task => {
            taskCodeToIdMap[task.code] = task._id;
        });

         // Cập nhật lại các tasks với preceedingTasks
        for (let taskData of createdTasks) {
            if (taskData.preceedingTasks) {
                taskData.preceedingTasks = taskData.preceedingTasks.map(({ link }) => ({
                    task: taskCodeToIdMap[link],
                    link: link // Sử dụng taskCode làm giá trị cho link
                }));
                await taskData.save();
            }
        }

        project.tasks = createdTasks.map(task => task._id);

        await project.save();
    }

    project = await Project(connect(DB_CONNECTION, portal)).findById(project._id)
        .populate({ path: "responsibleEmployees", select: "_id email name" })
        .populate({ path: "projectManager", select: "_id name email" })
        .populate({ path: "creator", select: "_id name email" })
    return project;
}

/**
 * Thay đổi thông tin dự án
 * @param {*} id 
 * @param {*} data 
 */
exports.edit = async (portal, id, data) => {
    let newResponsibleEmployeesWithUnit = [];
    // if (data) {
    //     // for (let employeeItem of data.responsibleEmployeesWithUnit) {
    //     //     let newListUsers = [];
    //     //     for (let userItem of employeeItem.listUsers) {
    //     //         // Nếu như gửi lên từ client đã có lương rồi
    //     //         if (userItem.salary) {
    //     //             newListUsers.push({
    //     //                 userId: userItem.userId,
    //     //                 salary: userItem.salary,
    //     //             })
    //     //         }
    //     //         else {
    //     //             let currentUser = await User(connect(DB_CONNECTION, portal)).findById(userItem.userId);
    //     //             // Tìm employee từ user email
    //     //             let currentEmployee = await Employee(connect(DB_CONNECTION, portal)).find({
    //     //                 'emailInCompany': currentUser.email
    //     //             })
    //     //             // Nếu user này không phải là nhân viên => Không có lương
    //     //             if (!currentEmployee || currentEmployee.length === 0) {
    //     //                 newListUsers.push({
    //     //                     userId: userItem.userId,
    //     //                     salary: 0
    //     //                 })
    //     //                 continue;
    //     //             }
    //     //             // Tra cứu bảng lương
    //     //             let currentSalary = await Salary(connect(DB_CONNECTION, portal)).find({
    //     //                 $and: [
    //     //                     { 'organizationalUnit': employeeItem.unitId },
    //     //                     { 'employee': currentEmployee[0]._id },
    //     //                 ]
    //     //             });
    //     //             newListUsers.push({
    //     //                 userId: userItem.userId,
    //     //                 salary: currentSalary && currentSalary.length > 0 ? Number(currentSalary[0].mainSalary) : 0,
    //     //             })
    //     //         }
    //     //     }
    //     //     // Add vào mảng cuối cùng
    //     //     newResponsibleEmployeesWithUnit.push({
    //     //         unitId: employeeItem.unitId,
    //     //         listUsers: newListUsers,
    //     //     })
    //     // }
    // }

    // const a = await Project(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
    //     $set: {
    //         // code: data.code,
    //         name: data.name,
    //         projectType: data.projectType,
    //         parent: data.parent,
    //         startDate: data.startDate,
    //         endDate: data.endDate,
    //         description: data.description,
    //         projectManager: data.projectManager,
    //         responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
    //         responsibleEmployees: data.responsibleEmployees,
    //         unitTime: data.unitTime,
    //         unitCost: data.unitCost
    //     }
    // }, { new: true });

    // Bước 2: Tìm dự án cần cập nhật
    let project = await Project(connect(DB_CONNECTION, portal)).findOne({ _id: id });

    if (!project) {
        throw new Error('Project not found');
    }

    // Bước 3: Cập nhật các thông tin của dự án (ngoại trừ tasks)
    Object.assign(project, data);
    await project.save();

    // Bước 4: Cập nhật các tasks (nếu có)
    if (data?.tasksData) {
        // Lấy tất cả các tasks hiện có của dự án
        const tasksDataToUpdate = data?.tasksData.map((task) => {
            return {
                ...task,
                taskProject: project._id,
                preceedingTasks: task?.preceedingTasks && task?.preceedingTasks?.length ? task?.preceedingTasks.map((item) => {
                    return {
                        link: item
                    }
                }) : []
            }
        }) 
        const existingTasks = await Task(connect(DB_CONNECTION, portal)).find({ taskProject: id });
        const existingTaskIds = existingTasks.map(task => task._id.toString());

        // Bản đồ ánh xạ taskCode -> _id
        const taskCodeToIdMap = {};
        existingTasks.forEach(task => {
            taskCodeToIdMap[task.code] = task._id;
        });

        // Mảng để lưu các tasks mới và cập nhật
        const tasksToCreate = [];
        const tasksToUpdate = [];

        // Duyệt qua tasksData để xử lý từng task
        for (let taskData of tasksDataToUpdate) {
            if (taskData._id && existingTaskIds.includes(taskData._id)) {
                // Task đã tồn tại, cập nhật task
                tasksToUpdate.push(taskData);
            } else {
                // Task mới, thêm vào mảng tasksToCreate
                tasksToCreate.push(taskData);
            }
        }

        // Thêm các tasks mới
        if (tasksToCreate.length > 0) {
            const newTasks = tasksToCreate.map(task => ({
                ...task,
                taskProject: project._id,
                preceedingTasks: task?.preceedingTasks?.length ? task.preceedingTasks.map(({link}) => ({
                    link: link
                })) : []
            }));

            const createdTasks = await Task(connect(DB_CONNECTION, portal)).insertMany(newTasks);

            createdTasks.forEach(task => {
                taskCodeToIdMap[task.code] = task._id;
            });

            project.tasks = [...project.tasks, ...createdTasks.map(task => task._id)];
            
            for (let taskData of createdTasks) {
                if (taskData.preceedingTasks) {
                    taskData.preceedingTasks = taskData.preceedingTasks.map(({ link }) => ({
                        task: taskCodeToIdMap[link],
                        link: link // Sử dụng taskCode làm giá trị cho link
                    }));
                    await taskData.save();
                }
            }
        }



        // Cập nhật các tasks hiện có
        for (let taskData of tasksToUpdate) {
            const updatedTask = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(taskData._id, taskData, { new: true });

            if (taskData.preceedingTasks) {
                updatedTask.preceedingTasks = updatedTask.preceedingTasks.map(({link}) => ({
                    task: taskCodeToIdMap[link],
                    link: link
                }));
                await updatedTask.save();
            }
        }

        // Xóa các tasks không còn trong tasksData
        const newTaskIds = data.tasksData.map(task => task._id).filter(id => id);
        const tasksToDelete = existingTaskIds.filter(id => !newTaskIds.includes(id));

        if (tasksToDelete.length > 0) {
            await Task(connect(DB_CONNECTION, portal)).deleteMany({ _id: { $in: tasksToDelete } });
            project.tasks = project.tasks.filter(taskId => !tasksToDelete.includes(taskId.toString()));
        }

        await project.save();
    }

    // Bước 5: Lấy lại dự án với các thông tin chi tiết
    project = await Project(connect(DB_CONNECTION, portal)).findById(project._id)
        .populate({ path: "responsibleEmployees", select: "_id name" })
        .populate({ path: "projectManager", select: "_id name email" })
        .populate({ path: "creator", select: "_id name email" })
        .populate({ path: "assets", select: "_id assetName assetType group" })
        .populate({ path: "responsibleEmployeesWithUnit", select: "unitId listUsers" })
        .populate({ path: "kpiTarget.type", select: "_id name" })
        .populate({ path: "tasks"});
    return project;
}

/**
 * Xoá dự án theo id
 * @param {*} id
*/
exports.delete = async (portal, id) => {
    await Task(connect(DB_CONNECTION, portal)).deleteMany({ taskProject: id });

    await Project(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    return id;
}

/**
 * Lấy điểm của các thành viên
 * @param {*} id
 * @param {*} evalMonth
 */
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

/**
 * Lấy danh sách các đánh giá
 * @param {*} id
 * @param {*} evalMonth
*/
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

/**
 * Lấy danh sách lương các thành viên
 * @param {*} data
 */
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

/**
 * Lấy danh sách các yêu cầu thay đổi
 * @param {*} query
 */
exports.getListProjectChangeRequests = async (portal, query) => {
    let { name, status, affectedTask, creator, creationTime, calledId, page, perPage, projectId } = query;

    let projectChangeRequestsList;
    let keySearch = {};

    // Tìm kiếm yêu cầu theo dự án
    if (projectId) {
        keySearch = {
            ...keySearch,
            taskProject: projectId,
        }
    }

    // Tìm kiếm yêu cầu theo trạng thái
    if (status) {
        keySearch = {
            ...keySearch,
            requestStatus: {
                $in: status,
            }
        };
    }

    // Tìm kiếm yêu cầu theo tên
    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    // Tìm kiếm công việc theo tên công việc bị ảnh hưởng
    if (affectedTask) {
        const affected = await Task(connect(DB_CONNECTION, portal)).find({
            name: {
                $regex: affectedTask,
                $options: "i",
            }
        })

        const getIdAffected = affected && affected.length > 0 ? affected.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            "affectedTasksList.task": {
                $in: getIdAffected
            }
        }
    }

    // Tìm kiếm theo người thiết lập
    if (creator) {
        const author = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: creator,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: creator,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdCreator = author && author.length > 0 ? creator.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            creator: {
                $in: getIdCreator
            }
        }
    }

    // Tìm kiếm yêu cầu theo ngày tạo tuần hiện tại
    if (creationTime === "currentWeek") {
        let curr = new Date()
        let week = []

        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            week.push(day)
        }

        const firstDayOfWeek = week[0];
        const lastDayOfWeek = week[week.length - 1];

        keySearch = {
            ...keySearch,
            createdAt: {
                $gte: new Date(firstDayOfWeek), $lte: new Date(lastDayOfWeek)
            }
        }
    }

    // Tìm kiếm yêu cầu theo ngày tạo tháng hiện tại
    if (creationTime === 'currentMonth') {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const month = new Date(currentYear + '-' + (currentMonth + 1));
        const nextMonth = new Date(currentYear + '-' + (currentMonth + 1));
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        keySearch = {
            ...keySearch,
            createdAt: {
                $gt: new Date(month), $lte: new Date(nextMonth)
            }
        }
    }

    let totalList = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).countDocuments({ taskProject: projectId });

    // Nếu calledId là 'get_all' thì bỏ qua page và perPage
    if (calledId === 'get_all') {
        projectChangeRequestsList = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).find(keySearch).sort({ createdAt: -1 })
            .populate({ path: "creator", select: "_id name email" });
    }

    else {
        projectChangeRequestsList = await ProjectChangeRequest(connect(DB_CONNECTION, portal))
            .find(keySearch).sort({ createdAt: -1 }).skip((Number(page) - 1) * Number(perPage)).limit(Number(perPage))
            .populate({ path: "creator", select: "_id name email" });
    }

    return {
        docs: projectChangeRequestsList,
        totalDocs: totalList,
    }
}

/** 
 * Tạo yêu cầu thay đổi dự án
 * @param {*} changeRequest
*/
exports.createProjectChangeRequest = async (portal, changeRequest) => {
    const createCRResult = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).create(changeRequest);
    const projectChangeRequestsList = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).find({
        taskProject: createCRResult.taskProject,
    }).populate({ path: "creator", select: "_id name email" });
    return projectChangeRequestsList;
}

/**
 * Cập nhật trạng thái cho các yêu cầu thay đổi dự án
 * @param {*} changeRequestId
 * @param {*} requestStatus
 */
exports.updateStatusProjectChangeRequest = async (portal, changeRequestId, requestStatus) => {
    // update requestStatus trong database
    const updateCRStatusResult = await ProjectChangeRequest(connect(DB_CONNECTION, portal)).findByIdAndUpdate(changeRequestId, {
        $set: {
            requestStatus,
        }
    }, { new: true });

    // Lấy id của các giai đoạn bị ảnh hưởng
    let oldPhaseId = updateCRStatusResult.affectedTasksList.filter(item => item.old.taskPhase).map(item => String(item.old.taskPhase));
    let newPhaseId = updateCRStatusResult.affectedTasksList.filter(item => item.new.taskPhase).map(item => String(item.new.taskPhase));
    let updatePhaseId = [...oldPhaseId, ...newPhaseId];
    // Lọc phần tử thừa
    updatePhaseId = new Set(updatePhaseId);
    updatePhaseId = [...updatePhaseId];
    let updateMilestoneList = [];

    // Lấy id của các cột mốc bị ảnh hưởng
    let taskArrId = updateCRStatusResult.affectedTasksList.filter(item => item.task).map(item => String(item.task));
    if (taskArrId && taskArrId.length > 0) {
        updateMilestoneList = await ProjectMilestone(connect(DB_CONNECTION, portal)).find({
            "preceedingTasks.task": {
                $in: taskArrId
        }
    })}
    let updateMilestoneId = updateMilestoneList.map(milestone => String(milestone._id));

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
                            preceedingMilestones: affectedItem.new.preceedingMilestones,
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
                            taskPhase: affectedItem.new.taskPhase,
                        }
                    }, { new: true });
                }
                // Nếu affectedItem.task là dạng undefined => Dạng add_task
                else {
                    await createProjectTask(portal, updateCRStatusResult.currentTask);
                }
            }

            // Cập nhật lại thông số cho các cột mốc sau khi cập nhật các task
            await Promise.all(updateMilestoneId.map(async (id) => {
                await updateMilestone(id, portal);
            }))

            // Cập nhật lại thông số cho giai đoạn sau khi cập nhật các task
            await Promise.all(updatePhaseId.map(async (id) => {
                await updatePhase(id, portal);
            }))
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
    }).sort({ createdAt: -1 }).populate({ path: "creator", select: "_id name email" });
    return projectChangeRequestsList;
}

/**
 * Cập nhật danh sách các yêu cầu thay đổi dự án
 * @param {*} data
 */
exports.updateListProjectChangeRequests = async (portal, data) => {
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

// Tìm kiếm endDate muộn nhất trong list tasks
const findLatestDate = (data) => {
    if (data.length === 0) return null;
    let currentMax = data[0].endDate;
    for (let dataItem of data) {
        if (!currentMax) currentMax = dataItem.endDate;
        else if (dataItem?.endDate && moment(dataItem.endDate).isAfter(moment(currentMax))) {
            currentMax = dataItem.endDate;
        }
    }
    return currentMax;
}

// Tìm kiếm startDate sớm nhất trong list tasks
const findEarliestDate = (data) => {
    if (data.length === 0) return null;
    let currentMin = data[0].startDate;
    for (let dataItem of data) {
        if (!currentMin) currentMin = dataItem.startDate;
        else if (dataItem?.startDate && moment(dataItem.startDate).isBefore(moment(currentMin))) {
            currentMin = dataItem.startDate;
        }
    }
    return currentMin;
}

// Hàm hỗ trợ cập nhật lại thông tin của các cột mốc sau khi cập nhật thông tin công việc
const updateMilestone = async (milestoneId, portal) => {
    console.log(milestoneId);
    if (milestoneId) {
        let oldMilestoneData = await ProjectMilestone(connect(DB_CONNECTION, portal)).findById(milestoneId)
        .populate({ path: "preceedingTasks.task", select: "endDate startDate _id" });
        let listTaskMilestone = oldMilestoneData.preceedingTasks.map(item => item.task)
        let newEndDate = oldMilestoneData?.endDate;
        let newStartDate = oldMilestoneData?.startDate;
            listTaskMilestone = [...listTaskMilestone, oldMilestoneData];

        // Nếu danh sách công việc không rỗng, t cần tính lại ngày bắt đầu, ngày kết thúc
        if (listTaskMilestone && listTaskMilestone.length > 0) {
            newEndDate = findLatestDate(listTaskMilestone);
            console.log(listTaskMilestone)
        }
        let newMilestone = await ProjectMilestone(connect(DB_CONNECTION, portal)).findByIdAndUpdate(milestoneId, {
            $set: {
                endDate: newEndDate,
                startDate: newEndDate,
            }
        }, { new: true });
        console.log(newMilestone ,oldMilestoneData);
    }
}

// Hàm hỗ trợ cập nhật lại thông tin của các giai đoạn sau khi cập nhật thông tin công việc
const updatePhase = async (phaseId, portal) => {
    console.log(phaseId);
    if (phaseId) {
        let newBudget = 0;
        let listTaskPhase = [];
        let oldPhaseData = await ProjectPhase(connect(DB_CONNECTION, portal)).findById(phaseId);
        let newEndDate = oldPhaseData?.endDate;
        let newStartDate = oldPhaseData?.startDate;
        let newStatus = oldPhaseData?.status || "inprocess";
        let newActualEndDate = oldPhaseData?.actualEndDate;

        // Tìm những công việc và cột mốc thuộc giai đoạn
        listTaskPhase = await Task(connect(DB_CONNECTION, portal)).find({taskPhase: phaseId}) || [];
        listMilestonePhase = await ProjectMilestone(connect(DB_CONNECTION, portal)).find({projectPhase: phaseId}) || [];
        
        // Chuyển danh sách công việc thành mảng
        if (listTaskPhase && !Array.isArray(listTaskPhase)) {
            listTaskPhase = [...listTaskPhase];
        }

        // Chuyển danh sách cột mốc thành mảng
        if (listMilestonePhase && !Array.isArray(listMilestonePhase)) {
            listTaskPhase = [...listTaskPhase];
        }

        listTaskAndMilestone = [...listTaskPhase, ...listMilestonePhase];

        
        // Nếu danh sách công việc và cột mốc không rỗng, t cần tính lại ngày bắt đầu, ngày kết thúc
        if (listTaskAndMilestone && listTaskAndMilestone.length > 0) {
            newStartDate = findEarliestDate(listTaskAndMilestone);
            newEndDate = findLatestDate(listTaskAndMilestone);
            newBudget = listTaskPhase.reduce((current, next) => current + next.estimateNormalCost ,0);
            // Nếu trạng thái hiện tại là đã hoàn thành và danh sách công việc có công việc chưa hoàn thành
            // Tự động cập nhật lại trạng thái thực hiện giai đoạn thành đang thực hiện
            if (newStatus === 'finished') {
                let unfinishedTask = listTaskAndMilestone.filter(task => task?.status && task?.status !== "finished");
                if (unfinishedTask.length > 0) {
                    newStatus = "inprocess";
                    newActualEndDate = undefined
                }
            }
        }

        let newPhase = await ProjectPhase(connect(DB_CONNECTION, portal)).findByIdAndUpdate(phaseId, {
            $set: {
                budget: Number(newBudget),
                endDate: newEndDate,
                startDate: newStartDate,
                status: newStatus,
                actualEndDate: newActualEndDate,
            }
        }, { new: true });
        console.log(newPhase);
    }
}
