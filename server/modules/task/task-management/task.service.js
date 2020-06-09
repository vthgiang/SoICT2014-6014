const mongoose = require("mongoose");
const { Task, TaskTemplate, TaskAction, TaskTemplateInformation, Role, OrganizationalUnit, User } = require('../../../models/index').schema;
const moment = require("moment");
const nodemailer = require("nodemailer");

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
exports.getTask = async (id,userId) => {
    //req.params.id
    var superTask = await Task.findById(id)
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator parent" })   
        .populate("evaluations.results.employee")
        .populate("evaluations.kpis.employee")
        .populate("evaluations.kpis.kpis")

    var task = await Task.findById(id).populate([
        { path: "parent", select: "name"},
        { path: "organizationalUnit", model: OrganizationalUnit},
        { path: "inactiveEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id"},
        { path: "evaluations.results.employee", select: "name email _id"},
        { path: "evaluations.kpis.employee", select: "name email _id"},
        { path: "evaluations.kpis.kpis"},
        { path: "taskActions.creator", model: User,select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '},
        { path: "taskComments.creator", model: User,select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
        { path: "files.creator", model: User, select: 'name email avatar'},
    ])
    var responsibleEmployees,accountableEmployees,consultedEmployees,informedEmployees;
    responsibleEmployees = task.responsibleEmployees;
    accountableEmployees = task.accountableEmployees;
    consultedEmployees = task.consultedEmployees;
    informedEmployees = task.informedEmployees;
    var flag=0;
    for (let n in responsibleEmployees) {
        if (JSON.stringify(responsibleEmployees[n]._id) === JSON.stringify(userId)){
            flag=1;
            break;
        }
    }
    for (let n in accountableEmployees) {
        if (JSON.stringify(accountableEmployees[n]._id) === JSON.stringify(userId)){
            flag=1;
            break;
        }
    }
    for (let n in consultedEmployees) {
        if (JSON.stringify(consultedEmployees[n]._id) === JSON.stringify(userId)){
            flag=1;
            break;
        }
    }
    for (let n in informedEmployees) {
        if (JSON.stringify(informedEmployees[n]._id) === JSON.stringify(userId)){
            flag=1;
            break;
        }
    }
    if (flag===0){
        return {
            "info": null
        }
    }
    if(task.taskTemplate === null){
        return {
            "info": task,
            // "informations": task.taskInformations
        };
    } else {
        var task2 = await Task.findById(id)
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator parent" })
        .populate({path: "taskActions.creator", model: User, select: "name email"});
        return {
            "info": task,
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
        },
        isArchived: false
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

    var keySearch = {
        accountableEmployees: {
            $in: [user]
        },
        isArchived: false
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

    accountableTasks = await Task.find(keySearch).sort({ 'createdAt': 'asc' })
    .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task.count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": accountableTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc hỗ trợ theo id người dùng
 */
exports.getPaginatedTasksThatUserHasConsultedRole = async (task) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var { perPage, number, user, organizationalUnit, status, priority, special, name } = task;
    
    var consultedTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        consultedEmployees: {
            $in: [user]
        },
        isArchived: false
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

    consultedTasks = await Task.find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task.count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": consultedTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc thiết lập theo id người dùng
 */
exports.getPaginatedTasksCreatedByUser = async (task) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.status,req.params.user
    var { perPage, number, user, organizationalUnit, status, priority, special, name } = task;
    
    var creatorTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        creator: {
            $in: [user]
        },
        isArchived: false
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

    creatorTasks = await Task.find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });
    
    var totalCount = await Task.count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": creatorTasks,
        "totalPage": totalPages 
    };
}

/**
 * Lấy công việc quan sát theo id người dùng
 */
exports.getPaginatedTasksThatUserHasInformedRole = async (task) => {
    //req.params.perpage,req.params.number,req.params.unit,req.params.user,req.params.status
    var { perPage, number, user, organizationalUnit, status, priority, special, name } = task;
    
    var informedTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        informedEmployees: {
            $in: [user]
        },
        isArchived: false
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

    informedTasks = await Task.find(keySearch).sort({ 'createdAt': 'asc' })
            .skip(perPage * (page - 1)).limit(perPage)
            .populate({ path: "organizationalUnit creator parent" });
   
    var totalCount = await Task.count(keySearch);
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
    
    let taskTemplate, cloneActions=[];
    if(task.taskTemplate !== ""){
        taskTemplate = await TaskTemplate.findById(task.taskTemplate);
        var taskActions = taskTemplate.taskActions;

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name:  taskActions[i].name,
                description:  taskActions[i].description,
            }
        }
    }

    var task = await Task.create({ //Tạo dữ liệu mẫu công việc
        organizationalUnit: task.organizationalUnit,
        creator: task.creator, //id của người tạo
        name: task.name,
        description: task.description,
        startDate: startDate,
        endDate: endDate,
        priority: task.priority,
        taskTemplate: taskTemplate ? taskTemplate : null,
        taskInformations: taskTemplate? taskTemplate.taskInformations: [],
        taskActions: taskTemplate? cloneActions: [],
        parent: (task.parent==="")? null : task.parent,
        level: level,
        responsibleEmployees: task.responsibleEmployees,
        accountableEmployees: task.accountableEmployees,
        consultedEmployees: task.consultedEmployees,
        informedEmployees: task.informedEmployees,
    });

    if(task.taskTemplate !== null){
        await TaskTemplate.findByIdAndUpdate(
            task.taskTemplate, { $inc: { 'numberOfUse': 1} }, { new: true }
        );
    }

    task = await task.populate("organizationalUnit creator parent").execPopulate();

    // Gửi email
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });
    var email,userId,user,users;

    userId = task.responsibleEmployees;  // lấy id người thực hiện
    user = await User.find({
        _id : { $in: userId }
    })

    userId = task.accountableEmployees;  // lấy id người phê duyệt
    users = await User.find({
        _id : { $in: userId }
    })
    user.push(...users);  // thêm dánh sách người phê duyệt

    userId = task.consultedEmployees;  // lấy id người hỗ trợ
    users = await User.find({
        _id : { $in: userId }
    })
    user.push(...users); // thêm danh sách người hỗ trợ

    userId = task.informedEmployees;  // lấy id người quan sát
    users = await User.find({
        _id : { $in: userId }
    })
    user.push(...users);  // thêm danh sách người quan sát

    email = user.map( item => item.email); // Lấy ra tất cả email của người dùng
    // Loại bỏ các giá trị email trùng nhau
    email = email.map(mail => mail.toString());
    for(let i = 0, max = email.length; i < max; i++) {
        if(email.indexOf(email[i]) != email.lastIndexOf(email[i])) {
            email.splice(email.indexOf(email[i]), 1);
            i--;
        }
    }
    email.push('trinhhong102@gmail.com');

    var mainOptions = {
        from: 'vnist.qlcv@gmail.com',
        to: email,
        subject: 'Tạo mới công việc hành công',
        text: '',
        html:   
            `<p>Bạn được giao nhiệm vụ trong công việc:  <a href="${process.env.WEBSITE}/task?taskId=${task._id}">${process.env.WEBSITE}/task?taskId=${task._id}</a></p>`
    }
    transporter.sendMail(mainOptions);
    
    // Tạo thông báo
    let notifications = user.map(user => {
        return {
            title: "Tạo mới công việc",
            level: "general",
            content: "Bạn được giao nhiệm vụ mới trong công việc ",
            sender:task.organizationalUnit.name,
            user
        }
    });
    Notification.insertMany(notifications);
    

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
 * Chinh sua trang thai luu kho cua cong viec
 */
exports.editArchivedOfTask = async (taskID) => {
    var t = await Task.findByIdAndUpdate(taskID);
    var isArchived = t.isArchived;

    var task = await Task.findByIdAndUpdate(taskID, 
        { $set: {isArchived: !isArchived }},
        { new: true } 
    );

    return task;
}
/**
 * get subtask
 */
exports.getSubTask = async(taskId) => {
    var task = await Task.find({
        parent: taskId
    }).sort("createdAt")
    return task;
}


/**
 * hàm convert dateISO sang string
 */
formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    console.log('---typeof(d.getMonth())---', typeof(d.getMonth()));

    return [day, month, year].join('-');
}

/**
 * hàm check điều kiện evaluate tồn tại
 */
async function checkEvaluations(date, taskId, storeDate) {
    var evaluateId;

    var splitterStoreDate = storeDate.split("-");
    var storeDateISO = new Date(splitterStoreDate[2], splitterStoreDate[1]-1, splitterStoreDate[0]);

    var splitterDate = date.split("-");
    var dateISO = new Date(splitterDate[2], splitterDate[1]-1, splitterDate[0]);
    var monthOfParams = dateISO.getMonth();
    var yearOfParams = dateISO.getFullYear();
    var testCase;

    // kiểm tra evaluations
    var initTask = await Task.findById(taskId);
    
    var cloneTaskInfo = [];
    for(let i in initTask.taskInformations){
        cloneTaskInfo[i] = {
            _id: initTask.taskInformations[i]._id,
            name: initTask.taskInformations[i].name,
            code: initTask.taskInformations[i].code,
            type: initTask.taskInformations[i].type,
        }
    }

    // kiểm tra điều kiện của evaluations
    if(initTask.evaluations.length === 0){
        testCase = "TH1";
    }
    else {
        var chk = initTask.evaluations.find(e => ( monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()) );
        if(!chk){ // có evaluate nhưng k có tháng này
            testCase = "TH2";
        } else { // có evaluate đúng tháng này
            testCase = "TH3";
        }
    }
    
    // TH1: chưa có evaluations => tạo mới
    if(testCase === "TH1"){
        console.log('TH1----chưa có evaluations');
        var evaluationsVer1 = {
            date: storeDateISO,
            kpi: [],
            result: [],
            taskInformations: cloneTaskInfo
        } 
        var taskV1 = await Task.updateOne({_id: taskId},
            {
                $push: {
                    evaluations: evaluationsVer1
                }
            } ,
            {
                $new: true
            }  
        );
        var taskV1 = await Task.findById(taskId);
        evaluateId = taskV1.evaluations[0]._id;
        console.log('TH1========', evaluateId);
    }

    // TH2: Có evaluation nhưng chưa có tháng giống với date => tạo mới
    else if(testCase === "TH2") {
        console.log('TH2---Có evaluation nhưng chưa có tháng giống với date');
        var evaluationsVer2 = {
            date: storeDateISO,
            kpi: [],
            result: [],
            taskInformations: cloneTaskInfo
        } 
        await Task.updateOne({_id: taskId},
            {
                $push: {
                    evaluations: evaluationsVer2
                }
            } ,
            {
                $new: true
            }  
        );
        
        var taskV2 = await Task.findById(taskId);
        evaluateId = taskV2.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()) )._id;
        console.log('TH2========', evaluateId);
    }
    
    // TH3: Có evaluations của tháng giống date => cập nhật evaluations
    else if(testCase === "TH3"){
        console.log('TH3----Có evaluations của tháng giống date');
        var taskV3 = initTask;
        evaluateId = taskV3.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()) )._id;
        console.log('TH3========', evaluateId);
    }

    return evaluateId;
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
    var kpisItem = {
        employee: user,
        kpis: kpi
    };
    var date = data.date;
    var evaluateId;

    const endOfMonth   = moment().endOf("month").format('DD-MM-YYYY')
    console.log(endOfMonth);

    // if(kpi.length !== 0){
        evaluateId = await checkEvaluations(date, taskId, endOfMonth);
        console.log('evaluateId cần lấy-----', evaluateId);
    // }
    // var myTask =  await Task.findById(taskId);
    // if( evaluateId) {
        let task = await Task.findById(taskId);
        // cập nhật thông tin kpi
        var listKpi = task.evaluations.find(e => String(e._id) === String(evaluateId)).kpis
        console.log('liissssssssssssss', listKpi);
        var check_kpi = listKpi.find(kpi => String(kpi.employee) === user );
        console.log('check_kpi', check_kpi);
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
    // }

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

    // var task = await Task.findById(taskId);
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

                // console.log('task.taskInformations[i]', task.taskInformations[i]);
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

    // var newTask = await this.getTask(taskId).info;
    var newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name"},
        { path: "organizationalUnit", model: OrganizationalUnit},
        { path: "inactiveEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id"},
        { path: "evaluations.results.employee", select: "name email _id"},
        { path: "evaluations.kpis.employee", select: "name email _id"},
        { path: "evaluations.kpis.kpis"},
        { path: "taskActions.creator", model: User,select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '},
        { path: "taskComments.creator", model: User,select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
    ]);
    return newTask;
}

/**
 * edit task by responsible employee---PATCH
 */
exports.editTaskByAccountableEmployees = async (data, taskId) => {
    console.log('data', data);
    var description = data.description;
    var name = data.name;
    var priority = data.priority;
    var status = data.status;
    // var user = data.user;
    var progress = data.progress;
    var info = data.info;
    // var evaluateId = data.evaluateId;
    var accountableEmployees = data.accountableEmployees;
	var consultedEmployees = data.consultedEmployees;
	var responsibleEmployees = data.responsibleEmployees;
	var informedEmployees = data.informedEmployees;
    var inactiveEmployees = data.inactiveEmployees;
    
    // var date = Date.now();
    var date = data.date;
    // var evaluateId = await checkEvaluations(date, taskId);

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

                // console.log('task.taskInformations[i]', task.taskInformations[i]);
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

    

    // var newTask = await Task.findById(taskId);
    var newTask = await Task.findById(taskId).populate([
        {path: "parent", select: "name"},
        {path: "organizationalUnit", model: OrganizationalUnit},
        {path: "inactiveEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id"},
        {path: "evaluations.results.employee", select: "name email _id"},
        {path: "evaluations.kpis.employee", select: "name email _id"},
        {path: "evaluations.kpis.kpis"},
        { path: "taskActions.creator", model: User,select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '},
        { path: "taskComments.creator", model: User,select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
    ]);
    // console.log('newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', newTask);
    return newTask;

}

/**
 * evaluate task by consulted
 */
exports.evaluateTaskByConsultedEmployees = async (data, taskId) => {
    var user = data.user;
    // var evaluateId = data.evaluateId;
    var automaticPoint = data.automaticPoint;
    var employeePoint = data.employeePoint;
    var role = data.role;
    var date = data.date;
    var evaluateId = await checkEvaluations(date, taskId, date);

    var resultItem = {
        employee: user,
        employeePoint: employeePoint,
        automaticPoint: automaticPoint,
        role: role
    }

    var task = await Task.findById(taskId);

    // console.log('task ============================== ' , task, task.evaluations);
    // cập nhật thông tin result

    var listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results

    // console.log('kkkkkkkkkkkk', listResult);

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
    // var newTask = await Task.findById(taskId);
    var newTask = await Task.findById(taskId).populate([
        {path: "parent", select: "name"},
        {path: "organizationalUnit", model: OrganizationalUnit},
        {path: "inactiveEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id"},
        {path: "evaluations.results.employee", select: "name email _id"},
        {path: "evaluations.kpis.employee", select: "name email _id"},
        {path: "evaluations.kpis.kpis"},
        { path: "taskActions.creator", model: User,select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '},
        { path: "taskComments.creator", model: User,select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
    ]);
    return newTask;
}

/**
 * evaluate task by Responsible
 */
exports.evaluateTaskByResponsibleEmployees = async (data, taskId) => {
    var user = data.user;
    // var evaluateId = data.evaluateId;
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

    var evaluateId = await checkEvaluations(date, taskId, date);

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

    var listKpi = task.evaluations.find(e => String(e._id) === String(evaluateId)).kpis

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

    // var listResult = task.evaluations[task.evaluations.length-1].results;
    var listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    var check_results = listResult.find(r => ( String(r.employee) === user && String(r.role) === "Responsible" ));
    // console.log('check_results',check_results);
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
    var splitterDate = date.split("-");
    var dateISO = new Date(splitterDate[2], splitterDate[1]-1, splitterDate[0]);
    var monthOfParams = dateISO.getMonth();
    var yearOfParams = dateISO.getFullYear();
    var now = new Date();

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

                    if(yearOfParams > now.getFullYear() || (yearOfParams <= now.getFullYear() && monthOfParams >= now.getMonth()) ){
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
                            },
                            {
                                $new: true
                            }
                        )
                    }
                    
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

    var newTask = await Task.findById(taskId).populate([
        {path: "parent", select: "name"},
        {path: "organizationalUnit", model: OrganizationalUnit},
        {path: "inactiveEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id"},
        {path: "evaluations.results.employee", select: "name email _id"},
        {path: "evaluations.kpis.employee", select: "name email _id"},
        {path: "evaluations.kpis.kpis"},
        { path: "taskActions.creator", model: User,select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '},
        { path: "taskComments.creator", model: User,select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
    ]);
    return newTask;
}



/**
 * evaluate task by Accountable
 */
exports.evaluateTaskByAccountableEmployees = async (data, taskId) => {
    var user = data.user;
    // var evaluateId = data.evaluateId;
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

    var evaluateId = await checkEvaluations(date, taskId, date);

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

    // var listKpi = task.evaluations.find(e => String(e._id) === String(evaluateId)).kpis
    var listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results;

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
                            employee: cloneResult[item].employee,
                            employeePoint: 0
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

    var listResult2 = task2.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    // cập nhật điểm cá nhân cho ng phe duyet
    // console.log('list', listResult2);
    var check_approve = listResult2.find(r => ( String(r.employee) === user && String(r.role) === "Accountable" ));
    
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
    var splitterDate = date.split("-");
    var dateISO = new Date(splitterDate[2], splitterDate[1]-1, splitterDate[0]);
    var monthOfParams = dateISO.getMonth();
    var yearOfParams = dateISO.getFullYear();
    var now = new Date();

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

                    if(yearOfParams > now.getFullYear() || (yearOfParams <= now.getFullYear() && monthOfParams >= now.getMonth()) ){
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
                            },
                            {
                                $new: true
                            }
                        )
                    }
                    
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

    // cập nhật thông tin result========================================================END========================================================


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


    // var newTask = await Task.findById(taskId);
    var newTask = await Task.findById(taskId).populate([
        {path: "parent", select: "name"},
        {path: "organizationalUnit", model: OrganizationalUnit},
        {path: "inactiveEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id"},
        {path: "evaluations.results.employee", select: "name email _id"},
        {path: "evaluations.kpis.employee", select: "name email _id"},
        {path: "evaluations.kpis.kpis"},
        { path: "taskActions.creator", model: User,select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '},
        { path: "taskComments.creator", model: User,select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
    ]);
    return newTask;
}
