const mongoose = require('mongoose');
const listTransport3Orders = require('./transport3orders.json');
const listTransport3Schedules = require('./transport3schedule.json');
const {
  Transport3Employee,
  Transport3Order,
  Transport3Schedule,
  Transport3Vehicle, Stock, Asset, Customer, Good,
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

  const initModels = (db) => {
    if (!db.models.Transport3Employee) Transport3Employee(db);
    if (!db.models.Transport3Order) Transport3Order(db);
    if (!db.models.Transport3Schedule) Transport3Schedule(db);
    if (!db.models.Transport3Vehicle) Transport3Vehicle(db);
  };

  initModels(vnistDB);
  const listCustomers = await Customer(vnistDB).find({});
  const listGoods = await Good(vnistDB).find({});

  /*---------------------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------
      TẠO DỮ LIỆU ĐƠN HÀNG
  -----------------------------------------------------------------------------------------------
  ----------------------------------------------------------------------------------------------- */
  console.log('Khởi tạo dữ liệu đơn vận chuyển');
  const transport3Order = await Transport3Order(vnistDB).create(
    listTransport3Orders.map((order, index) => {
      return {
        code: order.code,
        customer: listCustomers[index]._id,
        customerPhone: listCustomers[index].mobilephoneNumber,
        address: order.address,
        lat: order.lat,
        lng: order.lng,
        deliveryTime: order.deliveryTime,
        note: order.note,
        noteAddress: order.noteAddress,
        priority: order.priority,
        status: order.status,
        transportType: order.transportType,
        goods: [
          {
            good: listGoods[0]._id,
            code: 'G01',
            goodName: listGoods[0].name,
            baseUnit: null,
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
  let list_transport3Vehicle = await Asset(vnistDB).find({group: 'vehicle'});
  for (let i = 0; i < list_transport3Vehicle.length; i++) {
    await Transport3Vehicle(vnistDB).insertMany([
      {
        code: list_transport3Vehicle[i].code,
        asset: list_transport3Vehicle[i]._id,
        // Trọng tải xe
        tonnage: 1000,
        // Thể tích thùng xe
        volume: 8.58,
        // Rộng, cao , sâu của thùng xe
        width: 1.65,
        height: 1.65,
        depth: 3.15,
        // Mức tiêu thụ nhiên liệu của xe/1km
        averageGasConsume: 0.06,
        // Trung bình chi phí vận chuyển của xe
        traverageFeeTransport: 800000,
        // Tốc độ tối thiểu
        minVelocity: 0,
        // Tốc độ tối đa
        maxVelocity: 80
      }])
  }
  console.log('Khởi tạo xong dữ liệu phương tiện');
  /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KẾ HOẠCH VẬN CHUYỂN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
  const transport3Vehicle = await Transport3Vehicle(vnistDB).find({});
  const listDepots = await Stock(vnistDB).find({});
  await Transport3Schedule(vnistDB).create(
    listTransport3Schedules.map((schedule, index) => {
      return {
        code: 'SC_20240621.132' + index,
        employee: null,
        status: 1,
        vehicle: transport3Vehicle[Math.floor(Math.random() * transport3Vehicle.length)]._id,
        depot: listDepots[Math.floor(Math.random() * listDepots.length)]._id,
        orders: [
          transport3Order[index]._id
        ]
      }
    })
  )
  console.log('Khởi tạo xong kế hoạch vận chuyển');
};

initTransport3Data().catch((err) => {
  console.log(err);
  process.exit(0);
});
