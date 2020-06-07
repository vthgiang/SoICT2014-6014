const KPIPersonal = require('../../../../models/kpi/employeeKpiSet.model');
const Department = require('../../../../models/super-admin/organizationalUnit.model');
const Task = require('../../../../models/task/task.model');
const DetailKPIPersonal = require('../../../../models/kpi/employeeKpi.model');
const User = require('../../../../models/auth/user.model')
const mongoose = require("mongoose");
// Lấy tất cả KPI cá nhân hiện tại của một phòng ban
exports.getKPIAllMember = async (data) => {
    var department = await Department.findOne({
        $or: [
            { 'dean': data.role },
            { 'viceDean': data.role },
            { 'employee': data.role }
        ]
    });
    var kpipersonals;
    var startDate = data.startDate.split("-");
    var startdate = new Date(startDate[1], startDate[0], 0);
    var endDate = data.endDate.split("-");
    var enddate = new Date(endDate[1], endDate[0], 28);
    var status = parseInt(data.status);

    if (data.user === "all") {
        if (status === 5) {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                date: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        } 
        // else if (status === 4) {
        //     kpipersonals = await KPIPersonal.find({
        //         organizationalUnit: department._id,
        //         status: { $ne: 3 },
        //         date: { "$gte": startdate, "$lt": enddate }
        //     }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        // }
         else {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                status: status,
                date: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        }
    } else {
        if (status === 5) {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                creator: data.user,
                date: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        } 
        // else if (status === 4) {
        //     kpipersonals = await KPIPersonal.find({
        //         organizationalUnit: department._id,
        //         creator: data.user,
        //         status: { $ne: 3 },
        //         date: { "$gte": startdate, "$lt": enddate }
        //     }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        // }
         else {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                creator: data.user,
                status: status,
                date: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        }
    }
    return kpipersonals;
}

// Lấy tất cả KPI cá nhân theo người thiết lập
exports.getByMember = async (creatorID) => {

    var kpipersonals = await KPIPersonal.find({ creator: { $in: creatorID.split(",") } })
        .sort({ 'date': 'desc' })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis" });
    return kpipersonals;
}

// Lấy tất cả kpi cá nhân theo tháng
exports.getByMonth = async (data) => {
    var date = data.date.split("-");
    var month = new Date(date[1], date[0], 0);
    var kpipersonals = await KPIPersonal.findOne({ creator: data.id, date: month })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpipersonals;
}

// Phê duyệt tất cả các mục tiêu
exports.approveAllTarget = async (id) => {
    var kpipersonal = await KPIPersonal.findByIdAndUpdate(id, { $set: { status: 2 } }, { new: true });
    var targets;
    if (kpipersonal.kpis) targets = kpipersonal.kpis;
    if (targets !== []) {
        var targets = await Promise.all(targets.map(async (item) => {
            var defaultT = await DetailKPIPersonal.findByIdAndUpdate(item._id, { $set: { status: 1 } }, { new: true })
            return defaultT;
        }))
    }
    kpipersonal = await kpipersonal.populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();
    return [kpipersonal, targets];

}

// Phê duyệt từng mục tiêu
exports.editStatusTarget = async (data) => {

    var target = await DetailKPIPersonal.findByIdAndUpdate(data.id, { $set: { status: data.status } }, { new: true });
    var kpipersonal = await KPIPersonal.findOne({ kpis: { $in: data.id } }).populate("kpis");
    var kpis = kpipersonal.kpis;
    var checkFullApprove = 2;
    await kpis.map(item => {
        if (item.status === null || item.status === 0) {
            if (parseInt(data.status) === 1) {
                checkFullApprove = 1;
            } else {
                checkFullApprove = 0;
            }
        }
        return true;
    })
    kpipersonal = await KPIPersonal.findByIdAndUpdate(kpipersonal._id, { $set: { status: checkFullApprove } }, { new: true })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpipersonal;

}

// Chỉnh sửa mục tiêu của KPI cá nhân
exports.editTarget = async (id, data) => {
    var objUpdate = {
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    }
    var target = await DetailKPIPersonal.findByIdAndUpdate(id, { $set: objUpdate }, { new: true }).populate("parent");
    return target;
}
// Lấy kpi cá nhân theo id
exports.getById = async (id) => {
    var kpipersonal = await KPIPersonal.findById(id)
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpipersonal;
}

exports.getTaskById = async (data) => {
    //data :kpis_id, emloyeeId, date
    var date = data.date.split("-");
    console.log("dateeee",date);
    var daykpi = parseInt(date[2]);
    var monthkpi = parseInt(date[1]);
    var yearkpi = parseInt(date[0]);
   
    // tìm kiếm các công việc cần được đánh giá trong tháng
    var task = await getResultTaskByMonth(data);
    var priority;
    // tính điểm taskImportanceLevel:
    var Task =  await task.map((element)=>{
        console.log("qqqqqqqqqqqqqqq", element.taskImportanceLevel);
        if(element.taskImportanceLevel === -1){
            if(element.priority ==="Cao") priority = 3;
            else if( element.priority=== "Trung") priority = 2;
            else priority = 1;
            element.taskImportanceLevel = Math.round(3*(priority/3) + 3*(element.contribution/100)+ 4*(daykpi/30));
            element.taskImportanceLevelCal = element.taskImportanceLevel; // taskImportanceLevelCal là kết quả đọ qtr công việc do máy tính toán
            
            console.log('eeee', element);
        }else{
            if(element.priority ==="Cao") priority = 3;
            else if( element.priority=== "Trung") priority = 2;
            else priority = 1;
            element.taskImportanceLevelCal = Math.round(3*(priority/3) + 3*(element.contribution/100)+ 4*(daykpi/30));
            console.log('eeee', element);
        }
    })
    
   // console.log("----", task);
    
    //update importanceLevel arr
    // for(var element of task){
    //     var setPoint = await updateTaskImportanceLevel(element.taskId, element.employee._id, element.taskImportanceLevel, data.date);
    // }

    // // get task 
    // var resultTask = await getResultTaskByMonth(data);

    return task;
}

exports.getSystemPoint = async (id) => {
    var task = await Task.find({ kpi: id })
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees results parent taskTemplate " });
    var kpi = await DetailKPIPersonal.findById(id);

    var sum = 0, i = 0;
    for (i = 0; i < task.length; i++) {
        sum += task[i].point;
    }

    var systempoint = sum / task.length * kpi.weight / 100;

    var kpipersonal = await DetailKPIPersonal.findByIdAndUpdate(id, { $set: { systempoint: systempoint } }, { new: true });
    return kpipersonal;
}

exports.setPointKPI = async (id_kpi, id_target, data) => {
    var kpi = await DetailKPIPersonal.findByIdAndUpdate(id_target, { $set: { approverpoint: data.point } }, { new: true });
    var kpipersonal = await KPIPersonal.findById(id_kpi)
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpipersonal;
};

exports.setTaskImportanceLevel = async (id, data) => {
    console.log("tytytyt",data);
    // data body co taskId, date, point, employeeId
    // id là id của employee kpi
   // console.log(data);
    var set = [];
    for (const element of data) {

        var setPoint = await updateTaskImportanceLevel(element.taskId, element.employeeId, element.point, element.date);
        await set.push(setPoint);
    };
    // tinh diem kpi ca nhan 
    var key = {
        id : id,
        date : data[0].date,
        employeeId : data[0].employeeId
    }
    console.log("keyyyyyy", key);
    var task = await getResultTaskByMonth(key);
    var autoPoint = 0;
    var approvePoint = 0;
    var employPoint = 0;
    var sumTaskImportance = 0;
    console.log("ttttttttttttttttt", task);

    // từ độ quan trọng của cv, ta tính điểm kpi theo công thức : Giả sử có việc A, B, C  hệ số là 5, 6, 7 Thì điểm là (A*3 + B*6 + C*9 + D*2)/18

    for(element of task){
        autoPoint += element.automaticPoint  * element.taskImportanceLevel/10;
        approvePoint += element.approvedPoint * element. taskImportanceLevel/10;
        employPoint += element.contribution * element.taskImportanceLevel/10;
        sumTaskImportance += element.taskImportanceLevel;
    }
    var n = task.length;
    console.log("sssss", sumTaskImportance);
    console.log("auuu", autoPoint);
    
    var result = await DetailKPIPersonal.findByIdAndUpdate(id,{
        $set :{
            "automaticPoint" : Math.round(autoPoint/n),
            "employeePoint" : Math.round(employPoint/n),
            "approvedPoint" : Math.round(approvePoint/n),
        },
    }, {new: true} );

    return {task,result};

}

async function updateTaskImportanceLevel(taskId, employeeId, point, date) {
    // id la _id tháng trong evaluation trong task
    // trong data có điểm taskImportanceLevel và id của nhân viên cần chỉnh sửa
    // find task
    //console.log("ID ++++++++", taskId);
   
    var date = new Date(date);
    console.log("---------", date);

    // find task
    var task = await Task.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(taskId) }
        },
        {
            $unwind: "$evaluations"
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { taskId: "$_id" },{ startDate: "$startDate" },  { endDate: "$endDate" }, { status: "$status" }, "$evaluations"] } }
        },
        { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
        {$project:{
            "_id": 1,
        
            "compStartDate": { "$lte":["$startDate",date]},
            "compEndDate": {"$gte":["$endDate",date]}
            }},
            { $match: { 'compStartDate': true } },
            { $match: { "compEndDate": true } },

    ])
    console.log('taskkkk daayyy', task);
    var setPoint = await Task.findOneAndUpdate(
        {
            "evaluations._id": task[0]._id,
            "evaluations.results.employee": mongoose.Types.ObjectId(employeeId),
        },
        {
            $set: { "evaluations.$.results.$[elem].taskImportanceLevel": point }
        },
        {
            arrayFilters: [
                {
                    "elem.employee": employeeId
                }
            ]
        });
    return setPoint;
}

async function getResultTaskByMonth(data) {
    // data gồm : id ( id của kpi nhân viên), date(ngày hiện tại), employeeId : id của nhân viên
   // console.log("data ne", data.id);
    var date = await data.date.split("-");
    // var monthkpi = date[1];
    // var yearkpi = date[0];
    var date = new Date(data.date);
    console.log("tetete",date);
    var monthkpi = date.getMonth()+1;
    var yearkpi = date.getFullYear();
    var task = await Task.aggregate([
        {
            $match: { "evaluations.kpis.kpis":  mongoose.Types.ObjectId(data.id) }
        },
        {
            $unwind: "$evaluations"
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { startDate: "$startDate" }, { taskId: "$_id" }, { priority: "$priority" }, { endDate: "$endDate" }, { taskId: "$_id" }, { status: "$status" }, "$evaluations"] } }
        },
        { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
        { $unwind: "$results" },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { startDate: "$startDate" }, { endDate: "$endDate" },{ date: "$date" },{ taskId: "$_id" }, { priority: "$priority" }, { taskId: "$taskId" }, { status: "$status" }, "$results"] } }
        },
        { $match: { 'employee': mongoose.Types.ObjectId(data.employeeId)} },  
        {$project:{
            "name": 1,
            "startDate":1,
            "endDate": 1,
            "taskId" : 1,
            "priority": 1,
            "status" : 1,
            "role": 1,
            "automaticPoint" : 1,
             "employeePoint" : 1,
             "approvedPoint" : 1,
            "contribution": 1,
            "taskImportanceLevel": 1,
            "compStartDate": { "$lte":["$startDate",date]},
            "compEndDate": {"$gte":["$endDate",date]}
            }},
          { $match: { 'compStartDate': true } },
          { $match: { "compEndDate": true } },

    ]);
    
    console.log("task funcccc", task);
    return task;
}

// lay tat ca binh luan
exports.getAllComments = async(params) =>{
    var kpiPersonal = await KPIPersonal.findOne({_id: params.kpi}).populate([
        {path:"creator", model: User,select: 'name email avatar avatar' },
        {path: "comments.creator", model: User, select: 'name email avatar avatar'}
    ])
    return kpiPersonal.comments;
}
// thêm bình luận cho phê duyệt kpi

exports.createCommentOfApproveKPI = async (body) =>{
    var comment = await KPIPersonal.updateOne(
        { "_id" : body.employeeKpiId },
        {
            "$push": {
                "comments":{
                    creator: body.creator,
                    content: body.content,
                }
            }
        }
    )
    var kpiPersonal = await KPIPersonal.findOne({"_id": body.employeeKpiId}).populate([
        { path: "creator", model: User,select: 'name email avatar' },
        { path: "comments.creator", model: User, select: 'name email avatar '}
         
    ]).select("comments");
    // console.log(kpiPersonal.comments);
    return kpiPersonal.comments ;
}

// sửa bình luận 
exports.editCommentOfApproveKPI = async (params, body) =>{
    const now = new Date();
    var action = await KPIPersonal.updateOne(
        {"comments._id": params.id},
        {
            $set:
            {
                "comments.$[elem].content": body.content,
                "comments.$[elem].updateAt": now
            }
        },
        {
            arrayFilters: [
                {
                    "elem._id": params.id
                }
            ]
        }
        
    )
    var kpiPersonal = await KPIPersonal.findOne({"comments._id": params.id}).populate([
        { path: "creator", model: User,select: 'name email avatar' },
        { path: "comments.creator", model: User, select: 'name email avatar'},
       
    ]).select("comments")
    return kpiPersonal.comments;
}

// xoa binh luan 
exports.deleteCommentOfApproveKPI = async (params) => {
    var action = await KPIPersonal.update(
        { "comments._id": params.id },
        { $pull: { "comments" : {_id : params.id} } },
        { safe: true })
    
    var kpiPersonal = await KPIPersonal.findOne({_id: params.kpimember}).populate([
        { path: "creator", model: User,select: 'name email avatar' },
        { path: "comments.creator", model: User, select: 'name email avatar'},
        ]).select("comments");
    return kpiPersonal.comments ;    
}

// thêm bình luận cho bình luận

exports.createCommentOfComment = async (body) =>{
    var comment = await KPIPersonal.updateOne(
        { "comments._id" : body.commentId },
        {
            "$push": {
                "comments.$.comments":{
                    creator: body.creator,
                    content: body.content,
                }
            }
        }
    )
    var kpiPersonal = await KPIPersonal.findOne({"comments._id": body.commentId});
    console.log(kpiPersonal);
    return kpiPersonal ;
}

// sửa bình luận cua binh luan 
exports.editCommentOfComment = async (params, body) =>{
    const now = new Date();
    var action = await KPIPersonal.updateOne(
        {"comments.comments._id": params.id},
        {
            $set:
            {
                "comments.$.comments.$[elem].content": body.content,
                "comments.$.comments.$[elem].updateAt": now
            }
        },
        {
            arrayFilters: [
                {
                    "elem._id": params.id
                }
            ]
        }
        
    )
    var kpiPersonal = await KPIPersonal.findOne({"comments.comments._id": params.id}).populate([
        { path: "comments.creator", model: User,select: 'name email avatar' },
        { path: "comments.comments.creator", model: User, select: 'name email avatar'},
       
    ]).select("comments")
    return kpiPersonal.comments;
}

// xoa binh luan cua binh luan
exports.deleteCommentOfComment = async (params) => {
    var action = await KPIPersonal.update(
        { "comments.comments._id": params.id },
        { $pull: { "comments.$.comments" : {_id : params.id} } },
        { safe: true })
    
    var kpiPersonal = await KPIPersonal.findOne({_id: params.kpimember}).populate([
        { path: "comments.creator", model: User,select: 'name email avatar' },
        { path: "comments.comments.creator", model: User, select: 'name email avatar'},
        ]).select("comments");
    return kpiPersonal.comments ;    
}