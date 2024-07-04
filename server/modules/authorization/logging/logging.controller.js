const LoggingService = require('./logging.service')
const Logger = require(`../../../logs`);

exports.getLogs = async (req, res) => {
  try {
    const result = await LoggingService.getLogs(req.portal ?? req.header.portal ?? req.body.portal, req.query);

    await Logger.info(req.body.email ?? '', 'get_authorization_logs_success');
    res.status(200).json({
        success: true,
        messages: ['get_authorization_logs_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_authorization_logs_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_authorization_logs_faile'],
          content: error
      });
  }
}
