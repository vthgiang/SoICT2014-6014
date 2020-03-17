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
        //this.handClick = this.handClick.bind(this);
    }
    handClick = (event) => {
        var parent = window.$("a." + event).parent(".treeview");
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
            path1: "/dashboard-employee",
            path2: "/add-employee",
            path3: "/list-employee",
            path4: "/salary-employee",
            path5: "/time-keeping",
            path6: "/discipline",
            path7: "/sabbatical",
            path8: "/detail-employee",
            path9: "/update-employee",
            path10: "/list-course",
            path11: "/training-plan",
            path12: "/manage-unit",

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
                                this.checkURL('/log', links) === true &&
                                <Item
                                    key='manage_system'
                                    name='manage_system'
                                    path='/log'
                                    icon='fa fa-gears'
                                />
                            }
                            {
                                this.checkURL('/manage-company', links) === true &&
                                <Item
                                    key='manage_company'
                                    name='manage_company'
                                    path='/manage-company'
                                    icon='fa fa-building'
                                />
                            }
                            {
                                this.checkURL('/manage-department', links) === true &&
                                <Item
                                    key='manage_department'
                                    name='manage_department'
                                    path='/manage-department'
                                    icon='fa fa-sitemap'
                                />
                            }
                            {
                                this.checkURL('/manage-user', links) === true &&
                                <Item
                                    key='manage_user'
                                    name='manage_user'
                                    path='/manage-user'
                                    icon='fa fa-users'
                                />
                            }
                            {
                                this.checkURL('/manage-role', links) === true &&
                                <Item
                                    key='manage_role'
                                    name='manage_role'
                                    path='/manage-role'
                                    icon='fa fa-lock'
                                />
                            }
                            {
                                this.checkURL('/manage-link', links) === true &&
                                <Item
                                    key='manage_page'
                                    name='manage_page'
                                    path='/manage-link'
                                    icon='fa fa-link'
                                />
                            }
                            {
                                this.checkURL('/manage-component', links) === true &&
                                <Item
                                    key='manage_component'
                                    name='manage_component'
                                    path='/manage-component'
                                    icon='fa fa-object-group'
                                />
                            }
                            {
                                this.checkURL('/manage-document', links) === true &&
                                <Item
                                    pending={true}
                                    key='manage_document'
                                    name='manage_document'
                                    path='/manage-document'
                                    icon='fa fa-folder-open'
                                />
                            }

                            {/* Quan ly nhan su */}
                            {
                                (this.checkURL(url.path1, links) === true || this.checkURL(url.path2, links) === true || this.checkURL(url.path3, links) === true ||
                                    this.checkURL(url.path4, links) === true || this.checkURL(url.path5, links) === true || this.checkURL(url.path12, links) === true ||
                                    this.checkURL(url.path6, links) === true || this.checkURL(url.path7, links) === true) &&
                                <li className={window.location.pathname === url.path1 || window.location.pathname === url.path2 || window.location.pathname === url.path3 ||
                                    window.location.pathname === url.path4 || window.location.pathname === url.path5 || window.location.pathname === url.path12 ||
                                    window.location.pathname === url.path6 || window.location.pathname === url.path7 ? "active treeview menu-open" : "treeview"} >
                                    <a href="#abc" className="tree1" onClick={() => this.handClick("tree1")}>
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
                                    </ul>
                                </li>
                            }
                            {
                                (this.checkURL(url.path8, links) === true || this.checkURL(url.path9, links) === true) &&
                                <li className={window.location.pathname === url.path8 || window.location.pathname === url.path9 ? "active treeview menu-open" : "treeview"}>
                                    <a href="#abc" className="tree2" onClick={() => this.handClick("tree2")}>
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
                                    <a href="#abc" className="tree3" onClick={() => this.handClick("tree3")}>
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
                                <li className="treeview">
                                    <a href="#abc" className="tree4" onClick={() => this.handClick("tree4")}>
                                        <i className="fa fa-dashboard" /> <span>{translate(`menu.manage_kpi`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {
                                            (this.checkURL('/kpi-units/create', links) === true || this.checkURL('/kpi-units/overview', links) === true) &&
                                            <li className="treeview">
                                                <a href="#kpiunit"> {translate(`menu.kpi_unit`)}
                                                    <span className="pull-right-container">
                                                        <i className="fa fa-angle-left pull-right" />
                                                    </span>
                                                </a>
                                                <ul className="treeview-menu">
                                                    {
                                                        (this.checkURL('/kpi-units/overview', links) === true) &&
                                                        <li><a href="/kpi-units/overview">{translate(`menu.kpi_unit_overview`)}</a></li>
                                                    }
                                                    {
                                                        (this.checkURL('/kpi-units/create', links) === true) &&
                                                        <li><a href="/kpi-units/create">{translate(`menu.kpi_unit_create`)}</a></li>
                                                    }
                                                </ul>
                                            </li>
                                        }
                                        {
                                            (this.checkURL('/kpi-personals/create', links) === true || this.checkURL('/kpi-personals/overview', links) === true) &&
                                            <li className="treeview">
                                                <a href="#kpipersonnal">{translate(`menu.kpi_personal`)}
                                                    <span className="pull-right-container">
                                                        <i className="fa fa-angle-left pull-right" />
                                                    </span>
                                                </a>
                                                <ul className="treeview-menu">
                                                    {
                                                        (this.checkURL('/kpi-personals/overview', links) === true) &&
                                                        <li><a href="/kpi-personals/overview">{translate(`menu.kpi_personal_overview`)}</a></li>
                                                    }
                                                    {
                                                        (this.checkURL('/kpi-personals/create', links) === true) &&
                                                        <li><a href="/kpi-personals/create">{translate(`menu.kpi_personal_create`)}</a></li>
                                                    }

                                                </ul>
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
}

const mapStates = state => state;

const dispatchStateToProps = {

}

export default connect(mapStates, dispatchStateToProps)(withTranslate(SideBar));
