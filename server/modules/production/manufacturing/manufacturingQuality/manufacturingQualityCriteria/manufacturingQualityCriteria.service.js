const {
    ManufacturingQualityCriteria,
} = require('../../../../../models');

const {
    connect
} = require('../../../../../helpers/dbHelper');

exports.getAllManufacturingQualityCriterias = async (query, portal) => {
    let { page, limit, good } = query;
    let options = {};

    if (good) {
        options.goods = good;
    }

    if (!page || !limit) {
        let docs = await ManufacturingQualityCriteria(connect(DB_CONNECTION, portal))
            .find(options)
            .populate([{
                path: "creator",
                select: "name email"
            }, {
                path: "goods",
                select: "name"
            }]);
        
        let manufacturingQualityCriterias = {};
        manufacturingQualityCriterias.docs = docs;
        return { manufacturingQualityCriterias }
    } else {
        let manufacturingQualityCriterias = await ManufacturingQualityCriteria(connect(DB_CONNECTION, portal))
            .paginate({}, {
                limit: limit,
                page: page,
                populate: [{
                    path: "reporter",
                    select: "name email"
                }, {
                    path: "good",
                    select: "name"
                }]
            })
        return { manufacturingQualityCriterias }
    }
}

exports.getManufacturingQualityCriteriaById = async (id, portal) => {
    let manufacturingQualityCriteria = await ManufacturingQualityCriteria(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
        .populate([{
            path: "creator",
        }, {
            path: "goods",
        }]);

    if (!manufacturingQualityCriteria) {
        throw Error("Manufacturing Criteria is not existing");
    }

    return { manufacturingQualityCriteria }
}
