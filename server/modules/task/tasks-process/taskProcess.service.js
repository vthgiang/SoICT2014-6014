const { TaskProcess } = require('../../../models').schema;
const { User, Privilege, TaskTemplate } = require('../../../models/index').schema;
const mongoose = require('mongoose');

/**
 * Lấy tất cả xml diagram
 */
exports.getAllXmlDiagram = async (query) => {
    let userId = query.userId;
    let name = query.name;
    let pageNumber = query.pageNumber;
    let noResultsPerPage = query.noResultsPerPage;
    let roles = await UserRole.find({ userId: userId }).populate({ path: "roleId" });
    let newRoles = roles.map(role => role.roleId);

    // lấy tất cả các role con của role người dùng có
    let allRole = [];
    newRoles.map(item => {
        allRole = allRole.concat(item._id); //thêm id role hiện tại vào 1 mảng
        allRole = allRole.concat(item.parents); //thêm các role children vào mảng
    })
    let taskProcesses = [];
    let roleId = allRole.map(function (el) { return mongoose.Types.ObjectId(el) });

    var taskProcess = await TaskProcess.aggregate([
        { $match: { processName: { "$regex": name, "$options": "i" } } },
        {
            $lookup:
            {
                from: "privileges",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match:
                        {
                            $and: [
                                {
                                    $expr: {
                                        $eq: ["$resourceId", "$$id"]
                                    }
                                },
                                {
                                    roleId: { $in: roleId }
                                }
                            ]
                        }
                    }
                ],
                as: "privileges"
            }
        },
        { $unwind: "$privileges" },
        {
            $facet: {
                processes: [{ $sort: { 'createdAt': 1 } },
                ...noResultsPerPage === 0 ? [] : [{ $limit: noResultsPerPage * pageNumber }],
                ...noResultsPerPage === 0 ? [] : [{ $skip: noResultsPerPage * (pageNumber - 1) }]
                ],
                totalCount: [
                    {
                        $count: 'count'
                    }
                ]
            }
        }
    ])

    taskProcesses = taskProcess[0].processes;
    await TaskProcess.populate(taskProcesses, { path: 'creator', model: User, select: 'name' });

    let totalCount = 0;
    if (JSON.stringify(taskProcesses) !== JSON.stringify([])) {
        totalCount = taskProcess[0].totalCount[0].count;
    }

    let totalPages = Math.ceil(totalCount / noResultsPerPage);

    return { data: taskProcesses, pageTotal: totalPages };
}

/**
 * Lấy diagram theo id
 * @param {*} params 
 */
exports.getXmlDiagramById = (params) => {
    let data = TaskProcess.findById(params.diagramId);
    return data
}

/**
 * Tạo mới 1 xml diagram
 * @param {*} body dữ liệu diagram cần tạo
 */
exports.createXmlDiagram = async (body) => {
    let info = [];
    for (const x in body.info) {
        if (Object.keys(body.info[x]).length > 4) {
            body.info[x].taskActions = body.info[x].taskActions.map(item => {
                return {
                    name: item.name,
                    description: item.description,
                    mandatory: item.mandatory,
                }
            }),
            body.info[x].taskInformations = body.info[x].taskInformations.map((item, key) => {
                return {
                    code: "p" + parseInt(key + 1),
                    name: item.name,
                    description: item.description,
                    filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
                    type: item.type,
                    extra: item.extra,
                }
            })

            info.push(body.info[x])
        }
    }
    console.log(info)
    let data = await TaskProcess.create({
        xmlDiagram: body.xmlDiagram,
        processName: body.processName,
        processDescription: body.processDescription,
        manager: body.manager,
        viewer: body.viewer,
        infoTask: info,
        creator: body.creator,
    })


    let read = body.viewer;
    let roleId = [];
    let role, roleParent;

    role = await Role.find({ _id: { $in: read } });
    roleParent = role.map(item => item.parents);   // lấy ra các parent của các role

    let flag;
    let reads = role.map(item => item._id);     // lấy ra danh sách role có quyền xem ( thứ tự cùng với roleParent)

    for (let n in reads) {
        flag = 0;
        let parent = [];
        parent = parent.concat(roleParent[n]);
        for (let i in parent) {
            for (let j in reads) {
                if (JSON.stringify(reads[j]) === JSON.stringify(parent[i])) {  // nếu 1 role là kế thừa của role có sẵn quyền xem thì loại role đấy đi 
                    reads[n] = "";                                              // loại role
                    flag = 1;
                    roleId.push(reads[j]);                                    // thêm vào danh sách role có quyền xem
                }
            }
        }
        if (flag === 0) roleId.push(reads[n]);    // role này không là role cha của role khác => thêm vào danh sách role có quyền xem
    }

    // xử lý các role trùng lặp
    roleId = roleId.map(u => u.toString());
    for (let i = 0, max = roleId.length; i < max; i++) {
        if (roleId.indexOf(roleId[i]) != roleId.lastIndexOf(roleId[i])) {
            roleId.splice(roleId.indexOf(roleId[i]), 1);
            i--;
        }
    }
    for (let i in roleId) {
        await Privilege.create({
            roleId: roleId[i], //id của người cấp quyền xem
            resourceId: data._id,
            resourceType: "TaskProcess",
            // action: [] //quyền READ
        });
    }

    data = await TaskProcess.findById(data._id).populate({ path: 'creator', model: User, select: 'name' });
    return data;
}


/**
 * Chỉnh sửa quy trình công việc
 * @param {*} params 
 * @param {*} body dữ liệu gửi vào body từ client
 */
exports.editXmlDiagram = async (params, body) => {
    let info = [];
    for (let x in body.info) {
        console.log(body.info[x]);
        if (Object.keys(body.info[x]).length > 4) {
            body.info[x].taskActions = body.info[x].taskActions.map(item => {
                return {
                    name: item.name,
                    description: item.description,
                    mandatory: item.mandatory,
                }
            }),
                body.info[x].taskInformations = body.info[x].taskInformations.map((item, key) => {
                    return {
                        code: "p" + parseInt(key + 1),
                        name: item.name,
                        description: item.description,
                        filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
                        type: item.type,
                        extra: item.extra,
                    }
                })

            info.push(body.info[x])
        }
    }
    let data = await TaskProcess.findByIdAndUpdate(params.diagramId,
        {
            $set: {
                xmlDiagram: body.xmlDiagram,
                infoTask: info,
                processDescription: body.processDescription,
                processName: body.processName,
                creator: body.creator,
                viewer: body.viewer,
                manager: body.manager,
            }
        }
    )

    let queryData = {
        userId: body.userId,
        name: body.name,
        pageNumber: body.pageNumber,
        noResultsPerPage: body.noResultsPerPage,
    }
    let data1 = await this.getAllXmlDiagram(queryData);
    console.table(data1);
    // let data1 = await TaskProcess.find().populate({ path: 'creator', model: User, select: 'name' });
    return data1;
}

/**
 * Xóa diagram theo id { data: taskProcesses, pageTotal: totalPages };
 * @param {ObjectId} diagramId 
 */
exports.deleteXmlDiagram = async (diagramId, query) => {
    await TaskProcess.findOneAndDelete({
        _id: diagramId,
    });
    await Privilege.findOneAndDelete({ resourceId: diagramId, resourceType: "TaskProcess" })

    let queryData = {
        userId: query.userId,
        name: query.name,
        // pageNumber : query.pageNumber,
        pageNumber: 1,
        noResultsPerPage: query.noResultsPerPage,
    }

    let data = await this.getAllXmlDiagram(queryData);
    console.table(data);
    return data;
}


/**
 * 
 */
exports.createTaskByProcess = async (processId, body) => {
    console.log('----', body);
    let data = body.taskList;
    // let startDate = body.startDate;
    // let endDate = body.endDate;
    let level;

    let splitter = body.startDate.split("-");
    let startDateProcess = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    splitter = body.endDate.split("-");
    let endDateProcess = new Date(splitter[2], splitter[1] - 1, splitter[0]);

    for (let i in data) {
        let taskInformations, taskActions, cloneActions = [];

        let splitter = data[i].startDate.split("-");
        let startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        splitter = data[i].endDate.split("-");
        let endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);

        // if (data[i].taskTemplate !== "") {
        taskInformations = data[i].taskInformations;
        taskActions = data[i].taskActions;

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name: taskActions[i].name,
                description: taskActions[i].description,
            }
        }
        // }

        let process = {
            processId: processId,
            followingTask: [],
            precedingTask: [],
        }
        await Task.create({
            process: process,
            organizationalUnit: data[i].organizationalUnit,
            creator: data[i].creator, //id của người tạo
            name: data[i].name,
            description: data[i].description,
            startDate: startDate,
            endDate: endDate,
            priority: data[i].priority,
            taskTemplate: null,
            taskInformations: taskInformations,
            taskActions: cloneActions,
            parent: null,
            level: 1,
            responsibleEmployees: data[i].responsibleEmployees,
            accountableEmployees: data[i].accountableEmployees,
            consultedEmployees: data[i].consultedEmployees,
            informedEmployees: data[i].informedEmployees,
        });
    }
    await TaskProcess.findByIdAndUpdate(processId, { $inc: { 'numberOfUse': 1 } }, { new: true });
    return await TaskProcess.find().populate({ path: 'creator', model: User, select: 'name' });;
}