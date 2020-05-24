const { LogInfo, LogError } = require('../../../../logs');
const DashboardService = require('./dashboard.service');

// Lấy tất cả KPI của nhân viên theo vai trò
exports.getAllEmployeeKpiSetOfUnitByRole = async (req, res) => {
    try {
        const employeeKpis = await DashboardService.getAllEmployeeKpiSetOfUnitByRole(req.params.role);
        await LogInfo(req.user.emai, `GET_ALL_EMPLOYEE_KPI_SET`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_success'],
            content: employeeKpis
        });
    } catch (error) {
        await LogError(req.user.emai, `GET_ALL_EMPLOYEE_KPI_SET`, req.user.company);
        res.status(400).json({
            messages: ['get_all_kpi_member_fail'],
            content: error
        });
    }
};

// Lấy tất cả nhân viên theo vai trò
exports.getAllEmployeeOfUnitByRole = async (req, res) => {
    try {
        const employees = await DashboardService.getAllEmployeeOfUnitByRole(req.params.role);
        await LogInfo(req.user.emai, `GET_ALL_EMPLOYEE`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_success'],
            content: employees
        });
    } catch (error) {
        await LogError(req.user.emai, `GET_ALL_EMPLOYEE`, req.user.company);
        res.status(400).json({
            messages: ['get_all_employee_fail'],
            content: error
        });
    }
};


// Lấy tất cả KPI của nhân viên theo mảng id đơn vị
exports.getAllEmployeeKpiSetOfUnitByIds = async (req, res) => {
    try {
        const employeeKpis = await DashboardService.getAllEmployeeKpiSetOfUnitByIds(req.params.id.split(','));
        await LogInfo(req.user.emai, `GET_ALL_EMPLOYEE_KPI_SET`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_success'],
            content: employeeKpis
        });
    } catch (error) {
        await LogError(req.user.emai, `GET_ALL_EMPLOYEE_KPI_SET`, req.user.company);
        res.status(400).json({
            messages: ['get_all_kpi_member_fail'],
            content: error
        });
    }
};

// Lấy tất cả nhân viên theo mảng id đơn vị
exports.getAllEmployeeOfUnitByIds = async (req, res) => {
    try {
        const employees = await DashboardService.getAllEmployeeOfUnitByIds(req.params.id.split(','));
        await LogInfo(req.user.emai, `GET_ALL_EMPLOYEE`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_success'],
            content: employees
        });
    } catch (error) {
        await LogError(req.user.emai, `GET_ALL_EMPLOYEE`, req.user.company);
        res.status(400).json({
            messages: ['get_all_employee_fail'],
            content: error
        });
    }
};



// Lấy các đơn vị con của một đơn vị và đơn vị đó
exports.getChildrenOfOrganizationalUnitsAsTree = async (req, res) => {
    try {
        var tree = await DashboardService.getChildrenOfOrganizationalUnitsAsTree(req.user.company._id, req.params.role);
        
        await LogInfo(req.user.email, 'GET_CHILDREN_DEPARTMENTS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_children_departments_success'],
            content: tree
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_CHILDREN_DEPARTMENTS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_children_departments_faile'],
            content: error
        });
    }
    
};