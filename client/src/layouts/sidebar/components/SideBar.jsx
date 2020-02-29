import React, { Component } from 'react';
import Item from './Item';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';

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
                                <Link to="#abc"><i className="fa fa-circle text-success" /> Online</Link>
                            </div>
                        </div> */}
                        {/* <form action="#" method="get" className="sidebar-form">
                            <div className="input-group">
                                <input type="text" name="q" className="form-control" placeholder="Search" />
                                <span className="input-group-btn">
                                    <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search" />
                                    </button>
                                </span>
                            </div>
                        </form> */}
                        <ul className="sidebar-menu" data-widget="tree">
                            <li className="header">MENU</li>
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
                                (this.checkURL('/dashboard-employee', links) === true || this.checkURL('/add-employee', links) === true || this.checkURL('/list-employee', links) === true ||
                                    this.checkURL('/salary-employee', links) === true || this.checkURL('/time-keeping', links) === true ||
                                    this.checkURL('/discipline', links) === true || this.checkURL('/sabbatical', links) === true) &&
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-address-book" /> <span>{translate(`menu.manage_employee`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {this.checkURL('/dashboard-employee', links) === true &&
                                            <li><Link to="/dashboard-employee"><i className="fa fa-dashboard" />{translate(`menu.dashboard_employee`)}</Link></li>
                                        }
                                        {this.checkURL('/add-employee', links) === true &&
                                            <li><Link to="/add-employee"><i className="fa fa-user-plus" />{translate(`menu.add_employee`)}</Link></li>
                                        }
                                        {this.checkURL('/list-employee', links) === true &&
                                            <li><Link to="/list-employee"><i className="fa fa-address-card" />{translate(`menu.list_employee`)}</Link></li>
                                        }
                                        {this.checkURL('/salary-employee', links) === true &&
                                            <li><Link to="/salary-employee"><i className="fa fa-line-chart" />{translate(`menu.salary_employee`)}</Link></li>
                                        }
                                        {this.checkURL('/time-keeping', links) === true &&
                                            <li><Link to="/time-keeping"><i className="fa fa-calculator" />{translate(`menu.time_keeping`)}</Link></li>
                                        }
                                        {this.checkURL('/discipline', links) === true &&
                                            <li><Link to="/discipline"><i className="fa fa-balance-scale" />{translate(`menu.discipline`)}</Link></li>
                                        }
                                        {this.checkURL('/sabbatical', links) === true &&
                                            <li><Link to="/sabbatical"><i className="fa fa-calendar-times-o" />{translate(`menu.sabbatical`)}</Link></li>
                                        }
                                    </ul>
                                </li>
                            }
                            {
                                (this.checkURL('/detail-employee', links) === true || this.checkURL('/update-employee', links) === true) &&
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-user-circle" /> <span>{translate(`menu.account`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {this.checkURL('/detail-employee', links) === true &&
                                            <li><Link to="/detail-employee"><i className="fa fa-user-o" />{translate(`menu.detail_employee`)}</Link></li>
                                        }
                                        {this.checkURL('/update-employee', links) === true &&
                                            <li><Link to="/update-employee"><i className="fa fa-pencil-square-o" />{translate(`menu.update_employee`)}</Link></li>
                                        }
                                    </ul>
                                </li>
                            }
                            {
                                (this.checkURL('/list-course', links) === true || this.checkURL('/training-plan', links) === true) &&
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-graduation-cap" /> <span>{translate(`menu.manage_training`)}</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        {this.checkURL('/list-course', links) === true &&
                                            <li><Link to="/list-course"><i className="fa fa-university" />{translate(`menu.list_course`)}</Link></li>
                                        }
                                        {this.checkURL('/training-plan', links) === true &&
                                            <li><Link to="/training-plan"><i className="fa fa-list-alt" />{translate(`menu.training_plan`)}</Link></li>
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
