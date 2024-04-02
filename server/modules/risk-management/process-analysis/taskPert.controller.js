const TaskPertService = require('./taskPert.service')
const Logger = require(`../../../logs`);
const NotificationServices = require(`../../notification/notification.service`);
exports.countTask = async (req, res) => {
    try {
        let result = await TaskPertService.countTask(req.portal, req.query);

        await Logger.info(req.user.email, 'count_task')
        res.status(200).json({
            success: true,
            messages: ['count_task_sucess'],
            content: result
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' count_task_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['count_task_fail'],
            content: error,
        });
    }
}
exports.update = async (req, res) => {
    try {
        console.log('query', req.query)
        let process = req.query.process

        let result = await TaskPertService.update(req.portal, process);
        await Logger.info(req.user.email, 'update')
        res.status(200).json({
            success: true,
            messages: ['update_sucess'],
            content: result
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' update_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['update_fail'],
            content: error,
        });
    }
}
exports.updateList = async (req, res) => {
    try {
        console.log('body', req.body)
        let processList = req.body.processList
        // let process = req.query.process

        let result = await TaskPertService.updateList(req.portal, processList);
        await Logger.info(req.user.email, 'update')
        res.status(200).json({
            success: true,
            messages: ['update_sucess'],
            content: result
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' update_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['update_fail'],
            content: error,
        });
    }
}
exports.changeTime = async(req,res) =>{
    try {
       
        let result = await TaskPertService.changeTime(req.portal, req.body);
        await Logger.info(req.user.email, 'change_success')
        res.status(200).json({
            success: true,
            messages: ['change_success'],
            content: result
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, 'fail', req.portal);
        res.status(404).json({
            success: false,
            messages: ['fail'],
            content: error,
        });
    }
}
exports.closeProcess = async (req, res) => {
    try {
        // console.log('closeProcess', req.body)
        let process = req.body
        

        let result = await TaskPertService.closeProcess(req.portal, process);
        // console.log(result.status)
        let data = result
        console.log('result close ', data._id)
        let receiveUsers = data.manager.concat(data.viewer)
        // receiveUsers = receiveUsers.filter(obj => obj.toString() !== req.user._id.toString());
        console.log('revices',receiveUsers)
        // receiveUsers = receiveUsers.map(o => o._id);
        const associatedData = {
            dataType: "realtime_close_task_process",
            value: data
        }
        // tạo nội dung khi click vào noti
        let content = `<p><strong>Kết thúc quy trình</strong><p>`
        
       

        const associatedDataforAccountable = {
            "organizationalUnits": [],
            "title": "Phê duyệt rủi ro",
            "level": "general",
            "content": content,
            "sender": req.user.name,
            "users": receiveUsers,
            "associatedData": associatedData,
            associatedDataObject: {
                dataType: 1,
                description: `<p><strong>${req.user.name}</strong> Đã kết thúc quy trình #${data._id.toString().toUpperCase()} </p>`
            }
        };
        await NotificationServices.createNotification(req.portal, [], associatedDataforAccountable)
        await Logger.info(req.user.email, 'update')
        res.status(200).json({
            success: true,
            messages: ['update_sucess'],
            content: result
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, ' update_fail ', req.portal);
        res.status(404).json({
            success: false,
            messages: ['update_fail'],
            content: error,
        });
    }
}