const ContractService = require("./contract.service");

const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách các chuyên ngành */
exports.searchContract = async (req, res) => {
    try {
        let data = {};

        let params = {
            name: req.query.name,
            code: req.query.code,
            page: Number(req.query.page) ? Number(req.query.page) : 1,
            limit: Number(req.query.limit),
            startDate: req.query.startDateSearch,
            endDate: req.query.endDateSearch,
        };
    
        console.log(11, params)

        data = await ContractService.searchContract(
            req.portal,
            params,
            req.user.company._id
        );

        await Log.info(req.user.email, "GET_CONTRACT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_contract_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_CONTRACT", req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_contract_failure"],
            content: {
                error: error,
            },
        });
    }
};

/** Tạo mới chuyên ngành */
exports.createNewContract = async (req, res) => {
    try {
        data = await ContractService.createNewContract(
            req.portal,
            req.body,
            req.user.company._id
        );
        await Log.info(req.user.email, "CREATE_CONTRACT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_contract_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATE_CONTRACT", req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_contract_failure"],
            content: {
                error: error,
            },
        });
    }
};

/** Chỉnh sửa chuyên ngành */
exports.editContract = async (req, res) => {
    try {
        data = await ContractService.editContract(
            req.portal,
            req.body,
            req.params,
            req.user.company._id
        );
        await Log.info(req.user.email, "EDIT_CONTRACT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_contract_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_CONTRACT", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_contract_failure"],
            content: {
                error: error,
            },
        });
    }
};

// ====================DELETE=======================

/** Xóa chuyên ngành */
exports.deleteContract = async (req, res) => {
    try {
        data = await ContractService.deleteContract(
            req.portal,
            req.body,
            req.params.id,
            req.user.company._id
        );
        await Log.info(req.user.email, "DELETE_CONTRACT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_contract_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "DELETE_CONTRACT", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_contract_failure"],
            content: {
                error: error,
            },
        });
    }
};

// ====================UPLOAD FILE=======================

/** up file hợp đồng */
exports.uploadContractFile = async (req, res) => {
    try {
        let fileContract;
        if (req.file) {
            let path = req.file.destination + '/' + req.file.filename;
            fileContract = path.substr(1, path.length)
        }
        const contract = await ContractService.uploadContractFile(req.portal, req.params.id, fileContract);

        await Logger.info(req.user.email, 'upfile_contract_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['upfile_contract_success'],
            content: contract
        });
    } catch (error) {
        console.log("upfile error", error);
        await Logger.error(req.user.email, 'upfile_contract_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['upfile_contract_faile'],
            content: error
        });
    }
};