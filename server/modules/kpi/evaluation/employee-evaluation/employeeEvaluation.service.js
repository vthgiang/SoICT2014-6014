const KPIPersonal = require('../../../../models/kpi/employeeKpiSet.model');
const Department = require('../../../../models/super-admin/organizationalUnit.model');
const Task = require('../../../../models/task/task.model');
const DetailKPIPersonal = require('../../../../models/kpi/employeeKpi.model')
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
        } else if (status === 4) {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                status: { $ne: 3 },
                date: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        } else {
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
        } else if (status === 4) {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                creator: data.user,
                status: { $ne: 3 },
                date: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        } else {
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

<<<<<<< HEAD
exports.getTaskById = async (id,data) => {
    // var task = await Task.find({'evaluations.kpis.kpis': id}) 
    // .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees results parent taskTemplate creator" });
    var date = data.date.split("-");
    var month = new Date(date[1], date[0], 0);
    var task = await Task.aggregate([
        {
            $match: { "evaluations.kpis.kpis": mongoose.Types.ObjectId(id) }
        },
        {
            $unwind: "$evaluations"
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { startDate: "$startDate" }, { endDate: "$endDate" }, { taskID: "$_id" }, { status: "$status" }, "$evaluations"] } }
        },
        { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
        { $match: { month: 5 } },
        { $match: { year: 2020 } },
        { $unwind: "$results" },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { startDate: "$startDate" }, { endDate: "$endDate" }, { taskID: "$taskID" }, { status: "$status" }, "$results"] } }
        },
        { $match: { employee: mongoose.Types.ObjectId(id) } },
        { $match: { role: "Responsible" } },
        {
            $lookup: {
                from: "users",
                localField: "employee",
                foreignField: "_id",
                as: "employee"

            }
        },
        { $unwind: "$employee" }

    ]);


=======
exports.getTaskById= async (data) =>{
    // var task = await Task.find({'evaluations.kpis.kpis': id}) 
    // .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees results parent taskTemplate creator" });
    var date = data.date.split("-");
    var monthkpi = parseInt( date[1]);
    var yearkpi= parseInt(date[0]);
    var task = await Task.aggregate([
        {
            $match: {"evaluations.kpis.kpis" :  mongoose.Types.ObjectId(data.id)}
           },
         {
             $unwind: "$evaluations"
           },
         {
             $replaceRoot:{newRoot: {$mergeObjects: [{name: "$name"},{startDate : "$startDate"},{endDate: "$endDate"},{taskID : "$_id"},{status : "$status"}, "$evaluations"]}}
             },
         {$addFields: {  "month" : {$month: '$date'}, "year" : {$year : '$date'}}},
         {$match: { month: monthkpi}},
         {$match: {year: yearkpi}},
         {$unwind:"$results"},
         {
             $replaceRoot:{newRoot: {$mergeObjects: [{name: "$name"},{startDate : "$startDate"},{endDate: "$endDate"},{taskID : "$taskID"},{status : "$status"}, "$results"]}}
             },
            {
                $lookup: {
                     from: "users",
                     localField: "employee",
                        foreignField: "_id",
                     as: "employee"
                    
                    }
                },
               {$unwind : "$employee"}
        
           ])
    
>>>>>>> a4dde5c309a3aef7704aa3bd70eeb7b35a0f0bed
    return task
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
// id, date id_employee, role, point
/* 
    var date = data.date.split("-");
    var month = new Date(date[1], date[0], 0);
    var kpipersonals = await KPIPersonal.findOne({ creator: data.id, date: month })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpipersonals;
*/
exports.setTaskImportanceLevel = async (id, data) => {
    console.log(data);
    var result = []; 
    for(const element of data){
        // find task
        console.log("ID ++++++++", element.taskId);
        var date = await element.date.split("-");
        console.log("---------", date);

        var task = await Task.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(element.taskId) }
            },
            {
                $unwind: "$evaluations"
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { taskID: "$_id" }, { status: "$status" }, "$evaluations"] } }
            },
            { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
            { $match: { month: 5 } },
            { $match: { year: 2020 } },

        ])
        // ket qua tra ve la mang 1 phan tu
        console.log("taskkkkk", task[0]._id);

        // update taskImportanceLevel

        var setPoint = await Task.findOneAndUpdate(
            {
                "evaluations._id": task[0]._id,
                "evaluations.results.employee": "5eacf3666bf8ee5458811b89",
            },
            {
                $set: { "evaluations.$.results.$[elem].taskImportanceLevel": element.point }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": element.employeeId
                    }
                ]
            });
      await result.push(setPoint);
    };
    // tinh diem kpi ca nhan 

    return result;

}



