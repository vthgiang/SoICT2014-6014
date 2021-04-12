const {
    Project,
    Role,
    UserRole,
    OrganizationalUnit,
    Employee,
    User,
    Salary,
} = require('../../models');
const arrayToTree = require("array-to-tree");
const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;
const { connect, } = require(`../../helpers/dbHelper`);
const { dateParse } = require(`../../helpers/functionHelper`);



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

