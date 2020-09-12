module.exports = {
    // asset
    Asset: require('./asset/asset.model'),
    AssetPurchaseRequest: require('./asset/assetPurchaseRequest.model'),
    AssetType: require('./asset/assetType.model'),
    AssetUseReques: require('./asset/assetUseRequest.model'),

    // auth
    Privilege: require('./auth/privilege.model'),
    Role: require('./auth/role.model'),
    User: require('./auth/user.model'),
    UserRole: require('./auth/userRole.model'),

    // common
    Location: require('./common/location.model'),

    // crm
    CrmCare: require('./crm/crmCare.model'),
    CrmCustomer: require('./crm/crmCustomer.model'),
    CrmGroup: require('./crm/crmGroup.model'),
    CrmLiability: require('./crm/crmLiability.model'),

    // document
    Document: require('./document/document.model'),
    DocumentArchive: require('./document/documentArchive.model'),
    DocumentCategory: require('./document/documentCategory.model'),
    DocumentDomain: require('./document/documentDomain.model'),
    
    // human-resource
    AnnualLeave: require('./human-resource/annualLeave.model'),
    Commendation: require('./human-resource/commendation.model'),
    Discipline: require('./human-resource/discipline.model'),
    Employee: require('./human-resource/employee.model'),
    Holiday: require('./human-resource/holiday.model'),
    Salary: require('./human-resource/salary.model'),
    Timesheet: require('./human-resource/timesheet.model'),

    // kpi
    EmployeeKpi: require('./kpi/employeeKpi.model'),
    EmployeeKpiSet: require('./kpi/employeeKpiSet.model'),
    OrganizationalUnitKpi: require('./kpi/organizationalUnitKpi.model'),
    OrganizationalUnitKpiSet: require('./kpi/organizationalUnitKpiSet.model'),

    // notification
    ManualNotification: require('./notification/manualNotification.model'),
    Notification: require('./notification/notification.model'),

    // order
    Order: require('./order/order.model'),

    // plan
    Plan: require('./plan/plan.model'),

    // report
    TaskReport: require('./report/taskReport.model'),

    // super-admin
    Component: require('./super-admin/component.model'),
    Link: require('./super-admin/link.model'),
    OrganizationalUnit: require('./super-admin/organizationalUnit.model'),
    RoleType: require('./super-admin/roleType.model'),

    // system-admin
    Company: require('./system-admin/company.model'),
    Configuration: require('./system-admin/configuration.model'),
    ImportConfiguration: require('./system-admin/importConfiguration.model'),
    RootRole: require('./system-admin/rootRole.model'),
    SystemComponent: require('./system-admin/systemComponent.model'),
    SystemLink: require('./system-admin/systemLink.model'),

    // task
    ProcessTemplate: require('./task/processTemplate.model'),
    Task: require('./task/task.model'),
    TaskComment: require('./task/taskComment.model'),
    TaskFile: require('./task/taskFile.model'),
    TaskHistory: require('./task/taskHistory.model'),
    TaskProcess: require('./task/taskProcess.model'),
    TaskResult: require('./task/taskResult.model'),
    TaskResultInformation: require('./task/taskResultInformation.model'),
    TaskTemplate: require('./task/taskTemplate.model'),
    TaskTemplateInformation: require('./task/taskTemplateInformation.model'),
    TimesheetLog: require('./task/timesheetLog.model'),

    // training
    Course: require('./training/course.model'),
    EducationProgram: require('./training/educationProgram.model'),
    EmployeeCourse: require('./training/employeeCourse.model'),


    // warehouse
    Material: require('./warehouse/material.model'),
}