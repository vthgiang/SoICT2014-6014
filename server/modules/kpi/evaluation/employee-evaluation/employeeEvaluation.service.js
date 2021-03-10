const Models = require(`../../../../models`);
const { EmployeeKpiSet, OrganizationalUnit, Task, EmployeeKpi, User } = Models;
const mongoose = require("mongoose");
const { connect } = require(`../../../../helpers/dbHelper`);
const NotificationServices = require(`../../../notification/notification.service`);

/**
 * Lấy tất cả tập KPI hiện tại
 * @param {*} data 
 */

exports.getEmployeeKPISets = async (portal, data) => {
    let keySearch;
    let employeeKpiSets, department;
    let status = null;
    let user = data.user && data.user.length !== 0 ? data.user : null;
    let approver = data.approver && data.approver.length !== 0 ? data.approver : null;

    if (!data.organizationalUnit) {
        department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({
                $or: [
                    { 'managers': data.roleId },
                    { 'deputyManagers': data.roleId },
                    { 'employees': data.roleId }
                ]
            });
    }


    if (data.status) status = parseInt(data.status);

    if (department) {
        keySearch = {
            organizationalUnit: {
                $in: department._id
            }
        }
    } else {
        keySearch = {
            organizationalUnit: {
                $in: data.organizationalUnit
            }
        }
    }

    if (user) {
        keySearch = {
            ...keySearch,
            creator: {
                $in: user
            }
        }
    }

    if (approver) {
        keySearch = {
            ...keySearch,
            approver: {
                $in: approver
            }
        }
    }

    if (status !== -1 && status && status !== 5 || status === 0) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status
            }
        }
    }

    if (data && data.startDate && data.endDate) {
        data.endDate = new Date(data.endDate);
        data.endDate.setMonth(data.endDate.getMonth() + 1);

        keySearch = {
            ...keySearch,
            date: { "$gte": new Date(data.startDate), "$lt": data.endDate }
        }
    }
    else if (data && data.startDate) {
        keySearch = {
            ...keySearch,
            date: {
                $gte: new Date(data.startDate),
            }
        }
    }
    else if (data && data.endDate) {
        data.endDate = new Date(data.endDate);
        data.endDate.setMonth(data.endDate.getMonth() + 1);

        keySearch = {
            ...keySearch,
            date: {
                $lt: data.endDate,
            }
        }
    }

    let perPage = 100;
    let page = 1;
    if (data?.page) {
        page = Number(data.page);
    }
    if (data?.perPage) {
        perPage = Number(data.perPage)
    }

    employeeKpiSets = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .find(keySearch)
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate("organizationalUnit")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({path: "approver", select :"_id name email avatar"})
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ]);

    let totalCount = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let totalPages = Math.ceil(totalCount / perPage);

    return {
        employeeKpiSets,
        totalCount,
        totalPages
    };
}

/**
 * Lấy tất cả kpi theo tháng
 * @param {*} data.userId : id nhân viên
 * @param {*} data.date : tháng
 */

exports.getKpisByMonth = async (portal, data) => {
    let date = data.date.split("-");
    let month = new Date(date[1], date[0], 0);
    let employeeKpiSets = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ creator: data.userId, date: month })
        .populate("organizationalUnit")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({path: "approver", select :"_id name email avatar"})
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ]);
    return employeeKpiSets;
}

/**
 * Phê duyệt tất cả các kpi
 * @param {*} id id của kpi set
 */

exports.approveAllKpis = async (portal, id, companyId) => {
    let employee_kpi_set = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: { status: 2 } }, { new: true });
    let targets;
    if (employee_kpi_set.kpis) targets = employee_kpi_set.kpis;
    if (targets !== []) {
        targets = await Promise.all(targets.map(async (item) => {
            let defaultT = await EmployeeKpi(connect(DB_CONNECTION, portal))
                .findByIdAndUpdate(item._id, { $set: { status: 1 } }, { new: true })
            return defaultT;
        }))
    }
    employee_kpi_set = employee_kpi_set && await employee_kpi_set
        .populate("organizationalUnit")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({path: "approver", select :"_id name email avatar"})
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .execPopulate();

    const date = (employee_kpi_set.date).getMonth() + 1;
    if (employee_kpi_set) {
        const dataNotify = {
            organizationalUnits: employee_kpi_set.organizationalUnit._id,
            title: "Phê duyệt KPI",
            level: "general",
            content: `<p><strong>${employee_kpi_set.approver.name}</strong> đã phê duyệt tất cả mục tiêu Kpi tháng <strong>${date}</strong> của bạn.</p>`,
            sender: `${employee_kpi_set.approver._id}`,
            users: [employee_kpi_set.creator._id],
            associatedDataObject: {
                dataType: 3,
                description: `<p><strong>${employee_kpi_set.approver.name}</strong> đã phê duyệt tất cả mục tiêu Kpi tháng <strong>${date}</strong> của bạn.</p>`
            }
        };

        NotificationServices.createNotification(portal, companyId, dataNotify)
    }
    return employee_kpi_set;
}

/**
 * Chỉnh sửa trạng thái cho mỗi kpi
 * @param {*} data.id: id của kpi con
 * @param {*} status: trạng thái
 */

exports.editStatusKpi = async (portal, data, query, companyId) => {
    let target = await EmployeeKpi(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(data.id, { $set: { status: query.status } }, { new: true });
    let employee_kpi_set = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ kpis: { $in: data.id } })
        .populate("kpis");
    let kpis = employee_kpi_set.kpis;
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
    employee_kpi_set = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(employee_kpi_set._id, { $set: { status: checkFullApprove } }, { new: true })

    employee_kpi_set = employee_kpi_set && await employee_kpi_set
        .populate("organizationalUnit")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({path: "approver", select :"_id name email avatar"})
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .execPopulate();

    if (employee_kpi_set) {
        const date = (employee_kpi_set.date).getMonth() + 1;
        let getKpiApprove = employee_kpi_set.kpis.filter(obj => obj._id.toString() === data.id.toString());
        getKpiApprove = getKpiApprove[0];

        let content = "";
        if (checkFullApprove === 2) {
            content = `<p><strong>${employee_kpi_set.approver.name}</strong> đã phê duyệt mục tiêu <strong>${getKpiApprove.name}</strong> thuộc tập Kpi tháng <strong>${date}</strong> của bạn.</p>`
        }
        if (checkFullApprove === 0) {
            content = `<p><strong>${employee_kpi_set.approver.name}</strong> đã hủy bỏ mục tiêu <strong>${getKpiApprove.name}</strong> thuộc tập Kpi tháng <strong>${date}</strong> của bạn.</p>`
        }
        const dataNotify = {
            organizationalUnits: employee_kpi_set.organizationalUnit._id,
            title: "Phê duyệt KPI",
            level: "general",
            content: content,
            sender: `${employee_kpi_set.approver._id}`,
            users: [employee_kpi_set.creator._id],
            associatedDataObject: {
                dataType: 3,
                description: content
            }
        };

        NotificationServices.createNotification(portal, companyId, dataNotify)
    }

    return employee_kpi_set;
}

/**
 * Chỉnh sửa thông tin kpi
 * @param {*} id id kpi con
 * @param {*} data thông tin chỉnh sửa
 */

exports.editKpi = async (portal, id, data) => {
    let objUpdate = {
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    }
    let target = await EmployeeKpi(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: objUpdate }, { new: true })

    target = target && await target.populate("parent").execPopulate();
    return target;
}

/**
 * Lấy kpi theo id của kpi set
 * @param {*} id id của kpi con
 */

exports.getKpisByKpiSetId = async (portal, id) => {
    let employee_kpi_set = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate("organizationalUnit")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({path: "approver", select :"_id name email avatar"})
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ]);

    return employee_kpi_set;
}

/**
 * Lấy tất cả công việc theo Id của kpi
 * @param {*} data 
 */
exports.getTasksByKpiId = async (portal, data) => {
    let task = await getResultTaskByMonth(portal, data);

    for (let i = 0; i < task.length; i++) {
        let date1 = task[i].startDate;
        let date2 = task[i].endDate;
        let difference_In_Time, daykpi;
        let priority = task[i].priority ? task[i].priority : 0;;
        let contribution = task[i].results.contribution ? task[i].results.contribution : 0;
        if (date1) {
            difference_In_Time = date2.getTime() - date1.getTime();
            daykpi = Math.ceil(difference_In_Time / (1000 * 3600 * 24));
        }

        if (daykpi && daykpi > 30) {
            daykpi = 30;
        } else if (!daykpi) {
            daykpi = 0;
        }
        task[i].taskImportanceLevelCal = Math.round(3 * (priority / 3) + 3 * (priority / 100) + 4 * (daykpi / 30));

        if (task[i].results.taskImportanceLevel === -1 || task[i].results.taskImportanceLevel === null)
            task[i].results.taskImportanceLevel = task[i].taskImportanceLevelCal;
        task[i].daykpi = daykpi;
    }
    return task;
}

/**
 * Chấm điểm độ quan trọng của công việc
 * @param {*} id id kpi con
 * @param {*} kpiType 
 * @param {*} data 
 */

exports.setTaskImportanceLevel = async (portal, id, kpiType, data) => {
    for (const element of data) {
        let setPoint = await updateTaskImportanceLevel(portal, element.taskId, element.employeeId, parseInt(element.point), element.date, element.role);
    };
    let key = {
        id: id,
        date: data[0].date,
        employeeId: data[0].employeeId,
        kpiType: kpiType
    }

    let task = await getResultTaskByMonth(portal, key);
    let autoPoint = 0;
    let approvePoint = 0;
    let employPoint = 0;
    let sumTaskImportance = 0;

    if (task.length) {
        for (element of task) {
            autoPoint += element.results.automaticPoint * element.results.taskImportanceLevel;
            approvePoint += element.results.approvedPoint * element.results.taskImportanceLevel;
            employPoint += element.results.employeePoint * element.results.taskImportanceLevel;
            sumTaskImportance += element.results.taskImportanceLevel;

            let date1 = element.startDate;
            let date2 = element.endDate;
            let difference_In_Time;

            if (date2 && date1) {
                difference_In_Time = date2.getTime() - date1.getTime();
                if (element.startDate === element.endDate) {
                    difference_In_Time = 1;
                }
            } else {
                difference_In_Time = 0;
            }

            let daykpi = Number.parseFloat(difference_In_Time / (1000 * 3600 * 24)).toFixed(2);
            if (daykpi > 30) daykpi = 30;
            element.taskImportanceLevelCal = Math.round(3 * (element.priority / 5) + 3 * (element.results.contribution / 100) + 4 * (daykpi / 30));
            if (element.results.taskImportanceLevel === -1 || element.results.taskImportanceLevel === null)
                element.results.taskImportanceLevel = element.taskImportanceLevelCal;
            element.daykpi = daykpi;
        }

    }
    else {
        autoPoint = 100;
        employPoint = 100;
        approvePoint = 100;
        sumTaskImportance = 1;
    }

    let result = await EmployeeKpi(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(
            id,
            {
                $set: {
                    "automaticPoint": Math.round(autoPoint / sumTaskImportance),
                    "employeePoint": Math.round(employPoint / sumTaskImportance),
                    "approvedPoint": Math.round(approvePoint / sumTaskImportance),
                },
            },
            { new: true }
        );
    let autoPointSet = 0;
    let employeePointSet = 0;
    let approvedPointSet = 0;
    let kpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).findOne({ kpis: result._id });
    for (let i = 0; i < kpiSet.kpis.length; i++) {
        let kpi = await EmployeeKpi(connect(DB_CONNECTION, portal)).findById(kpiSet.kpis[i]);

        let weight = kpi.weight / 100;
        autoPointSet += kpi.automaticPoint ? kpi.automaticPoint * weight : 0;
        employeePointSet += kpi.employeePoint ? kpi.employeePoint * weight : 0;
        approvedPointSet += kpi.approvedPoint ? kpi.approvedPoint * weight : 0;

    };

    let updateKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(kpiSet._id,
            {
                $set: {
                    "automaticPoint": Math.round(autoPointSet),
                    "employeePoint": Math.round(employeePointSet),
                    "approvedPoint": Math.round(approvedPointSet),
                },
            },
            { new: true }
        );



    return { task, result, updateKpiSet };

}

async function updateTaskImportanceLevel(portal, taskId, employeeId, point, date, role) {
    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var task = await Task(connect(DB_CONNECTION, portal))
        .aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(taskId) }
            },
            {
                $unwind: "$evaluations"
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { taskId: "$_id" }, { startDateTask: "$startDate" }, { endDateTask: "$endDate" }, { status: "$status" }, "$evaluations"] } }
            },
            { $addFields: { "month": { $month: '$evaluatingMonth' }, "year": { $year: '$evaluatingMonth' } } },
            { $match: { month: month } },
            { $match: { year: year } }
        ])
    if (task.length !== 0) {
        var setPoint = await Task(connect(DB_CONNECTION, portal))
            .findOneAndUpdate(
                {
                    "_id": taskId, "evaluations._id": task[0]._id
                },
                {
                    $set: { "evaluations.$.results.$[elem].taskImportanceLevel": point }
                },
                {
                    arrayFilters: [
                        {
                            "elem.employee": employeeId,
                            "elem.role": role
                        }
                    ]
                }
            );
    }
    return setPoint;
}

exports.getTasksByListKpis = async (portal, data) => {
    let listkpis = [], infosearch = [];
    for (let i = 0; i < data.length; i++) {

        let employee_kpi_set = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .findById(data[i])
            .populate({path: "creator", select :"_id name email avatar"})
            .populate({ path: "kpis" })
        listkpis.push(employee_kpi_set);
    }

    for (let i = 0; i < listkpis.length; i++) {
        infosearch.push([]);
        let kpis = listkpis[i].kpis;
        for (let j = 0; j < kpis.length; j++) {
            infosearch[infosearch.length - 1].push({ id: kpis[j]._id, employeeId: listkpis[i].creator._id, date: listkpis[i].date, kpiType: kpis[j].type })
        }
    }

    let listTask = [], tasks;
    for (let i = 0; i < infosearch.length; i++) {
        listTask.push([]);
        for (let j = 0; j < infosearch[i].length; j++) {
            listTask[listTask.length - 1].push([]);
            tasks = await getResultTaskByMonth(portal, infosearch[i][j]);
            let lastIndex = listTask[listTask.length - 1].length - 1;
            listTask[listTask.length - 1][lastIndex] = tasks;
        }

    }
    return listTask;
}

/**
 * 
 * @param {*} portal 
 * @param {*} data: Trong data có
 *  id của kpi (employeeKpi),
 *  date: tháng muốn lấy kết quả,
 *  employeeId: Id của nhân viên,
 *  kpiType: loại Kpi
 */
async function getResultTaskByMonth(portal, data) {

    let date = new Date(data.date);
    let monthkpi = parseInt(date.getMonth() + 1);
    let yearkpi = parseInt(date.getFullYear());
    let kpiType;
    if (data.kpiType === "1") {
        kpiType = "accountable";
    } else if (data.kpiType === "2") {
        kpiType = "consulted";
    } else {
        kpiType = "responsible";
    }

    let conditions = [
        {
            $match: { "evaluations.results.kpis": mongoose.Types.ObjectId(data.id) }
        },
        {
            $unwind: "$evaluations"
        },
        {
            $lookup: {
                from: "organizationalunits",
                localField: "organizationalUnit",
                foreignField: "_id",
                as: "organizationalUnitDetail"
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ name: "$name" }, { startDateTask: "$startDate" }, { taskId: "$_id" }, { priority: "$priority" }, { endDateTask: "$endDate" }, { taskId: "$_id" }, { status: "$status" }, { unit: "$organizationalUnitDetail" }, "$evaluations"] } }
        },
        { $addFields: { "month": { $month: '$evaluatingMonth' }, "year": { $year: '$evaluatingMonth' } } },
        { $unwind: "$results" },
        { $match: { "results.role": kpiType } },
        { $match: { 'results.employee': mongoose.Types.ObjectId(data.employeeId) } },
        { $match: { "month": monthkpi } },
        { $match: { "year": yearkpi } },
    ]



    let task = await Task(connect(DB_CONNECTION, portal)).aggregate(conditions);

    return task;
}
/**
 * 
 * @param {*} portal 
 * @param {*} idEmployee 
 * @param {*} idKpiSet 
 * @param {*} data: bao gồm:
 * kpis: danh sách các kpi con trong kipSet
 * date: tháng đang xét
 */

exports.setPointAllKpi = async (portal, idEmployee, idKpiSet, data) => {

    let kpis = data.kpis;
    let date = data.date;

    let autoPointSet = 0;
    let employeePointSet = 0;
    let approvedPointSet = 0;
    let listKpi = [];
    for (let i in kpis) {
        let obj = {
            id: kpis[i],
            date: date,
            employeeId: idEmployee,

        }
        let kpiCurrent = await EmployeeKpi(connect(DB_CONNECTION, portal)).findById(kpis[i]);
        let task = await getResultTaskByMonth(portal, obj);
        let automaticPoint = 0;
        let approvedPoint = 0;
        let employeePoint = 0;
        let sumTaskImportance = 0;
        if (task.length) {
            for (let j in task) {
                let date1 = task[j].startDate;
                let date2 = task[j].endDate;
                let difference_In_Time;
                let taskImportanceLevel = task[j].results.taskImportanceLevel;

                if (date2 && date1) {
                    difference_In_Time = date2.getTime() - date1.getTime();
                    if (task[j].startDate === task[j].endDate) {
                        difference_In_Time = 1;
                    }
                } else {
                    difference_In_Time = 0;
                }

                let daykpi = Number.parseFloat(difference_In_Time / (1000 * 3600 * 24)).toFixed(2);
                if (daykpi > 30) daykpi = 30;
                task[j].taskImportanceLevelCal = Math.round(3 * (task[j].priority / 3) + 3 * ((task[j].results.contribution ? task[j].results.contribution : 0) / 100) + 4 * (daykpi / 30));

                if (task[j].results.taskImportanceLevel === -1 || task[j].results.taskImportanceLevel === null)
                    task[j].results.taskImportanceLevel = task[j].taskImportanceLevelCal;
                task[j].daykpi = daykpi;

                // update taskImportanceLevel

                let taskImportance = task[j].results.taskImportanceLevel;
                if (isNaN(taskImportance) || taskImportance === -1) {

                    taskImportance = task[j].taskImportanceLevelCal;
                    let role;
                    if (kpiCurrent.type === "1") {
                        role = "accountable";
                    } else if (kpiCurrent.type === "2") {
                        role = "consulted";
                    } else {
                        role = "responsible";
                    }
                    let update = await updateTaskImportanceLevel(portal, task[j].id, idEmployee, task[j].taskImportanceLevelCal, date, role)

                }
                automaticPoint += task[j].results.automaticPoint ? task[j].results.automaticPoint : 0 * taskImportance;
                approvedPoint += task[j].results.approvedPoint ? task[j].results.approvedPoint : 0 * taskImportance;
                employeePoint += task[j].results.employeePoint ? task[j].results.employeePoint : 0 * taskImportance;
                sumTaskImportance += taskImportance;



            }
        }
        else {
            automaticPoint = 100;
            approvedPoint = 100;
            employeePoint = 100;
            sumTaskImportance = 1;
        }


        let kpi = await EmployeeKpi(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                kpis[i],
                {
                    $set: {
                        "automaticPoint": Math.round(automaticPoint / sumTaskImportance),
                        "employeePoint": Math.round(employeePoint / sumTaskImportance),
                        "approvedPoint": Math.round(approvedPoint / sumTaskImportance),
                    },
                },
                { new: true }
            );

        let weight = kpi.weight / 100;
        autoPointSet += kpi.automaticPoint ? kpi.automaticPoint * weight : 0;
        employeePointSet += kpi.employeePoint ? kpi.employeePoint * weight : 0;
        approvedPointSet += kpi.approvedPoint ? kpi.approvedPoint * weight : 0;


    }

    let updateKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(idKpiSet,
            {
                $set: {
                    "automaticPoint": Math.round(autoPointSet),
                    "employeePoint": Math.round(employeePointSet),
                    "approvedPoint": Math.round(approvedPointSet),
                },
            },
            { new: true }
    ).populate("organizationalUnit")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ]);

    return updateKpiSet;



}