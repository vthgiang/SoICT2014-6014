const {
    ManufacturingWorks
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

// Thêm mới nhà máy sản xuất
exports.createManufacturingWorks = async (data, portal) => {
    let newManfacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        worksManager: data.worksManager,
        foreman: data.foreman,
        phoneNumber: data.phoneNumber,
        address: data.address,
        manufacturingMills: data.manufacturingMills,
        description: data.description
    });

    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById({ _id: newManfacturingWorks._id })
        .populate([{
            path: "worksManager", select: "name"
        }, {
            path: "foreman", select: "name"
        }, {
            path: "manufacturingMills", select: "code name"
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

    if (!page || !limit) {
        let allManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([{
                path: "worksManager", select: "name"
            }, {
                path: "foreman", select: "name"
            }, {
                path: "manufacturingMills", select: "code name"
            }]);
        return { allManufacturingWorks }
    } else {
        let allManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [{
                    path: "worksManager", select: "name"
                }, {
                    path: "foreman", select: "name"
                }, {
                    path: "manufacturingMills", select: 'code name '
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
            path: "worksManager", select: "name"
        }, {
            path: "foreman", select: "name"
        }, {
            path: "manufacturingMills", select: "code name"
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
    oldManufacturingWorks.worksManager = data.worksManager ? data.newManfacturingWorks : oldManufacturingWorks.worksManager;
    oldManufacturingWorks.foreman = data.foreman ? data.foreman : oldManufacturingWorks.foreman;
    oldManufacturingWorks.phoneNumber = data.phoneNumber ? data.phoneNumber : oldManufacturingWorks.phoneNumber;
    oldManufacturingWorks.address = data.address ? data.address : oldManufacturingWorks.address;
    oldManufacturingWorks.description = data.description ? data.description : oldManufacturingWorks.description;

    await oldManufacturingWorks.save();

    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findById({ _id: oldManufacturingWorks.id })
        .populate([{
            path: "worksManager", select: "name"
        }, {
            path: "foreman", select: "name"
        }, {
            path: "manufacturingMills", select: "code name"
        }]);

    return { manufacturingWorks }
}