const CapacityService = require('./capacity.service')
const Logger = require('../../logs')

/**
 * Lấy danh sách capacities (năng lực)
 * @param {*} req request
 * @param {*} res response 
 */

exports.getListCapacities = async (req, res) => {
  try {
    const capacities = await CapacityService.getAllCapacities(req.portal, req.query)
    await Logger.info(req.user.email, ' get_capacity_success ', req.portal);
    res.status(200).json({
      success: true,
      messages: ['get_capacity_success'],
      content: capacities
    })
  } catch (error) {
    await Logger.error(req.user.email, 'get_capacity_fail', req.portal);
    res.status(404).json({
      success: false,
      messages: ['get_capacity_fail'],
      content: error,
    });
  }
}