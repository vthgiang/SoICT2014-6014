const Privilege = require('./auth/privilege.model');
const Role = require('./auth/role.model');
const User = require('./auth/user.model');
const UserRole = require('./auth/userRole.model');

const Document = require('./document/document.model');
const DocumentCategory = require('./document/documentCategory.model');
const DocumentType = require('./document/documentType.model');

const AnnualLeave = require('./human-resource/annualLeave.model');
const Commendation = require('./human-resource/commendation.model');
const Discipline = require('./human-resource/discipline.model');
const Employee = require('./human-resource/employee.model');
const EmployeeContact = require('./human-resource/employeeContact.model');
const Holiday = require('./human-resource/holiday.model');
const Salary = require('./human-resource/salary.model');

const EmployeeKpi = require('./kpi/employeeKpi.model');
const EmployeeKpiSet = require('./kpi/employeeKpiSet.model');
const OrganizationalUnitKpi = require('./kpi/organizationalUnitKpi.model');
const OrganizationalUnitKpiSet = require('./kpi/organizationalUnitKpiSet.model');

const Notification = require('./notification/notification.model');
const NotificationUser = require('./notification/notificationUser.model');

const Action = require('./super-admin/action.model');
const Component = require('./super-admin/component.model');
const Link = require('./super-admin/link.model');
const OrganizationalUnit = require('./super-admin/organizationalUnit.model');
const RoleType = require('./super-admin/roleType.model');

const Company = require('./system-admin/company.model');
const Log = require('./system-admin/log.model');
const ProvidingComponent = require('./system-admin/providingComponent.model');
const ProvidingLink = require('./system-admin/providingLink.model');
const RootRole = require('./system-admin/rootRole.model');

const Task = require('./task/task.model');
const TaskAction = require('./task/taskAction.model');
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


exports.schema = {
    Privilege,
    Role,
    UserRole,

    Document,
    DocumentCategory,
    DocumentType,

    AnnualLeave,
    Commendation,
    Discipline,
    Employee,
    EmployeeContact,
    Holiday,
    Salary,

    EmployeeKpi,
    EmployeeKpiSet,
    OrganizationalUnitKpi,
    OrganizationalUnitKpiSet,

    Notification,
    NotificationUser,

    Action,
    Component,
    Link,
    OrganizationalUnit,
    RoleType,

    Company,
    Log,
    ProvidingComponent,
    ProvidingLink,
    RootRole,

    Task,
    TaskAction,
    TaskComment,
    TaskFile,
    TaskHistory,
    TaskResult,
    TaskResultInformation,
    TaskTemplate,
    TaskTemplateInformation,
    TimesheetLog,

    Course,
    EducationProgram,
    EmployeeCourse,
} 