const exprimentalAnalysisServices = require('./exprimentalAnalysis.service');
const NotificationServices = require(`../notification/notification.service`);
const Logger = require(`../../logs`);
exports.getProbablityDistribution = async (req,res) =>{
    try {
        let data = await exprimentalAnalysisServices.getProbabilityDistribution(req.portal,req.body);
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_fail'],
            content: error,
        });
    }
}
exports.createTaskDataset = async (req,res) =>{
    try {
        let data = await exprimentalAnalysisServices.createTaskDataset(req.portal,req.body);
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_fail'],
            content: error,
        });
    }
}
exports.createRiskDataset = async (req,res) =>{
    try {
    
        let data = await exprimentalAnalysisServices.createRiskDataset(req.portal,req.body);
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_fail'],
            content: error,
        });
    }
}
exports.createPertData = async (req,res) =>{
    try {
        console.log('startController',req.body)
    
        let data = await exprimentalAnalysisServices.createPertData(req.portal,req.body);
        // console.log('ok')
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_fail'],
            content: error,
        });
    }
}
exports.createTaskDistribution = async (req,res) =>{
    try {
        // console.log('startController',req.body)
    
        let data = await exprimentalAnalysisServices.createTaskDistribution(req.portal,req.body);
        // console.log('ok')
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_fail'],
            content: error,
        });
    }
}
exports.createRiskDistribution = async (req,res) =>{
    try {
    
        let data = await exprimentalAnalysisServices.createRiskDistribution(req.portal,req.body);
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_fail'],
            content: error,
        });
    }
}
exports.analysis = async (req, res) => {
    try {
    
        let data = await exprimentalAnalysisServices.analysis(req.portal);
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_fail'],
            content: error,
        });
    }
}