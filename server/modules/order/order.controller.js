const OrderServie = require("./order.service");
const { LogInfo, LogError } = require("../../logs");
const { error } = require("winston");

/**
 * Lấy tất cả các đơn hàng
 * @param {*} req
 * @param {*} res
 */
exports.getAllOrder = async (req, res) => {
  try {
    let data;

    if (req.query.page === undefined && req.query.limit === undefined) {
      data = await OrderServie.getAllOrder(false);
    } else {
      let params = {
        code: req.query.code,
        page: Number(req.query.page),
        limit: Number(req.query.limit),
      };

      data = await OrderServie.getAllOrder(params);
    }

    await LogInfo(req.user.email, "GET_ORDERS", req.user.company);

    res.status(200).json({
      success: true,
      messages: ["get_success"],
      content: data,
    });
  } catch (error) {
    await LogError(req.user.email, "GET_ORDERS", req.user.company);

    res.status(400).json({
      success: false,
      messages: ["get_failure"],
      content: {
        error,
      },
    });
  }
};

/**
 * Tạo mới một đơn hàng
 * @param {*} req
 * @param {*} res
 */
exports.createNewOrder = async (req, res) => {
  try {
    const newOrder = await OrderServie.createNewOrder(req.body);

    await LogInfo(req.user.email, "CREATE_NEW_ORDER", req.user.company);

    res.status(200).json({
      success: true,
      messages: ["add_success"],
      content: newOrder,
    });
  } catch {
    await LogError(req.user.email, "CREATE_NEW_ORDER", req.user.company);

    res.status(400).json({
      success: false,
      messages: ["add_failure"],
      content: {
        error,
      },
    });
  }
};

exports.getOrderById = (req, res) => {
  //code here
};

/**
 * Cập nhật đơn hàng chỉnh sửa
 * @param {*} req
 * @param {*} res
 */
exports.updateOrderById = async (req, res) => {
  try {
    const orderUpdated = await OrderServie.updateOrderById(
      req.params.id,
      req.body
    );
    await LogInfo(req.user.email, "UPDATE_ORDER", req.user.company);

    res.status(200).json({
      success: true,
      messages: ["edit_success"],
      content: orderUpdated,
    });
  } catch {
    await LogError(req.user.email, "UPDATE_ORDER", req.user.company);
    res.status(400).json({
      success: false,
      messages: ["edit_failure"],
      content: {
        error,
      },
    });
  }
};

/**
 * Xóa một đơn hàng
 * @param {*} req
 * @param {*} res
 */
exports.deleteOrderById = async (req, res) => {
  try {
    const orderDelete = await OrderServie.deleteOrderById(req.params.id);

    await LogInfo(req.user.email, "DELETE_ORDER", req.user.company);

    res.status(200).json({
      success: true,
      messages: ["delete_success"],
      content: orderDelete,
    });
  } catch {
    await LogError(req.user.email, "DELETE_ORDER", req.user.company);

    reres.status(400).json({
      success: false,
      messages: ["delete_failure"],
      content: {
        error,
      },
    });
  }
};
