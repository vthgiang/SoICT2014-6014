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
    WorkPlan: require('./human-resource/workPlan.model'),
    Salary: require('./human-resource/salary.model'),
    Timesheet: require('./human-resource/timesheet.model'),
    Field: require('./human-resource/field.model'),


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
    ModuleConfiguration: require('./super-admin/moduleConfiguration.model'),

    Company: require('./system-admin/company.model'),
    Configuration: require('./system-admin/configuration.model'),
    SystemComponent: require('./system-admin/systemComponent.model'),
    SystemLink: require('./system-admin/systemLink.model'),
    RootRole: require('./system-admin/rootRole.model'),
    SystemApi: require('./system-admin/systemApi.model'),
    PrivilegeApi: require('./auth/privilegeApi.model'),

    Task: require('./task/task.model'),
    TaskTemplate: require('./task/taskTemplate.model'),
    TaskProcess: require("./task/taskProcess.model"),
    ProcessTemplate: require("./task/processTemplate.model"),

    Course: require('./training/course.model'),
    EducationProgram: require('./training/educationProgram.model'),

    // Asset
    Asset: require('./asset/asset.model'), // Tài sản
    AssetType: require('./asset/assetType.model'), // Loại tài sản
    RecommendProcure: require('./asset/assetPurchaseRequest.model'), // Đề nghị mua sắm thiết bị
    RecommendDistribute: require('./asset/assetUseRequest.model'), // Đề nghị cấp phát thiết bị
    // Report
    TaskReport: require('./report/taskReport.model'),

    // Warehouse
    Stock: require('./production/warehouse/stock.model'),
    BinLocation: require('./production/warehouse/binLocation.model'),
    Proposal: require('./production/warehouse/proposal.model'),
    Partner: require('./production/warehouse/partner.model'),
    Good: require('./production/common-production/good.model'),
    Lot: require('./production/common-production/lot.model'),
    Category: require('./production/common-production/category.model'),
    Bill: require('./production/warehouse/bill.model'),

    // Customer Management
    Customer: require('./crm/customer.model'),
    Care: require('./crm/care.model'),
    CareType: require('./crm/careType.model'),
    Group: require('./crm/group.model'),
    Status: require('./crm/status.model'),
    CustomerRankPoint: require('./crm/customerRankPoint.model'),
    Product: require('./crm/product.model'),
    ProductCategory: require('./crm/productCategory.model'),
    ProductDiscount: require('./crm/productDiscount.model'),
    CrmTask: require('./crm/crmTask.model'),
    CrmTaskTemplate:require('./crm/crmTaskTemplate.model'),
    CrmUnit:require('./crm/crmUnit.model'),
    CrmUnitKPI:require('./crm/crmUnitKPI.model'),
    //order
    BankAccount: require('./production/order/bankAccount.model'),
    Discount: require('./production/order/discount.model'),
    CoinRule: require('./production/order/coinRule.model'),
    Quote: require('./production/order/quote.model'),
    Tax: require('./production/order/tax.model'),
    SalesOrder: require('./production/order/salesOrder.model'),
    ServiceLevelAgreement: require('./production/order/serviceLevelAgreement.model'),
    PurchaseOrder: require('./production/order/purchaseOrder.model'),
    BusinessDepartment: require('./production/order/businessDepartment.model'),
    Payment: require('./production/order/payment.model'),

    Location: require('./common/location.model'),

    // plan
    Plan: require('./plan/plan.model'),

    // Example
    Example: require('./example/example.model'),

    // production-manufacturing
    ManufacturingMill: require('./production/manufacturing/manufacturingMill.model'),
    ManufacturingWorks: require('./production/manufacturing/manufacturingWorks.model'),
    ManufacturingPlan: require('./production/manufacturing/manufacturingPlan.model'),
    ManufacturingCommand: require('./production/manufacturing/manufacturingCommand.model'),
    PurchasingRequest: require('./production/manufacturing/purchasingRequest.model'),
    WorkSchedule: require('./production/manufacturing/workSchedule.model'),

    // transport
    TransportRequirement: require('./production/transport/transportRequirement.model'),
    TransportPlan: require('./production/transport/transportPlan.model'),
    TransportVehicle: require('./production/transport/transportVehicle.model'),
    TransportSchedule: require('./production/transport/transportSchedule.model'),
    TransportDepartment: require('./production/transport/transportDepartment.model'),
    
    // project
    Project: require('./project/project.model'),
    ProjectChangeRequest: require('./project/projectChangeRequest.model'),

    // news feed
    NewsFeed: require('./news-feed/newsFeed.model')
}
