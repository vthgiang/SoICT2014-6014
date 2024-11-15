const BinLocationServices = require('./binLocation.service');
const Logger = require(`../../../../logs`);

exports.getBinLocations = async (req, res) => {
    try {
        const binLocations = await BinLocationServices.getBinLocations(req.query, req.portal);

        await Logger.info(req.user.email, 'GET_BIN_LOCATIONS_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bin_locations_success'],
            content: binLocations
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_BIN_LOCATIONS_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_bin_locations_failed'],
            content: error.message
        });
    }
}

exports.getChildBinLocations = async (req, res) => {
    try {
        const binLocations = await BinLocationServices.getChildBinLocations(req.query, req.portal);

        await Logger.info(req.user.email, 'GET_BIN_LOCATIONS_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bin_locations_success'],
            content: binLocations
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_BIN_LOCATIONS_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_bin_locations_failed'],
            content: error.message
        });
    }
}

exports.getDetailBinLocation = async (req, res) => {
    try {
        const binLocation = await BinLocationServices.getDetailBinLocation(req.params.id, req.portal);

        await Logger.info(req.user.email, 'GET_DETAIL_BIN_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bin_location_success'],
            content: binLocation
        })
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_DEATIL_BIN_FAILED', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_bin_location_failed'],
            content: error.message
        })
    }
}

exports.createBinLocation = async (req, res) => {
    try {
        let binLocation = await BinLocationServices.createBinLocation(req.body, req.portal);

        await Logger.info(req.user.email, 'CREATE_BIN_LOCATION_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['add_success'],
            content: binLocation
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'CREATE_BIN_LOCATION_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_faile'],
            content: error.message
        });
    }
}

exports.editBinLocation = async (req, res) => {
    try {
        let binLocation = await BinLocationServices.editBinLocation(req.params.id, req.body, req.portal);

        await Logger.info(req.user.email, 'EDIT_BIN_LOCATION_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_success'],
            content: binLocation
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'EDIT_BIN_LOCATION_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_faile'],
            content: error.message
        });
    }
}

exports.deleteBinLocation = async (req, res) => {
    try {
        let binLocation = await BinLocationServices.deleteBinLocation(req.params.id, req.portal);

        await Logger.info(req.user.email, 'DELETE_BIN_LOCATION_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: binLocation
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'DELETE_BIN_LOCATION_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_faile'],
            content: error.message
        });
    }
}

exports.deleteManyBinLocations = async (req, res) => {
    try {
        let binLocations = await BinLocationServices.deleteManyBinLocations(req.body.array, req.portal);

        await Logger.info(req.user.email, 'DELETE_BIN_LOCATION_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: binLocations
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'DELETE_BIN_LOCATION_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_faile'],
            content: error.message
        });
    }
}

exports.importBinLocations = async (req, res) => {
    try {
        const data = await BinLocationServices.importBinLocation(req.portal, req.body);
         
        await Logger.info(req.user.email, 'import_bin_location_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['import_bin_location_success'],
            content: data
        });
    } catch (error) {
        console.log('eoror', error)
        await Logger.error(req.user.email, 'import_bin_location_failure', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['import_bin_location_failure'],
            content: error
        });
    }
}

exports.getAllStockWithBinLocation = async (req, res) => {
    try {
        const stocks = await BinLocationServices.getAllStockWithBinLocation(req.query, req.portal);

        await Logger.info(req.user.email, 'GET_BIN_LOCATIONS_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bin_locations_success'],
            content: stocks
        });
    }
    catch(error) {
        await Logger.error(req.user.email, 'GET_BIN_LOCATIONS_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_bin_locations_failed'],
            content: error.message
        });
    }
}
