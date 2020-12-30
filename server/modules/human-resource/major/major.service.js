const {
    Employee,
    AnnualLeave,
    Major,
    Task,
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);


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
 * Xoá thông tin nghỉ phép
 * @id : Id nghỉ phép muốn xoá
 */
exports.deleteAnnualLeave = async (portal, id) => {
    return await AnnualLeave(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Cập nhật thông tin nghỉ phép
 * @id : Id nghỉ phép muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.updateAnnualLeave = async (portal, id, data) => {
    let annualLeave = await AnnualLeave(connect(DB_CONNECTION, portal)).findById(id);

    annualLeave.startDate = data.startDate;
    annualLeave.status = data.status;
    annualLeave.endDate = data.endDate;
    annualLeave.reason = data.reason;
    await annualLeave.save();

    return await AnnualLeave(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    }).populate([{
        path: 'employee',
        select: 'emailInCompany fullName employeeNumber'
    }]);
}