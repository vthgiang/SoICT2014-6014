const recommendProcurementService = require('./recommend-procurement.service');
const {LogInfo, LogError} = require('../../../logs');

/**
 *
 *
 * Get all data.
 *
 */
exports.get = (req, res) => {
    return recommendProcurementService.get(req, res);
};

/**
 *
 * @params {id}
 *
 * Get details recommmend procurement by id.
 *
 */
exports.getById = (req, res) => {
    return recommendProcurementService.getById(req, res);
};


/**
 *
 * @body {request.body}
 *
 * Create recommend procurement.
 *
 */
exports.create = async (req, res) => {
    try {
        var data = await recommendProcurementService.create(req.body, res);
        await LogInfo(req.user.email, `Create recommend procurement ${req.body.recommendNumber}`, req.user.company);
        res.status(200).json(data);
    } catch (error) {
        await LogError(req.user.email, `Create recommmend procurement ${req.body.recommendNumber}`, req.user.company);
        res.status(400).json(error);
    }
};

/**
 *
 * @params {id}
 *
 * Delete recommmend procurement by id.
 *
 */
exports.delete = async (req, res) => {
    try {
        var data = await recommendProcurementService.delete(req.params.id, res);
        await LogInfo(req.user.email, `Delete recommmend procurement ${req.params.id}`, req.user.company);
        res.status(200).json(data);
    } catch (error) {
        await LogError(req.user.email, `Delete recommend procurement ${req.params.id}`, req.user.company);
        res.status(400).json(error);
    }
};

/**
 *
 * @params {id}
 *
 * Edit recommend procurement.
 *
 */
exports.edit = async (req, res) => {
    try {
        var data = await recommendProcurementService.edit(req.body, req.params.id, res);
        await LogInfo(req.user.email, `Edit recommend procurement ${req.body.recommendNumber}`, req.user.company);
        res.status(200).json(data);
    } catch (error) {
        await LogError(req.user.email, `Edit recommend procurement ${req.body.recommendNumber}`, req.user.company);
        res.status(400).json(error);
    }
};
