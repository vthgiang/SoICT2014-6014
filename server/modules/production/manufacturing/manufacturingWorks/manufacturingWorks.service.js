const {
    ManufacturingWorks,
    ManufacturingMill
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

// Thêm mới nhà máy sản xuất
exports.createManufacturingWorks = async (data, portal) => {
    let newManfacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
        status: data.status,
        manufacturingMills: data.manufacturingMills,
        description: data.description,
        organizationalUnit: data.organizationalUnit
    });

    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById({ _id: newManfacturingWorks._id })
        .populate([{
            path: "manufacturingMills", select: "code name teamLeader description"
        }, {
            path: "organizationalUnit",
            populate: [
                {
                    path: 'deans',
                    populate: [{
                        path: "users",
                        populate: [{
                            path: "userId"
                        }]
                    }]
                },
                { path: 'viceDeans' },
                { path: 'employees' }
            ]
        }]);

    return { manufacturingWorks }
}

// Lấy ra tất cả các nhà máy sản xuất
exports.getAllManufacturingWorks = async (query, portal) => {
    let { page, limit } = query;
    // let option = {};
    // if (query.code) {
    //     option.code = {
    //         $regex: query.code,
    //         $options: "i"
    //     }
    // }
    // if (query.name) {
    //     option.name = {
    //         $regex: query.name,
    //         $options: "i"
    //     }

    // Tương đương với đoạn code

    let option = {};
    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }
    if (query.name) {
        option.name = new RegExp(query.name, "i")
    }
    if (query.status) {
        option.status = query.status
    }

    if (!page || !limit) {
        let docs = await ManufacturingWorks(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([{
                path: "manufacturingMills", select: "code name teamLeader description",
            }, {
                path: "organizationalUnit",
                populate: [
                    {
                        path: 'deans',
                        populate: [{
                            path: "users",
                            populate: [{
                                path: "userId"
                            }]
                        }]
                    },
                    { path: 'viceDeans' },
                    { path: 'employees' }
                ]
            }]);
        let allManufacturingWorks = {};
        allManufacturingWorks.docs = docs;
        return { allManufacturingWorks }
    } else {
        let allManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [{
                    path: "manufacturingMills", select: 'code name description'
                }, {
                    path: "organizationalUnit",
                    populate: [{
                        path: 'deans',
                        populate: [{
                            path: "users",
                            populate: [{
                                path: "userId"
                            }]
                        }]
                    },
                    { path: 'viceDeans' },
                    { path: 'employees' }]
                }]
            })
        return { allManufacturingWorks }
    }
}

// Xem chi tiết 1 nhà máy sản xuất
exports.getManufacturingWorksById = async (id, portal) => {
    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([{
            path: "manufacturingMills", select: "code name description"
        }, {
            path: "organizationalUnit",
            populate: [{
                path: 'deans',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            },
            { path: 'viceDeans' },
            { path: 'employees' }]
        }]);
    if (!manufacturingWorks) {
        throw Error("ManufacturingWorks is not existing")
    }
    return { manufacturingWorks }
}

// Xóa nhà máy sản xuất
exports.deleteManufacturingWorks = async (id, portal) => {
    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
    if (!manufacturingWorks) {
        throw Error("ManufacturingWorks is not existing")
    }
    return { manufacturingWorks }
}

// Sửa thông tin nhà máy sản xuất
exports.editManufacturingWorks = async (id, data, portal) => {
    let oldManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldManufacturingWorks) {
        throw Error("manufacturingWorks is not existing")
    }

    oldManufacturingWorks.code = data.code ? data.code : oldManufacturingWorks.code;
    oldManufacturingWorks.name = data.name ? data.name : oldManufacturingWorks.name;
    oldManufacturingWorks.organizationalUnit = data.organizationalUnit ? data.organizationalUnit : oldManufacturingWorks.organizationalUnit;
    oldManufacturingWorks.phoneNumber = data.phoneNumber ? data.phoneNumber : oldManufacturingWorks.phoneNumber;
    oldManufacturingWorks.address = data.address ? data.address : oldManufacturingWorks.address;
    oldManufacturingWorks.description = data.description ? data.description : oldManufacturingWorks.description;
    oldManufacturingWorks.status = data.status ? data.status : oldManufacturingWorks.status

    await oldManufacturingWorks.save();

    if (data.status == 0 && oldManufacturingWorks.manufacturingMills.length != 0) {
        oldManufacturingWorks.manufacturingMills.forEach(async millId => {
            let mill = await ManufacturingMill(connect(DB_CONNECTION, portal)).findById({ _id: millId });
            if (mill) {
                mill.status = 0;
                await mill.save();
            }
        });
        // for (let i = 0; i < oldManufacturingWorks.manufacturingMills.length; i++) {
        //     let mill = await ManufacturingMill(connect(DB_CONNECTION, portal)).findById({ _id: oldManufacturingWorks.manufacturingMills[i] });
        //     if (mill) {
        //         mill.status = 0;
        //         await mill.save();
        //     }

        // }
    }

    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById({ _id: oldManufacturingWorks.id })
        .populate([{
            path: "organizationalUnit",
            populate: [{
                path: 'deans',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            },
            { path: 'viceDeans' },
            { path: 'employees' }]
        }, {
            path: "manufacturingMills", select: "code teamLeader name"
        }]);

    return { manufacturingWorks }
}