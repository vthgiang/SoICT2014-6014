const express = require("express");
const router = express.Router();
const OrderController = require("./order.controller");
const { auth } = require("../../middleware");

router.get("/", auth, OrderController.getAllOrder);

router.post("/", auth, OrderController.createNewOrder);
router.get("/:id", auth, OrderController.getOrderById);
router.patch("/:id", auth, OrderController.updateOrderById);
router.delete("/:id", auth, OrderController.deleteOrderById);

module.exports = router;
