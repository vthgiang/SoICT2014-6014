const ManufacturingQualityErrorService = require('./manufacturingQualityError.service');
const Logger = require('../../../../../logs');

exports.getAllManufacturingQualityErrors= async (req, res) => {
    try {
        let query = req.query;
        let manufacturingQualityErrors = await ManufacturingQualityErrorService.getAllManufacturingQualityErrors(query, req.portal);

        await Logger.info(req.user.email, "GET_ALL_MANUFACTURING_QUALITY_ERROR", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: manufacturingQualityErrors
        });
    } catch (error) {
        await Logger.error(req.user.email, "GET_ALL_MANUFACTURING_QUALITY_ERROR", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

exports.getManufacturingQualityErrorById = async (req, res) => {
    try {
        let id = req.params.id;
        let manufacturingQualityError = await ManufacturingQualityErrorService.getManufacturingQualityErrorById(id, req.portal);

        await Logger.info(req.user.email, "GET_MANUFACTURING_QUALITY_ERROR_BY_ID", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_quality_error_successfully"],
            content: manufacturingQualityError
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_MANUFACTURING_QUALITY_ERROR_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_quality_error_failed"],
            content: error.message
        })
    }
}

exports.getErrorNumByReporter = async (req, res) => {
    try {
        let errorNumByReporter = await ManufacturingQualityErrorService.getErrorNumByReporter(req.portal);
        await Logger.info(req.user.email, "GET_ERROR_NUM_BY_REPORTER", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_error_num_successfully"],
            content: errorNumByReporter
        })
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, "GET_ERROR_NUM_BY_REPORTER", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_error_num_failed"],
            content: error.message
        })
    }
}


exports.getErrorNumByGroup = async (req, res) => {
    try {
        let errorNumByGroup = await ManufacturingQualityErrorService.getErrorNumByGroup(req.portal);

        await Logger.info(req.user.email, "GET_ERROR_NUM_BY_GROUP", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_error_num_successfully"],
            content: errorNumByGroup
        });
    } catch (error) {
        await Logger.error(req.user.email, "GET_ERROR_NUM_BY_GROUP", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_error_num_failed"],
            content: error.message
        });
    }
}
