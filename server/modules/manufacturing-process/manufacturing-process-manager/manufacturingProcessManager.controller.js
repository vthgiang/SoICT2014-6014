const ManufacturingProcessService = require('./manufacturingProcessManager.service')
const Log = require(`../../../logs`);

exports.getAllManufacturingProcess = async (req, res) => {
    try {
        let {page, perPage, processName} = req.query;
        let data;
        let params;
        if(page === undefined || perPage === undefined) {
            params = {
                processName: processName,
                page: 0,
                perPage: 10
            }
            data = await ManufacturingProcessService.getAllManufacturingProcess(params, req.portal)
        } else {
            params = {
                processName: processName,
                page: Number(page),
                perPage: Number(perPage)
            }
            data = await ManufacturingProcessService.getAllManufacturingProcess(params, req.portal)
        }

        await Log.info(req.user.email, "GET_ALL_PRODUCTION_PROCESS_SUCCESS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_production_process_success"],
            content: data,
        });
    } catch(error) {
        await Log.info(req.user.email, "GET_ALL_PRODUCTION_PROCESS_FAILURE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_production_process_fail"],
            content: error.message,
        });
    }
}

exports.getManufacturingProcessById = async (req, res) => {
    try {
        let {id} = req.params;
        let manufacturingProcess = await ManufacturingProcessService.getManufacturingProcessById(id, req.portal);
        if(manufacturingProcess !== -1) {
            await Log.info(req.user.email, "GET_MANUFACTURING_PROCESS_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                message: ["get_manufacturing_process_is_success"],
                content: manufacturingProcess
            });
        } else {
            throw Error("manufacturing process is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_MANUFACTURING_PROCESS_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            message: ["get_manufacturing_procss_is_fail"],
            content: error.message
        });
    }
}

exports.createManufacturingProcess = async (req, res) => {
    try {
        const newProcess = await ManufacturingProcessService.createManufacturingProcess(req.body, req.portal);

        await Log.info(req.user.email, "CREATE_MANUFACTURING_PROCESS_SUCCESS", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_manufacturing_process_success"],
            content: newProcess
        });
    } catch(error) {
        await Log.error(req.user.email, "CREATE_MANUFACTURING_PROCESS_ERROR", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_manufacturing_process_failure"],
            content: error.message
        })
    }
}

exports.editManufacturingProcess = async (req, res) => {
    try {
        let {id} = req.params;
        let data = req.body;
        let updatedProcess = await ManufacturingProcessService.editManufacturingProcess(id, data, req.portal);

        if(updatedProcess !== -1) {
            await Log.info(req.user.email, "UPDATED_MANUFACTURING", req.portal);
            res.status(200).json({
                success: true,
                message: ["edit_manufacturing_success"],
                content: updatedProcess
            });
        } else {
            throw Error("Manufacturing process update fail");
        }
    } catch(error) {
        await Log.error(req.user.email, "UPDATED_MANUFACTURING", req.portal);

        res.status(400).json({
            success: false,
            message: ["edit_manufacturing_fail"],
            content: error.message
        });
    }
}

exports.deleteManufacturingProcess = async (req, res) => {
    try {
        let {id} = req.params;
        let removed = await ManufacturingProcessService.deleteManufacturingProcess(id, req.portal);

        if(removed) {
            await Log.info(req.user.email, "REMOVED_MANUFACTURING_PROCESS", req.portal);
            res.status(200).json({
                success: true,
                message: ["delete_manufacturing_process_success"],
                content: removed
            });
        } else {
            throw Error("Cotroller manufacturing process delete fail");
        }
    } catch(error) {
        await Log.error(req.user.email, "REMOVED_MANUFACTURING_PROCESS", req.portal);

        res.status(400).json({
            success: false,
            message: ["delete_manufacturing_process_failure"],
            content: error.message
        });
    }
}