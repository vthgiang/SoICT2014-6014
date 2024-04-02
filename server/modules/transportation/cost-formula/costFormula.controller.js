
const CostFormulaService = require('./costFormula.service');
const Log = require(`../../../logs`);

// Tạo mới, cập nhật lại công thức tính toán tổng chi phí vận hành xe
exports.createOrUpdateVehicleCostFormula = async (req, res) => {
    try {
        const newVehicleCost = await CostFormulaService.createOrUpdateVehicleCostFormula(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_VEHICLE', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newVehicleCost
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_VEHICLE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["add_fail"],
            content: error.message
        })
    }
}

// Lấy ra thông tin công thức tính chi phí xe
exports.getVehicleCostFormula = async (req, res) => {
    try {
       let  data = await CostFormulaService.getVehicleCostFormula(req.portal);

        await Log.info(req.user.email, "GET_VEHICLE_FORMULA", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_vehicle_formula_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_VEHICLE_FORMULA", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_vehicle_formula_fail"],
            content: error.message
        });
    }
}