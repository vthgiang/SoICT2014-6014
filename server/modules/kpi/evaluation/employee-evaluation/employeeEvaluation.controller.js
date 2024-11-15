const KPIMemberService = require('./employeeEvaluation.service');
const overviewService = require('../../employee/management/management.service')
const EmployeeKpiSetService = require('../../employee/creation/creation.service')

const Logger = require(`../../../../logs`);

const { getDataEmployeeKpiSetLog } = require('../../../../helpers/descriptionLogKpi')

/**
 * lấy tất cả kpi nhân viên
 */

exports.getEmployeeKPISets = async (req, res) => {
    if (req.query.userId && req.query.date) {
        getKpisByMonth(req, res);
    }
    else if (req.query.listkpis) {
        getTasksByListKpiSet(req, res)
    }
    else {
        try {
            const kpimembers = await KPIMemberService.getEmployeeKPISets(req.portal, req.query);
            await Logger.info(req.user.emai, `Get kpi all member`, req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_all_kpi_member_success'],
                content: kpimembers
            });
        } catch (error) {
            await Logger.error(req.user.emai, `Get kpi all  member`, req.portal);
            res.status(400).json({
                messages: ['get_all_kpi_member_fail'],
                content: error
            });
        }
    }
};

/**
 * Lấy kpi cá nhân theo id 
 */

exports.getKpisByKpiSetId = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getKpisByKpiSetId(req.portal, req.params.id);
        await Logger.info(req.user.email, `Get kpi member by id`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_by_id_success'],
            content: kpimembers
        });
    } catch (error) {
        await Logger.error(req.user.email, `Get kpi member by id`, req.portal);
        res.status(400).json({
            messages: ['get_all_kpi_member_by_id_fail'],
            message: error
        });
    }
}

/**
 * Lấy KPI cá nhân theo tháng 
 */
getKpisByMonth = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getKpisByMonth(req.portal, req.query);
        await Logger.info(req.user.email, `Get kpi member by month`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_by_month_success'],
            content: kpimembers
        });
    } catch (error) {
        await Logger.error(req.user.email, `Get kpi member by month`, req.portal);
        res.status(400).json({
            messages: ['get_all_kpi_member_by_month_fail'],
            message: error
        });
    }
};

/**
 * Phê duyệt tất cả mục tiêu của KPI req.params.id
 */

exports.approveAllKpis = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.approveAllKpis(req.portal, req.params.id, req.user.company._id);

        // Thêm log
        let log = getDataEmployeeKpiSetLog({
            type: "approval_all",
            creator: req.user._id,
            organizationalUnit: kpimembers?.organizationalUnit,
            employee: kpimembers?.creator,
            month: kpimembers?.date,
            newData: kpimembers
        })
        await overviewService.createEmployeeKpiSetLogs(req.portal, {
            ...log,
            employeeKpiSetId: kpimembers?._id
        })

        // Thêm newsfeed
        await EmployeeKpiSetService.createNewsFeedForEmployeeKpiSet(req.portal, {
            ...log,
            organizationalUnit: kpimembers?.organizationalUnit,
            employeeKpiSet: kpimembers
        });

        await Logger.info(req.user.email, `Approve all target`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['approve_all_kpi_target_success'],
            content: kpimembers
        });
    } catch (error) {
        await Logger.error(req.user.email, `Approve all target`, req.portal);
        res.status(400).json({
            messages: ['approve_all_kpi_target_fail'],
            message: error
        });
    }
}

/**
 * Chỉnh sửa mục tiêu của kpi cá nhân
 */

exports.editKpi = async (req, res) => {
    if (Object.keys(req.body).length === 0) this.approveAllKpis(req, res);
    else {
        try {
            const data = await KPIMemberService.editKpi(req.portal, req.params.id, req.body);

            // Thêm logs
            let log = getDataEmployeeKpiSetLog({
                type: "edit_kpi",
                creator: req.user._id,
                organizationalUnit: data?.employeeKpiSet?.organizationalUnit,
                employee: data?.employeeKpiSet?.creator,
                month: data?.employeeKpiSet?.date,
                newData: data?.target
            })
            await overviewService.createEmployeeKpiSetLogs(req.portal, {
                ...log,
                employeeKpiSetId: data?.employeeKpiSet?._id
            })

            // THêm newsfeed
            await EmployeeKpiSetService.createNewsFeedForEmployeeKpiSet(req.portal, {
                ...log,
                organizationalUnit: data?.employeeKpiSet?.organizationalUnit,
                employeeKpiSet: data?.employeeKpiSet
            });

            await Logger.info(req.user.email, `Edit target member`, req.portal);
            res.status(200).json({
                success: true,
                messages: ['edit_kpi_target_member_success'],
                content: data?.target
            });
        } catch (error) {
            await Logger.error(req.user.email, `Edit target member`, req.portal);
            res.status(400).json({
                messages: ['edit_kpi_target_member_fail'],
                message: error
            });
        }
    }
}

/**
 * Chỉnh sửa từng mục tiêu của KPI req.params.id  status: req.params.status
 */

exports.editStatusKpi = async (req, res) => {
    try {
        const data = await KPIMemberService.editStatusKpi(req.portal, req.params, req.query, req.user.company._id);

        // Thêm log
        let log = getDataEmployeeKpiSetLog({
            type: "edit_status_kpi",
            creator: req.user._id,
            organizationalUnit: data?.kpimembers?.organizationalUnit,
            employee: data?.kpimembers?.creator,
            month: data?.kpimembers?.date,
            newData: data?.target
        })
        await overviewService.createEmployeeKpiSetLogs(req.portal, {
            ...log,
            employeeKpiSetId: data?.kpimembers?._id
        })

        // Thêm newsfeed
        await EmployeeKpiSetService.createNewsFeedForEmployeeKpiSet(req.portal, {
            ...log,
            organizationalUnit: data?.kpimembers?.organizationalUnit,
            employeeKpiSet: data?.kpimembers
        });

        await Logger.info(req.user.email, `Edit status target`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_status_target_success'],
            content: data?.kpimembers
        });
    } catch (error) {
        await Logger.error(req.user.email, `Edit status target`, req.portal);
        res.status(400).json({
            messages: ['edit_status_target_fail'],
            message: error
        });
    }
}

/**
 * Lấy danh sách công việc theo kpiId
 */
exports.getTasksByKpiId = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getTasksByKpiId(req.portal, req.query);
        await Logger.info(req.user.email, `Get task by Id`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_by_id_success'],
            content: kpimembers
        });
    } catch (error) {
        await Logger.error(req.user.email, `Get task by Id`, req.portal);
        res.status(400).json({
            messages: ['get_task_by_id_fail'],
            message: error
        });
    }
}

/**
 * Lấy danh sách công việc theo list kpi set
 */
getTasksByListKpiSet = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getTasksByListKpis(req.portal, req.query.listkpis);

        await Logger.info(req.user.email, `Get task by kpi set`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_by_list_kpi_set_success'],
            content: kpimembers
        });
    } catch (error) {
        await Logger.error(req.user.email, `Get task by kpi set`, req.portal);
        res.status(400).json({
            messages: ['get_task_by_list_kpi_set_fail'],
            message: error
        });
    }
}
/**
 * cập nhật điểm level
 */

exports.setTaskImportanceLevel = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.setTaskImportanceLevel(req.portal, req.params.id, req.query.kpiType, req.body);

        // Thêm log
        let log = getDataEmployeeKpiSetLog({
            type: "set_point_kpi",
            creator: req.user._id,
            organizationalUnit: kpimembers?.updateKpiSet?.organizationalUnit,
            employee: kpimembers?.updateKpiSet?.creator,
            month: kpimembers?.updateKpiSet?.date,
            newData: kpimembers?.result
        })
        await overviewService.createEmployeeKpiSetLogs(req.portal, {
            ...log,
            employeeKpiSetId: kpimembers?.updateKpiSet?._id
        })

        // Thêm newsfeed
        await EmployeeKpiSetService.createNewsFeedForEmployeeKpiSet(req.portal, {
            ...log,
            organizationalUnit: kpimembers?.updateKpiSet?.organizationalUnit,
            employeeKpiSet: kpimembers?.updateKpiSet
        });

        await Logger.info(req.user.email, `Set task importance level`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['set_task_importance_level_success'],
            content: kpimembers
        });
    } catch (error) {
        await Logger.info(req.user.email, `Set task importance level`, req.portal);
        res.status(400).json({
            messages: ['set_task_importance_level_fail'],
            message: error
        });
    }
}

/**
 * tinh diem kpi
 */

exports.setPointAllKpi = async (req, res) => {
    try {
        const kpi = await KPIMemberService.setPointAllKpi(req.portal, req.params.id, req.query.id, req.body);

        // Thêm log
        let log = getDataEmployeeKpiSetLog({
            type: "set_point_all",
            creator: req.user._id,
            organizationalUnit: kpi?.organizationalUnit,
            employee: kpi?.creator,
            month: kpi?.date,
            newData: kpi
        })
        await overviewService.createEmployeeKpiSetLogs(req.portal, {
            ...log,
            employeeKpiSetId: kpi?._id
        })

        // Thêm newsfeed
        await EmployeeKpiSetService.createNewsFeedForEmployeeKpiSet(req.portal, {
            ...log,
            organizationalUnit: kpi?.organizationalUnit,
            employeeKpiSet: kpi
        });

        await Logger.info(req.user.email, `Set point kpi`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['set_point_kpi_success'],
            content: kpi
        });
    } catch (error) {
        await Logger.info(req.user.email, `Set point kpi`, req.portal);
        res.status(400).json({
            messages: ['set_point_kpi_fail'],
            message: error
        });
    }
}


/** Tinh diem hieu suat thuc hien kpi */
exports.getEmployeeKpiPerformance = async (req, res) => {
    try {
        let employeeKpiPerformance = []
        for (let id of req.query.ids) {
            const data = await KPIMemberService.getEmployeeKpiPerformance(req.portal, id);
            employeeKpiPerformance.push(data.performance);
        }

        await Logger.info(req.user.email, ` get all employee kpi set by month `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['Get all employee kpi set by month successfully'],
            content: employeeKpiPerformance
        });
    } catch (error) {
        await Logger.error(req.user.email, ` get all employee kpi set by month `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['Get all employee kpi set by month unsuccessfully'],
            content: error
        });
    }
}