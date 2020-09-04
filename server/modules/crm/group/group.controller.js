const GroupServices = require('./group.service');
const { LogInfo, LogError } = require(SERVER_LOGS_DIR);

exports.getGroups = async(req, res) => {
    try {
        const groups = await GroupServices.getGroups(req.user.company._id, req.query);

        // LogInfo(req.user.email, 'GET_CUSTOMERS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_groups_success'],
            content: groups
        });
    } catch (error) {
        console.log(error)
        // LogError(req.user.email, 'GET_CUSTOMERS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_groups_faile'],
            content: error
        })
    }
};

exports.getGroup = async(req, res) => {
    try {
        const group = await GroupServices.getGroup(req.params.id);

        // LogInfo(req.user.email, 'GET_CUSTOMERS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_group_success'],
            content: group
        });
    } catch (error) {

        // LogError(req.user.email, 'GET_CUSTOMERS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_group_faile'],
            content: error
        })
    }
};

exports.createGroup = async(req, res) => {
    try {
        const groups = await GroupServices.createGroup({...req.body, company: req.user.company._id});

        // LogInfo(req.user.email, 'GET_CUSTOMERS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_groups_success'],
            content: groups
        });
    } catch (error) {

        // LogError(req.user.email, 'GET_CUSTOMERS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_groups_faile'],
            content: error
        })
    }
};

exports.deleteGroup = async(req, res) => {
    try {
        const group = await GroupServices.deleteGroup(req.params.id);

        // LogInfo(req.user.email, 'GET_CUSTOMERS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_groups_success'],
            content: group
        });
    } catch (error) {

        // LogError(req.user.email, 'GET_CUSTOMERS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_groups_faile'],
            content: error
        })
    }
};