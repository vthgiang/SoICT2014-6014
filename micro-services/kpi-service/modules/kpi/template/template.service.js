const { OrganizationalUnitKpiTemplate, OrganizationalUnitKpiSetTemplate, Privilege, Role, UserRole, User } = require(`../../../models`);
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

/**
 * Lấy tất cả các mẫu kpi
 */
exports.getAllKpiTemplates = async (portal, query) => {
    if (query.pageNumber === '1' && query.noResultsPerPage === '0') {
        // LẤY DANH SÁCH TẤT CẢ CÁC MẪU CÔNG VIỆC CÓ TRONG HỆ THỐNG CỦA CÔNG TY
        let docs = await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal)).find().populate([
            { path: "creator readByEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees", select: "name email" },
            { path: 'organizationalUnit' },
            { path: 'collaboratedWithOrganizationalUnits' }
        ]);
        return {
            docs: docs
        }
    }
    if (query.roleId) {
        // LẤY DANH SÁCH MẪU CÔNG VIỆC VỚI MỘT VAI TRÒ NÀO ĐÓ

        let role = await Role(connect(DB_CONNECTION, portal)).findById(query.roleId);
        let roles = [role._id, ...role.parents];

        let kpis = await Privilege(connect(DB_CONNECTION, portal)).find({
            role: { $in: roles },
            resourceType: 'KpiTemplate'
        }).populate({ path: 'resource', populate: { path: 'creator' } });

        return kpis;
    } else if (query.userId) {
        // LẤY DANH SÁCH TẤT CẢ CÁC MẪU CÔNG VIỆC MÀ NGƯỜI DÙNG CÓ QUYỀN XEM

        let id = query.userId,
            pageNumber = Number(query.pageNumber),
            noResultsPerPage = Number(query.noResultsPerPage),
            organizationalUnit = query.arrayUnit,
            name = query.name;
        // Danh sách các quyền của user - userRoles
        let dataRoles = await UserRole(connect(DB_CONNECTION, portal))
            .find({ userId: id })
            .populate('roleId');
        dataRoles = dataRoles.map(userRole => userRole.roleId);
        let userRoles = dataRoles.reduce((arr, role) => [...arr, role._id, ...role.parents], [])
        userRoles = userRoles.filter((role, index) => role.toString() === userRoles[index].toString());
        let option = !organizationalUnit ?
            {
                $or: [
                    { readByEmployees: { $in: userRoles } },
                    { creator: id }
                ],
                name: { "$regex": name, "$options": "i" }
            } : {
                $or: [
                    { readByEmployees: { $in: userRoles } },
                    { creator: id }
                ],
                name: { "$regex": name, "$options": "i" },
                organizationalUnit: { $in: organizationalUnit }
            };
        return await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page: pageNumber,
                limit: noResultsPerPage,
                populate: [
                    { path: "creator readByEmployees responsibleEmployees accountableEmployees consultedEmployees informedEmployees", select: "name email" },
                    { path: 'organizationalUnit' },
                    { path: 'collaboratedWithOrganizationalUnits' }
                ]
            });
    } else {
        // LẤY DANH SÁCH TẤT CẢ CÁC MẪU CÔNG VIỆC CÓ TRONG HỆ THỐNG CỦA CÔNG TY

        return await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal)).find();
    }
}

/**
 * Lấy công việc thực hiện chính theo id người dùng
 * @task dữ liệu trong params
 */
exports.getPaginatedKpiTemplates = async (portal, query) => {
    let { limit, number, keyword, unit } = query;
    let kpiTemplates;
    let perPage = Number(limit);
    let page = Number(number);

    let keySearch = {};

    // Tìm kiếm theo đơn vị
    if (unit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: unit,
            }
        };
    }

    // Tìm kiếm theo từ khóa
    if (keyword) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: keyword,
                $options: "i"
            }
        }
    };

    kpiTemplates = await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal)).find(
        {
            $and: [
                keySearch,
            ]
        }).sort({ 'createdAt': -1 })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit" })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "kpis" })
        .populate({ path: "kpiSet", select: "approvedPoint automaticPoint employeePoint organizationalUnit date", populate: { path: "organizationalUnit" } })

    var totalCount = await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
        ]
    });
    var totalPages = Math.ceil(totalCount / perPage);

    return {
        "kpiTemplates": kpiTemplates,
        "totalPage": totalPages,
        totalCount
    };
}

/**
 * Lấy mẫu kpi thoe Id
 * @id id mẫu kpi
 */
exports.getKpiTemplate = async (portal, id) => {
    return await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: "organizationalUnit", select: "name managers" },
            { path: "creator", select: "name email avatar" }]);
}

/**
 * Tạo mới mẫu kpi
 * @body dữ liệu tạo mới mẫu kpi
 */
exports.createKpiTemplate = async (portal, data) => {
    const { name, organizationalUnit, description, creator, kpis } = data;

    //kiểm tra tên mẫu kpi đã tồn tại hay chưa ?
    let checkKpiTemplate = await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal)).findOne({ name: name });
    if (checkKpiTemplate) throw { messages: "kpi_template_name_exist" };

    //Tạo dữ liệu mẫu kpi
    var kpiSettemplate = await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal)).create({
        organizationalUnit: organizationalUnit,
        name: name,
        creator: creator,
        description: description,
        kpiSet: []
    });


    // Them muc tieu kpi
    let kpiTemplate = [];
    for (let item of kpis) {
        kpiTemplate.push({
            name: item.name,
            weight: item.weight,
            criteria: item.criteria,
            target: item.target,
            unit: item.unit
        })
    }

    if (kpiTemplate) {
        let kpis = await Promise.all(kpiTemplate.map(async (item) => {
            let kpi = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).create(item)
            return kpi._id;
        }));

        kpiSettemplate = await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(
                kpiSettemplate._id, { $push: { kpis: { $each: kpis } } }, { new: true }
            )
    }

    kpiSettemplate = await kpiSettemplate.populate([
        { path: "organizationalUnit", select: "name managers" },
        { path: "creator", select: "name email" },
        { path: "kpis" }
    ])
        .execPopulate();

    return kpiSettemplate;
}

/**
 * Xóa mẫu kpi
 * @id id kpi cần xóa
 */
exports.deleteKpiTemplate = async (portal, id) => {
    let kpis = [];
    let kpiTemplate = await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal)).findById(id);
    if (kpiTemplate.kpis) kpis = kpiTemplate.kpis;
    if (kpis !== []) {
        kpis = await Promise.all(kpis.map(async (item) => {
            return OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).findByIdAndDelete(item._id);
        }))
    }
    kpiTemplate = await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
    return kpiTemplate;
}

/**
 * Sửa mẫu kpi
 * @data dữ liệu cập nhật
 * @id id mẫu kpi cập nhật
 */
exports.editKpiTemplate = async (portal, data, id) => {
    const kpiIds = [];
    for (let item of data.kpis) {

        // muc tieu them moi
        if (!item._id) {
            let data = {
                name: item.name,
                weight: item.weight,
                criteria: item.criteria,
                target: item.target,
                unit: item.unit,
            }
            let kpi = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).create(data);

            kpiIds.push(kpi._id)
        } else {
            // muc tieu chinh sua
            let kpi = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(item._id,
                {
                    $set: {
                        name: item.name,
                        weight: item.weight,
                        criteria: item.criteria,
                        target: item.target,
                        unit: item.unit
                    }
                },
                { new: true },
            )
            kpiIds.push(kpi._id)
        }
    }

    var kpiTemplate = await OrganizationalUnitKpiSetTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id,
        {
            $set: {
                name: data.name,
                description: data.description,
                organizationalUnit: data.organizationalUnit,
                kpis: kpiIds
            }
        },
        { new: true },
    ).populate([
        { path: "organizationalUnit", select: "name managers" },
        { path: "creator", select: "name email" }]);

    return kpiTemplate;
}
