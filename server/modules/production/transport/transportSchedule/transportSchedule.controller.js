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

exports.editTransportScheduleByPlanId = async (req, res) => {
    try {
        let { planId } = req.params;
        let data = req.body;
        let updatedTransportRoute = await TransportScheduleServices.editTransportRouteByPlanId(req.portal, planId, data);
        if (updatedTransportRoute !== -1) {
            await Log.info(req.user.email, "UPDATED_TRANSPORT_SCHEDULE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_transport_schedule_success"],
                content: updatedTransportRoute
            });
        } else {
            throw Error("TransportSchedule is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_TRANSPORT_SCHEDULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_transport_schedule_fail"],
            content: error.message
        });
    }
}

exports.driverSendMessage = async (req, res) => {
    try {
        let {data, userId} = req.body;
        let updatedTransportRoute = await TransportScheduleServices.driverSendMessage(req.portal, data, userId);
        if (updatedTransportRoute !== -1) {
            await Log.info(req.user.email, "UPDATED_TRANSPORT_SCHEDULE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_transport_schedule_success"],
                content: updatedTransportRoute
            });
        } else {
            throw Error("TransportSchedule is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_TRANSPORT_SCHEDULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_transport_schedule_fail"],
            content: error.message
        });
    }
}
