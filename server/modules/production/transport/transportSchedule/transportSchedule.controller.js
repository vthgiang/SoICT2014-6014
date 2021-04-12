const TransportScheduleServices = require('./transportSchedule.service');
const Log = require(`../../../../logs`);

exports.getTransportRouteByPlanId = async (req, res) => {
    try {
        let { id } = req.params;
        let transportRoute = await TransportScheduleServices.getTransportRouteByPlanId(req.portal, id);
        if (transportRoute !== -1) {
            await Log.info(req.user.email, "GET_TRANPORT_ROUTE_BY_PLAN_ID", req.portal);
            res.status(200).json({
                success: true,
                messages: ["get_transport_route_by_plan_id_success"],
                content: transportRoute
            });
        } else {
            throw Error("transport requirement is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_TRANPORT_ROUTE_BY_PLAN_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_transport_route_by_plan_id_fail"],
            content: error.message
        });
    }
}

exports.editTransportRouteByPlanId = async (req, res) => {
    try {
        let { planId } = req.params;
        let data = req.body;
        let updatedTransportRoute = await TransportScheduleServices.editTransportRouteByPlanId(req.portal, planId, data);
        if (updatedTransportRoute !== -1) {
            await Log.info(req.user.email, "UPDATED_TRANSPORT_ROUTE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_transport_route_success"],
                content: updatedTransportRoute
            });
        } else {
            throw Error("TransportRoute is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_TRANSPORT_ROUTE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_transport_ROUTE_fail"],
            content: error.message
        });
    }
}
