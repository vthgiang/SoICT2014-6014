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
            status:  status
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
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .populate({ path: "logs.creator", select: "_id name email avatar" })

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
    let { userId, date } = data;

    date = new Date(date);
    nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + 1);

    let employeeKpiSets = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ 
            creator: userId, 
            date: {
                $gte: date, $lt: nextDate
            } 
        })
        .populate("organizationalUnit")
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .populate({ path: "logs.creator", select: "_id name email avatar" })

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
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .populate({ path: "logs.creator", select: "_id name email avatar" })
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
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .populate({ path: "logs.creator", select: "_id name email avatar" })
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

    return {
        kpimembers: employee_kpi_set,
        target: target
    }
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

    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ kpis: { $in: [mongoose.Types.ObjectId(id)] }})
        .populate("organizationalUnit ")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({path: "approver", select :"_id name email avatar"})
        .populate({ path: "logs.creator", select: "_id name email avatar" })

    return {
        target,
        employeeKpiSet
    };
}

/**
 * Lấy kpi theo id của kpi set
 * @param {*} id id của kpi con
 */

exports.getKpisByKpiSetId = async (portal, id) => {
    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate("organizationalUnit")
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .populate({ path: "logs.creator", select: "_id name email avatar" })

        for (let i = 0; i < employeeKpiSet?.kpis?.length; i++) {
        let data = {
            id: employeeKpiSet?.kpis?.[i]?._id,
            employeeId: employeeKpiSet?.creator?._id,
            date: employeeKpiSet?.date,
            kpiType: employeeKpiSet?.kpis?.[i]?.type
        }
        let task = await getResultTaskByMonth(portal, data);

        employeeKpiSet.kpis[i] = employeeKpiSet.kpis[i].toObject();
        employeeKpiSet.kpis[i].amountTask = task?.length;
    }

    return employeeKpiSet;
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

    // Cập nhật điểm KPI tuần
    let currentDate = new Date(data?.[0]?.date)
    let currentMonth = currentDate?.getMonth()
    let currentYear = currentDate?.getFullYear()
    let week1 = setPointForWeek(task, "week1", new Date(currentYear, currentMonth, 2), new Date(currentYear, currentMonth, 9)) // ví dụ: new Date(2021,3,2) = 0h0'0 1/4/2021, new Date(2021,3,9) = 0h0'0 8/4/2021
    let week2 = setPointForWeek(task, "week2", new Date(currentYear, currentMonth, 9), new Date(currentYear, currentMonth, 16)) // ví dụ: new Date(2021,3,9) = 0h0'0 8/4/2021, new Date(2021,3,16) = 0h0'0 15/4/2021
    let week3 = setPointForWeek(task, "week3", new Date(currentYear, currentMonth, 16), new Date(currentYear, currentMonth, 23)) // ví dụ: new Date(2021,3,16) = 0h0'0 15/4/2021, new Date(2021,3,23) = 0h0'0 21/4/2021
    let week4 = setPointForWeek(task, "week4", new Date(currentYear, currentMonth, 23), new Date(currentYear, currentMonth + 1, 2)) // ví dụ: new Date(2021,3,23) = 0h0'0 21/4/2021, new Date(2021,4,2) = 0h0'0 1/5/2021
    let resultWeek = [week1, week2, week3, week4]
    await EmployeeKpi(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(
            id,
            {
                $set: {
                    weeklyEvaluations: resultWeek
                },
            },
            { new: true }
        );

    // Tính điểm KPI tháng
    let autoPoint = 0;
    let approvePoint = 0;
    let employPoint = 0;
    let sumTaskImportance = 0;
    let totalWeight = 0;
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
        autoPoint = 0;
        employPoint = 0;
        approvePoint = 0;
        sumTaskImportance = 1;
    }

    // Cập nhật điểm KPI tháng
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
    // Cập nhật số công việc của kpi để hiển thị giao diện
    result = result.toObject()
    result.amountTask = task?.length

    // Cập nhật điểm tập KPI tháng
    let autoPointSet = 0;
    let employeePointSet = 0;
    let approvedPointSet = 0;
    let weeklyEvaluations = {}
    let kpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).findOne({ kpis: result._id });
    for (let i = 0; i < kpiSet.kpis.length; i++) {
        let kpi = await EmployeeKpi(connect(DB_CONNECTION, portal)).findById(kpiSet.kpis[i]);
        let weight = kpi.weight / 100;
        // Tính điểm KPI tháng cho tập KPI
        autoPointSet += kpi.automaticPoint ? kpi.automaticPoint * weight : 0;
        employeePointSet += kpi.employeePoint ? kpi.employeePoint * weight : 0;
        approvedPointSet += kpi.approvedPoint ? kpi.approvedPoint * weight : 0;

        // Tính điểm KPI tuần cho tập KPI
        if (kpi?.weeklyEvaluations?.length > 0) {
            kpi.weeklyEvaluations.map(item => {
                if (!weeklyEvaluations[item.title]) {
                    weeklyEvaluations[item.title] = {
                        automaticPoint: 0,
                        employeePoint: 0,
                        approvedPoint: 0
                    }
                }
                weeklyEvaluations[item.title].automaticPoint += item.automaticPoint ? item.automaticPoint * weight : 0;
                weeklyEvaluations[item.title].employeePoint += item.employeePoint ? item.employeePoint * weight : 0;
                weeklyEvaluations[item.title].approvedPoint += item.approvedPoint ? item.approvedPoint * weight : 0;
            })
        }
    };

    // Mảng các đánh giá tuần cho tập KPI
    let titleWeeklyEvaluations = Object.keys(weeklyEvaluations)
    let weeklyEvaluationsOfKpiSet = []
    if (titleWeeklyEvaluations?.length > 0) {
        titleWeeklyEvaluations.map(item => {
            weeklyEvaluationsOfKpiSet.push({
                title: item.toString(),
                automaticPoint: Math.round(weeklyEvaluations?.[item]?.automaticPoint),
                employeePoint: Math.round(weeklyEvaluations?.[item]?.employeePoint),
                approvedPoint: Math.round(weeklyEvaluations?.[item]?.approvedPoint)
            })
        })
    }

    // Cập nhật kpi tháng và kpi tuần cho tập kpi
    let updateKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(kpiSet._id,
            {
                $set: {
                    "automaticPoint": Math.round(autoPointSet),
                    "employeePoint": Math.round(employeePointSet),
                    "approvedPoint": Math.round(approvedPointSet),
                    weeklyEvaluations: weeklyEvaluationsOfKpiSet
                },
            },
            { new: true }
        )
        .populate("organizationalUnit")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({path: "approver", select :"_id name email avatar"})
        .populate({ path: "logs.creator", select: "_id name email avatar" })

    return { task, result, updateKpiSet };
}

// Tính điểm KPI từng tuần
function setPointForWeek (tasks, title, startDate, endDate) {
    startDate = new Date(startDate)
    endDate = new Date(endDate)

    // Lọc CV theo tuần
    let taskInWeek = tasks.filter(item => {
        let startDateTask = new Date(item?.startDateTask)
        let endDateTask = new Date(item?.endDateTask)

        return (startDateTask >= startDate && startDateTask < endDate)
            || (endDateTask >= startDate && endDateTask < endDate)
            || (startDateTask < startDate && endDateTask >= endDate)
    })

    let automaticPoint = 0;
    let approvedPoint = 0;
    let employeePoint = 0;
    let sumTaskImportance = 0;

    if (taskInWeek.length) {
        for (element of taskInWeek) {
            let date1 = new Date(element?.startDateTask);
            let date2 = new Date(element?.endDateTask);
            let timeInWeek = 0, totalTime = date2?.getTime() - date1.getTime(), ratioTimeInWeek = 0

            // Lấy số ngày thực hiện CV trong tuần
            if (date2?.getTime() > endDate?.getTime()) {
                if (date1?.getTime() > startDate.getTime()) {
                    timeInWeek = endDate?.getTime() - date1?.getTime()
                } else {
                    timeInWeek = endDate?.getTime() - startDate?.getTime()
                }
            } else {
                if (date1?.getTime() > startDate.getTime()) {
                    timeInWeek = date2?.getTime() - date1?.getTime()
                } else {
                    timeInWeek = date2?.getTime() - startDate?.getTime()
                }
            }

            ratioTimeInWeek = timeInWeek / totalTime
            automaticPoint += element.results.automaticPoint * element.results.taskImportanceLevel * ratioTimeInWeek;
            approvedPoint += element.results.approvedPoint * element.results.taskImportanceLevel * ratioTimeInWeek;
            employeePoint += element.results.employeePoint * element.results.taskImportanceLevel * ratioTimeInWeek;
            sumTaskImportance += element.results.taskImportanceLevel * ratioTimeInWeek;
        }

    }
    else {
        automaticPoint = 0;
        employeePoint = 0;
        approvedPoint = 0;
        sumTaskImportance = 1;
    }

    return {
        title: title,
        automaticPoint: Math.round(automaticPoint / sumTaskImportance),
        employeePoint: Math.round(employeePoint / sumTaskImportance),
        approvedPoint: Math.round(approvedPoint / sumTaskImportance)
    }
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
            .populate({ path: "creator", select: "_id name email avatar" })
            .populate({ path: "kpis" })
            .populate({ path: "logs.creator", select: "_id name email avatar" })
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
 *  date: tháng muốn lấy kết quả,1
 *  employeeId: Id của nhân viên,
 *  kpiType: loại Kpi
 */
async function getResultTaskByMonth(portal, data) {
    let date = new Date(data.date);
    let monthkpi = parseInt(date.getMonth() + 1);
    let yearkpi = parseInt(date.getFullYear());
    let kpiType;

    if (data.kpiType.toString() === "1") {
        kpiType = "accountable";
    } else if (data.kpiType.toString() === "2") {
        kpiType = "consulted";
    } else {
        kpiType = "responsible";
    }

    let conditions = [
        {
            $match: { "evaluations.results.kpis": { $elemMatch: { $eq: mongoose.Types.ObjectId(data?.id) } } }
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
        {
            $match: { "results.kpis": { $elemMatch: { $eq: mongoose.Types.ObjectId(data?.id) } } }
        },
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
    let totalWeight = 0;
    let weeklyEvaluations = {}
    
    for (let i in kpis) {
        let obj = {
            id: kpis[i].id,
            date: date,
            employeeId: idEmployee,
            kpiType: kpis[i].type,

        }

        let kpiCurrent = await EmployeeKpi(connect(DB_CONNECTION, portal)).findById(kpis[i].id);
        let task = await getResultTaskByMonth(portal, obj);

        // Đánh giá KPI tuần
        let currentDate = new Date(date)
        let currentMonth = currentDate?.getMonth()
        let currentYear = currentDate?.getFullYear()
        let week1 = setPointForWeek(task, "week1", new Date(currentYear, currentMonth, 2), new Date(currentYear, currentMonth, 9)) // ví dụ: new Date(2021,3,2) = 0h0'0 1/4/2021, new Date(2021,3,9) = 0h0'0 8/4/2021
        let week2 = setPointForWeek(task, "week2", new Date(currentYear, currentMonth, 9), new Date(currentYear, currentMonth, 16)) // ví dụ: new Date(2021,3,9) = 0h0'0 8/4/2021, new Date(2021,3,16) = 0h0'0 15/4/2021
        let week3 = setPointForWeek(task, "week3", new Date(currentYear, currentMonth, 16), new Date(currentYear, currentMonth, 23)) // ví dụ: new Date(2021,3,16) = 0h0'0 15/4/2021, new Date(2021,3,23) = 0h0'0 21/4/2021
        let week4 = setPointForWeek(task, "week4", new Date(currentYear, currentMonth, 23), new Date(currentYear, currentMonth + 1, 2)) // ví dụ: new Date(2021,3,23) = 0h0'0 21/4/2021, new Date(2021,4,2) = 0h0'0 1/5/2021
        let resultWeek = [week1, week2, week3, week4]
        await EmployeeKpi(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                kpis[i].id,
                {
                    $set: {
                        weeklyEvaluations: resultWeek
                    },
                },
                { new: true }
            );
        
        // Đánh giá KPI tháng
        let automaticPoint = 0;
        let approvedPoint = 0;
        let employeePoint = 0;
        let sumTaskImportance = 0;
        let newWeight; //cập nhật weight của kpi = 0 nếu kpi không có công việc
        if (task.length) {
            newWeight = kpiCurrent.weight;
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
                automaticPoint += task[j].results.automaticPoint ? task[j].results.automaticPoint * taskImportance : 0;
                approvedPoint += task[j].results.approvedPoint ? task[j].results.approvedPoint * taskImportance : 0;
                employeePoint += task[j].results.employeePoint ? task[j].results.employeePoint * taskImportance : 0;
                sumTaskImportance += taskImportance;
            }
        }
        else {
            automaticPoint = 0;
            approvedPoint = 0;
            employeePoint = 0;
            sumTaskImportance = 1;
            newWeight = 0;
        }


        let kpi = await EmployeeKpi(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                kpis[i].id,
                {
                    $set: {
                        "automaticPoint": Math.round(automaticPoint / sumTaskImportance),
                        "employeePoint": Math.round(employeePoint / sumTaskImportance),
                        "approvedPoint": Math.round(approvedPoint / sumTaskImportance),
                        "weight": newWeight,
                    },
                },
                { new: true }
            );

        let weight = kpi.weight / 100;

        // Tính điểm KPI tuần cho tập KPI
        if (kpi?.weeklyEvaluations?.length > 0) {
            kpi.weeklyEvaluations.map(item => {
                if (!weeklyEvaluations[item.title]) {
                    weeklyEvaluations[item.title] = {
                        automaticPoint: 0,
                        employeePoint: 0,
                        approvedPoint: 0
                    }
                }
                weeklyEvaluations[item.title].automaticPoint += item.automaticPoint ? item.automaticPoint * weight : 0;
                weeklyEvaluations[item.title].employeePoint += item.employeePoint ? item.employeePoint * weight : 0;
                weeklyEvaluations[item.title].approvedPoint += item.approvedPoint ? item.approvedPoint * weight : 0;
            })
        }

        // Tính điểm KPI tháng cho tập KPI
        totalWeight += weight;
        autoPointSet += kpi.automaticPoint ? kpi.automaticPoint * weight : 0;
        employeePointSet += kpi.employeePoint ? kpi.employeePoint * weight : 0;
        approvedPointSet += kpi.approvedPoint ? kpi.approvedPoint * weight : 0;


    }

    // Mảng các đánh giá tuần cho tập KPI
    let titleWeeklyEvaluations = Object.keys(weeklyEvaluations)
    let weeklyEvaluationsOfKpiSet = []
    if (titleWeeklyEvaluations?.length > 0) {
        titleWeeklyEvaluations.map(item => {
            weeklyEvaluationsOfKpiSet.push({
                title: item.toString(),
                automaticPoint: Math.round(weeklyEvaluations?.[item]?.automaticPoint),
                employeePoint: Math.round(weeklyEvaluations?.[item]?.employeePoint),
                approvedPoint: Math.round(weeklyEvaluations?.[item]?.approvedPoint)
            })
        })
    }

    let updateKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(idKpiSet,
            {
                $set: {
                    "automaticPoint": Math.round(autoPointSet / totalWeight ? autoPointSet / totalWeight : 0),
                    "employeePoint": Math.round(employeePointSet / totalWeight ? employeePointSet / totalWeight : 0),
                    "approvedPoint": Math.round(approvedPointSet / totalWeight ? approvedPointSet / totalWeight : 0),
                    weeklyEvaluations: weeklyEvaluationsOfKpiSet
                },
            },
            { new: true }
        ).populate("organizationalUnit")
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .populate({ path: "logs.creator", select: "_id name email avatar" })

    for (let i = 0; i < updateKpiSet?.kpis?.length; i++) {
        let data = {
            id: updateKpiSet?.kpis?.[i]?._id,
            employeeId: updateKpiSet?.creator?._id,
            date: updateKpiSet?.date,
            kpiType: updateKpiSet?.kpis?.[i]?.type
        }
        let task = await getResultTaskByMonth(portal, data);

        updateKpiSet.kpis[i] = updateKpiSet.kpis[i].toObject();
        updateKpiSet.kpis[i].amountTask = task?.length;
    }

    return updateKpiSet;
}


