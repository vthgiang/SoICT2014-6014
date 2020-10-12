const { Category } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getCategories = async (query, portal) => {
    var { page, limit } = query;
    if(!page && !limit) {
        return await Category(connect(DB_CONNECTION, portal)).find();
    }
    else {
        const option = ( query.key && query.value ) ?
            Object.assign({ }, {[ `${query.key}`]: new RegExp(query.value, "i")}) :
            {};
        return await Category(connect(DB_CONNECTION, portal))
            .paginate( option, {
                page,
                limit
            })
    }
}

exports.getCategoriesByType = async (query, portal) => {
    let { type } = query;
    return await Category(connect(DB_CONNECTION, portal)).find({ type: type });
}

exports.createCategory = async (data, portal) => {
    let category = await Category(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        type: data.type,
        description: data.description
    });
    return category;
}

exports.getCategory = async (id, portal) => {
    return await Category(connect(DB_CONNECTION, portal)).findById(id);
}

exports.editCategory = async (id, data, portal) => {
    const category = await Category(connect(DB_CONNECTION, portal)).findById(id);
    category.code = data.code;
    category.name = data.name;
    category.type = data.type;
    category.description = data.description;
    await category.save();

    return await Category(connect(DB_CONNECTION, portal)).findById(id);
}

exports.deleteCategory = async (id, portal) => {
    await Category(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });

    return id;
}