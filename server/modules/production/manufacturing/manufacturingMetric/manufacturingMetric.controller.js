const Logger = require(`../../../../logs`);
const ManufacturingMetricService = require('./manufacturingMetric.service');

exports.getAllManufacturingKpis = async (req, res) => {
    try {
        let query = req.query;
        let manufacturingMetrics = await ManufacturingMetricService.getAllManufacturingKpis(query, req.portal);

        await Logger.info(req.user.email, "GET_ALL_MANUFACTURING_METRIC", req.portal);

        res.status(201).json({
            success: true,
            messages: ["get_metrics_successfully"],
            content: manufacturingMetrics
        });
    } catch (error) {
        await Logger.error(req.user.email, "GET_ALL_MANUFACTURING_METRIC", req.portal);
        console.log(error)
        res.status(400).json({
            success: false,
            messages: ["get_metrics_failed"],
            content: error.message
        })
    }
}

exports.createManufacturingKpi = async (req, res) => {
    try {
        let manufacturingMetric = await ManufacturingMetricService.createManufacturingKpi(req.body, req.portal);

        await Logger.info(req.user.email, "CREATE_MANUFACTURING_METRIC", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_metric_successfully"],
            content: manufacturingMetric
        });
    } catch (error) {
        await Logger.error(req.user.email, "CREATE_MANUFACTURING_METRIC", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_metric_failed"],
            content: error.message
        })
    }
}

exports.editManufacturingKpis = async (req, res) => {
    try {
        let manufacturingMetrics = await ManufacturingMetricService.editManufacturingKpis(req.body, req.portal);

        await Logger.info(req.user.email, "EDIT_MANUFACTURING_METRICS", req.portal);

        res.status(201).json({
            success: true,
            messages: ["edit_kpis_successfully"],
            content: manufacturingMetrics
        });
    } catch (error) {
        await Logger.error(req.user.email, "EDIT_MANUFACTURING_METRICS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_kpis_failed"],
            content: error.message
        })
    }
}

exports.getManufacturingKpiById = async (req, res) => {
    try {
        const { metricId, currentRole } = req.query;
        let manufacturingMetric = await ManufacturingMetricService.getManufacturingKpiById(metricId, currentRole, req.portal);

        await Logger.info(req.user.email, "GET_MANUFACTURING_KPI_SUCCESS", req.portal);

        res.status(201).json({
            success: true,
            messages: ["get_kpi_by_id_successfully"],
            content: manufacturingMetric
        });
    } catch (error) {
        await Logger.error(req.user.email, "GET_MANUFACTURING_KPI_SUCCESS", req.portal);
        console.log(error)
        res.status(400).json({
            success: false,
            messages: ["get_kpi_by_id__failed"],
            content: error.message
        })
    }

}

exports.editManufacturingKpi = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const manufacturingMetric = await ManufacturingMetricService.editManufacturingKpi(id, data, req.portal);

        await Logger.info(req.user.email, "EDIT_MANUFACTURING_KPI", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_action_successfully"],
            content: manufacturingMetric
        });

    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, "EDIT_MANUFACTURING_KPI", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_action_failed"],
            content: error.message
        })
    }
}

exports.getAllReportElements = async (req, res) => {
    try {
        let manufacturingMetrics = await ManufacturingMetricService.getAllReportElements(req.query, req.portal);

        await Logger.info(req.user.email, "GET_ALL_REPORT_ELEMENT", req.portal);

        res.status(201).json({
            success: true,
            messages: ["get_elements_successfully"],
            content: manufacturingMetrics
        });
    } catch (error) {
        await Logger.error(req.user.email, "GET_ALL_REPORT_ELEMENT", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_elements_failed"],
            content: error.message
        })
    }
}
