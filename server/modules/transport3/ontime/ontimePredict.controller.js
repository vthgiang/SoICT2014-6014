const OntimePredictService = require('./ontimePredict.service');
const Log = require(`../../../logs`);
const axios = require('axios');
// const { schedule } = require('../../../../client-vite/src/modules/transport3/schedule/redux/reducers');

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

exports.getOnTimeDeliveryRatesPerMonth = async (req, res) => {
    try {
        let data = await OntimePredictService.getOnTimeDeliveryRatesPerMonth(req.portal, req.query);
        await Log.info(req.user.email, "GET_ONTIME_DELIVERY_RATES_PER_MONTH", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_ontime_delivery_rates_per_month_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ONTIME_DELIVERY_RATES_PER_MONTH", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_ontime_delivery_rates_per_month_fail"],
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

exports.getEstimatedOnTimeDeliveryRatesPerMonth = async (req, res) => {
    try {
        let data = await OntimePredictService.getEstimatedOnTimeDeliveryRatesPerMonth(req.portal, req.query);
        await Log.info(req.user.email, "GET_ESTIMATED_ONTIME_DELIVERY_RATES_PER_MONTH", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_estimated_ontime_delivery_rates_per_month_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ESTIMATED_ONTIME_DELIVERY_RATES_PER_MONTH", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_estimated_ontime_delivery_rates_per_month_fail"],
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

exports.getDeliveryLateDayAveragePerMonth = async (req, res) => {
    try {
        let data = await OntimePredictService.getDeliveryLateDayAveragePerMonth(req.portal, req.query);
        await Log.info(req.user.email, "GET_DELIVERY_LATE_DAY_AVERAGE_PER_MONTH", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_delivery_late_day_average_per_month_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_DELIVERY_LATE_DAY_AVERAGE_PER_MONTH", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_delivery_late_day_average_per_month_fail"],
            content: error.message
        });
    }
}

exports.getTopLateDeliveryDay = async (req, res) => {
    const { month, year } = req.query;
    try {
        let data = await OntimePredictService.getTopLateDeliveryDay(req.portal, { month: parseInt(month), year: parseInt(year) });
        await Log.info(req.user.email, "GET_TOP_LATE_DAY_OF_WEEK", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_top_late_day_of_week_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_TOP_LATE_DAY_OF_WEEK", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_top_late_day_of_week_fail"],
            content: error.message
        });
    }
}

exports.getTopLateProducts = async (req, res) => {
    const { month, year } = req.query;
    try {
        let data = await OntimePredictService.getTopLateProducts(req.portal, { month: parseInt(month), year: parseInt(year) });
        await Log.info(req.user.email, "GET_TOP_LATE_PRODUCTS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_top_late_products_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_TOP_LATE_PRODUCTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_top_late_products_fail"],
            content: error.message
        });
    }
}

exports.getTopLateStocks = async (req, res) => {
    const { month, year } = req.query;
    try {
        let data = await OntimePredictService.getTopLateStocks(req.portal, { month: parseInt(month), year: parseInt(year) });
        await Log.info(req.user.email, "GET_TOP_LATE_STOCKS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_top_late_stocks_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_TOP_LATE_STOCKS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_top_late_stocks_fail"],
            content: error.message
        });
    }
}

exports.predictOnTimeDelivery = async (req, res) => {
    try {
        let { scheduleId } = req.params;
        // const responseAI = await axios.get(`${process.env.PYTHON_URL_SERVER}/api/dxclan/ontime_predict/${scheduleId}`);
        let data = await OntimePredictService.UpdateEstimatedOntimeDeliveryInfo(req.portal, scheduleId);
        await Log.info(req.user.email, "PREDICT_ONTIME_DELIVERY", req.portal);

        res.status(200).json({
            success: true,
            messages: ["predict_ont_time_delivery_success"],
            content: data
        });
    } catch (error) {

        await Log.error(req.user.email, "PREDICT_ONTIME_DELIVERY", req.portal);

        res.status(400).json({
            success: false,
            messages: ["predict_ont_time_delivery_fail"],
            content: error.message
        });
    } 
}

exports.retrainingModel = async (req, res) => {
    try {
        const responseAI = await axios.get(`${process.env.PYTHON_URL_SERVER}/api/dxclan/ontime_predict/retrain/`);
        await Log.info(req.user.email, "RETRAINING_MODEL", req.portal);
        console.log(responseAI.data)

        res.status(200).json({
            success: true,
            messages: ["retraining_model_success"],
            content: responseAI.data
        });
    } catch (error) {

        await Log.error(req.user.email, "RETRAINING_MODEL", req.portal);

        res.status(400).json({
            success: false,
            messages: ["retraining_model_fail"],
            content: error.message
        });
    } 
}

