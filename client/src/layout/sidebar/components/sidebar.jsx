import React, { Component } from "react";
import Item from "./item";
import GroupItem from "./groupItem";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslate } from "react-redux-multilingual";
import { ApiImage } from "../../../common-components";

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    checkURL = (urlName, linkArr) => {
        var result = false;
        if (linkArr !== undefined) {
            linkArr.forEach((link) => {
                if (link.url === urlName) {
                    result = true;
                }
            });
        }

        return result;
    };

    render() {
        const { translate, auth } = this.props;
        const { user, links } = this.props.auth;

        return (
            <React.Fragment>
                <aside className="main-sidebar" style={{ minHeight: "100vh" }} >
                    <section className="sidebar">
                        <div className="user-panel" style={{ borderBottom: "0.2px solid #4B545C" }}>
                            <div className="pull-left image">
                                <img src={process.env.REACT_APP_SERVER + auth.user.avatar} className="img-circle" alt="User avatar" />
                            </div>
                            <div className="pull-left info">
                                <p>{user.name}</p>
                                {this.checkURL("/notifications", links) ? (
                                    <React.Fragment>
                                        <span
                                            style={{
                                                fontSize: "10px",
                                                marginRight: "10px",
                                            }}
                                        >
                                            <i className="fa fa-circle text-success"></i> Online{" "}
                                        </span>
                                        <Link to="/notifications">
                                            <i className="fa fa-bell text-yellow"></i>
                                            {translate("menu.notifications")}
                                        </Link>
                                    </React.Fragment>
                                ) : (
                                    <p style={{ fontSize: "10px" }}>
                                        <i className="fa fa-circle text-success"></i> Online{" "}
                                    </p>
                                )}
                            </div>
                        </div>
                        <ul className="sidebar-menu" data-widget="tree" ref="sideBarMenu">
                            {/* Trang chủ */}
                            <Item
                                item={{
                                    name: "menu.home",
                                    path: "/home",
                                    icon: "fa fa-home",
                                }}
                            />

                            {/* Bảng tin nhân viên */}
                            <Item
                                item={{
                                    name: "menu.dashboard_personal",
                                    path: "/dashboard-personal",
                                    icon: "fa fa-newspaper-o",
                                }}
                            />
                            {/* Bảng tin đơn vị toàn công ty */}
                            <Item
                                item={{
                                    name: "menu.dashboard_all_unit",
                                    path: "/dashboard-all-unit",
                                    icon: "fa fa-newspaper-o",
                                }}
                            />
                            {/* Bảng tin đơn vị */}
                            <Item
                                item={{
                                    name: "menu.dashboard_unit",
                                    path: "/dashboard-unit",
                                    icon: "fa fa-newspaper-o",
                                }}
                            />

                            {/* Quản trị của system admin */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.system_administration",
                                    icon: "fa fa-gears",
                                    list: [
                                        {
                                            name: "menu.manage_system",
                                            icon: "fa fa-gear",
                                            path: "/system/settings",
                                        },
                                        {
                                            name: "menu.manage_role",
                                            icon: "fa fa-lock",
                                            path: "/system/roles-default-management",
                                        },
                                        {
                                            name: "menu.manage_link",
                                            icon: "fa fa-link",
                                            path: "/system/links-default-management",
                                        },
                                        {
                                            name: "menu.manage_api",
                                            icon: "fa fa-link",
                                            path: "/system/apis-default-management",
                                        },
                                        {
                                            name: "menu.privilege_api",
                                            icon: "fa fa-link",
                                            path: "/system/privilege-api-management",
                                        },
                                        {
                                            name: "menu.manage_component",
                                            icon: "fa fa-object-group",
                                            path: "/system/components-default-management",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý doanh nghiệp */}
                            <Item
                                item={{
                                    name: "menu.manage_company",
                                    icon: "fa fa-building",
                                    path: "/system/companies-management",
                                }}
                            />

                            {/* Phân quyền IAM-RBAC */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.system_administration",
                                    icon: "fa fa-key",
                                    list: [
                                        {
                                            name: "menu.manage_configuration",
                                            icon: "fa fa-gear",
                                            path: "/manage-configuration",
                                        },
                                        {
                                            name: "menu.manage_system",
                                            icon: "fa fa-database",
                                            path: "/system-management",
                                        },
                                        {
                                            name: "menu.manage_department",
                                            icon: "fa fa-sitemap",
                                            path: "/departments-management",
                                        },
                                        {
                                            name: "menu.manage_user",
                                            icon: "fa fa-users",
                                            path: "/users-management",
                                        },
                                        {
                                            name: "menu.manage_role",
                                            icon: "fa fa-lock",
                                            path: "/roles-management",
                                        },
                                        {
                                            name: "menu.manage_link",
                                            icon: "fa fa-link",
                                            path: "/links-management",
                                        },
                                        {
                                            name: "menu.manage_api",
                                            icon: "fa fa-link",
                                            path: "/apis-management",
                                        },
                                        {
                                            name: "menu.registration_api",
                                            icon: "fa fa-link",
                                            path: "/apis-registration",
                                        },
                                        {
                                            name: "menu.registration_api_employee",
                                            icon: "fa fa-link",
                                            path: "/apis-registration-employee",
                                        },
                                        {
                                            name: "menu.manage_component",
                                            icon: "fa fa-object-group",
                                            path: "/components-management",
                                        },
                                    ],
                                }}
                            />


                            {/* Công việc đơn vị */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.task_management_unit",
                                    icon: "fa fa-tasks",
                                    list: [
                                        {
                                            name: "menu.task_organization_management_dashboard",
                                            icon: "fa fa-circle-o",
                                            path: "/task-organization-management-dashboard",
                                        },
                                        {
                                            name: "menu.task_management_of_unit",
                                            icon: "fa fa-circle-o",
                                            path: "/task-management-unit",
                                        },
                                    ]
                                }}
                            />

                            {/* Công việc cá nhân */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.tasks",
                                    icon: "fa fa-tasks",
                                    list: [
                                        {
                                            name: "menu.task_management_dashboard",
                                            icon: "fa fa-circle-o",
                                            path: "/task-management-dashboard",
                                        },
                                        {
                                            name: "menu.task_management",
                                            icon: "fa fa-circle-o",
                                            path: "/task-management",
                                        },
                                        {
                                            name: "menu.task_template",
                                            icon: "fa fa-flash",
                                            path: "/task-template",
                                        },
                                        {
                                            name: "menu.task_process_template",
                                            icon: "fa fa-circle-o",
                                            path: "/task-process-template",
                                        },
                                        {
                                            name: "menu.task_management_process",
                                            icon: "fa fa-circle-o",
                                            path: "/task-process-management",
                                        },
                                        {
                                            name: "menu.personal_time_sheet_log",
                                            icon: "fa fa-circle-o",
                                            path: "/personal-time-sheet-log",
                                        },
                                    ],
                                }}
                            />

                            {/* KPI đơn vị */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_kpi_unit",
                                    icon: "fa fa-dashboard",
                                    list: [
                                        {
                                            name: "menu.kpi_unit_dashboard",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-units/dashboard",
                                        },
                                        {
                                            name: "menu.kpi_unit_create_for_admin",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-units/create-for-admin",
                                        },
                                        {
                                            name: "menu.kpi_unit_create",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-units/create",
                                        },
                                        {
                                            name: "menu.kpi_unit_manager",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-units/manager",
                                        },
                                        {
                                            name: "menu.kpi_unit_statistic",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-units/statistic",
                                        },
                                        {
                                            name: "menu.kpi_member_dashboard",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-member/dashboard",
                                        },
                                        {
                                            name: "menu.kpi_member_manager",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-member/manager",
                                        },
                                    ]
                                }}
                            />

                            {/* KPI cá nhân */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_kpi_personal",
                                    icon: "fa fa-dashboard",
                                    list: [
                                        {
                                            name: "menu.kpi_personal_dashboard",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-personals/dashboard",
                                        },
                                        {
                                            name: "menu.kpi_personal_create",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-personals/create",
                                        },
                                        {
                                            name: "menu.kpi_personal_manager",
                                            icon: "fa fa-circle-o",
                                            path: "/kpi-personals/manager",
                                        },
                                    ],
                                }}
                            />

                            {/* Nhân sự đơn vị */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.employee_unit",
                                    icon: "fa fa-users",
                                    list: [
                                        {
                                            name: "menu.leave_application",
                                            icon: "fa fa-envelope",
                                            path: "/hr-manage-leave-application",
                                        },
                                        {
                                            name: "menu.employee_infomation",
                                            icon: "fa fa-users",
                                            path: "/employees-infomation",
                                        },
                                    ]

                                }}
                            />

                            {/* Quản lý đấu thầu */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_bidding",
                                    icon: "fa fa-folder-open",
                                    list: [
                                        { name: "menu.list_bidding_package", icon: "fa fa-archive", path: "/bidding-list-package" },
                                        { name: "menu.list_search_for_package", icon: "fa fa-search", path: "/bidding-search-for-package" },
                                        { name: "menu.list_bidding_contract", icon: "fa fa-file-text-o", path: "/bidding-list-contract" },
                                        { name: "menu.bidding_project_template_list", icon: "fa fa-flash", path: "/bidding-project-template" },
                                    ],
                                }}
                            />


                            {/* Quản lý dự án */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_project",
                                    icon: "fa fa-folder-open",
                                    list: [
                                        { name: "menu.projects_list", icon: "fa fa-dashboard", path: "/project/projects-list" },
                                        { name: "menu.project_report", icon: "fa fa-sitemap", path: "/project/project-report" },
                                        { name: "menu.project_evaluation", icon: "fa fa-user-plus", path: "/project/project-evaluation" },
                                        // { name: "menu.bidding_project_template_list", icon: "fa fa-flash", path: "/project/projects-template-list" },
                                    ],
                                }}
                            />

                            {/* Quản lý nhân sự */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_employee",
                                    icon: "fa fa-address-book",
                                    list: [
                                        { name: "menu.dashboard_employee", icon: "fa fa-dashboard", path: "/hr-dashboard-employee" },
                                        { name: "menu.employee_time_sheet_log", icon: "fa fa-calendar", path: "/time-sheet-log/all"},
                                        { name: "menu.manage_unit", icon: "fa fa-sitemap", path: "/hr-manage-department" },
                                        { name: "menu.add_employee", icon: "fa fa-user-plus", path: "/hr-add-employee" },
                                        { name: "menu.list_employee", icon: "fa fa-address-card", path: "/hr-list-employee" },
                                        { name: "menu.salary_employee", icon: "fa fa-line-chart", path: "/hr-salary-employee" },
                                        { name: "menu.time_keeping", icon: "fa fa-calculator", path: "/hr-time-keeping" },
                                        { name: "menu.discipline", icon: "fa fa-balance-scale", path: "/hr-discipline" },
                                        { name: "menu.annual_leave", icon: "fa fa-calendar-times-o", path: "/hr-annual-leave" },
                                        { name: "menu.manage_work_plan", icon: "fa fa-calendar", path: "/hr-manage-work-plan" },
                                        { name: "menu.manage_field", icon: "fa fa-list-ul", path: "/hr-manage-field" },
                                        // nhân sự gói thầu
                                        { name: "menu.list_search_for_package", icon: "fa fa-search", path: "/hr-search-for-package" },
                                        // { name: "menu.list_bidding_package", icon: "fa fa-archive", path: "/hr-list-bidding-package" },
                                        { name: "menu.list_certificate", icon: "fa fa-certificate", path: "/hr-list-certificate" },
                                        { name: "menu.list_major", icon: "fa fa-briefcase", path: "/hr-list-major" },
                                        { name: "menu.list_career_position", icon: "fa fa-handshake-o", path: "/hr-list-career-position" },
                                    ],
                                }}
                            />


                            {/* Quan ly tai san */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_asset",
                                    icon: "fa fa-address-book",
                                    list: [
                                        {
                                            name: "menu.dashboard_asset",
                                            icon: "fa fa-dashboard",
                                            path: "/dashboard-asset",
                                        },
                                        {
                                            name: "menu.manage_info_asset",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-info-asset",
                                        },
                                        {
                                            name: "menu.manage_info_asset_lot",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-info-asset-lot",
                                        },
                                        {
                                            name: "menu.manage_depreciation_asset",
                                            icon: "fa fa-balance-scale",
                                            path: "/manage-depreciation-asset",
                                        },
                                        {
                                            name: "menu.manage_maintainance_asset",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-maintainance-asset",
                                        },
                                        {
                                            name: "menu.manage_incident_asset",
                                            icon: "fa fa-calendar",
                                            path: "/manage-incident-asset",
                                        },
                                        {
                                            name: "menu.manage_recommend_distribute_asset",
                                            icon: "fa fa-calendar",
                                            path: "/manage-asset-use-request",
                                        },
                                        {
                                            name: "menu.manage_recommend_procure",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-asset-purchase-request",
                                        },
                                        {
                                            name: "menu.manage_type_asset",
                                            icon: "fa fa-dashboard",
                                            path: "/manage-type-asset",
                                        },
                                        {
                                            name: "menu.view_building_list",
                                            icon: "fa fa-building",
                                            path: "/view-building-list",
                                        },
                                        {
                                            name: "menu.manage_assigned_asset",
                                            icon: "fa fa-calendar",
                                            path: "/manage-assigned-asset",
                                        },
                                        {
                                            name: "menu.employee_manage_asset_info",
                                            icon: "fa fa-sitemap",
                                            path: "/employee-manage-info-asset",
                                        },
                                        {
                                            name: "menu.recommend_distribute_asset",
                                            icon: "fa fa-calendar",
                                            path: "/asset-use-request",
                                        },
                                        {
                                            name: "menu.recommend_equipment_procurement",
                                            icon: "fa fa-calendar",
                                            path: "/asset-purchase-request",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý vật tư tiêu hao */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_supplies",
                                    icon: "fa fa-address-book",
                                    list: [
                                        {
                                            name: "menu.dashboard_supplies",
                                            icon: "fa fa-dashboard",
                                            path: "/dashboard-supplies",
                                        },
                                        {
                                            name: "menu.manage_supplies_infor",
                                            icon: "fa fa-dashboard",
                                            path: "/manage-supplies",
                                        },
                                        {
                                            name: "menu.manage_purchase_invoice",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-purchase-invoice",
                                        },
                                        {
                                            name: "menu.manage_allocation_history",
                                            icon: "fa fa-balance-scale",
                                            path: "/manage-allocation-history",
                                        },
                                        {
                                            name: "menu.manage_supplies_purchase_request",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-supplies-request",
                                        },
                                        {
                                            name: "menu.recommend_supplies_procurement",
                                            icon: "fa fa-calendar",
                                            path: "/supplies-purchase-request",
                                        },

                                    ],
                                }}
                            />

                            {/* Quản lý tài liệu */}
                            <Item
                                item={{
                                    name: "menu.manage_document",
                                    icon: "fa fa-folder-open",
                                    path: "/documents-management",
                                }}
                            />
                            <Item
                                item={{
                                    name: "menu.documents_og",
                                    icon: "fa fa-folder-open",
                                    path: "/documents/organizational-unit",
                                }}
                            />
                            <Item
                                item={{
                                    name: "menu.documents",
                                    icon: "fa fa-file-text",
                                    path: "/documents",
                                }}
                            />


                            {/* Quản lý đào tạo */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_training",
                                    icon: "fa fa-graduation-cap",
                                    list: [
                                        {
                                            name: "menu.list_education",
                                            icon: "fa fa-university",
                                            path: "/hr-list-education",
                                        },
                                        {
                                            name: "menu.training_plan",
                                            icon: "fa fa-list-alt",
                                            path: "/hr-training-plan",
                                        },
                                        {
                                            name: "menu.training_plan_employee",
                                            icon: "fa fa-list-alt",
                                            path: "/hr-training-plan-employee",
                                        },
                                    ],
                                }}
                            />


                            {/* Quản lý khách hàng */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.customer_Management",
                                    icon: "fa fa-users",
                                    list: [
                                        {
                                            name: "menu.crm_list.dashboard",
                                            icon: "fa fa-dashboard",
                                            path: "/crm/dashboard",
                                        },
                                        {
                                            name: "menu.crm_list.dashboardUnit",
                                            icon: "fa fa-dashboard",
                                            path: "/crm/dashboardUnit",
                                        },
                                        {
                                            name: "menu.crm_list.customer",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/customer",
                                        },

                                        {
                                            name: "menu.crm_list.care",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/care",
                                        },
                                        {
                                            name: "menu.crm_list.lead",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/loyal-customer",
                                        },
                                        {
                                            name: "menu.crm_list.group",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/group",
                                        },
                                        {
                                            name: "menu.crm_list.evaluation",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/evaluation",
                                        },
                                        {
                                            name: "menu.crm_list.statistic",
                                            icon: "fa fa-circle-o",
                                            path: "/crm/statistic",
                                        },
                                        {
                                            name: "menu.crm_list.generalConfiguration",
                                            icon: "fa fa-gear",
                                            path: "/crm/generalConfiguration",
                                        },
                                        {
                                            name: "menu.crm_list.crmUnitConfiguration",
                                            icon: "fa fa-gear",
                                            path: "/crm/crmUnitConfiguration",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý đơn hàng */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_orders",
                                    icon: "fa  fa-book",
                                    list: [
                                        {
                                            name: "menu.manage_sales_order_dashboard",
                                            icon: "fa fa-dashboard",
                                            path: "/manage-sales-order-dashboard",
                                        },
                                        {
                                            name: "menu.manage_quote",
                                            icon: "fa fa-tablet",
                                            path: "/manage-quote",
                                        },
                                        {
                                            name: "menu.manage_sales_order",
                                            icon: "fa fa-dollar",
                                            path: "/manage-sales-order",
                                        },
                                        {
                                            name: "menu.manage_purchase_order",
                                            icon: "fa fa-shopping-cart",
                                            path: "/manage-purchase-order",
                                        },
                                        {
                                            name: "menu.manage_discount",
                                            icon: "fa fa-arrow-down",
                                            path: "/manage-discount",
                                        },
                                        {
                                            name: "menu.manage_tax",
                                            icon: "fa fa-money",
                                            path: "/manage-tax",
                                        },
                                        {
                                            name: "menu.manage_sla",
                                            icon: "fa fa-registered",
                                            path: "/manage-sla",
                                        },
                                        {
                                            name: "menu.manage_business_department",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-business-department",
                                        },
                                        {
                                            name: "menu.manage_payment",
                                            icon: "fa fa-credit-card",
                                            path: "/manage-payment",
                                        },
                                        {
                                            name: "menu.manage_bank_account",
                                            icon: "fa fa-bank",
                                            path: "/manage-bank-account",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý kho */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_warehouse",
                                    icon: "fa fa-safari",
                                    list: [
                                        {
                                            name: "menu.dashboard_inventory",
                                            icon: "fa fa-dashboard",
                                            path: "/dashboard-inventory",
                                        },
                                        {
                                            name: "menu.dashboard_bill",
                                            icon: "fa fa-dashboard",
                                            path: "/dashboard-bill",
                                        },
                                        {
                                            name: "menu.stock_management",
                                            icon: "fa fa-bank",
                                            path: "/stock-management",
                                        },
                                        {
                                            name: "menu.bin_location_management",
                                            icon: "fa fa-sitemap",
                                            path: "/bin-location-management",
                                        },
                                        {
                                            name: "menu.category_management",
                                            icon: "fa fa-cubes",
                                            path: "/category-management",
                                        },
                                        {
                                            name: "menu.good_management",
                                            icon: "fa fa-gift",
                                            path: "/good-management",
                                        },
                                        {
                                            name: "menu.bill_management",
                                            icon: "fa fa-reorder",
                                            path: "/bill-management",
                                        },
                                        {
                                            name: "menu.inventory_management",
                                            icon: "fa fa-times-circle-o",
                                            path: "/inventory-management",
                                        },
                                    ],
                                }}
                            />


                            {/* Report management */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.report_management",
                                    icon: "fa fa-calendar",
                                    list: [
                                        {
                                            name: "menu.task_report",
                                            icon: "fa fa-circle-o",
                                            path: "/task-report",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý kế hoạch sản xuất */}
                            {/* <Item item={{ name: 'menu.manage_plans', icon: 'fa fa-calendar', path: '/manage-plans' }} /> */}

                            {/* Quản lý sản xuất */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_manufacturing",
                                    icon: "fa fa-gears",
                                    list: [
                                        {
                                            name: "menu.manufacturing_dashboard",
                                            icon: "fa fa-dashboard",
                                            path: "/manufacturing-dashboard",
                                        },
                                        {
                                            name: "menu.manage_manufacturing_plan",
                                            icon: "fa fa-file-o",
                                            path: "/manage-manufacturing-plan",
                                        },
                                        {
                                            name: "menu.manage_manufacturing_command",
                                            icon: "fa fa-gavel",
                                            path: "/manage-manufacturing-command",
                                        },
                                        {
                                            name: "menu.manage_work_schedule",
                                            icon: "fa fa-calendar",
                                            path: "/manage-work-schedule",
                                        },
                                        {
                                            name: "menu.manage_manufacturing_lot",
                                            icon: "fa fa-navicon",
                                            path: "/manage-manufacturing-lot",
                                        },
                                        {
                                            name: "menu.manage_purchasing_request",
                                            icon: "fa fa-file-text-o",
                                            path: "/manage-purchasing-request",
                                        },
                                        // {
                                        //     name: "menu.analysis_manufacturing_performance",
                                        //     icon: "fa fa-bar-chart",
                                        //     path: "/analysis-manufacturing-performance",
                                        // },
                                        {
                                            name: "menu.manage_manufacturing_works",
                                            icon: "fa fa-university",
                                            path: "/manage-manufacturing-works",
                                        },
                                        {
                                            name: "menu.manage_manufacturing_mill",
                                            icon: "fa fa-home",
                                            path: "/manage-manufacturing-mill",
                                        },
                                    ],
                                }}
                            />

                            {/* Quản lý vận chuyển */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_transport",
                                    icon: "fa fa-truck",
                                    list: [
                                        // {
                                        //     name: "menu.manufacturing_dashboard",
                                        //     icon: "fa fa-dashboard",
                                        //     path: "/manufacturing-dashboard",
                                        // },
                                        {
                                            name: "menu.manage_transport_requirements",
                                            icon: "fa fa-calendar-o",
                                            path: "/manage-transport-requirement",
                                        },
                                        {
                                            name: "menu.manage_transport_plan",
                                            icon: "fa fa-calendar-o",
                                            path: "/manage-transport-plan",
                                        },
                                        {
                                            name: "menu.manage_transport_schedule",
                                            icon: "fa fa-calendar-o",
                                            path: "/manage-transport-schedule",
                                        },
                                        {
                                            name: "menu.manage_transport_route",
                                            icon: "fa fa-calendar-o",
                                            path: "/manage-transport-route",
                                        },
                                        {
                                            name: "menu.manage_transport_vehicle",
                                            icon: "fa fa-calendar-o",
                                            path: "/manage-transport-vehicle",
                                        },
                                        {
                                            name: "menu.manage_transport_department",
                                            icon: "fa fa-sitemap",
                                            path: "/manage-transport-department",
                                        },
                                        {
                                            name: "menu.carrier_today_transport_mission",
                                            icon: "fa fa-calendar-o",
                                            path: "/carrier-today-transport-mission",
                                        },
                                        // {
                                        //     name: "menu.carrier_all_times_transport_mission",
                                        //     icon: "fa fa-calendar-o",
                                        //     path: "/carrier-all-times-transport-mission", 
                                        // }, 
                                    ]
                                }}
                            />

                            {/* CRUD ví dụ theo 2 mô hình lấy dữ liệu */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.manage_examples",
                                    icon: "fa fa-edit",
                                    list: [
                                        {
                                            name: "menu.manage_examples_1",
                                            icon: "fa fa-circle",
                                            path: "/manage-examples-1",
                                        },
                                        {
                                            name: "menu.manage_examples_hooks_1",
                                            icon: "fa fa-circle",
                                            path: "/manage-examples-hooks-1",
                                        },
                                        {
                                            name: "menu.manage_examples_2",
                                            icon: "fa fa-adjust",
                                            path: "/manage-examples-2",
                                        },
                                        {
                                            name: "menu.manage_examples_hooks_2",
                                            icon: "fa fa-adjust",
                                            path: "/manage-examples-hooks-2",
                                        },
                                        {
                                            name: "menu.manage_examples_3",
                                            icon: "fa fa-adjust",
                                            path: "/manage-examples-3",
                                        },
                                        {
                                            name: "menu.manage_examples_hooks_3",
                                            icon: "fa fa-adjust",
                                            path: "/manage-examples-hooks-3",
                                        }
                                    ],
                                }}
                            />

                            {/* Hướng dẫn sử dụng */}
                            <Item
                                item={{
                                    name: "menu.user_guide",
                                    path: "/user-guide",
                                    icon: "fa fa-newspaper-o",
                                }}
                            />


                            {/* Tài khoản cá nhân */}
                            <GroupItem
                                groupItem={{
                                    name: "menu.account",
                                    icon: "fa fa-user-circle",
                                    list: [
                                        {
                                            name: "menu.detail_employee",
                                            icon: "fa fa-user-o",
                                            path: "/hr-detail-employee",
                                        },
                                        {
                                            name: "menu.update_employee",
                                            icon: "fa fa-pencil-square-o",
                                            path: "/hr-update-employee",
                                        },
                                        {
                                            name: "menu.annual_leave_personal",
                                            icon: "fa fa-calendar",
                                            path: "/hr-annual-leave-personal",
                                        },
                                    ],
                                }}
                            />
                        </ul>
                    </section>
                </aside>
            </React.Fragment>
        );
    }

    findActiveMenu = (element) => {
        if (element.nodeName === "LI" && element.className === "active") {
            return element;
        }
        for (let i = 0; i < element.childNodes.length; ++i) {
            let child = this.findActiveMenu(element.childNodes[i]);
            if (child !== null) {
                return child;
            }
        }
        return null;
    };

    updateParentMenus = (element) => {
        element = element.parentNode;
        if (window.$(element).attr("data-widget") === "tree") {
            return;
        }
        if (element.nodeName === "LI") {
            element.className = "active treeview menu-open";
        }
        this.updateParentMenus(element);
    };

    componentDidUpdate() {
        // Tìm active menu
        let activeElement = this.findActiveMenu(this.refs.sideBarMenu);

        if (activeElement !== null) {
            // Update style của các menu cha
            this.updateParentMenus(activeElement);
        }

        /**
         * Fix bug khi menu quá dài, div content-wrapper không dài theo, dẫn đến footer không đặt ở cuối trang
         * Xem code AdminLTE
         */
        window.$(".sidebar-menu").layout();
        window.$(".sidebar-menu").data("lte.layout").fix();
    }
    componentDidMount() {
        /**
         * Yêu cầu AdminLTE tạo lại menu. Ý nghĩa: Khắc phục lỗi với menu của template AdminLTE như sau.
         * Do AdminLTE chỉ quét 1 lần (sự kiện onload) element có data là data-widget = tree để xử lý sự kiện collapse, expand menu
         * Nên khi chọn 1 menu item để chuyển trang, side menu được tạo lại, không được xử lý sự kiện nữa
         * Xem thêm trong adminlte.min.js
         */
        window.$(".sidebar-menu").tree();
    }
}

const mapStates = (state) => state;

const dispatchStateToProps = {};

export default connect(mapStates, dispatchStateToProps)(withTranslate(SideBar));
