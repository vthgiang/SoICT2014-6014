const { Certificate } = require(`${SERVER_MODELS_DIR}`);

const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách chứng chỉ
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchCertificate = async (portal, params) => {
    let keySearch = {};

    if (params.certificateName) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.certificateName,
                $options: "i",
            },
        };
    }
    console.log("key", params, keySearch, portal);

    let listCertificate = await Certificate(connect(DB_CONNECTION, portal))
        .find({})
    let totalList = await Certificate(
        connect(DB_CONNECTION, portal)
    ).countDocuments({});

    return {
        totalList,
        listCertificate,
    };
};

/**
 * Thêm mới chứng chỉ
 * @data : dữ liệu chứng chỉ mới
 *
 */
exports.crateNewCertificate = async (portal, data) => {
    let certificate;
    certificate = await Certificate(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        abbreviation: data.abbreviation,
        description: data.description,
    });

    return await this.searchCertificate(portal, {});
};

/**
 * Xoá chứng chỉ
 * @id : Id chứng chỉ muốn xoá
 */
exports.deleteCertificate = async (portal, id) => {
    console.log("ddddddddddddddd", id)
    await Certificate(connect(DB_CONNECTION, portal)).deleteOne({
        _id: id,
    });

    return await this.searchCertificate(portal, {});
};

/**
 * Cập nhật chứng chỉ
 * @id : Id chứng chỉ muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.updateCertificate = async (portal, data, id) => {
    console.log("aaaaaaaaaaa", data, id)
    await Certificate(connect(DB_CONNECTION, portal)).updateOne(
        { _id: id },
        {
            $set: {
                name: data.name,
                abbreviation: data.abbreviation,
                description: data.description,
            },
        },
        { $new: true }
    );

    return this.searchCertificate(portal, {});
};
