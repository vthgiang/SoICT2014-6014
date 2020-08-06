const EmployeeKpiSetService = require('./creation.service');
const KPIPersonalController = require("../../employee/management/management.controller");
const {  LogInfo,  LogError } = require('../../../../logs');

// Điều phối đến các hàm thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

/** Lấy tập KPI cá hiện hiện tại */  
exports.getEmployeeKpiSet = async (req, res) => {
    if (req.query.userId && req.query.startDate && req.query.endDate) {
        this.getAllEmployeeKpiSetByMonth(req, res);
    }
    else if (req.query.unitKpiSetByMonth) {
        KPIPersonalController.getAllEmployeeKpiSetInOrganizationalUnit(req, res);
    }
    else if (req.query.unitKpiSetByEmployeeKpiSetDate) {
        KPIPersonalController.getAllKPIEmployeeSetsInOrganizationByMonth(req, res);
    }
    else if (req.query.organizationalUnitIds && req.query.startDate && req.query.endDate) {
        this.getAllEmployeeKpiSetOfAllEmployeeInOrganizationalUnitByMonth(req, res);
    }
    else if (req.query.employeeKpiInChildUnit) {
        KPIPersonalController.getAllEmployeeKpiInChildrenOrganizationalUnit(req, res)
    }
    else {
        try {
            var employeeKpiSet = await EmployeeKpiSetService.getEmployeeKpiSet(req.query.userId, req.query.role, req.query.month);
            await LogInfo(req.user.email, ` get employee kpi set by user id `, req.user.company);
            res.status(200).json({
                success: true,
                messages: ['Get employee kpi set successfully'],
                content: employeeKpiSet
            });
        } catch (error) {
            await LogError(req.user.email, ` get employee kpi set by user id `, req.user.company)
            res.status(400).json({
                success: false,
                messages: ['Get employee kpi set unsuccessfully'],
                content: error
            });
        }
    }
}

/** Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước */
exports.getAllEmployeeKpiSetByMonth = async (req, res) => {
    try {
        const employeeKpiSetByMonth = await EmployeeKpiSetService.getAllEmployeeKpiSetByMonth(req.query.userId, req.query.startDate, req.query.endDate);

        await LogInfo(req.user.email, ` get all employee kpi set by month `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Get all employee kpi set by month successfully'],
            content: employeeKpiSetByMonth
        });
    } catch (error) {
        await LogError(req.user.email, ` get all employee kpi set by month `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['Get all employee kpi set by month unsuccessfully'],
            content: error
        });
    }
}

/** Lấy tất cả các tập KPI của tất cả nhân viên trong mảng đơn vị cho trước theo thời gian */
exports.getAllEmployeeKpiSetOfAllEmployeeInOrganizationalUnitByMonth = async (req, res) => {
    try {
        const employeeKpiSetsInOrganizationalUnitByMonth = await EmployeeKpiSetService.getAllEmployeeKpiSetOfAllEmployeeInOrganizationalUnitByMonth(req.query.organizationalUnitIds, req.query.startDate, req.query.endDate);
        
        await LogInfo(req.user.email, ` get all employee kpi set of all employee in organizational unit by month `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Get all employee kpi set of all employee in organizational unit by month successfully'],
            content: employeeKpiSetsInOrganizationalUnitByMonth
        });
    } catch (error) {
        await LogError(req.user.email, ` get all employee kpi set of all employee in organizational unit by month `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['Get all employee kpi set of all employee in organizational unit by month unsuccessfully'],
            content: error
        });
    }
}

/** Khởi tạo KPI cá nhân */ 
exports.createEmployeeKpiSet = async (req, res) => {
    try {
        var employeeKpiSet = await EmployeeKpiSetService.createEmployeeKpiSet(req.body);

        await LogInfo(req.user.email, ` create employee kpi set `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['initialize_employee_kpi_set_success'],
            content: employeeKpiSet
        })
    } catch (error) {
        await LogError(req.user.email, ` create employee kpi set `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['initialize_employee_kpi_set_failure'],
            content: error
        });
    }
  
}

/** Tạo 1 mục tiêu KPI mới */ 
exports.createEmployeeKpi = async (req, res) => {
    try {
        
        var employeeKpi = await EmployeeKpiSetService.createEmployeeKpi(req.body);
        await LogInfo(req.user.email, ` create employee kpi `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['create_employee_kpi_success'],
            content: employeeKpi
        })
    } catch (error) {
        await LogError(req.user.email, ` create employee kpi `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['create_employee_kpi_failure'],
            content: error
        })
    }
}

/** Chỉnh sửa thông tin chung của KPI cá nhân */ 
exports.editEmployeeKpiSet = async (req, res) => {
    if(req.query.status){
        
        this.updateEmployeeKpiSetStatus(req,res);
    }
    else{
        try {
            var employeeKpiSet= await EmployeeKpiSetService.editEmployeeKpiSet(req.body.date,req.params.id);
            await LogInfo(req.user.email, ` edit employee kpi set `, req.user.company)
            res.status(200).json({
                success: true,
                messages: ['edit_employee_kpi_set_success'],
                content: employeeKpiSet
            });
         } catch (error) {
             await LogError(req.user.email, ` edit employee kpi set `, req.user.company)
            res.status(400).json({
                 success: false,
                 messages: ['edit_employee_kpi_set_failure'],
                 content: error
             });
        }
    }
}

/** Chỉnh sửa trạng thái của KPI cá nhân */ 
exports.updateEmployeeKpiSetStatus = async (req, res) => {
    try{
        
        var employeeKpiSet = await EmployeeKpiSetService.updateEmployeeKpiSetStatus(req.params.id,req.query.status);
        await LogInfo(req.user.email, ` edit employee kpi set status `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['approve_success'],
            content: employeeKpiSet
        })
    } catch (error) {
        await LogError(req.user.email, ` edit employee kpi set status `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['approve_failure'],
            content: error
        })
    }
}

/** Xóa KPI cá nhân */ 
exports.deleteEmployeeKpiSet = async (req, res) => {
    try {
        var arr = await EmployeeKpiSetService.deleteEmployeeKpiSet(req.params.id);
        employeeKpiSet = arr[0];
        kpis = arr[1];
        await LogInfo(req.user.email, ` delete employee kpi set `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['delete_employee_kpi_set_success'],
            content: employeeKpiSet,
            kpis: kpis
        })
    } catch (error) {
        await LogError(req.user.email, ` delete employee kpi set `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['delete_employee_kpi_set_failure'],
            content: error
        })

    }
}

/** Xóa 1 mục tiêu KPI cá nhân */ 
exports.deleteEmployeeKpi = async (req, res) => {
    try {
        var employeeKpiSet = await EmployeeKpiSetService.deleteEmployeeKpi(req.params.id,req.query.employeeKpiSetId);
        await LogInfo(req.user.email, ` delete employee kpi `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['delete_employee_kpi_success'],
            content: employeeKpiSet,
        })
    } catch (error) {
        await LogError(req.user.email, ` delete employee kpi `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['delete_employee_kpi_failure'],
            content: error
        });
    }
    return EmployeeKpiSetService.deleteEmployeeKpi(req.params.id,req.params.kpipersonal);
}

/**
 * Tạo comment trong trang create KPI employee
 */
exports.createComment = async (req,res)=> {
    try {
        var files=[] ;
        if(req.files !== undefined){
            req.files.forEach((elem,index) => {
                var path = elem.destination +'/'+ elem.filename;
                files.push({name : elem.originalname, url: path})
                
            })
        }
        var comments = await EmployeeKpiSetService.createComment(req.params,req.body,files);
        await LogInfo(req.user.email, ` create comment `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['create_comment_success'],
            content: comments
        })
    } catch (error) {
        
    }
}

/**
 * 
 * Tạo comment trong comment trong trang create KPI employee (tạo replied comment)
 */
exports.createCommentOfComment = async (req,res)=> {
    try {
        var files=[] ;
        if(req.files !== undefined){
            req.files.forEach((elem,index) => {
                var path = elem.destination +'/'+ elem.filename;
                files.push({name : elem.originalname, url: path})
                
            })
        }
        var comments = await EmployeeKpiSetService.createCommentOfComment(req.params,req.body,files);
        await LogInfo(req.user.email, ` create comment `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['create_comment_of_comment_success'],
            content: comments
        })
    } catch (error) {
    
    }
}

/**
 * 
 *Sửa comment trong trang create KPI employee
 */
exports.editComment = async (req,res)=> {
    try {
        let comments = await EmployeeKpiSetService.editComment(req.params, req.body);
        
        await LogInfo(req.user.email, ` edit comment `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['edit_comment_success'],
            content: comments
        })
    } catch (error) {
        res.status(400).json({
            success: true,
            messages: ['edit_comment_fail'],
            content: error
        })
    }
}

/**
 * Xóa comment trong trang create KPI employee
 */
exports.deleteComment = async (req,res)=> {
    try {
        var comments = await EmployeeKpiSetService.deleteComment(req.params);
        await LogInfo(req.user.email, ` delete comment `,req.user.company)
        res.status(200).json({
            success: false,
            messages: ['delete_comment_success'],
            content: comments
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            messages: ['delete_comment_fail'],
            content: error
        })
    }
}
/**
 * Sửa 1 comment trong trang create KPI employee (xóa comment replied)
 */
exports.editCommentOfComment = async (req,res)=> {
    try {
        var comments = await EmployeeKpiSetService.editCommentOfComment(req.params,req.body);
        await LogInfo(req.user.email, ` edit comment of comment `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['edit_comment_of_comment_success'],
            content: comments
        })
    } catch (error) {
        res.status(400).json({
            success: true,
            messages: ['edit_comment_of_comment_fail'],
            content: error
        })
    }
}

/**
 * Xóa comment của commnent trong trang create KPI employee (xóa comment replied)
 */
exports.deleteCommentOfComment = async (req,res)=> {
    try {
        var comments = await EmployeeKpiSetService.deleteCommentOfComment(req.params);
        await LogInfo(req.user.email, ` delete comment of comment `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['delete_comment_of_comment_success'],
            content: comments
        })
    } catch (error) {
        res.status(400).json({
            success: true,
            messages: ['delete_comment_of_comment_fail'],
            content: error
        })
    }
}
