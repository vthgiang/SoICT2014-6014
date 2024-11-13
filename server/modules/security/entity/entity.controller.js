const EntityService = require('./entity.service');
const Logger = require(`../../../logs`);

exports.find = async (req, res) => {
  try {
    const result = await EntityService.find(req.portal ?? req.header.portal ?? req.body.portal, req.query);

    await Logger.info(req.body.email ?? '', 'get_entities_success');
    res.status(200).json({
        success: true,
        messages: ['get_entities_success'],
        content: result
    });
  } catch (error) {
    console.log(error)
      await Logger.error(req.body.email ?? '', 'get_entities_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_entities_faile'],
          content: error
      });
  }
}

exports.findAll = async (req, res) => {
  try {
    const result = await EntityService.findAll(req.portal ?? req.header.portal ?? req.body.portal);

    await Logger.info(req.body.email ?? '', 'get_all_entities_success');
    res.status(200).json({
        success: true,
        messages: ['get_all_entities_success'],
        content: result
    });
  } catch (error) {
    console.log(error)
    await Logger.error(req.body.email ?? '', 'get_all_entities_faile');
    res.status(400).json({
        success: false,
        messages: Array.isArray(error) ? error : ['get_all_entities_faile'],
        content: error
    });
  }
}

exports.findOne = async (req, res) => {
  try {
    const result = await EntityService.findOne(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'get_entity_success');
    res.status(200).json({
        success: true,
        messages: ['get_entity_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_entity_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_entity_faile'],
          content: error
      });
  }
}

exports.updateAttributes = async (req, res) => {
  try {
    const result = await EntityService.updateAttributes(req.portal ?? req.header.portal ?? req.body.portal, req.params.id, req.body);

    await Logger.info(req.body.email ?? '', 'update_entities_success');
    res.status(200).json({
        success: true,
        messages: ['update_entities_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'update_entities_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['update_entities_faile'],
          content: error
      });
  }
}

// exports.remove = async (req, res) => {
//   try {
//     const result = await EntityService.remove(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

//     await Logger.info(req.body.email ?? '', 'remove_entities_success');
//     res.status(200).json({
//         success: true,
//         messages: ['remove_entities_success'],
//         content: result
//     });
//   } catch (error) {
//       await Logger.error(req.body.email ?? '', 'remove_entities_faile');
//       res.status(400).json({
//           success: false,
//           messages: Array.isArray(error) ? error : ['remove_entities_faile'],
//           content: error
//       });
//   }
// }

exports.getAccessibleResources = async (req, res) => {
  try {
    const resources = await EntityService.getAccessibleResources(req.portal ?? req.header.portal ?? req.body.portal, req.params.id, req.currentRole);

    await Logger.info(req.body.email ?? '', 'get_accessible_resources_success');
    res.status(200).json({
        success: true,
        messages: ['get_accessible_resources_success'],
        content: resources
    });
  } catch (error) {
    console.log(error)
    await Logger.error(req.body.email ?? '', 'get_accessible_resources_faile');
    res.status(400).json({
        success: false,
        messages: Array.isArray(error) ? error : ['get_accessible_resources_faile'],
        content: error
    });
  }
}
