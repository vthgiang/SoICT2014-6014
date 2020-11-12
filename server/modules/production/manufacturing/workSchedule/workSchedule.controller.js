const Log = require(`${SERVER_LOGS_DIR}`);
const WorkScheduleService = require('./workSchedule.service');

exports.createWorkSchedule = async (req, res) => {
    try {
        let data = req.body;

        let workSchedule = await WorkScheduleService.createWorkSchedule(data, req.portal);

        await Log.info(req.user.email, "CREATE_WORK_SCHEDULE", req.portal)

        if (workSchedule == -1) {
            res.status(400).json({
                success: false,
                messages: ["is_existing"],
                content: req.body
            })
        }
        else {
            res.status(200).json({
                success: true,
                messages: ["create_successfully"],
                content: workSchedule
            })
        }

    } catch (error) {
        await Log.error(req.user.email, "CREATE_WORK_SCHEDULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.getWorkSchedules = async (req, res) => {
    try {
        let query = req.query;
        let workSchedules = await WorkScheduleService.getWorkSchedules(query, req.portal);

        await Log.info(req.user.email, "GET_WORKS_SCHEDULES", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: workSchedules
        })

    } catch (error) {
        await Log.error(req.user.email, "GET_WORKS_SCHEDULES", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        })
    }
}