const EmployeeKPISet = require('../../../../models/kpi/employeeKpiSet.model');
const OrganizationalUnit = require('../../../../models/super-admin/organizationalUnit.model');
const Task = require('../../../../models/task/task.model');
const EmployeeKPI = require('../../../../models/kpi/employeeKpi.model');
const User = require('../../../../models/auth/user.model')
const mongoose = require("mongoose");

/**
 * Lấy tất cả tập KPI hiện tại
 * @param {*} data 
 */

exports.getEmployeeKPISets = async (data) => {
    let department = await OrganizationalUnit.findOne({
        $or: [
            { 'deans': data.roleId },
            { 'viceDeans': data.roleId },
            { 'employees': data.roleId }
        ]
    });

    let employeeKpiSets;
    let startDate;
    let endDate;
    let startdate = null;
    let enddate = null;
    let status = null;

    if (data.startDate) {
        startDate = data.startDate.split("-");
        startdate = new Date(startDate[1], startDate[0], 0);
    }
    if (data.endDate) {
        endDate = data.endDate.split("-");
        enddate = new Date(endDate[1], endDate[0], 28);
    }
    if (data.status) status = parseInt(data.status);

    let keySearch = {
        organizationalUnit: {
            $in: department._id
        }
    }
    if (data.user) {
        keySearch = {
            ...keySearch,
            creator: {
                $in: data.user
            }
        }
    }
    if (status !== -1 && status !== null && status !== 5) {
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
    employeeKpiSets = await EmployeeKPISet.find(keySearch)
        .skip(0).limit(12)
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ]);
    return employeeKpiSets;
}

/**
 * Lấy tất cả kpi theo tháng
 * @param {*} data.userId : id nhân viên
 * @param {*} data.date : tháng
 */

exports.getKpisByMonth = async (data) => {
    let date = data.date.split("-");
    let month = new Date(date[1], date[0], 0);
    let employeeKpiSets = await EmployeeKPISet.findOne({ creator: data.userId, date: month })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ]);
    return employeeKpiSets;
}

/**
 * Phê duyệt tất cả các kpi
 * @param {*} id id của kpi set
 */

exports.approveAllKpis = async (id) => {
    let kpipersonal = await EmployeeKPISet.findByIdAndUpdate(id, { $set: { status: 2 } }, { new: true });
    let targets;
    if (kpipersonal.kpis) targets = kpipersonal.kpis;
    if (targets !== []) {
        targets = await Promise.all(targets.map(async (item) => {
            let defaultT = await EmployeeKPI.findByIdAndUpdate(item._id, { $set: { status: 1 } }, { new: true })
            return defaultT;
        }))
    }
    kpipersonal = await kpipersonal.populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();
    return kpipersonal;
}

/**
 * Chỉnh sửa trạng thái cho mỗi kpi
 * @param {*} data.id: id của kpi con
 * @param {*} status: trạng thái
 */

exports.editStatusKpi = async (data, query) => {
    let target = await EmployeeKPI.findByIdAndUpdate(data.id, { $set: { status: query.status } }, { new: true });
    let kpipersonal = await EmployeeKPISet.findOne({ kpis: { $in: data.id } }).populate("kpis");
    let kpis = kpipersonal.kpis;
    let checkFullApprove = 2;
    await kpis.map(item => {
        if (!item.status) {

            if (parseInt(query.status) === 1) {
                checkFullApprove = 1;
            } else {
                checkFullApprove = 0;
            }
        }
        return true;
    })
    kpipersonal = await EmployeeKPISet.findByIdAndUpdate(kpipersonal._id, { $set: { status: checkFullApprove } }, { new: true })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpipersonal;
}

/**
 * Chỉnh sửa thông tin kpi
 * @param {*} id id kpi con
 * @param {*} data thông tin chỉnh sửa
 */

exports.editKpi = async (id, data) => {
    let objUpdate = {
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    }
    let target = await EmployeeKPI.findByIdAndUpdate(id, { $set: objUpdate }, { new: true }).populate("parent");
    return target;
}

/**
 * Lấy kpi theo id của kpi set
 * @param {*} id id của kpi con
 */

exports.getKpisByKpiSetId = async (id) => {
    let kpipersonal = await EmployeeKPISet.findById(id)
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ])
    return kpipersonal;
}

/**
 * Lấy tất cả công việc theo Id của kpi
 * @param {*} data 
 */

exports.getTasksByKpiId = async (data) => {
    let task = await getResultTaskByMonth(data);

    for (let i = 0; i < task.length; i++) {
        let date1 = await task[i].preEvaDate;
        let date2 = await task[i].date;
        let difference_In_Time = await date2.getTime() - date1.getTime();
        let daykpi = await Math.ceil(difference_In_Time / (1000 * 3600 * 24));

        if (daykpi > 30)
            daykpi = 30;
        task[i].taskImportanceLevelCal = await Math.round(3 * (task[i].priority / 3) + 3 * (task[i].results.contribution / 100) + 4 * (daykpi / 30));

        if (task[i].results.taskImportanceLevel === -1 || task[i].results.taskImportanceLevel === null)
            task[i].results.taskImportanceLevel = await task[i].taskImportanceLevelCal;
        task[i].daykpi = await daykpi;
    }
    return task;
}

/**
 * Chấm điểm độ quan trọng của công việc
 * @param {*} id id kpi con
 * @param {*} kpiType 
 * @param {*} data 
 */

exports.setTaskImportanceLevel = async (id, kpiType, data) => {

    let date = new Date(data[0].date);
    for (const element of data) {
        let setPoint = await updateTaskImportanceLevel(element.taskId, element.employeeId, parseInt(element.point), element.date);
    };
    let key = {
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
    for (element of task) {

        autoPoint += element.results.automaticPoint * element.results.taskImportanceLevel;
        approvePoint += element.results.approvedPoint * element.results.taskImportanceLevel;
        employPoint += element.results.employeePoint * element.results.taskImportanceLevel;
        sumTaskImportance += element.results.taskImportanceLevel;

        let date1 = element.preEvaDate;
        let date2 = element.date;
        let difference_In_Time = date2.getTime() - date1.getTime();
        let daykpi = Math.ceil(difference_In_Time / (1000 * 3600 * 24));
        if (daykpi > 30) daykpi = 30;
        element.taskImportanceLevelCal = Math.round(3 * (element.priority / 3) + 3 * (element.results.contribution / 100) + 4 * (daykpi / 30));
        if (element.results.taskImportanceLevel === -1 || element.results.taskImportanceLevel === null)
            element.results.taskImportanceLevel = element.taskImportanceLevelCal;
        element.daykpi = daykpi;

    }
    let n = task.length;
    let result = await EmployeeKPI.findByIdAndUpdate(id, {
        $set: {
            "automaticPoint": Math.round(autoPoint / sumTaskImportance),
            "employeePoint": Math.round(employPoint / sumTaskImportance),
            "approvedPoint": Math.round(approvePoint / sumTaskImportance),
        },
    }, { new: true });

    let autoPointSet = 0;
    let employeePointSet = 0;
    let approvedPointSet = 0;
    let kpiSet = await EmployeeKPISet.findOne({ kpis: result._id });

    for (let i = 0; i < kpiSet.kpis.length; i++) {
        let kpi = await EmployeeKPI.findById(kpiSet.kpis[i]);
        if (kpi.automaticPoint !== 0 && kpi.automaticPoint !== null) {
            let weight = kpi.weight / 100;
            autoPointSet = kpi.automaticPoint * weight;
            employeePointSet = kpi.employeePoint * weight;
            approvedPointSet = kpi.approvedPoint * weight;
        } else {
            autoPointSet = -1;
        }
    };
    if (autoPointSet !== -1) {
        let updateKpiSet = await EmployeeKPISet.findByIdAndUpdate(kpiSet._id, {
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
    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
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
    let date = new Date(data.date);
    let kpiType;
    if (data.kpiType === "1") {
        kpiType = "Accountable";
    } else if (data.kpiType === "2") {
        kpiType = "Consulted";
    } else {
        kpiType = "Responsible";
    }

    let monthkpi = parseInt(date.getMonth() + 1);
    let yearkpi = parseInt(date.getFullYear());


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


    let task = await Task.aggregate(conditions);

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
