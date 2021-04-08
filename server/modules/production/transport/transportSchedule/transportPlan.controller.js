const TransportPlanService = require('./transportPlan.service');
const Log = require(`../../../../logs`);

// Thêm mới một ví dụ
exports.createTransportPlan = async (req, res) => {
    try {
        const newTransportPlan = await TransportPlanService.createTransportPlan(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_TRANSPORT_PLAN', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newTransportPlan
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_TRANSPORT_PLAN", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

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
exports.getPlanById = async (req, res) => {
    try {
        let { id } = req.params;
        let transportPlan = await TransportPlanService.getPlanById(req.portal, id);
        if (transportPlan !== -1) {
            await Log.info(req.user.email, "GET_PLAN_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                messages: ["get_plan_by_id_success"],
                content: transportPlan
            });
        } else {
            throw Error("plan is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_PLAN_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_plan_by_id_fail"],
            content: error.message
        });
    }
}

// // Sửa Ví dụ
// exports.editExample = async (req, res) => {
//     try {
//         let { id } = req.params;
//         let data = req.body;
//         let updatedExample = await ExampleService.editExample(req.portal, id, data);
//         if (updatedExample !== -1) {
//             await Log.info(req.user.email, "UPDATED_EXAMPLE", req.portal);
//             res.status(200).json({
//                 success: true,
//                 messages: ["edit_example_success"],
//                 content: updatedExample
//             });
//         } else {
//             throw Error("Example is invalid");
//         }

//     } catch (error) {
//         await Log.error(req.user.email, "UPDATED_EXAMPLE", req.portal);

//         res.status(400).json({
//             success: false,
//             messages: ["edit_example_fail"],
//             content: error.message
//         });
//     }
// }

// // Xóa Ví dụ
// exports.deleteExample = async (req, res) => {
//     try {
//         let { id } = req.params;
//         let deletedExample = await ExampleService.deleteExample(req.portal, id);
//         if (deletedExample) {
//             await Log.info(req.user.email, "DELETED_EXAMPLE", req.portal);
//             res.status(200).json({
//                 success: true,
//                 messages: ["delete_success"],
//                 content: deletedExample
//             });
//         } else {
//             throw Error("Example is invalid");
//         }
//     } catch (error) {
//         await Log.error(req.user.email, "DELETED_EXAMPLE", req.portal);
//         res.status(400).json({
//             success: false,
//             messages: ["delete_fail"],
//             content: error.message
//         });
//     }
// }

// Lấy ra tên của tất cả các Ví dụ
exports.getAllTransportPlans = async (req, res) => {
    try {
        let data;
        data = await TransportPlanService.getAllTransportPlans(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_TRANSPORT_PLANS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_TRANSPORT_PLANS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["fail"],
            content: error.message
        });
    }
}

exports.editTransportPlan = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedTransportPlan = await TransportPlanService.editTransportPlan(req.portal, id, data);
        if (updatedTransportPlan !== -1) {
            await Log.info(req.user.email, "UPDATED_TRANSPORT_PLAN", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_transport_plan_success"],
                content: updatedTransportPlan
            });
        } else {
            throw Error("TransportPlan is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_TRANSPORT_PLAN", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_transport_plan_fail"],
            content: error.message
        });
    }
}
