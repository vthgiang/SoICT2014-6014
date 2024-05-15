const LoggingService = require('./logging.service')
const Logger = require(`../../../logs`);

exports.findAll = async (req, res) => {
  try {
    const result = await LoggingService.findAll(req.portal ?? req.header.portal ?? req.body.portal, req.body);

    await Logger.info(req.body.email ?? '', 'get_service_identity_log_success');
    res.status(200).json({
        success: true,
        messages: ['get_service_identity_log_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_service_identity_log_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_service_identity_log_faile'],
          content: error
      });
  }
}
