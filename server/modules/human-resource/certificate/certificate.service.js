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

    if (params.limit === undefined && params.page === undefined) {
        let data = await Certificate(connect(DB_CONNECTION, portal)).find(
            keySearch
        );
        return {
            listCertificate: data,
            totalList: data.length,
        };
    } else {
        let data = await Certificate(connect(DB_CONNECTION, portal)).find(
            keySearch
        );
        listCertificate = await Certificate(connect(DB_CONNECTION, portal))
            .find(keySearch)
            .sort({
                name: 1,
            })
            .skip(params.page)
            .limit(params.limit);
        return {
            listCertificate: listCertificate,
            totalList: data.length,
        };
    }
};

/**
 * Thêm mới chứng chỉ
 * @data : dữ liệu chứng chỉ mới
 *
 */
exports.createNewCertificate = async (portal, data, company) => {
    let certificate;
    certificate = await Certificate(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        abbreviation: data.abbreviation,
        description: data.description,
        company: company,
    });

    return await this.searchCertificate(portal, {});
};

/**
 * Xoá chứng chỉ
 * @id : Id chứng chỉ muốn xoá
 */
exports.deleteCertificate = async (portal, id) => {
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
exports.updateCertificate = async (portal, data, id, company) => {
    await Certificate(connect(DB_CONNECTION, portal)).updateOne(
        { _id: id },
        {
            $set: {
                name: data.name,
                abbreviation: data.abbreviation,
                description: data.description,
                company: company,
            },
        },
        { $new: true }
    );

    return this.searchCertificate(portal, {});
};
