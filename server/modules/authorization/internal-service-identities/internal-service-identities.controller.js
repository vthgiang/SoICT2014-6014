const Logger = require(`../../../logs`);
const InternalServiceIdentitiesService = require('./internal-service-identities.service');

exports.create = async (req, res) => {
  try {
    const result = await InternalServiceIdentitiesService.create(req.portal ?? req.header.portal ?? req.body.portal, req.body);

    await Logger.info(req.body.email ?? '', 'create_internal_service_identities_success');
    res.status(200).json({
        success: true,
        messages: ['create_internal_service_identities_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'create_internal_service_identities_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['create_internal_service_identities_faile'],
          content: error
      });
  }
}

exports.findAll = async (req, res) => {
  try {
    const result = await InternalServiceIdentitiesService.findAll(req.portal ?? req.header.portal ?? req.body.portal, req.body);

    await Logger.info(req.body.email ?? '', 'get_internal_service_identities_success');
    res.status(200).json({
        success: true,
        messages: ['get_internal_service_identities_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_internal_service_identities_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_internal_service_identities_faile'],
          content: error
      });
  }
}

exports.findOne = async (req, res) => {
  try {
    const result = await InternalServiceIdentitiesService.findOne(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'get_internal_service_identity_success');
    res.status(200).json({
        success: true,
        messages: ['get_internal_service_identity_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_internal_service_identity_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_internal_service_identity_faile'],
          content: error
      });
  }
}

exports.update = async (req, res) => {
  try {
    const result = await InternalServiceIdentitiesService.update(req.portal ?? req.header.portal ?? req.body.portal, req.params.id, req.body);

    await Logger.info(req.body.email ?? '', 'update_internal_service_identities_success');
    res.status(200).json({
        success: true,
        messages: ['update_internal_service_identities_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'update_internal_service_identities_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['update_internal_service_identities_faile'],
          content: error
      });
  }
}

exports.remove = async (req, res) => {
  try {
    const result = await InternalServiceIdentitiesService.remove(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'remove_internal_service_identities_success');
    res.status(200).json({
        success: true,
        messages: ['remove_internal_service_identities_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'remove_internal_service_identities_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['remove_internal_service_identities_faile'],
          content: error
      });
  }
}

exports.getApiServiceCanAccess = async (req, res) => {
  try {
    const result = await InternalServiceIdentitiesService.getApiServiceCanAccess(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'get_api_service_can_access_success');
    res.status(200).json({
        success: true,
        messages: ['get_api_service_can_access_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_api_service_can_access_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_api_service_can_access_faile'],
          content: error
      });
  }
}