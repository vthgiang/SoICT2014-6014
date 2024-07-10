const {
    ManufacturingQualityError,
    ManufacturingQualityInspection,
} = require('../../../../../models');

const {
    connect
} = require('../../../../../helpers/dbHelper');
const manufacturingQualityErrorModel = require('../../../../../models/production/manufacturing/manufacturingQualityError.model');

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

exports.getErrorNumByReporter = async (portal) => {
    const data = await manufacturingQualityErrorModel(connect(DB_CONNECTION, portal))
        .aggregate([{
            $group: {
                _id: "$reporter",
                count: { $sum: 1 }
            }
        }, {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "reporter"
            }
        }, {
            $unwind: "$reporter"
        }, {
            $project: {
                _id: 0,
                reporter: "$reporter.name",
                count: 1
            }
        }])
    
    const errorNumByReporter = data.reduce((acc, item) => {
        acc[item.reporter] = item.count;
        return acc;
    }, {});

    return errorNumByReporter;
}

exports.getErrorNumByGroup = async (portal) => {
    const data = await ManufacturingQualityInspection(connect(DB_CONNECTION, portal))
        .aggregate([{
            $lookup: {
                from: "manufacturingqualityerrors",
                localField: "result.errorList",
                foreignField: "_id",
                as: "errorDetails"
            }
        }, {
            $unwind: {
                path: "$errorDetails",
                preserveNullAndEmptyArrays: true
            } 

        }, {
            $group: {
                _id: "$errorDetails.group",
                totalErrorNum: { $sum: 1 }
            }
        }])
    
    const errorNumByGroup = data.reduce((acc, item) => {
        acc[item._id] = item.totalErrorNum;
        return acc;
    }, {});

    return errorNumByGroup;
}
