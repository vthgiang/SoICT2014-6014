const { DeliverySchedule, Transport3Schedule } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const moment = require('moment');
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

exports.getOnTimeDeliveryRatesPerMonth = async (portal, data) => {
    // Fetch all transport schedules from the database
    const transport3Schedules = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({});

    // Create a map to store the counts for each month
    let monthlyCounts = {};

    // Iterate over all schedules and their orders
    transport3Schedules.forEach((schedule) => {
        schedule.orders.forEach((order) => {
            if (order.status === 3) {
                const month = moment(order.timeArrive).format('MM-YYYY'); // Get the month and year of the order

                if (!monthlyCounts[month]) {
                    monthlyCounts[month] = { onTimeCount: 0, totalCount: 0 };
                }

                monthlyCounts[month].totalCount += 1;
                if (order.timeArrive <= order.estimateTimeArrive) {
                    monthlyCounts[month].onTimeCount += 1;
                }
            }
        });
    });

    // Calculate the on-time delivery rate for each month
    let monthlyOnTimeRates = [];
    for (let month in monthlyCounts) {
        const { onTimeCount, totalCount } = monthlyCounts[month];
        const onTimeRate = totalCount > 0 ? (onTimeCount / totalCount) * 100 : 0;
        monthlyOnTimeRates.push({ month, onTimeRate });
    }


    function fillMissingData(data) {
        // Helper function to get month difference
        function getMonthDifference(startDate, endDate) {
          return endDate.getMonth() - startDate.getMonth() + (12 * (endDate.getFullYear() - startDate.getFullYear()));
        }
      
        // Define the range of months we want to fill
        const startDate = new Date("2024-01-01");
        const endDate = new Date("2024-06-01");
      
        // Generate all required months
        let allMonths = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          allMonths.push(currentDate);
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }
      
        // Fill in missing months with onTimeRate = 0
        let filledData = allMonths.map(month => {
          const monthStr = (month.getMonth() + 1).toString().padStart(2, '0') + '-' + month.getFullYear();
          const existingEntry = data.find(entry => entry.month === monthStr);
          return existingEntry ? existingEntry : { month: monthStr, onTimeRate: 0 };
        });
      
        return filledData;
      }

    return fillMissingData(monthlyOnTimeRates);
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

exports.getEstimatedOnTimeDeliveryRatesPerMonth = async (portal, data) => {
    // Fetch all transport schedules from the database
    const transport3Schedules = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({});

    // Create a map to store the counts for each month
    let monthlyCounts = {};

    // Iterate over all schedules and their orders
    transport3Schedules.forEach((schedule) => {
        schedule.orders.forEach((order) => {
            if (order.status === 3) {
                const month = moment(order.timeArrive).format('MM-YYYY'); // Get the month and year of the order

                if (!monthlyCounts[month]) {
                    monthlyCounts[month] = { onTimeCount: 0, totalCount: 0 };
                }

                monthlyCounts[month].totalCount += 1;
                if (order.estimatedOntime == 1) {
                    monthlyCounts[month].onTimeCount += 1;
                }
            }
        });
    });

    // Calculate the on-time delivery rate for each month
    let monthlyOnTimeRates = [];
    for (let month in monthlyCounts) {
        const { onTimeCount, totalCount } = monthlyCounts[month];
        const onTimeRate = totalCount > 0 ? (onTimeCount / totalCount) * 100 : 0;
        monthlyOnTimeRates.push({ month, onTimeRate });
    }

    function fillMissingData(data) {
        // Helper function to get month difference
        function getMonthDifference(startDate, endDate) {
          return endDate.getMonth() - startDate.getMonth() + (12 * (endDate.getFullYear() - startDate.getFullYear()));
        }
      
        // Define the range of months we want to fill
        const startDate = new Date("2024-01-01");
        const endDate = new Date("2024-06-01");
      
        // Generate all required months
        let allMonths = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          allMonths.push(currentDate);
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }
      
        // Fill in missing months with onTimeRate = 0
        let filledData = allMonths.map(month => {
          const monthStr = (month.getMonth() + 1).toString().padStart(2, '0') + '-' + month.getFullYear();
          const existingEntry = data.find(entry => entry.month === monthStr);
          return existingEntry ? existingEntry : { month: monthStr, onTimeRate: 0 };
        });
      
        return filledData;
      }

    return fillMissingData(monthlyOnTimeRates);
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

exports.getDeliveryLateDayAveragePerMonth = async (portal, data) => {
    // Fetch all transport schedules from the database
    const transport3Schedules = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({});

    // Create a map to store the late day sum and total count for each month
    let monthlyLateDays = {};

    // Iterate over all schedules and their orders
    transport3Schedules.forEach((schedule) => {
        schedule.orders.forEach((order) => {
            if (order.status === 3) {
                const month = moment(order.timeArrive).format('MM-YYYY'); // Get the month and year of the order

                if (!monthlyLateDays[month]) {
                    monthlyLateDays[month] = { lateDaySum: 0, totalCount: 0 };
                }

                monthlyLateDays[month].totalCount += 1;
                if (order.timeArrive > order.estimateTimeArrive) {
                    monthlyLateDays[month].lateDaySum += (order.timeArrive - order.estimateTimeArrive) / (60 * 60 * 24 * 1000); // Convert milliseconds to days
                }
            }
        });
    });

    // Calculate the average late days for each month
    let monthlyLateDayAverages = [];
    for (let month in monthlyLateDays) {
        const { lateDaySum, totalCount } = monthlyLateDays[month];
        const lateDayAverage = totalCount > 0 ? lateDaySum / totalCount : 0;
        monthlyLateDayAverages.push({ month, lateDayAverage });
    }

    function fillMissingData(data) {
        // Helper function to get month difference
        function getMonthDifference(startDate, endDate) {
          return endDate.getMonth() - startDate.getMonth() + (12 * (endDate.getFullYear() - startDate.getFullYear()));
        }
      
        // Define the range of months we want to fill
        const startDate = new Date("2024-01-01");
        const endDate = new Date("2024-06-01");
      
        // Generate all required months
        let allMonths = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          allMonths.push(currentDate);
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }
      
        // Fill in missing months with lateDayAverage = 0
        let filledData = allMonths.map(month => {
          const monthStr = (month.getMonth() + 1).toString().padStart(2, '0') + '-' + month.getFullYear();
          const existingEntry = data.find(entry => entry.month === monthStr);
          return existingEntry ? existingEntry : { month: monthStr, lateDayAverage: 0 };
        });
      
        return filledData;
      }

    return fillMissingData(monthlyLateDayAverages);

}
