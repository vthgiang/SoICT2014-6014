const { Good, OrganizationalUnit, ManufacturingWorks, ManufacturingMill } = require(`../../../../models`);
const { connect } = require(`../../../../helpers/dbHelper`);

exports.getGoodsByType = async (company, query, portal) => {
    var { page, limit, type } = query;
    // if (!company) throw ['company_invaild'];
    if (!page && !limit) {
        return await Good(connect(DB_CONNECTION, portal))
            .find({type })
            .populate([
                { path: 'materials.good', select: 'id name' },
                { path: 'manufacturingMills.manufacturingMill' }
            ])
    } else {
        let option = {
            // company: company,
            type: type
        }

        if (query.sourceType) {
            option.sourceType = query.sourceType;
        }

        if (query.category) {
            option.category = query.category;
        }

        if (query.name) {
            option.name = new RegExp(query.name, "i");
        }

        if (query.code) {
            option.code = new RegExp(query.code, "i");
        }

        return await Good(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'materials.good', select: 'id name' },
                    { path: 'manufacturingMills.manufacturingMill' }
                ]
            })
    }
}

exports.getAllGoodsByType = async (query, portal) => {
    let { type } = query;
    return await Good(connect(DB_CONNECTION, portal))
        .find({ type })
        .populate([
            { path: 'materials.good', select: 'id code name baseUnit' },
            { path: 'manufacturingMills.manufacturingMill' }
        ])
}

exports.getAllGoodsByCategory = async (company, categoryId, portal) => {
    return await Good(connect(DB_CONNECTION, portal))
        .find({category: categoryId })
        .populate([
            { path: 'materials.good', select: 'id name' }
        ])
}

exports.createGoodByType = async (company, data, portal) => {
    let good = await Good(connect(DB_CONNECTION, portal)).create({
        // company: company,
        category: data.category,
        code: data.code,
        name: data.name,
        type: data.type,
        sourceType: data.sourceType,
        baseUnit: data.baseUnit,
        // packingRule: data.packingRule,
        numberExpirationDate: data.numberExpirationDate,
        units: data.units.map(item => {
            return {
                name: item.name,
                conversionRate: item.conversionRate,
                description: item.description
            }
        }),
        materials: data?.materials ? data.materials.map(item => {
            return {
                good: item.good,
                quantity: item.quantity
            }
        }):[],
        manufacturingMills: data?.manufacturingMills ? data.manufacturingMills.map(item => {
            return {
                manufacturingMill: item.manufacturingMill,
                productivity: item.productivity,
                personNumber: item.personNumber
            }
        }):[], // Trường hợp manufacturingMill ko có.. => data.manufacturingMills lỗi.. => không tạo được
        description: data.description,
        quantity: data.quantity ? data.quantity : 0,
        pricePerBaseUnit: data.pricePerBaseUnit,
        salesPriceVariance: data.salesPriceVariance
    });

    return await Good(connect(DB_CONNECTION, portal))
        .findById(good._id)
        .populate([
            { path: 'materials.good', select: 'id name' },
            { path: 'manufacturingMills.manufacturingMill' }
        ])
}

exports.getGoodDetail = async (id, portal) => {
    return await Good(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'materials.good', select: 'id name' },
            { path: 'manufacturingMills.manufacturingMill' }
        ])
}

exports.editGood = async (id, data, portal) => {
    let good = await Good(connect(DB_CONNECTION, portal)).findById(id);
    good.category = data.category,
        good.code = data.code,
        good.name = data.name,
        good.type = data.type,
        good.baseUnit = data.baseUnit,
        // good.packingRule = data.packingRule,
        good.numberExpirationDate = data.numberExpirationDate,
        good.manufacturingMills = data.manufacturingMills.map(item => {
            return {
                manufacturingMill: item.manufacturingMill,
                productivity: item.productivity,
                personNumber: item.personNumber
            }
        }),
        good.units = data.units.map(item => {
            return {
                name: item.name,
                conversionRate: item.conversionRate,
                description: item.description
            }
        }),
        good.materials = data.materials.map(item => {
            return {
                good: item.good,
                quantity: item.quantity
            }
        }),
        good.description = data.description,
        good.quantity = data.quantity
        good.pricePerBaseUnit = data.pricePerBaseUnit,
        good.salesPriceVariance = data.salesPriceVariance
    await good.save();

    return await Good(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'materials.good', select: 'id name' },
            { path: 'manufacturingMills.manufacturingMill' }
        ])

}

exports.deleteGood = async (id, portal) => {
    await Good(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    return id;
}

exports.getAllGoods = async (company, portal) => {
    return await Good(connect(DB_CONNECTION, portal))
        .find({})
        .populate([
            { path: 'materials.good', select: 'id name' },
            { path: 'manufacturingMills.manufacturingMill' }
        ])
}

exports.getGoodByManageWorksRole = async (roleId, portal) => {
    // Xử  lý các quyền trước để tìm ra các kế hoạch trong các nhà máy được phân quyền
    let role = [roleId];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    let listManufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
        manufacturingWorks: {
            $in: listWorksId
        }
    });
    let listMillsId = listManufacturingMills.map(x => x._id);
    let goods = await Good(connect(DB_CONNECTION, portal))
        .find({
            manufacturingMills: {
                $elemMatch: {
                    manufacturingMill: {
                        $in: listMillsId
                    }
                }
            }
        }).populate([
            { path: 'materials.good', select: 'id name' },
            { path: 'manufacturingMills.manufacturingMill' }
        ]);
    return { goods }
}
exports.getManufacturingWorksByProductId = async (productId, portal) => {
    let product = await Good(connect(DB_CONNECTION, portal)).findOne({
        _id: productId
    });
    let manufacturingMills = product.manufacturingMills;
    manufacturingMillId = manufacturingMills.map(x => x.manufacturingMill);
    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manufacturingMills: {
            $in: manufacturingMillId
        }
    });
    return { manufacturingWorks }
}

exports.numberGoods = async (portal) => {
    const totalGoods = await Good(connect(DB_CONNECTION, portal)).find().count();
    const totalProducts = await Good(connect(DB_CONNECTION, portal)).find({ type: 'product' }).count();
    const totalMaterials = await Good(connect(DB_CONNECTION, portal)).find({ type: 'material' }).count();
    return { totalGoods, totalProducts, totalMaterials };
}
