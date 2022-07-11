const { OrganizationalUnitKpiTemplate, Privilege, Role, UserRole, OrganizationalUnitKpi, User } = require(`../../../models`);
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
    portal = 'vnist';
    let { limit, number, keyword, unit } = query;
    console.log(84, query)

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


    kpiTemplates = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).find(
        {
            $and: [
                keySearch,
            ]
        }).sort({ 'createdAt': -1 })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit" })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "kpis" })

    // console.log(122, kpiTemplates)

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
exports.createKpiTemplate = async (data) => {
    console.log(160, data)
    const { name, organizationalUnit, description, creator, kpis } = data;

    let portal = 'vnist';
    // let userId = '62c560164729e4114590dd1d';

    //kiểm tra tên mẫu kpi đã tồn tại hay chưa ?
    let checkKpiTemplate = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).findOne({ name: name });
    if (checkKpiTemplate) throw ['kpi_template_name_exist'];
    console.log(105, name, organizationalUnit)


    //Tạo dữ liệu mẫu kpi
    var kpiSettemplate = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).create({
        organizationalUnit: organizationalUnit,
        name: name,
        creator: creator,
        description: description
    });


    // Them muc tieu kpi
    let kpiTemplate = [];
    console.log(184, kpis)
    for (let item of kpis) {
        let keyArr = [];
        for (let key in item.keys) {
            keyArr.push({
                key: key,
                name: item.keys[key]
            })

        }
        console.log(196, keyArr)
        kpiTemplate.push({
            name: item.name,
            weight: item.weight,
            criteria: item.criteria,
            target: item.target,
            unit: item.unit,
            formula: item.formula,
            keys: keyArr,
        })
    }

    if (kpiTemplate) {
        let kpis = await Promise.all(kpiTemplate.map(async (item) => {
            console.log(207, item)
            let kpi = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal)).create(item)
            return kpi._id;
        }));
        console.log(210, kpis)
        console.log(211, kpiSettemplate._id)

        kpiSettemplate = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal))
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
    console.log(221, kpiSettemplate)
    return kpiSettemplate;
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
    const kpiIds = [];
    for (let item of data.kpis) {

        // muc tieu them moi
        if (!item._id) {
            console.log(251, 'create')
            let data = {
                name: item.name,
                weight: item.weight,
                criteria: item.criteria,
                target: item.target,
                unit: item.unit,
            }
            console.log(259, data)
            let kpi = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal)).create(data);

            console.log(261, kpi._id)
            // kpiIds.push(kpi._id)
            kpiIds.push(kpi._id)
        } else {
            // muc tieu chinh sua
            console.log(266)
            let kpi = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal)).findByIdAndUpdate(item._id,
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
            console.log(279)
            kpiIds.push(kpi._id)
        }
    }

    console.log(278, kpiIds)
    console.log('data', data, id)

    var kpiTemplate = await OrganizationalUnitKpiTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id,
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
