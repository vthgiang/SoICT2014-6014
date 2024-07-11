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
    await Logger.info(req.user.email, 'get_capacity_success ', req.portal);
    res.status(200).json({
      success: true,
      messages: ['get_capacity_success'],
      content: capacities
    })
  } catch (error) {
    await Logger.error(req.user.email, 'get_capacity_fail', req.portal);
    res.status(404).json({
      success: false,
      messages: Array.isArray(error) ? error : ['get_capacity_fail'],
      content: error,
    });
  }
}

exports.getOneCapacity = async (req, res) => {
  try {
    let data = await CapacityService.getOneCapacity(req.portal, req.params.id)
    await Logger.info(req.user.email, 'get_one_capacity', req.portal)
    res.status(200).json({
      success: true, 
      messages: ['get_one_capacity_success'],
      content: data
    })
  } catch (error) {
    await Logger.error(req.user.email, 'get_one_capacity', req.portal)
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ['get_one_capacity_fail'],
      content: error
    })
  }
}

/** Tạo mới năng lực */
exports.createNewCapacity = async (req, res) => {
  try {
    let data = await CapacityService.createNewCapacity(req.portal, req.body)
    await Logger.info(req.user.email, 'create_new_capacity', req.portal)
    res.status(200).json({
      success: true, 
      messages: ['create_new_capacity_success'],
      content: data
    })
  } catch (error) {
    await Logger.error(req.user.email, 'create_new_capacity', req.portal)
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ['create_new_capacity_fail'],
      content: error
    })
  }
}

exports.updateCapacity = async (req, res) => {
  try {
    let data = await CapacityService.updateCapacity(req.portal, req.params.id, req.body)
    await Logger.info(req.user.email, 'edit_capacity_success', req.portal)
    res.status(200).json({
      success: true,
      messages: ['edit_capacity_success'],
      content: data
    });
  } catch (error) {
    await Logger.error(req.user.email, ' edit_capacity_fail ', req.portal);
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ['edit_capacity_fail'],
      content: error
    })
  }
}

exports.deleteCapacity = async (req, res) => {
  try {
    let data = await CapacityService.deleteCapacity(req.portal, req.params.id)
    await Logger.info(req.user.email, 'delete_capacity_success', req.portal)
    res.status(200).json({
      success: true,
      messages: ['delete_capacity_success'],
      content: data
    });
  } catch (error) {
    await Logger.error(req.user.email, ' delete_capacity_fail ', req.portal);
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ['delete_capacity_fail'],
      content: error
    })
  }
}
