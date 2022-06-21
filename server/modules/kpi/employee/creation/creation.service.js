const mongoose = require('mongoose');
const { connect } = require(`../../../../helpers/dbHelper`);
const Models = require('../../../../models');
const fs = require('fs');

const { EmployeeKpi, EmployeeKpiSet, OrganizationalUnit, OrganizationalUnitKpiSet, UserRole } = Models;

const NotificationServices = require(`../../../notification/notification.service`)
const NewsFeedService = require('../../../news-feed/newsFeed.service')
const EmployeeEvaluationService = require('../../../kpi/evaluation/employee-evaluation/employeeEvaluation.service');
const { getPaginatedTasksThatUserHasResponsibleRole } = require('../../../task/task-management/task.service');

// File này làm nhiệm vụ thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

/* Lấy tập KPI cá nhân hiện tại theo người dùng */
exports.getEmployeeKpiSet = async (portal, data) => {

    let month, nextMonth;
    if (data.month) {
        month = new Date(data.month);
        nextMonth = new Date(data.month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
    } else {
        let currentYear, currentMonth, nextMonthTemp, now;

        now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth() + 1;
        nextMonthTemp = currentMonth + 1;
        if (currentMonth < 10) {
            currentMonth = "0" + currentMonth;
        }
        if (nextMonthTemp < 10) {
            nextMonthTemp = "0" + nextMonthTemp;
        }

        month = currentYear + "-" + currentMonth;
        nextMonth = currentYear + "-" + nextMonthTemp;

        month = new Date(month);
        nextMonth = new Date(nextMonth);
    }


    let department = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({
        $or: [
            { managers: data.roleId },
            { deputyManagers: data.roleId },
            { employees: data.roleId }
        ]
    });

    if (!department) {
        return null;
    }

    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ creator: data.userId, organizationalUnit: department._id, status: { $ne: 3 }, date: { $lt: nextMonth, $gte: month } })
        .populate("organizationalUnit")
        .populate({ path: 'creator', select: '_id name email avatar' })
        .populate({ path: 'approver', select: '_id name email avatar' })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])


    return employeeKpiSet;
}

/* Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước */
exports.getAllEmployeeKpiSetByMonth = async (portal, organizationalUnitIds, userId, startDate, endDate) => {
    endDate = new Date(endDate)
    endDate.setMonth(endDate.getMonth() + 1)

    let keySearch = {
        creator: new mongoose.Types.ObjectId(userId),
        date: { $gte: new Date(startDate), $lt: new Date(endDate) }
    }

    // Tạm thời check hoặc role hoặc đơn vị, sau này sẽ tách 2 biến riêng
    if (organizationalUnitIds) {
        let unit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .find({ _id: { $in: organizationalUnitIds.map(item => mongoose.Types.ObjectId(item)) } })

        if (unit?.length > 0) {
            keySearch = {
                ...keySearch,
                organizationalUnit: { $in: [...organizationalUnitIds] }
            }
        } else {
            unit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({
                $or: [
                    { managers: { $in: [...organizationalUnitIds] } },
                    { deputyManagers: { $in: [...organizationalUnitIds] } },
                    { employees: { $in: [...organizationalUnitIds] } }
                ]
            });

            keySearch = {
                ...keySearch,
                organizationalUnit: { $in: unit.map(item => item?._id) }
            }
        }
    }

    let employeeKpiSetByMonth = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .find(keySearch)
        .populate({ path: "organizationalUnit", select: "name" })
        .select({ 'automaticPoint': 1, 'employeePoint': 1, 'approvedPoint': 1, 'date': 1 })

    return employeeKpiSetByMonth;
}

/* Lấy tất cả các tập KPI của tất cả nhân viên trong mảng đơn vị cho trước theo thời gian */
exports.getAllEmployeeKpiSetOfAllEmployeeInOrganizationalUnitByMonth = async (portal, organizationalUnitIds, startDate, endDate) => {
    let organizationalUnitIdsArray = organizationalUnitIds.map(item => { return new mongoose.Types.ObjectId(item) });
    endDate = new Date(endDate)
    endDate.setMonth(endDate.getMonth() + 1)

    const employeeKpiSetsInOrganizationalUnitByMonth = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { 'organizationalUnit': { $in: [...organizationalUnitIdsArray] } } },

        { $match: { 'date': { $gte: new Date(startDate), $lt: new Date(endDate) } } },

        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "employee"
            }
        },
        { $unwind: "$employee" },

        {
            $lookup: {
                from: "organizationalunits",
                localField: "organizationalUnit",
                foreignField: "_id",
                as: "organizationalUnit"
            }
        },
        { $unwind: "$organizationalUnit" },

        {
            $addFields: { "employeeAndUnit": { $concat: ["$employee.name", " - ", "$organizationalUnit.name"] } }
        },

        {
            $group: {
                '_id': "$employeeAndUnit",
                'employeeKpi': { $push: "$$ROOT" }
            }
        },

        { $project: { 'employeeKpi.automaticPoint': 1, 'employeeKpi.employeePoint': 1, 'employeeKpi.approvedPoint': 1, 'employeeKpi.date': 1 } }
    ])

    return employeeKpiSetsInOrganizationalUnitByMonth;
}

/* Khởi tạo tập KPI cá nhân */
exports.createEmployeeKpiSet = async (portal, data) => {
    const { organizationalUnit, month, creator, approver } = data;

    // Config month tìm kiếm
    let monthSearch, nextMonthSearch;

    monthSearch = new Date(month);
    nextMonthSearch = new Date(month);
    nextMonthSearch.setMonth(nextMonthSearch.getMonth() + 1);

    // Kiem tra ton tai kpi
    let check = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: organizationalUnit,
        creator: creator,
        approver: approver,
        date: new Date(month)
    })
    if (check) {
        return null;
    }

    // Tìm kiếm danh sách các mục tiêu mặc định của phòng ban
    let organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findOne({
            organizationalUnit: organizationalUnit,
            status: 1,
            date: {
                $gte: monthSearch, $lt: nextMonthSearch
            }
        })
        .populate("kpis");//status = 1 là kpi đã đc phê duyệt

    if (organizationalUnitKpiSet) {
        // Tạo thông tin chung cho KPI cá nhân
        let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .create({
                organizationalUnit: organizationalUnit,
                creator: creator,
                approver: approver,
                date: new Date(month),
                kpis: []
            });


        let defaultOrganizationalUnitKpi;
        if (organizationalUnitKpiSet?.kpis) defaultOrganizationalUnitKpi = organizationalUnitKpiSet.kpis.filter(item => item.type !== 0);

        if (defaultOrganizationalUnitKpi) {
            let defaultEmployeeKpi = await Promise.all(defaultOrganizationalUnitKpi.map(async (item) => {
                let defaultT = await EmployeeKpi(connect(DB_CONNECTION, portal)).create({
                    name: item.name,
                    parent: item._id,
                    weight: 5,
                    criteria: item.criteria,
                    status: null,
                    type: item.type
                })
                return defaultT._id;
            }));
            employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
                .findByIdAndUpdate(
                    employeeKpiSet, { kpis: defaultEmployeeKpi }, { new: true }
                )
        }

        employeeKpiSet = employeeKpiSet && await employeeKpiSet
            .populate("organizationalUnit")
            .populate({ path: "creator", select: "_id name email avatar" })
            .populate({ path: "approver", select: "_id name email avatar" })
            .populate({ path: "kpis", populate: { path: 'parent' } })
            .execPopulate();

        return employeeKpiSet;
    } else {
        return null;
    }
}

/* Thêm mục tiêu cho KPI cá nhân */
exports.createEmployeeKpi = async (portal, data) => {
    // Thiết lập mục tiêu cho KPI cá nhân
    let employeeKpi = await EmployeeKpi(connect(DB_CONNECTION, portal))
        .create({
            name: data.name,
            parent: data.parent,
            weight: data.weight,
            criteria: data.criteria
        })
    const employeeKpiSetId = data.employeeKpiSet;
    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(
            employeeKpiSetId, { $push: { kpis: employeeKpi._id } }, { new: true }
        );
    employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findById(employeeKpiSetId)
        .populate('organizationalUnit')
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])

    return employeeKpiSet;
}

/* Tao kpi tu dong cho cá nhân */
exports.createEmployeeKpiSetAuto = async (portal, data) => {
    const { organizationalUnit, month, employees, approver, employee } = data;
    // Config month tìm kiếm
    let monthSearch, nextMonthSearch;

    monthSearch = new Date(month);
    nextMonthSearch = new Date(month);
    nextMonthSearch.setMonth(nextMonthSearch.getMonth() + 1);

    // Kiem tra ton tai kpi duoc tao tu dong chua
    let check = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).find({
        type: 'auto',
        organizationalUnit: organizationalUnit,
        creator: employee,
        date: new Date(month)
    })
    if (check.length > 0) {
        return null;
    }

    // Tìm kiếm danh sách các mục tiêu mặc định của phòng ban
    let organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findOne({
            organizationalUnit: organizationalUnit,
            // status: 1,
            date: {
                $gte: monthSearch, $lt: nextMonthSearch
            }
        })
        .populate("kpis");//status = 1 là kpi đã đc phê duyệt

    if (organizationalUnitKpiSet) {
        // Tạo thông tin chung cho KPI cá nhân
        let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .create({
                type: 'auto',
                organizationalUnit: organizationalUnit,
                creator: employee,
                approver: approver,
                date: new Date(month),
                kpis: []
            });
        let defaultOrganizationalUnitKpi;
        if (organizationalUnitKpiSet?.kpis) defaultOrganizationalUnitKpi = organizationalUnitKpiSet.kpis.filter(item => item.type !== 0);

        //  Them cac muc tieu mac dinh cua kpi
        if (defaultOrganizationalUnitKpi) {
            let defaultEmployeeKpi = await Promise.all(defaultOrganizationalUnitKpi.map(async (item) => {
                let defaultT = await EmployeeKpi(connect(DB_CONNECTION, portal)).create({
                    name: item.name,
                    parent: item._id,
                    weight: 5,
                    criteria: item.criteria,
                    status: null,
                    type: item.type
                })
                return defaultT._id;
            }));
            employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
                .findByIdAndUpdate(
                    employeeKpiSet, { kpis: defaultEmployeeKpi }, { new: true }
                )
        }
        let totalRatio = 0;
        let completeRatio = {};

        for (let i = 0; i < employees.length; i++) {

            let ratio = await EmployeeEvaluationService.getEmployeeKpiPerformance(portal, employees[i]);
            totalRatio += ratio.completeRatio;
            completeRatio[employees[i]] = ratio.completeRatio;
        }
        const avg = totalRatio / employees.length;
        const { employeeImportances } = organizationalUnitKpiSet;

        for (let key in completeRatio) {
            let importance;
            completeRatio[key].ratio /= avg;

            for (let j = 0; j < employeeImportances.length; j++) {
                if (key === employeeImportances[j].employee) {
                    importance = employeeImportances[j].importance;
                } else {
                    importance = 100;
                }
            }
            completeRatio[key] = { ...completeRatio[key], importance }
        }
        // Phan chia cac muc tieu kpi cho nhan vien
        //Lay danh sach muc tieu kpi don vi theo trong so giam dan
        let otherKpis = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .aggregate([
                { $match: { organizationalUnit: mongoose.Types.ObjectId(organizationalUnit) } },
                { $match: { date: { $gte: monthSearch, $lt: nextMonthSearch } } },
                // { $match: { status: 1 } },
                {
                    $lookup: {
                        from: "organizationalunitkpis",
                        localField: "kpis",
                        foreignField: "_id",
                        as: "kpis"
                    }
                },

                { $unwind: '$kpis' },
                {
                    $match: {
                        'kpis.type': 0
                    }
                },
                {
                    $sort: {
                        'kpis.weight': -1
                    }
                }
            ])

        // Gan kpi cho nhan vien
        let kpiEmployee = []
        let numOfKpis = Math.round(completeRatio[employee].ratio * otherKpis.length);
        if (numOfKpis > otherKpis.length) {
            numOfKpis = otherKpis.length;
        }

        // Neu do quan trong nhan vien duoi 90 thi nhan cac tieu chi co do quan trong tu thap den cao va nguoc lai
        if (otherKpis.length > 0 && completeRatio[employee].importance < 90) {
            let weightOver = 0;
            for (let k = 0; k < otherKpis.length - numOfKpis; k++) {
                weightOver += otherKpis[k].kpis.weight;
            }
            for (let i = otherKpis.length - numOfKpis; i < otherKpis.length; i++) {
                let calcWeight = otherKpis[i].kpis.weight + weightOver;
                let target = otherKpis[i].kpis.target ? Math.round(otherKpis[i].kpis.target / employees.length * completeRatio[employee].ratio) : null;
                kpiEmployee.push({
                    name: otherKpis[i].kpis.name,
                    parent: otherKpis[i].kpis.parent,
                    weight: calcWeight,
                    criteria: otherKpis[i].kpis.criteria,
                    target: target,
                    unit: otherKpis[i].kpis.unit,
                })
                weightOver = 0;
            }
        } else if (otherKpis.length > 0 && completeRatio[employee].importance >= 90) {
            let weightOver = 0;
            if (numOfKpis < otherKpis.length) {
                for (let k = numOfKpis; k < otherKpis.length; k++) {
                    weightOver += otherKpis[k].kpis.weight;
                }
            }

            for (let i = 0; i < numOfKpis; i++) {
                let calcWeight = otherKpis[i].kpis.weight + weightOver;
                let target = otherKpis[i].kpis.target ? Math.round(otherKpis[i].kpis.target / employees.length * completeRatio[employee].ratio) : null;
                kpiEmployee.push({
                    name: otherKpis[i].kpis.name,
                    parent: otherKpis[i].kpis.parent,
                    weight: calcWeight,
                    criteria: otherKpis[i].kpis.criteria,
                    target: target,
                    unit: otherKpis[i].kpis.unit,
                })
                weightOver = 0
            }
        }

        if (kpiEmployee) {
            let otherKpiEmployee = await Promise.all(kpiEmployee.map(async (item) => {
                let kpi = await EmployeeKpi(connect(DB_CONNECTION, portal)).create(item)
                return kpi._id;
            }));

            employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
                .findByIdAndUpdate(
                    employeeKpiSet, { $push: { kpis: { $each: otherKpiEmployee } } }, { new: true }
                )
        }

        employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
            .findById(employeeKpiSet._id)
            .populate('organizationalUnit')
            .populate({ path: "creator", select: "_id name email avatar" })
            .populate({ path: "approver", select: "_id name email avatar" })
            .populate({ path: "kpis", populate: { path: 'parent' } })
            .populate([
                { path: 'comments.creator', select: 'name email avatar ' },
                { path: 'comments.comments.creator', select: 'name email avatar' }
            ])

        return employeeKpiSet;
    }
}

/* Xóa mục tiêu của KPI cá nhân */
exports.deleteEmployeeKpi = async (portal, id, employeeKpiSetId) => {

    let employeeKpi = await EmployeeKpi(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);

    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(employeeKpiSetId, { $pull: { kpis: id } }, { new: true })

    employeeKpiSet = employeeKpiSet && await employeeKpiSet
        .populate("organizationalUnit")
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .execPopulate();

    return {
        employeeKpiSet,
        employeeKpi
    };
}

/* Chỉnh sửa trạng thái KPI: yêu cầu phê duyệt, hủy bỏ yêu cầu phê duyệt, khóa KPI */
exports.updateEmployeeKpiSetStatus = async (portal, id, statusId, companyId) => {

    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true })

    employeeKpiSet = employeeKpiSet && await employeeKpiSet
        .populate("organizationalUnit")
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .execPopulate();
    const date = (employeeKpiSet.date).getMonth() + 1;
    const data = {
        organizationalUnits: employeeKpiSet.organizationalUnit._id,
        title: "Xin phê duyệt KPI",
        level: "general",
        content: `<p><strong>${employeeKpiSet.creator.name}</strong> đã gửi yêu cầu phê duyệt KPI tháng <strong>${date}</strong>, <a href="${process.env.WEBSITE}/kpi-member/manager">Xem ngay</a></p>`,
        sender: `${employeeKpiSet.creator.name}`,
        users: [employeeKpiSet.approver._id],
        associatedDataObject: {
            dataType: 3,
            description: `<p><strong>${employeeKpiSet.creator.name}</strong>: Đã gửi yêu cầu phê duyệt KPI tháng <strong>${date}</strong>.</p>`
        }
    };
    NotificationServices.createNotification(portal, companyId, data)

    return employeeKpiSet;
}

/* Chỉnh sửa thông tin chung của KPI cá nhân */
exports.editEmployeeKpiSet = async (portal, approver, id) => {
    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: { approver: approver } }, { new: true })

    employeeKpiSet = employeeKpiSet && await employeeKpiSet
        .populate("organizationalUnit ")
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "approver", select: "_id name email avatar" })
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
        .execPopulate();

    return employeeKpiSet;
}

/* Xóa toàn bộ KPI cá nhân */
exports.deleteEmployeeKpiSet = async (portal, id) => {

    let files1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(id) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
        ])

    let files2 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(id) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } }
        ])
    let files = [...files1, ...files2]
    let i
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }


    let kpis = [];
    let employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).findById(id);
    if (employeeKpiSet.kpis) kpis = employeeKpiSet.kpis;
    if (kpis !== []) {
        kpis = await Promise.all(kpis.map(async (item) => {
            return EmployeeKpi(connect(DB_CONNECTION, portal)).findByIdAndDelete(item._id);
        }))
    }
    employeeKpiSet = await EmployeeKpiSet(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
    return [employeeKpiSet, kpis]
}

/**
 *  thêm bình luận
 */
exports.createComment = async (portal, params, body, files) => {
    const commentss = {
        description: body.description,
        creator: body.creator,
        files: files
    }
    let comment1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { _id: params.kpiId },
            { $push: { comments: commentss } }, { new: true }
        )
    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.kpiId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' }
        ])
    return comment.comments;
}


/**
 * Sửa bình luận
 */
exports.editComment = async (portal, params, body, files) => {
    let commentss = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId },
            {
                $set: { "comments.$.description": body.description }
            }
        )

    let comment1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId },
            {
                $push:
                {
                    "comments.$.files": files
                }
            }
        )
    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
    return comment.comments;
}

/**
 * Delete comment
 */
exports.deleteComment = async (portal, params) => {
    let files1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
        ])

    let files2 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } }
        ])
    let files = [...files1, ...files2]
    let i
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let comments = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId },
            { $pull: { comments: { _id: params.commentId } } },
            { safe: true }
        )
    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
    return comment.comments
}

/**
 *  thêm bình luận cua binh luan
 */
exports.createChildComment = async (portal, params, body, files) => {
    let commentss = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId },
            {
                "$push": {
                    "comments.$.comments":
                    {
                        creator: body.creator,
                        description: body.description,
                        files: files
                    }
                }
            }
        )
    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
    return comment.comments;
}
/**
 * Edit comment of comment
 */
exports.editChildComment = async (portal, params, body, files) => {
    let now = new Date()
    let comment1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId },
            {
                $set:
                {
                    "comments.$.comments.$[elem].description": body.description,
                    "comments.$.comments.$[elem].updatedAt": now
                }
            },
            {
                arrayFilters: [
                    {
                        "elem._id": params.childCommentId
                    }
                ]
            }
        )
    let action1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId },
            {
                $push:
                {
                    "comments.$.comments.$[elem].files": files
                }
            },
            {
                arrayFilters:
                    [
                        {
                            "elem._id": params.childCommentId
                        }
                    ]
            }
        )


    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])
    return comment.comments
}

/**
 * Delete comment of comment
 */
exports.deleteChildComment = async (portal, params) => {
    let files = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.childCommentId) } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } }
        ])
    let i = 0
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let comment1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId },
            { $pull: { "comments.$.comments": { _id: params.childCommentId } } },
            { safe: true }
        )

    let comment = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId, })
        .populate([
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' }
        ])

    return comment.comments
}

/**
 * Xóa file của bình luận
 */
exports.deleteFileComment = async (portal, params) => {
    let file = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
        ])
    fs.unlinkSync(file[0].url)

    let comment1 = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId },
            { $pull: { "comments.$.files": { _id: params.fileId } } },
            { safe: true }
        )
    let task = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId })
        .populate([
            { path: "comments.creator", select: 'name email avatar' },
            { path: "comments.comments.creator", select: 'name email avatar' },
        ]);

    return task.comments;
}

/**
 * Xóa file bình luận con
 */
exports.deleteFileChildComment = async (portal, params) => {
    let file = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.childCommentId) } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
        ]);

    fs.unlinkSync(file[0].url);

    let action = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId },
            { $pull: { "comments.$.comments.$[].files": { _id: params.fileId } } },
            { safe: true }
        );

    let task = await EmployeeKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId },)
        .populate([
            { path: "comments.creator", select: 'name email avatar' },
            { path: "comments.comments.creator", select: 'name email avatar' },
        ]);

    return task.comments;
}

/** Thêm newsfeed cho kpi cá nhân */
exports.createNewsFeedForEmployeeKpiSet = async (portal, data) => {
    const { creator, title, description, employeeKpiSet, organizationalUnit } = data

    let managers = await UserRole(connect(DB_CONNECTION, portal))
        .find({ roleId: { $in: [...organizationalUnit?.managers] } })

    // Thêm trưởng phòng các đơn vị
    let relatedUsers = []
    relatedUsers = managers?.map(item => item?.userId?.toString())

    // Thêm người phê duyệt
    if (!relatedUsers?.includes(employeeKpiSet?.approver?._id?.toString())) {
        relatedUsers.push(employeeKpiSet?.approver?._id)
    }
    // Thêm người tạo kpi
    if (!relatedUsers?.includes(employeeKpiSet?.creator?._id?.toString())) {
        relatedUsers.push(employeeKpiSet?.creator?._id)
    }

    let newsFeed = await NewsFeedService.createNewsFeed(portal, {
        title: title,
        description: description,
        creator: creator,
        associatedDataObject: {
            dataType: 2,
            value: employeeKpiSet?._id
        },
        relatedUsers: relatedUsers
    })

    return newsFeed
}