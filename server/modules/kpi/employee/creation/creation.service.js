const mongoose = require('mongoose');

const taskCommentModel = require('../../../../models/task/taskComment.model');
const fs = require('fs');
const { EmployeeKpi, EmployeeKpiSet, OrganizationalUnit, OrganizationalUnitKpiSet, User } = require('../../../../models/index').schema;

// File này làm nhiệm vụ thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

/*Lấy tập KPI cá nhân hiện tại theo người dùng */
exports.getEmployeeKpiSet = async (id, role, month) => {

    let now = new Date(month);
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth();
    let endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
    let endOfLastMonth = new Date(currentYear, currentMonth);

    if (month) {
        now = new Date(month);
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
        endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
        endOfLastMonth = new Date(currentYear, currentMonth);
    } else {
        now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
        endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
        endOfLastMonth = new Date(currentYear, currentMonth);
    }


    let department = await OrganizationalUnit.findOne({
        $or: [
            { deans: role },
            { viceDeans: role },
            { employees: role }
        ]
    });

    if (!department) {
        return null;
    }

    let employeeKpiSet = await EmployeeKpiSet.findOne({ creator: id, organizationalUnit: department._id, status: { $ne: 3 }, date: { $lte: endOfCurrentMonth, $gt: endOfLastMonth } })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ])


    return employeeKpiSet;
}

/* Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước */
exports.getAllEmployeeKpiSetByMonth = async (userId, startDate, endDate) => {

    let employeeKpiSetByMonth = await EmployeeKpiSet.find(
        {
            creator: new mongoose.Types.ObjectId(userId),
            date: { $gt: new Date(startDate), $lte: new Date(endDate) }
        },
        { 'automaticPoint': 1, 'employeePoint': 1, 'approvedPoint': 1, 'date': 1 }
    )

    return employeeKpiSetByMonth;
}

/* Lấy tất cả các tập KPI của tất cả nhân viên trong mảng đơn vị cho trước theo thời gian */
exports.getAllEmployeeKpiSetOfAllEmployeeInOrganizationalUnitByMonth = async (organizationalUnitIds, startDate, endDate) => {

    let organizationalUnitIdsArray = organizationalUnitIds.map(item => { return new mongoose.Types.ObjectId(item) });

    const employeeKpiSetsInOrganizationalUnitByMonth = await EmployeeKpiSet.aggregate([
        { $match: { 'organizationalUnit': { $in: [...organizationalUnitIdsArray] } } },

        // Thời gian lấy chưa tính tháng hiện tại(ví dụ endDate là 2020-8 thì service trả về k bao gồm kpi tháng 8)
        { $match: { 'date': { $gt: new Date(startDate), $lte: new Date(endDate) } } },

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
            $group: {
                '_id': "$employee.name",
                'employeeKpi': { $push: "$$ROOT" }
            }
        },

        { $project: { 'employeeKpi.automaticPoint': 1, 'employeeKpi.employeePoint': 1, 'employeeKpi.approvedPoint': 1, 'employeeKpi.date': 1 } }
    ])

    return employeeKpiSetsInOrganizationalUnitByMonth;
}

/* Khởi tạo tập KPI cá nhân */
exports.createEmployeeKpiSet = async (data) => {
    let organizationalUnitId = data.organizationalUnit;
    let creatorId = data.creator;
    let approverId = data.approver;
    let dateId = data.date;
    // Tìm kiếm danh sách các mục tiêu mặc định của phòng ban
    let organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findOne({ organizationalUnit: organizationalUnitId, status: 1 }).populate("kpis");//status = 1 là kpi đã đc phê duyệt

    let defaultOrganizationalUnitKpi;
    if (organizationalUnitKpiSet.kpis) defaultOrganizationalUnitKpi = organizationalUnitKpiSet.kpis.filter(item => item.type !== 0);
    if (defaultOrganizationalUnitKpi !== []) {

        let time = dateId.split("-");
        let date = new Date(time[1], time[0], 0);

        // Tạo thông tin chung cho KPI cá nhân
        let employeeKpiSet = await EmployeeKpiSet.create({
            organizationalUnit: organizationalUnitId,
            creator: creatorId,
            approver: approverId,
            date: date,
            kpis: []
        });
        let defaultEmployeeKpi = await Promise.all(defaultOrganizationalUnitKpi.map(async (item) => {
            let defaultT = await EmployeeKpi.create({
                name: item.name,
                parent: item._id,
                weight: 5,
                criteria: item.criteria,
                status: null,
                type: item.type
            })
            return defaultT._id;
        }));
        employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(
            employeeKpiSet, { kpis: defaultEmployeeKpi }, { new: true }
        );
        employeeKpiSet = await employeeKpiSet.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        return employeeKpiSet;
    } else {
        return null;
    }
}

/* Thêm mục tiêu cho KPI cá nhân */
exports.createEmployeeKpi = async (data) => {
    // Thiết lập mục tiêu cho KPI cá nhân
    let employeeKpi = await EmployeeKpi.create({
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    })
    const employeeKpiSetId = data.employeeKpiSet;
    let employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(
        employeeKpiSetId, { $push: { kpis: employeeKpi._id } }, { new: true }
    );
    employeeKpiSet = await EmployeeKpiSet.findById(employeeKpiSetId)
        .populate('creator approver organizationalUnit')
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ])

    return employeeKpiSet;
}

/* Xóa mục tiêu của KPI cá nhân */
exports.deleteEmployeeKpi = async (id, employeeKpiSetId) => {

    let employeeKpi = await EmployeeKpi.findByIdAndDelete(id);

    let employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(employeeKpiSetId, { $pull: { kpis: id } }, { new: true });
    employeeKpiSet = await employeeKpiSet.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return employeeKpiSet;
}

/* Chỉnh sửa trạng thái KPI: yêu cầu phê duyệt, hủy bỏ yêu cầu phê duyệt, khóa KPI */
exports.updateEmployeeKpiSetStatus = async (id, statusId) => {

    let employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true });
    employeeKpiSet = await employeeKpiSet.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();

    return employeeKpiSet;
}

/* Chỉnh sửa thông tin chung của KPI cá nhân */
exports.editEmployeeKpiSet = async (strDate, id) => {
    let arr = strDate.split("-");
    let date = new Date(arr[1], arr[0], 0)
    let employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(id, { $set: { date: date } }, { new: true })
        .populate("organizationalUnit creator approver ")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ]);
    return employeeKpiSet;
}

/* Xóa toàn bộ KPI cá nhân */
exports.deleteEmployeeKpiSet = async (id) => {

    let files1 = await EmployeeKpiSet.aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(id) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ])

    let files2 = await EmployeeKpiSet.aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(id) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } }
    ])
    let files = [...files1,...files2]
    let i
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }


    let kpis = [];
    let employeeKpiSet = await EmployeeKpiSet.findById(id);
    if (employeeKpiSet.kpis) kpis = employeeKpiSet.kpis;
    if (kpis !== []) {
        kpis = await Promise.all(kpis.map(async (item) => {
            return EmployeeKpi.findByIdAndDelete(item._id);
        }))
    }
    employeeKpiSet = await EmployeeKpiSet.findByIdAndDelete(id);
    return [employeeKpiSet, kpis]
}

/**
 *  thêm bình luận
 */
exports.createComment = async (params, body, files) => {
    const commentss = {
        description: body.description,
        creator: body.creator,
        files: files
    }
    let comment1 = await EmployeeKpiSet.update(
        { _id: params.kpiId },
        { $push: { comments: commentss } }, { new: true }
    )
    let comment = await EmployeeKpiSet.findOne({ _id: params.kpiId })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' }
        ])
    return comment.comments;
}


/**
 * Sửa bình luận
 */
exports.editComment = async (params, body) => {
    let commentss = await EmployeeKpiSet.updateOne(
        { "_id": params.kpiId, "comments._id": params.commentId },
        {
            $set: { "comments.$.description": body.description }
        }
    )
    let comment = await EmployeeKpiSet.findOne({ "_id": params.kpiId, "comments._id": params.commentId })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ])
    return comment.comments;
}

/**
 * Delete comment
 */
exports.deleteComment = async (params) => {
    let files1 = await EmployeeKpiSet.aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ])

    let files2 = await EmployeeKpiSet.aggregate([
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
    let comments = await EmployeeKpiSet.update(
        { "_id": params.kpiId, "comments._id": params.commentId },
        { $pull: { comments: { _id: params.commentId } } },
        { safe: true })
    let comment = await EmployeeKpiSet.findOne({ "_id": params.kpiId })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ])
    return comment.comments
}

/**
 *  thêm bình luận cua binh luan
 */
exports.createCommentOfComment = async (params, body, files) => {
    let commentss = await EmployeeKpiSet.updateOne(
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
    let comment = await EmployeeKpiSet.findOne({ "_id": params.kpiId, "comments._id": params.commentId })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ])
    return comment.comments;
}
/**
 * Edit comment of comment
 */
exports.editCommentOfComment = async (params, body) => {
    const now = new Date()
    let comment1 = await EmployeeKpiSet.updateOne(
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

    let comment = await EmployeeKpiSet.findOne({ "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ])
    return comment.comments
}

/**
 * Delete comment of comment
 */
exports.deleteCommentOfComment = async (params) => {
    console.log(params)
    let files = await EmployeeKpiSet.aggregate([
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
    console.log(files)
    let i = 0
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let comment1 = await EmployeeKpiSet.update(
        { "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId },
        { $pull: { "comments.$.comments": { _id: params.childCommentId } } },
        { safe: true })

    let comment = await EmployeeKpiSet.findOne({ "_id": params.kpiId, "comments._id": params.commentId, })
        .populate([
            { path: 'comments.creator', model: User, select: 'name email avatar ' },
            { path: 'comments.comments.creator', model: User, select: 'name email avatar' }
        ])

    return comment.comments
}