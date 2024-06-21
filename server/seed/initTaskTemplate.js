const mongoose = require("mongoose");
const models = require('../models');
var faker = require('faker');
// const riskList = require('./RiskDataSample')
const taskByProcess = require('./TaskProcess.json')
const processTemplate = require('./ProcessTemplateData.json')
const TaskService = require('../modules/task/task-management/task.service')
const {
    Risk,
    RiskDistribution,
    ProcessTemplate,
    TaskDistribution,
    TaskProcess,
    Task,
    TaskTemplate,
    OrganizationalUnit,
    PertEstimation,
    User,
    EmployeeKpi,
    Role,
} = models;
require('dotenv').config();

const initTaskTemplate = async () => {

    let connectOptions = process.env.DB_AUTHENTICATION === 'true' ?
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD
        } : {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    const vnistDB = mongoose.createConnection(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`, connectOptions);
    const initModels = (db) => {
        console.log("models", db.models);
        if (!db, models.TaskTemplate) TaskTemplate(db);
        if (!db, models.EmployeeKpi) EmployeeKpi(db);
        if (!db, models.Role) Role(db);
        if (!db.models.Risk) Risk(db);
        if (!db.models.RiskDistribution) RiskDistribution(db);
        if (!db, models.TaskDistribution) TaskDistribution(db);
        if (!db, models.ProcessTemplate) ProcessTemplate(db);
    }
    initModels(vnistDB);
    /**
    * Tạo dữ liệu cho mạng Bayes
    */
    // Import mẫu quy trình
    var organizationalUnitTemplate = await OrganizationalUnit(vnistDB).findOne({ name: "Ban giám đốc" });
    var organizationalUnitTemplate1 = await OrganizationalUnit(vnistDB).findOne({ name: "Bộ phận kinh doanh" });

    var userTemplate = await User(vnistDB).findOne({ name: "Nguyễn Văn Danh" })
    let processTemplateClone = JSON.parse(JSON.stringify(processTemplate))
    processTemplateClone.viewer = userTemplate
    processTemplateClone.manager = userTemplate
    for (let task of processTemplateClone.tasks) {
        task.collaboratedWithOrganizationalUnits = [organizationalUnitTemplate1],
            task.readByEmployees = [userTemplate]
        task.responsibleEmployees = [userTemplate]
        task.accountableEmployees = [userTemplate]
        task.consultedEmployees = [userTemplate]
        task.informedEmployees = [userTemplate]
        task.organizationalUnit = organizationalUnitTemplate
        task.creator = userTemplate
    }
    await ProcessTemplate(vnistDB).deleteMany({})
    await ProcessTemplate(vnistDB).create(processTemplateClone)
    // Lấy thông tin của tất cả các mẫu quy trình
    var processList = await ProcessTemplate(vnistDB).find()
    console.log("Tạo dữ liệu cho mạng công việc")
    if (processList.length == 0) {
        console.log("Không có dữ liệu về mẫu quy trình")
    }
    for (let process of processList) {
        let tasks = []
        if (process.tasks != undefined && process.tasks.length != 0) {
            let count = 0
            let className = 0
            for (let task of process.tasks) {
                if (count < 2) {
                    className = 1;
                } else if (count >= 2 && count < 5) {
                    className = 2;
                } else if (count >= 5 && count < 8) {
                    className = 3;
                } else {
                    className = 4
                }
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
        console.log(tasks)
        await TaskDistribution(vnistDB).deleteMany({})
        await TaskDistribution(vnistDB).insertMany({
            processName: process.processName,
            processDescription: process.processDescription,
            tasks: tasks
        })
        console.log(taskByProcess.processName)
        await TaskProcess(vnistDB).deleteMany({})
        await Task(vnistDB).deleteMany({})
        /** Fake dữ liệu các task */
        let opt = [3, 6, 4, 2, 3, 3, 2, 6, 5]
        let mos = [5, 8, 6, 3, 6, 7, 3, 7, 6]
        let pes = [7, 10, 8, 5, 9, 11, 4, 9,7]
        for (let count = 0; count < 20; count++) {
            // console.log('count',count)
            let times = []
            if (count < 30) {
                times = opt
            }
            if (count >= 30 && count < 70) {
                times = mos
            }
            if (count >= 70) {
                times = pes
            }
            try {
                //update dữ liệu của file json(codeInprocesss)
                // console.log(vnistDB)
                let processId = undefined;
                var body = taskByProcess
                let data = body.taskList;// update


                let taskDistributionList = await TaskDistribution(vnistDB).find()

                let taskDisCodes = taskDistributionList[0].tasks.map(t => t.taskID)
                let countCode = 0
                for (let dt of data) {
                    // console.log(i)
                    dt.code = taskDisCodes[countCode]
                    countCode++
                }
                let level;
                let newTaskItem
                let splitter = body.startDate.split("-");
                let startDateProcess = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                splitter = body.endDate.split("-");
                let endDateProcess = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                // console.log(body);
                let newTaskProcess = await TaskProcess(vnistDB).create({
                    // processTemplate: processId ? processId : null,
                    xmlDiagram: body.xmlDiagram,
                    processName: body.processName,
                    processDescription: body.processDescription,
                    startDate: startDateProcess,
                    endDate: endDateProcess,
                    creator: userTemplate,
                    viewer: userTemplate,
                    manager: userTemplate,
                    status: "finished"
                })
                let listTask = [];
                let mailInfoArr = [];
                let taskProcessId = newTaskProcess._id;
                // Tạo một hàm random lấy ngày endate từ start Date
                let countForSetDate = 0;
                for (let dt of data) {
                    let taskInformations, taskActions, cloneActions = [];
                    console.log('data name', dt.name)
                    let splitter = dt.startDate.split("-");
                    let startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                    // console.log('startDate:',startDate)
                    // splitter = dt.endDate.split("-");
                    let endDate = new Date(startDate)
                    endDate.setDate(endDate.getDate() + times[countForSetDate])
                    // console.log('add',times[countForSetDate])
                    // console.log('endDate',endDate)
                    countForSetDate++
                    // endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                    // let endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);

                    taskInformations = dt.taskInformations;
                    taskActions = dt.taskActions;

                    for (let i in taskActions) {
                        cloneActions[i] = {
                            mandatory: taskActions[i].mandatory,
                            name: taskActions[i].name,
                            description: taskActions[i].description,
                        }
                    }

                    let status = faker.random.arrayElement(["finished", "delayed"]);

                    let formula = dt.formula;
                    if (dt.formula === '') {
                        formula = "progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100";
                        // formula = "progress / (daysUsed / totalDays) - 0.5 * (10 - (averageActionRating)) * 10";
                    }

                    let collaboratedWithOrganizationalUnits = dt.collaboratedWithOrganizationalUnits.map(item => { return { "organizationalUnit": item } })
                    let process = taskProcessId;
                    let progress = count % 2 == 0 ? 100 : 50
                    var organizationalUnit_1 = await OrganizationalUnit(vnistDB).findOne({ name: "Ban giám đốc" });
                    newTaskItem = await Task(vnistDB).create({
                        process: process,
                        codeInProcess: dt.code,
                        numberOfDaysTaken: dt.numberOfDaysTaken,
                        organizationalUnit: organizationalUnit_1,
                        collaboratedWithOrganizationalUnits: organizationalUnit_1,
                        creator: userTemplate, //id của người tạo
                        name: dt.name,
                        description: dt.description,
                        startDate: startDate,
                        endDate: endDate,
                        formula: formula,
                        priority: dt.priority,
                        taskTemplate: null,
                        taskInformations: taskInformations,
                        taskActions: cloneActions,
                        parent: null,
                        level: 1,
                        status: status,
                        responsibleEmployees: [userTemplate],
                        accountableEmployees: [userTemplate],
                        consultedEmployees: [userTemplate],
                        informedEmployees: [userTemplate],
                        confirmedByEmployees: [],
                        progress: progress
                    });
                    // let portal = 'vnist'
                    // let x = await TaskService.sendEmailForCreateTask(portal, newTaskItem);

                    // mailInfoArr.push(x);
                    listTask.push(newTaskItem._id);
                }

                for (let xt of data) {
                    let listFollowingTask = [];
                    let listPreceedingTask = [];
                    for (let i in xt.followingTasks) {
                        let item = await Task(vnistDB).findOne({ process: taskProcessId, codeInProcess: xt.followingTasks[i].task });

                        if (item) {
                            if (item.status === "inprocess") {
                                listFollowingTask.push({
                                    task: item._id,
                                    link: xt.followingTasks[i].link,
                                    activated: true,
                                })
                            }
                            else {
                                listFollowingTask.push({
                                    task: item._id,
                                    link: xt.followingTasks[i].link,
                                })
                            }

                        }
                    }
                    for (let i in xt.preceedingTasks) {
                        let item = await Task(vnistDB).findOne({ process: taskProcessId, codeInProcess: xt.preceedingTasks[i].task });

                        if (item) {
                            listPreceedingTask.push({
                                task: item._id,
                                link: xt.preceedingTasks[i].link,
                            })
                        }

                    }

                    await Task(vnistDB).findOneAndUpdate(
                        { process: taskProcessId, codeInProcess: xt.code },
                        {
                            $set: {
                                followingTasks: listFollowingTask,
                                preceedingTasks: listPreceedingTask,
                            }
                        },
                        { new: true }
                    )
                }

                if (processId !== "undefined") {
                    await ProcessTemplate(vnistDB).findByIdAndUpdate(processId, { $inc: { 'numberOfUse': 1 } }, { new: true });
                }

                let newProcess = await TaskProcess(vnistDB).findByIdAndUpdate(taskProcessId, { $set: { tasks: listTask } }, { new: true })
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
                let myProcess = await ProcessTemplate(vnistDB).find().populate([
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
            } catch (err) {
                console.log(err)
            }

        }
    }
    // Them du lieu vao pert Esitimation
    let opt = [3, 6, 4, 2, 3, 3, 3, 6, 5]
    let mos = [5, 8, 6, 3, 6, 7, 3, 7, 6]
    let pes = [10, 10, 8, 5, 9, 11, 4, 9,7]
    let tdlist = await TaskDistribution(vnistDB).find();
    let count =0
    let pertEstimates = []

    for(let td of tdlist){
        let tasks = td.tasks
        for(let task of tasks){
            console.log(task.taskID)
            pertEstimates.push({
                taskID: task.taskID,
                opt:opt[count],
                pes:pes[count],
                mos:mos[count]
            })
            count++
        }
    }

    await PertEstimation(vnistDB).deleteMany({})
    await PertEstimation(vnistDB).insertMany(pertEstimates)

}
initTaskTemplate().then(() => {
    console.log("Xong! Khởi tạo dữ liệu cho chuỗi công việc thành công!")
    process.exit(0)

}).catch(err => {
    console.log(err)
})
// process.exit()
