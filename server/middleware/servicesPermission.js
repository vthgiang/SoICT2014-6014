const { Role } = require('../models');
const { connect } = require('../helpers/dbHelper');

exports.links = [
    {
        url: '/system/companies-management',
        apis: [
            // Authentication
            { path: '/auth/login', method: 'POST' },
            { path: '/auth/logout', method: 'GET' },
            { path: '/auth/logout-all-account', method: 'GET' },
            { path: '/auth/forget-password', method: 'POST' },
            { path: '/auth/reset-password', method: 'POST' },
            { path: '/auth/get-profile/:userId', method: 'GET' },
            { path: '/auth/profile/:userId/change-information', method: 'PATCH' },
            { path: '/auth/profile/:userId/change-password', method: 'PATCH' },
            { path: '/auth/get-links-that-role-can-access/:roleId', method: 'GET' },
            { path: '/auth/download-file', method: 'GET' },

            // Service của riêng Systemadmin
            { path: '/system-admin/company/companies', method: 'GET' },
            { path: '/system-admin/company/companies', method: 'POST' },
            { path: '/system-admin/company/paginate', method: 'POST' },
            { path: '/system-admin/company/companies/:companyId', method: 'GET' },
            { path: '/system-admin/company/companies/:companyId', method: 'PATCH' },
            { path: '/system-admin/company/companies/:companyId', method: 'DELETE' },

            { path: '/system-admin/company/companies/:companyId/links', method: 'POST' },
            { path: '/system-admin/company/companies/:companyId/links', method: 'GET' },
            { path: '/system-admin/company/companies/:companyId/links/:linkId', method: 'DELETE' },

            { path: '/system-admin/company/companies/:companyId/components', method: 'GET' },
            { path: '/system-admin/company/companies/:companyId/components', method: 'POST' },
            { path: '/system-admin/company/companies/:companyId/components/:componentId', method: 'DELETE' },

            { path: '/system-admin/company/organizationalUnitImage', method: 'PATCH' },
            { path: '/system-admin/company/organizationalUnitImage', method: 'get' },

            { path: '/system-admin/company/:id/links-paginate/:page/:limit', method: 'POST' },
            { path: '/system-admin/company/:id/components-paginate/:page/:limit', method: 'POST' },

            { path: '/system-admin/company/data-import-configurations', method: 'GET' },
            { path: '/system-admin/company/data-import-configurations', method: 'POST' },
            { path: '/system-admin/company/data-import-configurations/:id', method: 'PATCH' },

            { path: '/system-admin/root-role/root-roles', method: 'GET' },

            { path: '/system-admin/system-link/system-links-categories', method: 'GET' },
            { path: '/system-admin/system-link/system-links', method: 'GET' },
            { path: '/system-admin/system-link/system-links', method: 'POST' },

            { path: '/system-admin/system-page/apis', method: 'GET' },

            { path: '/links-default-management/paginate', method: 'POST' },
            { path: '/system-admin/system-link/system-links/:systemLinkId', method: 'GET' },
            { path: '/system-admin/system-link/system-links/:systemLinkId', method: 'PATCH' },
            { path: '/system-admin/system-link/system-links/:systemLinkId', method: 'DELETE' },

            { path: '/system-admin/log/logs', method: 'GET' },
            { path: '/system-admin/log/logs', method: 'PATCH' },

            { path: '/links-default-management', method: 'GET' },
            { path: '/links-default-management', method: 'POST' },
            { path: '/links-default-management/paginate', method: 'POST' },
            { path: '/links-default-management/:id', method: 'GET' },
            { path: '/links-default-management/:id', method: 'PATCH' },
            { path: '/links-default-management/:id', method: 'DELETE' },

            { path: '/system-admin/system-component/system-components', method: 'GET' },
            { path: '/system-admin/system-component/system-components', method: 'POST' },
            { path: '/components-default-management/paginate', method: 'POST' },
            { path: '/system-admin/system-component/system-components/:systemComponentId', method: 'GET' },
            { path: '/system-admin/system-component/system-components/:systemComponentId', method: 'PATCH' },
            { path: '/system-admin/system-component/system-components/:systemComponentId', method: 'DELETE' },
            { path: '/components-default-management/role/:roleId/link/:linkId', method: 'GET' },

            { path: '/system-admin/system-setting/backup', method: 'PATCH' },
            { path: '/system-admin/system-setting/restore', method: 'PATCH' },

            { path: '/configuration/configurations', method: 'GET' },
            { path: '/configuration/configurations', method: 'PATCH' },


            { path: '/system/backup', method: 'GET' },

            { path: '/user/users', method: 'GET' },
            { path: '/user/users', method: 'POST' },
            { path: '/user/users/paginate', method: 'POST' },
            { path: '/user/users/:id', method: 'GET' },
            { path: '/user/users/roles/abc', method: 'GET' },
            { path: '/user/users/:id', method: 'PATCH' },
            { path: '/user/users/:id', method: 'DELETE' },
            { path: '/user/users/:id/organizational-units', method: 'GET' },
            { path: '/user/organizational-units/:id/users', method: 'GET' },

            { path: '/role/roles', method: 'GET' },
            { path: '/role/roles', method: 'POST' },
            { path: '/role/roles/paginate', method: 'POST' },
            { path: '/role/roles/:id', method: 'GET' },
            { path: '/role/roles/:id', method: 'PATCH' },
            { path: '/role/roles/:id', method: 'DELETE' },
            { path: '/role/roles/test/:id', method: 'PATCH' },

            { path: '/link/links', method: 'GET' },
            { path: '/link/links', method: 'POST' },
            { path: '/link/links/paginate', method: 'POST' },
            { path: '/link/links/:id', method: 'GET' },
            { path: '/link/links/:id', method: 'PATCH' },
            { path: '/link/links/:id', method: 'DELETE' },
            { path: '/link/links/company/:idCompany', method: 'GET' },
            { path: '/link/links/company/update', method: 'PATCH' },

            { path: '/attribute/attributes', method: 'GET' },
            { path: '/attribute/attributes', method: 'POST' },
            { path: '/attribute/attributes/paginate', method: 'POST' },
            { path: '/attribute/attributes/:id', method: 'GET' },
            { path: '/attribute/attributes/:id', method: 'PATCH' },
            { path: '/attribute/attributes/:id', method: 'DELETE' },

            { path: '/organizational-units/organizational-units', method: 'GET' },
            { path: '/organizational-units/organizational-units', method: 'POST' },
            { path: '/organizational-units/organizational-units/:id', method: 'GET' },
            { path: '/organizational-units/organizational-units/:id', method: 'PATCH' },
            { path: '/organizational-units/organizational-units/:id', method: 'DELETE' },
            { path: '/organizational-units/organizational-units/import', method: 'POST' },

            { path: '/privilege/privileges', method: 'GET' },
            { path: '/privilege/privileges', method: 'POST' },
            { path: '/privilege/privileges/:id', method: 'GET' },
            { path: '/privilege/privileges/:id', method: 'PATCH' },
            { path: '/privilege/privileges/:id', method: 'DELETE' },
            { path: '/privilege/roles/:idRole/privileges', method: 'GET' },

            { path: '/educationProgram/educationPrograms', method: 'GET' },
            { path: '/educationProgram/educationPrograms', method: 'POST' },
            { path: '/educationProgram/educationPrograms/:id', method: 'DELETE' },
            { path: '/educationProgram/educationPrograms/:id', method: 'PATCH' },

            // Dashboard unit
            { path: '/dashboard-unit/all-unit-dashboard-data',method: 'GET' },
            
            { path: '/course/courses', method: 'GET' },
            { path: '/course/courses', method: 'POST' },
            { path: '/course/courses/:id', method: 'DELETE' },
            { path: '/course/courses/:id', method: 'PATCH' },

            { path: '/employee/employees', method: 'GET' },
            { path: '/employee/employees/:id', method: 'GET' },
            { path: '/employee/employees/:userId', method: 'PATCH' },
            { path: '/employee/employees', method: 'POST' },
            { path: '/employee/employees/:id', method: 'PUT' },
            { path: '/employee/employees/:id', method: 'DELETE' },
            { path: '/employee/employees/import', method: 'POST' },

            { path: '/salary/salaries', method: 'GET' },
            { path: '/salary/salaries-chart', method: 'GET' },
            { path: '/salary/salaries', method: 'POST' },
            { path: '/salary/salaries/:id', method: 'PATCH' },
            { path: '/salary/salaries/:id', method: 'DELETE' },
            { path: '/salary/salaries/import', method: 'POST' },

            { path: '/field/fields', method: 'GET' },
            { path: '/field/fields', method: 'POST' },
            { path: '/field/fields/:id', method: 'PATCH' },
            { path: '/field/fields/:id', method: 'DELETE' },

            { path: '/timesheet/timesheets', method: 'GET' },
            { path: '/timesheet/timesheets', method: 'POST' },
            { path: '/timesheet/timesheets/:id', method: 'DELETE' },
            { path: '/timesheet/timesheets/:id', method: 'PATCH' },
            { path: '/timesheet/timesheets/import', method: 'POST' },

            { path: '/discipline/disciplines', method: 'GET' },
            { path: '/discipline/disciplines', method: 'POST' },
            { path: '/discipline/disciplines/:id', method: 'PATCH' },
            { path: '/discipline/disciplines/:id', method: 'DELETE' },

            { path: '/commendation/commendations', method: 'GET' },
            { path: '/commendation/commendations', method: 'POST' },
            { path: '/commendation/commendations/:id', method: 'PATCH' },
            { path: '/commendation/commendations/:id', method: 'DELETE' },

            { path: '/annualLeave/annualLeaves', method: 'GET' },
            { path: '/annualLeave/annualLeaves', method: 'POST' },
            { path: '/annualLeave/annualLeaves/:id', method: 'PATCH' },
            { path: '/annualLeave/annualLeaves/:id', method: 'DELETE' },
            { path: '/annualLeave/annualLeaves/import', method: 'POST' },

            { path: '/majors/major', method: 'GET' },
            { path: '/majors/major', method: 'POST' },
            { path: '/majors/major/:id', method: 'PATCH' },
            { path: '/majors/major', method: 'DELETE' },

            { path: '/career-positions/career-positions', method: 'GET' },
            { path: '/career-positions/career-fields', method: 'GET' },
            { path: '/career-positions/career-actions', method: 'GET' },

            { path: '/career-positions/career-fields', method: 'POST' },
            { path: '/career-positions/career-actions', method: 'POST' },
            { path: '/career-positions/career-positions', method: 'POST' },

            { path: '/career-positions/career-fields/:id', method: 'PATCH' },
            { path: '/career-positions/career-actions/:id', method: 'PATCH' },
            { path: '/career-positions/career-positions/:id', method: 'PATCH' },

            { path: '/career-positions/career-fields/:id', method: 'DELETE' },
            { path: '/career-positions/career-positions/:id', method: 'DELETE' },
            { path: '/career-positions/career-actions/:id', method: 'DELETE' },

            { path: '/notifications/get', method: 'GET' },
            { path: '/notifications/paginate', method: 'POST' },
            { path: '/notifications/create', method: 'POST' },
            { path: '/notifications/get-notifications', method: 'GET' },
            { path: '/notifications/paginate-notifications', method: 'POST' },
            { path: '/notifications/delete-manual-notification/:id', method: 'DELETE' },
            { path: '/notifications/delete-notification/:id', method: 'DELETE' },
            { path: '/notifications/readed/:id', method: 'PATCH' },

            { path: '/workPlan/workPlans', method: 'GET' },
            { path: '/workPlan/workPlans', method: 'POST' },
            { path: '/workPlan/workPlans/:id', method: 'PUT' },
            { path: '/workPlan/workPlans/:id', method: 'DELETE' },
            { path: '/workPlan/workPlans/import', method: 'POST' },

            { path: '/sample/item', method: 'GET' },
            { path: '/sample/item', method: 'POST' },
            { path: '/sample/item', method: 'PATCH' },
            { path: '/sample/item', method: 'DELETE' },
            { path: '/sample/item/:id', method: 'GET' },

            { path: '/documents/documents', method: 'GET' },
            { path: '/documents/documents', method: 'POST' },
            { path: '/documents/documents/:id', method: 'PATCH' },
            { path: '/documents/documents/:id', method: 'DELETE' },
            { path: '/documents/documents/:id', method: 'GET' },
            { path: '/documents/documents/:id/download-file', method: 'GET' },
            { path: '/documents/documents/:id/download-file-scan', method: 'GET' },
            { path: '/documents/documents/:id/increase-number-view', method: 'PATCH' },
            { path: '/documents/documents/permission-view', method: 'GET' },
            { path: '/documents/documents/user-statistical', method: 'GET' },
            { path: '/documents/documents/import-file', method: 'POST' },

            { path: '/documents/document-categories', method: 'GET' },
            { path: '/documents/document-categories', method: 'POST' },
            { path: '/documents/document-categories/:id', method: 'PATCH' },
            { path: '/documents/document-categories/:id', method: 'DELETE' },
            { path: '/documents/document-categories/:id', method: 'GET' },
            { path: '/documents/document-categories/import-file', method: 'POST' },

            { path: '/documents/document-domains', method: 'GET' },
            { path: '/documents/document-domains', method: 'POST' },
            { path: '/documents/document-domains/:id', method: 'PATCH' },
            { path: '/documents/document-domains/:id', method: 'DELETE' },
            { path: '/documents/document-domains/:id', method: 'GET' },
            { path: '/documents/document-domains/delete-many', method: 'POST' },
            { path: '/documents/document-domains/import-file', method: 'POST' },

            { path: '/documents/document-archives', method: 'GET' },
            { path: '/documents/document-archives', method: 'POST' },
            { path: '/documents/document-archives/:id', method: 'PATCH' },
            { path: '/documents/document-archives/:id', method: 'DELETE' },
            { path: '/documents/document-archives/:id', method: 'GET' },
            { path: '/documents/document-archives/delete-many', method: 'POST' },
            { path: '/documents/document-archives/import-file', method: 'POST' },
            { path: '/documents/chart-document', method: 'GET' },

            { path: '/component/components', method: 'GET' },
            { path: '/component/components', method: 'POST' },
            { path: '/component/components/paginate', method: 'POST' },
            { path: '/component/components/:id', method: 'GET' },
            { path: '/component/components/:id', method: 'PATCH' },
            { path: '/component/components/:id', method: 'DELETE' },
            { path: '/component/components/company/update', method: 'PATCH' },

            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets', method: 'GET' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets', method: 'POST' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:id', method: 'PATCH' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:id', method: 'DELETE' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:idUnitKpiSet/organizational-unit-kpis/:idUnitKpi', method: 'DELETE' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpis', method: 'POST' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpis/:id', method: 'PATCH' },
            { path: '/kpi/organizational-unit/management/organizational-unit-kpi-sets/:id/copy', method: 'POST' },
            { path: '/kpi/organizational-unit/management/organizational-unit-kpi-sets/calculate', method: 'POST' },
            { path: '/kpi/organizational-unit/dashboard/organizational-units/get-children-of-organizational-unit-as-tree', method: 'GET' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:setKpiId/comments', method: 'POST' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:setKpiId/comments/:commentId', method: 'PATCH' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:setKpiId/comments/:commentId', method: 'DELETE' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:setKpiId/comments/:commentId/child-comments', method: 'POST' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:setKpiId/comments/:commentId/child-comments/:childCommentId', method: 'PATCH' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:setKpiId/comments/:commentId/child-comments/:childCommentId', method: 'DELETE' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:setKpiId/comments/:commentId:/files/:fileId', method: 'DELETE' },
            { path: '/kpi/organizational-unit/creation/organizational-unit-kpi-sets/:setKpiId/comments/:commentId/child-comments/:childCommentId/files/:fileId', method: 'DELETE' },

            { path: '/kpi/employee/creation/employee-kpi-sets', method: 'GET' },
            { path: '/kpi/employee/creation/employee-kpi-sets', method: 'POST' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:id/edit', method: 'POST' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:id', method: 'DELETE' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:id/status', method: 'POST' },
            { path: '/kpi/employee/creation/employee-kpis', method: 'POST' },
            { path: '/kpi/employee/creation/employee-kpis/target/:id', method: 'PUT' },
            { path: '/kpi/employee/creation/employee-kpis/:id', method: 'DELETE' },
            { path: '/kpi/employee/creation/employee-kpi-sets/approve/:id', method: 'PUT' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments', method: 'POST' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId', method: 'PATCH' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId', method: 'DELETE' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId/files/:fileId', method: 'DELETE' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId/child-comments', method: 'POST' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId/child-comments/:childCommentId', method: 'PATCH' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId/child-comments/:childCommentId', method: 'DELETE' },
            { path: '/kpi/employee/creation/employee-kpi-sets/:kpiId/comments/:commentId/child-comments/:childCommentId/files/:fileId', method: 'DELETE' },
            // Employee KPI management dashboard
            { path: '/kpi/employee/management/employee-kpi-sets/:id/copy', method: 'POST' },

            // Employee KPI evaluate 
            { path: '/kpi/evaluation/employee-evaluation/employee-kpi-sets', method: 'GET' },
            { path: '/kpi/evaluation/employee-evaluation/employee-kpi-sets/:id', method: 'GET' },
            { path: '/kpi/evaluation/employee-evaluation/employee-kpi-sets/:id', method: 'PATCH' },
            { path: '/kpi/evaluation/employee-evaluation/employee-kpis/:id', method: 'PATCH' },
            { path: '/kpi/evaluation/employee-evaluation/employee-kpis/:id/tasks', method: 'GET' },
            { path: '/kpi/evaluation/employee-evaluation/employee-kpis/:id/set-task-importance-level', method: 'POST' },
            { path: '/kpi/evaluation/employee-evaluation/employee-kpis/:id/set-point-all-kpi', method: 'POST' },

            // Employee KPI evaluate dashboard
            { path: '/kpi/evaluation/dashboard/employee-kpis', method: 'GET' },

            // Task-management
            { path: '/task/tasks', method: 'GET' },
            { path: '/task/tasks', method: 'POST' },
            { path: '/task/tasks/:taskId', method: 'DELETE' },
            { path: '/task/tasks/:taskId/sub-tasks', method: 'GET' },
            { path: '/task/task-evaluations', method: 'GET' },
            { path: '/task/analyse/user/:userId', method: 'GET' },
            { path: '/task/time-sheet', method: 'GET' },
            { path: '/task/time-sheet/all', method: 'GET' },

            // Perform-task
            { path: '/performtask/tasks/:taskId', method: 'GET' },
            { path: '/performtask/tasks/:taskId/timesheet-logs', method: 'GET' },
            { path: '/performtask/task-timesheet-logs', method: 'GET' },
            { path: '/performtask/tasks/:taskId/timesheet-logs/start-timer', method: 'POST' },
            { path: '/performtask/tasks/:taskId/timesheet-logs/stop-timer', method: 'POST' },
            { path: '/performtask/tasks/:taskId/timesheet-logs/:timesheetlogId', method: 'PATCH' },
            { path: '/performtask/:task', method: 'POST' },
            { path: '/performtask/tasks/:taskId/files', method: 'POST' },
            { path: '/performtask/tasks/:taskId/documents', method: 'PATCH' },
            { path: '/performtask/tasks/:taskId/documents/:documentId', method: 'DELETE' },
            { path: '/performtask/tasks/:taskId/documents/:documentId/files/:fileId', method: 'DELETE' },

            //task action
            { path: '/performtask/tasks/:taskId/sort', method: 'POST' },
            { path: '/performtask/tasks/:taskId/task-actions/:actionId', method: 'POST' },
            { path: '/performtask/tasks/:taskId/task-actions', method: 'POST' },
            { path: '/performtask/tasks/:taskId/task-actions/:actionId', method: 'PATCH' },
            { path: '/performtask/tasks/:taskId/task-actions/:actionId', method: 'DELETE' },
            { path: '/performtask/tasks/:taskId/task-actions/:actionId/evaluation/:evaluationId', method: 'DELETE' },
            { path: '/performtask/tasks/:taskId/task-actions/:actionId/files/:fileId', method: 'PATCH' },


            //comment of task action
            { path: '/performtask/tasks/:taskId/task-actions/:actionId/comments', method: 'POST' },
            { path: '/performtask/tasks/:taskId/task-actions/:actionId/comments/:commentId', method: 'PATCH' },
            { path: '/performtask/tasks/:taskId/task-actions/:actionId/comments/:commentId', method: 'DELETE' },
            { path: '/performtask/tasks/:taskId/task-actions/:actionId/comments/files/:fileId', method: 'PATCH' },



            // task information
            { path: '/performtask/tasks/:taskId/task-informations', method: 'PATCH' },


            //task comment
            { path: '/performtask/tasks/:taskId/task-comments', method: 'POST' },
            { path: '/performtask/tasks/:taskId/task-comments/:commentId', method: 'PATCH' },
            { path: '/performtask/tasks/:taskId/task-comments/:commentId', method: 'DELETE' },
            { path: '/performtask/tasks/:taskId/task-comments/:commentId/files/:fileId', method: 'PATCH' },



            //comment of task comment
            { path: '/performtask/tasks/:taskId/task-comments/:commentId/comments', method: 'POST' },
            { path: '/performtask/tasks/:taskId/task-comments/comments/:commentId', method: 'PATCH' },
            { path: '/performtask/tasks/:taskId/task-comments/:commentId/comments/:childCommentId', method: 'DELETE' },
            { path: '/performtask/tasks/:taskId/task-comments/:commentId/comments/files/:fileId', method: 'PATCH' },

            //Comment in process
            { path: '/performtask/process/tasks/:taskId', method: 'GET' },
            { path: '/performtask/process/tasks/:taskId/comments', method: 'POST' },
            { path: '/performtask/process/tasks/:taskId/comments/:commentId', method: 'PATCH' },
            { path: '/performtask/process/tasks/:taskId/comments/:commentId', method: 'DELETE' },
            { path: '/performtask/process/tasks/:taskId/comments/:commentId/files/:fileId', method: 'PATCH' },
            { path: '/performtask/tasks/:taskId/task-comments/:commentId/files/:fileId', method: 'PATCH' },
            //child comment in process
            { path: '/performtask/process/tasks/:taskId/comments/:commentId/child-comments', method: 'POST' },
            { path: '/performtask/process/tasks/:taskId/comments/:commentId/child-comments/:childCommentId', method: 'PATCH' },
            { path: '/performtask/process/tasks/:taskId/comments/:commentId/child-comments/:childCommentId', method: 'DELETE' },
            { path: '/performtask/process/tasks/:taskId/comments/:commentId/child-comments/:childCommentId/files/:fileId', method: 'PATCH' },

            { path: '/performtask/add-result/create', method: 'POST' },
            { path: '/performtask/information-task-template/create', method: 'POST' },
            { path: '/performtask/information-task-template', method: 'PUT' },
            { path: '/performtask/result-task/create', method: 'POST' },
            { path: '/performtask/result-task', method: 'PUT' },

            // add task log
            { path: '/performtask/tasks/:taskId/logs', method: 'POST' },
            { path: '/performtask/tasks/:taskId/logs', method: 'GET' },

            // edit task - evaluate task
            { path: '/performtask/tasks/:taskId', method: 'POST' },
            { path: '/performtask/tasks/:taskId/evaluate', method: 'POST' },
            // delete evaluation
            { path: '/performtask/tasks/:taskId/evaluations/:evaluationId', method: 'DELETE' },


            //task process

            { path: '/process', method: 'GET' },
            { path: '/process/diagrams/:diagramId', method: 'GET' },
            { path: '/process/diagrams', method: 'POST' },
            { path: '/process/diagrams/import', method: 'POST' },
            { path: '/process/diagrams/:diagramId', method: 'PATCH' },
            { path: '/process/processes/:processId', method: 'PATCH' },
            { path: '/process/diagrams/:diagramId', method: 'DELETE' },
            { path: '/process/processes/:processId/tasks/create', method: 'POST' },

            // Module TaskTemplate
            { path: '/task/task-templates', method: 'GET' },
            { path: '/task/task-templates/:id', method: 'GET' },
            { path: '/task/task-templates', method: 'POST' },
            { path: '/task/task-templates/:id', method: 'DELETE' },
            { path: '/task/task-templates/:id', method: 'PATCH' },
            { path: '/task/task-templates/import', method: 'POST' },


            // Asset-type
            { path: '/assettype/asset-types', method: 'GET' },
            { path: '/assettype/asset-types', method: 'POST' },
            { path: '/assettype/asset-types/:id', method: 'PATCH' },
            { path: '/assettype/asset-types/:id', method: 'DELETE' },
            { path: '/assettype/asset-types/:id', method: 'GET' },
            { path: '/assettype/asset-types', method: 'DELETE' },




            // Asset
            { path: '/asset/assets', method: 'GET' },
            { path: '/asset/assets-group', method: 'GET' },
            { path: '/asset/assets-statistic', method: 'GET' },
            { path: '/asset/assets-purchase', method: 'GET' },
            { path: '/asset/assets-disposal', method: 'GET' },
            { path: '/asset/assets-incident', method: 'GET' },
            { path: '/asset/assets-maintenance', method: 'GET' },
            { path: '/asset/assets', method: 'POST' },
            { path: '/asset/assets/:id', method: 'PATCH' },
            { path: '/asset/assets/:id', method: 'DELETE' },

            { path: '/asset/assets/:id/depreciations', method: 'PATCH' },

            { path: '/asset/assets/:id/maintainance-logs', method: 'POST' },

            { path: '/asset/assets/:id/usage-logs', method: 'POST' },
            { path: '/asset/assets/:id/usage-logs', method: 'PATCH' },
            { path: '/asset/assets/:id/usage-logs', method: 'DELETE' },

            { path: '/asset/assets/maintainance-logs', method: 'GET' },
            { path: '/asset/assets/:id/maintainance-logs', method: 'POST' },
            { path: '/asset/assets/:id/maintainance-logs', method: 'PATCH' },
            { path: '/asset/assets/:id/maintainance-logs', method: 'DELETE' },

            { path: '/asset/assets/incident-logs', method: 'GET' },
            { path: '/asset/assets/:id/incident-logs', method: 'POST' },
            { path: '/asset/assets/:id/incident-logs', method: 'PATCH' },
            { path: '/asset/assets/:id/incident-logs', method: 'DELETE' },

            // Recommend-procure
            { path: '/purchase-request/purchase-request', method: 'GET' },
            { path: '/purchase-request/use-approver', method: 'GET' },
            { path: '/purchase-request/purchase-request', method: 'POST' },
            { path: '/purchase-request/purchase-request/:id', method: 'PUT' },
            { path: '/purchase-request/purchase-request/:id', method: 'DELETE' },


            // Recommend-distribute
            { path: '/use-request/use-requests', method: 'GET' },
            { path: '/use-request/use-requests', method: 'POST' },
            { path: '/use-request/use-requests/:id', method: 'PUT' },
            { path: '/use-request/use-requests/:id', method: 'DELETE' },


            // module report management
            { path: '/taskreports', method: 'GET' },
            { path: '/taskreports/:id', method: 'GET' },
            { path: '/taskreports', method: 'POST' },
            { path: '/taskreports/:id', method: 'DELETE' },
            { path: '/taskreports/:id', method: 'PATCH' },

            //warehouse

            { path: 'stocks', method: 'GET' },
            { path: 'stocks/stock-detail/:id', method: 'GET' },
            { path: 'stocks', method: 'POST' },
            { path: 'stocks/:id', method: 'PATCH' },
            { path: 'stocks/:id', method: 'DELETE' },

            { path: 'bin-locations', method: 'GET' },
            { path: 'bin-locations/get-child', method: 'GET' },
            { path: 'bin-locations/get-detail/:id', method: 'GET' },
            { path: 'bin-locations', method: 'POST' },
            { path: 'bin-locations/delete-many', method: 'POST' },
            { path: 'bin-locations/:id', method: 'PATCH' },
            { path: 'bin-locations/:id', method: 'DELETE' },

            { path: '/categories', method: 'GET' },
            { path: '/categories/category-tree', method: 'GET' },
            { path: '/categories/by-type', method: 'GET' },
            { path: '/categories', method: 'POST' },
            { path: '/categories/delete-many', method: 'POST' },
            { path: '/categories/:id', method: 'GET' },
            { path: '/categories/:id', method: 'PATCH' },
            { path: '/categories/:id', method: 'DELETE' },

            { path: '/goods', method: 'GET' },
            { path: '/goods/get-number-good', method: 'GET' },
            { path: '/goods/all-goods', method: 'GET' },
            { path: '/goods/by-type', method: 'GET' },
            { path: '/goods', method: 'POST' },
            { path: '/goods/:id', method: 'PATCH' },
            { path: '/goods/:id', method: 'GET' },
            { path: '/goods/:id', method: 'DELETE' },
            { path: '/goods/by-category/:id', method: 'GET' },

            { path: '/lot', method: 'GET' },
            { path: '/lot/get-inventory-dashboard', method: 'GET' },
            { path: '/lot/get-lot-by-good', method: 'GET' },
            { path: '/lot/create-or-edit-lot', method: 'POST' },
            { path: '/lot/delete-many', method: 'POST' },
            { path: '/lot/get-inventory', method: 'GET' },
            { path: '/lot/get-inventory-in-stock', method: 'GET' },
            { path: '/lot/get-detail/:id', method: 'GET' },
            { path: '/lot/:id', method: 'PATCH' },

            { path: '/bills', method: 'GET' },
            { path: '/bills/get-number-bill', method: 'GET' },
            { path: '/bills/get-bill-by-good', method: 'GET' },
            { path: '/bills/get-bill-by-status', method: 'GET' },
            { path: '/bills/bill-by-command', method: 'GET' },
            { path: '/bills', method: 'POST' },
            { path: '/bills/:id', method: 'PATCH' },
            { path: '/bills/get-detail-bill/:id', method: 'GET' },

            //order
            { path: "/orders", method: "GET" },
            { path: "/orders", method: "POST" },
            { path: "/orders/:id", method: "DELETE" },
            { path: "/orders/:id", method: "PATCH" },

            // CRM
            { path: '/crm/dashboards', method: 'GET' },

            { path: '/crm/customers', method: 'GET' },
            { path: '/crm/customers', method: 'POST' },
            { path: '/crm/customers/:id', method: 'GET' },
            { path: '/crm/customers/:id', method: 'PATCH' },
            { path: '/crm/customers/:id', method: 'DELETE' },
            { path: '/crm/customers/:id/point', method: 'GET' },
            { path: '/crm/customers/:id/point', method: 'PATCH' },


            { path: '/crm/groups', method: 'GET' },
            { path: '/crm/groups', method: 'POST' },
            { path: '/crm/groups/:id', method: 'GET' },
            { path: '/crm/groups/:id', method: 'PATCH' },
            { path: '/crm/groups/:id', method: 'DELETE' },

            { path: '/crm/leads', method: 'GET' },
            { path: '/crm/leads', method: 'POST' },
            { path: '/crm/leads/:id', method: 'GET' },
            { path: '/crm/leads/:id', method: 'PATCH' },
            { path: '/crm/leads/:id', method: 'DELETE' },

            { path: '/crm/cares', method: 'GET' },
            { path: '/crm/cares', method: 'POST' },
            { path: '/crm/cares/:id', method: 'GET' },
            { path: '/crm/cares/:id', method: 'PATCH' },
            { path: '/crm/cares/:id', method: 'DELETE' },

            { path: '/crm/careTypes', method: 'GET' },
            { path: '/crm/careTypes', method: 'POST' },
            { path: '/crm/careTypes/:id', method: 'GET' },
            { path: '/crm/careTypes/:id', method: 'PATCH' },
            { path: '/crm/careTypes/:id', method: 'DELETE' },

            { path: '/crm/status', method: 'GET' },
            { path: '/crm/status', method: 'POST' },
            { path: '/crm/status/:id', method: 'GET' },
            { path: '/crm/status/:id', method: 'PATCH' },
            { path: '/crm/status/:id', method: 'DELETE' },

            //plan
            { path: "/plans", method: "GET" },
            { path: "/plans", method: "POST" },
            { path: "/plans/:id", method: "DELETE" },
            { path: "/plans/:id", method: "PATCH" },
            { path: "/plans/:id", method: "GET" },

            //project
            { path: "/projects/project", method: "GET" },
            { path: "/projects/project", method: "POST" },
            { path: "/projects/project/:id", method: "DELETE" },
            { path: "/projects/project/:id", method: "PATCH" },

            // router.get('/project', auth, ProjectController.get);
            // router.get('/project/:id', auth, ProjectController.show);
            // router.post('/project', auth, ProjectController.create);
            // router.patch('/project/:id', auth, ProjectController.edit);
            // router.delete('/project/:id', auth, ProjectController.delete);

        ]
    }, {
        url: '/system/settings',
        apis: ['@all']
    }, {
        url: '/system/components-default-management',
        apis: ['@all']
    }, {
        url: '/system/roles-default-management',
        apis: ['@all']
    }, {
        url: '/system/apis-default-management',
        apis: ['@all']
    }, {
        url: '/system/privilege-api-management',
        apis: ['@all']
    }, {
        url: '/system/links-default-management',
        apis: ['@all']
    }, {
        url: '/home',
        apis: ['@all']
    }, {
        url: '/notifications',
        apis: ['@all']
    }, {
        url: '/manage-configuration',
        apis: ['@all']
    }, {
        url: '/system-management',
        apis: ['@all']
    }, {
        url: '/departments-management',
        apis: ['@all']
    }, {
        url: '/users-management',
        apis: ['@all']
    }, {
        url: '/roles-management',
        apis: ['@all']
    }, {
        url: '/links-management',
        apis: ['@all']
    }, {
        url: '/attributes-management',
        apis: ['@all']
    }, {
        url: '/apis-management',
        apis: ['@all']
    }, {
        url: '/apis-registration',
        apis: ['@all']
    }, {
        url: '/apis-registration-employee',
        apis: ['@all']
    }, {
        url: '/components-management',
        apis: ['@all']
    }, {
        url: '/documents-management',
        apis: ['@all']
    }, {
        url: '/documents/organizational-unit',
        apis: ['@all']
    }, {
        url: '/documents',
        apis: ['@all']
    }, {
        url: '/hr-manage-work-plan',
        apis: ['@all']
    }, {
        url: '/hr-add-employee',
        apis: ['@all']
    }, {
        url: '/hr-list-employee',
        apis: ['@all']
    }, {
        url: '/hr-manage-department',
        apis: ['@all']
    }, {
        url: '/hr-update-employee',
        apis: ['@all']
    }, {
        url: '/hr-detail-employee',
        apis: ['@all']
    }, {
        url: '/hr-annual-leave-personal',
        apis: ['@all']
    }, {
        url: '/dashboard-personal',
        apis: ['@all']
    }, {
        url: '/dashboard-unit',
        apis: ['@all']
    }, {
        url: '/dashboard-all-unit',
        apis: ['@all']
    }, {
        url: '/hr-manage-leave-application',
        apis: ['@all']
    }, {
        url: '/hr-salary-employee',
        apis: ['@all']
    }, {
        url: '/hr-annual-leave',
        apis: ['@all']
    }, {
        url: '/hr-discipline',
        apis: ['@all']
    }, {
        url: '/hr-dashboard-employee',
        apis: ['@all']
    }, {
        url: '/hr-time-keeping',
        apis: ['@all']
    }, {
        url: '/hr-trainning-course',
        apis: ['@all']
    }, {
        url: '/hr-account',
        apis: ['@all']
    }, {
        url: '/hr-training-plan',
        apis: ['@all']
    }, {
        url: '/hr-training-plan-employee',
        apis: ['@all']
    }, {
        url: '/hr-list-education',
        apis: ['@all']
    },
    // {
    //     url: '/hr-list-major',
    //     apis: ['@all']
    // }, {
    //     url: '/hr-list-career-position',
    //     apis: ['@all']
    // }, {
    //     url: '/hr-search-for-package',
    //     apis: ['@all']
    // },
    {
        url: '/kpi-units/create-for-admin',
        apis: ['@all']
    }, {
        url: '/kpi-units/create',
        apis: ['@all']
    }, {
        url: '/kpi-units/dashboard',
        apis: ['@all']
    }, {
        url: '/kpi-units/manager',
        apis: ['@all']
    }, {
        url: '/kpi-units/statistic',
        apis: ['@all']
    }, {
        url: '/kpi-member/manager',
        apis: ['@all']
    }, {
        url: '/kpi-member/dashboard',
        apis: ['@all']
    }, {
        url: '/kpi-personals/dashboard',
        apis: ['@all']
    }, {
        url: '/kpi-personals/create',
        apis: ['@all']
    }, {
        url: '/kpi-personals/manager',
        apis: ['@all']
    }, {
        url: '/task-template',
        apis: ['@all']
    }, {
        url: '/task-management',
        apis: ['@all']
    }, {
        url: '/task-management-unit',
        apis: ['@all']
    }, {
        url: '/task-process-management',
        apis: ['@all']
    }, {
        url: '/task-process-template',
        apis: ['@all']
    },  {
        url: '/process-template',
        apis: ['@all']
    }, {
        url: '/task-management-dashboard',
        apis: ['@all']
    }, {
        url: '/task-organization-management-dashboard',
        apis: ['@all']
    }, {
        url: '/task',
        apis: ['@all']
    }, {
        url: '/dashboard-asset',
        apis: ['@all']
    }, {
        url: '/manage-type-asset',
        apis: ['@all']
    }, {
        url: '/manage-info-asset',
        apis: ['@all']
    }, {
        url: '/manage-maintainance-asset',
        apis: ['@all']
    }, {
        url: '/manage-usage-asset',
        apis: ['@all']
    }, {
        url: '/manage-depreciation-asset',
        apis: ['@all']
    }, {
        url: '/manage-incident-asset',
        apis: ['@all']
    }, {
        url: '/manage-asset-purchase-request',
        apis: ['@all']
    }, {
        url: '/manage-asset-use-request',
        apis: ['@all']
    }, {
        url: '/employee-manage-info-asset',
        apis: ['@all']
    }, {
        url: '/employee-manage-asset-use-request',
        apis: ['@all']
    }, {
        url: '/asset-purchase-request',
        apis: ['@all']
    }, {
        url: '/asset-use-request',
        apis: ['@all']
    }, {
        url: '/manage-assigned-asset',
        apis: ['@all']
    }, {
        url: '/view-building-list',
        apis: ['@all']
    }, {
        url: '/task-report',
        apis: ['@all']
    }, {
        url: '/dashboard-inventory',
        apis: ['@all']
    }, {
        url: '/dashboard-bill',
        apis: ['@all']
    }, {
        url: '/stock-management',
        apis: ['@all']
    }, {
        url: '/bin-location-management',
        apis: ['@all']
    }, {
        url: '/category-management',
        apis: ['@all']
    }, {
        url: '/good-management',
        apis: ['@all']
    }, {
        url: '/bill-management',
        apis: ['@all']
    }, {
        url: '/inventory-management',
        apis: ['@all']
    }, {
        url: '/manage-sales-order',
        apis: ['@all']
    }, {
        url: '/manage-purchase-order',
        apis: ['@all']
    }, {
        url: '/manage-quote',
        apis: ['@all']
    }, {
        url: '/manage-sales-order-dashboard',
        apis: ['@all']
    }, {
        url: '/manage-discount',
        apis: ['@all']
    }, {
        url: '/manage-tax',
        apis: ['@all']
    }, {
        url: '/manage-sla',
        apis: ['@all']
    },
    {
        url: '/manage-payment',
        apis: ['@all']
    },
    {
        url: '/manage-business-department',
        apis: ['@all']
    },
    {
        url: '/manage-bank-account',
        apis: ['@all']
    },
    {
        url: '/crm/dashboard',
        apis: ['@all']
    }
    ,
    {
        url: '/crm/dashboardUnit',
        apis: ['@all']
    }
    , {
        url: '/crm/customer',
        apis: ['@all']
    }, {
        url: '/crm/loyal-customer',
        apis: ['@all']
    }, {
        url: '/crm/evaluation',
        apis: ['@all']
    },
    {
        url: '/crm/group',
        apis: ['@all']
    }, {
        url: '/crm/care',
        apis: ['@all']
    }, {
        url: '/crm/generalConfiguration',
        apis: ['@all']
    },
    {
        url: '/crm/crmUnitConfiguration',
        apis: ['@all']
    }, {
        url: '/manage-plans',
        apis: ['@all']
    }, {
        url: '/manage-examples-1',
        apis: ['@all']
    }, {
        url: '/manage-examples-2',
        apis: ['@all']
    }, {
        url: '/manage-examples-hooks-1',
        apis: ['@all']
    }, {
        url: '/manage-examples-hooks-2',
        apis: ['@all']
    }, {
        url: '/manage-manufacturing-plan',
        apis: ['@all']
    }, {
        url: '/manage-manufacturing-command',
        apis: ['@all']
    }, {
        url: '/manage-work-schedule',
        apis: ['@all']
    }, {
        url: '/manage-purchasing-request',
        apis: ['@all']
    }, {
        url: '/manufacturing-dashboard',
        apis: ['@all']
    }, {
        url: '/analysis-manufacturing-performance',
        apis: ['@all']
    }, {
        url: '/manage-manufacturing-works',
        apis: ['@all']
    }, {
        url: '/manage-manufacturing-mill',
        apis: ['@all']
    }, {
        url: '/manage-manufacturing-lot',
        apis: ['@all']
    }, {
        url: '/hr-manage-field',
        apis: ['@all']
    }, {
        url: '/answer-auth-questions',
        apis: ['@all']
    },

    // Quản lý dự án
    {
        url: '/project/projects-list',
        apis: ['@all']
    },
    {
        url: '/project/project-details',
        apis: ['@all']
    },
    {
        url: '/project/tasks-list',
        apis: ['@all']
    },
    {
        url: '/project/phases-list',
        apis: ['@all']
    },
    {
        url: '/project/phase-details',
        apis: ['@all']
    },
    {
        url: '/project/issues-list',
        apis: ['@all']
    },
    {
        url: '/project/project-report',
        apis: ['@all']
    },
    {
        url: '/project/project-evaluation',
        apis: ['@all']
    },

    //transport
    {
        url: '/manage-transport-requirement',
        apis: ['@all']
    },
    {
        url: '/manage-transport-plan',
        apis: ['@all']
    },
    {
        url: '/manage-transport-schedule',
        apis: ['@all']
    },
    {
        url: '/manage-transport-vehicle',
        apis: ['@all']
    },
    {
        url: '/manage-transport-route',
        apis: ['@all']
    },
    {
        url: '/manage-transport-department',
        apis: ['@all']
    },
    {
        url: '/carrier-today-transport-mission',
        apis: ['@all']
    },
    {
        url: '/carrier-all-times-transport-mission',
        apis: ['@all']
    }, {
        url: '/projects-management',
        apis: ['@all']
    }, {
        url: '/user-guide',
        apis: ['@all']
    }, {
        url: '/time-sheet-log/all',
        apis: ['@all']
    }, {
        url: '/personal-time-sheet-log',
        apis: ['@all']
    }, {
        url: '/employees-infomation',
        apis: ['@all']
    }
];
