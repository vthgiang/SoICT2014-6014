const ScheduleService = require(`./schedule.service`);
const Log = require(`../../../logs`);

// tìm kho gần nhất
exports.getNearestDepot = async (req, res) => {
  try {
    let { lat, lng } = req.query;
    let stock = await ScheduleService.getNearestDepot(req.portal, { lat, lng });
    res.status(200).json(stock);
  } catch (error) {
    await Log.error(req.user.email, `getNearestDepot`, req.portal);
    res.status(400).json(error);
  }
};
