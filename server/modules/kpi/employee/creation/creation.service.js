const taskCommentModel = require('../../../../models/task/taskComment.model');

const { EmployeeKpi, EmployeeKpiSet, OrganizationalUnit, OrganizationalUnitKpiSet,User } = require('../../../../models/index').schema;

// File này làm nhiệm vụ thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

/** Lấy tập KPI cá nhân hiện tại theo người dùng */ 
exports.getEmployeeKpiSet = async (id, role) => {
    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();
    var endOfCurrentMonth = new Date(currentYear, currentMonth+1);
    var endOfLastMonth = new Date(currentYear, currentMonth);

    var department = await OrganizationalUnit.findOne({
        $or: [
            { deans: role },
            { viceDeans: role },
            { employees: role }
        ]
    });

    if (!department){
        return null;
    }

    var employeeKpiSet = await EmployeeKpiSet.findOne({ creator: id, organizationalUnit: department._id, status: { $ne: 3 }, date: { $lte: endOfCurrentMonth, $gt: endOfLastMonth } })
            .populate("organizationalUnit creator approver")
            .populate({ path: "kpis", populate: { path: 'parent' } })
            .populate([
                {path: 'comments.creator', model: User,select: 'name email avatar '},
                {path: 'comments.comments.creator',model: User,select: 'name email avatar'}
            ])
    
    
    return employeeKpiSet;
}

/** Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước */
exports.getAllEmployeeKpiSetByMonth = async (userId, startDate, endDate) => {
    var employeeKpiSetByMonth = await EmployeeKpiSet.find(
        {
            creator: userId,
            date: { $gte: startDate, $lte: endDate }
        },
        { 'automaticPoint': 1, 'employeePoint': 1, 'approvedPoint': 1, 'date': 1}
    )
    
    return employeeKpiSetByMonth;
}

/** Khởi tạo tập KPI cá nhân */ 
exports.createEmployeeKpiSet = async (creatorId,approverId,organizationalUnitId,dateId) => {
        // Tìm kiếm danh sách các mục tiêu mặc định của phòng ban
        var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findOne({ organizationalUnit: organizationalUnitId, status: 1 }).populate("kpis");//status = 1 là kpi đã đc phê duyệt
        
        var defaultOrganizationalUnitKpi;
        if (organizationalUnitKpiSet.kpis) defaultOrganizationalUnitKpi = organizationalUnitKpiSet.kpis.filter(item => item.type !== 0);
        if (defaultOrganizationalUnitKpi !== []) {
            
            var time = dateId.split("-");
            var date = new Date(time[1], time[0], 0);
        
        // Tạo thông tin chung cho KPI cá nhân
            var employeeKpiSet = await EmployeeKpiSet.create({
                organizationalUnit: organizationalUnitId,
                creator: creatorId,
                approver: approverId,
                date: date,
                kpis: []
            });
            var defaultEmployeeKpi = await Promise.all(defaultOrganizationalUnitKpi.map(async (item) => {
                var defaultT = await EmployeeKpi.create({
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

/** Thêm mục tiêu cho KPI cá nhân */ 
exports.createEmployeeKpi = async (nameId,parentId,weightId,criteriaId,employeeKpiSetId) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria
    // Thiết lập mục tiêu cho KPI cá nhân
    var employeeKpi = await EmployeeKpi.create({
        name: nameId,
        parent: parentId,
        weight: weightId,
        criteria: criteriaId
    })

    var employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(
        employeeKpiSetId, { $push: { kpis: employeeKpi._id } }, { new: true }
    );
    employeeKpiSet = await employeeKpiSet.populate('creator approver organizationalUnit').populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return employeeKpiSet;
}

/** Chỉnh sửa mục tiêu của KPI cá nhân */ 
exports.editEmployeeKpi = async (nameId,parentId,weightId,criteriaId,id) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.params.id
    var objUpdate = {
        name: nameId,
        parent: parentId,
        weight: weightId,
        criteria: criteriaId
    }
    var employeeKpi = await EmployeeKpi.findByIdAndUpdate(id, { $set: objUpdate }, { new: true }).populate("parent");
    return employeeKpi;
}

/** Xóa mục tiêu của KPI cá nhân */ 
exports.deleteEmployeeKpi = async (id,employeeKpiSetId) => {
    //req.params.id,req.params.kpipersonal
    var employeeKpi = await EmployeeKpi.findByIdAndDelete(id);
        var employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(employeeKpiSetId, { $pull: { kpis: id } }, { new: true });
        employeeKpiSet = await employeeKpiSet.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        return employeeKpiSet;
}

/** Chỉnh sửa trạng thái KPI: yêu cầu phê duyệt, hủy bỏ yêu cầu phê duyệt, khóa KPI */ 
exports.updateEmployeeKpiSetStatus = async (id,statusId) => {
    //req.params.id,req.params.status
    
    var employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true });
        employeeKpiSet = await employeeKpiSet.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        
        return employeeKpiSet;
}

/** Chỉnh sửa thông tin chung của KPI cá nhân */ 
exports.editEmployeeKpiSet = async (strDate,id) => {
    var arr = strDate.split("-");
    var date = new Date(arr[1], arr[0], 0)
    var employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(id, { $set: { date: date } }, { new: true });
    employeeKpiSet = await employeeKpiSet.populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return employeeKpiSet;
}

/** Xóa toàn bộ KPI cá nhân */ 
exports.deleteEmployeeKpiSet = async (id) => {
    //req.params.id
    var kpis = [];
        var employeeKpiSet = await EmployeeKpiSet.findById(id);
        if (employeeKpiSet.kpis) kpis = employeeKpiSet.kpis;
        if (kpis !== []) {
            kpis = await Promise.all(kpis.map(async (item) => {
                return EmployeeKpi.findByIdAndDelete(item._id);
            }))
        }
        employeeKpiSet = await EmployeeKpiSet.findByIdAndDelete(id);
        return [employeeKpiSet,kpis]
}

/**
 *  thêm bình luận
 */
exports.createComment = async (body,files) => {
    const commentss = {
        description : body.description,
        creator : body.creator,
        files:files
    }
    let comment1 = await EmployeeKpiSet.update(
        { _id: body.idKPI},
        { $push: { comments: commentss } }, { new: true }
    )
    let comment = await EmployeeKpiSet.findOne({ _id: body.idKPI})
        .populate([
            {path: 'comments.creator', model: User,select: 'name email avatar '}
        ])
    return comment.comments;    
}

/**
 *  thêm bình luận cua binh luan
 */
exports.createCommentOfComment = async (body,files) => {
    let commentss = await EmployeeKpiSet.updateOne(
        {"comments._id": body.idComment},
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
    let comment = await EmployeeKpiSet.findOne({ "comments._id": body.idComment})
        .populate([
            {path: 'comments.creator', model: User,select: 'name email avatar '},
            {path: 'comments.comments.creator',model: User,select: 'name email avatar'}
        ])
    return comment.comments;    
}
/**
 * Sửa bình luận
 */
exports.editComment = async (params,body) => {
    let commentss = await EmployeeKpiSet.updateOne(
        {"comments._id":params.id},
        {
            $set : {"comments.$.description": body.description}
        }
    )
    let comment = await EmployeeKpiSet.findOne({ "comments._id": params.id})
    .populate([
        {path: 'comments.creator', model: User,select: 'name email avatar '},
        {path: 'comments.comments.creator',model: User,select: 'name email avatar'}
    ])
    return comment.comments;    
}

/**
 * Delete comment
 */
exports.deleteComment = async (params) => {
    let comments = await EmployeeKpiSet.update(
        { "comments._id": params.id },
        { $pull: { comments: { _id: params.id } } },
        { safe: true })  
    let comment = await EmployeeKpiSet.findOne({ _id: params.idKPI})
    .populate([
        {path: 'comments.creator', model: User,select: 'name email avatar '},
        {path: 'comments.comments.creator',model: User,select: 'name email avatar'}
    ])
    return comment.comments
}
/**
 * Edit comment of comment
 */
exports.editCommentOfComment = async (params,body) => {
    const now = new Date()
    var comment1 = await EmployeeKpiSet.updateOne(
        { "comments.comments._id": params.id },
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
                    "elem._id": params.id
                }
            ]
        }
    )

    let comment = await EmployeeKpiSet.findOne({ "comments.comments._id": params.id})
    .populate([
        {path: 'comments.creator', model: User,select: 'name email avatar '},
        {path: 'comments.comments.creator',model: User,select: 'name email avatar'}
    ])
    return comment.comments
}

/**
 * Delete comment of comment
 */
exports.deleteCommentOfComment = async (params) => {
    let comment1 = await EmployeeKpiSet.update(
        { "comments.comments._id": params.id },
        { $pull: { "comments.$.comments" : {_id : params.id} } },
        { safe: true })
    
    let comment = await EmployeeKpiSet.findOne({ _id: params.idKPI})
    .populate([
        {path: 'comments.creator', model: User,select: 'name email avatar '},
        {path: 'comments.comments.creator',model: User,select: 'name email avatar'}
    ])

    return comment.comments
}