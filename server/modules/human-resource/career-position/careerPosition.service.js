const {
    CareerField,
    CareerPosition,
    CareerAction,
    AnnualLeave
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);



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
        .populate([{ path: "description.action" }])
        .sort({
            'createdAt': 'desc'
        }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await CareerPosition(connect(DB_CONNECTION, portal)).countDocuments(keySearch).populate([{ path: "description.action" }]);

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
        .populate([{ path: "position.position" }])
        .sort({
            'createdAt': 'desc'
        }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await CareerField(connect(DB_CONNECTION, portal)).countDocuments(keySearch).populate([{ path: "position.position" }]);

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
        }).skip(params.limit * (params.page - 1)).limit(params.limit).populate("label");
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

            let additionalNewPosition = await CareerPosition(connect(DB_CONNECTION, portal)).create({
                name: data.name,
                code: data.code,
                package: [],
                description: [],
            })

            position = await CareerField(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    _id: data.parent,
                },
                {
                    $push: {
                        "position": {
                            position: additionalNewPosition._id,
                            multi: 0,
                        }
                    }
                }
            )
        }
    }

    return await CareerField(connect(DB_CONNECTION, portal)).find({}).populate([{ path: "position.position" }])
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
                            position: position._id,
                            multi: 1
                        }
                    }
                }
            )
        }
    }
    else {
        let isDescription = await CareerPosition(connect(DB_CONNECTION, portal)).findOne({ _id: data.parent })
        if (isDescription) {
            // tạo hành động công việc
            let listAction = await CareerAction(connect(DB_CONNECTION, portal)).find({});
            let index = listAction.length;
            let action = await CareerAction(connect(DB_CONNECTION, portal)).create({
                name: data.name,
                // code: `act_${index + 1}`,
                code: data.code,
                package: data.package,
            })

            description = await CareerPosition(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    _id: data.parent,
                },
                {
                    $push: {
                        "description": {
                            action: action._id,
                            multi: 0,
                        }
                    }
                }
            )
        }
    }

    return await CareerPosition(connect(DB_CONNECTION, portal)).find({}).populate([{ path: "description.action" }])
}


/**
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 * 
 */
exports.crateNewCareerAction = async (portal, data) => {
    let action, detail;
    if (data.parent.length === 0) {
        console.log('is parent ');
        action = await CareerAction(connect(DB_CONNECTION, portal)).create({
            name: data.name,
            code: data.code,
            package: data.package,
            label: [],
            detail: [],
        })

        console.log('pos', data.position);

        // thêm vào lĩnh vực công việc vị trí công việc này
        for (let i in data.position) {
            await CareerPosition(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    _id: data.position[i],
                },
                {
                    $push: {
                        "description": {
                            action: action._id,
                            multi: 1
                        }
                    }
                }
            )
        }
    }
    else {
        let actionLabel = await CareerAction(connect(DB_CONNECTION, portal)).create({
            name: data.name,
            code: data.code,
            isLabel: 1,
            package: data.package,
            label: [],
            detail: [],
        })
        for (let i in data.parent) {
            let isDetail = await CareerAction(connect(DB_CONNECTION, portal)).findOne({ _id: data.parent[i] })
            if (isDetail) {
                await CareerAction(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                    {
                        _id: data.parent[i],
                    },
                    {
                        $push: {
                            "label": actionLabel._id,
                        }
                    }
                )
            }
        }
    }

    return await CareerAction(connect(DB_CONNECTION, portal)).find({}).populate("label")
}


/**
 * Chỉnh sửa lĩnh vực công việc
 * @data dữ liệu chỉnh sửa
 */
exports.editCareerField = async (portal, data, params) => {
    let oldItem = data.oldData;

    if (!data.parent) {
        await CareerField(connect(DB_CONNECTION, portal)).updateOne({ _id: params.id },
            {
                $set: {
                    name: data.name,
                    code: data.code,
                },
            }, { $new: true }
        )

    } else {
        let fieldItem = await CareerField(connect(DB_CONNECTION, portal)).findOne({ "position._id": params.id })
        let posId;
        let tmp = fieldItem.position.find(e => String(e._id) === String(params.id));
        console.log('tmp', tmp);
        if (tmp) {
            posId = tmp.position;

            await CareerPosition(connect(DB_CONNECTION, portal)).updateOne(
                {
                    "_id": posId,
                },
                {
                    $set: {
                        name: data.name,
                        code: data.code,
                    },
                }, { $new: true }
            )
        }
        if (data.parent !== oldItem.parent) { // parent có thay đổi
            await CareerField(connect(DB_CONNECTION, portal)).update(
                {
                    _id: oldItem.parent,
                    "position._id": params.id
                },
                {
                    $pull: { position: { "_id": params.id, } },
                },
                { safe: true }
            )

            // thêm mới vào 1 vị trí cv mới
            await CareerField(connect(DB_CONNECTION, portal)).updateOne(
                {
                    "_id": data.parent,
                },
                {
                    $push: {
                        "position": {
                            _id: params.id,
                            position: posId,
                        }
                    },
                }
            )
        }
    }

    return await CareerField(connect(DB_CONNECTION, portal)).find({}).populate([{ path: "position.position" }])
}

/**
 * Chỉnh sửa vị trí công việc
 * @data dữ liệu chỉnh sửa
 */
exports.editCareerPosition = async (portal, data, params) => {
    let oldItem = data.oldData;

    if (!data.parent) {
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
    }

    else {
        let positionItem = await CareerPosition(connect(DB_CONNECTION, portal)).findOne({ "description._id": params.id });
        let actionId
        let tmp = positionItem.description.find(e => String(e._id) === String(params.id));
        console.log('tmp', tmp);
        if (tmp) {
            actionId = tmp.action;
            await CareerAction(connect(DB_CONNECTION, portal)).updateOne(
                {
                    _id: actionId,
                },
                {
                    $set: {
                        name: data.name,
                        code: data.code,
                    }
                }, { $new: true }
            )
        }

        if (data.parent !== oldItem.parent) { // thay dổi cha
            // bỏ đi description ở vị trí cv cũ (parent cũ)
            await CareerPosition(connect(DB_CONNECTION, portal)).update(
                {
                    _id: oldItem.parent,
                    "description._id": params.id
                },
                {
                    $pull: { description: { "_id": params.id, } },
                },
                { safe: true }
            )

            // thêm mới vào 1 vị trí cv mới
            await CareerPosition(connect(DB_CONNECTION, portal)).updateOne(
                {
                    "_id": data.parent,
                },
                {
                    $push: {
                        "description": {
                            _id: params.id,
                            action: actionId
                        }
                    },
                }
            )

        }
    }

    return await CareerPosition(connect(DB_CONNECTION, portal)).find({}).populate([{ path: "description.action" }])
}

/**
 * Chỉnh sửa hoạt động công việc
 * @data dữ liệu chỉnh sửa
 */
exports.editCareerAction = async (portal, data, params) => {
    let oldItem = data.oldData;

    await CareerAction(connect(DB_CONNECTION, portal)).updateOne({ _id: params.id },
        {
            $set: {
                name: data.name,
                code: data.code,
                package: data.package,
                label: data.actionLabel,
            },
        }, { $new: true }
    )

    // if (!data.parent) {
    //     await CareerAction(connect(DB_CONNECTION, portal)).updateOne({ _id: params.id },
    //         {
    //             $set: {
    //                 name: data.name,
    //                 code: data.code,
    //                 package: data.package,
    //             },
    //         }, { $new: true }
    //     )
    // }
    // else {
    //     console.log('1');
    //     await CareerAction(connect(DB_CONNECTION, portal)).updateOne(
    //         {
    //             _id: oldItem.parent,
    //             "detail._id": params.id,
    //         },
    //         {
    //             $set: {
    //                 "detail.$.name": data.name,
    //                 "detail.$.code": data.code,
    //             }
    //         }, { $new: true }
    //     )

    //     console.log('2');
    //     let actionItem = await CareerAction(connect(DB_CONNECTION, portal)).findOne(
    //         {
    //             _id: oldItem.parent,
    //             "detail._id": params.id,
    //         },
    //     );

    //     console.log('3');
    //     let updatedDetail = actionItem.detail.find(e => String(e._id) === String(params.id))

    //     console.log('4', updatedDetail);
    //     if (data.parent !== oldItem.parent) { // thay dổi cha
    //         // bỏ đi description ở vị trí cv cũ (parent cũ)
    //         console.log('5');
    //         await CareerAction(connect(DB_CONNECTION, portal)).update(
    //             {
    //                 _id: oldItem.parent,
    //                 "detail._id": params.id
    //             },
    //             {
    //                 $pull: { detail: { "_id": params.id, } },
    //             },
    //             { safe: true }
    //         )

    //         console.log('6');

    //         // thêm mới vào 1 vị trí cv mới
    //         await CareerAction(connect(DB_CONNECTION, portal)).updateOne(
    //             {
    //                 "_id": data.parent,
    //             },
    //             {
    //                 $push: {
    //                     "detail": {
    //                         _id: params.id,
    //                         name: updatedDetail.name,
    //                         code: updatedDetail.code,
    //                         type: updatedDetail.type,
    //                     }
    //                 },
    //             }, {new: true}
    //         )
    //         console.log('7');

    //     }
    // }

    return await CareerAction(connect(DB_CONNECTION, portal)).find({}).populate("label")
}


// =================DELETE=====================

/**
 * Xoá lĩnh vực
 * @data : list id xóa
 */
exports.deleteCareerField = async (portal, data) => {
    for (let i in data) {
        await CareerField(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: data[i] });
    }

    for (let i in data) {
        await CareerField(connect(DB_CONNECTION, portal)).update(
            {
                "position._id": data[i],
            },
            {
                $pull: { position: { "_id": data[i], } },
            },
            { safe: true }
        );
    }

    return await CareerField(connect(DB_CONNECTION, portal)).find({}).populate([{ path: "position.position" }])
}

/**
 * Xoá lĩnh vực
 * @data : list id xóa
 */
exports.deleteCareerPosition = async (portal, data) => {
    for (let i in data) {
        await CareerField(connect(DB_CONNECTION, portal)).updateMany(
            {
                "position.position": data[i],
            },
            {
                $pull: { position: { "position": data[i], } },
            },
            { multi: true }
        );
        await CareerPosition(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: data[i] });
    }

    for (let i in data) {
        await CareerPosition(connect(DB_CONNECTION, portal)).update(
            {
                "description._id": data[i],
            },
            {
                $pull: { description: { "_id": data[i], } },
            },
            { safe: true }
        );
    }

    return await CareerPosition(connect(DB_CONNECTION, portal)).find({}).populate([{ path: "description.action" }])
}

/**
 * Xoá lĩnh vực
 * @data : list id xóa
 */
exports.deleteCareerAction = async (portal, data) => {

    for (let i in data) {
        let id = data[i].split('-')[0];
        await CareerPosition(connect(DB_CONNECTION, portal)).update(
            {
                "description.action": id,
            },
            {
                $pull: { description: { "action": id, } },
            },
            { multi: true }
        );
        await CareerAction(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    }

    for (let i in data) {
        let id = data[i].split('-')[0];
        await CareerAction(connect(DB_CONNECTION, portal)).update(
            {
                label: id
            },
            {
                $pull: { label: id },
            },
            { safe: true }
        );
        await CareerAction(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    }

    return await CareerAction(connect(DB_CONNECTION, portal)).find({}).populate("label")
}
