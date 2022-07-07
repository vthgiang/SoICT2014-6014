const { OrganizationalUnitKpiTemplate, Privilege, Role, UserRole, OrganizationalUnit, User } = require(`../../../models`);
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

/**
 * Lấy tất cả các mẫu kpi
 */
exports.getAllKpiTemplates = async (portal, query) => {
    if (query.pageNumber === '1' && query.noResultsPerPage === '0') {
        // LẤY DANH SÁCH TẤT CẢ CÁC MẪU CÔNG VIỆC CÓ TRONG HỆ THỐNG CỦA CÔNG TY
        let docs = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).find().populate([
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
        return await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal))
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

        return await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).find();
    }
}

/**
 * Lấy công việc thực hiện chính theo id người dùng
 * @task dữ liệu trong params
 */
exports.getPaginatedKpiTemplates = async (portal, query) => {
    console.log(84, query)
    portal = 'vnist';
    let { limit, number, keyword, organizationalUnit } = query;

    let kpiTemplates;
    let perPage = Number(limit);
    let page = Number(number);

    let keySearch = {};

    // Tìm kiếm theo đơn vị
    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
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


    kpiTemplates = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).find(
        {
            $and: [
                keySearch,
            ]
        }).sort({ 'createdAt': -1 })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit" })
        .populate({ path: "creator", select: "_id name email avatar" }
        )

    console.log(122, kpiTemplates)

    var totalCount = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).countDocuments({
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
    return await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: "organizationalUnit", select: "name managers" },
            { path: "creator", select: "name email avatar" }]);
}

/**
 * Tạo mới mẫu kpi
 * @body dữ liệu tạo mới mẫu kpi
 */
exports.createKpiTemplate = async (body) => {

    portal = 'vnist';
    userId = '62c560164729e4114590dd1d';

    console.log(100, body)
    //kiểm tra tên mẫu kpi đã tồn tại hay chưa ?
    let checkKpiTemplate = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).findOne({ name: body.name });
    if (checkKpiTemplate) throw ['kpi_template_name_exist'];
    console.log(105)
    // for (let i in body.kpiActions) {
    //     if (body.kpiActions[i].description) {
    //         let str = body.kpiActions[i].description;
    //         let vt = str.indexOf("&nbsp;");
    //         let st;
    //         while (vt >= 0) {
    //             if (vt == 0) {
    //                 st = str.slice(vt + 6);
    //             } else {
    //                 st = str.slice(0, vt - 1) + str.slice(vt + 6);
    //             }
    //             str = st;
    //             vt = str.indexOf("&nbsp;");
    //         }
    //         vt = str.indexOf("<");
    //         while (vt >= 0) {
    //             let vt2 = str.indexOf(">");
    //             if (vt == 0) {
    //                 st = str.slice(vt2 + 1);
    //             } else {
    //                 st = str.slice(0, vt - 1) + str.slice(vt2 + 1);
    //             }
    //             str = st;
    //             vt = str.indexOf("<");
    //         }
    //         body.kpiActions[i].description = str;
    //     }
    // }


    //Tạo dữ liệu mẫu kpi
    var kpitemplate = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).create({
        organizationalUnit: body.organizationalUnit,
        name: body.name,
        creator: userId, //id của người tạo
        description: body.description,
        // kpiActions: body.kpis.map(item => {
        //     return item.id;
        // }),
    });

    kpitemplate = await kpitemplate.populate([
        { path: "organizationalUnit", select: "name managers" },
        { path: "creator", select: "name email" }]).execPopulate();
    return kpitemplate;
}

/**
 * Xóa mẫu kpi
 * @id id kpi cần xóa
 */
exports.deleteKpiTemplate = async (portal, id) => {
    var template = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).findByIdAndDelete(id); // xóa mẫu kpi theo id
    return { id: id };
}

/**
 * Sửa mẫu kpi
 * @data dữ liệu cập nhật
 * @id id mẫu kpi cập nhật
 */
exports.editKpiTemplate = async (portal, data, id) => {
    var kpiTemplate = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id,
        {
            $set: {
                name: data.name,
                description: data.description,
                organizationalUnit: data.organizationalUnit,
                // kpiActions: data.kpiActions,
                // kpiInformations: data.kpiInformations.map((item, key) => {
                //     return {
                //         code: "p" + parseInt(key + 1),
                //         name: item.name,
                //         description: item.description,
                //         filledByAccountableEmployeesOnly: item.filledByAccountableEmployeesOnly,
                //         type: item.type,
                //         extra: item.extra,
                //     }
                // })
            }
        },
        { new: true },
    ).populate([
        { path: "organizationalUnit", select: "name managers" },
        { path: "creator", select: "name email" }]);

    return kpiTemplate;
}
