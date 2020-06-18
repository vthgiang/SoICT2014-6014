const {
    ImportConfiguraion
} = require("../../../models").schema;

/**
 * Lấy thông tin cấu hình file import
 */
exports.getImportConfiguraion = async (type, company) => {
    return await ImportConfiguraion.findOne({
        type: type,
        company: company
    });
};

/**
 * Tạo thông tin cấu hình file import
 */
exports.createImportConfiguraion = async (data, company) => {
    return await ImportConfiguraion.create({
        company: company,
        configuration: data.configuration,
        type: data.type
    })
};

/**
 * chỉnh sửa thông tin cấu hình file import
 */
exports.editImportConfiguraion = async (id, data) => {
    let oldImportConfiguraion = await ImportConfiguraion.findById(id);
    console.log(oldImportConfiguraion);
    oldImportConfiguraion.configuration = {
        ...data.configuration
    };
    oldImportConfiguraion.save();
    return await ImportConfiguraion.findById(id);
};