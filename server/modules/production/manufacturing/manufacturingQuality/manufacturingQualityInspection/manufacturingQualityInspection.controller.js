const ManufacturingInspection = require('./manufacturingQualityInspection.service');
const Logger = require('../../../../../logs');

exports.getAllManufacturingQualityInspections = async (req, res) => {
    try {
        let query = req.query;
        let manufacturingQualityInspections = await ManufacturingInspection.getAllManufacturingQualityInspections(query, req.portal);

        await Logger.info(req.user.email, "GET_ALL_MANUFACTURING_QUALITY_INSPECTION", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: manufacturingQualityInspections
        });
    } catch (error) {
        await Logger.error(req.user.email, "GET_ALL_MANUFACTURING_QUALITY_INSPECTION", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

exports.createManufacturingQualityInspection = async (req, res) => {
    try {
        let data = req.body;
        let manufacturingQualityInspections = await ManufacturingInspection.createManufacturingQualityInspection(data, req.portal);

        await Logger.info(req.user.email, "CREATED_NEW_MANUFACTURING_QUALITY_INSPECTION", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: manufacturingQualityInspections
        });
    } catch (error) {
        await Logger.error(req.user.email, "CREATED_NEW_MANUFACTURING_QUALITY_INSPECTION", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

