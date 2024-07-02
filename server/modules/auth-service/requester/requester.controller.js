const RequesterService = require('./requester.service');
const Logger = require(`../../../logs`);
// exports.create = async (req, res) => {
//   try {
//     const result = await RequesterService.create(req.portal ?? req.header.portal ?? req.body.portal, req.body);

//     await Logger.info(req.body.email ?? '', 'create_requesters_success');
//     res.status(200).json({
//         success: true,
//         messages: ['create_requesters_success'],
//         content: result
//     });
//   } catch (error) {
//       await Logger.error(req.body.email ?? '', 'create_requesters_faile');
//       res.status(400).json({
//           success: false,
//           messages: Array.isArray(error) ? error : ['create_requesters_faile'],
//           content: error
//       });
//   }
// }

exports.find = async (req, res) => {
  try {
    const result = await RequesterService.find(req.portal ?? req.header.portal ?? req.body.portal, req.query);

    await Logger.info(req.body.email ?? '', 'get_requesters_success');
    res.status(200).json({
        success: true,
        messages: ['get_requesters_success'],
        content: result
    });
  } catch (error) {
    console.log(error)
      await Logger.error(req.body.email ?? '', 'get_requesters_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_requesters_faile'],
          content: error
      });
  }
}

exports.findAll = async (req, res) => {
  try {
    const result = await RequesterService.findAll(req.portal ?? req.header.portal ?? req.body.portal);

    await Logger.info(req.body.email ?? '', 'get_all_requesters_success');
    res.status(200).json({
        success: true,
        messages: ['get_all_requesters_success'],
        content: result
    });
  } catch (error) {
    console.log(error)
    await Logger.error(req.body.email ?? '', 'get_all_requesters_faile');
    res.status(400).json({
        success: false,
        messages: Array.isArray(error) ? error : ['get_all_requesters_faile'],
        content: error
    });
  }
}

exports.findOne = async (req, res) => {
  try {
    const result = await RequesterService.findOne(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'get_requester_success');
    res.status(200).json({
        success: true,
        messages: ['get_requester_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_requester_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_requester_faile'],
          content: error
      });
  }
}

exports.updateAttributes = async (req, res) => {
  try {
    const result = await RequesterService.updateAttributes(req.portal ?? req.header.portal ?? req.body.portal, req.params.id, req.body);

    await Logger.info(req.body.email ?? '', 'update_requesters_success');
    res.status(200).json({
        success: true,
        messages: ['update_requesters_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'update_requesters_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['update_requesters_faile'],
          content: error
      });
  }
}

// exports.remove = async (req, res) => {
//   try {
//     const result = await RequesterService.remove(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

//     await Logger.info(req.body.email ?? '', 'remove_requesters_success');
//     res.status(200).json({
//         success: true,
//         messages: ['remove_requesters_success'],
//         content: result
//     });
//   } catch (error) {
//       await Logger.error(req.body.email ?? '', 'remove_requesters_faile');
//       res.status(400).json({
//           success: false,
//           messages: Array.isArray(error) ? error : ['remove_requesters_faile'],
//           content: error
//       });
//   }
// }

exports.getAccessibleResources = async (req, res) => {
  try {
    const resources = await RequesterService.getAccessibleResources(req.portal ?? req.header.portal ?? req.body.portal, req.params.id);

    await Logger.info(req.body.email ?? '', 'get_accessible_resources_success');
    res.status(200).json({
        success: true,
        messages: ['get_accessible_resources_success'],
        content: resources
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'get_accessible_resources_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['get_accessible_resources_faile'],
          content: error
      });
  }
}
