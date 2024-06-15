const OrderService = require('./order.service');
const Log = require(`../../../logs`);


// Tạo mới 1 vận đơn
exports.createOrder = async (req, res) => {
  try {
    const newOrder = await OrderService.createOrder(req.portal, req.body);

    await Log.info(req.user.email, 'CREATED_NEW_ORDER', req.portal);

    res.status(201).json({
      success: true,
      messages: [`Tạo vận đơn thành công`],
      content: newOrder
    });
  } catch (error) {
    await Log.error(req.user.email, 'CREATED_NEW_ORDER', req.portal);

    res.status(400).json({
      success: false,
      messages: [`Tạo vận đơn thất bại`],
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
      messages: ['Lấy thông tin vận đơn thành công'],
      content: orders
    });
  } catch (error) {
    await Log.error(req.user?.email, 'GET_ALL_ORDER', req.portal);

    res.status(400).json({
      success: false,
      messages: ['Lấy thông tin vận đơn thất bại'],
      content: error.message
    });
  }
}

// Xoá 1 vận đơn
exports.deleteOrder = async (req, res) => {
  try {
    await OrderService.deleteOrder(req.portal, req.params.id);

    await Log.info(req.user.email, 'DELETE_ORDER', req.portal);

    res.status(200).json({
      success: true,
      messages: ['Xoá vận đơn thành công']
    });
  } catch (error) {
    await Log.error(req.user.email, 'DELETE_ORDER', req.portal);

    res.status(400).json({
      success: false,
      messages: ['Xoá vận đơn thất bại'],
      content: error.message
    });
  }
}

// Sửa thông tin 1 vận đơn
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await OrderService.updateOrder(req.portal, req.params.id, req.body);

    await Log.info(req.user.email, 'UPDATE_ORDER', req.portal);

    res.status(200).json({
      success: true,
      messages: ['Cập nhật vận đơn thành công'],
      content: updatedOrder
    });
  } catch (error) {
    await Log.error(req.user.email, 'UPDATE_ORDER', req.portal);

    res.status(400).json({
      success: false,
      messages: ['Cập nhật vận đơn thất bại'],
      content: error.message
    });
  }
}
