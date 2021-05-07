const TransportProcess = require('./transportProcess.service');
const Log = require(`../../../../logs`);

// Thêm mới một ví dụ
// exports.createTransportRequirement = async (req, res) => {
//     try {
//         const newTransportRequirement = await TransportRequirementService.createTransportRequirement(req.portal, req.body, req.user._id);

//         await Log.info(req.user.email, 'CREATED_NEW_TRANSPORT_REQUIREMENT', req.portal);

//         res.status(201).json({
//             success: true,
//             messages: ["add_success"],
//             content: newTransportRequirement
//         });
//     } catch (error) {
//         await Log.error(req.user.email, "CREATED_NEW_TRANSPORT_REQUIREMENT", req.portal);

//         res.status(400).json({
//             success: false,
//             messages: ["add_fail"],
//             content: error.message
//         })
//     }
// }

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
// exports.getExamples = async (req, res) => {
//     try {
//         data = await ExampleService.getExamples(req.portal, req.query);

//         await Log.info(req.user.email, "GET_ALL_EXAMPLES", req.portal);

//         res.status(200).json({
//             success: true,
//             messages: ["get_all_examples_success"],
//             content: data
//         });
//     } catch (error) {
//         console.log(error)
//         await Log.error(req.user.email, "GET_ALL_EXAMPLES", req.portal);

//         res.status(400).json({
//             success: false,
//             messages: ["get_all_examples_fail"],
//             content: error.message
//         });
//     }
// }

//  Lấy ra Ví dụ theo id
exports.startLocate = async (req, res) => {
    try {
        await TransportProcess.startLocate(req.portal, req.query);
        await Log.info(req.user.email, "START_LOCATE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["request_success"],
            // content: transportRequirement
        });
    } catch (error) {
        await Log.error(req.user.email, "START_LOCATE", req.portal);
        res.status(400).json({
            success: false,
            messages: ["request_success"],
            content: error.message
        });
    }
}

exports.sendCurrentLocate = async (req, res) => {
    try {
        await TransportProcess.sendCurrentLocate(req.portal, req.query);
        await Log.info(req.user.email, "SEND_CURRENT_LOCATE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["request_success"],
            // content: transportRequirement
        });
    } catch (error) {
        await Log.error(req.user.email, "SEND_CURRENT_LOCATE", req.portal);
        res.status(400).json({
            success: false,
            messages: ["request_success"],
            content: error.message
        });
    }
}
exports.stopLocate = async (req, res) => {
    try {
        await TransportProcess.stopLocate(req.portal, req.query);
        await Log.info(req.user.email, "STOP_LOCATE", req.portal);
        res.status(200).json({
            success: true,
            messages: ["request_success"],
            // content: transportRequirement
        });
    } catch (error) {
        await Log.error(req.user.email, "STOP_LOCATE", req.portal);
        res.status(400).json({
            success: false,
            messages: ["request_success"],
            content: error.message
        });
    }
}