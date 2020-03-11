import React, { Component } from 'react';
import Item from './Item';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
// import { Link } from 'react-router-dom';

// ,{
//     name: 'Manage ComponentUI',
//     path: '/manage-component-ui',
//     icon: 'fa fa-simplybuilt'
// },

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

        }
        const { translate } = this.props;
        const { links } = this.props.auth;
        return (
            <React.Fragment>
                <aside className="main-sidebar">
                    <section className="sidebar">
                        {/* <div className="user-panel">
                            <div className="pull-left image">
                                <img src="/lib/adminLTE/dist/img/user2-160x160.jpg" className="img-circle" alt="User avatar" />
                            </div>
                            <div className="pull-left info">
                                <p>User</p>
                                <a href="#abc"><i className="fa fa-circle text-success" /> Online</a>
                            </div>
                        </div>
                        <form action="#" method="get" className="sidebar-form">
                            <div className="input-group">
                                <input type="text" name="q" className="form-control" placeholder="Search" />
                                <span className="input-group-btn">
                                    <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search" />
                                    </button>
                                </span>
                            </div>
                        </form> */}
                        <ul className="sidebar-menu" data-widget="tree">
                            {/* <li className="header">MENU</li> */}
                            <Item
                                key='home'
                                name='home'
                                path='/'
                                icon='fa fa-home'
                            />
                            {
                                this.checkURL('/system', links) === true &&
                                <Item
                                    key='manage_system'
                                    name='manage_system'
                                    path='/system'
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
                                    key='manage_document'
                                    name='manage_document'
                                    path='/manage-form-document'
                                    icon='fa fa-folder-open'
                                />
                            }

                            {/* Quan ly nhan su */}
                            {
                                (this.checkURL(url.path1, links) === true || this.checkURL(url.path2, links) === true || this.checkURL(url.path3, links) === true ||
                                    this.checkURL(url.path4, links) === true || this.checkURL(url.path5, links) === true ||
                                    this.checkURL(url.path6, links) === true || this.checkURL(url.path7, links) === true) &&
                                <li className={window.location.pathname === url.path1 || window.location.pathname === url.path2 || window.location.pathname === url.path3 ||
                                    window.location.pathname === url.path4 || window.location.pathname === url.path5 ||
                                    window.location.pathname === url.path6 || window.location.pathname === url.path7 ? "active treeview menu-open" : "treeview"}>
                                    <a href="#">
                                        <i className="fa fa-address-book" /> <span>{translate(`menu.manage_employee`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {this.checkURL(url.path1, links) === true &&
                                            <li className={ window.location.pathname === url.path1 ? "active" : "" }>
                                                <a href={url.path1}>
                                                    <i className="fa fa-dashboard" />
                                                    {translate(`menu.dashboard_employee`)}
                                                </a>
                                            </li>
                                        }
                                        {this.checkURL(url.path2, links) === true &&
                                            <li className={ window.location.pathname === url.path2 ? "active" : "" }>
                                                <a href={url.path2}>
                                                    <i className="fa fa-user-plus" />
                                                    {translate(`menu.add_employee`)}
                                                </a>
                                            </li>
                                        }
                                        {this.checkURL(url.path3, links) === true &&
                                            <li className={ window.location.pathname === url.path3 ? "active" : "" }>
                                                <a href={url.path3}>
                                                    <i className="fa fa-address-card" />
                                                    {translate(`menu.list_employee`)}
                                                </a>
                                            </li>
                                        }
                                        {this.checkURL(url.path4, links) === true &&
                                            <li className={ window.location.pathname === url.path4 ? "active" : "" }>
                                                <a href={url.path4}>
                                                    <i className="fa fa-line-chart" />
                                                    {translate(`menu.salary_employee`)}
                                                </a>
                                            </li>
                                        }
                                        {this.checkURL(url.path5, links) === true &&
                                            <li className={ window.location.pathname === url.path5 ? "active" : "" }>
                                                <a href={url.path5}>
                                                    <i className="fa fa-calculator" />
                                                    {translate(`menu.time_keeping`)}
                                                </a>
                                            </li>
                                        }
                                        {this.checkURL(url.path6, links) === true &&
                                            <li className={ window.location.pathname === url.path6 ? "active" : "" }>
                                                <a href={url.path6}>
                                                    <i className="fa fa-balance-scale" />
                                                    {translate(`menu.discipline`)}
                                                </a>
                                            </li>
                                        }
                                        {this.checkURL(url.path7, links) === true &&
                                            <li className={ window.location.pathname === url.path7 ? "active" : "" }>
                                                <a href={url.path7}>
                                                    <i className="fa fa-calendar-times-o" />
                                                    {translate(`menu.sabbatical`)}
                                                </a>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            }
                            {
                                (this.checkURL(url.path8, links) === true || this.checkURL(url.path9, links) === true) &&
                                <li className={window.location.pathname === url.path8 || window.location.pathname === url.path9 ? "active treeview menu-open" : "treeview"}>
                                    <a href="#">
                                        <i className="fa fa-user-circle" /> <span>{translate(`menu.account`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {this.checkURL(url.path8, links) === true &&
                                            <li className={ window.location.pathname === url.path8 ? "active" : "" }>
                                                <a href={url.path8}>
                                                    <i className="fa fa-user-o" />
                                                    {translate(`menu.detail_employee`)}
                                                </a>
                                            </li>
                                        }
                                        {this.checkURL(url.path9, links) === true &&
                                            <li className={ window.location.pathname === url.path9 ? "active" : "" }>
                                                <a href={url.path9}>
                                                    <i className="fa fa-pencil-square-o" />
                                                    {translate(`menu.update_employee`)}
                                                </a>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            }
                            {
                                (this.checkURL(url.path10, links) === true || this.checkURL(url.path11, links) === true) &&
                                <li className={window.location.pathname === url.path10 || window.location.pathname === url.path11 ? "active treeview menu-open" : "treeview"}>
                                    <a href="#">
                                        <i className="fa fa-graduation-cap" /> <span>{translate(`menu.manage_training`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {this.checkURL(url.path10, links) === true &&
                                            <li className={ window.location.pathname === url.path10 ? "active" : "" }>
                                                <a href={url.path10}>
                                                    <i className="fa fa-university" />
                                                    {translate(`menu.list_course`)}
                                                </a>
                                            </li>
                                        }
                                        {this.checkURL(url.path11, links) === true &&
                                            <li className={ window.location.pathname === url.path11 ? "active" : "" }>
                                                <a href={url.path11}>
                                                    <i className="fa fa-list-alt" />
                                                    {translate(`menu.training_plan`)}
                                                </a>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            }

                            {/* kpi-management */}
                            {
                                (this.checkURL('/kpi-units/create', links) === true || this.checkURL('/kpi-units/overview', links) === true || this.checkURL('/kpi-personals/create', links) === true || this.checkURL('/kpi-personals/overview', links) === true) &&
                                <li className="treeview">
                                    <a href="#abc">
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
                            {/* {
                                this.checkURL('/notifications', links) === true &&
                                <Item
                                    key='notifications'
                                    name='notifications'
                                    path='/notifications'
                                    icon='fa fa-bell'
                                />
                            } */}
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
