import React, { Component } from 'react';
import Item from './Item';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.checkURL = this.checkURL.bind(this);
    }
    handClick = (event) => {
        var parent = window.$("a." + event).parent(".treeview");
        window.$('html,body').animate({
            scrollTop: parent.offset().top
        },
            'slow');
        if (parent.attr('class') === "treeview") {
            parent.addClass("active menu-open");
        } else {
            parent.removeClass("active");
            parent.removeClass("menu-open");
        }
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
            path10: "/hr-list-course",
            path11: "/hr-training-plan",
            path12: "/hr-manage-department",
            path13: "/hr-manage-holiday",
            path14: "/kpi-units/create",
            path15: "/kpi-units/overview",
            path16: "/kpi-personals/create",
            path17: "/kpi-personals/overview",
            path18: "/task-management",
            path19: "/task-management-dashboard",

        }
        const { translate } = this.props;
        const { user, links } = this.props.auth;
        return (
            <React.Fragment>
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <div className="user-panel">
                            <div className="pull-left image">
                                <img src="/lib/adminLTE/dist/img/user1-128x128.jpg" className="img-circle" alt="User avatar" />
                            </div>
                            <div className="pull-left info">
                                <p>{user.name}</p>
                                <Link to='/notifications'><i className="fa fa-bell text-yellow"></i>{translate('menu.notifications')}</Link>
                            </div>
                        </div>
                        <ul className="sidebar-menu" data-widget="tree">
                            <li className="header">SIDEBAR</li>
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
                                this.checkURL('/system/links-default-management', links) === true &&
                                <Item
                                    key='manage_page'
                                    name='manage_page'
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
                                this.checkURL('/pages-management', links) === true &&
                                <Item
                                    key='manage_page'
                                    name='manage_page'
                                    path='/pages-management'
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
                                <li className={window.location.pathname === url.path1 || window.location.pathname === url.path2 || window.location.pathname === url.path3 ||
                                    window.location.pathname === url.path4 || window.location.pathname === url.path5 || window.location.pathname === url.path12 ||
                                    window.location.pathname === url.path6 || window.location.pathname === url.path7 || window.location.pathname === url.path13 ? "active treeview menu-open" : "treeview"} >
                                    <a className="tree1" onClick={() => this.handClick("tree1")}>
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
                                <li className={window.location.pathname === url.path8 || window.location.pathname === url.path9 ? "active treeview menu-open" : "treeview"}>
                                    <a className="tree2" onClick={() => this.handClick("tree2")}>
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
                                <li className={window.location.pathname === url.path10 || window.location.pathname === url.path11 ? "active treeview menu-open" : "treeview"}>
                                    <a className="tree3" onClick={() => this.handClick("tree3")}>
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
                                                    {translate(`menu.list_course`)}
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
                                <li className={window.location.pathname === url.path14 || window.location.pathname === url.path15 || window.location.pathname === url.path16 || window.location.pathname === url.path17 ? "active treeview menu-open" : "treeview"}>
                                    <a className="tree4" onClick={() => this.handClick("tree4")}>
                                        <i className="fa fa-dashboard" /> <span>{translate(`menu.manage_kpi`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {
                                            (this.checkURL('/kpi-units/create', links) === true || this.checkURL('/kpi-units/overview', links) === true) &&
                                            <li className={window.location.pathname === url.path14 || window.location.pathname === url.path15 ? "active treeview menu-open" : "treeview"}>
                                                <a className="tree4_1" onClick={ ()=> this.handClick("tree4_1") } > {translate(`menu.kpi_unit`)}
                                                    <span className="pull-right-container">
                                                        <i className="fa fa-angle-left pull-right" />
                                                    </span>
                                                </a>
                                                <ul className="treeview-menu">
                                                    {
                                                        (this.checkURL('/kpi-units/overview', links) === true) &&
                                                        <li className={window.location.pathname === url.path15 ? "active" : ""}>
                                                            <Link to="/kpi-units/overview">{translate(`menu.kpi_unit_overview`)}</Link>
                                                        </li>
                                                    }
                                                    {
                                                        (this.checkURL('/kpi-units/create', links) === true) &&
                                                        <li className={window.location.pathname === url.path14 ? "active" : ""}>
                                                            <Link to="/kpi-units/create">{translate(`menu.kpi_unit_create`)}</Link>
                                                        </li>
                                                    }
                                                </ul>
                                            </li>
                                        }
                                        {
                                            (this.checkURL('/kpi-personals/create', links) === true || this.checkURL('/kpi-personals/overview', links) === true) &&
                                            <li className={window.location.pathname === url.path16 || window.location.pathname === url.path17 ? "active treeview menu-open" : "treeview"}>
                                                <a className="tree4_2" onClick={ ()=> this.handClick("tree4_2") } >{translate(`menu.kpi_personal`)}
                                                    <span className="pull-right-container">
                                                        <i className="fa fa-angle-left pull-right" />
                                                    </span>
                                                </a>
                                                <ul className="treeview-menu">
                                                    {
                                                        (this.checkURL('/kpi-personals/overview', links) === true) &&
                                                        <li className={window.location.pathname === url.path17 ? "active" : ""}>
                                                            <Link to="/kpi-personals/overview">{translate(`menu.kpi_personal_overview`)}</Link>
                                                        </li>
                                                    }
                                                    {
                                                        (this.checkURL('/kpi-personals/create', links) === true) &&
                                                        <li className={window.location.pathname === url.path16 ? "active" : ""}>
                                                            <Link to="/kpi-personals/create">{translate(`menu.kpi_personal_create`)}</Link>
                                                        </li>
                                                    }

                                                </ul>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            }
                            {/* Task management */}
                            {   
                                ((this.checkURL('/task-management-dashboard', links) === true) || (this.checkURL('/task-management', links) === true)) && 
                                <li className={window.location.pathname === url.path18 || window.location.pathname === url.path19 ? "active treeview menu-open" : "treeview"}>
                                    <a className="tree5" onClick={() => this.handClick("tree5")}>
                                    <i className="fa fa-tasks"></i> <span>{translate(`menu.tasks`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {
                                            (this.checkURL('/task-management-dashboard', links) === true) &&
                                            <li className={window.location.pathname === url.path19 ? "active" : ""}>
                                                <Link to="/task-management-dashboard">{translate(`menu.task_management_dashboard`)}</Link>
                                            </li>
                                        }
                                        {
                                            (this.checkURL('/task-management', links) === true) &&
                                            <li className={window.location.pathname === url.path18 ? "active" : ""}>
                                                <Link to="/task-management">{translate(`menu.task_management`)}</Link>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            }
                            {/* can them cai goi ham checkURL() */}
                            <li>
                                <a href="/kpi-member/overview">
                                    <i className="fa fa-dashboard" /> <span>Quản lý kpi nhân viên</span>
                                </a>
                            </li>
                        </ul>
                    </section>
                </aside>
            </React.Fragment>
        );
    }
}

const mapStates = state => state;

const dispatchStateToProps = {

}

export default connect(mapStates, dispatchStateToProps)(withTranslate(SideBar));
