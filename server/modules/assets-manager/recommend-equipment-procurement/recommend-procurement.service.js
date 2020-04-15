const RecommendProcurements = require('../../../models/recommendProcure.model');

/**
 *
 *
 * Get all data.
 *
 */
exports.get = (req, res) => {
    RecommendProcurements.find()
        .then(templates => res.status(200).json(templates))
        .catch(err => res.status(400).json({message: err}));
    console.log("Get Task Template");
};

/**
 *
 * @params {id}
 *
 * Get details recommend procurement by id.
 *
 */
exports.getById = async (req, res) => {
    try {
        var recommendProcurement = await RecommendProcurements.findById(req.params.id).populate("proponent company approver");
        res.status(200).json({
            "data": recommendProcurement,
            "status": true
        })
    } catch (error) {
        res.status(400).json({message: error});
    }
};

/**
 *
 * @body {request.body}
 *
 * Create recommend procurement.
 *
 */
exports.create = async (body,res) => {
    const recommmendProcurement = new RecommendProcurements(body);

    recommmendProcurement.save((err, data) => {
        if (err) return res.json({success: false, err});

        return res.status(200).json({
            success: true,
            data
        });
    });
};

/**
 *
 * @params {id}
 *
 * Delete recommend procurement by id.
 *
 */
exports.delete = async (id,res) => {
    RecommendProcurements.findByIdAndRemove({_id: id}, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json("Successfully removed");
        }
    });
};

/**
 *
 * @params {id}
 *
 * Edit recommend procurement.
 *
 */
exports.edit = async (body, id,res) => {
    RecommendProcurements.findByIdAndUpdate(id, body, (err, data) => {
        if (err) return next(err);
        return res.status(200).json({
            success: true,
            data
        });
    });
};
