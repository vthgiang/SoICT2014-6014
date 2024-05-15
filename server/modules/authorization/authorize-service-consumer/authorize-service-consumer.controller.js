const AuthorizeServiceConsumerService = require('./authorize-service-consumer.service');
const Logger = require(`../../../logs`);
exports.authorizeServiceAccount = async (req, res) => {
  try {
    const result = await AuthorizeServiceConsumerService.authorizeServiceConsumer(req.portal ?? req.header.portal ?? req.body.portal, req.body);

    await Logger.info(req.body.email ?? '', 'authorize_service_success');
    res.status(200).json({
        success: true,
        messages: ['authorize_service_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'authorize_service_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['authorize_service_faile'],
          content: error
      });
  }
}
