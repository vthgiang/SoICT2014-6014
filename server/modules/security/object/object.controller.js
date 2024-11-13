const ObjectService = require('./object.service');
const Logger = require(`../../../logs`);

exports.find = async (req, res) => {
  try {
    const result = await ObjectService.find(req.portal ?? req.header.portal ?? req.body.portal, req.query);

    await Logger.info(req.body.email ?? '', 'get_objects_success');
    res.status(200).json({
        success: true,
        messages: ['get_objects_success'],
        content: result
    });
  } catch (error) {
    console.log(error)
      await Logger.error(req.body.email ?? '', 'get_objects_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_objects_faile'],
          content: error
      });
  }
}

exports.findAll = async (req, res) => {
  try {
    const result = await ObjectService.findAll(req.portal ?? req.header.portal ?? req.body.portal);

    await Logger.info(req.body.email ?? '', 'get_all_objects_success');
    res.status(200).json({
        success: true,
        messages: ['get_all_objects_success'],
        content: result
    });
  } catch (error) {
    console.log(error)
    await Logger.error(req.body.email ?? '', 'get_all_objects_faile');
    res.status(400).json({
        success: false,
        messages: Array.isArray(error) ? error : ['get_all_objects_faile'],
        content: error
    });
  }
}

exports.findOne = async (req, res) => {
  try {
    const result = await ObjectService.findOne(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'get_object_success');
    res.status(200).json({
        success: true,
        messages: ['get_object_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_object_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_object_faile'],
          content: error
      });
  }
}

exports.updateAttributes = async (req, res) => {
  try {
    const result = await ObjectService.updateAttributes(req.portal ?? req.header.portal ?? req.body.portal, req.params.id, req.body);

    await Logger.info(req.body.email ?? '', 'update_objects_success');
    res.status(200).json({
        success: true,
        messages: ['update_objects_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'update_objects_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['update_objects_faile'],
          content: error
      });
  }
}

// exports.remove = async (req, res) => {
//   try {
//     const result = await ObjectService.remove(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

//     await Logger.info(req.body.email ?? '', 'remove_objects_success');
//     res.status(200).json({
//         success: true,
//         messages: ['remove_objects_success'],
//         content: result
//     });
//   } catch (error) {
//       await Logger.error(req.body.email ?? '', 'remove_objects_faile');
//       res.status(400).json({
//           success: false,
//           messages: Array.isArray(error) ? error : ['remove_objects_faile'],
//           content: error
//       });
//   }
// }

exports.getAccessibleResources = async (req, res) => {
  try {
    const resources = await ObjectService.getAccessibleResources(req.portal ?? req.header.portal ?? req.body.portal, req.params.id, req.currentRole);

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
