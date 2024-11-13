const AuthService = require('./auth.service');
const Logger = require(`../../../logs`);

exports.checkAuthorization = async (req, res) => {
  try {
    req.body.userAgent = req.headers['user-agent'];
    req.body.ip = req.ip;
    console.log(`Real IP Address: ${req.body.ip}`);
    console.log(`User-Agent: ${req.body.userAgent}`);

    const result = await AuthService.checkAuthorization(req.portal ?? req.header.portal ?? req.body.portal, req.body);

    await Logger.info(req.body.email ?? '', 'check_authorization_success');
    res.status(200).json({
        success: true,
        messages: ['check_authorization_success'],
        content: result
    });
  } catch (error) {
      await Logger.error(req.body.email ?? '', 'check_authorization_faile');
      res.status(400).json({
          success: false,
          messages: Array.isArray(error) ? error : ['check_authorization_faile'],
          content: error
      });
  }
}
