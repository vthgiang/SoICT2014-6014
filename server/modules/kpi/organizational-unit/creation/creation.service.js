const Models = require(`../../../../models`)
const { OrganizationalUnitKpi, OrganizationalUnit, OrganizationalUnitKpiSet } = Models
const overviewService = require('../../employee/management/management.service')
const UserService = require('../../../super-admin/user/user.service')
const NewsFeedService = require('../../../news-feed/newsFeed.service')

const { connect } = require(`../../../../helpers/dbHelper`);
const mongoose = require('mongoose');

/**
 * Get organizational unit kpi set
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
exports.getOrganizationalUnitKpiSet = async (portal, query) => {
    let month, nextMonth, department;

    if (query.month) {
        month = new Date(query.month);
        nextMonth = new Date(query.month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
    } else {
        let currentYear, currentMonth, now;

        now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth() + 1;
        if (currentMonth < 10) {
            currentMonth = "0" + currentMonth;
        }

        month = new Date(currentYear + "-" + currentMonth);
        nextMonth = new Date(currentYear + "-" + currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
    }

    if (!query.organizationalUnitId) {
        department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({
                $or: [
                    { 'managers': query.roleId },
                    { 'deputyManagers': query.roleId },
                    { 'employees': query.roleId }
                ]
            });
    } else {
        department = { '_id': query.organizationalUnitId };
    }

    let kpiunit;
    if (department) {
        // Status khác 2 --> chưa kết thúc
        kpiunit = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findOne({
                organizationalUnit: department._id,
                status: { $ne: 2 }, date: { $lt: nextMonth, $gte: month }
            })
            .populate("organizationalUnit")
            .populate({path: "creator", select :"_id name email avatar"})
            .populate({ path: "kpis", populate: { path: 'parent' } })
            .populate([
                { path: "comments.creator", select: 'name email avatar' },
                { path: "comments.comments.creator", select: 'name email avatar' },
            ])
            .populate({ path: 'employeeImportances', populate: { path: 'employee', select: ' _id name email' } })
            .populate({ path: 'organizationalUnitImportances', populate: { path: 'organizationalUnit' } });
    }

    return kpiunit;
}

/**
 * Lấy tập KPI đơn vị của đơn vị cha của đơn vị ứng với role người dùng
 * @id Id role người dùng
 */
exports.getParentOrganizationalUnitKpiSet = async (portal, data) => {
    const { roleId, organizationalUnitId, month } = data
    let department, kpiunit;
    let monthIso, nextMonth;

    if (organizationalUnitId) {
        department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findById(organizationalUnitId);
    } else {
        department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({
                $or: [
                    { 'managers': roleId },
                    { 'deputyManagers': roleId },
                    { 'employees': roleId }
                ]
            });
    }

    if (month) {
        monthIso = new Date(month);
        nextMonth = new Date(month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
    } else {
        let currentYear, currentMonth, now;

        now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth() + 1;
        if (currentMonth < 10) {
            currentMonth = "0" + currentMonth;
        }

        monthIso = new Date(currentYear + "-" + currentMonth);
        nextMonth = new Date(currentYear + "-" + currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
    }

    if (department) {
        kpiunit = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findOne({
                organizationalUnit: department.parent,
                date: { $gte: monthIso, $lt: nextMonth }
            })
            .populate("organizationalUnit")
            .populate({path: "creator", select :"_id name email avatar"})
            .populate({ path: "kpis", populate: { path: 'parent' } })
            .populate({ path: 'employeeImportances', populate: { path: 'employee', select: ' _id name email' } })
            .populate({ path: 'organizationalUnitImportances', populate: { path: 'organizationalUnit' } })
            .populate([
                { path: "comments.creator", select: 'name email avatar' },
                { path: "comments.comments.creator", select: 'name email avatar' },
            ]);
    }

    return kpiunit;

}

/**
 * Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị
 * @query {*} organizationalUnitId 
 * @query {*} startDate
 * @query {*} endDate
 */
exports.getAllOrganizationalUnitKpiSetByTime = async (portal, roleId, organizationalUnitId, startDate, endDate) => {
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    endDate.setMonth(endDate.getMonth() + 1)
    
    let organizationalUnit, organizationalUnitKpiSets;
    if (!organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({
                $or: [
                    { 'managers': roleId },
                    { 'deputyManagers': roleId },
                    { 'employees': roleId }
                ]
            });
    } else {
        organizationalUnit = { '_id': organizationalUnitId }
    }

    if (organizationalUnit) {
        organizationalUnitKpiSets = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .find(
                {
                    'organizationalUnit': organizationalUnit._id,
                    'date': {
                        $gte: startDate,
                        $lt: endDate
                    }
                },
                { automaticPoint: 1, employeePoint: 1, approvedPoint: 1, date: 1 }
            )
    }

    return organizationalUnitKpiSets;
}

/** 
 * Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại 
 * @query {*} roleId 
 * @query {*} startDate
 * @query {*} endDate
 */
exports.getAllOrganizationalUnitKpiSetByTimeOfChildUnit = async (portal, query) => {

    let childOrganizationalUnitKpiSets = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await overviewService.getAllChildrenOrganizational(portal, query.roleId);

    for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
        childOrganizationalUnitKpiSets.push(await this.getAllOrganizationalUnitKpiSetByTime(portal, null, childrenOrganizationalUnits[i].id, query.startDate, query.endDate));
        childOrganizationalUnitKpiSets[i].unshift({ 'name': childrenOrganizationalUnits[i].name })
    }

    return childOrganizationalUnitKpiSets;
}



/**
 * Lấy tất cả KPI của đơn vị 
 * @query {*} roleId id chức danh 
 * @query {*} startDate
 * @query {*} endDate 
 * @query {*} status trạng thái của OrganizationalUnitKPISet
 */
exports.getAllOrganizationalUnitKpiSet = async (portal, data) => {
    let keySearch = {}, status;

    status = Number(data.status);

    if (data && !data.organizationalUnit || data.organizationalUnit.length === 0) {
        let organizationalUnit;

        organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({
                $or: [
                    { 'managers': data.roleId },
                    { 'deputyManagers': data.roleId },
                    { 'employees': data.roleId }
                ]
            });
        if (organizationalUnit) {
            keySearch = {
                ...keySearch,
                organizationalUnit: organizationalUnit._id
            };
        }
    } else {
        keySearch = {
            ...keySearch,
            organizationalUnit: { $in: data.organizationalUnit }
        };
    }

    if (status !== -1) {
        keySearch = {
            ...keySearch,
            status: status
        };
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
            date: { "$gte": new Date(data.startDate) }
        }
    }
    else if (data && data.endDate) {
        data.endDate = new Date(data.endDate);
        data.endDate.setMonth(data.endDate.getMonth() + 1);

        keySearch = {
            ...keySearch,
            date: { "$lt": data.endDate }
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

    let kpiUnitSets = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .find(keySearch)
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate("organizationalUnit ")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: "comments.creator", select: 'name email avatar' },
            { path: "comments.comments.creator", select: 'name email avatar' },
        ])
        .populate({ path: 'employeeImportances', populate: { path: 'employee', select: ' _id name email' } })
        .populate({ path: 'organizationalUnitImportances', populate: { path: 'organizationalUnit' } });

    let totalCount = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let totalPages = Math.ceil(totalCount / perPage);

    return {
        kpiUnitSets,
        totalCount,
        totalPages
    };
}

/**
 * Chỉnh sửa độ quan trọng của nhân viên hoặc đơn vị
 * @id Id của tập KPI đơn vị
 */
exports.editImportancesInUnitKpi = async (portal, id, data, type) => {
    let keySet = {};
    if (type === 'edit-employee-importance') {
        keySet = {
            employeeImportances: data
        }
    } else if (type === 'edit-organizational-unit-importance') {
        keySet = {
            organizationalUnitImportances: data
        }
    }

    let organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: keySet }, { new: true })

    organizationalUnitKpiSet = organizationalUnitKpiSet && await organizationalUnitKpiSet
        .populate("organizationalUnit")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: "comments.creator", select: 'name email avatar' },
            { path: "comments.comments.creator", select: 'name email avatar' },
        ])
        .populate({ path: 'employeeImportances', populate: { path: 'employee', select: ' _id name email' } })
        .populate({ path: 'organizationalUnitImportances', populate: { path: 'organizationalUnit' } })
        .execPopulate();

    return organizationalUnitKpiSet;
}


/**
 * Khởi tạo tập KPI đơn vị
 * @data thông tin chung của tập Kpi đơn vị
 */
exports.createOrganizationalUnitKpiSet = async (portal, data) => {
    const { date, creator, organizationalUnitId } = data;
    let monthSearch, nextMonthSearch;

    monthSearch = new Date(date);
    nextMonthSearch = new Date(date);
    nextMonthSearch.setMonth(nextMonthSearch.getMonth() + 1);

    // Tạo thông tin chung cho KPI đơn vị
    let organizationalUnitKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .create({
            organizationalUnit: organizationalUnitId,
            creator: creator,
            date: new Date(date),
            kpis: []
        });

    // Tìm kiếm phòng ban hiện tại và kiểm tra xem nó có phòng ban cha hay không
    let organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findById(organizationalUnitId);

    if (organizationalUnit && organizationalUnit.parent) {
        let organizationalUnitParent = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findOne({
                organizationalUnit: organizationalUnit.parent,
                status: 1,
                date: {
                    $gte: monthSearch, $lt: nextMonthSearch
                }
            })
            .populate("kpis");

        let defaultTarget;

        if (organizationalUnitParent && organizationalUnitParent.kpis) defaultTarget = organizationalUnitParent.kpis.filter(item => item.type !== 0);//default Target là nhưng mục tiêu có default !== 0
        if (defaultTarget) {
            defaultTarget = await Promise.all(defaultTarget.map(async (item) => {
                let defaultT = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
                    .create({
                        name: item.name,
                        parent: item._id,
                        weight: 5,
                        criteria: item.criteria,
                        type: item.type
                    })
                return defaultT._id;
            }))
            organizationalUnitKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
                .findByIdAndUpdate(
                    organizationalUnitKpi, { kpis: defaultTarget }, { new: true }
                );
        }
    } else {
        let targetA = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
            .create({
                name: "Phê duyệt công việc",
                parent: null,
                weight: 5,
                criteria: "Thực hiện tốt vai trò người phê duyệt trong các công việc. Người phê duyệt là người chịu trách nhiệm về thành công/thất bại của công việc",
                type: 1
            })
        organizationalUnitKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                organizationalUnitKpi, { $push: { kpis: targetA._id } }, { new: true }
            );

        let targetC = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
            .create({
                name: "Hỗ trợ thực hiện công việc",
                parent: null,
                weight: 5,
                criteria: "Thực hiện tốt vai trò người tư vấn (consulted) trong các công việc",
                type: 2
            })
        organizationalUnitKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                organizationalUnitKpi, { $push: { kpis: targetC._id } }, { new: true }
            );
    }

    // Thêm độ quan trọng đơn vị
    let units = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({
        parent: organizationalUnitId
    })
    let organizationalUnitImportances = [];

    if (units && units.length > 0) {
        organizationalUnitImportances = units.map(item => {
            return {
                organizationalUnit: item?._id,
                importance: 100
            }
        })
    }

    // Thêm độ quan trọng nhân viên
    let users = await UserService.getAllEmployeeOfUnitByIds(portal, {
        ids: [organizationalUnitId]
    });
    let employeeImportances = [];

    if (users && users.length !== 0) {
        employeeImportances = users?.employees?.map(item => {
            return {
                employee: item?.userId?._id,
                importance: 100
            }
        })
    }
    organizationalUnitKpi = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(
            organizationalUnitKpi,
            {
                'employeeImportances': employeeImportances,
                'organizationalUnitImportances': organizationalUnitImportances
            },
            { new: true }
        );

    organizationalUnitKpi = organizationalUnitKpi && await organizationalUnitKpi
        .populate([
            { path: "organizationalUnit" },
            {path: "creator", select :"_id name email avatar"},
            { path: "kpis", populate: { path: 'parent' } },
            { path: 'comments.creator', select: 'name email avatar ' },
            { path: 'comments.comments.creator', select: 'name email avatar' },
            { path: 'employeeImportances', populate: { path: 'employee', select: ' _id name email' } },
            { path: 'organizationalUnitImportances', populate: { path: 'organizationalUnit' } }
        ])
        .execPopulate();

    return organizationalUnitKpi;
}

/**
 * Thêm một KPI vào tập KPI đơn vị
 * @data thông tin về KPI cần thêm vào tập KPI đơn vị
 * 
 */
exports.createOrganizationalUnitKpi = async (portal, data) => {
    let checkTarget, target, organizationalUnitKpiSet;

    // Kiểm tra đã tồn tại kpi có tên = data.name chưa
    checkTarget = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { '_id': mongoose.Types.ObjectId(data.organizationalUnitKpiSetId) } },
            {
                $lookup:
                {
                    from: "organizationalunitkpis",
                    localField: "kpis",
                    foreignField: "_id",
                    as: "organizationalUnitKpis"
                }
            },
            { $unwind: "$organizationalUnitKpis" },
            { $replaceRoot: { newRoot: "$organizationalUnitKpis" } },
            { $match: { 'name': data.name } },
        ])

    if (checkTarget.length > 0) {
        throw {
            messages: 'organizational_unit_kpi_exist'
        };
    } else {
        target = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
            .create({
                name: data.name,
                parent: data.parent,
                weight: data.weight,
                criteria: data.criteria
            })
        organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                data.organizationalUnitKpiSetId, { $push: { kpis: target._id } }, { new: true }
            );

        organizationalUnitKpiSet = organizationalUnitKpiSet && await organizationalUnitKpiSet
            .populate("organizationalUnit")
            .populate({path: "creator", select :"_id name email avatar"})
            .populate({ path: "kpis", populate: { path: 'parent' } })
            .populate([
                { path: "comments.creator", select: 'name email avatar' },
                { path: "comments.comments.creator", select: 'name email avatar' },
            ])
            .populate({ path: 'employeeImportances', populate: { path: 'employee', select: ' _id name email' } })
            .populate({ path: 'organizationalUnitImportances', populate: { path: 'organizationalUnit' } })
            .execPopulate();
    }

    return organizationalUnitKpiSet;

}

/**
 * Chỉnh sửa KPI đơn vị
 * @data thông tin KPI cần chỉnh sửa
 * @id Id của KPI đơn vị
 */
exports.editOrganizationalUnitKpi = async (portal, data, id) => {
    // Kiểm tra đã tồn tại kpi có tên = data.name chưa
    checkTarget = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { 'kpis': { $elemMatch: { $eq: mongoose.Types.ObjectId(id) } } } },
            {
                $lookup:
                {
                    from: "organizationalunitkpis",
                    localField: "kpis",
                    foreignField: "_id",
                    as: "organizationalUnitKpis"
                }
            },
            { $unwind: "$organizationalUnitKpis" },
            { $replaceRoot: { newRoot: "$organizationalUnitKpis" } },
            { $match: { 'name': data.name } },
        ])
    

    let target;
    if (checkTarget.length > 0 && checkTarget?.[0]?._id.toString() !== id) {
        throw {
            messages: 'organizational_unit_kpi_exist'
        };
    } else {
        let objUpdate = {
            name: data.name,
            parent: data.parent,
            weight: data.weight,
            criteria: data.criteria
        }
        
        target = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(id, { $set: objUpdate }, { new: true });
        target = target && await target.populate("parent").execPopulate();
    }

    let unitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ kpis: { $elemMatch: { $eq: mongoose.Types.ObjectId(id) } } })
        .populate("organizationalUnit")
        
    return {
        target,
        unitKpiSet
    }
}

/**
 * Xóa KPI đơn vị
 * @id Id của KPI đơn vị
 * @organizationalUnitKpiSetId Id của tập KPI đơn vị
 */
exports.deleteOrganizationalUnitKpi = async (portal, id, organizationalUnitKpiSetId) => {
    let organizationalUnitKpi = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal))
        .findByIdAndDelete(id);
    let organizationalUnitKpiSet = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(organizationalUnitKpiSetId, { $pull: { kpis: id } }, { new: true });

    organizationalUnitKpiSet = organizationalUnitKpiSet && await organizationalUnitKpiSet
        .populate("organizationalUnit")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate([
            { path: "comments.creator", select: 'name email avatar' },
            { path: "comments.comments.creator", select: 'name email avatar' },
        ])
        .populate({ path: 'employeeImportances', populate: { path: 'employee', select: ' _id name email' } })
        .populate({ path: 'organizationalUnitImportances', populate: { path: 'organizationalUnit' } })
        .execPopulate();

    return {
        organizationalUnitKpiSet,
        organizationalUnitKpi
    }
}

/**
 * Chỉnh sửa trạng thái của tập KPI đơn vị
 * @id Id của tập KPI đơn vị
 * @statusId trạng thái mới của tập KPI đơn vị
 */
exports.editOrganizationalUnitKpiSetStatus = async (portal, id, data) => {
    let kpiunit = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, { $set: { status: data.status } }, { new: true });

    kpiunit = kpiunit && await kpiunit
        .populate("organizationalUnit")
        .populate({path: "creator", select :"_id name email avatar"})
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .populate({ path: 'employeeImportances', populate: { path: 'employee', select: ' _id name email' } })
        .populate({ path: 'organizationalUnitImportances', populate: { path: 'organizationalUnit' } })
        .execPopulate();

    return kpiunit;
}

/**
 * Xóa tập KPI đơn vị
 * @id Id của tập KPI đơn vị
 */
exports.deleteOrganizationalUnitKpiSet = async (portal, id) => {
    let kpis = [];
    let kpiunit = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal)).findById(id);
    if (kpiunit.kpis) kpis = kpiunit.kpis;
    if (kpis !== []) {
        kpis = await Promise.all(kpis.map(async (item) => {
            return OrganizationalUnitKpi(connect(DB_CONNECTION, portal)).findByIdAndDelete(item._id);
        }))
    }
    kpiunit = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
    return [kpiunit, kpis];
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
    let comment1 = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { _id: params.kpiId },
            { $push: { comments: commentss } }, { new: true }
        )
    let comment = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let commentss = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId },
            {
                $set: { "comments.$.description": body.description }
            }
        )

    let comment1 = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .updateOne(
            { "_id": params.kpiId, "comments._id": params.commentId },
            {
                $push:
                {
                    "comments.$.files": files
                }
            }
        )
    let comment = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let files1 = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.kpiId) } },
            { $unwind: "$comments" },
            { $replaceRoot: { newRoot: "$comments" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
            { $unwind: "$files" },
            { $replaceRoot: { newRoot: "$files" } },
        ])

    let files2 = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let comments = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId },
            { $pull: { comments: { _id: params.commentId } } },
            { safe: true }
        )
    let comment = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let commentss = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let comment = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let comment1 = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let action1 = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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


    let comment = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let files = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let comment1 = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId, "comments.comments._id": params.childCommentId },
            { $pull: { "comments.$.comments": { _id: params.childCommentId } } },
            { safe: true }
        )

    let comment = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let file = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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

    let comment1 = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId },
            { $pull: { "comments.$.files": { _id: params.fileId } } },
            { safe: true }
        )
    let task = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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
    let file = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
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

    let action = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .update(
            { "_id": params.kpiId, "comments._id": params.commentId },
            { $pull: { "comments.$.comments.$[].files": { _id: params.fileId } } },
            { safe: true }
        );

    let task = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal))
        .findOne({ "_id": params.kpiId, "comments._id": params.commentId },)
        .populate([
            { path: "comments.creator", select: 'name email avatar' },
            { path: "comments.comments.creator", select: 'name email avatar' },
        ]);

    return task.comments;
}

/** Thêm newsfeed cho kpi đơn vị */
exports.createNewsFeedForOrganizationalUnitKpiSet = async (portal, data) => {
    const { creator, title, description, organizationalUnitKpiSetId, organizationalUnit } = data

    let relatedUsers = await UserService.getAllEmployeeOfUnitByIds(portal, {
        ids: [organizationalUnit?._id]
    })

    let newsFeed = await NewsFeedService.createNewsFeed(portal, {
        title: title,
        description: description,
        creator: creator,
        associatedDataObject: { 
            dataType: 2,
            value: organizationalUnitKpiSetId
        },
        relatedUsers: relatedUsers?.employees?.map(item => item?.userId?._id)
    })

    return newsFeed
}