import React, { Component } from 'react';
import Item from './item';
import GroupItem from './groupItem';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    checkURL = (urlName, linkArr) => {
        var result = false;
        if (linkArr !== undefined) {
            linkArr.forEach(link => {
                if (link.url === urlName) {
                    result = true;
                }
            });
        }

        return result;
    }

    render() {
        const { translate, auth } = this.props;
        const { user, links } = this.props.auth;

        return (
            <React.Fragment>
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <div className="user-panel">
                            <div className="pull-left image">
                                <img src={process.env.REACT_APP_SERVER + auth.user.avatar} className="img-circle" alt="User avatar" />
                            </div>
                            <div className="pull-left info">
                                <p>{user.name}</p>
                                {
                                    this.checkURL('/notifications', links) ?
                                        <React.Fragment>
                                            <span style={{ fontSize: '10px', marginRight: '10px' }}><i className="fa fa-circle text-success"></i> Online </span>
                                            <Link to='/notifications'><i className="fa fa-bell text-yellow"></i>{translate('menu.notifications')}</Link>
                                        </React.Fragment> :
                                        <p style={{ fontSize: '10px' }}><i className="fa fa-circle text-success"></i> Online </p>
                                }
                            </div>
                        </div>
                        <ul className="sidebar-menu" data-widget="tree" ref="sideBarMenu">

                            {/* Trang chủ */}
                            <Item item={{ name: 'menu.home', path: '/', icon: 'fa fa-home' }} />

                            {/* Quản trị của system admin */}
                            <GroupItem groupItem={{
                                name: 'menu.system',
                                icon: 'fa fa-gears',
                                list: [
                                    { name: 'menu.manage_system', icon: 'fa fa-gear', path: '/system/settings' },
                                    { name: 'menu.manage_role', icon: 'fa fa-lock', path: '/system/roles-default-management' },
                                    { name: 'menu.manage_link', icon: 'fa fa-link', path: '/system/links-default-management' },
                                    { name: 'menu.manage_component', icon: 'fa fa-object-group', path: '/system/components-default-management' },
                                ]
                            }} />

                            {/* Quản lý doanh nghiệp */}
                            <Item item={{ name: 'menu.manage_company', icon: 'fa fa-building', path: '/system/companies-management' }} />

                            {/* Phân quyền IAM-RBAC */}
                            <GroupItem groupItem={{
                                name: 'menu.iam_rbac',
                                icon: 'fa fa-key',
                                list: [
                                    { name: 'menu.manage_department', icon: 'fa fa-sitemap', path: '/departments-management' },
                                    { name: 'menu.manage_user', icon: 'fa fa-users', path: '/users-management' },
                                    { name: 'menu.manage_role', icon: 'fa fa-lock', path: '/roles-management' },
                                    { name: 'menu.manage_link', icon: 'fa fa-link', path: '/links-management' },
                                    { name: 'menu.manage_component', icon: 'fa fa-object-group', path: '/components-management' },
                                ]
                            }} />

                            {/* Quản lý tài liệu */}
                            <Item item={{ name: 'menu.manage_document', icon: 'fa fa-folder-open', path: '/documents-management' }} />
                            <Item item={{ name: 'menu.manage_document', icon: 'fa fa-file-text', path: '/documents' }} />

                            {/* Quản lý kho */}
                            <GroupItem groupItem={{
                                name: 'menu.manage_warehouse',
                                icon: 'fa fa-bank',
                                list: [
                                    { name: 'menu.dashboard_material', icon: 'fa fa-dashboard', path: '/dashboad-material' },
                                    { name: 'menu.material_manager', icon: 'fa fa-address-card', path: '/material-manager' },
                                ]
                            }} />

                            {/* CRM */}
                            <GroupItem groupItem={{
                                name: 'menu.crm',
                                icon: 'fa fa-users',
                                list: [
                                    { name: 'menu.customer', icon: 'fa fa-circle-o', path: '/customer' },
                                    { name: 'menu.customer_group', icon: 'fa fa-circle-o', path: '/customer-group' },
                                ]
                            }} />

                            {/* Quan ly tai san */}
                            <GroupItem groupItem={{
                                name: 'menu.manage_asset',
                                icon: 'fa fa-address-book',
                                list: [
                                    { name: 'menu.dashboard_asset', icon: 'fa fa-dashboard', path: '/dashboard-asset' },
                                    { name: 'menu.manage_info_asset', icon: 'fa fa-sitemap', path: '/manage-info-asset' },
                                    { name: 'menu.manage_depreciation_asset', icon: 'fa fa-balance-scale', path: '/manage-depreciation-asset' },
                                    { name: 'menu.manage_maintainance_asset', icon: 'fa fa-sitemap', path: '/manage-maintainance-asset' },
                                    { name: 'menu.manage_incident_asset', icon: 'fa fa-calendar', path: '/manage-incident-asset' },
                                    { name: 'menu.manage_recommend_distribute_asset', icon: 'fa fa-calendar', path: '/manage-recommend-distribute-asset' },
                                    { name: 'menu.manage_usage_asset', icon: 'fa fa-sitemap', path: '/manage-usage-asset' },
                                    { name: 'menu.manage_recommend_procure', icon: 'fa fa-sitemap', path: '/manage-recommend-procure' },
                                    { name: 'menu.manage_type_asset', icon: 'fa fa-dashboard', path: '/manage-type-asset' },
                                    { name: 'menu.view_building_list', icon: 'fa fa-building', path: '/view-building-list' },
                                    { name: 'menu.manage_assigned_asset', icon: 'fa fa-calendar', path: '/manage-assigned-asset' },
                                    { name: 'menu.employee_manage_asset_info', icon: 'fa fa-sitemap', path: '/employee-manage-asset-info' },
                                    { name: 'menu.recommend_distribute_asset', icon: 'fa fa-calendar', path: '/recommend-distribute-asset' },
                                    { name: 'menu.recommend_equipment_procurement', icon: 'fa fa-calendar', path: '/recommend-equipment-procurement' },
                                ]
                            }} />

                            {/* Quan ly nhan su */}
                            <GroupItem groupItem={{
                                name: 'menu.manage_employee',
                                icon: 'fa fa-address-book',
                                list: [
                                    { name: 'menu.dashboard_employee', icon: 'fa fa-dashboard', path: '/hr-dashboard-employee' },
                                    { name: 'menu.manage_unit', icon: 'fa fa-sitemap', path: '/hr-manage-department' },
                                    { name: 'menu.add_employee', icon: 'fa fa-user-plus', path: '/hr-add-employee' },
                                    { name: 'menu.list_employee', icon: 'fa fa-address-card', path: '/hr-list-employee' },
                                    { name: 'menu.salary_employee', icon: 'fa fa-line-chart', path: '/hr-salary-employee' },
                                    { name: 'menu.time_keeping', icon: 'fa fa-calculator', path: '/hr-time-keeping' },
                                    { name: 'menu.discipline', icon: 'fa fa-balance-scale', path: '/hr-discipline' },
                                    { name: 'menu.annual_leave', icon: 'fa fa-calendar-times-o', path: '/hr-annual-leave' },
                                    { name: 'menu.manage_holiday', icon: 'fa fa-calendar', path: '/hr-manage-holiday' },
                                ]
                            }} />

                            <GroupItem groupItem={{
                                name: 'menu.account',
                                icon: 'fa fa-user-circle',
                                list: [
                                    { name: 'menu.detail_employee', icon: 'fa fa-user-o', path: '/hr-detail-employee' },
                                    { name: 'menu.work_plan', icon: 'fa fa-calendar', path: '/hr-work-plan' },
                                    { name: 'menu.update_employee', icon: 'fa fa-pencil-square-o', path: '/hr-update-employee' },

                                ]
                            }} />

                            <GroupItem groupItem={{
                                name: 'menu.manage_training',
                                icon: 'fa fa-graduation-cap',
                                list: [
                                    { name: 'menu.list_education', icon: 'fa fa-university', path: '/hr-list-education' },
                                    { name: 'menu.training_plan', icon: 'fa fa-list-alt', path: '/hr-training-plan' },
                                ]
                            }} />

                            {/* kpi-management */}
                            <GroupItem groupItem={{
                                name: 'menu.manage_kpi',
                                icon: 'fa fa-dashboard',
                                list: [
                                    { name: 'menu.kpi_unit_dashboard', icon: 'fa fa-circle-o', path: '/kpi-units/dashboard' },
                                    { name: 'menu.kpi_unit_create', icon: 'fa fa-circle-o', path: '/kpi-units/create' },
                                    { name: 'menu.kpi_unit_manager', icon: 'fa fa-circle-o', path: '/kpi-units/manager' },
                                    { name: 'menu.kpi_unit_statistic', icon: 'fa fa-circle-o', path: '/kpi-units/statisti' },
                                    { name: 'menu.kpi_member_dashboard', icon: 'fa fa-circle-o', path: '/kpi-member/dashboard' },
                                    { name: 'menu.kpi_member_manager', icon: 'fa fa-circle-o', path: '/kpi-member/manager' },
                                    { name: 'menu.kpi_personal_dashboard', icon: 'fa fa-circle-o', path: '/kpi-personals/dashboard' },
                                    { name: 'menu.kpi_personal_create', icon: 'fa fa-circle-o', path: '/kpi-personals/create' },
                                    { name: 'menu.kpi_personal_manager', icon: 'fa fa-circle-o', path: '/kpi-personals/manager' },

                                    // { name: 'menu.kpi_unit_overview', icon: 'fa fa-circle-o', path: '/kpi-units/overview' },
                                    // { name: 'menu.kpi_personal_overview', icon: 'fa fa-circle-o', path: '/kpi-personals/overview' },
                                ]
                            }} />

                            {/* Quản lý đơn hàng */}
                            <GroupItem groupItem={{
                                name: 'menu.manage_orders',
                                icon: 'fa fa-reorder',
                                list: [
                                    { name: 'menu.manage_list_orders', icon: 'fa fa-reorder', path: '/manage-orders' },
                                    { name: 'menu.manage_list_orders', icon: 'fa fa-reorder', path: '/manage-list-orders' },
                                ]
                            }} />

                            <Item item={{ name: 'menu.task_template', icon: 'fa fa-flash', path: '/task-template' }} />

                            {/* Task management */}
                            <GroupItem groupItem={{
                                name: 'menu.tasks',
                                icon: 'fa fa-tasks',
                                list: [
                                    { name: 'menu.task_organization_management_dashboard', icon: 'fa fa-circle-o', path: '/task-organization-management-dashboard' },
                                    { name: 'menu.task_management_dashboard', icon: 'fa fa-circle-o', path: '/task-management-dashboard' },
                                    { name: 'menu.task_management', icon: 'fa fa-circle-o', path: '/task-management' },
                                    { name: 'menu.task_process_template', icon: 'fa fa-circle-o', path: '/task-process-template' },
                                    { name: 'menu.task_management_process', icon: 'fa fa-circle-o', path: '/task-process-management' },
                                ]
                            }} />

                            {/* Report management */}
                            <GroupItem groupItem={{
                                name: 'menu.report_management',
                                icon: 'fa fa-calendar',
                                list: [
                                    { name: 'menu.task_report', icon: 'fa fa-circle-o', path: '/task-report' },
                                ]
                            }} />
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
            let child = this.findActiveMenu(element.childNodes[i])
            if (child !== null) {
                return child;
            }
        }
        return null;
    }

    updateParentMenus = (element) => {
        element = element.parentNode;
        if (window.$(element).attr('data-widget') === 'tree') {
            return;
        }
        if (element.nodeName === "LI") {
            element.className = "active treeview menu-open"
        }
        this.updateParentMenus(element);
    }

    componentDidUpdate() {
        // Tìm active menu
        let activeElement = this.findActiveMenu(this.refs.sideBarMenu);

        if (activeElement !== null) { // Update style của các menu cha
            this.updateParentMenus(activeElement);
        }

        /**
         * Fix bug khi menu quá dài, div content-wrapper không dài theo, dẫn đến footer không đặt ở cuối trang
         * Xem code AdminLTE
         */
        window.$('.sidebar-menu').layout();
        window.$('.sidebar-menu').data("lte.layout").fix();

    }
    componentDidMount() {
        /**
         * Yêu cầu AdminLTE tạo lại menu. Ý nghĩa: Khắc phục lỗi với menu của template AdminLTE như sau.
         * Do AdminLTE chỉ quét 1 lần (sự kiện onload) element có data là data-widget = tree để xử lý sự kiện collapse, expand menu
         * Nên khi chọn 1 menu item để chuyển trang, side menu được tạo lại, không được xử lý sự kiện nữa
         * Xem thêm trong adminlte.min.js
        */
        window.$('.sidebar-menu').tree();
    }
}

const mapStates = state => state;

const dispatchStateToProps = {

}

export default connect(mapStates, dispatchStateToProps)(withTranslate(SideBar));
