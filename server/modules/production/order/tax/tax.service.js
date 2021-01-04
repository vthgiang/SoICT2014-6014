const {
    Tax
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);



exports.createNewTax = async (userId, data, portal) => {
    let newTax = await Tax(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        description: data.description ? data.description : "",
        creator: userId,
        goods: data.goods.map((item) => {
            return {
                good: item.good,
                percent: item.percent
            }
        }),
        version: 1,//default create = version 1
        status: true, // default create status = true
        lastVersion: true
    })
    let tax = await Tax(connect(DB_CONNECTION, portal)).findById({ _id: newTax._id })
    return { tax };
}

//Tạo ra 1 version (document) khác có code như cũ
exports.editTaxByCode = async (userId, id, data, portal) => {
    let oldTax = await Tax (connect(DB_CONNECTION, portal)).findById(id);
    if (!oldTax) {
        throw Error("Tax is not existing")
    }
    
    //Tạo ra 1 phiên bản tax mới có code giống phiên bản cũ
    let newVersionTax = await Tax(connect(DB_CONNECTION, portal)).create({
        code: oldTax.code,
        name: data.name,
        description: data.description,
        creator: userId,
        goods: data.goods.map((item) => {
            return {
                good: item.good,
                percent: item.percent
            }
        }),
        version: oldTax.version + 1,
        status: true,
        lastVersion: true
    })

    oldTax.status = false;
    oldTax.lastVersion = false
    oldTax.save();
    
    let tax = await Tax(connect(DB_CONNECTION, portal)).findById({ _id: newVersionTax._id });
    
    return { tax }
}

exports.getAllTaxs = async (query, portal) => {
    let { page, limit } = query;
    let option = {};
    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }
    if(query.name) {
        option.name = new RegExp(query.name, "i")
    }
    if (query.status) {
        option.status = query.status == 'true' ? true : false;
    }
    option.lastVersion = true

    if ( !page || !limit ){
        let allTaxs = await Tax(connect(DB_CONNECTION, portal))
        .find(option)
        .populate([{
            path: "goods.good", select: "code name"
        },
        {
            path: "creator", select: "name"
        }])
        return { allTaxs }
    } else {
        let allTaxs = await Tax(connect(DB_CONNECTION, portal)).paginate(option, {
            page,
            limit,
            populate: [{
                path: "goods.good", select: "code name"
            },{
                path: "creator", select: "name"
            }]
        })
        return { allTaxs }
    }
}

exports.getTaxById = async (id, portal) => {
    let tax = await Tax(connect(DB_CONNECTION, portal))
    .findById(id)
    .populate([{
        path: "goods.good", select: "code name"
    },{
        path: "creator", select: "name"
    }])

    if (!tax) {
        throw Error("Tax is not existing")
    }

    return { tax }
}

//Vô hiệu hóa loại thuế này, là vô hiệu hóa version cuối
exports.disableTaxById = async (id, portal) => {
    let tax = await Tax(connect(DB_CONNECTION, portal))
    .findById(id)

    if (!tax) {
        throw Error("Tax is not existing")
    }

    tax.status = !tax.status;
    tax.save();

    return { tax }
}


exports.checkAvailabledCode = async (query, portal) => {
    let tax = await Tax(connect(DB_CONNECTION, portal))
    .find({code: query.code})
    if (!tax || tax.length === 0) {
        return false
    }
    //Code này đã có sẵn
    return true;
}

exports.getTaxByCode = async (query, portal) => {
    let taxs = await Tax(connect(DB_CONNECTION, portal))
    .find({code: query.code})

    if (!taxs) {
        throw Error("Tax is not existing")
    }
    //code này đã có sẵn trong db
    return { taxs };
}

exports.deleteTaxByCode = async (code, portal) => {
    let taxs = await Tax(connect(DB_CONNECTION, portal))
        .find({ code: code })
    if (!taxs.length) {
            throw Error("Tax is not existing")
    }
    let taxsDeleted = [];
    for (let index = 0; index < taxs.length; index++) {
        let taxDeleted = await Tax(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: taxs[index]._id })
        taxsDeleted.push(taxDeleted);
    }
    return taxsDeleted;
}

exports.getTaxsByGoodsId = async (goodId, portal) => {
    let taxs = await Tax(connect(DB_CONNECTION, portal)).find({ goods: { $elemMatch: { good: goodId } }, lastVersion: true, status: true});
    if (!taxs) {
        throw Error("No tax for good!")
    }
    let taxsMap = taxs.map((tax) => {
        let goodMap = tax.goods.filter((good) => good.good == goodId)

        return {
            _id: tax._id,
            percent: goodMap[0].percent,
            good: goodMap[0].good,
            code: tax.code,
            name: tax.name,
            description: tax.description,
            
        }
    })
    return { taxs: taxsMap };
}


