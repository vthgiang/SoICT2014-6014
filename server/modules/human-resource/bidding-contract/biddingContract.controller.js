const BiddingContractService = require("./biddingContract.service");

const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách các chuyên ngành */
exports.searchBiddingContract = async (req, res) => {
    try {
        let data = {};

        let params = {
            name: req.query.name,
            code: req.query.code,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            startDate: req.query.startDateSearch,
            endDate: req.query.endDateSearch,
        };
        console.log(18, params);

        data = await BiddingContractService.searchBiddingContract(
            req.portal,
            params,
            req.user.company._id
        );

        await Log.info(req.user.email, "GET_BIDDING_CONTRACT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_contract_success"],
            content: data,
        });
    } catch (error) {
        console.log(error);
        await Log.error(req.user.email, "GET_BIDDING_CONTRACT", req.portal);
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
exports.createNewBiddingContract = async (req, res) => {
    try {
        data = await BiddingContractService.createNewBiddingContract(
            req.portal,
            req.body,
            req.files,
            req.user.company._id
        );

        await Log.info(req.user.email, "CREATE_BIDDING_CONTRACT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_contract_success"],
            content: data,
        });
    } catch (error) {
        console.log(error);
        await Log.error(req.user.email, "CREATE_BIDDING_CONTRACT", req.portal);
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
exports.editBiddingContract = async (req, res) => {
    try {
        data = await BiddingContractService.editBiddingContract(
            req.portal,
            req.body,
            req.params,
            req.files,
            req.user.company._id
        );
        await Log.info(req.user.email, "EDIT_BIDDING_CONTRACT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_contract_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_BIDDING_CONTRACT", req.portal);
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
exports.deleteBiddingContract = async (req, res) => {
    try {
        data = await BiddingContractService.deleteBiddingContract(
            req.portal,
            req.body,
            req.params.id,
            req.user.company._id
        );
        await Log.info(req.user.email, "DELETE_BIDDING_CONTRACT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_contract_success"],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, "DELETE_BIDDING_CONTRACT", req.portal);
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
exports.uploadBiddingContractFile = async (req, res) => {
    try {
        let fileBiddingContract;
        if (req.file) {
            let path = req.file.destination + '/' + req.file.filename;
            fileBiddingContract = path.substr(1, path.length)
        }
        const contract = await BiddingContractService.uploadBiddingContractFile(req.portal, req.params.id, fileContract);

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