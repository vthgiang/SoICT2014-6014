const { Good, Category } = require(SERVER_MODELS_DIR).schema;

exports.getCategories = async (company, query) => {
    var { page, limit } = query;
    if(!company) throw['company_invaild'];
    if(!page && !limit) {
        return await Category
            .find({ company })
            .populate([{ path: 'goods', model: Good, select:'name id' }])
    }
    else {
        const option = ( query.key && query.value ) ?
            Object.assign({ company }, {[ `${query.key}`]: new RegExp(query.value, "i")}) :
            { company };
        return await Category
            .paginate( option, {
                page,
                limit,
                populate: [
                    { path: 'goods', model: Good, select: 'name id'}
                ]
            })
    }
}
exports.createCategory = async (company, data) => {
    let category = await Category.create({
        company: company,
        code: data.code,
        name: data.name,
        type: data.type,
        description: data.description,
        goods: data.goods
    });
    return category;
}
exports.getCategory = async (id) => {
    return await Category.findById(id)
        .populate([
            { path: 'goods', model: Good, select: 'name id'}
        ])
}
exports.editCategory = async (id, data) => {
    const category = await Category.findById(id);
    category.code = data.code;
    category.name = data.name;
    category.type = data.type;
    category.goods = data.goods;
    category.description = data.description;
    await category.save();

    return await Category.findById(id)
        .populate([
            { path: 'goods', model: Good, select: 'name id'}
        ]);
}
exports.deleteCategory = async (id) => {
    await Category.deleteOne({ _id: id });

    return id;
}