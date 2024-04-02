const RiskService = require('./risk.service');
const NotificationServices = require(`../../notification/notification.service`);
const Logger = require(`../../../logs`);



/**
 * Hàm lấy danh sách rủi ro
 * @param {*} req request
 * @param {*} res response 
 */
exports.getRisks = async (req, res) => {
    try {

        let risks = await RiskService.getRisks(req.portal, req.query);
        await Logger.info(req.user.email, 'get_risk_success')
        res.status(200).json({
            success: true,
            messages: ['get_risk_sucess'],
            content: risks
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' get_risk_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_fail'],
            content: error,
        });
    }
}


/**
 * Hàm lấy danh sách rủi ro theo Id
 * @param {*} req 
 * @param {*} res 
 */
exports.getRiskById = async (req, res) => {
    try {
        let risk = await RiskService.getRiskById(req.portal, req.params.id);
        await Logger.info(req.user.email, ' get_risk_by_id ', req.portal);
        res.status(200).json({
            success: true,
            message: ['get_risk_by_id_success'],
            content: risk
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_risk_by_id_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['get_risk_by_id_fail'],
            content: error,
        });
    }
}


/**
 * Hàm tạo mới một rủi ro 
 * @param {*} req 
 * @param {*} res 
 */
exports.createRisk = async (req, res) => {
    try {

        let data = await RiskService.createRisk(req.portal, req.body);
        console.log('new risk', data)
        let accountableFilter = data.accountableEmployees.filter(obj => obj._id.toString() !== req.user._id.toString());
        accountableFilter = accountableFilter.map(o => o._id);
        const associatedData = {
            dataType: "realtime_risks",
            value: data
        }
        // if (req.body.plans&&req.body.plans.length!=0) {
            // tạo nội dung khi click vào noti
            let content = `<p><strong>Bạn có rủi ro cần phê duyệt</strong><p>`
            content += `<h4>Thông tin cơ bản </h4></br>`
            content += `<p><strong>Tên rủi ro :</strong> ${data.riskName}</p>`
            content += `<p><strong>Mô tả:</strong> ${data.description}</p>`
            content += `<p><strong>Xếp hạng:</strong>${data.ranking} </p>`

            content += `<p><strong>Người đăng ký:</strong> ${data.responsibleEmployees[0].name}</p>`
            content += `<p><strong>Công việc chịu ảnh hưởng :</strong> ${data.taskRelate.map(t => t.name).join(',')}</p>`
            content += `<button id ="aprrove_risk"> Phê duyệt</button>`

            const associatedDataforAccountable = {
                "organizationalUnits": [],
                "title": "Phê duyệt rủi ro",
                "level": "general",
                "content": content,
                "sender": data.responsibleEmployees[0].name,
                "users": accountableFilter,
                "associatedData": associatedData,
                associatedDataObject: {
                    dataType: 4,
                    description: `<p><strong>${data.responsibleEmployees[0].name}</strong> đã thêm mới rủi ro, phê duyệt ngay! </p>`
                }
            };
            await NotificationServices.createNotification(req.portal, [], associatedDataforAccountable)
        // }else{
        //     console.log('co plan k can gui noti')
        // }
        await Logger.info(req.user.email, ' create_risk', req.portal);
        res.status(200).json({
            success: true,
            messages: ['add_success'],
            content: data
        })

    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' add_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['add_fail'],
            content: error,
        });
    }
}


/**
 * Hàm xóa 1 rủi ro 
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteRisk = async (req, res) => {
    try {
        let deleteRisk = await RiskService.deleteRisk(req.portal, req.params.id);
        await Logger.info(req.user.email, ' delete_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: deleteRisk,
        });
    } catch (error) {
        await Logger.error(req.user.email, ' delete_fail ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_fail'],
            content: error,
        });
    }
}


/**
 * Hàm chỉnh sửa một rủi ro
 * @param {*} req 
 * @param {*} res 
 */
exports.editRisk = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.params.id)
        let editRisk = await RiskService.editRisk(req.portal, req.params.id, req.body);
        let action = req.body.action
        if (action == 'approve') {
            // Đã áp dụng biện pháp
            if (req.body.status == "inprocess") {
                // send noti to responsibleEmp
                let receiveEmployees = editRisk.responsibleEmployees.filter(obj => obj._id.toString() !== req.user._id.toString());
                receiveEmployees = receiveEmployees.map(o => o._id);
                const associatedData = {
                    dataType: "realtime_risks",
                    value: editRisk
                }
                // tạo nội dung khi click vào noti
                let content = `<p><strong>Rủi ro bạn đăng ký đã được phê duyệt thành công</strong><p>`
                content += `<h4>Thông tin cơ bản </h4></br>`
                content += `<p><strong>Tên rủi ro :</strong> ${editRisk.riskName}</p>`
                content += `<p><strong>Mô tả:</strong> ${editRisk.description}</p>`
                content += `<p><strong>Xếp hạng:</strong>${editRisk.ranking} </p>`

                content += `<p><strong>Người đăng ký:</strong> ${editRisk.responsibleEmployees[0].name}</p>`
                content += `<p><strong>Công việc chịu ảnh hưởng :</strong> ${editRisk.taskRelate.map(t => t.name).join(',')}</p>`

                const associatedDataforAccountable = {
                    "organizationalUnits": [],
                    "title": "Phê duyệt rủi ro",
                    "level": "general",
                    "content": content,
                    "sender": editRisk.accountableEmployees[0].name,
                    "users": receiveEmployees,
                    "associatedData": associatedData,
                    associatedDataObject: {
                        dataType: 4,
                        description: `<p><strong>${editRisk.accountableEmployees[0].name}</strong> đã phê duyệt rủi ro ${editRisk._id.toString().toUpperCase()} của bạn</p>`
                    }
                };
                await NotificationServices.createNotification(req.portal, [], associatedDataforAccountable)
            }
            if (req.body.status == "finished") {
                // send noti to responsibleEmp
                let receiveEmployees = editRisk.responsibleEmployees.filter(obj => obj._id.toString() !== req.user._id.toString());
                receiveEmployees = receiveEmployees.map(o => o._id);
                const associatedData = {
                    dataType: "realtime_risks",
                    value: editRisk
                }
                // tạo nội dung khi click vào noti
                let content = `<p><strong>Rủi ro bạn đăng ký đã được phê duyệt thành công</strong><p>`
                content += `<h4>Thông tin cơ bản </h4></br>`
                content += `<p><strong>Tên rủi ro :</strong> ${editRisk.riskName}</p>`
                content += `<p><strong>Mô tả:</strong> ${editRisk.description}</p>`
                content += `<p><strong>Xếp hạng:</strong>${editRisk.ranking} </p>`

                content += `<p><strong>Người đăng ký:</strong> ${editRisk.responsibleEmployees[0].name}</p>`
                content += `<p><strong>Công việc chịu ảnh hưởng :</strong> ${editRisk.taskRelate.map(t => t.name).join(',')}</p>`

                const associatedDataforAccountable = {
                    "organizationalUnits": [],
                    "title": "Phê duyệt rủi ro",
                    "level": "general",
                    "content": content,
                    "sender": editRisk.accountableEmployees[0].name,
                    "users": receiveEmployees,
                    "associatedData": associatedData,
                    associatedDataObject: {
                        dataType: 4,
                        description: `<p><strong>${editRisk.accountableEmployees[0].name}</strong> đã đóng rủi ro ${editRisk._id.toString().toUpperCase()} của bạn</p>`
                    }
                };
                await NotificationServices.createNotification(req.portal, [], associatedDataforAccountable)
            }
        }
        await Logger.info(req.user.email, ' edit_risk_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_risk_success'],
            content: editRisk,
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' edit_risk_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_risk_faile'],
            content: error,
        });
    }
}
exports.bayesianNetworkAutoConfiguaration = async (req, res) => {
    try {
        // let autoConfig = await RiskService.bayesianNetworkAutoConfig(req.portal);
        // console.log('autoConfig',autoConfig)
        res.status(200).json({
            success: true,
            message: ['auto_config_success'],
            content: []
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: ['auto_config_failure'],
            content: error
        })
    }
}
exports.getTasksByRisk = async (req, res) => {
    try {
        let tasksByRisk = await RiskService.getTasksByRisk(req.portal, req.query);
        // console.log('tbyriskcontroller',tasksByRisk.length)
        // console.log('autoConfig',autoConfig)
        res.status(200).json({
            success: true,
            message: ['get_tasks_by_risk_success'],
            content: tasksByRisk
        })
    } catch (error) {

    }
}
exports.requestCloseRisk = async (req, res) => {
    try {
        // send noti

        let data = req.body
        console.log('data', data)
        let accountableFilter = data.accountableEmployees.filter(obj => obj._id.toString() !== req.user._id.toString());
        accountableFilter = accountableFilter.map(o => o._id);
        const associatedData = {
            dataType: "realtime_risks",
            value: data
        }
        // tạo nội dung khi click vào noti
        let content = `<p><strong>Yêu cầu đóng rủi ro</strong><p>`
        content += `<h4>Thông tin cơ bản </h4></br>`
        content += `<p><strong>Tên rủi ro :</strong> ${data.riskName}</p>`
        content += `<p><strong>Mô tả:</strong> ${data.description}</p>`
        content += `<p><strong>Xếp hạng:</strong>${data.ranking} </p>`

        content += `<p><strong>Người đăng ký:</strong> ${data.responsibleEmployees[0].name}</p>`
        content += `<p><strong>Công việc chịu ảnh hưởng :</strong> ${data.taskRelate.map(t => t.name).join(',')}</p>`

        const associatedDataforAccountable = {
            "organizationalUnits": [],
            "title": "Phê duyệt rủi ro",
            "level": "general",
            "content": content,
            "sender": data.responsibleEmployees[0].name,
            "users": accountableFilter,
            "associatedData": associatedData,
            associatedDataObject: {
                dataType: 4,
                description: `<p><strong>${data.responsibleEmployees[0].name}</strong> yêu cầu đóng rủi ro ${data._id.toString().toUpperCase()} </p>`
            }
        };
        await NotificationServices.createNotification(req.portal, [], associatedDataforAccountable)
        // change status
        data.riskStatus = "request_to_close"
        data.action = "request_to_close"
        let editRisk = await RiskService.editRisk(req.portal, data._id, data)
        await Logger.info(req.user.email, 'request_close_risk_success', req.portal);
        res.status(200).json({
            success: true,
            message: ['request_close_risk_success'],
            content: editRisk
        })
        console.log('successs')

    } catch (error) {
        console.log('error')
        res.status(400).json({
            success: false,
            message: ['request_close_risk_failure'],
            content: error
        })
    }
}
exports.getRiskPlan = async (req, res) => {
    try {
        let plans = await RiskService.getPlanByRiskInfo(req.portal, req.body)
        // let plans = await RiskService.getTasksByRisk(req.portal, req.query);
        // console.log('tbyriskcontroller',tasksByRisk.length)
        // console.log('autoConfig',autoConfig)
        res.status(200).json({
            success: true,
            message: ['get_tasks_by_risk_success'],
            content: plans
        })
    } catch (error) {

    }
}