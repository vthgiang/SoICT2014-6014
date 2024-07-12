const ScheduleService = require(`./schedule.service`);
const Log = require(`../../../logs`);

// Lấy tất cả lịch trình
exports.getAllSchedule = async (req, res) => {
  try {
    let schedules = await ScheduleService.getAllSchedule(req.portal, req.query, req.currentRole);
    res.status(200).json({
      schedules,
      messages: ['Lấy thông tin lịch trình thành công']
    });
  } catch (error) {
    Log.error(`Error while fetching all schedules ${error}`);
    res.status(400).json({
      messages: [
        'Lấy thông tin lịch trình thất bại' + error
      ]
    });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    let schedule = await ScheduleService.getScheduleById(req.portal, req.params.id);
    res.status(200).json({
      schedule,
      messages: ['Lấy thông tin lịch trình thành công']
    });
  } catch (error) {
    Log.error(`Error while fetching schedule ${error}`);
    res.status(400).json({
      messages: [
        'Lấy thông tin lịch trình thất bại' + error
      ]
    });
  }
}

// Tạo mới 1 lịch trình
exports.createSchedule = async (req, res) => {
  try {
    let schedule = await ScheduleService.createSchedule(req.portal, req.body);
    res.status(200).json({
      schedule,
      messages: ['Tạo lịch trình thành công']
    });
  } catch (error) {
    Log.error(`Error while creating schedule ${error}`);
    res.status(400).json({
      messages: [`Tạo lịch trình thất bại ${error}`]
    });
  }
};

// Xoá 1 lịch trình
exports.deleteSchedule = async (req, res) => {
  try {
    await ScheduleService.deleteSchedule(req.portal, req.params.id);
    res.status(200).json({
      messages: ['Xoá lịch trình thành công']
    });
  } catch (error) {
    Log.error(`Error while deleting schedule ${error}`);
    res.status(400).json({
      messages: ['Xoá lịch trình thất bại']
    });
  }
};

// Sửa thông tin 1 lịch trình
exports.updateSchedule = async (req, res) => {
  try {
    let schedule = await ScheduleService.updateSchedule(req.portal, req.params.id, req.body);
    res.status(200).json({
      schedule,
      messages: ['Cập nhật lịch trình thành công']
    });
  } catch (error) {
    Log.error(`Error while updating schedule ${error}`);
    res.status(400).json({
      messages: ['Cập nhật lịch trình thất bại']
    });
  }
};

// Đơn đang được vận chuyển
exports.getOrdersTransporting = async (req, res) => {
  try {
    let orders = await ScheduleService.getOrdersTransporting(req.portal);
    res.status(200).json({
      orders,
      messages: ['Lấy thông tin đơn hàng đang vận chuyển thành công']
    });
  } catch (error) {
    Log.error(`Error while fetching orders ${error}`);
    res.status(400).json({
      messages: ['Lấy thông tin đơn hàng đang vận chuyển thất bại' + error]
    });
  }
}

exports.getMySchedule = async (req, res) => {
  try {
    let schedules = await ScheduleService.getMySchedule(req.portal, req.user);
    res.status(200).json({
      schedules,
      messages: ['Lấy thông tin lịch trình thành công']
    });
  } catch (error) {
    Log.error(`Error while fetching my schedules ${error}`);
    res.status(400).json({
      messages: [
        'Lấy thông tin lịch trình thất bại' + error
      ]
    });
  }
}

exports.getDraftSchedule = async (req, res) => {
  try {
    let schedules = await ScheduleService.getDraftSchedule(req.portal);
    res.status(200).json({
      schedules,
      messages: ['Lấy thông tin lịch trình thành công']
    });
  } catch (error) {
    await Log.error(`Error while fetching draft schedules ${error}`);
    res.status(400).json({
      messages: [
        'Lấy thông tin lịch trình thất bại' + error
      ]
    });
  }
}

exports.setScheduleFromDraft = async (req, res) => {
  try {
    let schedule = await ScheduleService.setScheduleFromDraft(req.portal, req.body);
    res.status(200).json({
      schedule,
      messages: ['Tạo lịch trình từ bản nháp thành công']
    });
  } catch (error) {
    Log.error(`Error while setting schedule from draft ${error}`);
    res.status(400).json({
      messages: ['Tạo lịch trình từ bản nháp thất bại' + error]
    });
  }
}


exports.create3rdSchedule = async (req, res) => {
  try {
    let schedule = await ScheduleService.create3rdSchedule(req.portal, req.body);
    res.status(200).json({
      schedule,
      messages: ['Tạo lịch trình thành công']
    });
  } catch (error) {
    Log.error(`Error while creating schedule ${error}`);
    res.status(400).json({
      messages: [`Tạo lịch trình thất bại ${error}`]
    });
  }
}

exports.getAll3rdSchedule = async (req, res) => {
  try {
    let schedules = await ScheduleService.getAll3rdSchedule(req.portal, req.currentRole);
    res.status(200).json({
      schedules,
      messages: ['Lấy thông tin lịch trình thành công']
    });
  } catch (error) {
    Log.error(`Error while fetching all schedules ${error}`);
    res.status(400).json({
      messages: [
        'Lấy thông tin lịch trình thất bại' + error
      ]
    });
  }
}
