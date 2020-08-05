const MaterialManagerService = require('./material.service');
const { LogInfo, LogError } = require('../../../logs');
const { error } = require('winston');

exports.getAllMaterials = async (req, res) => {
    try {
        let data;

        if(req.query.page === undefined && req.query.limit === undefined) {
            data = await MaterialManagerService.getAllMaterials(false);
        } else{
            let params = {
                materialName: req.query.materialName,
                code: req.query.code,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await MaterialManagerService.getAllMaterials(params)
        }
        await LogInfo(req.user.email, 'GET_MATERIAL', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["add"],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_MATERIAL', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["add"],
            content: {
                error: error
            }
        });
    }
}

exports.createMaterial = async (req, res) => {
    try{
        let data = await MaterialManagerService.createMaterial(req.body);
        await LogInfo(req.user.email, 'CREATE_MATERIAL', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["add_success"],
            content: data
        });
    } catch{
        await LogError(req.user.email, 'CREATE_MATERIAL', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['add_faile'],
            content: {
                error :error
            }
        });
    }
}

exports.deleteMaterial = async (req, res) => {
    try{
        let data = await MaterialManagerService.deleteMaterial(req.params.id);
        await LogInfo(req.user.email, "DELETE_MATERIAL", req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: data
        });
    } catch{
        await LogError(req.user.email, "DELETE_MATERIAL", req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_faile'],
            content: {
                error: error
            }
        })
    }
}

exports.updateMaterial = async (req, res) => {
    try{
        let data = await MaterialManagerService.updateMaterial(req.params.id, req.body);
        await LogInfo(req.user.email, "UPDATE_MATERIAL", req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_success'],
            content: data
        });
    } catch{
        await LogError(req.user.email, "UPDATE_MATERIAL", req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_faile'],
            content: {
                error: error
            }
        })
    }
}