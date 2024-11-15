const GoodService = require('./good.service');
const Logger = require(`../../../../logs`);

exports.getGoodsByType = async (req, res) => {
    try {
        const goodsByType = await GoodService.getGoodsByType(req.user.company._id, req.query, req.portal);
        await Logger.info(req.user.email, 'GET_GOOS_BY_TYPE_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: goodsByType
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_GOODS_BY_TYPE_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_good_failed'],
            content: error.message
        });
    }
}

exports.getAllGoodsByType = async (req, res) => {
    try {
        const goodsByType = await GoodService.getAllGoodsByType(req.query, req.portal);
        await Logger.info(req.user.email, 'GET_GOOS_BY_TYPE_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: goodsByType
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_GOODS_BY_TYPE_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_good_failed'],
            content: error.message
        });
    }
}

exports.getAllGoodsByCategory = async (req, res) => {
    try {
        const goodsByCategory = await GoodService.getAllGoodsByCategory(req.user.company._id, req.params.id, req.portal);
        await Logger.info(req.user.email, 'GET_GOOS_BY_TYPE_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: goodsByCategory
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_GOODS_BY_TYPE_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_good_failed'],
            content: error.message
        });
    }
}

exports.createGoodByType = async (req, res) => {
    try {
        let good = await GoodService.createGoodByType(req.user.company._id, req.body, req.portal);

        await Logger.info(req.user.email, 'CREATE_GOOD', req.portal);
        res.status(200).json({
            success: true,
            messages: ['add_success'],
            content: good
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'CREATE_GOOD', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_faile'],
            content: error.message
        })
    }
}

exports.editGood = async (req, res) => {
    try {
        let good = await GoodService.editGood(req.params.id, req.body, req.portal);
        await Logger.info(req.user.email, 'EDIT_GOOD', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_success'],
            content: good
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'EDIT_GOOD', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_faile'],
            content: error.message
        })
    }
}

exports.deleteGood = async (req, res) => {
    try {
        const good = await GoodService.deleteGood(req.params.id, req.portal);

        await Logger.info(req.user.email, 'DELETE_GOOD', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: good
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'DELETE_GOOD', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_faile'],
            content: error.message
        })
    }
}

exports.getGoodDetail = async (req, res) => {
    try {
        const good = await GoodService.getGoodDetail(req.params.id, req.portal);

        await Logger.info(req.user.email, 'GET_GOOD_DETAIL', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: good
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_GOOD_DETAIL', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_good_failed'],
            content: error.message
        })
    }
}

exports.getAllGoods = async (req, res) => {
    try {
        const good = await GoodService.getAllGoods(req.user.company._id, req.portal);

        await Logger.info(req.user.email, 'GET_ALL_GOOD_', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: good
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_ALL_GOOD', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_good_failed'],
            content: error.message
        })
    }
}

exports.getGoodByManageWorksRole = async (req, res) => {
    try {
        const roleId = req.params.id;
        const goods = await GoodService.getGoodByManageWorksRole(roleId, req.portal);
        await Logger.info(req.user.email, 'GET_ALL_GOOD_BY_MANAGE_WORK_ROLE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: goods
        })

    } catch (error) {
        await Logger.error(req.user.email, 'GET_ALL_GOOD_BY_MANAGE_WORK_ROLE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_good_failed'],
            content: error.message
        })
    }
}

exports.getManufacturingWorksByProductId = async (req, res) => {
    try {
        const productId = req.params.id;
        const manufacturingWorks = await GoodService.getManufacturingWorksByProductId(productId, req.portal);
        await Logger.info(req.user.email, 'GET_WORKS_BY_PRODUCT_ID', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_works_success'],
            content: manufacturingWorks
        })
    } catch (error) {
        await Logger.error(req.user.email, 'GET_WORKS_BY_PRODUCT_ID', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_works_failed'],
            content: error.message
        })
    }
}

exports.numberGoods = async (req, res) => {
    try {
        let numberGoods = await GoodService.numberGoods(req.portal);
        await Logger.info(req.user.email, 'GET_GOOD', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_success'],
            content: numberGoods
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_GOOD', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_faile'],
            content: error.message
        })
    }
}

exports.importGoods = async (req, res) => {
    try {
        const data = await GoodService.importGood(req.portal, req.body);
         
        await Logger.info(req.user.email, 'import_good_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['import_good_success'],
            content: data
        });
    } catch (error) {
        console.log('eoror', error)
        await Logger.error(req.user.email, 'import_good_failure', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['import_good_failure'],
            content: error
        });
    }
}
