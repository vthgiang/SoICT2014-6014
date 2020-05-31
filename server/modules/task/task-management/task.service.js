const mongoose = require("mongoose");
const { Task, TaskTemplate, TaskAction, TaskTemplateInformation, Role, OrganizationalUnit, User } = require('../../../models/index').schema;

/**
 * Lấy tất cả các công việc
 */
 exports.getAllTasks = (req, res) => {
    var tasks = Task.find();
    return tasks;  
}

/**
 * Lấy mẫu công việc theo Id
 */
exports.getTask = async (id) => {
    //req.params.id
    var superTask = await Task.findById(id)
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator parent" })   
        .populate("evaluations.results.employee")
        .populate("evaluations.kpis.employee")
        .populate("evaluations.kpis.kpis")

    var task = await Task.findById(id).populate([
        {path: "parent", select: "name"},
        {path: "organizationalUnit", model: OrganizationalUnit},
        {path: "inactiveEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id"},
        {path: "evaluations.results.employee", select: "name email _id"},
        {path: "evaluations.kpis.employee", select: "name email _id"},
        {path: "evaluations.kpis.kpis"},
        { path: "taskActions.creator", model: User,select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}
    ])
    
    if(task.taskTemplate === null){
        return {
            "info": task,
            // "actions": task.taskActions,
            // "informations": task.taskInformations
        };
    } else {
        var task2 = await Task.findById(id)
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator parent" })
        .populate({path: "taskActions.creator", model: User, select: "name email"});
        return {
            "info": task,
            "actions": task2.taskActions,
            "informations": task2.taskInformations
        };
    }
        
}

/**
 * Lấy mẫu công việc theo chức danh và người dùng
 * @id: id người dùng
 */
exports.getTasksCreatedByUser = async (id) => {
    var tasks = await Task.find({
        creator: id
    }).populate({ path: 'taskTemplate', model: TaskTemplate });
    return tasks;
}

/**
 * Lấy công việc thực hiện chính theo id người dùng
 */
exports.getPaginatedTasksThatUserHasResponsibleRole = async (task) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var { perPage, number, user, organizationalUnit, status, priority, special, name } = task;
    
    var responsibleTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        responsibleEmployees: {
            $in: [user]
        }
    };

    if(organizationalUnit !== '[]'){
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit.split(",")
            }
        };
    }

    if(status !== '[]'){
        keySearch = {
            ...keySearch,
            status: {
                $in: status.split(",")
            }
        };
    }

    if(priority !== '[]'){
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority.split(",")
            }
        };
    }

    if(special !== '[]'){
        special = special.split(",");
        for(var i = 0; i < special.length; i++){
            if(special[i] === "Lưu trong kho"){
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else{
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };                
            }
        }
    }

    if (name !== 'null') {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };
    
    responsibleTasks = await Task.find( keySearch ).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
    
    var totalCount = await Task.count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);

    return {
        "tasks": responsibleTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc phê duyệt theo id người dùng
 */
exports.getPaginatedTasksThatUserHasAccountableRole = async (task) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.status,req.params.user
    var { perPage, number, user, organizationalUnit, status, priority, special, name } = task;

    var accountableTasks;
        var perPage = Number(perPage);
        var page = Number(number);
        if (organizationalUnit === "[]" && status === "[]") {
            accountableTasks = await Task.find({ accountableEmployees: { $in: [user] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            accountableTasks = await Task.find({
                accountableEmployees: { $in: [user] },
                $or: [
                    { organizationalUnit: { $in: organizationalUnit.split(",") } },
                    { status: { $in: status.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        }
        var totalCount = await Task.count({ accountableEmployees: { $in: [user] } });
        var totalPages = Math.ceil(totalCount / perPage);
        return {
            "tasks": accountableTasks,
            "totalPage": totalPages
        };
}

/**
 * Lấy công việc hỗ trợ theo id người dùng
 */
exports.getPaginatedTasksThatUserHasConsultedRole = async (perpageId,numberId,unitId,userId,statusId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var consultedTasks;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            consultedTasks = await Task.find({ consultedEmployees: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            consultedTasks = await Task.find({
                consultedEmployees: { $in: [userId] },
                $or: [
                    { organizationalUnit: { $in: unitId.split(",") } },
                    { status: { $in: statusId.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        }
        var totalCount = await Task.count({ consultedEmployees: { $in: [userId] } });
        var totalPages = Math.ceil(totalCount / perPage);
        return {
            "tasks": consultedTasks,
            "totalPage": totalPages
        };
}

/**
 * Lấy công việc thiết lập theo id người dùng
 */
exports.getPaginatedTasksCreatedByUser = async (perpageId,numberId,unitId,statusId,userId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.status,req.params.user
    var creatorTasks;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            creatorTasks = await Task.find({ creator: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        } else {
            creatorTasks = await Task.find({
                creator: { $in: [userId] },
                $or: [
                    { organizationalUnit: { $in: unitId.split(",") } },
                    { status: { $in: statusId.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        }
        var totalCount = await Task.count({ creator: { $in: [userId] } });
        var totalPages = Math.ceil(totalCount / perPage);
        return {
            "tasks": creatorTasks,
            "totalPage": totalPages 
        };
}

/**
 * Lấy công việc quan sát theo id người dùng
 */
exports.getPaginatedTasksThatUserHasInformedRole = async (perpageId,numberId,unitId,userId,statusId) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var informedTasks;
        var perPage = Number(perpageId);
        var page = Number(numberId);
        if (unitId === "[]" && statusId === "[]") {
            informedTasks = await Task.find({ informedEmployees: { $in: [userId] } }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage)
                .populate({ path: "organizationalUnit creator parent" });
        } else {
            informedTasks = await Task.find({
                informedEmployees: { $in: [userId] },
                $or: [
                    { organizationalUnit: { $in: unitId.split(",") } },
                    { status: { $in: statusId.split(",") } }
                ]
            }).sort({ 'createdAt': 'asc' })
                .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
        }
        var totalCount = await Task.count({ informedEmployees: { $in: [userId] } });
        var totalPages = Math.ceil(totalCount / perPage);
        return {
            "tasks": informedTasks,
            "totalPage": totalPages
        };
}

/**
 * Tạo công việc mới
 */


exports.createTask = async (task) => {
    // Lấy thông tin công việc cha
    var level = 1;
    if (mongoose.Types.ObjectId.isValid(task.parent)) {
        var parent = await Task.findById(task.parent);
        if (parent) level = parent.level + 1;
    }
    
    // convert thời gian từ string sang date
    var splitter = task.startDate.split("-");
    var startDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
    splitter = task.endDate.split("-");
    var endDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
    
    if(task.taskTemplate !== ""){
        var taskTemplate = await TaskTemplate.findById(task.taskTemplate);
        var taskActions = taskTemplate.taskActions;
        var cloneActions = [];

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name:  taskActions[i].name,
                description:  taskActions[i].description,
            }
        }
    }
    var evaluations = [{
        results : [],
        taskInformations: taskTemplate?taskTemplate.taskInformations:[],
    }]

    var task = await Task.create({ //Tạo dữ liệu mẫu công việc
        organizationalUnit: task.organizationalUnit,
        creator: task.creator, //id của người tạo
        name: task.name,
        description: task.description,
        startDate: startDate,
        endDate: endDate,
        priority: task.priority,
        taskTemplate: taskTemplate ? taskTemplate : null,
        taskInformations: (taskTemplate)? taskTemplate.taskInformations: [],
        taskActions: taskTemplate? cloneActions: [],
        parent: (task.parent==="")? null : task.parent,
        level: level,
        evaluations: evaluations,
        responsibleEmployees: task.responsibleEmployees,
        accountableEmployees: task.accountableEmployees,
        consultedEmployees: task.consultedEmployees,
        informedEmployees: task.informedEmployees,
    });

    if(task.taskTemplate !== null){
        var taskTemplate = await TaskTemplate.findByIdAndUpdate(
            task.taskTemplate, { $inc: { 'numberOfUse': 1} }, { new: true }
        );
    }

    task = await task.populate({path: "organizationalUnit creator parent"},)
    return task;
}

/**
 * Xóa công việc
 */
exports.deleteTask = async (id) => {
    //req.params.id
    var template = await WorkTemplate.findByIdAndDelete(id); // xóa mẫu công việc theo id
    var privileges = await Privilege.deleteMany({
        resource: id, //id của task template
        resourceType: "TaskTemplate"
    });
}

/**
 * edit status of task
 */
exports.editTaskStatus = async (taskID, status) => {
    var task = await Task.findByIdAndUpdate(taskID, 
        { $set: {status: status }},
        { new: true } 
    );
    return task;
}

/**
 * edit task by responsible employee---PATCH
 */
exports.editTaskByResponsibleEmployees = async (data, taskId) => {
    var description = data.description;
    var name = data.name;
    var kpi = data.kpi;
    var user = data.user;
    var progress = data.progress;
    var info = data.info;
    var evaluateId = data.evaluateId;
    var kpisItem = {
        employee: user,
        kpis: kpi
    }

    // chuẩn hóa dữ liệu info
    for(let i in info){
        if(info[i].type === "Number") info[i].value = parseInt(info[i].value);
        else if(info[i].type === "SetOfValues") info[i].value = info[i].value[0];
        else if (info[i].type === "Date") {
            var splitter = info[i].value.split("-");
            var infoDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
            info[i].value = infoDate;
        }
    }

    // console.log('infooooooooooooooooooooo', info);
    // cập nhật thông tin cơ bản
    await Task.updateOne(
        {_id: taskId},
        {
            $set: {
                name: name,
                description: description,
                progress: progress
            }
        },
        {$new: true}   
    );
    var task = await Task.findById(taskId);

    // console.log('task ============================== ' , task);
    // cập nhật thông tin kpi

    var listKpi = task.evaluations[task.evaluations.length-1].kpis

    // console.log('kkkkkkkkkkkk', listKpi);

    // console.log('taskiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', task.taskInformations, task.evaluations[task.evaluations.length-1].taskInformations);

    var check_kpi = listKpi.find(kpi => String(kpi.employee) === user );
    console.log('check_kpi',check_kpi);
    if(check_kpi === undefined){
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id" : evaluateId
            },
            {
                $push: {
                    "evaluations.$.kpis": kpisItem
                }
            },
            {$new: true}
        );
    } else {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id" : evaluateId,

            },
            {
                $set: {
                    "evaluations.$.kpis.$[elem].kpis": kpi
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user
                    }
                ]
            }
        );
    }

    for(let item in info){
        for( let i in task.taskInformations){   
            if(info[item].code === task.taskInformations[i].code){
                task.taskInformations[i] = {
                    filledByAccountableEmployeesOnly: task.taskInformations[i].filledByAccountableEmployeesOnly,
                    _id: task.taskInformations[i]._id,
                    code: task.taskInformations[i].code,
                    name: task.taskInformations[i].name,
                    description: task.taskInformations[i].description,
                    type: task.taskInformations[i].type,
                    extra: task.taskInformations[i].extra,
                    value: info[item].value
                }

                console.log('task.taskInformations[i]', task.taskInformations[i]);
                await Task.updateOne(
                    {
                        _id: taskId,
                        "taskInformations._id": task.taskInformations[i]._id
                    }, 
                    {
                        $set: {
                            "taskInformations.$.value": task.taskInformations[i].value
                        }
                    },
                    {
                        $new: true
                    }
                )
            }
        }
    }

    // console.log('cloneeeeeeeeeeeeeeeeeeeee', task.taskInformations);

    var newTask = await Task.findById(taskId);
    console.log('newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', newTask);
    return newTask;

}

/**
 * edit task by responsible employee---PATCH
 */
exports.editTaskByAccountableEmployees = async (data, taskId) => {
    var description = data.description;
    var name = data.name;
    var priority = data.priority;
    var status = data.status;
    var user = data.user;
    var progress = data.progress;
    var info = data.info;
    var evaluateId = data.evaluateId;
    var accountableEmployees = data.accountableEmployees;
	var consultedEmployees = data.consultedEmployees;
	var responsibleEmployees = data.responsibleEmployees;
	var informedEmployees = data.informedEmployees;
	var inactiveEmployees = data.inactiveEmployees;

    // chuẩn hóa dữ liệu info
    for(let i in info){
        if(info[i].type === "Number") info[i].value = parseInt(info[i].value);
        else if(info[i].type === "SetOfValues") info[i].value = info[i].value[0];
        else if (info[i].type === "Date") {
            var splitter = info[i].value.split("-");
            var infoDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
            info[i].value = infoDate;
        }
    }

    // console.log('infooooooooooooooooooooo', info);
    // cập nhật thông tin cơ bản
    await Task.updateOne(
        {_id: taskId},
        {
            $set: {
                name: name,
                description: description,
                progress: progress,
                priority: parseInt(priority[0]),
                status: status[0],

                responsibleEmployees: responsibleEmployees,
                consultedEmployees: consultedEmployees,
                accountableEmployees: accountableEmployees,
                informedEmployees: informedEmployees,

                inactiveEmployees: inactiveEmployees

            }
        },
        {$new: true}   
    );
    var task = await Task.findById(taskId);

    // console.log('task ============================== ' , task);

    for(let item in info){
        for( let i in task.taskInformations){   
            if(info[item].code === task.taskInformations[i].code){
                task.taskInformations[i] = {
                    filledByAccountableEmployeesOnly: task.taskInformations[i].filledByAccountableEmployeesOnly,
                    _id: task.taskInformations[i]._id,
                    code: task.taskInformations[i].code,
                    name: task.taskInformations[i].name,
                    description: task.taskInformations[i].description,
                    type: task.taskInformations[i].type,
                    extra: task.taskInformations[i].extra,
                    value: info[item].value
                }

                console.log('task.taskInformations[i]', task.taskInformations[i]);
                await Task.updateOne(
                    {
                        _id: taskId,
                        "taskInformations._id": task.taskInformations[i]._id
                    }, 
                    {
                        $set: {
                            "taskInformations.$.value": task.taskInformations[i].value
                        }
                    },
                    {
                        $new: true
                    }
                )
            }
        }
    }

    

    var newTask = await Task.findById(taskId);
    console.log('newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', newTask);
    return newTask;

}

/**
 * evaluate task by consulted
 */
exports.evaluateTaskByConsultedEmployees = async (data, taskId) => {
    var user = data.user;
    var evaluateId = data.evaluateId;
    var automaticPoint = data.automaticPoint;
    var employeePoint = data.employeePoint;
    var role = data.role;

    var resultItem = {
        employee: user,
        employeePoint: employeePoint,
        automaticPoint: automaticPoint,
        role: role
    }

    var task = await Task.findById(taskId);

    // console.log('task ============================== ' , task, task.evaluations);
    // cập nhật thông tin result

    var listResult = task.evaluations[task.evaluations.length-1].results

    console.log('kkkkkkkkkkkk', listResult);

    // console.log('taskiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', task.taskInformations, task.evaluations[task.evaluations.length-1].taskInformations);

    var check_results = listResult.find(r => (String(r.employee) === user && String(r.role === "Consulted")));
    console.log('check_results',check_results);
    if(check_results === undefined){
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id" : evaluateId
            },
            {
                $push: {
                    "evaluations.$.results": resultItem
                }
            },
            {$new: true}
        );
    } else {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id" : evaluateId,

            },
            {
                $set: {
                    "evaluations.$.results.$[elem].employeePoint": employeePoint,
                    "evaluations.$.results.$[elem].automaticPoint": automaticPoint
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": role
                    }
                ]
            }
        );
    }
    var newTask = await Task.findById(taskId);
    console.log('newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', newTask.evaluations[newTask.evaluations.length-1].results);
    return newTask;
}

/**
 * evaluate task by Responsible
 */
exports.evaluateTaskByResponsibleEmployees = async (data, taskId) => {
    var user = data.user;
    var evaluateId = data.evaluateId;
    var progress = data.progress;
    var automaticPoint = data.automaticPoint;
    var employeePoint = data.employeePoint;

    var role = data.role;

    var date = data.date;
    var kpi = data.kpi;
    var info = data.info;

    var splitter = date.split("-");
    var evaluateDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
    var dateFormat = evaluateDate;

    var kpisItem = {
        employee: user,
        kpis: kpi
    }

    var resultItem = {
        employee: user,
        employeePoint: employeePoint,
        automaticPoint: automaticPoint,
        role: role
    }

    // chuẩn hóa dữ liệu info
    for(let i in info){
        if(info[i].type === "Number") info[i].value = parseInt(info[i].value);
        else if(info[i].type === "SetOfValues") info[i].value = info[i].value[0];
        else if (info[i].type === "Date") {
            var splitter = info[i].value.split("-");
            var infoDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
            info[i].value = infoDate;
        }
    }

    await Task.updateOne({_id: taskId}, {$set:{progress: progress}}, {$new: true});
    
    var task = await Task.findById(taskId);

    // console.log('task ============================== ' , task, task.evaluations);

    var listKpi = task.evaluations[task.evaluations.length-1].kpis

    var check_kpi = listKpi.find(kpi => String(kpi.employee) === user);
    console.log('check_kpi',check_kpi);
    if(check_kpi === undefined){
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id" : evaluateId
            },
            {
                $push: {
                    "evaluations.$.kpis": kpisItem
                }
            },
            {$new: true}
        );
    } else {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id" : evaluateId,

            },
            {
                $set: {
                    "evaluations.$.kpis.$[elem].kpis": kpi
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user
                    }
                ]
            }
        );
    }

    // cập nhật thông tin result

    var listResult = task.evaluations[task.evaluations.length-1].results;
    console.log('rrrrrrrrrrrr', listResult);

    // console.log('taskiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', task.taskInformations, task.evaluations[task.evaluations.length-1].taskInformations);

    var check_results = listResult.find(r => ( String(r.employee) === user && String(r.role) === "Responsible" ));
    console.log('check_results',check_results);
    if(check_results === undefined){
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id" : evaluateId
            },
            {
                $push: {
                    "evaluations.$.results": resultItem
                }
            },
            {$new: true}
        );
    } else {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id" : evaluateId,

            },
            {
                $set: {
                    "evaluations.$.results.$[elem].employeePoint": employeePoint,
                    "evaluations.$.results.$[elem].automaticPoint": automaticPoint
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": role
                    }
                ]
            }
        );
    }

    //cập nhật lại tất cả điểm tự động
    await Task.updateOne(
        {
            _id: taskId,
            "evaluations._id" : evaluateId,

        },
        {
            $set: {
                "evaluations.$.results.$[].automaticPoint": automaticPoint
            }
        }
    )

    // update Info task
    var cloneInfo = task.taskInformations;
    for(let item in info){
        for( let i in cloneInfo){   
            if(info[item].code === cloneInfo[i].code){
                cloneInfo[i] = {
                    filledByAccountableEmployeesOnly: cloneInfo[i].filledByAccountableEmployeesOnly,
                    _id: cloneInfo[i]._id,
                    code: cloneInfo[i].code,
                    name: cloneInfo[i].name,
                    description: cloneInfo[i].description,
                    type: cloneInfo[i].type,
                    extra: cloneInfo[i].extra,
                    value: info[item].value
                }

                console.log('cloneInfo[i]', cloneInfo[i]);
                await Task.updateOne(
                    {
                        _id: taskId,
                        "taskInformations._id": cloneInfo[i]._id
                    }, 
                    {
                        $set: {
                            "taskInformations.$.value": cloneInfo[i].value
                        }
                    }
                    ,
                    {
                        $new: true
                    }
                )
                await Task.updateOne(
                    {
                        _id: taskId,
                        "evaluations._id": evaluateId
                    }, 
                    {
                        $set: {
                            "evaluations.$.taskInformations.$[elem].value": cloneInfo[i].value
                        }
                    },
                    {
                        arrayFilters: [
                            {
                                "elem._id": cloneInfo[i]._id
                            }
                        ]
                    }
                    
                )
            }
        }
    }


    // update date of evaluation

    await Task.updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId
        },
        {
            $set: {
                "evaluations.$.date": dateFormat
           }
        }, 
        {
            $new: true
        }
    )


    var newTask = await Task.findById(taskId);
    console.log('newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', newTask.evaluations[newTask.evaluations.length-1].results);
    return newTask;
}



/**
 * evaluate task by Accountable
 */
exports.evaluateTaskByAccountableEmployees = async (data, taskId) => {
    var user = data.user;
    var evaluateId = data.evaluateId;
    var progress = data.progress;
    
    var automaticPoint = data.automaticPoint;
    var role = data.role;

    var date = data.date;
    var status = data.status; // neu ket thuc thi moi thay doi, con neu la danh gia thi k doi
    var info = data.info;
    var results = data.results;

    var splitter = date.split("-");
    var evaluateDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
    var dateFormat = evaluateDate;

    // chuẩn hóa dữ liệu info
    for(let i in info){
        if(info[i].type === "Number") info[i].value = parseInt(info[i].value);
        else if(info[i].type === "SetOfValues") info[i].value = info[i].value[0];
        else if (info[i].type === "Date") {
            var splitter = info[i].value.split("-");
            var infoDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
            info[i].value = infoDate;
        }
    }

    // Chuan hoa du lieu approved results

    var cloneResult = [];
    for(let i in results){
        for(let j in results){
            if(i<j){
                if(results[i].employee === results[j].employee && results[i].role === results[j].role){
                    var point, contribute;
                    if( String(results[i].target) === "Point" ) point = results[i].value;
                    else if( String(results[i].target) === "Contribution") contribute = results[i].value;

                    if( String(results[j].target) === "Point" ) point = results[j].value;
                    else if( String(results[j].target) === "Contribution") contribute = results[j].value;
                    
                    var cloneItem = {
                        employee: results[i].employee,
                        role: results[i].role,
                        point: point,
                        contribute: contribute
                    }

                    cloneResult.push(cloneItem);
                }
            }
        }
        
    }
    console.log('cloneResult', cloneResult);

    await Task.updateOne({_id: taskId}, {$set: {status: status[0], progress: progress}});
    var task = await Task.findById(taskId);

    // cập nhật thông tin result================================================================BEGIN=====================================================

    var listResult = task.evaluations[task.evaluations.length-1].results;
    // console.log('rrrrrrrrrrrr', listResult);

    for(let i in listResult){
        console.log('list---------------------------------', listResult[i].role, listResult[i].employee, typeof(listResult[i].role), typeof(listResult[i].employee) );
    }

    for(let item in cloneResult){
        // console.log('r.employee === cloneResult[item].employee && r.role === cloneResult[item].role', typeof(cloneResult[item].employee) , typeof(cloneResult[item].role));
        
        var check_data = listResult.find(r => (String(r.employee) === cloneResult[item].employee && r.role === cloneResult[item].role))
        // TH nguoi nay da danh gia ket qua --> thi chi can cap nhat lai ket qua thoi            
        
        // console.log('check_data', check_data);
        if(check_data !== undefined){ 
            // cap nhat diem
            await Task.updateOne(
                {
                    _id: taskId,
                    "evaluations._id" : evaluateId,
    
                },
                {
                    $set: {
                        "evaluations.$.results.$[elem].approvedPoint": cloneResult[item].point,
                        "evaluations.$.results.$[elem].contribution": cloneResult[item].contribute,
                    }
                },
                {
                    arrayFilters: [
                        {
                            "elem.employee": cloneResult[item].employee,
                            "elem.role": cloneResult[item].role
                        }
                    ]
                }
            )
            
        } else {
            
            await Task.updateOne(
                {
                    _id: taskId,
                    "evaluations._id" : evaluateId,
    
                },
                {
                    $push: {
                        "evaluations.$.results": {
                            approvedPoint: cloneResult[item].point,
                            contribution: cloneResult[item].contribute,
                            role: cloneResult[item].role,
                            employee: cloneResult[item].employee
                        }
                    }
                },
                {
                    $new: true
                }
            )
            
        }
            
    }

    

    //cập nhật lại tất cả điểm tự động
    await Task.updateOne(
        {
            _id: taskId,
            "evaluations._id" : evaluateId,

        },
        {
            $set: {
                "evaluations.$.results.$[].automaticPoint": automaticPoint
            }
        }
    )

    var task2 = await Task.findById(taskId);

    // cập nhật thông tin result================================================================BEGIN=====================================================

    var listResult = task2.evaluations[task2.evaluations.length-1].results;

    // cập nhật điểm cá nhân cho ng phe duyet
    console.log('list', listResult);
    var check_approve = listResult.find(r => ( String(r.employee) === user && String(r.role) === "Accountable" ));
    
    console.log('check_approve',check_approve);
    for(let i in cloneResult) {
        if(String(cloneResult[i].role) === "Accountable" ){
            await Task.updateOne(
                {
                    _id: taskId,
                    "evaluations._id" : evaluateId,

                },
                {
                    $set: {
                        "evaluations.$.results.$[elem].employeePoint": cloneResult[i].point,
                    }
                },
                {
                    arrayFilters: [
                        {
                            "elem.employee": cloneResult[i].employee,
                            "elem.role": cloneResult[i].role
                        }
                    ]
                }
            )
        }
    }



    // update Info task
    var cloneInfo = task.taskInformations;
    for(let item in info){
        for( let i in cloneInfo){   
            if(info[item].code === cloneInfo[i].code){
                cloneInfo[i] = {
                    filledByAccountableEmployeesOnly: cloneInfo[i].filledByAccountableEmployeesOnly,
                    _id: cloneInfo[i]._id,
                    code: cloneInfo[i].code,
                    name: cloneInfo[i].name,
                    description: cloneInfo[i].description,
                    type: cloneInfo[i].type,
                    extra: cloneInfo[i].extra,
                    value: info[item].value
                }

                // console.log('cloneInfo[i]', cloneInfo[i]);
                await Task.updateOne(
                    {
                        _id: taskId,
                        "taskInformations._id": cloneInfo[i]._id
                    }, 
                    {
                        $set: {
                            "taskInformations.$.value": cloneInfo[i].value
                        }
                    }
                    ,
                    {
                        $new: true
                    }
                )
                await Task.updateOne(
                    {
                        _id: taskId,
                        "evaluations._id": evaluateId
                    }, 
                    {
                        $set: {
                            "evaluations.$.taskInformations.$[elem].value": cloneInfo[i].value
                        }
                    },
                    {
                        arrayFilters: [
                            {
                                "elem._id": cloneInfo[i]._id
                            }
                        ]
                    }
                    
                )
            }
        }
    }

    // cập nhật thông tin result========================================================END=============================================================


    // update date of evaluation

    await Task.updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId
        },
        {
            $set: {
                "evaluations.$.date": dateFormat
           }
        }, 
        {
            $new: true
        }
    )


    var newTask = await Task.findById(taskId);
    // console.log('newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', newTask.evaluations[newTask.evaluations.length-1].results);
    return newTask;
}
