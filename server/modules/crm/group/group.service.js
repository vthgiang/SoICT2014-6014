const mongoose = require("mongoose");
const { Group } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.createGroup = async (portal, companyId, data) => {
    const { code, name, description, promotion } = data;
    const newGroup = await Group(connect(DB_CONNECTION, portal)).create({
        code: code,
        name: name,
        description: description ? description : '',
    })

    const getNewGroup = await Group(connect(DB_CONNECTION, portal)).findById(newGroup._id);
    return getNewGroup;
}

exports.getGroups = async (portal, companyId, query) => {
    const { limit, page } = query;
    let keySearch = {};

    const listGroupTotal = await Group(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const groups = await Group(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .skip(parseInt(page)).limit(parseInt(limit));
    return { listGroupTotal, groups };
}