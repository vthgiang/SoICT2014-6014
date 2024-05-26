const ExternalServiceConsumerService = require('./external-service-consumers.service');
const Logger = require(`../../../logs`);

exports.create = async (req, res) => {
  try {
    const result = await ExternalServiceConsumerService.create(req.portal ?? req.header.portal ?? req.body.portal, req.body);

    await Logger.info(req.body.email ?? '', 'create_external_service_consumers_success');
    res.status(200).json({
        success: true,
        messages: ['create_external_service_consumers_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'create_external_service_consumers_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['create_external_service_consumers_faile'],
          content: error
      });
  }
}

exports.findAll = async (req, res) => {
  try {
    const result = await ExternalServiceConsumerService.findAll(req.portal ?? req.header.portal ?? req.body.portal, req.body);

    await Logger.info(req.body.email ?? '', 'get_external_service_consumers_success');
    res.status(200).json({
        success: true,
        messages: ['get_external_service_consumers_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_external_service_consumers_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_external_service_consumers_faile'],
          content: error
      });
  }
}

exports.findOne = async (req, res) => {
  try {
    const result = await ExternalServiceConsumerService.findOne(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'get_external_service_consumer_success');
    res.status(200).json({
        success: true,
        messages: ['get_external_service_consumer_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_external_service_consumer_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_external_service_consumer_faile'],
          content: error
      });
  }
}

exports.update = async (req, res) => {
  try {
    const result = await ExternalServiceConsumerService.update(req.portal ?? req.header.portal ?? req.body.portal, req.params.id, req.body);

    await Logger.info(req.body.email ?? '', 'update_external_service_consumer_success');
    res.status(200).json({
        success: true,
        messages: ['update_external_service_consumer_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'update_external_service_consumer_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['update_external_service_consumer_faile'],
          content: error
      });
  }
}

exports.remove = async (req, res) => {
  try {
    const result = await ExternalServiceConsumerService.remove(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'remove_external_service_consumers_success');
    res.status(200).json({
        success: true,
        messages: ['remove_external_service_consumers_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'remove_external_service_consumers_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['remove_external_service_consumers_faile'],
          content: error
      });
  }
}
