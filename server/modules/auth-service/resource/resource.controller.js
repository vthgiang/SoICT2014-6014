const ResourceService = require('./resource.service');
const Logger = require(`../../../logs`);
// exports.create = async (req, res) => {
//   try {
//     const result = await ResourceService.create(req.portal ?? req.header.portal ?? req.body.portal, req.body);

//     await Logger.info(req.body.email ?? '', 'create_resources_success');
//     res.status(200).json({
//         success: true,
//         messages: ['create_resources_success'],
//         content: result
//     });
//   } catch (error) {
//       await Logger.error(req.body.email ?? '', 'create_resources_faile');
//       res.status(400).json({
//           success: false,
//           messages: Array.isArray(error) ? error : ['create_resources_faile'],
//           content: error
//       });
//   }
// }

exports.find = async (req, res) => {
  try {
    const result = await ResourceService.find(req.portal ?? req.header.portal ?? req.body.portal, req.query);

    await Logger.info(req.body.email ?? '', 'get_resources_success');
    res.status(200).json({
        success: true,
        messages: ['get_resources_success'],
        content: result
    });
  } catch (error) {
    console.log(error)
      await Logger.error(req.body.email ?? '', 'get_resources_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_resources_faile'],
          content: error
      });
  }
}

exports.findAll = async (req, res) => {
  try {
    const result = await ResourceService.findAll(req.portal ?? req.header.portal ?? req.body.portal);

    await Logger.info(req.body.email ?? '', 'get_all_resources_success');
    res.status(200).json({
        success: true,
        messages: ['get_all_resources_success'],
        content: result
    });
  } catch (error) {
    console.log(error)
    await Logger.error(req.body.email ?? '', 'get_all_resources_faile');
    res.status(400).json({
        success: false,
        messages: Array.isArray(error) ? error : ['get_all_resources_faile'],
        content: error
    });
  }
}

exports.findOne = async (req, res) => {
  try {
    const result = await ResourceService.findOne(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'get_resource_success');
    res.status(200).json({
        success: true,
        messages: ['get_resource_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_resource_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_resource_faile'],
          content: error
      });
  }
}

exports.updateAttributes = async (req, res) => {
  try {
    const result = await ResourceService.updateAttributes(req.portal ?? req.header.portal ?? req.body.portal, req.params.id, req.body);

    await Logger.info(req.body.email ?? '', 'update_resources_success');
    res.status(200).json({
        success: true,
        messages: ['update_resources_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'update_resources_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['update_resources_faile'],
          content: error
      });
  }
}

// exports.remove = async (req, res) => {
//   try {
//     const result = await ResourceService.remove(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

//     await Logger.info(req.body.email ?? '', 'remove_resources_success');
//     res.status(200).json({
//         success: true,
//         messages: ['remove_resources_success'],
//         content: result
//     });
//   } catch (error) {
//       await Logger.error(req.body.email ?? '', 'remove_resources_faile');
//       res.status(400).json({
//           success: false,
//           messages: Array.isArray(error) ? error : ['remove_resources_faile'],
//           content: error
//       });
//   }
// }
