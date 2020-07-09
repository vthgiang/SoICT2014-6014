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
            { 'deans': data.role },
            { 'viceDeans': data.role },
            { 'employees': data.role }
        ]
    });

    var kpipersonals;
    var startDate;
    var endDate;
    var startdate = null;
    var enddate = null;
    var status = null;

    if (data.startDate !== 'null') {
        startDate = data.startDate.split("-");
        startdate = new Date(startDate[1], startDate[0], 0);
    }
    if (data.endDate !== 'null') {
        endDate = data.endDate.split("-");
        enddate = new Date(endDate[1], endDate[0], 28);
    }
    if (data.status !== 'null') status = parseInt(data.status);

    var keySearch = {
        organizationalUnit: {
            $in: department._id
        }
    }
    if (data.user !== 'null') {
        keySearch = {
            ...keySearch,
            creator: {
                $in: data.user
            }

        }
    }
    if (status !== null && status !== 5) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status
            }

        }
    }
    if (startdate !== null && enddate !== null) {
        keySearch = {
            ...keySearch,

            date: { "$gte": startdate, "$lt": enddate }

        }
    }
    if (startdate !== null && enddate === null) {
        keySearch = {
            ...keySearch,
            date: {
                $gte: startdate,
            }
        }
    }
    if (enddate !== null && startdate === null) {
        keySearch = {
            ...keySearch,
            date: {
                $lt: enddate,
            }
        }
    }
    kpipersonals = await KPIPersonal.find(keySearch)
        .skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
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
    return kpipersonal;
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
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            {path: 'comments.creator', model: User,select: 'name email avatar '},
            {path: 'comments.comments.creator',model: User,select: 'name email avatar'}
        ])
    return kpipersonal;
}

exports.getTaskById = async (data) => {
    //data :kpis_id, emloyeeId, date, role
    // tìm kiếm các công việc cần được đánh giá trong tháng
    var task = await getResultTaskByMonth(data);
    // tính điểm taskImportanceLevel:2
    console.log('rrreerr', task);
  
    for(let i = 0; i < task.length; i++){
        var date1 = await task[i].preEvaDate;
        var date2 = await task[i].date;
        var Difference_In_Time = await date2.getTime() - date1.getTime();
        var daykpi = await Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
        if(daykpi>30) daykpi = 30;
        console.log('daykpi = ', daykpi);
        task[i].taskImportanceLevelCal = await Math.round(3 * (task[i].priority / 3) + 3 * (task[i].results.contribution / 100) + 4 * (daykpi / 30));
        if (task[i].results.taskImportanceLevel === -1 || task[i].results.taskImportanceLevel === null)
            task[i].results.taskImportanceLevel =  await task[i].taskImportanceLevelCal;
        task[i].daykpi =await daykpi;
       
       }
   
   
    console.log("----", task);
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

exports.setTaskImportanceLevel = async (id, kpiType, data) => {
    // data body co taskId, date, point, employeeId
    // id là id của employee kpi
    console.log(data);
    var date = new Date(data[0].date);
    //var daykpi = 30;
    for (const element of data) {
        var setPoint = await updateTaskImportanceLevel(element.taskId, element.employeeId, parseInt(element.point), element.date);
    };
    // tinh diem kpi ca nhan 
    var key = {
        id: id,
        date: data[0].date,
        employeeId: data[0].employeeId,
        kpiType: kpiType
    }
    let task = await getResultTaskByMonth(key);
    let autoPoint = 0;
    let approvePoint = 0;
    let employPoint = 0;
    let sumTaskImportance = 0;
    let priority;
   // console.log('taskkkk', task);
    //console.log('#######', task);
    // từ độ quan trọng của cv, ta tính điểm kpi theo công thức : Giả sử có việc A, B, C  hệ số là 5, 6, 7 Thì điểm là (A*3 + B*6 + C*9 + D*2)/18
    for (element of task) {
        
        autoPoint += element.results.automaticPoint * element.results.taskImportanceLevel;
        approvePoint += element.results.approvedPoint * element.results.taskImportanceLevel;
        employPoint += element.results.employeePoint * element.results.taskImportanceLevel;
        sumTaskImportance += element.results.taskImportanceLevel;

        // tinh so ngay thuc hien : daykpi
        var date1 = element.preEvaDate;
        var date2 = element.date;
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var daykpi = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
        //console.log('daykpi = ', daykpi);
        if(daykpi > 30) daykpi = 30;
        element.taskImportanceLevelCal = Math.round(3 * (element.priority / 3) + 3 * (element.results.contribution / 100) + 4 * (daykpi / 30));
        if (element.results.taskImportanceLevel === -1 || element.results.taskImportanceLevel === null)
            element.results.taskImportanceLevel = element.taskImportanceLevelCal;
        element.daykpi = daykpi;

    }
    //console.log('#######', task);
    
    //update diem kpi  (employeeKpi)
    var n = task.length;
    var result = await DetailKPIPersonal.findByIdAndUpdate(id, {
        $set: {
            "automaticPoint": Math.round(autoPoint / sumTaskImportance),
            "employeePoint": Math.round(employPoint / sumTaskImportance),
            "approvedPoint": Math.round(approvePoint / sumTaskImportance),
        },
    }, { new: true });

    // update diem kpi thang (employeeKpiSet)
    /* 
        từ kpi hiện tại  tìm ra kpi toàn tháng
        từ kpi toàn tháng, duyệt mảng kpis để tìm các kpi trong tháng
        từ các kpi trong tháng tính các điểm
        nếu kpi nào chưa có điểm thì break;
    */
    let autoPointSet = 0;
    let employeePointSet = 0;
    let approvedPointSet = 0;
    var kpiSet = await KPIPersonal.findOne({kpis : result._id});

    for(let i = 0; i < kpiSet.kpis.length; i++){
        let kpi = await DetailKPIPersonal.findById(kpiSet.kpis[i]);
        if(kpi.automaticPoint !== 0 && kpi.automaticPoint !== null){
            let weight = kpi.weight/100;
            autoPointSet = kpi.automaticPoint * weight;
            employeePointSet = kpi.employeePoint * weight;
            approvedPointSet = kpi.approvedPoint * weight;
        }else{
            autoPointSet = -1;
        }
    };
    if(autoPointSet !== -1){
        var updateKpiSet = await KPIPersonal.findByIdAndUpdate(kpiSet._id, {
            $set: {
                "automaticPoint": Math.round(autoPointSet),
                "employeePoint": Math.round(employeePointSet),
                "approvedPoint": Math.round(approvedPointSet),
            },
        }, { new: true });
    }

    return { task, result };

}

async function updateTaskImportanceLevel(taskId, employeeId, point, date) {
    // id la _id tháng trong evaluation trong task
    // trong data có điểm taskImportanceLevel và id của nhân viên cần chỉnh sửa
    // find task

    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    // find task
    var task = await Task.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(taskId) }
        },
        {
            $unwind: "$evaluations"
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { taskId: "$_id" }, { startDate: "$startDate" }, { endDate: "$endDate" }, { status: "$status" }, "$evaluations"] } }
        },
        { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
        { $match: { month: month } },
        { $match: { year: year } }
    ])
    // console.log('taskkkk daayyy', task);
    if (task.length !== 0) {
        var setPoint = await Task.findOneAndUpdate(
            {
                "evaluations._id": task[0]._id
            },
            {
                $set: { "evaluations.$.results.$[elem].taskImportanceLevel": point }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": employeeId,
                    }
                ]
            });
    }
    return setPoint;
}

async function getResultTaskByMonth(data) {
    // data gồm : id ( id của kpi nhân viên), date(ngày hiện tại), employeeId : id của nhân viên
    // console.log("data ne", data.id);
    var date = new Date(data.date);
    let kpiType;
    if (data.kpiType === "1") {
        kpiType = "Accountable";
    } else if (data.kpiType === "2") {
        kpiType = "Consulted";
    } else {
        kpiType = "Responsible";
    }

    var monthkpi = parseInt(date.getMonth() + 1);
    var yearkpi = parseInt(date.getFullYear());
    

    let conditions = [
        {
            $unwind: "$evaluations"
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { startDate: "$startDate" }, { taskId: "$_id" }, { priority: "$priority" }, { endDate: "$endDate" }, { taskId: "$_id" }, { status: "$status" }, "$evaluations"] } }
        },
        { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
        { $unwind: "$results" },
        { $match: { 'results.employee': mongoose.Types.ObjectId(data.employeeId) } },
        { $match: { "results.role": kpiType } },
        { $match: { "month": monthkpi } },
        { $match: { "year": yearkpi } },
    ]
    if (kpiType === "Responsible") {
        conditions.unshift({
            $match: { "evaluations.kpis.kpis": mongoose.Types.ObjectId(data.id) }
        });
    }


    var task = await Task.aggregate(conditions);

    for (let i = 0; i < task.length; i++) {
        let x = task[i];
        let date = await new Date(x.date);
        let startDate = await new Date(x.startDate);

        let month = await date.getMonth() + 1;
        let year = await date.getFullYear();
        let startMonth = await startDate.getMonth() + 1;

        if (month === startMonth) {
            task[i].preEvaDate = startDate;
        } else {
            let preEval = await Task.aggregate([
                {
                    $match: { "_id": mongoose.Types.ObjectId(x.taskId) },
                },
                {
                    $unwind: "$evaluations"
                },
                {
                    $replaceRoot: { newRoot: "$evaluations" }
                },
                { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
                { $match: { "month": month - 1 } },
                { $match: { "year": year } },
            ]);
            task[i].preEvaDate = await preEval[0].date;
        }
    }
    return task;
}
