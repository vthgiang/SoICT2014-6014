const ManufacturingWorksService = require('./manufacturingWorks.service');
const Log = require(`../../../../logs`);
const { truncateSync } = require('fs');

exports.createManufacturingWorks = async (req, res) => {
    try {
        let data = req.body;
        let manufacturingWorks = await ManufacturingWorksService.createManufacturingWorks(data, req.portal);

        await Log.info(req.user.email, "CREATED_NEW_MANUFACTURING_WORKS", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: manufacturingWorks
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_MANUFACTURING_WORKS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.getAllManufacturingWorks = async (req, res) => {
    try {
        let query = req.query;
        let allManufacturingWorks = await ManufacturingWorksService.getAllManufacturingWorks(query, req.portal);

        await Log.info(req.user.email, "GET_ALL_MANUFACTURING_WORKS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allManufacturingWorks
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_MANUFACTURING_WORKS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}

exports.getManufacturingWorksById = async (req, res) => {
    try {
        let id = req.params.id;
        let manufacturingWorks = await ManufacturingWorksService.getManufacturingWorksById(id, req.portal);

        await Log.info(req.user.email, "GET_MANUFACTURING_WORKS_BY_ID", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_successfully"],
            content: manufacturingWorks
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_MANUFACTURING_WORKS_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get__failed"],
            content: error.message
        });
    }
}

exports.deleteManufacturingWorks = async (req, res) => {
    try {
        let id = req.params.id;
        let manufacturingWorks = await ManufacturingWorksService.deleteManufacturingWorks(id, req.portal);

        await Log.info(req.user.email, "DELETE_MANUFACTURING_WORKS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["delete_successfully"],
            content: manufacturingWorks
        });
    } catch (error) {
        await Log.error(req.user.email, "DELETE_MANUFACTURING_WORKS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["delete_failed"],
            content: error.message
        });
    }
}

// Chỉnh sửa một nhà máy
exports.editManufacturingWorks = async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;
        let manufacturingWorks = await ManufacturingWorksService.editManufacturingWorks(id, data, req.portal);

        await Log.info(req.user.email, "EDIT_MANUFACTURING_WORKS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: manufacturingWorks
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_MANUFACTURING_WORKS", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.getUserByWorksManageRole = async (req, res) => {
    try {
        console.log(" vao vao vao")
        let { currentRole } = req.query;
        let employees = await ManufacturingWorksService.getUserByWorksManageRole(currentRole, req.portal);
        await Log.info(req.user.email, "GET_USER_BY_WORKS_MANAGE_ROLE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_users_successfully"],
            content: employees
        })

    } catch (error) {
        await Log.error(req.user.email, "GET_USER_BY_WORKS_MANAGE_ROLE", req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_users_failed"],
            content: error.message
        })
    }
}