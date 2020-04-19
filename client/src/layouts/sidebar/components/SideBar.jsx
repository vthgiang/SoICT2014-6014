import React, { Component } from 'react';
import Item from './Item';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';
import { LOCAL_SERVER_API } from '../../../env';

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.checkURL = this.checkURL.bind(this);
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
        const url = {
            path1: "/hr-dashboard-employee",
            path2: "/hr-add-employee",
            path3: "/hr-list-employee",
            path4: "/hr-salary-employee",
            path5: "/hr-time-keeping",
            path6: "/hr-discipline",
            path7: "/hr-sabbatical",
            path8: "/hr-detail-employee",
            path9: "/hr-update-employee",
            path10: "/hr-list-education",
            path11: "/hr-training-plan",
            path12: "/hr-manage-department",
            path13: "/hr-manage-holiday",
        }
        const { translate, auth } = this.props;
        const { user, links } = this.props.auth;
        return (
            <React.Fragment>
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <div className="user-panel">
                            <div className="pull-left image">
                                <img src={LOCAL_SERVER_API+auth.user.avatar} className="img-circle" alt="User avatar" />
                            </div>
                            <div className="pull-left info">
                                <p>{user.name}</p>
                                {
                                    this.checkURL('/notifications', links) ?
                                    <React.Fragment>
                                        <span style={{fontSize: '10px', marginRight: '10px'}}><i className="fa fa-circle text-success"></i> Online </span>
                                        <Link to='/notifications'><i className="fa fa-bell text-yellow"></i>{translate('menu.notifications')}</Link>
                                    </React.Fragment> :
                                    <p style={{fontSize: '10px'}}><i className="fa fa-circle text-success"></i> Online </p>
                                }
                            </div>
                        </div>
                        <ul className="sidebar-menu" data-widget="tree" ref = "sideBarMenu">
                            <li className="header">*MENU*</li>
                            {
                                this.checkURL('/', links) === true &&
                                <Item
                                    key='home'
                                    name='home'
                                    path='/'
                                    icon='fa fa-home'
                                />
                            }
                            {
                                this.checkURL('/system/settings', links) === true &&
                                <Item
                                    key='manage_system'
                                    name='manage_system'
                                    path='/system/settings'
                                    icon='fa fa-gears'
                                />
                            }
                            {
                                this.checkURL('/system/companies-management', links) === true &&
                                <Item
                                    key='manage_company'
                                    name='manage_company'
                                    path='/system/companies-management'
                                    icon='fa fa-building'
                                />
                            }
                            {
                                this.checkURL('/system/roles-default-management', links) === true &&
                                <Item
                                    key='manage_role'
                                    name='manage_role'
                                    path='/system/roles-default-management'
                                    icon='fa fa-lock'
                                />
                            }
                            {
                                this.checkURL('/system/links-default-management', links) === true &&
                                <Item
                                    key='manage_link'
                                    name='manage_link'
                                    path='/system/links-default-management'
                                    icon='fa fa-link'
                                />
                            }
                            {
                                this.checkURL('/system/components-default-management', links) === true &&
                                <Item
                                    key='manage_component'
                                    name='manage_component'
                                    path='/system/components-default-management'
                                    icon='fa fa-object-group'
                                />
                            }
                            {
                                this.checkURL('/departments-management', links) === true &&
                                <Item
                                    key='manage_department'
                                    name='manage_department'
                                    path='/departments-management'
                                    icon='fa fa-sitemap'
                                />
                            }
                            {
                                this.checkURL('/users-management', links) === true &&
                                <Item
                                    key='manage_user'
                                    name='manage_user'
                                    path='/users-management'
                                    icon='fa fa-users'
                                />
                            }
                            {
                                this.checkURL('/roles-management', links) === true &&
                                <Item
                                    key='manage_role'
                                    name='manage_role'
                                    path='/roles-management'
                                    icon='fa fa-lock'
                                />
                            }
                            {
                                this.checkURL('/links-management', links) === true &&
                                <Item
                                    key='manage_link'
                                    name='manage_link'
                                    path='/links-management'
                                    icon='fa fa-link'
                                />
                            }
                            {
                                this.checkURL('/components-management', links) === true &&
                                <Item
                                    key='manage_component'
                                    name='manage_component'
                                    path='/components-management'
                                    icon='fa fa-object-group'
                                />
                            }
                            {
                                this.checkURL('/documents-management', links) === true &&
                                <Item
                                    pending={true}
                                    key='manage_document'
                                    name='manage_document'
                                    path='/documents-management'
                                    icon='fa fa-folder-open'
                                />
                            }
                            {
                                this.checkURL('/task-template', links) === true &&
                                <Item
                                    key='task_template'
                                    name='task_template'
                                    path='/task-template'
                                    icon='fa fa-flash'
                                />
                            }

                            {/* Quan ly nhan su */}
                            {
                                (this.checkURL(url.path1, links) === true || this.checkURL(url.path2, links) === true || this.checkURL(url.path3, links) === true ||
                                    this.checkURL(url.path4, links) === true || this.checkURL(url.path5, links) === true || this.checkURL(url.path12, links) === true ||
                                    this.checkURL(url.path6, links) === true || this.checkURL(url.path7, links) === true) &&
                                <li className="treeview" >
                                    <a href="">
                                        <i className="fa fa-address-book" /> <span>{translate(`menu.manage_employee`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {this.checkURL(url.path1, links) === true &&
                                            <li className={window.location.pathname === url.path1 ? "active" : ""}>
                                                <Link to={url.path1}>
                                                    <i className="fa fa-dashboard" />
                                                    {translate(`menu.dashboard_employee`)}
                                                </Link>
                                            </li>
                                        }
                                        {this.checkURL(url.path12, links) === true &&
                                            <li className={window.location.pathname === url.path12 ? "active" : ""}>
                                                <Link to={url.path12}>
                                                    <i className="fa fa-sitemap" />
                                                    {translate(`menu.manage_unit`)}
                                                </Link>
                                            </li>
                                        }
                                        {this.checkURL(url.path2, links) === true &&
                                            <li className={window.location.pathname === url.path2 ? "active" : ""}>
                                                <Link to={url.path2}>
                                                    <i className="fa fa-user-plus" />
                                                    {translate(`menu.add_employee`)}
                                                </Link>
                                            </li>
                                        }
                                        {this.checkURL(url.path3, links) === true &&
                                            <li className={window.location.pathname === url.path3 ? "active" : ""}>
                                                <Link to={url.path3}>
                                                    <i className="fa fa-address-card" />
                                                    {translate(`menu.list_employee`)}
                                                </Link>
                                            </li>
                                        }
                                        {this.checkURL(url.path4, links) === true &&
                                            <li className={window.location.pathname === url.path4 ? "active" : ""}>
                                                <Link to={url.path4}>
                                                    <i className="fa fa-line-chart" />
                                                    {translate(`menu.salary_employee`)}
                                                </Link>
                                            </li>
                                        }
                                        {this.checkURL(url.path5, links) === true &&
                                            <li className={window.location.pathname === url.path5 ? "active" : ""}>
                                                <Link to={url.path5}>
                                                    <i className="fa fa-calculator" />
                                                    {translate(`menu.time_keeping`)}
                                                </Link>
                                            </li>
                                        }
                                        {this.checkURL(url.path6, links) === true &&
                                            <li className={window.location.pathname === url.path6 ? "active" : ""}>
                                                <Link to={url.path6}>
                                                    <i className="fa fa-balance-scale" />
                                                    {translate(`menu.discipline`)}
                                                </Link>
                                            </li>
                                        }
                                        {this.checkURL(url.path7, links) === true &&
                                            <li className={window.location.pathname === url.path7 ? "active" : ""}>
                                                <Link to={url.path7}>
                                                    <i className="fa fa-calendar-times-o" />
                                                    {translate(`menu.sabbatical`)}
                                                </Link>
                                            </li>
                                        }
                                        {this.checkURL(url.path13, links) === true &&
                                            <li className={window.location.pathname === url.path13 ? "active" : ""}>
                                                <Link to={url.path13}>
                                                    <i className="fa fa-calendar" />
                                                    {translate(`menu.manage_holiday`)}
                                                </Link>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            }
                            {
                                (this.checkURL(url.path8, links) === true || this.checkURL(url.path9, links) === true) &&
                                <li className="treeview">
                                    <a href="">
                                        <i className="fa fa-user-circle" /> <span>{translate(`menu.account`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {this.checkURL(url.path8, links) === true &&
                                            <li className={window.location.pathname === url.path8 ? "active" : ""}>
                                                <Link to={url.path8}>
                                                    <i className="fa fa-user-o" />
                                                    {translate(`menu.detail_employee`)}
                                                </Link>
                                            </li>
                                        }
                                        {this.checkURL(url.path9, links) === true &&
                                            <li className={window.location.pathname === url.path9 ? "active" : ""}>
                                                <Link to={url.path9}>
                                                    <i className="fa fa-pencil-square-o" />
                                                    {translate(`menu.update_employee`)}
                                                </Link>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            }
                            {
                                (this.checkURL(url.path10, links) === true || this.checkURL(url.path11, links) === true) &&
                                <li className="treeview">
                                    <a href = "">
                                        <i className="fa fa-graduation-cap" /> <span>{translate(`menu.manage_training`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {this.checkURL(url.path10, links) === true &&
                                            <li className={window.location.pathname === url.path10 ? "active" : ""}>
                                                <Link to={url.path10}>
                                                    <i className="fa fa-university" />
                                                    {translate(`menu.list_education`)}
                                                </Link>
                                            </li>
                                        }
                                        {this.checkURL(url.path11, links) === true &&
                                            <li className={window.location.pathname === url.path11 ? "active" : ""}>
                                                <Link to={url.path11}>
                                                    <i className="fa fa-list-alt" />
                                                    {translate(`menu.training_plan`)}
                                                </Link>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            }

                            {/* kpi-management */}
                            {
                                (this.checkURL('/kpi-units/create', links) === true || this.checkURL('/kpi-units/overview', links) === true || this.checkURL('/kpi-personals/create', links) === true || this.checkURL('/kpi-personals/overview', links) === true) &&
                                <li className="treeview">
                                    <a href="">
                                        <i className="fa fa-dashboard" /> <span>{translate(`menu.manage_kpi`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {
                                            (this.checkURL('/kpi-units/overview', links) === true) &&
                                            <li className={window.location.pathname === "/kpi-units/overview" ? "active" : ""}>
                                                <Link to="/kpi-units/overview">{translate(`menu.kpi_unit_overview`)}</Link>
                                            </li>
                                        }
                                        {
                                            (this.checkURL('/kpi-units/create', links) === true) &&
                                            <li className={window.location.pathname === "/kpi-units/create" ? "active" : ""}>
                                                <Link to="/kpi-units/create">{translate(`menu.kpi_unit_create`)}</Link>
                                            </li>
                                        }
                                        
                                        {
                                            (this.checkURL('/kpi-member/overview', links) === true) &&
                                            <li className={window.location.pathname === "/kpi-member/overview" ? "active" : ""}>
                                                <Link to="/kpi-member/overview">{translate(`menu.kpi_member`)}</Link>
                                            </li>
                                        }

                                        {
                                            (this.checkURL('/kpi-member-dashboard', links) === true) &&
                                            <li className={window.location.pathname === "/kpi-member-dashboard" ? "active" : ""}>
                                                <Link to="/kpi-member-dashboard">{translate(`menu.kpi_member_dashboard`)}</Link>
                                            </li>
                                        }
                                        
                                        {/* {
                                            (this.checkURL('/kpi-personals/overview', links) === true) &&
                                            <li className={window.location.pathname === "/kpi-personals/overview" ? "active" : ""}>
                                                <Link to="/kpi-personals/overview">{translate(`menu.kpi_personal_overview`)}</Link>
                                            </li>
                                        } */}
                                        {
                                            (this.checkURL('/kpi-personals/manager', links) === true) &&
                                            <li className={window.location.pathname === "/kpi-personals/manager" ? "active" : ""}>
                                                <Link to="/kpi-personals/manager">{translate(`menu.kpi_personal_manager`)}</Link>
                                            </li>
                                        }
                                        {
                                            (this.checkURL('/kpi-personals/dashboard', links) === true) &&
                                            <li className={window.location.pathname === "/kpi-personals/dashboard" ? "active" : ""}>
                                                <Link to="/kpi-personals/dashboard">{translate(`menu.kpi_personal_dashboard`)}</Link>
                                            </li>
                                        }
                                        {
                                            (this.checkURL('/kpi-personals/create', links) === true) &&
                                            <li className={window.location.pathname === "/kpi-personals/create" ? "active" : ""}>
                                                <Link to="/kpi-personals/create">{translate(`menu.kpi_personal_create`)}</Link>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            }
                            {/* Task management */}
                            {   
                                (this.checkURL('/task-management-dashboard', links) === true || this.checkURL('/task-management', links) === true) && 
                                <li className="treeview">
                                    <a href = "">
                                    <i className="fa fa-tasks"></i> <span>{translate(`menu.tasks`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {
                                            this.checkURL('/task-management-dashboard', links) === true &&
                                            <li className={window.location.pathname === "/task-management-dashboard" ? "active" : ""}>
                                                <Link to="/task-management-dashboard">{translate(`menu.task_management_dashboard`)}</Link>
                                            </li>
                                        }
                                        {
                                            this.checkURL('/task-management', links) === true &&
                                            <li className={window.location.pathname === "/task-management" ? "active" : ""}>
                                                <Link to="/task-management">{translate(`menu.task_management`)}</Link>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            }
                        </ul>
                    </section>
                </aside>
            </React.Fragment>
        );
    }

    findActiveMenu = (element) => {
        if (element.nodeName === "LI" && element.className === "active"){
            return element;
        }
        for (let i = 0; i<element.childNodes.length; ++i){
            let child = this.findActiveMenu(element.childNodes[i])
            if (child !== null) {
                return child;
            }
        }
        return null;
    }

    updateParentMenus = (element) => {
        element = element.parentNode;
        if (window.$(element).attr('data-widget') === 'tree'){
            return;
        }
        if (element.nodeName === "LI"){
            element.className = "active treeview menu-open"
        }
        this.updateParentMenus(element);
    }

    componentDidUpdate(){
        // Tìm active menu
        let activeElement = this.findActiveMenu(this.refs.sideBarMenu);
        
        if (activeElement !== null) { // Update style của các menu cha
            this.updateParentMenus(activeElement);
        }
    }
    componentDidMount(){
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
