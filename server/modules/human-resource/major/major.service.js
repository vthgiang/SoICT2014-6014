const {
    Employee,
    AnnualLeave,
    Major,
    Task,
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);


/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchMajor = async (portal, params) => {
    let keySearch = {};

    if (params.majorName) {
        keySearch = {
            ...keySearch,
            "group.specialized.name": {
                $regex: params.majorName,
                $options: "i",
            }
        };
    }
    let task = await Task(connect(DB_CONNECTION, portal)).find({});
    console.log('key', params, keySearch, portal, task.length);


    let listMajor = await Major(connect(DB_CONNECTION, portal)).find(keySearch)
        .sort({
            'createdAt': 'desc'
        }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await Major(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    return {
        totalList,
        listMajor
    }
}

/**
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 * 
 */
exports.crateNewMajor = async (portal, data) => {
    let major, groupMajor, specialized;
    if (!data.parent) {
        console.log('is parent ');
        major = await Major(connect(DB_CONNECTION, portal)).create({
            name: data.name,
            code: data.code,
            group: [],
        })
    }
    else {
        let majorFounded = await Major(connect(DB_CONNECTION, portal)).findOne({ _id: data.parent })
        let groupFounded = await Major(connect(DB_CONNECTION, portal)).findOne({ "group._id": data.parent })
        
        console.log('majorFounded', majorFounded);
        console.log('groupFounded', groupFounded);

        if (majorFounded) {
            console.log('is major');
            groupMajor = await Major(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    _id: data.parent,
                },
                {
                    $push: {
                        "group": {
                            name: data.name,
                            code: data.code,
                            specialized: [],
                        }
                    }
                }
            )
        } else if (groupFounded) {
            console.log('is group');
            specialized = await Major(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    "group._id": data.parent,
                },
                {
                    $push: {
                        "group.$.specialized": {
                            name: data.name,
                            code: data.code,
                            type: 0,
                        }
                    }
                }
            )
        }

    }

    return await Major(connect(DB_CONNECTION, portal)).find({})
}

/**
 * Xoá chuyên ngành
 * @id : Id chuyên ngành muốn xoá
 */
exports.deleteMajor = async (portal, data) => {
    console.log('data', data);
    for (let i in data) {
        await Major(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: data[i] });
    }

    for (let i in data) {
        await Major(connect(DB_CONNECTION, portal)).update(
            {
                "group._id": data[i],
            },
            {
                $pull: { group: { "_id": data[i], } },
            },
            { safe: true }
        );
    }

    for (let i in data) {
        let x = await Major(connect(DB_CONNECTION, portal)).findOne({"group.specialized._id": data[i]});
        console.log('x',x);
        let groupList;
        
        let groupHasSpecialized, idGroup;

        if(x) {
            groupList = x.group;
            groupHasSpecialized = groupList.find(e => e.specialized.find(elem => String(elem._id) === String(data[i])) )
            if(groupHasSpecialized){
                idGroup = groupHasSpecialized._id
            }
        }
        let a = await Major(connect(DB_CONNECTION, portal)).update(
            {
                "group._id": idGroup,
            },
            {
                $pull: { "group.$.specialized": { "_id": data[i], } },
            },
            { safe: true }
        );
        let b = await Major(connect(DB_CONNECTION, portal)).findOne(
            {
                "group._id": idGroup,
            })
            console.log('b', b);
    };

    return await Major(connect(DB_CONNECTION, portal)).find({});
}

/**
 * Cập nhật chuyên ngành
 * @id : Id chuyên ngành muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.updateMajor = async (portal, data, params) => {
    let oldItem = data.oldData;

    if (!data.parent) {
        await Major(connect(DB_CONNECTION, portal)).updateOne({ _id: params.id },
            {
                $set: {
                    name: data.name,
                    code: data.code,
                },
            }, { $new: true }
        )
    }

    else {
        let majorFounded = await Major(connect(DB_CONNECTION, portal)).findOne({ _id: oldItem.parent }); // tìm thấy major thì cái đang sửa là group
        let groupFounded = await Major(connect(DB_CONNECTION, portal)).findOne({ "group._id": oldItem.parent }); // tìm thấy group thì cái đang sửa là specialized

        if (majorFounded) {
            await Major(connect(DB_CONNECTION, portal)).updateOne(
                {
                    "group._id": params.id,
                    _id: majorFounded._id,
                },
                {
                    $set: {
                        "group.$.name": data.name,
                        "group.$.code": data.code,
                    }
                }, { $new: true }
            )

            let newMajor = await Major(connect(DB_CONNECTION, portal)).findById(majorFounded._id);
            let groupItem = newMajor.group.find(e => String(e._id) === String(params.id));

            if (data.parent !== oldItem.parent) { // thay dổi cha
                // bỏ đi cái này ở cha cũ (parent cũ)
                await Major(connect(DB_CONNECTION, portal)).update(
                    {
                        _id: oldItem.parent,
                        "group._id": params.id
                    },
                    {
                        $pull: { group: { "_id": params.id, } },
                    },
                    { safe: true }
                )
    
                // thêm mới vào 1 vị trí cv mới
                await Major(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        "_id": data.parent,
                    },
                    {
                        $push: {
                            "group": groupItem
                        },
                    }
                )
    
            }
        }

        if (groupFounded) {
            let specialItem = {
                _id: params.id,
                name: data.name,
                code: data.code,
            }
            await Major(connect(DB_CONNECTION, portal)).updateOne(
                {
                    "group._id": oldItem.parent,
                    _id: groupFounded._id,
                },
                {
                    $set: {
                        "group.$.specialized":specialItem
                    }
                }, { $new: true }
            )

            if (data.parent !== oldItem.parent) { // thay dổi cha
                // bỏ đi cái này ở cha cũ (parent cũ)
                console.log('abcvaof này');
                await Major(connect(DB_CONNECTION, portal)).update(
                    {
                        "group._id": oldItem.parent,
                        _id: groupFounded._id,
                    },
                    {
                        $pull: { "group.$.specialized": { "_id": params.id, } },
                    },
                    { safe: true }
                )
    
                // thêm mới vào 1 vị trí cv mới
                let majorHasNewParent = await Major(connect(DB_CONNECTION, portal)).findOne({"group._id": data.parent});
                let majorId;
                if(majorHasNewParent) {
                    majorId = majorHasNewParent._id;
                }

                let x = await Major(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        "group._id": data.parent,
                        _id: majorId,
                    },
                    {
                        $push: {
                            "group.$.specialized": {
                                _id: params.id,
                                name: data.name,
                                code: data.code,
                            }
                        },
                    },{ new: true }
                )
            }
        }
    }

    return await Major(connect(DB_CONNECTION, portal)).find({})
}