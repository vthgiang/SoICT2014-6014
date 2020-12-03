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

        // tạo vị trí công việc tương ứng bên bảng vị trí công việc
        await CareerPosition(connect(DB_CONNECTION, portal)).create({
            name: data.name,
            code: data.code,
            description: [],
        })
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
            package: data.package,
            description: [],
        })

        // thêm vào lĩnh vực công việc vị trí công việc này
        for (let i in data.field) {
            await CareerField(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    _id: data.field[i],
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

            // tạo hành động công việc
            let listAction = await CareerAction(connect(DB_CONNECTION, portal)).find({});
            let index = listAction.length;
            let action = await CareerAction(connect(DB_CONNECTION, portal)).create({
                name: data.name,
                code: `act_${index + 1}`,
                position: [],
            })

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
            package: data.package,
            detail: [],
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


/**
 * Chỉnh sửa vị trí công việc
 * @data dữ liệu chỉnh sửa
 */
exports.editCareerPosition = async (portal, data, params) => {
    let oldItem = data.oldData;
    // CareerPosition(connect(DB_CONNECTION, portal)).find({ _id: params.id });

    if (!data.parent) {
        let oldPosition = await CareerPosition(connect(DB_CONNECTION, portal)).findOne({ _id: params.id })
        let listField = await CareerPosition(connect(DB_CONNECTION, portal)).find({});

        let filterField = listField.filter(e => e.position.find(x => x.code === oldItem.code))

        console.log('=====\n\n', filterField);

        for (let i in filterField) {
            await CareerField(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    _id: filterField[i],
                    "position.name": oldItem.name,
                    "position.code": oldItem.code,
                },
                {
                    $set: {
                        "position.$.name": data.name,
                        "position.$.code": data.code,
                    }
                }
            )
        }

        await CareerPosition(connect(DB_CONNECTION, portal)).updateOne({ _id: params.id },
            {
                $set: {
                    name: data.name,
                    code: data.code,
                    package: data.package,
                    // description: [],
                },
            }, { $new: true }
        )


        // let oldDif = [],
        //     newDif = [], 
        //     common = [];
        // newDif = newDif.filter(e => oldDif.indexOf(e) === -1); // cac phan tu them vao
        // oldDif = oldDif.filter(e => newDif.indexOf(e) === -1); // casc phan tu bi mat di
        // common = oldDif.filter(e => newDif.indexOf(e) !== -1); // casc phan tu chung


        // // console.log('=====\n\n', newDif, oldDif, common);
        // // bỏ đi những vị trí có trong danh sách lĩnh vực cũ,
        // for (let i in oldDif) {
        //     await CareerField(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        //         {
        //             _id: oldDif[i],
        //             "position.name": oldItem.name,
        //             "position.code": oldItem.code,
        //         },
        //         {
        //             $pull: {
        //                 "position": {
        //                     name: oldDif.name,
        //                     code: oldItem.code,
        //                 }
        //             }
        //         }
        //     )
        // }

        // // cap nhat vi tri  trong linh vuc
        // for (let i in common) {
        //     await CareerField(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        //         {
        //             _id: common[i],
        //             "position.name": oldItem.name,
        //             "position.code": oldItem.code,
        //         },
        //         {
        //             $set: {
        //                 "position.$.name": data.name,
        //                 "position.$.code": data.code,
        //             }
        //         }
        //     )
        // }

        // // them moi vi tri vao linh vuc
        // for (let i in newDif) {
        //     await CareerField(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        //         {
        //             _id: newDif[i],
        //         },
        //         {
        //             $push: {
        //                 "position": {
        //                     name: data.name,
        //                     code: data.code,
        //                 }
        //             }
        //         }
        //     )
        // }

        // // TODO: cap nhat thông tin trong employee

    }

    else {
        let r = await CareerAction(connect(DB_CONNECTION, portal)).findOne({ name: oldItem.name })
        console.log('pppppppppppppp', r, oldItem.name);
        await CareerAction(connect(DB_CONNECTION, portal)).updateOne({ name: oldItem.name },
            {
                $set: {
                    name: data.name,
                    // code: data.code,
                }
            }, { $new: true }
        )
        if (data.parent === oldItem.parent) {
            // parent k đổi
            await CareerPosition(connect(DB_CONNECTION, portal)).updateOne(
                {
                    "description._id": params.id
                },
                {
                    $set: {
                        "description.$.name": data.name,
                        "description.$.code": data.code,
                        "description.$.package": data.package,
                        // description: [],
                    },
                }, { $new: true })
        } else {
            // bỏ đi description ở vị trí cv cũ (parent cũ)
            let xxx = await CareerPosition(connect(DB_CONNECTION, portal)).findOne(
                {
                    "description._id": params.id
                })
            console.log('xxx', xxx);
            let yyy = await CareerPosition(connect(DB_CONNECTION, portal)).update(
                {
                    _id: oldItem.parent,
                    "description._id": params.id
                },
                {
                    $pull: { description: { "_id": params.id, } },
                },
                { safe: true }
            )
            console.log('yyyy', yyy);

            // thêm mới vào 1 vị trí cv mới
            let oldPosition = await CareerPosition(connect(DB_CONNECTION, portal)).findOne({ "description._id": params.id });
            // let oldId = oldPosition?._id;
            await CareerPosition(connect(DB_CONNECTION, portal)).updateOne(
                {
                    "_id": data.parent,
                },
                {
                    $push: {
                        "description": {
                            _id: params.id,
                            name: data.name,
                            code: data.code,
                        }
                    },
                }
            )

        }
    }

    return await CareerPosition(connect(DB_CONNECTION, portal)).find({})
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