const JourneyService = require('./journey.service');
const Log = require(`../../../logs`);

exports.getJourneys = async (req, res) => {
    try {
        let data = await JourneyService.getJourneys(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_DELIVERY_PLANS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_deliveryPlans_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_DELIVERY_PLANS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_deliveryPlans_fail"],
            content: error.message
        });
    }
}

exports.getJourneysWithCost = async (req, res) => {
    try {
        let data = await JourneyService.getJourneysWithCost(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_DELIVERY_PLANS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_deliveryPlans_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_DELIVERY_PLANS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_journey_cost"],
            content: error.message
        });
    }
}

exports.getJourneyByCondition = async (req, res) => {
    try {
        let data = await JourneyService.getJourneyByCondition(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_DELIVERY_PLANS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_deliveryPlans_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_DELIVERY_PLANS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_deliveryPlans_fail"],
            content: error.message
        });
    }
}

exports.changeDrivers = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedJourney = await JourneyService.changeDrivers(req.portal, id, data);
        if (updatedJourney !== -1) {
            await Log.info(req.user.email, "UPDATED_JOURNEY", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_journey_success"],
                content: updatedJourney
            });
        } else {
            throw Error("Journey is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_JOURNEY", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_journey_fail"],
            content: error.message
        });
    }
}

exports.updateJourney = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let user = req.user;
        let updatedJourney = await JourneyService.updateJourney(req.portal, id, data, user);
        if (updatedJourney !== -1) {
            await Log.info(req.user.email, "UPDATED_JOURNEY", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_journey_success"],
                content: updatedJourney
            });
        } else {
            throw Error("Journey is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_JOURNEY", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_journey_fail"],
            content: error.message
        });
    }
}

exports.createJourney = async (req, res) => {
    try {
        let newDeliveryPlan = await JourneyService.createJourney(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_DELIVERY_PLAN', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newDeliveryPlan
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_DELIVERY_PLAN", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

exports.deleteJourney = async (req, res) => {
    const { id } = req.params;
    try {
        let journey = await JourneyService.deleteJourney(req.portal, id);

        await Log.info(req.user.email, 'DELETE_JOURNEY', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: journey
        });
    } catch (error) {
        await Log.error(req.user.email, "DELETE_JOURNEY", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}