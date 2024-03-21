const BiddingContractService = require('../services').CONTRACT;
const NotificationServices = require('../services').NOTIFICATION;
const NewsFeed = require('../services').NEWS_FEED;
const {sendEmail} = require('../helpers/emailHelper');

const Logger = require('../logs');

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

        await Logger.info(req.user.email, 'GET_BIDDING_CONTRACT', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_contract_success'],
            content: data,
        });
    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'GET_BIDDING_CONTRACT', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_contract_failure'],
            content: {
                error: error,
            },
        });
    }
};

/** Tạo mới chuyên ngành */
exports.createNewBiddingContract = async (req, res) => {
    try {
        let data = await BiddingContractService.createNewBiddingContract(
            req.portal,
            req.body,
            req.files,
            req.user.company._id
        );

        await Logger.info(req.user.email, 'CREATE_BIDDING_CONTRACT', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_contract_success'],
            content: data,
        });
    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'CREATE_BIDDING_CONTRACT', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_contract_failure'],
            content: {
                error: error,
            },
        });
    }
};

/** Chỉnh sửa chuyên ngành */
exports.editBiddingContract = async (req, res) => {
    try {
        let data = await BiddingContractService.editBiddingContract(
            req.portal,
            req.body,
            req.params,
            req.files,
            req.user.company._id
        );
        await Logger.info(req.user.email, 'EDIT_BIDDING_CONTRACT', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_contract_success'],
            content: data,
        });
    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'EDIT_BIDDING_CONTRACT', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_contract_failure'],
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
        let data = await BiddingContractService.deleteBiddingContract(
            req.portal,
            req.body,
            req.params.id,
            req.user.company._id
        );
        await Logger.info(req.user.email, 'DELETE_BIDDING_CONTRACT', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_contract_success'],
            content: data,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_BIDDING_CONTRACT', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_contract_failure'],
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
        const contract = await BiddingContractService.uploadBiddingContractFile(req.portal, req.params.id, fileBiddingContract);

        await Logger.info(req.user.email, 'upfile_contract_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['upfile_contract_success'],
            content: contract
        });
    } catch (error) {
        console.log('upfile error', error);
        await Logger.error(req.user.email, 'upfile_contract_failed', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['upfile_contract_failed'],
            content: error
        });
    }
};

exports.createProjectCpmByContract = async (req, res) => {
    try {
        let tp = await BiddingContractService.createProjectByContract(req.portal, req.params.contractId, req.body, req.user.company._id);
        const taskList = tp.tasks?.tasks;
        for (let itemTask of taskList) {
            let task = itemTask.task;
            let user = itemTask.user.filter(user => user !== req.user._id); // Lọc thông tin người tạo ra khỏi danh sách sẽ gửi thông báo

            // Gửi mail cho nhân viện tham gia công việc
            let email = itemTask.email;
            let html = itemTask.html;
            let data = {
                organizationalUnits: task.organizationalUnit._id,
                title: 'Tạo mới công việc',
                level: 'general',
                content: html,
                sender: task.organizationalUnit.name,
                users: user,
                associatedDataObject: {
                    dataType: 1,
                    value: task.priority,
                    description: `<p>${req.user.name} đã tạo mới công việc: <strong>${task.name}</strong> có sự tham gia của bạn.</p>`
                },
            };

            await NotificationServices.createNotification(req.portal, req.user.company._id, data);
            await sendEmail(email, 'Bạn có công việc mới', '', html);
            await NewsFeed.createNewsFeed(req.portal, {
                title: data?.title,
                description: data?.content,
                creator: req.user._id,
                associatedDataObject: {
                    dataType: 1,
                    value: task?._id,
                    description: task?.name
                },
                relatedUsers: data?.users
            });
        }

        await Logger.info(req.user.email, 'create_project_by_contract_success', req.portal)

        res.status(200).json({
            success: true,
            messages: ['create_project_by_contract_success'],
            content: tp
        });
    } catch (error) {
        console.log('create_project_by_contract_fail', error);
        await Logger.error(req.user.email, 'create_project_by_contract_fail', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_project_by_contract_fail'],
            content: error
        })
    }
}
