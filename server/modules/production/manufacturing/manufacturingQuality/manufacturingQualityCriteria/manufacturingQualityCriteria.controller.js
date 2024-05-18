const ManufacturingQualityCriteriaService = require('./manufacturingQualityCriteria.service');
const Logger = require('../../../../../logs');

exports.getAllManufacturingQualityCriterias= async (req, res) => {
    try {
        let query = req.query;
        let manufacturingQualityCriterias = await ManufacturingQualityCriteriaService.getAllManufacturingQualityCriterias(query, req.portal);

        await Logger.info(req.user.email, "GET_ALL_MANUFACTURING_QUALITY_CRITERIA", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: manufacturingQualityCriterias
        });
    } catch (error) {
        await Logger.error(req.user.email, "GET_ALL_MANUFACTURING_QUALITY_ERROR_CRITERIA", req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

exports.getManufacturingQualityCriteriaById= async (req, res) => {
    try {
        let id = req.params.id;
        let manufacturingQualityCriteria = await ManufacturingQualityCriteriaService.getManufacturingQualityCriteriaById(id, req.portal);

        await Logger.info(req.user.email, "GET_MANUFACTURING_QUALITY_CRITERIA_BY_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_quality_criteria_successfully"],
            content: manufacturingQualityCriteria
        });
    } catch (error) {
        await Logger.error(req.user.email, "GET_MANUFACTURING_QUALITY_CRITERIA_BY_ID", req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_quality_criteria_failed"],
            content: error.message
        });
    }
}
