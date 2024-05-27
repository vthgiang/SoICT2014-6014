const { DeliverySchedule } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

//Lấy tỉ lệ giao hàng đúng hạn thực tế. Tỉ lệ giao hàng đúng hạn = Số đơn giao hàng đúng hạn /tổng số đơn hàng đã giao
exports.getOnTimeDeliveryRates = async (portal, data) => {
    const deliverySchedules = await DeliverySchedule(connect(DB_CONNECTION, portal)).find({})
    console.log(deliverySchedules)

    let onTimeCount = 0;
    let totalCount = 0;

    deliverySchedules.forEach((schedule) => {
        if (schedule.status === 3) {
          totalCount += 1;
          if (schedule.actualDeliveryDate <= schedule.estimatedDeliveryDate) {
            onTimeCount += 1;
          }
        }
    });

    // Tính tỉ lệ
    const onTimeRate = totalCount > 0 ? onTimeCount / totalCount*100 : 0;

    return onTimeRate;
}

exports.getEstimatedOnTimeDeliveryRates = async (portal, data) => {
    const deliverySchedules = await DeliverySchedule(connect(DB_CONNECTION, portal)).find().populate('orders');

    let onTimeCount = 0;
    let totalCount = 0;

    deliverySchedules.forEach((schedule) => {
      if (schedule.status === 3) {
        totalCount += 1;
        if (schedule.actualDeliveryDate <= schedule.estimatedDeliveryDate) {
          onTimeCount += 1;
        }
      }
    });

    // Tính tỉ lệ
    const onTimeRate = totalCount > 0 ? onTimeCount / totalCount*100 : 0;

    return onTimeRate;
}
