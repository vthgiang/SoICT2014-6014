const ExternalPoliciesService = require('./external-policies.service');
const Logger = require(`../../../logs`);
exports.create = async (req, res) => {
  try {
    const result = await ExternalPoliciesService.create(req.portal ?? req.header.portal ?? req.body.portal, req.body);

    await Logger.info(req.body.email ?? '', 'create_external_policies_success');
    res.status(200).json({
        success: true,
        messages: ['create_external_policies_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'create_external_policies_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['create_external_policies_faile'],
          content: error
      });
  }
}

exports.findAll = async (req, res) => {
  try {
    const result = await ExternalPoliciesService.findAll(req.portal ?? req.header.portal ?? req.body.portal, req.body);

    await Logger.info(req.body.email ?? '', 'get_external_policies_success');
    res.status(200).json({
        success: true,
        messages: ['get_external_policies_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_external_policies_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_external_policies_faile'],
          content: error
      });
  }
}

exports.findOne = async (req, res) => {;
  try {
    const result = await ExternalPoliciesService.findOne(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'get_external_policy_success');
    res.status(200).json({
        success: true,
        messages: ['get_external_policy_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_external_policy_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_external_policy_faile'],
          content: error
      });
  }
}

exports.update = async (req, res) => {
  try {
    const result = await ExternalPoliciesService.update(req.portal ?? req.header.portal ?? req.body.portal, req.params.id, req.body);

    await Logger.info(req.body.email ?? '', 'update_external_policies_success');
    res.status(200).json({
        success: true,
        messages: ['update_external_policies_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'update_external_policies_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['update_external_policies_faile'],
          content: error
      });
  }
}

exports.remove = async (req, res) => {
  try {
    const result = await ExternalPoliciesService.remove(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'remove_external_policies_success');
    res.status(200).json({
        success: true,
        messages: ['remove_external_policies_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'remove_external_policies_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['remove_external_policies_faile'],
          content: error
      });
  }
}
