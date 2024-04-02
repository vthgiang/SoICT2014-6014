const RiskResponsePlanRequestService = require('./request.service');
const NotificationServices = require(`../../notification/notification.service`);
const Logger = require(`../../../logs`);

exports.getRiskResponsePlanRequests = async (req, res) => {
    try {
        let riskResponsePlans = await RiskResponsePlanRequestService.getRiskResponsePlanRequests(req.portal, req.query)
        // console.log(riskResponsePlans)
        await Logger.info(req.user.email, 'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_response_success'],
            content: riskResponsePlans
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_response_failure ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_response_failure'],
            content: error,
        });
    }
}
exports.createRiskResponsePlanRequest = async (req, res) => {
    try {
        let riskResponsePlan = await RiskResponsePlanRequestService.createRiskResponsePlanRequest(req.portal, req.body)
        let data = riskResponsePlan
        console.log(data)
        let receiveEmployees = data.receiveEmployees.filter(user => user._id !== req.user._id).map(u => u._id)
        console.log('receive notice emp', receiveEmployees)
        const associatedData = {
            dataType: "change_request",
            value: data
        }
        // tạo nội dung khi click vào noti
        let content = `<p><strong>Yêu cầu thay đổi quy trình</strong><p>`
        // content += `<h4>Thông tin cơ bản </h4></br>`
        // content += `<p><strong>Quy trình :</strong> ${data.process}</p>`
        // content += `<p><strong>Mô tả:</strong> ${data.description}</p>`
        // content += `<p><strong>Xếp hạng:</strong>${data.ranking} </p>`

        // content += `<p><strong>Người đăng ký:</strong> ${data.responsibleEmployees[0].name}</p>`
        // content += `<p><strong>Công việc chịu ảnh hưởng :</strong> ${data.taskRelate.map(t => t.name).join(',')}</p>`
        // console.log(data)
        const sendData = {
            "organizationalUnits": [],
            "title": "Yêu cầu thay đổi",
            "level": "general",
            "content": content,
            "sender": data.sendEmployee.name,
            "users": receiveEmployees,
            "associatedData": associatedData,
            associatedDataObject: {
                dataType: 4,
                description: `<p><strong>${data.sendEmployee.name}</strong> yêu cầu thay đổi quy trình #${data.process._id.toString().toUpperCase()} </p>`
            }
        };
        await NotificationServices.createNotification(req.portal, [], sendData)
        await Logger.info(req.user.email, 'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['request_success'],
            content: riskResponsePlan
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_response_failure ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_response_failure'],
            content: error,
        });
    }
}
exports.editRiskResponsePlanRequest = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.params.id)
        let editRiskResponsePlanRequest = await RiskResponsePlanRequestService.editRiskResponsePlanRequest(req.portal, req.params.id, req.body)
        // console.log(editRisk)
        let action = req.body.action
        let data = editRiskResponsePlanRequest
        let str = "edit_success"
        // console.log(data)
        if (action == 'approve') {
            // send noti
            // let receiveEmployees = editRiskResponsePlanRequest.receiveEmployees.filter(user => user._id !== req.user._id).map(u => u._id)
            // console.log('receive notice emp', receiveEmployees)
            const associatedData = {
                dataType: "change_request",
                value: data
            }
            // tạo nội dung khi click vào noti
            let content = `<p><strong>Yêu cầu thay đổi quy trình</strong><p>`
            console.log(data.approveData)
            let approveEmployee = data.receiveEmployees.find(r => r._id == data.approveData.approveEmployee.toString())
            const sendData = {
                "organizationalUnits": [],
                "title": "Phê duyệt quy trình",
                "level": "general",
                "content": content,
                "sender": req.user.name,
                "users": [data.sendEmployee._id],
                "associatedData": associatedData,
                associatedDataObject: {
                    dataType: 4,
                    description: `<p><strong>${approveEmployee.name}</strong> đã phê duyệt yêu cầu thay đổi quy trình #${data.process._id.toString().toUpperCase()} </p>`
                }
            };
            await NotificationServices.createNotification(req.portal, [], sendData)
            str = "approve_success"

        }
        await Logger.info(req.user.email, str, req.portal);
        res.status(200).json({
            success: true,
            messages: [str],
            content: editRiskResponsePlanRequest,
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, 'edit_risk_response_plan_failure', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_risk_response_plan_failure'],
            content: error,
        });
    }
}
exports.deleteRiskResponsePlanRequest = async (req, res) => {
    try {
        let riskResponsePlan = await RiskResponsePlanRequestService.deleteRiskResponsePlanRequest(req.portal, req.params.id)
        await Logger.info(req.user.email, 'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_response_success'],
            content: riskResponsePlan
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_response_failure ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_response_failure'],
            content: error,
        });
    }
}