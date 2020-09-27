const { Category, Good } = require(SERVER_MODELS_DIR).schema;

exports.getGoodsByType = async (company, query) => {
    var { page, limit, type } = query;
    if(!company) throw['company_invaild'];
    if(!page && !limit) {
        return await Good
            .find({ company, type })
            .populate([
                { path: 'category', model: Category, select: 'id name'},
                { path: 'goods.good', model: Good, select: 'id name' }
            ])
    } else {
        let option = {
            company: company,
            type: type
        }

        if(query.category){
            option.category = query.category;
        }

        if(query.name){
            option.name = new RegExp(query.name, "i");
        }

        if(query.code){
            option.code = new RegExp(query.code, "i");
        }

        return await Good
            .paginate( option, {
                page,
                limit,
                populate: [
                    { path: 'category', model: Category, select: 'id name'},
                    { path: 'goods.good', model: Good, select: 'id name'}
                ]
            })
    }
}