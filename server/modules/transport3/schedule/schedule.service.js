const {
  Transport3Schedule,
  Stock, Role, Employee, Transport3Order, Transport3DraftSchedule, Transport3rd
} = require('../../../models');

const {
  connect
} = require(`../../../helpers/dbHelper`);
const axios = require('axios');

// Lấy tất cả lịch trình
exports.getAllSchedule = async (portal, query, currentRole) => {
  let role = await Role(connect(DB_CONNECTION, portal)).find({
    _id: currentRole
  });

  if (role[0].name !== 'Trưởng phòng vận chuyển' && role[0].name !== 'Nhân viên giám sát') {
    return [];
  }

  let result = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({})
    .populate('depot')
    .populate({
      path: 'orders.order',
      populate: {
        path: 'customer'
      }
    })
    .populate({
      path: 'vehicle',
      populate: {
        path: 'asset'
      }
    })
    .populate('draftSchedule')
    .populate('employees');

  if (query.query) {
    // ma lich trinh, kho xuat phat, xe, nhan vien
    console.log(result[0].employees);
    return result.filter(schedule => {
      return schedule.code.toLowerCase().includes(query.query.toLowerCase()) ||
        schedule.depot?.name.toLowerCase().includes(query.query.toLowerCase()) ||
        schedule.vehicle?.asset?.assetName.toLowerCase().includes(query.query.toLowerCase()) ||
        schedule.employees?.map(employee => employee.name).join(', ').toLowerCase().includes(query.query.toLowerCase())
    })
  } else {
    return result;
  }
}

exports.getScheduleById = async (portal, scheduleId) => {
  return Transport3Schedule(connect(DB_CONNECTION, portal)).findById(scheduleId)
}

// Tạo mới 1 lịch trình
exports.createSchedule = async (portal, data) => {
  // Tạo lịch trình cho từng vehicle
  if (data.isAutoSchedule !== true) {
    let i = 1;
    for (let vehicle of data.vehicles) {
      let schedule = data.schedules[vehicle];
      let query = {
        code: data.code + '_' + i++,
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
        vehicle: vehicle,
        depot: data.depot.find(depot => depot.vehicle === vehicle)?.stock?._id,
        employees: null,
      }
      await Transport3Schedule(connect(DB_CONNECTION, portal)).create(query)
    }
  } else {
    let i = 1;
    for (let vehicle of data.vehicles) {
      let query = {
        code: data.code + '_' + i++,
        orders: [],
        status: 1,
        vehicle: vehicle,
        depot: null,
        employees: null,
        isAutoSchedule: true
      }
      await Transport3Schedule(connect(DB_CONNECTION, portal)).create(query)
    }
    data.orders = await Transport3Order(connect(DB_CONNECTION, portal)).find({_id: {$in: data.orders}});
    const res_py = await axios.post(`${process.env.PYTHON_TRANSPORT3_URL}/upload-data`, data);
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

exports.getMySchedule = async (portal, user) => {
  let employee = await Employee(connect(DB_CONNECTION, portal)).findOne({emailInCompany: user.email});
  let allSchedule = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({})
    .populate({
      path: 'orders.order',
      populate: {
        path: 'customer'
      }
    })
    .populate({
      path: 'vehicle',
      populate: {
        path: 'asset'
      }
    })
    .populate('depot');
  allSchedule = allSchedule.filter(schedule => schedule.employees);
  return allSchedule.filter(schedule => schedule.employees.includes(employee._id));
}

exports.getDraftSchedule = async (portal) => {
  return Transport3DraftSchedule(connect(DB_CONNECTION, portal)).find({});
}

exports.setScheduleFromDraft = async (portal, data) => {
  let drafts = await Transport3DraftSchedule(connect(DB_CONNECTION, portal)).find({});
  // all draft include code
  drafts = drafts.filter(draft => draft.code.includes(data.code));
  let note = drafts.filter(draft => draft._id == data._id)[0].note;
  drafts = drafts.filter(draft => draft.note === note);
  for (let draft of drafts) {
    let orders = [];
    for (let i = 0; i < draft.orders.length; i++) {
      let order = {};
      order = {
        order: draft.orders[i].order,
        code: draft.orders[i].code,
        status: 1,
        estimateTimeArrive: draft.orders[i].estimateTimeArrive,
        estimateTimeService: 600,
        timeService: 600,
        distance: draft.orders[i].distance,
      };
      orders.push(order);
    }
    await Transport3Schedule(connect(DB_CONNECTION, portal)).findOneAndUpdate({code: draft.code}, {
      $set: {
        orders: orders,
        depot: draft.depot,
        draftSchedule: draft._id
      }
    })
  }
  return [];
}

exports.create3rdSchedule = async (portal, data) => {
  let {order_id} = data;
  return Transport3rd(connect(DB_CONNECTION, portal)).create({
    order: order_id,
    status: 1
  })
}

exports.getAll3rdSchedule = async (portal, currentRole) => {
  let role = await Role(connect(DB_CONNECTION, portal)).find({
    _id: currentRole
  });

  if (role[0].name !== 'Trưởng phòng vận chuyển' && role[0].name !== 'Nhân viên giám sát') {
    return [];
  }
  return Transport3rd(connect(DB_CONNECTION, portal)).find({})
    .populate('order')
}
