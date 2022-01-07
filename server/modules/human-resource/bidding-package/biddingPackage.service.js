const {
    BiddingPackage,
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);



/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchBiddingPackage = async (portal, params) => {
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
    console.log('key bidding package', params, keySearch, portal);
    
    let listBiddingPackage = await BiddingPackage(connect(DB_CONNECTION, portal)).find()
        // .sort({
        //     'createdAt': 'desc'
        // }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await BiddingPackage(connect(DB_CONNECTION, portal)).countDocuments();

    return {
        totalList,
        listBiddingPackage
    }
}

/**
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 *
 */
exports.createNewBiddingPackage = async (portal, data) => {
    let position;
    console.log('data.action', data);
    position = await BiddingPackage(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        code: data.code,
        otherNames: data.otherNames,
        description: data.description,
    })

    return await this.searchBiddingPackage(portal, {})
}

/**
 * Chỉnh sửa vị trí công việc
 * @data dữ liệu chỉnh sửa
 */
exports.editBiddingPackage = async (portal, data, params) => {
    console.log(params)

        await BiddingPackage(connect(DB_CONNECTION, portal)).updateOne({ _id: params.id },
            {
                $set: {
                    name: data.name,
                    code: data.code,
                    otherNames: data.otherNames,
                    description: data.description,
                },
            }, { $new: true }
        )

    return await this.searchBiddingPackage(portal, {});
}

/**
 * Xoá vị trí
 * @data : list id xóa
 */
exports.deleteBiddingPackage = async (portal, data) => {
    for (let i in data) {
        await CareerField(connect(DB_CONNECTION, portal)).updateMany(
            {
                "position.position": data[i],
            },
            {
                $pull: { position: { "position": data[i], } },
            }
        );
        await BiddingPackage(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: data[i] });
    }

    for (let i in data) {
        await BiddingPackage(connect(DB_CONNECTION, portal)).updateOne(
            {
                "description._id": data[i],
            },
            {
                $pull: { description: { "_id": data[i], } },
            },
            { safe: true }
        );
    }

    return await BiddingPackage(connect(DB_CONNECTION, portal)).find({}).populate([{ path: "description.action" }])
}