const { TaskProcess, ProcessTemplate, Privilege, Role, Task, UserRole, User, OrganizationalUnit,TaskDistribution,PertEstimation } = require(`../../../models`);

const TaskService = require(`../task-management/task.service`);
const { connect } = require(`../../../helpers/dbHelper`);
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const NotificationServices = require(`../../notification/notification.service`)

/**
 * Lấy tất cả xml diagram
 * @param {Object} query tham số query gửi đến
 */
exports.getAllXmlDiagram = async (portal, query) => {
    let userId = query.userId;
    let name = query.name;
    let pageNumber = query.pageNumber ? query.pageNumber : 1;
    let noResultsPerPage = query.noResultsPerPage ? query.noResultsPerPage : 10;
    let roles = await UserRole(connect(DB_CONNECTION, portal)).find({ userId: userId }).populate({ path: "roleId" });
    let newRoles = roles.map(role => role.roleId);

    // lấy tất cả các role con của role người dùng có
    let allRole = [];
    newRoles.map(item => {
        allRole = allRole.concat(item._id); //thêm id role hiện tại vào 1 mảng
        allRole = allRole.concat(item.parents); //thêm các role children vào mảng
    })
    let taskProcesses = [];
    let roleId = allRole.map(function (el) { return mongoose.Types.ObjectId(el) });

    var taskProcess = await ProcessTemplate(connect(DB_CONNECTION, portal)).aggregate([
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
        // { $unwind: "$privileges" },
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

    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: 'creator', select: 'name' });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: 'manager', select: 'name' });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: 'viewer', select: 'name' });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: "tasks.organizationalUnit tasks.collaboratedWithOrganizationalUnits" });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: "tasks.fastest.task",populate:[{path:"responsibleEmployees"}] });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: "tasks.responsibleEmployees tasks.accountableEmployees tasks.consultedEmployees tasks.informedEmployees tasks.confirmedByEmployees tasks.creator", select: "name email _id" });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: 'processTemplates.process' });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(taskProcesses, { path: 'listProcess', select: 'name startDate endDate' });

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
exports.getXmlDiagramById = async (portal, params) => {
    let data = await ProcessTemplate(connect(DB_CONNECTION, portal)).findById(params.diagramId);
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(data, { path: 'creator', select: 'name' });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(data, { path: 'manager', select: 'name' });
    await ProcessTemplate(connect(DB_CONNECTION, portal)).populate(data, { path: 'viewer', select: 'name' });
    return data
}

/**
 * Tạo mới 1 xml diagram
 * @param {*} body dữ liệu diagram cần tạo
 */
exports.createXmlDiagram = async (portal, body) => {
    let info = [];
    let processTemplates = [];
    let classMap = new Map();
    let mostLikelyMap = new Map();
    for (const x in body.info) {
        // lưu các giá trị class
        if(body.info[x].class!=undefined){
            classMap.set(body.info[x].code,parseInt(body.info[x].class))
        }else{
            classMap.set(body.info[x].code,1)
        }
        // Tạo mostlikely cho bảng estimate pert
        if(body.info[x].numberOfDaysTaken!=undefined&&body.info[x].numberOfDaysTaken!=null){
            console.log(' number of taksen',body.info[x].numberOfDaysTaken)
            mostLikelyMap.set(body.info[x].code,parseInt(body.info[x].numberOfDaysTaken)+0.5)
        }else{
            console.log('null number of taksen')
            mostLikelyMap.set(body.info[x].code,5)
        }
        body.info[x].taskActions = (body.info[x].taskActions) ? body.info[x].taskActions.map(item => {
            return {
                name: item.name,
                description: item.description,
                mandatory: item.mandatory,
            }
        }) : [];
        body.info[x].taskInformations = (body.info[x].taskInformations) ? body.info[x].taskInformations.map((item, key) => {
            return {
                code: "p" + parseInt(key + 1),
                name: item.name,
                description: item.description,
                filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
                type: item.type,
                extra: item.extra,
            }
        }) : [];
        if (body.info[x].formula === '') {
            body.info[x].formula = "progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100"
        }
        info.push(body.info[x])
    }
    for (const x in body.infoTemplate) {
        // console.log(body.infoTemplate[x]);
        processTemplates.push({
            process: body.infoTemplate[x]._id,
            code: body.infoTemplate[x].code,
            followingTasks: body.infoTemplate[x].followingTasks,
            preceedingTasks: body.infoTemplate[x].preceedingTasks
        })
    }
    let data = await ProcessTemplate(connect(DB_CONNECTION, portal)).create({
        xmlDiagram: body.xmlDiagram,
        processName: body.processName,
        processDescription: body.processDescription,
        manager: body.manager,
        viewer: body.viewer,
        tasks: info,
        processTemplates: processTemplates,
        creator: body.creator,
    })


    let read = body.viewer;
    let roleId = [];
    let role, roleParent;

    role = await Role(connect(DB_CONNECTION, portal)).find({ _id: { $in: read } });
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
        await Privilege(connect(DB_CONNECTION, portal)).create({
            roleId: roleId[i], //id của người cấp quyền xem
            resourceId: data._id,
            resourceType: "ProcessTemplate",
            // action: [] //quyền READ
        });
    }

    data = await ProcessTemplate(connect(DB_CONNECTION, portal)).findById(data._id).populate([
        { path: 'creator', select: 'name email' },
        { path: 'manager', select: 'name email' },
        { path: 'viewer', select: 'name email' },
        { path: 'processTemplates.process' },
        { path: "tasks.organizationalUnit tasks.collaboratedWithOrganizationalUnits", },
        { path: "tasks.responsibleEmployees tasks.accountableEmployees tasks.consultedEmployees tasks.informedEmployees tasks.confirmedByEmployees tasks.creator", select: "name email _id" },
    ]);
    // Update for analysis
    // console.log(classMap)
    // Tạo TaskDistribution từ ProcessTempalte
    let process = await ProcessTemplate(connect(DB_CONNECTION, portal)).findById(data._id).populate('tasks')
    let tasks = []
    try{
        if (process.tasks != undefined && process.tasks.length != 0) {
            let count = 0

            for (let task of process.tasks) {
                let className = classMap.get(task.code)
                let mos = mostLikelyMap.get(task.code)
                console.log('mos',mos)
                console.log('taskCode',task.code)

                await PertEstimation(connect(DB_CONNECTION,portal)).create(
                    {
                        taskID: task.code,
                        opt: mos - mos/2,
                        mos:mos,
                        pes: mos+mos/2
                    }
                )

                tasks = [
                    ...tasks,
                    {
                        taskID: task.code,
                        name: task.name,
                        description: task.description,
                        riskTaskCPT: [],
                        childList: task == process.tasks[process.tasks.length - 1] ? [] : task.followingTasks.map(t => t.task),
                        parentList: task == process.tasks[0] ? [] : task.preceedingTasks.map(t => t.task),
                        class: className
                    }
                ]
                count++;
            }

        }
        await TaskDistribution(connect(DB_CONNECTION,portal)).create({
            processName: process.processName,
            processDescription: process.processDescription,
            tasks: tasks
        })
    }catch(er){
        console.log(e)
    }

    return data;
}


/**
 * Chỉnh sửa quy trình công việc
 * @param {*} params 
 * @param {*} body dữ liệu gửi vào body từ client
 */
exports.editXmlDiagram = async (portal, params, body) => {
    let info = [];
    let processTemplates = [];
    for (let x in body.info) {
        if (Object.keys(body.info[x]).length > 4) {
            body.info[x].taskActions = (body.info[x].taskActions) ? body.info[x].taskActions.map(item => {
                return {
                    name: item.name,
                    description: item.description,
                    mandatory: item.mandatory,
                }
            }) : [];
            body.info[x].taskInformations = (body.info[x].taskInformations) ? body.info[x].taskInformations.map((item, key) => {
                return {
                    code: "p" + parseInt(key + 1),
                    name: item.name,
                    description: item.description,
                    filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
                    type: item.type,
                    extra: item.extra,
                }
            }) : [];

            info.push(body.info[x])
        }
    }
    for (const x in body.infoTemplate) {
        processTemplates.push({
            process: body.infoTemplate[x].process,
            code: body.infoTemplate[x].code,
            followingTasks: body.infoTemplate[x].followingTasks,
            preceedingTasks: body.infoTemplate[x].preceedingTasks
        })
    }
    let data = await ProcessTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(params.diagramId,
        {
            $set: {
                xmlDiagram: body.xmlDiagram,
                tasks: info,
                processDescription: body.processDescription,
                processTemplates: processTemplates,
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
    let data1 = await this.getAllXmlDiagram(portal, queryData);
    // let data1 = await ProcessTemplate(connect(DB_CONNECTION, portal)).find().populate({ path: 'creator', select: 'name' });
    return data1;
}

/**
 * Xóa diagram theo id { data: taskProcesses, pageTotal: totalPages };
 * @param {ObjectId} diagramId 
 */
exports.deleteXmlDiagram = async (portal, diagramId, query) => {
    await ProcessTemplate(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: diagramId,
    });
    await Privilege(connect(DB_CONNECTION, portal)).findOneAndDelete({ resourceId: diagramId, resourceType: "ProcessTemplate" })

    let queryData = {
        userId: query.userId,
        name: query.name,
        // pageNumber : query.pageNumber,
        pageNumber: 1,
        noResultsPerPage: query.noResultsPerPage,
    }

    let data = await this.getAllXmlDiagram(portal, queryData);
    return data;
}
exports.deleteTaskProcess = async (portal, taskProcessId, query) => {
    // console.log(taskProcessId);

    // await Privilege(connect(DB_CONNECTION, portal)).findOneAndDelete({ resourceId: diagramId, resourceType: "ProcessTemplate" })
    await TaskProcess(connect(DB_CONNECTION, portal)).findById(taskProcessId, (error, data1) => {
        // console.log(data1);
        data1.tasks.forEach(value => {
            // console.log(value);
            Task(connect(DB_CONNECTION, portal)).findByIdAndRemove(value, (error, data2) => {
                // console.log(data2);
            })
        })
    })
    await TaskProcess(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: taskProcessId,
    });
    let queryData = {
        userId: query.userId,
        name: query.name,
        pageNumber: query.pageNumber,
        // pageNumber: 1,
        noResultsPerPage: query.noResultsPerPage,
    }

    let data = await this.getAllTaskProcess(portal, queryData);
    return data;
}


isStartTask = (task) => {
    let preTask = task.preceedingTasks;
    for (let i in preTask) {
        let type = preTask[i].task ? preTask[i].task.split("_") : ["1"];
        if (type[0] === "Event") {
            return true;
        }
    }
    return false;
}

/**
 * lấy process theo id
 * @param {String} processId Id của quy trình
 */
exports.getProcessById = async (portal, params) => {
    let data = await TaskProcess(connect(DB_CONNECTION, portal)).findById(params.processId);
    await TaskProcess(connect(DB_CONNECTION, portal)).populate(data, { path: 'creator', select: 'name' });
    await TaskProcess(connect(DB_CONNECTION, portal)).populate(data, { path: 'manager', select: 'name' });
    await TaskProcess(connect(DB_CONNECTION, portal)).populate(data, { path: 'viewer', select: 'name' });
    await TaskProcess(connect(DB_CONNECTION, portal)).populate(data, {
        path: 'tasks', populate: [
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit", },
            { path: "collaboratedWithOrganizationalUnits", },
            { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id" },
            { path: "evaluations.results.employee", select: "name email _id" },
            { path: "evaluations.results.organizationalUnit", select: "name _id" },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: 'name email avatar' },
            { path: "taskActions.comments.creator", select: 'name email avatar' },
            { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
            { path: "taskComments.creator", select: 'name email avatar' },
            { path: "taskComments.comments.creator", select: 'name email avatar' },
            { path: "documents.creator", select: 'name email avatar' },
            { path: "process" },
        ]
    });
    await TaskProcess(connect(DB_CONNECTION, portal)).populate(data, { path: 'processChilds' });
    return data
}
/**
 * tạo công việc theo quy trình
 * @param {String} processId Id của quy trình
 * @param {Object} body dữ liệu từ body
 */
exports.createTaskByProcess = async (portal, processId, body) => {
    let data = body.taskList;
    let dataProcess = body.processList;
    let level;
    let newTaskItem
    let splitter = body.startDate.split("-");
    let startDateProcess = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    splitter = body.endDate.split("-");
    let endDateProcess = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let newTaskProcess
    if (processId !== undefined && processId !== null && processId !== "undefined") {
        newTaskProcess = await TaskProcess(connect(DB_CONNECTION, portal)).create({
            processTemplate: processId,
            xmlDiagram: body.xmlDiagram,
            processName: body.processName,
            processDescription: body.processDescription,
            startDate: startDateProcess,
            endDate: endDateProcess,
            creator: body.creator,
            viewer: body.viewer,
            manager: body.manager,
            officeHours: body.officeHours,
            convertDayToHour: body.convertDayToHour,
        })
    } else {
        newTaskProcess = await TaskProcess(connect(DB_CONNECTION, portal)).create({
            xmlDiagram: body.xmlDiagram,
            processName: body.processName,
            processDescription: body.processDescription,
            startDate: startDateProcess,
            endDate: endDateProcess,
            creator: body.creator,
            viewer: body.viewer,
            manager: body.manager,
            officeHours: body.officeHours,
            convertDayToHour: body.convertDayToHour
        })
    }

    let listTask = [];
    let listProcess = [];
    let mailInfoArr = [];
    let taskProcessId = newTaskProcess._id;
    // random number for analysis
    let rand = await TaskProcess(connect(DB_CONNECTION, portal)).find()
    rand = rand.length
    let check = true
    // let rand = Math.floor(Math.random() * 10);
    console.log(rand)
    let endDatePrev = new Date()
    for (let i in data) {
        let taskInformations, taskActions, cloneActions = [];

        let splitter = data[i].startDate.split("-");
        let startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        splitter = data[i].endDate.split("-");
        let endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        taskInformations = data[i].taskInformations;
        taskActions = data[i].taskActions;

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name: taskActions[i].name,
                description: taskActions[i].description,
            }
        }
        let status = "wait_for_approval";
        let actualStartDate =null
        if (isStartTask(data[i])) {
            status = "inprocess";
            actualStartDate = new Date();
        }
        let formula = data[i].formula;
        if (data[i].formula === '') {
            formula = "progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100";
            // formula = "progress / (daysUsed / totalDays) - 0.5 * (10 - (averageActionRating)) * 10";
        }
        let collaboratedWithOrganizationalUnits = data[i].collaboratedWithOrganizationalUnits.map(item => { return { "organizationalUnit": item } })
        let process = taskProcessId;
        //Ngày cuối của task trước là ngày đầu của task sau
        if (check != true) {
            startDate = endDatePrev
        }

        console.log('startDate', startDate)
        endDate = new Date(startDate)
        endDate.setTime(endDate.getTime() + data[i].numberOfDaysTaken * 24 * 3600 * 1000)
        // if (rand % 2 == 0) {
        //     endDate.setTime(endDate.getTime() + data[i].numberOfDaysTaken / 2 * 24 * 3600 * 1000)
        // } else {
        //     endDate.setTime(endDate.getTime() + (data[i].numberOfDaysTaken + 0.5) / 2 * 24 * 3600 * 1000)
        // }
        endDatePrev = endDate
        console.log('endDatePrve', endDatePrev)
        check = false
        newTaskItem = await Task(connect(DB_CONNECTION, portal)).create({
            process: process,
            codeInProcess: data[i].code,
            numberOfDaysTaken: data[i].numberOfDaysTaken,
            organizationalUnit: data[i].organizationalUnit,
            collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits,
            creator: body.creator, //id của người tạo
            name: data[i].name,
            description: data[i].description,
            startDate: startDate,
            endDate: endDate,
            actualStartDate:actualStartDate?actualStartDate:null,
            formula: formula,
            priority: data[i].priority,
            taskTemplate: null,
            taskInformations: taskInformations,
            taskActions: cloneActions,
            taskOutputs: data[i].taskOutputs,
            parent: null,
            level: 1,
            status: status,
            responsibleEmployees: data[i].responsibleEmployees,
            accountableEmployees: data[i].accountableEmployees,
            consultedEmployees: data[i].consultedEmployees,
            informedEmployees: data[i].informedEmployees,
            confirmedByEmployees: data[i].responsibleEmployees.concat(data[i].accountableEmployees).concat(data[i].consultedEmployees).includes(data[i].creator) ? data[i].creator : []
        });
        let x = await TaskService.sendEmailForCreateTask(portal, newTaskItem);
        mailInfoArr.push(x);
        listTask.push(newTaskItem._id);
    }
    for (let i in dataProcess) {
        let processChild = dataProcess[i].process
        let splitterProcessChild = processChild.startDate.split("-");
        let startDateProcessChild = new Date(splitterProcessChild[2], splitterProcessChild[1] - 1, splitterProcessChild[0]);
        splitterProcessChild = processChild.endDate.split("-");
        let endDateProcessChild = new Date(splitterProcessChild[2], splitterProcessChild[1] - 1, splitterProcessChild[0]);
        let item = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ _id: dataProcess[i].process._id });
        if (item) {
            await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(dataProcess[i].process._id, { $set: { codeInProcess: dataProcess[i].code, processTemplate: processChild._id } }, { new: true });
            listProcess.push(item._id);
        } else {
            let newTaskProcess1 = await TaskProcess(connect(DB_CONNECTION, portal)).create({
                // processTemplate: processId ? processId : null,
                xmlDiagram: processChild.xmlDiagram,
                processName: processChild.processName,
                processDescription: processChild.processDescription,
                startDate: startDateProcessChild,
                endDate: endDateProcessChild,
                creator: processChild.creator,
                viewer: processChild.viewer,
                manager: processChild.manager,
                status: "not_initialized",
                codeInProcess: dataProcess[i].code,
                processTemplate: processChild._id,
                processParent: taskProcessId,
                officeHours: body.officeHours,
                convertDayToHour: body.convertDayToHour
            })
            const dataNotification = {
                organizationalUnits: [],
                title: `Cần khởi tạo công việc cho quy trình ${processChild.processName}`,
                level: "emergency",
                content: `<p> khởi tạo công việc cho quy trình ${processChild.processName} , <a href="${process.env.WEBSITE}process?processId=${newTaskProcess1._id}" target="blank>Xem ngay</a></p>`,
                sender: `${processChild.creator.name}`,
                users: processChild.manager,
                associatedDataObject: {
                    dataType: 6,
                    description: `<p><strong>khởi tạo công việc cho quy trình ${processChild.processName}.</p>`
                }
            };
            NotificationServices.createNotification(portal, portal, dataNotification)
            await ProcessTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(processChild._id, { $inc: { 'numberOfUse': 1 }, $push: { "listProcess": newTaskProcess1._id } }, { new: true });
            listProcess.push(newTaskProcess1._id);
        }
    }
    for (let x in data) {
        let listFollowingTask = [];
        let listPreceedingTask = [];
        for (let i in data[x].followingTasks) {
            let item = await Task(connect(DB_CONNECTION, portal)).findOne({ process: taskProcessId, codeInProcess: data[x].followingTasks[i].task });
            if (item) {
                if (item.status === "inprocess") {
                    listFollowingTask.push({
                        task: item._id,
                        link: data[x].followingTasks[i].link,
                        activated: true,
                    })
                }
                else {
                    listFollowingTask.push({
                        task: item._id,
                        link: data[x].followingTasks[i].link,
                    })
                }

            } else {
                item = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ processParent: taskProcessId, codeInProcess: data[x].followingTasks[i].task });
                if (item) {
                    if (item.status === "inprocess") {

                        listFollowingTask.push({
                            task: item._id,
                            link: data[x].followingTasks[i].link,
                            activated: true,
                        })
                    }
                    else {
                        listFollowingTask.push({
                            task: item._id,
                            link: data[x].followingTasks[i].link,
                        })
                    }

                }
            }
        }
        for (let i in data[x].preceedingTasks) {
            let item = await Task(connect(DB_CONNECTION, portal)).findOne({ process: taskProcessId, codeInProcess: data[x].preceedingTasks[i].task });

            if (item) {
                listPreceedingTask.push({
                    task: item._id,
                    link: data[x].preceedingTasks[i].link,
                })
            } else {
                item = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ processParent: taskProcessId, codeInProcess: data[x].preceedingTasks[i].task });
                if (item) {
                    listPreceedingTask.push({
                        task: item._id,
                        link: data[x].preceedingTasks[i].link,
                    })
                }
            }

        }
        await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
            { process: taskProcessId, codeInProcess: data[x].code },
            {
                $set: {
                    followingTasks: listFollowingTask,
                    preceedingTasks: listPreceedingTask,
                }
            },
            { new: true }
        )
    }
    for (let x in dataProcess) {
        let listFollowingProcess = [];
        let listPreceedingProcess = [];
        for (let i in dataProcess[x].followingTasks) {
            // console.log(dataProcess[x].followingTasks[i].task);
            let item = await Task(connect(DB_CONNECTION, portal)).findOne({ process: taskProcessId, codeInProcess: dataProcess[x].followingTasks[i].task });
            if (item) {
                if (item.status === "inprocess") {
                    listFollowingProcess.push({
                        task: item._id,
                        link: dataProcess[x].followingTasks[i].link,
                        activated: true,
                    })
                }
                else {
                    listFollowingProcess.push({
                        task: item._id,
                        link: dataProcess[x].followingTasks[i].link,
                    })
                }
            } else {
                item = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ processParent: taskProcessId, codeInProcess: dataProcess[x].followingTasks[i].task });
                if (item) {
                    if (item.status === "inprocess") {
                        listFollowingProcess.push({
                            task: item._id,
                            link: dataProcess[x].followingTasks[i].link,
                            activated: true,
                        })
                    }
                    else {
                        listFollowingProcess.push({
                            task: item._id,
                            link: dataProcess[x].followingTasks[i].link,
                        })
                    }

                }
            }
        }
        for (let i in dataProcess[x].preceedingTasks) {
            let item = await Task(connect(DB_CONNECTION, portal)).findOne({ process: taskProcessId, codeInProcess: dataProcess[x].preceedingTasks[i].task });
            if (item) {
                listPreceedingProcess.push({
                    task: item._id,
                    link: dataProcess[x].preceedingTasks[i].link,
                })
            } else {
                item = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ processParent: taskProcessId, codeInProcess: dataProcess[x].preceedingTasks[i].task });
                if (item) {
                    listPreceedingProcess.push({
                        task: item._id,
                        link: dataProcess[x].preceedingTasks[i].link,
                    })
                }
            }

        }
        await TaskProcess(connect(DB_CONNECTION, portal)).findOneAndUpdate(
            { processParent: taskProcessId, codeInProcess: dataProcess[x].code },
            {
                $set: {
                    followingTasks: listFollowingProcess,
                    preceedingTasks: listPreceedingProcess,
                }
            },
            { new: true }
        )
    }
    if (processId !== "undefined") {
        await ProcessTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(processId, { $inc: { 'numberOfUse': 1 }, $push: { "listProcess": taskProcessId } }, { new: true });
    }
    let newProcess = await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(taskProcessId, { $set: { tasks: listTask, processChilds: listProcess } }, { new: true })
        .populate([
            { path: 'creator', select: 'name' },
            // { path: 'viewer', select: 'name' },
            { path: 'manager', select: 'name' },
            {
                path: 'tasks', populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", },
                    { path: "collaboratedWithOrganizationalUnits", },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                ]
            },
            { path: 'processTemplate', select: 'processName' },
        ]);
    let myProcess = await ProcessTemplate(connect(DB_CONNECTION, portal)).find().populate([
        { path: 'creator', select: 'name' },
        { path: 'viewer', select: 'name' },
        { path: 'manager', select: 'name' },
        { path: "tasks.organizationalUnit tasks.collaboratedWithOrganizationalUnits", },
        { path: "tasks.responsibleEmployees tasks.accountableEmployees tasks.consultedEmployees tasks.informedEmployees tasks.confirmedByEmployees tasks.creator", select: "name email _id" },
    ]);;
    if (body.template === false) {
        return { process: newProcess, newTask: newTaskItem, mailInfo: mailInfoArr }
    } else {
        return { process: myProcess, newTask: newTaskItem, mailInfo: mailInfoArr }
    }
}

/**
 * lấy tất cả các quy trình công việc được tạo
 * @param {Object} query Dữ liệu query
 */
exports.getAllTaskProcess = async (portal, query) => {
    // let { name, noResultsPerPage, pageNumber } = query;
    let name = query.name;
    let noResultsPerPage = parseInt(query.noResultsPerPage);
    let pageNumber = parseInt(query.pageNumber);
    let userId = query.userId;
    let currentRole = query.currentRole;

    let data = await TaskProcess(connect(DB_CONNECTION, portal)).find({
        processName: { $regex: name, $options: 'i' },
        status: { $ne: "finished" },
        $or: [
            { viewer: { $in: [userId] } },
            { manager: { $in: [userId] } },
            { viewer: { $in: [currentRole] } },
            { manager: { $in: [currentRole] } },
        ]
    }).skip(noResultsPerPage * (pageNumber - 1)).limit(noResultsPerPage)
        .populate([
            { path: 'creator', select: 'name' },
            // { path: 'viewer', select: 'name' },
            { path: 'manager', select: 'name' },
            {
                path: 'tasks', populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", },
                    { path: "collaboratedWithOrganizationalUnits", },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                ]
            },
            { path: 'processTemplate', select: 'processName' },
        ]);
    let myProcess = await ProcessTemplate(connect(DB_CONNECTION, portal)).find().populate([
        { path: 'creator', select: 'name' },
        { path: 'viewer', select: 'name' },
        { path: 'manager', select: 'name' },
        { path: "tasks.organizationalUnit tasks.collaboratedWithOrganizationalUnits", },
        { path: "tasks.responsibleEmployees tasks.accountableEmployees tasks.consultedEmployees tasks.informedEmployees tasks.confirmedByEmployees tasks.creator", select: "name email _id" },
    ]);
    if (body.template === false) {
        return { process: newProcess, newTask: newTaskItem, mailInfo: mailInfoArr }
    } else {
        return { process: myProcess, newTask: newTaskItem, mailInfo: mailInfoArr }
    }
}

/**
 * lấy tất cả các quy trình công việc được tạo
 * @param {Object} query Dữ liệu query
 */
exports.getAllTaskProcess = async (portal, query) => {
    // let { name, noResultsPerPage, pageNumber } = query;
    let name = query.name;
    let noResultsPerPage = parseInt(query.noResultsPerPage);
    let pageNumber = parseInt(query.pageNumber);
    let userId = query.userId;
    let currentRole = query.currentRole;
    let startDate = query.startDate;
    let endDate = query.endDate;
    let processTemplate = query.processTemplate
    let start, end, filterDate, startTime, endTime;
    if (startDate && endDate) {
        // startTime = startDate.split("-");
        // start = new Date(startTime[1], startTime[0] - 1);
        // // Convert endDate từ string sang date
        // endTime = endDate.split("-");
        // end = new Date(endTime[1], endTime[0] - 1);
        endTime = new Date(endDate);
        endTime.setMonth(endTime.getMonth() + 1);
        // filterDate = {
        //     $match: {
        //         endDate: { $gte: start, $lte: end }
        //     },
        //     $match: {
        //         startDate: { $gte: start, $lte: end }
        //     }
        // }
    }
    let filter = {
        processName: { $regex: name, $options: 'i' },
        $or: [
            { viewer: { $in: [userId] } },
            { manager: { $in: [userId] } },
            { viewer: { $in: [currentRole] } },
            { manager: { $in: [currentRole] } },
        ]
    }
    if (startDate && endDate && processTemplate) {
        filter = {
            processName: { $regex: name, $options: 'i' },
            endDate: { $gte: new Date(startDate), $lte: new Date(endTime) },
            startDate: { $gte: new Date(startDate), $lte: new Date(endTime) },
            // processTemplate: processTemplate,
            $or: [
                { viewer: { $in: [userId] } },
                { manager: { $in: [userId] } },
                { viewer: { $in: [currentRole] } },
                { manager: { $in: [currentRole] } },
            ]
        }
    }

    if (startDate && endDate) {
        filter = {
            processName: { $regex: name, $options: 'i' },
            endDate: { $gte: new Date(startDate), $lte: new Date(endTime) },
            startDate: { $gte: new Date(startDate), $lte: new Date(endTime) },
            $or: [
                { viewer: { $in: [userId] } },
                { manager: { $in: [userId] } },
                { viewer: { $in: [currentRole] } },
                { manager: { $in: [currentRole] } },
            ]
        }
    }

    let data = await TaskProcess(connect(DB_CONNECTION, portal)).find(filter).skip(noResultsPerPage * (pageNumber - 1)).limit(noResultsPerPage)
        .populate([
            { path: 'creator', select: 'name' },
            { path: 'viewer', select: 'name' },
            { path: 'manager', select: 'name' },
            {
                path: 'tasks', populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", },
                    { path: "collaboratedWithOrganizationalUnits", },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                ]
            },
            { path: 'processTemplate' },
            { path: 'processTemplate', populate: { path: 'processTemplates.process' } },
            { path: 'processParent', select: 'processName' },
            { path: 'processChilds', populate: [
                { path: 'creator', select: 'name' },
                { path: 'viewer', select: 'name' },
                { path: 'manager', select: 'name' }]}
        ]);


    let totalCount = await TaskProcess(connect(DB_CONNECTION, portal)).countDocuments({
        processName: { $regex: name, $options: 'i' },
        $or: [
            { viewer: { $in: [userId] } },
            { manager: { $in: [userId] } },
        ]
    });
    let totalPages = Math.ceil(totalCount / noResultsPerPage);
    return {
        data: data,
        pageTotal: totalPages
    }
}


/**
 * Cập nhật diagram
 * @param {String} params tham số 
 * @param {Object} body dữ liệu body
 */
exports.updateDiagram = async (portal, params, body) => {
    let diagram = await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(params.processId,
        { $set: { xmlDiagram: body.diagram } },
        { new: true }
    )
    let data = await TaskProcess(connect(DB_CONNECTION, portal)).find({
        processName: { $regex: name, $options: 'i' },
        $or: [
            { viewer: { $in: [userId] } },
            { manager: { $in: [userId] } },
        ]
    }).skip(0).limit(5)
        .populate([
            { path: 'creator', select: 'name' },
            // { path: 'viewer', select: 'name' },
            { path: 'manager', select: 'name' },
            {
                path: 'tasks', populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit collaboratedWithOrganizationalUnits", },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                ]
            },
            { path: 'processTemplate', select: 'processName' },
        ]);


    let totalCount = await TaskProcess(connect(DB_CONNECTION, portal)).countDocuments({
        processName: { $regex: name, $options: 'i' },
        $or: [
            { viewer: { $in: [userId] } },
            { manager: { $in: [userId] } },
        ]
    });
    let totalPages = Math.ceil(totalCount / 5);
    return {
        data: data,
        pageTotal: totalPages
    }
}

convertT = (actualStartDate, actualEndDate, convertDayToHour, officeHours, cv) => {
    let day1 = new Date(actualEndDate);
    let day2 = new Date(actualStartDate);
    let totalTime1 = 0;
    let totalTime2 = 0;
    convertDayToHour = parseFloat(convertDayToHour);
    let days = 0;
    if (officeHours.length !== 0) {
        //totalTime2 = props.dataTaskProcess[j].convertDayToHour;
        officeHours.forEach(value => {
            let arrayAdministrativeStartTime = value.startTime.split(" ");
            arrayAdministrativeStartTime = arrayAdministrativeStartTime[0].split(":").concat(arrayAdministrativeStartTime[1]);
            if (arrayAdministrativeStartTime[2] === "PM") {
                arrayAdministrativeStartTime[0] = parseInt(arrayAdministrativeStartTime[0]) + 12
            }
            let arrayAdministrativeEndTime = value.endTime.split(" ");
            arrayAdministrativeEndTime = arrayAdministrativeEndTime[0].split(":").concat(arrayAdministrativeEndTime[1]);
            if (arrayAdministrativeEndTime[2] === "PM") {
                arrayAdministrativeEndTime[0] = parseInt(arrayAdministrativeEndTime[0]) + 12
            }
            if (day2.getHours() * 60 + day2.getMinutes() < arrayAdministrativeStartTime[0] * 60 + parseInt(arrayAdministrativeStartTime[1])) {
                totalTime1 = totalTime1 + (arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1]) - arrayAdministrativeStartTime[0] * 60 - parseInt(arrayAdministrativeStartTime[1])) / 60;
            } else if (day2.getHours() * 60 + day2.getMinutes() < arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1])) {
                totalTime1 = totalTime1 + (arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1]) - day2.getHours() * 60 - day2.getMinutes()) / 60;
            }
            if (day1.getHours() * 60 + day1.getMinutes() < arrayAdministrativeStartTime[0] * 60 + parseInt(arrayAdministrativeStartTime[1])) {
                totalTime2 = totalTime2 + 0;
            } else if (day1.getHours() * 60 + day1.getMinutes() < arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1])) {
                totalTime2 = totalTime2 + (day1.getHours() * 60 + day1.getMinutes() - arrayAdministrativeStartTime[0] * 60 - parseInt(arrayAdministrativeStartTime[1])) / 60;
            } else {
                totalTime2 = totalTime2 + (arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1]) - arrayAdministrativeStartTime[0] * 60 - parseInt(arrayAdministrativeStartTime[1])) / 60;
            }
        })
        day1.setHours(0);
        day1.setMinutes(0);
        day2.setDate(day2.getDate() + 1)
        day2.setHours(0);
        day2.setMinutes(0)
        var difference = Math.abs(day1 - day2);
        days = difference / (1000 * 3600)
        days = parseInt(days / 24) * convertDayToHour + totalTime1 + totalTime2;
        switch (cv) {
            case "days":
                days = days / convertDayToHour
                days = Math.round(days * 100) / 100
                break;
            case "hours":
                days = Math.round(days * 100) / 100
                break;
            case "weeks":
                days = days / (convertDayToHour * 7)
                days = Math.round(days * 100) / 100
                break;
            case "months":
                days = days / (convertDayToHour * 7 * 30)
                break;
            default:
            // code block
        }
        // if ((days - d1 *24) >10){
        //     days = d1 * props.dataTaskProcess[j].convertDayToHour +(days - d1 *24) + props.dataTaskProcess[j].convertDayToHour -24
        // } else {
        //     days = d1 * props.dataTaskProcess[j].convertDayToHour + (days - d1 *24)
        // }

        // days = Math.round(days * 100) / 100
    }
    return days;
}
/**
 * Cập nhật thông tin quy trình công việc
 * @param {String} params tham số 
 * @param {Object} body dữ liệu body
 */
exports.editProcessInfo = async (portal, params, body) => {
    // console.log(body);
    // if (body)
    if (body.start) {
        const item = await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(body.id, {
            $set: {
                status: "inprocess",
                actualStartDate:new Date(body.startTime)
            }
        }, (error, data) => {
            // if (error) console.log(error) ;
            // if (data) console.log(data);
        })
        
        
    } else if (body.finished) {
        const item = await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(body.id, {
            $set: {
                status: "finished",
                actualEndDate:new Date(body.endTime)
            }
        }, (error, data) => {
            // if (error) console.log(error) ;
            // if (data) console.log(data);
        })
            .populate([
                {
                    path: 'tasks',
                },
            ]);
        if (item.processTemplate) {
            let itemProcessTemplate = await ProcessTemplate(connect(DB_CONNECTION, portal)).findById(item.processTemplate)
            // .populate([
            // {
            //     path: 'tasks', populate: [
            //         { path: "fastest"},
            //         { path: "slowest"}
            //     ]
            // },
            // ]);
            // console.log(itemProcessTemplate.tasks[0].fastest);
            let listTaskProcessT = itemProcessTemplate.tasks
            let listTaskProcess = item.tasks
            // console.log(listTaskProcess[0].actualStartDate,listTaskProcess[0].actualEndDate,item.convertDayToHour,item.officeHours,"hours");
            for (let x = 0; x < listTaskProcess.length; x++) {
                // console.log(listTaskProcess[x].actualStartDate,listTaskProcess[x].actualEndDate,item.convertDayToHour,item.officeHours,"hours");
                let time3 = convertT(listTaskProcess[x].actualStartDate, listTaskProcess[x].actualEndDate, item.convertDayToHour, item.officeHours, "hours")
                let time1 = listTaskProcessT[x].fastest?.time ? parseInt(listTaskProcessT[x].fastest?.time) : time3 + 1;
                let time2 = listTaskProcessT[x].slowest?.time ? parseInt(listTaskProcessT[x].slowest?.time) : 0;
                if (time3 < time1) {
                    listTaskProcessT[x].fastest.time = time3;
                    listTaskProcessT[x].fastest.task = listTaskProcess[x]._id
                }
                if (time3 > time2) {
                    listTaskProcessT[x].slowest.time = time3;
                    listTaskProcessT[x].slowest.task = listTaskProcess[x]._id
                }
            }
            await ProcessTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(item.processTemplate, {
                $set: {
                    tasks: listTaskProcessT
                }
            }, (error, data) => {
                // if (error) console.log(error) ;
                // if (data) console.log(data);
            })
        }
    } else {
        const array = Object.values(body.info);
        const arrayProcess = body.processChilds? Object.values(body.processChilds):"";
        // console.log(array);
        const item = await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(body.id, {
            $set: {
                xmlDiagram: body.xmlDiagram
            }
        }, (error, data) => {
            // if (error) console.log(error) ;
            // if (data) console.log(data);
        })
        if (item.status === 'not_initialized') {
            let newTaskItem;
            let listTask = [];
            let listProcess = [];
            let mailInfoArr = [];
            let taskProcessId = item._id;
            for (let i in array) {
                let taskInformations, taskActions, cloneActions = [];

                let splitter = array[i].startDate.split("-");
                let startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                splitter = array[i].endDate.split("-");
                let endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);

                taskInformations = array[i].taskInformations;
                taskActions = array[i].taskActions;

                for (let i in taskActions) {
                    cloneActions[i] = {
                        mandatory: taskActions[i].mandatory,
                        name: taskActions[i].name,
                        description: taskActions[i].description,
                    }
                }

                let status = "wait_for_approval";
                if (isStartTask(array[i])) {
                    status = "inprocess";
                }
                let formula = array[i].formula;
                if (array[i].formula === '') {
                    formula = "progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100";
                    // formula = "progress / (daysUsed / totalDays) - 0.5 * (10 - (averageActionRating)) * 10";
                }

                let collaboratedWithOrganizationalUnits = array[i].collaboratedWithOrganizationalUnits.map(item => { return { "organizationalUnit": item } })
                let process = taskProcessId;
                newTaskItem = await Task(connect(DB_CONNECTION, portal)).create({
                    process: process,
                    codeInProcess: array[i].codeInProcess,
                    numberOfDaysTaken: array[i].numberOfDaysTaken,
                    organizationalUnit: array[i].organizationalUnit,
                    collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits,
                    creator: body.creator, //id của người tạo
                    name: array[i].name,
                    description: array[i].description,
                    startDate: startDate,
                    endDate: endDate,
                    formula: formula,
                    priority: array[i].priority,
                    taskTemplate: null,
                    taskInformations: taskInformations,
                    taskActions: cloneActions,
                    parent: null,
                    level: 1,
                    status: status,
                    responsibleEmployees: array[i].responsibleEmployees,
                    accountableEmployees: array[i].accountableEmployees,
                    consultedEmployees: array[i].consultedEmployees,
                    informedEmployees: array[i].informedEmployees,
                    confirmedByEmployees: array[i].responsibleEmployees.concat(array[i].accountableEmployees).concat(array[i].consultedEmployees).includes(array[i].creator) ? array[i].creator : []
                });

                let x = await TaskService.sendEmailForCreateTask(portal, newTaskItem);

                mailInfoArr.push(x);
                listTask.push(newTaskItem._id);
            }
            if (arrayProcess){
                for (let i in arrayProcess) {
                    let processChild = arrayProcess[i].process
                    console.log(processChild);
                    let splitterProcessChild = processChild.startDate.split("-");
                    let startDateProcessChild = new Date(splitterProcessChild[2], splitterProcessChild[1] - 1, splitterProcessChild[0]);
                    splitterProcessChild = processChild.endDate.split("-");
                    let endDateProcessChild = new Date(splitterProcessChild[2], splitterProcessChild[1] - 1, splitterProcessChild[0]);
                    let item = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ _id: arrayProcess[i].process._id });
    
                    if (item) {
                        await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(arrayProcess[i].process._id, { $set: { codeInProcess: arrayProcess[i].code, processTemplate: processChild._id } }, { new: true });
                        listProcess.push(item._id);
                    } else {
                        let newTaskProcess1 = await TaskProcess(connect(DB_CONNECTION, portal)).create({
                            // processTemplate: processId ? processId : null,
                            xmlDiagram: processChild.xmlDiagram,
                            processName: processChild.processName,
                            processDescription: processChild.processDescription,
                            startDate: startDateProcessChild,
                            endDate: endDateProcessChild,
                            creator: processChild.creator,
                            viewer: processChild.viewer,
                            manager: processChild.manager,
                            status: "not_initialized",
                            codeInProcess: arrayProcess[i].code,
                            processTemplate: processChild._id,
                            processParent: taskProcessId,
                        })
                        listProcess.push(newTaskProcess1._id);
                    }
                }
            } 
            for (let x in array) {
                let listFollowingTask = [];
                let listPreceedingTask = [];
                for (let i in array[x].followingTasks) {
                    let item = await Task(connect(DB_CONNECTION, portal)).findOne({ process: taskProcessId, codeInProcess: array[x].followingTasks[i].task });
                    if (item) {
                        if (item.status === "inprocess") {
                            listFollowingTask.push({
                                task: item._id,
                                link: array[x].followingTasks[i].link,
                                activated: true,
                            })
                        }
                        else {
                            listFollowingTask.push({
                                task: item._id,
                                link: array[x].followingTasks[i].link,
                            })
                        }

                    } else {
                        item = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ processParent: taskProcessId, codeInProcess: array[x].followingTasks[i].task });
                        if (item) {
                            if (item.status === "inprocess") {

                                listFollowingTask.push({
                                    task: item._id,
                                    link: array[x].followingTasks[i].link,
                                    activated: true,
                                })
                            }
                            else {
                                listFollowingTask.push({
                                    task: item._id,
                                    link: array[x].followingTasks[i].link,
                                })
                            }

                        }
                    }
                }
                for (let i in array[x].preceedingTasks) {
                    let item = await Task(connect(DB_CONNECTION, portal)).findOne({ process: taskProcessId, codeInProcess: array[x].preceedingTasks[i].task });

                    if (item) {
                        listPreceedingTask.push({
                            task: item._id,
                            link: array[x].preceedingTasks[i].link,
                        })
                    } else {
                        item = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ processParent: taskProcessId, codeInProcess: array[x].preceedingTasks[i].task });
                        if (item) {
                            listPreceedingTask.push({
                                task: item._id,
                                link: array[x].preceedingTasks[i].link,
                            })
                        }
                    }

                }

                await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                    { process: taskProcessId, codeInProcess: array[x].code },
                    {
                        $set: {
                            followingTasks: listFollowingTask,
                            preceedingTasks: listPreceedingTask,
                        }
                    },
                    { new: true }
                )
            }
            if (arrayProcess){
            for (let x in arrayProcess) {
                let listFollowingProcess = [];
                let listPreceedingProcess = [];
                for (let i in arrayProcess[x].followingTasks) {
                    // console.log(dataProcess[x].followingTasks[i].task);
                    let item = await Task(connect(DB_CONNECTION, portal)).findOne({ process: taskProcessId, codeInProcess: arrayProcess[x].followingTasks[i].task });
                    if (item) {
                        if (item.status === "inprocess") {
                            listFollowingProcess.push({
                                task: item._id,
                                link: arrayProcess[x].followingTasks[i].link,
                                activated: true,
                            })
                        }
                        else {
                            listFollowingProcess.push({
                                task: item._id,
                                link: arrayProcess[x].followingTasks[i].link,
                            })
                        }

                    } else {
                        item = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ processParent: taskProcessId, codeInProcess: arrayProcess[x].followingTasks[i].task });
                        if (item) {
                            if (item.status === "inprocess") {
                                listFollowingProcess.push({
                                    task: item._id,
                                    link: arrayProcess[x].followingTasks[i].link,
                                    activated: true,
                                })
                            }
                            else {
                                listFollowingProcess.push({
                                    task: item._id,
                                    link: arrayProcess[x].followingTasks[i].link,
                                })
                            }

                        }
                    }
                }
                for (let i in arrayProcess[x].preceedingTasks) {
                    let item = await Task(connect(DB_CONNECTION, portal)).findOne({ process: taskProcessId, codeInProcess: arrayProcess[x].preceedingTasks[i].task });
                    if (item) {
                        listPreceedingProcess.push({
                            task: item._id,
                            link: arrayProcess[x].preceedingTasks[i].link,
                        })

                    } else {
                        item = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ processParent: taskProcessId, codeInProcess: arrayProcess[x].preceedingTasks[i].task });
                        if (item) {
                            listPreceedingProcess.push({
                                task: item._id,
                                link: arrayProcess[x].preceedingTasks[i].link,
                            })
                        }
                    }

                }

                await TaskProcess(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                    { processParent: taskProcessId, codeInProcess: arrayProcess[x].code },
                    {
                        $set: {
                            followingTasks: listFollowingProcess,
                            preceedingTasks: listPreceedingProcess,
                        }
                    },
                    { new: true }
                )
            }
            let { processName, processDescription, status, startDate, endDate, viewer } = body;

            let splitterStartDate = startDate.split('-');
            let start = new Date(splitterStartDate[2], splitterStartDate[1] - 1, splitterStartDate[0]);
            let splitterEndDate = endDate.split('-');
            let end = new Date(splitterEndDate[2], splitterEndDate[1] - 1, splitterEndDate[0]);
            let diagram = await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(params.processId,
                {
                    $set: {
                        processName: processName,
                        processDescription: processDescription,
                        status: "wait_for_approval",
                        startDate: start,
                        endDate: end,
                        viewer: viewer,
                        tasks: listTask,
                        processChilds: listProcess
                    }
                },
                { new: true }
            )
            }
        } else {
            array.forEach(data => {
                // console.log(data);
                let splitter = data.startDate.split("-");
                let startDateProcess = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                splitter = data.endDate.split("-");
                let endDateProcess = new Date(splitter[2], splitter[1] - 1, splitter[0]);

                Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(data._id, {
                    $set: {
                        name: data.name,
                        description: data.description,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        creator: data.creator,
                        priority: data.priority,
                        level: data.level,
                        responsibleEmployees: data.responsibleEmployees,
                        accountableEmployees: data.accountableEmployees,
                        consultedEmployees: data.consultedEmployees,
                        // parent:data.parent,
                        // taskProject:data.taskProject,
                        codeInProcess: data.codeInProcess,
                        organizationalUnit: data.organizationalUnit,
                        collaboratedWithOrganizationalUnits: data.collaboratedWithOrganizationalUnits,
                        quillDescriptionDefault: data.quillDescriptionDefault,

                    }
                }, (error, data) => {
                    // if (error) console.log(error) ;
                    // if (data) console.log(data);
                })
            })
            let { processName, processDescription, status, startDate, endDate, viewer } = body;

            let splitterStartDate = startDate.split('-');
            let start = new Date(splitterStartDate[2], splitterStartDate[1] - 1, splitterStartDate[0]);
            let splitterEndDate = endDate.split('-');
            let end = new Date(splitterEndDate[2], splitterEndDate[1] - 1, splitterEndDate[0]);
            let diagram = await TaskProcess(connect(DB_CONNECTION, portal)).findByIdAndUpdate(params.processId,
                {
                    $set: {
                        processName: processName,
                        processDescription: processDescription,
                        status: status,
                        startDate: start,
                        endDate: end,
                        viewer: viewer,
                    }
                },
                { new: true }
            )
        }
    }

    // let newTask12= await Task(connect(DB_CONNECTION, portal)).findOne()

    let newProcess = await TaskProcess(connect(DB_CONNECTION, portal)).findById(params.processId)
        .populate([
            { path: 'creator', select: 'name' },
            // { path: 'viewer', select: 'name' },
            { path: 'manager', select: 'name' },
            {
                path: 'tasks', populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit collaboratedWithOrganizationalUnits", },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", select: 'name email avatar' },
                    { path: "taskActions.comments.creator", select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", select: 'name email avatar ' },
                    { path: "taskComments.creator", select: 'name email avatar' },
                    { path: "taskComments.comments.creator", select: 'name email avatar' },
                    { path: "documents.creator", select: 'name email avatar' },
                    { path: "process" },
                ]
            },
            { path: 'processTemplate', select: 'processName' },
        ]);
    return newProcess

}

/**
 * import file excel mẫu quy trình
 * @param {String} portal tên công ty
 * @param {Object} data dữ liệu import
 * @param {String} idUser id của người import
 */
exports.importProcessTemplate = async (portal, data, idUser) => {
    let results = [];

    for (let i in data) {

        // xử lý dữ liệu người quản lý
        let listManager = [];
        for (let x in data[i].manager) {
            let managerItem = await Role(connect(DB_CONNECTION, portal)).findOne({ name: data[i].manager[x].trim() });
            if (managerItem) {
                listManager = [...listManager, managerItem._id];
            }
        }
        data[i].manager = listManager;

        // xử lý dữ liệu người được xem
        let listViewer = [];
        for (let x in data[i].viewer) {
            let viewerItem = await Role(connect(DB_CONNECTION, portal)).findOne({ name: data[i].viewer[x].trim() });
            if (viewerItem) {
                listViewer = [...listViewer, viewerItem._id];
            }
        }
        data[i].viewer = listViewer;
        data[i]["creator"] = idUser;

        // xử lý dữ liệu công việc
        for (let k in data[i].tasks) {
            data[i].tasks[k]["creator"] = idUser;
            // chuyen dia chi email sang id
            for (let j = 0; j < data[i].tasks[k].accountableEmployees.length; j++) {
                let accountableEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].accountableEmployees[j].trim() });
                if (accountableEmployees) {
                    data[i].tasks[k].accountableEmployees[j] = accountableEmployees._id;
                } else {
                    accountableEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].tasks[k].accountableEmployees[j].trim() });
                    if (accountableEmployees) {
                        data[i].tasks[k].accountableEmployees[j] = accountableEmployees._id;
                    } else {
                        data[i].tasks[k].accountableEmployees[j] = null;
                    }

                }
            };
            for (let j = 0; j < data[i].tasks[k].consultedEmployees.length; j++) {
                let consultedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].consultedEmployees[j].trim() });
                if (consultedEmployees) {
                    data[i].tasks[k].consultedEmployees[j] = consultedEmployees._id;
                } else {
                    consultedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].tasks[k].consultedEmployees[j].trim() });
                    if (consultedEmployees) {
                        data[i].tasks[k].consultedEmployees[j] = consultedEmployees._id;
                    } else {
                        data[i].tasks[k].consultedEmployees[j] = null;
                    }

                }
            };
            for (let j = 0; j < data[i].tasks[k].informedEmployees.length; j++) {
                let informedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].informedEmployees[j].trim() });
                if (informedEmployees) {
                    data[i].tasks[k].informedEmployees[j] = informedEmployees._id;
                } else {
                    informedEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].tasks[k].informedEmployees[j].trim() });
                    if (informedEmployees) {
                        data[i].tasks[k].informedEmployees[j] = informedEmployees._id;
                    } else {
                        data[i].tasks[k].informedEmployees[j] = null;
                    }

                }
            };
            for (let j = 0; j < data[i].tasks[k].responsibleEmployees.length; j++) {
                let responsibleEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].responsibleEmployees[j].trim() });
                if (responsibleEmployees) {
                    data[i].tasks[k].responsibleEmployees[j] = responsibleEmployees._id;
                } else {
                    responsibleEmployees = await User(connect(DB_CONNECTION, portal)).findOne({ email: data[i].tasks[k].responsibleEmployees[j].trim() });
                    if (responsibleEmployees) {
                        data[i].tasks[k].responsibleEmployees[j] = responsibleEmployees._id;
                    } else {
                        data[i].tasks[k].responsibleEmployees[j] = null;
                    }
                }
            };

            // xu ly thong tin filledByAccountableEmployeesOnly 
            for (let j = 0; j < data[i].tasks[k].taskInformations.length; j++) {
                if (data[i].tasks[k].taskInformations[j][0][0]) {
                    let elm = {};
                    // format thong tin "chi qua ly duoc dien"
                    elm["filledByAccountableEmployeesOnly"] = String(data[i].tasks[k].taskInformations[j][0][3]);
                    // formart thong tin kieu du lieu
                    elm["type"] = data[i].tasks[k].taskInformations[j][0][2].toLowerCase();
                    elm["name"] = data[i].tasks[k].taskInformations[j][0][0];
                    elm["description"] = data[i].tasks[k].taskInformations[j][0][1];
                    elm["extra"] = "";

                    data[i].tasks[k].taskInformations[j] = elm;
                } else {
                    // if (!data[i].tasks[k].taskInformations[j][0][0]) {
                    //     data[i].tasks[k].taskInformations = [];
                    //     break;
                    // }
                    data[i].tasks[k].taskInformations.splice(j, 1);
                    j--;
                }
            }

            console.log('data[i].tasks[k].taskActions', data[i].tasks[k].taskActions);
            for (let j = 0; j < data[i].tasks[k].taskActions.length; j++) {
                if (data[i].tasks[k].taskActions[j][0][0]) {
                    let elm = {};
                    if (data[i].tasks[k].taskActions[j][0][2] === "Bắt buộc" || data[i].tasks[k].taskActions[j][0][2] === "true") {
                        elm["mandatory"] = true;
                    } else {
                        elm["mandatory"] = false;
                    }
                    elm["name"] = data[i].tasks[k].taskActions[j][0][0];
                    elm["description"] = data[i].tasks[k].taskActions[j][0][1];

                    data[i].tasks[k].taskActions[j] = elm;
                } else {
                    // if (!data[i].tasks[k].taskActions[j][0][0]) {
                    //     data[i].tasks[k].taskActions = [];
                    //     break;
                    // }
                    data[i].tasks[k].taskActions.splice(j, 1);
                    j--;
                }
            }

            // xử lý đơn vị công việc
            let unit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].organizationalUnit.trim() });
            data[i].tasks[k].organizationalUnit = String(unit._id);

            let collaboratedWithOrganizationalUnits = []
            for (let j = 0; j < data[i].tasks[k].collaboratedWithOrganizationalUnits.length; j++) {
                console.log('data[i].tasks[k].collaboratedWithOrganizationalUnits[j].trim()', data[i].tasks[k].collaboratedWithOrganizationalUnits[j].trim());
                if (data[i].tasks[k].collaboratedWithOrganizationalUnits[j].trim() !== 0) {
                    let collaborateItem = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ name: data[i].tasks[k].collaboratedWithOrganizationalUnits[j].trim() })
                    collaborateItem && collaboratedWithOrganizationalUnits.push(String(collaborateItem._id));
                }
            }
            data[i].tasks[k].collaboratedWithOrganizationalUnits = collaboratedWithOrganizationalUnits;
        }


        // gán cho biến tên là body để tái sử dụng hàm createXmlDiagram
        let body = {};
        body.xmlDiagram = data[i].xmlDiagram;
        body.processName = data[i].processName;
        body.processDescription = data[i].processDescription
        body.manager = data[i].manager;
        body.viewer = data[i].viewer;
        body.info = data[i].tasks;
        body.creator = data[i].creator;

        // thêm mới process
        let processItem = await this.createXmlDiagram(portal, body);
        results = [...results, processItem];
    }
    return results;
}