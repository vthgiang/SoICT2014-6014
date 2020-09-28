const ModuleConfigurationService = require('./moduleConfiguration.service');
const Log = require(`${SERVER_LOGS_DIR}/_multi-tenant`);


// Lấy thông tin cấu hình module quản lý nhân sự
exports.getHumanResourceConfiguration = async (req, res) => {
    try {
        let config = await ModuleConfigurationService.getHumanResourceConfiguration(req.portal);

        await Log.info(req.user.email, 'GET_HUMANRESOURCE_CONFIGURATION', req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_human_resource_configuration_success"],
            content: config
        });
    } catch (error) {
        await Log.info(req.user.email, 'GET_HUMANRESOURCE_CONFIGURATION', req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_human_resource_configuration_faile"],
            content: {
                error: error
            }
        });
    }
};