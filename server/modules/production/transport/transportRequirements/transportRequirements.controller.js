const TransportRequirementService = require('./transportRequirements.service');
const Log = require(`../../../../logs`);

// Thêm mới một ví dụ
exports.createTransportRequirement = async (req, res) => {
    try {
        const newTransportRequirement = await TransportRequirementService.createTransportRequirement(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_TRANSPORT_REQUIREMENT', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newTransportRequirement
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_TRANSPORT_REQUIREMENT", req.portal);

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

// //  Lấy ra Ví dụ theo id
// exports.getExampleById = async (req, res) => {
//     try {
//         let { id } = req.params;
//         let example = await ExampleService.getExampleById(req.portal, id);
//         if (example !== -1) {
//             await Log.info(req.user.email, "GET_EXAMPLE_BY_ID", req.portal);
//             res.status(200).json({
//                 success: true,
//                 messages: ["get_example_by_id_success"],
//                 content: example
//             });
//         } else {
//             throw Error("example is invalid")
//         }
//     } catch (error) {
//         await Log.error(req.user.email, "GET_EXAMPLE_BY_ID", req.portal);

//         res.status(400).json({
//             success: false,
//             messages: ["get_example_by_id_fail"],
//             content: error.message
//         });
//     }
// }

// Sửa Ví dụ
exports.editTransportRequirement = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedTransportRequirement = await TransportRequirementService.editTransportRequirement(req.portal, id, data);
        if (updatedTransportRequirement !== -1) {
            await Log.info(req.user.email, "UPDATED_TRANSPORT_REQUIREMENT", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_transport_requirement_success"],
                content: updatedTransportRequirement
            });
        } else {
            throw Error("TransportRequirement is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_TRANSPORT_REQUIREMENT", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_transport_requirement_fail"],
            content: error.message
        });
    }
}

// Xóa Ví dụ
exports.deleteTransportRequirement = async (req, res) => {
    try {
        let { id } = req.params;
        let deleteTransportRequirement = await TransportRequirementService.deleteTransportRequirement(req.portal, id);
        if (deleteTransportRequirement) {
            await Log.info(req.user.email, "DELETED_TRANSPORT_REQUIREMENT", req.portal);
            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deleteTransportRequirement
            });
        } else {
            throw Error("TransportRequirement is invalid");
        }
    } catch (error) {
        await Log.error(req.user.email, "DELETED_TRANSPORT_REQUIREMENT", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        });
    }
}

// Lấy ra tên của tất cả các Ví dụ
exports.getAllTransportRequirements = async (req, res) => {
    try {
        let data;
        data = await TransportRequirementService.getAllTransportRequirements(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_TRANSPORT_REQUIREMENTS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_TRANSPORT_REQUIREMENTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["fail"],
            content: error.message
        });
    }
}
