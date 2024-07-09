module.exports = {
    Privilege: require('./auth/privilege.model'),
    Role: require('./auth/role.model'),
    User: require('./auth/user.model'),
    UserRole: require('./auth/userRole.model'),
    Policy: require('./auth/policy.model'),
    Service: require('./auth-service/service.model'),
    Requester: require('./auth-service/requester.model'),
    Resource: require('./auth-service/resource.model'),
    AuthorizationPolicy: require('./auth-service/authorization.policy.model'),
    AuthorizationAccessLog: require('./auth-service/authorization.log.model'),
    DynamicAssignment: require('./auth-service/dynamic.assignment.model'),

    Document: require('./document/document.model'),
    DocumentCategory: require('./document/documentCategory.model'),
    DocumentDomain: require('./document/documentDomain.model'),
    DocumentArchive: require('./document/documentArchive.model'),

    HyperParameter: require('./AImodel/hyperparameter.model'),

    AnnualLeave: require('./human-resource/annualLeave.model'),
    Commendation: require('./human-resource/commendation.model'),
    Discipline: require('./human-resource/discipline.model'),
    Employee: require('./human-resource/employee.model'),
    WorkPlan: require('./human-resource/workPlan.model'),
    Salary: require('./human-resource/salary.model'),
    Timesheet: require('./human-resource/timesheet.model'),
    Field: require('./human-resource/field.model'),

    Tag: require('./bidding/tag.model'),
    Major: require('./human-resource/major.model'),
    Certificate: require('./human-resource/certificate.model'),
    CareerPosition: require('./human-resource/careerPosition.model'),
    CareerField: require('./human-resource/careerField.model'),
    CareerAction: require('./human-resource/careerAction.model'),
    BiddingPackage: require('./bidding/biddingPackage.model'),

    BiddingContract: require('./bidding/biddingContract.model'),

    EmployeeKpi: require('./kpi/employeeKpi.model'),
    EmployeeKpiSet: require('./kpi/employeeKpiSet.model'),
    OrganizationalUnitKpi: require('./kpi/organizationalUnitKpi.model'),
    OrganizationalUnitKpiSet: require('./kpi/organizationalUnitKpiSet.model'),
    OrganizationalUnitKpiSetTemplate: require('./kpi/organizationalUnitKpiSetTemplate.model'),
    OrganizationalUnitKpiTemplate: require('./kpi/organizationalUnitKpiTemplate.model'),
    AllocationConfigSetting: require('./kpi/allocationConfigSetting.model'),
    TaskPackageAllocation: require('./kpi/taskPackageAllocation.model'),
    TaskType: require('./kpi/taskType.model'),
    AllocationUnitResult: require('./kpi/allocationResult.model'),
    AllocationTaskAssigned: require('./task/allocationTask.model'),

    Notification: require('./notification/notification.model'),
    ManualNotification: require('./notification/manualNotification.model'),

    Component: require('./super-admin/component.model'),
    Link: require('./super-admin/link.model'),
    Attribute: require('./super-admin/attribute.model'),
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
    TaskProcess: require('./task/taskProcess.model'),
    ProcessTemplate: require('./task/processTemplate.model'),

    Course: require('./training/course.model'),
    EducationProgram: require('./training/educationProgram.model'),

    //asset
    Asset: require('./asset/asset.model'), //tài sản
    AssetType: require('./asset/assetType.model'), //loại tài sản
    AssetLot: require('./asset/assetLot.model'),
    RecommendProcure: require('./asset/assetPurchaseRequest.model'), //đề nghị mua sắm thiết bị
    RecommendDistribute: require('./asset/assetUseRequest.model'), //đề nghị cấp phát thiết bị

    //supplies
    Supplies: require('./supplies/supplies.model'),
    SuppliesPurchaseRequest: require('./supplies/suppliesPurchaseRequest.model'),
    PurchaseInvoice: require('./supplies/purchaseInvoice.model'),
    AllocationHistory: require('./supplies/allocationHistory.model'),

    //report
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
    ProductRequestManagement: require('./production/common-production/productRequestManagement.model'),
    Layout: require('./production/warehouse/layout.model'),
    InventoryWarehouse: require('./production/warehouse/inventoryWarehouse.model'),
    Inventory: require('./production/warehouse/inventory.model'),
    InventoryForecast: require('./production/warehouse/inventoryForecast.model'),
    // Customer Management
    Customer: require('./customer-care/customer.model'),
    CustomerForecast: require('./customer-care/customerForecast.model'),
    CustomerCare: require('./customer-care/customerCare.model'),
    CustomerCareType: require('./customer-care/customerCareType.model'),
    CustomerGroup: require('./customer-care/customerGroup.model'),
    CustomerStatus: require('./customer-care/customerStatus.model'),
    CustomerRankPoint: require('./customer-care/customerRankPoint.model'),
    CustomerMarketing: require('./customer-care/customerMarketing.model'),
    Product: require('./customer-care/product.model'),
    ProductCategory: require('./customer-care/productCategory.model'),
    ProductDiscount: require('./customer-care/productDiscount.model'),
    CustomerCareTask: require('./customer-care/customerCareTask.model'),
    CustomerCareTaskTemplate: require('./customer-care/customerCareTaskTemplate.model'),
    CustomerCareUnit: require('./customer-care/customerCareUnit.model'),
    CustomerCareUnitKPI: require('./customer-care/customerCareUnitKPI.model'),
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
    MarketingCampaign: require('./production/order/marketingCampaign.model'),
    MarketingEffective: require('./production/order/marketingEffective.model'),
    Location: require('./common/location.model'),
    TotalOrder: require('./production/order/totalOrder.model'),
    SalesForecast: require('./production/order/salesForecast.model'),

    // plan
    Plan: require('./plan/plan.model'),

    // Example
    Example: require('./example/example.model'),

    // Delegation
    Delegation: require('./delegation/delegation.model'),
    DelegationPolicy: require('./delegation/delegation.policy.model'),

    // Identity server
    ExternalPolicy: require('./identity.service/external.policy.model'),
    ExternalServiceConsumer: require('./identity.service/external.service.consumer.model'),
    InternalPolicy: require('./identity.service/internal.policy.model'),
    InternalServiceIdentity: require('./identity.service/internal.service.identity.model'),
    LoggingRecord: require('./identity.service/logging.model'),

    // production-manufacturing
    ManufacturingMill: require('./production/manufacturing/manufacturingMill.model'),
    ManufacturingWorks: require('./production/manufacturing/manufacturingWorks.model'),
    ManufacturingPlan: require('./production/manufacturing/manufacturingPlan.model'),
    ManufacturingCommand: require('./production/manufacturing/manufacturingCommand.model'),
    PurchasingRequest: require('./production/manufacturing/purchasingRequest.model'),
    WorkSchedule: require('./production/manufacturing/workSchedule.model'),
    ManufacturingQualityError: require('./production/manufacturing/manufacturingQualityError.model'),
    ManufacturingQualityCriteria: require('./production/manufacturing/manufacturingQualityCriteria.model'),
    ManufacturingQualityInspection: require('./production/manufacturing/manufacturingQualityInspection.model'),
    ManufacturingRouting: require('./production/manufacturing/manufacturingRouting.model'),
    // transport
    TransportRequirement: require('./production/transport/transportRequirement.model'),
    TransportPlan: require('./production/transport/transportPlan.model'),
    TransportVehicle: require('./production/transport/transportVehicle.model'),
    TransportSchedule: require('./production/transport/transportSchedule.model'),
    TransportDepartment: require('./production/transport/transportDepartment.model'),

    // project
    Project: require('./project/project.model'),
    ProjectTemplate: require('./project/projectTemplate.model'),
    ProjectChangeRequest: require('./project/projectChangeRequest.model'),
    ProjectPhase: require('./project/projectPhase.model'),
    ProjectMilestone: require('./project/projectMilestone.model'),

    // news feed
    NewsFeed: require('./news-feed/newsFeed.model'),

    //Manufacturing-process
    ProductionLine: require('./manufacturing-process/ProductionLine.model'),
    ProductionActivity: require('./manufacturing-process/ProductionActivity.model'),
    ManufacturingProcess: require('./manufacturing-process/ManufacturingProcess.model'),
    ProductionActivityIssue: require('./manufacturing-process/ProductionActivityIssue.model'),
    ActivityAssetTemplate: require('./manufacturing-process/ActivityAssetTemplate.model'),
    NewsFeed: require('./news-feed/newsFeed.model'),
    //Risk
    Risk: require('./risk/risk.model'),
    // Risk Distribution
    RiskDistribution: require('./risk-distribution/riskDistribution.model'),
    TaskDistribution: require('./task-distribution/taskDistribution.model'),
    Impact: require('./risk/impact.model'),
    BayesDataset: require('./risk-distribution/bayesDataset.model'),
    PertEstimation: require('./task-distribution/pertEstimation.model'),
    Exprimental: require('./risk/exprimentalAnalysis.model'),
    RiskResponsePlan: require('./risk/riskResponsePlan.model'),
    RiskResponsePlanRequest: require('./risk/riskResponsePlanRequest.model'),

    // Transportation
    Vehicle: require('./transportation/vehicle/vehicle.model'),
    ProblemAssumption: require('./transportation/delivery-plan/problemAssumption.model'),
    DeliveryPlan: require('./transportation/delivery-plan/deliveryPlan.model'),
    Solution: require('./transportation/delivery-plan/solution.model'),
    Journey: require('./transportation/delivery-plan/journey.model'),
    VehicleSchedule: require('./transportation/vehicle/vehicleSchedule.model'),
    EmployeeWorkingSchedule: require('./employee-schedule/employeeWorkingSchedule.model'),
    VehicleCost: require('./transportation/cost/vehicleCost.model'),
    ShipperCost: require('./transportation/cost/shipperCost.model'),
    CostFormula: require('./transportation/cost/costFormula.model'),
    Driver: require('./transportation/driver/driver.model'),
    ShipperSalary: require('./transportation/driver/shipperSalary.model'),

    // Transport 3
    Transport3Order: require('./transport3/transport3Order.model'),
    Transport3Employee: require('./transport3/transport3Employee.model'),
    Transport3Vehicle: require('./transport3/transport3Vehicle.model'),
    Transport3Schedule: require('./transport3/transport3Schedule.model'),
    Transport3Issue: require('./transport3/transport3Issue.model'),
    DeliverySchedule: require('./transportation/delivery-plan/deliverySchedule.model'),

    // New Models
    Capacity: require('./human-resource/capacity.model'),
};
