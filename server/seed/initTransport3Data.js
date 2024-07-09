const mongoose = require('mongoose');
const moment = require('moment');
const listTransport3Orders = require('./transport3orders.json');
let listTransport3Schedules = require('./transport3schedule.json');
const listTransport3Issues = require('./transport3issues.json');
const {
  Transport3Employee,
  Transport3Order,
  Transport3Schedule,
  Transport3Vehicle,
  Transport3Issue,
  Stock,
  Asset,
  Customer,
  Good,
  Employee,
  Transport3DraftSchedule
} = require('../models');

require('dotenv').config();

const initTransport3Data = async () => {
  let connectOptions =
    process.env.DB_AUTHENTICATION === 'true'
      ? {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
      }
      : {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      };
  const vnistDB = mongoose.createConnection(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`,
    connectOptions
  );
  if (!vnistDB) throw 'DB vnist cannot connect';

  console.log('DB vnist connected');

  const dropModels = async (db) => {
    await db.dropCollection('transport3employees');
    await db.dropCollection('transport3orders');
    await db.dropCollection('transport3schedules');
    await db.dropCollection('transport3vehicles');
    await db.dropCollection('transport3issues');
    await db.dropCollection('transport3draftschedules');
  }

  const initModels = (db) => {
    Transport3Employee(db);
    Transport3Order(db);
    Transport3Schedule(db);
    Transport3Vehicle(db);
    Transport3Issue(db);
    Transport3DraftSchedule(db);
  };

  console.log('Xoá dữ liệu transport3 cũ và khởi tạo dữ liệu mới');
  await dropModels(vnistDB);
  initModels(vnistDB);
  const listCustomers = await Customer(vnistDB).find({});
  const listGoods = await Good(vnistDB).find({});
  let listTransport3Vehicles = await Asset(vnistDB).find({group: 'vehicle'});
  const listShippers = await Employee(vnistDB).find({
    fullName: {
      $in: [
        'Vũ Thị Cúc',
        'Vũ Mạnh Cường',
        'Trần Văn Cường',
        'Dương Thị Thanh Thuỳ',
      ]
    }
  });

  /*---------------------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------
      TẠO DỮ LIỆU ĐƠN HÀNG
  -----------------------------------------------------------------------------------------------
  ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu đơn vận chuyển');
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const transport3Order = await Transport3Order(vnistDB).create(
    listTransport3Orders.map((order, index) => {
      return {
        code: `TP_${today}.1394${index + 10}`,
        customer: listCustomers[index]._id,
        customerPhone: listCustomers[index].mobilephoneNumber,
        address: order.address,
        lat: order.lat,
        lng: order.lng,
        deliveryTime: currentTimestamp + index * 86400,
        note: order.note,
        noteAddress: order.noteAddress,
        priority: order.priority,
        status: order.status,
        transportType: order.transportType,
        goods: [
          {
            good: listGoods[index % 2]._id,
            code: listGoods[index % 2].code,
            goodName: listGoods[index % 2].name,
            baseUnit: listGoods[index % 2].baseUnit,
            quantity: 5,
          }
        ]
      }
    })
  )
  console.log('Khởi tạo xong dữ liệu đơn vận chuyển');

  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU PHƯƠNG TIỆN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  for (let i = 0; i < listTransport3Vehicles.length; i++) {
    await Transport3Vehicle(vnistDB).insertMany([
      {
        code: listTransport3Vehicles[i].code,
        asset: listTransport3Vehicles[i]._id,
        // Trọng tải xe
        tonnage: 1000 + Math.floor(Math.random() * 100),
        // Thể tích thùng xe
        volume: parseInt((8 + Math.floor(Math.random() * 100) / 100).toFixed(2)),
        // Rộng, cao , sâu của thùng xe
        width: parseInt((2 + Math.floor(Math.random() * 100) / 100).toFixed(2)),
        height: parseInt((2 + Math.floor(Math.random() * 100) / 100).toFixed(2)),
        depth: parseInt((2 + Math.floor(Math.random() * 100) / 100).toFixed(2)),
        // Mức tiêu thụ nhiên liệu của xe/1km
        averageGasConsume: (0.06 + Math.floor(Math.random() * 10) / 100).toFixed(2),
        // Trung bình chi phí vận chuyển của xe
        averageFeeTransport: 80000 + Math.floor(Math.random() * 10) * 10000,
        // Tốc độ tối thiểu
        minVelocity: 0,
        // Tốc độ tối đa
        maxVelocity: 80 + Math.floor(Math.random() * 10) * 10,
      }])
  }
  console.log('Khởi tạo xong dữ liệu phương tiện');
  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        DUYỆT NHÂN SỰ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  await Transport3Employee(vnistDB).create(
    listShippers.map((shipper, index) => {
      return {
        employee: shipper._id,
        salary: (Math.floor(Math.random() * 5) + 10) * 1000000,
        certificate: 'Bằng ô tô B1',
      }
    })
  )
  console.log('Khởi tạo xong dữ liệu nhân sự');
  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KẾ HOẠCH VẬN CHUYỂN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  const transport3Vehicle = await Transport3Vehicle(vnistDB).find({});
  const listDepots = await Stock(vnistDB).find({});
  // listTransport3Schedules = listTransport3Schedules.slice(0, 15);

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  await Transport3Schedule(vnistDB).create(
    listTransport3Schedules.slice(0, 40).map((schedule, index) => {
      const orderCount = getRandomInt(2, 3);
      let status_t = index < 3 ? (index + 1) : 1;
      const orders = transport3Order.slice(index * orderCount, (index + 1) * orderCount).map(order => {
        const estimateTimeArrive = moment().month(getRandomInt(2, 6)).date(getRandomInt(1, 28)).hour(getRandomInt(0, 23)).minute(getRandomInt(0, 59)).second(getRandomInt(0, 59));
        let timeArrive = null;
        let estimatedOntime = null;
  
        // Check if estimateTimeArrive is before June
        if (estimateTimeArrive.isBefore(moment('2024-06-01'))) {
          status_t = 3;
        }
  
        if (status_t === 3) {
          timeArrive = estimateTimeArrive.clone().add(getRandomInt(-10, 10), 'days');
          estimatedOntime = timeArrive.isBefore(estimateTimeArrive) ? 1 : 0;
        } else {
          estimatedOntime = Math.random() < 0.9 ? 1 : 0; // 90% estimatedOntime is 1
  
          if (estimatedOntime === 1) {
            timeArrive = estimateTimeArrive.clone().subtract(getRandomInt(0, 12), 'hours');
          }
        }
  
        const beginTime = estimateTimeArrive.clone().subtract(getRandomInt(1, 5), 'days');
        const distance = getRandomInt(10, 50);
  
        return {
          order: order._id,
          code: order.code,
          status: status_t,
          estimateTimeArrive: estimateTimeArrive.toISOString(),
          timeArrive: timeArrive ? timeArrive.toISOString() : null,
          estimateTimeService: 600,
          timeService: 600,
          beginTime: beginTime.toISOString(),
          dynamicEstimatedTime: null,
          distance: distance,
          estimatedOntime: estimatedOntime
        };
      });
  
      // Set the beginTime of the schedule to the beginTime of the first order
      const scheduleBeginTime = orders[0].beginTime;
  
      return {
        code: `SC_${moment().format('YYYYMMDD')}.1394${index + 10}_1`,
        employees: index < 4 ? [listShippers[index % listShippers.length]._id] : null,
        status: status_t,
        vehicle: transport3Vehicle[index % transport3Vehicle.length]._id,
        depot: listDepots[Math.floor(Math.random() * listDepots.length)]._id,
        orders: orders,
        beginTime: status_t !== 1 ? scheduleBeginTime : null,
        endTime: status_t === 3 ? moment(scheduleBeginTime).add((orders.length + 1) * 6000, 'seconds').toISOString() : null,
        note: schedule.note,
      };
    })
  );
  
  console.log('Khởi tạo xong kế hoạch vận chuyển');
  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU VẤN ĐỀ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  const shipperVTC = await Employee(vnistDB).findOne({fullName: 'Vũ Thị Cúc'});
  const scheduleVTC = await Transport3Schedule(vnistDB).findOne({employees: {$in: [shipperVTC._id]}});
  await Transport3Issue(vnistDB).create(
    listTransport3Issues.map((issue, index) => {
      return {
        schedule: scheduleVTC._id,
        order: scheduleVTC.orders[index % 2].order,
        receiver_solve: null,
        description: issue.description,
        status: issue.status,
        reason: issue.reason,
        type: issue.type,
      }
    })
  )
  console.log('Khởi tạo xong dữ liệu vấn đề');
  process.exit(0);
};

initTransport3Data().catch((err) => {
  console.log(err);
  process.exit(0);
});
