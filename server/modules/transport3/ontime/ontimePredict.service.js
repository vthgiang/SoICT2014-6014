const { DeliverySchedule, Transport3Schedule } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

//Lấy tỉ lệ giao hàng đúng hạn thực tế. Tỉ lệ giao hàng đúng hạn = Số đơn giao hàng đúng hạn /tổng số đơn hàng đã giao
exports.getOnTimeDeliveryRates = async (portal, data) => {
    const transport3Schedules = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({})

    let onTimeCount = 0;
    let totalCount = 0;

    transport3Schedules.forEach((schedule) => {
        schedule.orders.forEach((order) => {
            if (order.status === 3) {
              totalCount += 1;
              if (order.timeArrive <= order.estimateTimeArrive) {
                    onTimeCount += 1;
                }
            }
        })
    });

    // Tính tỉ lệ
    const onTimeRate = totalCount > 0 ? onTimeCount / totalCount*100 : 0;

    return onTimeRate;
}

exports.getEstimatedOnTimeDeliveryRates = async (portal, data) => {
    const transport3Schedules = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({})

    let onTimeCount = 0;
    let totalCount = 0;

    transport3Schedules.forEach((schedule) => {
        schedule.orders.forEach(order => {
            if (order.status === 3) {
            totalCount += 1;
            console.log(order.timeArrive)
            if (order.estimatedOntime == 1) {
                    onTimeCount += 1;
                }
            }
        })
    });

    // Tính tỉ lệ
    const onTimeRate = totalCount > 0 ? onTimeCount / totalCount*100 : 0;

    return onTimeRate;
}

exports.getDeliveryLateDayAverage = async (portal, data) => {
    const transport3Schedules = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({})

    let lateDaySum = 0
    let totalCount = 0;

    transport3Schedules.forEach((schedule) => {
        schedule.orders.forEach(order => {
            if (order.status === 3) {
            totalCount += 1;
            if (order.timeArrive > order.estimateTimeArrive) {
                   lateDaySum += (order.timeArrive - order.estimateTimeArrive)/(60*60*24*1000)
                }
            }
        })
    });
    console.log(lateDaySum)

    const lateDayAverage = lateDaySum / totalCount;
    return lateDayAverage;

}
