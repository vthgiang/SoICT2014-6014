const { SystemApiPrivilegeServices } = require('./privilegeSystemApi.service');
const Logger = require(`../../../../logs`);
const { Role, User } = require('../../../../models');
const { connect } = require(`../../../../helpers/dbHelper`);

const getPrivilegeApis = async (req, res) => {
    try {
        const data = await SystemApiPrivilegeServices.getPrivilegeApis(req.portal, req.query);

        Logger.info(req.user.email, 'get privilege api');
        res.status(200).json({
            success: true,
            messages: ['get_privilege_api_success'],
            content: data
        });
    } catch (error) {
        Logger.error(req.user.email, 'get privilege api');

        res.status(400).json({
            success: false,
            messages: ['get_privilege_api_failure'],
            content: error
        });
    }
};


const createPrivilegeApi = async (req, res) => {
    /**
     * Nếu request là ủy quyền API cho cá nhân (status = 3) && người ủy quyền là Admin
     * thì phải kiểm tra xem cá nhân đó có nằm trong thẩm quyền được phân quyền hay không
     * cụ thể là người đó có cùng công ty với Admin hay không
     * 
     * System admin thì có thể ủy quyền tùy ý, không cần phải kiểm soát
     */
    if (req.body.status === 3) {
        // lấy ra role của người phân quyền
        const role = await Role(connect(DB_CONNECTION, req.portal))
            .findById(req.currentRole); //current role của người dùng

        if (role.name !== "System Admin") {
            const user = await User(
                connect(DB_CONNECTION, req.portal)
            ).findOne({ email: req.body.email })

            if (!user) {
                throw {
                    messages: "Bad request: no user are found in your organization",
                };
            }
        }
    }

    try {
        let data = {
            ...req.body,
            userId: req.user._id,
        }

        const privilegeApi = await SystemApiPrivilegeServices.createPrivilegeApi(data, req.user);

        Logger.info(req.user.email, 'create privilege api');
        res.status(200).json({
            success: true,
            messages: ['create_privilege_api_success'],
            content: privilegeApi
        });
    } catch (error) {
        console.log(error)
        let messages = error?.messages === 'company_not_exist' || error?.messages === 'privilege_api_exist' ?
            [error?.messages] : ['create_privilege_api_failure']

        Logger.error(req.user.email, 'create privilege api');
        res.status(400).json({
            success: false,
            messages: messages,
            content: error
        });
    }
}

const editPrivilegeApi = async (req, res) => {
    if (req.body.type === 'update_status') {
        await updateStatusPrivilegeApi(req, res)
    }
}

const updateStatusPrivilegeApi = async (req, res) => {
    try {
        const privilegeApi = await SystemApiPrivilegeServices.updateStatusPrivilegeApi(req.portal, req.body);

        Logger.info(req.user.email, 'update status privilege api');
        res.status(200).json({
            success: true,
            messages: ['update_status_privilege_api_success'],
            content: privilegeApi
        });
    } catch (error) {
        console.log(error)
        Logger.error(req.user.email, 'update status privilege api');
        res.status(400).json({
            success: false,
            messages: ['update_status_privilege_api_failure'],
            content: error
        });
    }
}

const deletePrivilegeApis = async (req, res) => {
    try {
        const privilegeApis = await SystemApiPrivilegeServices.deletePrivilegeApis(req.portal, req.body);

        Logger.info(req.user.email, 'delete privilege api');
        res.status(200).json({
            success: true,
            messages: ['delete_privilege_api_success'],
            content: privilegeApis
        });
    } catch (error) {
        console.log(error)
        Logger.error(req.user.email, 'delete privilege api');
        res.status(400).json({
            success: false,
            messages: ['delete_privilege_api_failure'],
            content: error
        });
    }
}

exports.SystemApiPrivilegeControllers = {
    getPrivilegeApis,
    createPrivilegeApi,
    editPrivilegeApi,
    deletePrivilegeApis,
}
