const OntimePredictService = require('./ontimePredict.service');
const Log = require(`../../../logs`);

exports.getOnTimeDeliveryRates = async (req, res) => {
    try {
        let data = await OntimePredictService.getOnTimeDeliveryRates(req.portal, req.query);
        await Log.info(req.user.email, "GET_ONTIME_DELIVERY_RATES", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_ontime_delivery_rates_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ONTIME_DELIVERY_RATES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_ontime_delivery_rates_fail"],
            content: error.message
        });
    }
}

exports.getEstimatedOnTimeDeliveryRates = async (req, res) => {
    try {
        let data = await OntimePredictService.getEstimatedOnTimeDeliveryRates(req.portal, req.query);
        await Log.info(req.user.email, "GET_ESTIMATED_ONTIME_DELIVERY_RATES", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_estimated_ontime_delivery_rates_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ESTiMATED_ONTIME_DELIVERY_RATES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_estimated_ontime_delivery_rates_fail"],
            content: error.message
        });
    }
}

exports.getDeliveryLateDayAverage = async (req, res) => {
    try {
        let data = await OntimePredictService.getDeliveryLateDayAverage(req.portal, req.query);
        await Log.info(req.user.email, "GET_DELIVERY_LATE_DAY_AVERAGE", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_delivery_late_day_average_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_DELIVERY_LATE_DAY_AVERAGE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_delivery_late_day_average_fail"],
            content: error.message
        });
    }
}