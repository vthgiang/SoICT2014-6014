const RoutePickingService = require('./routePicking.service');
const Log = require(`../../../../logs`);

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