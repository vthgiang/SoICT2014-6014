const {
    CareerPosition,
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

    if (params?.name) {
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
        // .sort({
        //     'createdAt': 'desc'
        // }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await CareerPosition(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    return {
        totalList,
        listPosition
    }
}

/**
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 *
 */
exports.createNewCareerPosition = async (portal, data) => {
    let position;
    console.log('data.action', data);
    position = await CareerPosition(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        code: data.code,
        description: data.description,
    })

    return await this.searchCareerPosition(portal, {})
}

/**
 * Chỉnh sửa vị trí công việc
 * @data dữ liệu chỉnh sửa
 */
exports.editCareerPosition = async (portal, data, params) => {
    console.log(params)

        await CareerPosition(connect(DB_CONNECTION, portal)).updateOne({ _id: params.id },
            {
                $set: {
                    name: data.name,
                    code: data.code,
                    otherNames: data.otherNames,
                    description: data.description,
                },
            }, { $new: true }
        )

    return await this.searchCareerPosition(portal, {});
}

/**
 * Xoá vị trí
 * @data : list id xóa
 */
exports.deleteCareerPosition = async (portal, data, id) => {
    console.log(id)
    await CareerPosition(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });

    return await this.searchCareerPosition(portal, {})
}

