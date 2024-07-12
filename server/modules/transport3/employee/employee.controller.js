const EmployeeService = require(`./employee.service`);
const Log = require(`../../../logs`);

// Lấy tất cả nhân viên vận chuyển 3
exports.getAllEmployeeTransport3 = async (req, res) => {
  try {
    const {portal, query, currentRole} = req;
    const result = await EmployeeService.getAllEmployeeTransport3(portal, query, currentRole);
    res.status(200).json(result);
  } catch (error) {
    await Log.error(`Error at getAllEmployeeTransport3: ${error}`);
    res.status(500).json({error: error.message});
  }
}

// Xác nhận nhân viên vận chuyển 3
exports.confirmEmployeeTransport3 = async (req, res) => {
  try {
    const {portal} = req;
    const {employeeId} = req.params;
    await EmployeeService.confirmEmployeeTransport3(portal, employeeId);
    res.status(200).json({messages: [`Confirm employee ${employeeId} success`]});
  } catch (error) {
    await Log.error(`Error at confirmEmployeeTransport3: ${error}`);
    res.status(500).json({error: error.message});
  }
}

// Xóa nhân viên vận chuyển 3
exports.removeEmployeeTransport3 = async (req, res) => {
  try {
    const {portal} = req;
    const {employeeId} = req.params;
    await EmployeeService.removeEmployeeTransport3(portal, employeeId);
    res.status(200).json({messages: [`Remove employee ${employeeId} success`]});
  } catch (error) {
    await Log.error(`Error at removeEmployeeTransport3: ${error}`);
    res.status(500).json({error: error.message});
  }
}

exports.getInfoEmployeeTransport3 = async (req, res) => {
  try {
    const {portal} = req;
    const {employeeId} = req.params;
    const result = await EmployeeService.getInfoEmployeeTransport3(portal, employeeId);
    res.status(200).json(result);
  } catch (error) {
    await Log.error(`Error at getInfoEmployeeTransport3: ${error}`);
    res.status(500).json({error: error.message});
  }
}

exports.getMyEmployees = async (req, res) => {
    try {
        const {portal} = req;
        const result = await EmployeeService.getMyEmployees(portal, req.user);
        res.status(200).json(result);
    } catch (error) {
        await Log.error(`Error at getMyEmployees: ${error}`);
        res.status(500).json({error: error.message});
    }
}
