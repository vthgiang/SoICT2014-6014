const {
    ManufacturingQualityError
} = require('../../../../../models');

const {
    connect
} = require('../../../../../helpers/dbHelper');

exports.getAllManufacturingQualityErrors = async (query, portal) => {
    let { page, limit } = query;

    if (!page || !limit) {
        let docs = await ManufacturingQualityError(connect(DB_CONNECTION, portal))
            .find()
            .populate([{
                path: "reporter",
            }]);
        let manufacturingQualityErrors = {};
        manufacturingQualityErrors.docs = docs;
        return { manufacturingQualityErrors }
    } else {
        let manufacturingQualityErrors = await ManufacturingQualityError(connect(DB_CONNECTION, portal))
            .paginate({}, {
                limit: limit,
                page: page,
                populate: [{
                    path: "reporter",
                }]
            })
        return { manufacturingQualityErrors }
    }
}

exports.getManufacturingQualityErrorById = async (id, portal) => {
    let manufacturingQualityError = await ManufacturingQualityError(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
        .populate([{
            path: "reporter"
        }]);

    if (!manufacturingQualityError) {
        throw Error("Manufacturing Error is not existing");
    }

    return { manufacturingQualityError }
}
