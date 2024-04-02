const RiskDistributionServices = require('./riskDistribution.service')
const Logger = require(`../../../logs`);


exports.editRiskRiskDistribution = async (req,res) =>{
    try {
       
        let risks = await RiskDistributionServices.editRiskDistribution(req.portal,req.params.id,req.body);
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: risks
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
/**
 * Hàm lấy danh sách rủi ro
 * @param {*} req request
 * @param {*} res response 
 */
exports.getRiskDistributions = async (req, res) => {
    try {
       
        let risks = await RiskDistributionServices.getRiskDistributions(req.portal,req.params);
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: risks
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

exports.getParentsOfRisk = async (req,res) =>{
    try {
        let risks = await RiskDistributionServices.getParentsOfRisk(req.portal,req.query)
        await Logger.info(req.user.email,'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: risks
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
/**
 * Hàm lấy danh sách rủi ro theo Id
 * @param {*} req 
 * @param {*} res 
 */
exports.getRiskDistributionByName = async (req, res) => {
    try {
        let risk = await RiskDistributionServices.getRiskDistributionByName(req.portal,req.query);
        await Logger.info(req.user.email, ' get_risk_by_id ', req.portal);
        res.status(200).json({
            success: true,
            message: ['get_risk_by_id_success'],
            content: risk
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_risk_by_id_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_by_id_fail'],
            content: error,
        });
    }
}


/**
 * Hàm tạo mới một rủi ro 
 * @param {*} req 
 * @param {*} res 
 */
exports.createRisk = async (req, res) => {
    try {
        console.log(req.body)
        let data = await RiskService.createRisk(req.portal,req.body);
        await Logger.info(req.user.email, ' create_risk', req.portal);
        res.status(200).json({
            success: true,
            messages: ['add_success'],
            content: data
        })
        
    } catch (error) {
        await Logger.error(req.user.email, ' add_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['add_fail'],
            content: error,
        });
    }
}


/**
 * Hàm xóa 1 rủi ro 
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteRiskDistribution = async (req, res) => {
    try {
        let deleteRisk = await RiskDistributionServices.deleteRiskDistribution(req.portal,req.params.id);
        await Logger.info(req.user.email, ' delete_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: deleteRisk,
        });
    } catch (error) {
        await Logger.error(req.user.email, ' delete_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_fail'],
            content: error,
        });
    }
}


/**
 * Hàm chỉnh sửa một rủi ro
 * @param {*} req 
 * @param {*} res 
 */
exports.editRisk = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.params.id)
        let editRisk = await RiskService.editRisk(req.portal,req.params.id,req.body);
        console.log('edit risk')
        console.log(editRisk)
        await Logger.info(req.user.email, ' edit_risk_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_risk_success'],
            content: editRisk,
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' edit_risk_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_risk_faile'],
            content: error,
        });
    }
}
exports.updateProbFromDataset = async(req,res) =>{
    try {
        let updateProb = await RiskDistributionServices.updateProbFromDataSet(req.portal);
        await Logger.info(req.user.email, ' update_prob_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['update_prob_success'],
            content: updateProb,
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' update_prob_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['update_prob_faile'],
            content: error,
        });
    }
}