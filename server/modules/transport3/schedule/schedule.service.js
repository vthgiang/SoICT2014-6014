const {
  Transport3Schedule,
  Stock
} = require('../../../models');

const {
  connect
} = require(`../../../helpers/dbHelper`);

// Lấy tất cả lịch trình
exports.getAllSchedule = async (portal, query) => {
  return await Transport3Schedule(connect(DB_CONNECTION, portal)).find(query)
    .populate('depot')
    .populate('vehicles')
    .populate('employee')
    .populate('orders');
}

// Tạo mới 1 lịch trình
exports.createSchedule = async (portal, data) => {
  // Tạo lịch trình cho từng vehicle
  let i = 1;
  for (let vehicle of data.vehicles) {
    let schedule = data.schedules[vehicle]
    console.log(schedule.orders)
    let query = {
      code: data.code +"_"+ i++,
      orders: [
        ...schedule.orders.map(order => ({
          order: order,
          status: 1,
          estimateTimeArrive: null,
          timeArrive: null,
          estimateTimeService: null,
          timeService: null,
          beginTime: null,
          dynamicEstimatedTime: null,
          distance: null
        }))
      ],
      status: 1,
      vehicles: vehicle,
      depot: data.depot.find(depot => depot.vehicle === vehicle)?.stock?._id,
      employee: null,
    }
    await Transport3Schedule(connect(DB_CONNECTION, portal)).create(query)
  }
  return [];
}

// Xoá 1 lịch trình
exports.deleteSchedule = async (portal, id) => {
  return Transport3Schedule(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
}

// Sửa thông tin 1 lịch trình
exports.updateSchedule = async (portal, id, data) => {
  return Transport3Schedule(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
    $set: data
  }, {
    new: true
  });
}

// Đơn đang được vận chuyển
exports.getOrdersTransporting = async (portal) => {
  let allSchedule = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({}).populate('orders');
  let list_orders = allSchedule.map(schedule => schedule.orders).flat();
  return list_orders.filter(order => order.status === 2);
}
