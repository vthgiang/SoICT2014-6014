const {
    CareerField,
    CareerPosition,
    CareerAction,
    AnnualLeave
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);



/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchCareerPosition = async (portal, params) => {
    let keySearch = {};

    if (params.name) {
        keySearch = {
            ...keySearch,
            "name": {
                $regex: params.name,
                $options: "i",
            }
        };
    }
    console.log('key', params, keySearch, portal);

    let listPosition = await CareerPosition(connect(DB_CONNECTION, portal)).find(keySearch)
        .sort({
            'createdAt': 'desc'
        }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await CareerPosition(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    return {
        totalList,
        listPosition
    }
}


/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchCareerField = async (portal, params) => {
    let keySearch = {};

    if (params.name) {
        keySearch = {
            ...keySearch,
            "name": {
                $regex: params.name,
                $options: "i",
            }
        };
    }
    console.log('key', params, keySearch, portal);

    let listField = await CareerField(connect(DB_CONNECTION, portal)).find(keySearch)
        .sort({
            'createdAt': 'desc'
        }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await CareerField(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    return {
        totalList,
        listField
    }
}


/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchCareerAction = async (portal, params) => {
    let keySearch = {};

    if (params.name) {
        keySearch = {
            ...keySearch,
            "name": {
                $regex: params.name,
                $options: "i",
            }
        };
    }
    console.log('key', params, keySearch, portal);

    let listAction = await CareerAction(connect(DB_CONNECTION, portal)).find(keySearch)
        .sort({
            'createdAt': 'desc'
        }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await CareerAction(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    return {
        totalList,
        listAction
    }
}

/**
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 * 
 */
exports.crateNewCareerField = async (portal, data) => {
    let field, position;
    if (!data.parent) {
        console.log('is parent ');
        field = await CareerField(connect(DB_CONNECTION, portal)).create({
            name: data.name,
            code: data.code,
            position: [],
        })
    }
    else {
        let isField = await CareerField(connect(DB_CONNECTION, portal)).findOne({ _id: data.parent })
        if (isField) {
            position = await CareerField(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    _id: data.parent,
                },
                {
                    $push: {
                        "position": {
                            name: data.name,
                            code: data.code,
                        }
                    }
                }
            )
        }
    }

    return await CareerField(connect(DB_CONNECTION, portal)).find({})
}


/**
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 * 
 */
exports.crateNewCareerPosition = async (portal, data) => {
    let position, description;
    if (!data.parent) {
        console.log('is parent ');
        position = await CareerPosition(connect(DB_CONNECTION, portal)).create({
            name: data.name,
            code: data.code,
            position: [],
        })
    }
    else {
        let isDescription = await CareerPosition(connect(DB_CONNECTION, portal)).findOne({ _id: data.parent })
        if (isDescription) {
            description = await CareerPosition(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    _id: data.parent,
                },
                {
                    $push: {
                        "description": {
                            name: data.name,
                            code: data.code,
                        }
                    }
                }
            )
        }
    }

    return await CareerPosition(connect(DB_CONNECTION, portal)).find({})
}


/**
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 * 
 */
exports.crateNewCareerAction = async (portal, data) => {
    let action, detail;
    if (!data.parent) {
        console.log('is parent ');
        action = await CareerAction(connect(DB_CONNECTION, portal)).create({
            name: data.name,
            code: data.code,
            position: [],
        })
    }
    else {
        let isDetail = await CareerAction(connect(DB_CONNECTION, portal)).findOne({ _id: data.parent })
        if (isDetail) {
            detail = await CareerAction(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    _id: data.parent,
                },
                {
                    $push: {
                        "detail": {
                            name: data.name,
                            code: data.code,
                        }
                    }
                }
            )
        }
    }

    return await CareerAction(connect(DB_CONNECTION, portal)).find({})
}


// /**
//  * Thêm mới thông tin nghỉ phép
//  * @data : dữ liệu chuyên ngành tương đương mới
//  * 
//  */
// exports.createNewAdditionalCareerPosition = async (portal, data) => {
//     // Tạo mới thông tin nghỉ phép vào database
//     let AdditionalMajor = await CareerPosition(connect(DB_CONNECTION, portal)).find(
//         {
//             _id: data.majorID,
//             "position._id": data.groupId,
//         },
//         {
//             $push: {
//                 "position.$.description": {
//                     name: data.name,
//                     type: 0,
//                 }
//             }
//         }
//     );

//     return await CareerPosition(connect(DB_CONNECTION, portal)).find({})
// }

// /**
//  * Xoá thông tin nghỉ phép
//  * @id : Id nghỉ phép muốn xoá
//  */
// exports.deleteAnnualLeave = async (portal, id) => {
//     return await AnnualLeave(connect(DB_CONNECTION, portal)).findOneAndDelete({
//         _id: id
//     });
// }

// /**
//  * Cập nhật thông tin nghỉ phép
//  * @id : Id nghỉ phép muốn chỉnh sửa
//  * @data : Dữ liệu thay đổi
//  */
// exports.updateAnnualLeave = async (portal, id, data) => {
//     let annualLeave = await AnnualLeave(connect(DB_CONNECTION, portal)).findById(id);

//     annualLeave.startDate = data.startDate;
//     annualLeave.status = data.status;
//     annualLeave.endDate = data.endDate;
//     annualLeave.reason = data.reason;
//     await annualLeave.save();

//     return await AnnualLeave(connect(DB_CONNECTION, portal)).findOne({
//         _id: id
//     }).populate([{
//         path: 'employee',
//         select: 'emailInCompany fullName employeeNumber'
//     }]);
// }