const {
    Certificate,
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);


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
            "name": {
                $regex: params.certificateName,
                $options: "i",
            }
        };
    }
    console.log('key', params, keySearch, portal);

    let listCertificate = await Certificate(connect(DB_CONNECTION, portal)).find({}).populate([{
        path: 'majors',
    }]);
    let totalList = await Certificate(connect(DB_CONNECTION, portal)).countDocuments({});

    return {
        totalList,
        listCertificate
    }
}

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
        code: data.code,
        majors: data.majors,
    })


    return await Certificate(connect(DB_CONNECTION, portal)).find({}).populate([{
        path: 'majors',
    }]);
}








/**
 * Xoá chứng chỉ
 * @id : Id chứng chỉ muốn xoá
 */
exports.deleteCertificate = async (portal, id) => {
    return await Certificate(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Cập nhật chứng chỉ
 * @id : Id chứng chỉ muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.updateCertificate = async (portal, id, data) => {
    let certificate = await Certificate(connect(DB_CONNECTION, portal)).findById(id);

    certificate.name = data.name;
    certificate.abbreviations = data.abbreviations;
    certificate.code = data.code;
    certificate.majors = data.majors;
    await certificate.save();

    return await Certificate(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    }).populate([{
        path: 'majors',
    }]);
}