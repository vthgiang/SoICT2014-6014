const Privilege = require('./auth/privilege.model');
const Role = require('./auth/role.model');
const User = require('./auth/user.model');
const UserRole = require('./auth/userRole.model');

const Document = require('./document/document.model');
const DocumentCategory = require('./document/documentCategory.model');
const DocumentDomain = require('./document/documentDomain.model');
const DocumentArchive = require('./document/documentArchive.model')

const AnnualLeave = require('./human-resource/annualLeave.model');
const Commendation = require('./human-resource/commendation.model');
const Discipline = require('./human-resource/discipline.model');
const Employee = require('./human-resource/employee.model');
const Holiday = require('./human-resource/holiday.model');
const Salary = require('./human-resource/salary.model');
const Timesheets = require('./human-resource/timesheets.model');

const EmployeeKpi = require('./kpi/employeeKpi.model');
const EmployeeKpiSet = require('./kpi/employeeKpiSet.model');
const OrganizationalUnitKpi = require('./kpi/organizationalUnitKpi.model');
const OrganizationalUnitKpiSet = require('./kpi/organizationalUnitKpiSet.model');

const Notification = require('./notification/notification.model');
const ManualNotification = require('./notification/manualNotification.model');

const Action = require('./super-admin/action.model');
const Component = require('./super-admin/component.model');
const Link = require('./super-admin/link.model');
const OrganizationalUnit = require('./super-admin/organizationalUnit.model');
const RoleType = require('./super-admin/roleType.model');

const Company = require('./system-admin/company.model');
const Log = require('./system-admin/log.model');
const SystemComponent = require('./system-admin/systemComponent.model');
const SystemLink = require('./system-admin/systemLink.model');
const RootRole = require('./system-admin/rootRole.model');

const Task = require('./task/task.model');
const TaskComment = require('./task/taskComment.model');
const TaskFile = require('./task/taskFile.model');
const TaskHistory = require('./task/taskHistory.model');
const TaskResult = require('./task/taskResult.model');
const TaskResultInformation = require('./task/taskResultInformation.model');
const TaskTemplate = require('./task/taskTemplate.model');
const TaskTemplateInformation = require('./task/taskTemplateInformation.model');
const TimesheetLog = require('./task/timesheetLog.model');

const Course = require('./training/course.model');
const EducationProgram = require('./training/educationProgram.model');
const EmployeeCourse = require('./training/employeeCourse.model');
const ImportConfiguraion = require('./system-admin/importConfiguration.model')

//asset
const Asset = require('./asset/asset.model'); //tài sản
const AssetType = require('./asset/assetType.model'); //loại tài sản
const RecommendProcure = require('./asset/recommendProcure.model'); //đề nghị mua sắm thiết bị
const RecommendDistribute = require('./asset/recommendDistribute.model'); //đề nghị cấp phát thiết bị
const TaskProcess = require("./task/taskProcess.model")
//report
const TaskReport = require('./report/taskReport.model');

//material
const Material = require('./warehouse/material.model');
// Customer Management
const Customer = require('./customer/customer.model');
const CustomerLocation = require('./customer/customerLocation.model');
const CustomerCare = require('./customer/customerCare.model');
const CustomerGroup = require('./customer/customerGroup.model');
const CustomerLiability = require('./customer/customerLiability.model');

exports.schema = {
    Privilege,
    Role,
    UserRole,
    User,

    Document,
    DocumentCategory,
    DocumentDomain,

    AnnualLeave,
    Commendation,
    Discipline,
    Employee,
    Holiday,
    Salary,
    Timesheets,

    EmployeeKpi,
    EmployeeKpiSet,
    OrganizationalUnitKpi,
    OrganizationalUnitKpiSet,

    Notification,
    ManualNotification,

    Action,
    Component,
    Link,
    OrganizationalUnit,
    RoleType,

    Company,
    Log,
    SystemComponent,
    SystemLink,
    RootRole,
    ImportConfiguraion,

    Task,
    TaskComment,
    TaskFile,
    TaskHistory,
    TaskResult,
    TaskResultInformation,
    TaskTemplate,
    TaskTemplateInformation,
    TimesheetLog,
    TaskProcess,
    Course,
    EducationProgram,
    EmployeeCourse,

    Asset,
    AssetType,
    RecommendProcure,
    RecommendDistribute,

    TaskReport,

    Material,
    Customer,
    CustomerCare,
    CustomerLocation,
    CustomerGroup,
    CustomerLiability
} 