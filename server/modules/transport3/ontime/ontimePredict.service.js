const { DeliverySchedule, Transport3Schedule, Transport3Order, Stock, HyperParameter } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const moment = require('moment');
const mongoose = require('mongoose');
const axios = require('axios');
const { json } = require('body-parser');
const { ObjectId } = require('mongodb');

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

exports.getTopLateDeliveryDay = async (portal, { month, year }) => {
    const transport3Schedules = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({});  
    if (!transport3Schedules) {
        throw new Error('Schedule not found');
    } 
    let deliveryLateDay = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    transport3Schedules.forEach((schedule) => {
        schedule.orders.forEach((order) => {
            if (order.status && order.status === 3 && order.timeArrive > order.estimateTimeArrive) {
                const orderDate = new Date(order.beginTime);
                const orderMonth = orderDate.getMonth() + 1; // Tháng (1-12)
                const orderYear = orderDate.getFullYear(); // Năm

                // Chỉ xử lý nếu tháng và năm khớp với tham số tìm kiếm
                if (orderMonth === month && orderYear === year) {
                    const dayOfWeek = orderDate.getDay(); // Ngày trong tuần (0-6, Chủ nhật là 0)
                    deliveryLateDay[dayOfWeek] += 1;
                }
            }
        });
    });
    // Chuyển đổi đối tượng thành mảng và sắp xếp theo số lượng đơn hàng trễ hạn giảm dần
    const sortedDays = Object.keys(deliveryLateDay).map(day => ({
        dayOfWeek: day,
        lateDeliveries: deliveryLateDay[day]
    })).sort((a, b) => b.lateDeliveries - a.lateDeliveries);

    // Lấy tối đa 5 ngày
    const top5Days = sortedDays.slice(0, 5);

    return top5Days;
}

exports.getTopLateProducts = async (portal, { month, year }) => {
    const transport3Schedules = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({});  
    if (!transport3Schedules) {
        throw new Error('Schedule not found');
    } 
    let lateProductsMap = {};

    await Promise.all(transport3Schedules.map(async (schedule) => {
        for (const order of schedule.orders) {
            if (order.status === 3 && order.timeArrive > order.estimateTimeArrive) {
                const orderDate = new Date(order.beginTime);
                const orderMonth = orderDate.getMonth() + 1; // Tháng (1-12)
                const orderYear = orderDate.getFullYear(); // Năm

                // Chỉ xử lý nếu tháng và năm khớp với tham số tìm kiếm
                if (orderMonth === month && orderYear === year) {
                    try {
                        const transport3Order = await Transport3Order(connect(DB_CONNECTION, portal)).findById(order.order);
                        if (transport3Order) {
                            transport3Order.goods.forEach((good) => {
                                const { good: id, goodName: name } = good;
                                if (!lateProductsMap[id]) {
                                    lateProductsMap[id] = {
                                        goodName: name,
                                        lateDeliveries: 0
                                    };
                                }
                                lateProductsMap[id].lateDeliveries++;
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching Transport3Order for order ${order.order}: ${error.message}`);
                    }             
                }
            }
        }
    }));
    const sortedProducts = Object.values(lateProductsMap)
        .sort((a, b) => b.lateDeliveries - a.lateDeliveries);

    // Lấy tối đa 5 sản phẩm
    const top5Products = sortedProducts.slice(0, 5);

    return top5Products;
}

exports.getTopLateStocks = async (portal, { month, year }) => {
    const transport3Schedules = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({});  
    if (!transport3Schedules) {
        throw new Error('Schedule not found');
    } 
    let lateStocksMap = {};

    await Promise.all(transport3Schedules.map(async (schedule) => {
        try {
            const stock = await Stock(connect(DB_CONNECTION, portal)).findById(schedule.depot);
            if (!stock) {
                throw new Error('Stock not found');
            }

            for (const order of schedule.orders) {
                if (order.status === 3 && order.timeArrive > order.estimateTimeArrive) {
                    const orderDate = new Date(order.beginTime);
                    const orderMonth = orderDate.getMonth() + 1; // Tháng (1-12)
                    const orderYear = orderDate.getFullYear(); // Năm

                    // Chỉ xử lý nếu tháng và năm khớp với tham số tìm kiếm
                    if (orderMonth === month && orderYear === year) {
                        if (!lateStocksMap[schedule.depot]) {
                            lateStocksMap[schedule.depot] = {
                                stockName: stock.name,
                                lateDeliveries: 0
                            };
                        }
                        lateStocksMap[schedule.depot].lateDeliveries++;
                    }
                }
            }
        } catch (error) {
            console.error(`Error fetching stock for schedule ${schedule._id}: ${error.message}`);
        }    
    }));

    const sortedStocks = Object.values(lateStocksMap)
        .sort((a, b) => b.lateDeliveries - a.lateDeliveries);

    // Lấy tối đa 5 kho
    const top5Stocks = sortedStocks.slice(0, 5);

    return top5Stocks;   
}

exports.getOrderStatus = async (portal, { month, year }) => {
    const transport3Schedules = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({});
    if (!transport3Schedules) {
        throw new Error('Schedule not found');
    }
    let ordersStatus = {
        1: 0, // Chưa giao
        2: 0, // Đang giao
        3: 0, // Thất bại
        4: 0  // Thành công
    };

    transport3Schedules.forEach((transport3Schedule) => {
        transport3Schedule.orders.forEach((order) => {
            if (order.status) {
                const orderDate = new Date(order.beginTime);
                const orderMonth = orderDate.getMonth() + 1; // Tháng (1-12)
                const orderYear = orderDate.getFullYear(); // Năm

                if (orderMonth === month && orderYear === year) {
                    if (ordersStatus.hasOwnProperty(order.status)) {
                        ordersStatus[order.status] += 1;
                    } else {
                        ordersStatus[order.status] = 0;
                    }
                }
            }
        });
    })
    return ordersStatus
}

exports.UpdateEstimatedOntimeDeliveryInfo = async (portal, scheduleId) => {
    const transport3Schedule = await Transport3Schedule(connect(DB_CONNECTION, portal)).findById(scheduleId);   
    if (!transport3Schedule) {
        throw new Error('Schedule not found');
    }
    const responseAI = await axios.get(`${process.env.PYTHON_URL_SERVER}/api/dxclan/ontime_predict/${scheduleId}`);
    
    if (!responseAI || !responseAI.data.predict_ontime) {
        throw new Error('Failed to fetch or predict ontime delivery');
    }
    
    const predictResults = responseAI.data.predict_ontime;

    transport3Schedule.orders.forEach((order) => {
        const filterItem = predictResults.find((predictResult) => predictResult.order_id === order.order.toString());
        if (filterItem) {
            order.estimatedOntime = filterItem.predictOntime;
        }
    });
    await transport3Schedule.save()
    return responseAI.data.predict_ontime
}

exports.HyperparamaterTuning = async (portal) => {
    const responseAI = await axios.get(`${process.env.PYTHON_URL_SERVER}/api/dxclan/ontime_predict/hyperparameterTuning/`);
    if (!responseAI || !responseAI.data.results) {
        throw new Error('Failed to fetch or predict ontime delivery');
    }
    const { best_params, accuracy } = responseAI.data.results;

    await HyperParameter(connect(DB_CONNECTION, portal)).create({
        modelName: 'XGBoost',
        learning_rate: best_params.learning_rate,
        max_depth: best_params.max_depth,
        min_child_weight: best_params.min_child_weight,
        n_estimators: best_params.n_estimators,
        reg_alpha: best_params.reg_alpha,
        reg_lambda: best_params.reg_lambda,
        accuracy: accuracy
    })

    return 'Hyperparameters saved successfully';
}

exports.getHyperparamter = async (portal) => {
    const Hyperparameters = await HyperParameter(connect(DB_CONNECTION, portal)).find({});   
    if (!Hyperparameters) {
        throw new Error('Schedule not found');
    }
    return Hyperparameters
}
