const RoutePickingService = require('./routePicking.service');
const Log = require(`../../../../logs`);
const axios = require('axios');

exports.getAllChemins = async (req, res) => {
    try {
        let data = await RoutePickingService.getAllChemins(req.portal, req.query);
        await Log.info(req.user.email, "GET_ALL_CHEMINS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_chemins_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_CHEMINS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_chemins_fail"],
            content: error.message
        });
    }
}

exports.getChemin = async (req, res) => {
    try {
        let data = await RoutePickingService.getChemin(req.params.id, req.portal)
        await Log.info(req.user.email, "GET_CHEMIN", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_chemin_success"],
            content: data
        })
    } catch (error) {
        await Log.error(req.user.email, 'GET_CHEMIN', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_chemin_failed'],
            content: error.message
        })
    }
}

exports.createRoutePicking = async (req, res) => {
    try {
        let data = req.body;
        const responseAI = await axios.post(`${process.env.PYTHON_URL_SERVER}/api/dxclan/order_picking/simulate_wave`, data);
        
        // Check if responseAI does not exist or responseAI.data.message is 2
        if (!responseAI || responseAI.data.message === 2) {
            await Log.error(req.user.email, 'CREATE_ROUTE_PICKING', req.portal);
            return res.status(400).json({
                success: false,
                messages: ['create_route_picking_failed_due_to_invalid_response'],
                content: 'Invalid response from AI service'
            });
        }

        await Log.info(req.user.email, "CREATE_ROUTE_PICKING", req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_route_picking_success"],
            // content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_ROUTE_PICKING', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_route_picking_failed'],
            content: error.message
        });
    }
};

exports.getAllRoutePickings = async (req, res) => {
    try {
        const routePicking = await RoutePickingService.getAllRoutePickings('vnist')
        res.status(200).json(routePicking);
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['get_route_picking_failed'],
            content: error.message
        })
    }
}
