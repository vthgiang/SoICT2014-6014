const RiskResponsePlanService = require('./riskResponsePlan.service');
const NotificationServices = require(`../../notification/notification.service`);
const Logger = require(`../../../logs`);

exports.getRiskResponsePlans = async (req, res) => {
    try {
        let riskResponsePlans = await RiskResponsePlanService.getRiskResponsePlans(req.portal,req.query)
        // console.log(riskResponsePlans)
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_response_success'],
            content: riskResponsePlans
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_response_failure ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_response_failure'],
            content: error,
        });
    }
}
exports.getRiskResponsePlanById = async(req,res) =>{
    try {
        let riskResponsePlan = await RiskResponsePlanService.getRiskResponsePlanById(req.portal,req.params.id)
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_response_success'],
            content: riskResponsePlan
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_response_failure ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_response_failure'],
            content: error,
        });
    }
}
exports.createRiskResponsePlan = async(req,res) =>{
    try {
        let riskResponsePlan = await RiskResponsePlanService.createRiskResponsePlan(req.portal,req.body)
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['add_success'],
            content: riskResponsePlan
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' create_failure ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['create_failure'],
            content: error,
        });
    }
}
exports.deleteRiskResponsePlan = async (req,res) =>{
    try {
        let riskResponsePlan = await RiskResponsePlanService.deleteRiskResponsePlan(req.portal,req.params.id)
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: riskResponsePlan
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, 'delete_failure ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['dêlete_failure'],
            content: error,
        });
    }
}
exports.editRiskResponsePlan = async (req,res) =>{
    try {
        console.log(req.body)
        console.log(req.params.id)
        let editRiskResponsePlan = await RiskResponsePlanService.editRiskResponsePlan(req.portal,req.params.id,req.body)
        // console.log(editRisk)
        await Logger.info(req.user.email, 'edit_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_success'],
            content: editRiskResponsePlan,
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, 'edit_failure', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_failure'],
            content: error,
        });
    }
}
exports.getRiskResponsePlanByRiskId = async(req,res) =>{
    try {
        let riskResponsePlans = await RiskResponsePlanService.getRiskResponsePlanByRiskId(req.portal,req.params.id)
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_response_by_risk_id_success'],
            content: riskResponsePlans
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_response_by_risk_id_failure ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_response_by_risk_id_failure'],
            content: error,
        });
    }
}