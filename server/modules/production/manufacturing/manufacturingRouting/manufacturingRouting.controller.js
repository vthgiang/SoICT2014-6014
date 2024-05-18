const Logger = require(`../../../../logs`);
const ManufacturingRoutingService = require('./manufacturingRouting.service');


exports.getAllManufacturingRoutings = async (req, res) => {
    try {
        let query = req.query;

        let manufacturingRoutings = await ManufacturingRoutingService.getAllManufacturingRoutings(query, req.portal);

        await Logger.info(req.user.email, "GET_ALL_MANUFACTURING_ROUTING", req.portal);

        res.status(200).json({
            success: true,
            messages: "get_routings_successfully",
            content: manufacturingRoutings
        });
    } catch (error) {
        await Logger.error(req.user.email, "GET_ALL_MANUFACTURING_ROUTING", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_routings_failed"],
            content: error.message
        })
    }
}

exports.getManufacturingRoutingById = async (req, res) => {
    try {
        let id = req.params.id;
        let manufacturingRouting= await ManufacturingRoutingService.getManufacturingRoutingById(id, req.portal);

        await Logger.info(req.user.email, "GET_MANUFACTURING_ROUTING_BY_ID", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_routing_successfully"],
            content: manufacturingRouting
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_MANUFACTURING_ROUTING_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_routing_failed"],
            content: error.message
        })
    }
}

exports.createManufacturingRouting = async (req, res) => {
    try {
        let newManufacturingRouting = await ManufacturingRoutingService.createManufacturingRouting(req.body, req.portal);

        await Logger.info(req.user.email, "CREATE_NEW_MANUFACTURING_ROUTING", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_routing_successfully"],
            content: newManufacturingRouting
        })
    } catch (error) {
        await Logger.error(req.user.email, "CREATE_NEW_MANUFACTURING_ROUTING", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_routing_failed"],
            content: error.message
        })
    }
}

exports.getManufacturingRoutingsByGood = async (req, res) => {
    try {
        let id = req.params.id;
        let manufacturingRoutings = await ManufacturingRoutingService.getManufacturingRoutingsByGood(id, req.portal);

        await Logger.info(req.user.email, "GET_MANUFACTURING_ROUTING_BY_GOOD", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_routings_by_good_successfully"],
            content: manufacturingRoutings
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_MANUFACTURING_ROUTING_BY_GOOD", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_routings_by_good_failed"],
            content: error.message
        })
    }
}

exports.getAvailableResources = async (req, res) => {
    try {
        let id = req.params.id;
        let resources = await ManufacturingRoutingService.getAvailableResources(id, req.portal);

        await Logger.info(req.user.email, "GET_AVAILABLE_RESOURCE", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_available_resources_successfully"],
            content: resources
        })
    } catch (error) {
        await Logger.error(req.user.email, "GET_AVAILABLE_RESOURCE", req.portal);
        console.log(error);
        res.status(400).json({
            success: false,
            messages: ["get_available_resource_failed"],
            content: error.message
        })
    }
}

