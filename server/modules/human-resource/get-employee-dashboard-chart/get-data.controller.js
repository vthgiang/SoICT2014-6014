const GetChartDataService = require("./get-data.service");
const Log = require(`../../../logs`);

exports.getChartData = async (req, res) => {
  try {
    data = await GetChartDataService.getChartData(req.portal, req.user.company._id, req.query.defaultParams, req.query.searchChart);

    await Log.info(req.user.email, "GET_CHART_DATA", req.portal);

    res.status(200).json({
      success: true,
      messages: ["get_human_resources_dashboard_success"],
      content: data,
    });
  } catch (error) {
    console.log(error);
    await Log.error(req.user.email, "GET_CHART_DATA", req.portal);

    res.status(400).json({
      success: false,
      messages: ["get_human_resources_dashboard_success"],
      content: error.message,
    });
  }
};
