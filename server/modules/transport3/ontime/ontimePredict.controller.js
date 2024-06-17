const OntimePredictService = require('./ontimePredict.service');
const Log = require(`../../../logs`);
const axios = require('axios')
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

exports.predictOnTimeDelivery = async (req, res) => {
    try {
        let { scheduleId } = req.params;
        console.log("Schedule ID:", scheduleId);
        
        const responseAI = await axios.post(`http://localhost:8080/ api/dxclan/ontime_predict/${scheduleId}`);
        // const responseAI = await axios.post(`${process.env.PYTHON_URL_SERVER}/api/dxclan/ontime_predict/`, scheduleId);
        console.log("Response from AI service:", responseAI);
        
        // Uncomment and implement the following lines as needed
        // let data = await OntimePredictService.predictOnTimeDelivery(req.portal, scheduleId);
        // await Log.info(req.user.email, "PREDICT_ONTIME_DELIVERY", req.portal);

        // res.status(200).json({
        //     success: true,
        //     messages: ["predict_ont_time_delivery_success"],
        //     content: data
        // });
    } catch (error) {
        console.error("Error occurred:", error.message);
        
        // Uncomment and implement the following lines as needed
        // await Log.error(req.user.email, "PREDICT_ONTIME_DELIVERY", req.portal);

        // res.status(400).json({
        //     success: false,
        //     messages: ["predict_ont_time_delivery_fail"],
        //     content: error.message
        // });
    } 
}

