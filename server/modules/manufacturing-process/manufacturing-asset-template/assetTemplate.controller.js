const assetTemplateService = require('./assetTemplate.service')
const Log = require(`../../../logs`);

exports.getAssetTemplateById = async (req, res) => {
    try {
        let {id} = req.params;
        let assetTemplate = await assetTemplateService.getAssetTemplateId(id, req.portal);
        if(assetTemplate !== -1) {
            await Log.info(req.user.email, "GET_ASSET_TEMPLATE_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                message: ["get_asset_template_is_success"],
                content: assetTemplate
            });
        } else {
            throw Error("asset template is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_ASSET_TEMPLATE_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            message: ["get_asset_template_is_fail"],
            content: error.message
        });
    }
}

exports.getAllAssetTemplate = async (req, res) => {
    try {
        let {page, perPage, assetName} = req.query;
        let data;
        let params;
        if(page === undefined || perPage === undefined) {
            params = {
                assetName: assetName,
                page: 0,
                perPage: 10
            }
            data = await assetTemplateService.getAllAssetTemplate(params, req.portal)
        } else {
            params = {
                assetName: assetName,
                page: Number(page),
                perPage: Number(perPage)
            }
            data = await assetTemplateService.getAllAssetTemplate(params, req.portal)
        }

        await Log.info(req.user.email, "GET_ALL_ASSET_TEMPLATE_SUCCESS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_asset_template_success"],
            content: data,
        });
    } catch(error) {
        await Log.info(req.user.email, "GET_ALL_ASSET_TEMPLATE_FAILURE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_asset_template_fail"],
            content: error.message,
        });
    }
}

exports.createAssetTemplate = async (req, res) => {
    try {
        const newAssetTemplate = await assetTemplateService.createAssetTemplate(req.body, req.portal);

        await Log.info(req.user.email, "CREATE_ASSET_TEMPLATE_SUCCESS", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_asset_template_success"],
            content: newAssetTemplate
        });
    } catch(error) {
        await Log.error(req.user.email, "CREATE_ASSET_TEMPLATE_SUCCESS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_asset_template_failure"],
            content: error.message
        })
    }
}