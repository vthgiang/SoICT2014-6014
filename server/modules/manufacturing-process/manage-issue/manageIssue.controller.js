const ManagerIssuesService = require('./manageIssue.service')
const Log = require(`../../../logs`);

exports.getAllIssuesList = async (req, res) => {
    try {
        let { page, perPage, issueName } = req.query;
        let data;
        let params;
        if (page === undefined || perPage === undefined) {
            params = {
                issueName: issueName,
                page: 0,
                perPage: 10
            }
            data = await ManagerIssuesService.getAllIssuesList(params, req.portal)
        } else {
            params = {
                issueName: issueName,
                page: Number(page),
                perPage: Number(perPage)
            }
            data = await ManagerIssuesService.getAllIssuesList(params, req.portal)
        }

        await Log.info(req.user.email, "GET_ALL_ISSUE_SUCCESS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_issue_success"],
            content: data,
        });
    } catch (error) {
        await Log.info(req.user.email, "GET_ALL_ISSUE_FAILURE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_issue_fail"],
            content: error.message,
        });
    }
}

exports.getIssueReportedById = async (req, res) => {
    try {
        let {id} = req.params;
        let issueReported = await ManagerIssuesService.getIssueById(id, req.portal);
        if(issueReported !== -1) {
            await Log.info(req.user.email, "GET_ISSUE_REPORTED_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                message: ["get_issue_reported_by_id_success"],
                content: issueReported
            });
        } else {
            throw Error("Issue reported invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_ISSUE_REPORTED_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            message: ["get_reported_issue_is_fail"],
            content: error.message
        });
    }
}

exports.createIssueReported = async (req, res) => {
    try {
        const newIssue = await ManagerIssuesService.createIssueReport(req.body, req.portal);

        await Log.info(req.user.email, "CREATE_ISSUE_SUCCESS", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_issue_success"],
            content: newIssue
        });
    } catch(error) {
        await Log.error(req.user.email, "CREATE_ISSUE_ERROR", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_issue_failure"],
            content: error.message
        })
    }
}

exports.editIssueReported = async (req, res) => {
    try {
        let {id} = req.params;
        let data = req.body;
        let updatedIssueReport = await ManagerIssuesService.editIssueReport(id, data, req.portal);

        if(updatedIssueReport !== -1) {
            await Log.info(req.user.email, "UPDATED_ISSUE", req.portal);
            res.status(200).json({
                success: true,
                message: ["edit_issue_success"],
                content: updatedIssueReport
            });
        } else {
            throw Error("Issue report update fail");
        }
    } catch(error) {
        await Log.error(req.user.email, "UPDATED_ISSUE", req.portal);

        res.status(400).json({
            success: false,
            message: ["edit_issue_fail"],
            content: error.message
        });
    }
}

exports.deleteIssueReported = async (req, res) => {
    try {
        let {id} = req.params;
        let removedIssue = await ManagerIssuesService.deleteIssueReported(id, req.portal);

        if(removedIssue) {
            await Log.info(req.user.email, "REMOVED_ISSUE", req.portal);
            res.status(200).json({
                success: true,
                message: ["delete_issue_success"],
                content: removedIssue
            });
        } else {
            throw Error("Cotroller issue report delete fail");
        }
    } catch(error) {
        await Log.error(req.user.email, "REMOVED_ISSUE", req.portal);

        res.status(400).json({
            success: false,
            message: ["delete_issue_fail"],
            content: error.message
        });
    }
}