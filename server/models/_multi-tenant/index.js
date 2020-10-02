module.exports = {
    Privilege: require('./auth/privilege.model'),
    Role: require('./auth/role.model'),
    User: require('./auth/user.model'),
    UserRole: require('./auth/userRole.model'),

    Document: require('./document/document.model'),
    DocumentCategory: require('./document/documentCategory.model'),
    DocumentDomain: require('./document/documentDomain.model'),
    DocumentArchive: require('./document/documentArchive.model'),

    AnnualLeave: require('./human-resource/annualLeave.model'),
    Commendation: require('./human-resource/commendation.model'),
    Discipline: require('./human-resource/discipline.model'),
    Employee: require('./human-resource/employee.model'),
    Holiday: require('./human-resource/holiday.model'),
    Salary: require('./human-resource/salary.model'),
    Timesheet: require('./human-resource/timesheet.model'),

    EmployeeKpi: require('./kpi/employeeKpi.model'),
    EmployeeKpiSet: require('./kpi/employeeKpiSet.model'),
    OrganizationalUnitKpi: require('./kpi/organizationalUnitKpi.model'),
    OrganizationalUnitKpiSet: require('./kpi/organizationalUnitKpiSet.model'),

    Notification: require('./notification/notification.model'),
    ManualNotification: require('./notification/manualNotification.model'),

    Component: require('./super-admin/component.model'),
    Link: require('./super-admin/link.model'),
    OrganizationalUnit: require('./super-admin/organizationalUnit.model'),
    RoleType: require('./super-admin/roleType.model'),

    Company: require('./system-admin/company.model'),
    Configuration: require('./system-admin/configuration.model'),
    SystemComponent: require('./system-admin/systemComponent.model'),
    SystemLink: require('./system-admin/systemLink.model'),
    RootRole: require('./system-admin/rootRole.model'),

    Task: require('./task/task.model'),
    TaskComment: require('./task/taskComment.model'),
    TaskFile: require('./task/taskFile.model'),
    TaskHistory: require('./task/taskHistory.model'),
    TaskResult: require('./task/taskResult.model'),
    TaskResultInformation: require('./task/taskResultInformation.model'),
    TaskTemplate: require('./task/taskTemplate.model'),
    TaskTemplateInformation: require('./task/taskTemplateInformation.model'),
    TimesheetLog: require('./task/timesheetLog.model'),
    TaskProcess: require("./task/taskProcess.model"),
    ProcessTemplate: require("./task/processTemplate.model"),

    Course: require('./training/course.model'),
    EducationProgram: require('./training/educationProgram.model'),
    EmployeeCourse: require('./training/employeeCourse.model'),

    //asset
    Asset: require('./asset/asset.model'), //tài sản
    AssetType: require('./asset/assetType.model'), //loại tài sản
    RecommendProcure: require('./asset/assetPurchaseRequest.model'), //đề nghị mua sắm thiết bị
    RecommendDistribute: require('./asset/assetUseRequest.model'), //đề nghị cấp phát thiết bị
    //report
    TaskReport: require('./report/taskReport.model'),

    //material
    Material: require('./warehouse/material.model'),
    Stock: require('./warehouse/stock.model'),
    BinLocation: require('./warehouse/binLocation.model'),
    Proposal: require('./warehouse/proposal.model'),
    Partner: require('./warehouse/partner.model'),
    Good: require('./warehouse/good.model'),
    Consignment: require('./warehouse/consignment.model'),
    Category: require('./warehouse/category.model'),
    Bill: require('./warehouse/bill.model'),

    // Customer Management
    Lead: require('./crm/lead.model'),
    Care: require('./crm/care.model'),
    CareType: require('./crm/careType.model'),
    Group: require('./crm/group.model'),
    status: require('./crm/status.model'),
    status: require('./crm/status.model'),
    Product: require('./crm/product.model'),
    ProductCategory: require('./crm/productCategory.model'),
    ProductDiscount: require('./crm/productDiscount.model'),


    //order
    Order: require("./order/order.model"),

    Location: require('./common/location.model'),

    // plan
    Plan: require('./plan/plan.model'),

    // Example
    Example: require('./example/example.model'),
}