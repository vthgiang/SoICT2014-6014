const OrderService = require('./order.service');
const Log = require(`../../../logs`);


// Tạo mới 1 vận đơn
exports.createOrder = async (req, res) => {
  try {
    const newOrder = await OrderService.createOrder(req.portal, req.body);

    await Log.info(req.user.email, 'CREATED_NEW_ORDER', req.portal);

    res.status(201).json({
      success: true,
      messages: ['add_success'],
      content: newOrder
    });
  } catch (error) {
    await Log.error(req.user.email, 'CREATED_NEW_ORDER', req.portal);

    res.status(400).json({
      success: false,
      messages: ['add_fail'],
      content: error.message
    })
  }
}

// Lấy tất cả vận đơn
exports.getAllOrder = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrder(req.portal, req.query);

    await Log.info(req.user?.email, 'GET_ALL_ORDER', req.portal);

    res.status(200).json({
      success: true,
      messages: ['get_all_order_success'],
      content: orders
    });
  } catch (error) {
    await Log.error(req.user?.email, 'GET_ALL_ORDER', req.portal);

    res.status(400).json({
      success: false,
      messages: ['get_all_order_fail'],
      content: error.message
    });
  }
}
