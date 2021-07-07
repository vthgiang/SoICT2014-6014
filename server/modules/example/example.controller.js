const ExampleService = require('./example.service');
const Log = require(`../../logs`);

// Thêm mới một ví dụ
exports.createExample = async (req, res) => {
    try {
        const newExample = await ExampleService.createExample(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_EXAMPLE', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newExample
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_EXAMPLE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getExamples = async (req, res) => {
    try {
        data = await ExampleService.getExamples(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_EXAMPLES", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_examples_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_EXAMPLES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_examples_fail"],
            content: error.message
        });
    }
}

//  Lấy ra Ví dụ theo id
exports.getExampleById = async (req, res) => {
    try {
        let { id } = req.params;
        let example = await ExampleService.getExampleById(req.portal, id);
        if (example !== -1) {
            await Log.info(req.user.email, "GET_EXAMPLE_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                messages: ["get_example_by_id_success"],
                content: example
            });
        } else {
            throw Error("example is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_EXAMPLE_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_example_by_id_fail"],
            content: error.message
        });
    }
}

// Sửa Ví dụ
exports.editExample = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedExample = await ExampleService.editExample(req.portal, id, data);
        if (updatedExample !== -1) {
            await Log.info(req.user.email, "UPDATED_EXAMPLE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_example_success"],
                content: updatedExample
            });
        } else {
            throw Error("Example is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_EXAMPLE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_example_fail"],
            content: error.message
        });
    }
}

// Xóa Ví dụ
exports.deleteExamples = async (req, res) => {
    try {
        let deletedExample = await ExampleService.deleteExamples(req.portal, req.body.exampleIds);
        if (deletedExample) {
            await Log.info(req.user.email, "DELETED_EXAMPLE", req.portal);
            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deletedExample
            });
        } else {
            throw Error("Example is invalid");
        }
    } catch (error) {
        await Log.error(req.user.email, "DELETED_EXAMPLE", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        });
    }
}

// Lấy ra tên của tất cả các Ví dụ
exports.getOnlyExampleName = async (req, res) => {
    try {
        let data;
        data = await ExampleService.getOnlyExampleName(req.portal, req.query);

        await Log.info(req.user.email, "GET_ONLY_NAME_ALL_EXAMPLES", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_only_name_all_examples_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ONLY_NAME_ALL_EXAMPLES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_only_name_all_examples_fail"],
            content: error.message
        });
    }
}
